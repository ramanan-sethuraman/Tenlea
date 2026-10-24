const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// In-Memory Data Collections (Zero external database dependency)
const collections = {
  users: [],
  lands: [],
  parkingspaces: [],
  vehicles: [],
  bookings: [],
  agreements: [],
  payments: [],
  kycs: [],
  disputes: [],
  notifications: [],
  reviews: [],
};

// Generate standard 24-character hexadecimal IDs
const generateId = () => {
  return crypto.randomBytes(12).toString('hex');
};

// Map populate field name to collection
const getCollectionForRef = (refField) => {
  const map = {
    landownerId: 'users',
    vehicleOwnerId: 'users',
    userId: 'users',
    reviewedBy: 'users',
    ownerId: 'users',
    landId: 'lands',
    parkingSpaceId: 'parkingspaces',
    vehicleId: 'vehicles',
    bookingId: 'bookings',
  };
  return map[refField] || null;
};

// Evaluate query filters
const matchQuery = (item, query) => {
  if (!query || Object.keys(query).length === 0) return true;

  for (const [key, val] of Object.entries(query)) {
    if (key === '$or') {
      if (!Array.isArray(val) || !val.some((subQuery) => matchQuery(item, subQuery))) return false;
      continue;
    }
    if (key === '$and') {
      if (!Array.isArray(val) || !val.every((subQuery) => matchQuery(item, subQuery))) return false;
      continue;
    }

    const itemVal = item[key];

    if (val && typeof val === 'object' && !(val instanceof Date)) {
      if (val.$in && Array.isArray(val.$in)) {
        const strIn = val.$in.map((v) => v?.toString());
        if (!strIn.includes(itemVal?.toString())) return false;
        continue;
      }
      if (val.$nin && Array.isArray(val.$nin)) {
        const strNin = val.$nin.map((v) => v?.toString());
        if (strNin.includes(itemVal?.toString())) return false;
        continue;
      }
      if (
        val.$lte !== undefined ||
        val.$gte !== undefined ||
        val.$lt !== undefined ||
        val.$gt !== undefined
      ) {
        const compVal = itemVal instanceof Date ? itemVal.getTime() : itemVal;
        if (val.$lte !== undefined && compVal > (val.$lte instanceof Date ? val.$lte.getTime() : val.$lte)) return false;
        if (val.$gte !== undefined && compVal < (val.$gte instanceof Date ? val.$gte.getTime() : val.$gte)) return false;
        if (val.$lt !== undefined && compVal >= (val.$lt instanceof Date ? val.$lt.getTime() : val.$lt)) return false;
        if (val.$gt !== undefined && compVal <= (val.$gt instanceof Date ? val.$gt.getTime() : val.$gt)) return false;
        continue;
      }
    }

    if (val?.toString() !== itemVal?.toString()) {
      return false;
    }
  }

  return true;
};

// Wrap raw data document with helper methods like save()
const wrapDoc = (collectionName, data, customMethods = {}) => {
  if (!data) return null;
  const doc = { ...data };

  doc.save = async function () {
    doc.updatedAt = new Date();
    const index = collections[collectionName].findIndex((x) => x._id?.toString() === doc._id?.toString());
    if (index !== -1) {
      collections[collectionName][index] = { ...doc };
    } else {
      collections[collectionName].push({ ...doc });
    }
    return wrapDoc(collectionName, doc, customMethods);
  };

  for (const [methodName, fn] of Object.entries(customMethods)) {
    doc[methodName] = fn.bind(doc);
  }

  return doc;
};

// Query Builder with chainable methods
class Query {
  constructor(collectionName, items, isSingle = false, customMethods = {}) {
    this.collectionName = collectionName;
    this.items = items;
    this.isSingle = isSingle;
    this.customMethods = customMethods;
    this._selectFields = null;
    this._sortObj = null;
    this._limit = null;
    this._skip = null;
    this._populates = [];
  }

  select(fields) {
    this._selectFields = fields;
    return this;
  }

  populate(paths, select) {
    this._populates.push({ paths, select });
    return this;
  }

  sort(sortObj) {
    this._sortObj = sortObj;
    return this;
  }

  limit(n) {
    this._limit = n;
    return this;
  }

  skip(n) {
    this._skip = n;
    return this;
  }

  async exec() {
    let result = this.items.map((item) => ({ ...item }));

    if (this._sortObj) {
      const keys = Object.keys(this._sortObj);
      result.sort((a, b) => {
        for (const k of keys) {
          const dir = this._sortObj[k] === -1 || this._sortObj[k] === 'desc' ? -1 : 1;
          if (a[k] < b[k]) return -1 * dir;
          if (a[k] > b[k]) return 1 * dir;
        }
        return 0;
      });
    }

    if (this._skip) {
      result = result.slice(this._skip);
    }
    if (this._limit) {
      result = result.slice(0, this._limit);
    }

    // Populate references
    for (const pop of this._populates) {
      const pathList =
        typeof pop.paths === 'string'
          ? pop.paths.split(/\s+/)
          : Array.isArray(pop.paths)
          ? pop.paths
          : [pop.paths];

      for (const p of pathList) {
        for (const item of result) {
          const refId = item[p];
          if (refId) {
            const targetColl = getCollectionForRef(p);
            if (targetColl) {
              const strRefId = (refId._id || refId).toString();
              const found = collections[targetColl]?.find((x) => x._id?.toString() === strRefId);
              if (found) {
                if (pop.select) {
                  const allowed = pop.select.split(/\s+/);
                  const filtered = { _id: found._id };
                  allowed.forEach((f) => {
                    if (found[f] !== undefined) filtered[f] = found[f];
                  });
                  item[p] = filtered;
                } else {
                  item[p] = { ...found };
                }
              }
            }
          }
        }
      }
    }

    if (this.isSingle) {
      return result.length > 0 ? wrapDoc(this.collectionName, result[0], this.customMethods) : null;
    }

    return result.map((doc) => wrapDoc(this.collectionName, doc, this.customMethods));
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }

  catch(reject) {
    return this.exec().catch(reject);
  }
}

// Create Model factory
const createModel = (modelName, defaultSchema = {}, customMethods = {}) => {
  const collectionName = modelName.toLowerCase() + 's';
  if (!collections[collectionName]) {
    collections[collectionName] = [];
  }

  return {
    find(query = {}) {
      const matched = collections[collectionName].filter((item) => matchQuery(item, query));
      return new Query(collectionName, matched, false, customMethods);
    },

    findOne(query = {}) {
      const matched = collections[collectionName].filter((item) => matchQuery(item, query));
      return new Query(collectionName, matched, true, customMethods);
    },

    findById(id) {
      const strId = id?.toString();
      const matched = collections[collectionName].filter((item) => item._id?.toString() === strId);
      return new Query(collectionName, matched, true, customMethods);
    },

    async findByIdAndUpdate(id, update = {}, options = {}) {
      const strId = id?.toString();
      const index = collections[collectionName].findIndex((item) => item._id?.toString() === strId);
      if (index === -1) return null;

      const oldDoc = collections[collectionName][index];
      const fieldsToUpdate = update.$set ? { ...update.$set } : { ...update };
      delete fieldsToUpdate.$set;

      const updatedDoc = {
        ...oldDoc,
        ...fieldsToUpdate,
        updatedAt: new Date(),
      };
      collections[collectionName][index] = updatedDoc;
      return wrapDoc(collectionName, options.new !== false ? updatedDoc : oldDoc, customMethods);
    },

    async findByIdAndDelete(id) {
      const strId = id?.toString();
      const index = collections[collectionName].findIndex((item) => item._id?.toString() === strId);
      if (index === -1) return null;
      const removed = collections[collectionName].splice(index, 1)[0];
      return wrapDoc(collectionName, removed, customMethods);
    },

    async create(docOrArray) {
      const items = Array.isArray(docOrArray) ? docOrArray : [docOrArray];
      const created = [];

      for (const item of items) {
        const id = item._id || generateId();
        let passwordHash = item.password;
        if (item.password && typeof item.password === 'string' && !item.password.startsWith('$2')) {
          passwordHash = bcrypt.hashSync(item.password, 10);
        }

        const doc = {
          _id: id,
          ...defaultSchema,
          ...item,
          ...(passwordHash !== undefined ? { password: passwordHash } : {}),
          createdAt: item.createdAt || new Date(),
          updatedAt: item.updatedAt || new Date(),
        };

        collections[collectionName].push(doc);
        created.push(wrapDoc(collectionName, doc, customMethods));
      }

      return Array.isArray(docOrArray) ? created : created[0];
    },

    async countDocuments(query = {}) {
      return collections[collectionName].filter((item) => matchQuery(item, query)).length;
    },

    async deleteMany(query = {}) {
      if (!query || Object.keys(query).length === 0) {
        const count = collections[collectionName].length;
        collections[collectionName] = [];
        return { deletedCount: count };
      }
      const keep = collections[collectionName].filter((item) => !matchQuery(item, query));
      const deletedCount = collections[collectionName].length - keep.length;
      collections[collectionName] = keep;
      return { deletedCount };
    },

    async aggregate(pipeline = []) {
      let data = [...collections[collectionName]];

      for (const stage of pipeline) {
        if (stage.$match) {
          data = data.filter((item) => matchQuery(item, stage.$match));
        }
        if (stage.$group) {
          const { _id, ...fields } = stage.$group;
          const resultObj = { _id };

          for (const [k, v] of Object.entries(fields)) {
            if (v.$sum) {
              const fieldName = typeof v.$sum === 'string' && v.$sum.startsWith('$') ? v.$sum.slice(1) : null;
              if (fieldName) {
                resultObj[k] = data.reduce((sum, item) => sum + (Number(item[fieldName]) || 0), 0);
              } else if (typeof v.$sum === 'number') {
                resultObj[k] = data.length * v.$sum;
              }
            }
          }

          data = [resultObj];
        }
      }

      return data;
    },
  };
};

// Pre-seed Demo Dataset Immediately on Load
const seedInitialData = () => {
  // 1. Users
  const adminId = '6adc5b6d2ce035b95820c160';
  const landowner1Id = '6adc5b6d2ce035b95820c161';
  const landowner2Id = '6adc5b6d2ce035b95820c162';
  const driver1Id = '6adc5b6d2ce035b95820c163';
  const driver2Id = '6adc5b6d2ce035b95820c164';

  collections.users = [
    {
      _id: adminId,
      name: 'TENLEA Super Admin',
      email: 'admin@tenlea',
      phone: '+91 98765 00001',
      password: bcrypt.hashSync('admin28', 10),
      role: 'ADMIN',
      kycStatus: 'VERIFIED',
      accountStatus: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: landowner1Id,
      name: 'Sanjay Kumar',
      email: 'sanjay@landowner.com',
      phone: '+91 98765 11111',
      password: bcrypt.hashSync('password123', 10),
      role: 'LANDOWNER',
      kycStatus: 'VERIFIED',
      accountStatus: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: landowner2Id,
      name: 'Ananya Sharma',
      email: 'ananya@landowner.com',
      phone: '+91 98765 22222',
      password: bcrypt.hashSync('password123', 10),
      role: 'LANDOWNER',
      kycStatus: 'VERIFIED',
      accountStatus: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: driver1Id,
      name: 'Rahul Dravid',
      email: 'rahul@driver.com',
      phone: '+91 98765 33333',
      password: bcrypt.hashSync('password123', 10),
      role: 'VEHICLE_OWNER',
      kycStatus: 'VERIFIED',
      accountStatus: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: driver2Id,
      name: 'Priya Patel',
      email: 'priya@driver.com',
      phone: '+91 98765 44444',
      password: bcrypt.hashSync('password123', 10),
      role: 'VEHICLE_OWNER',
      kycStatus: 'VERIFIED',
      accountStatus: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // 2. Lands
  const land1Id = '6adc5b6d2ce035b95820c171';
  const land2Id = '6adc5b6d2ce035b95820c172';

  collections.lands = [
    {
      _id: land1Id,
      landownerId: landowner1Id,
      title: 'Indiranagar Prime Vacant Plot',
      description: 'Fully gated 4,000 sq ft paved land in Indiranagar 100ft road. 24/7 CCTV, electric gate access, lighting, and security guard on duty.',
      address: '100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560038',
      latitude: 12.9784,
      longitude: 77.6408,
      totalArea: '4,000 sq ft',
      availableArea: '3,200 sq ft',
      amenities: ['CCTV 24/7', 'Gated Security', 'Covered Roof', 'EV Charging', 'Paved Surface'],
      verificationStatus: 'VERIFIED',
      images: ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: land2Id,
      landownerId: landowner2Id,
      title: 'Koramangala Commercial Corner Land',
      description: 'Spacious secured open compound near Forum Mall Koramangala. Ideal for cars, SUVs, and long-term vehicle storage.',
      address: '5th Block, Koramangala',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560095',
      latitude: 12.9352,
      longitude: 77.6245,
      totalArea: '6,500 sq ft',
      availableArea: '5,000 sq ft',
      amenities: ['CCTV 24/7', 'Gated Security', 'Night Lighting', 'Water Wash Available'],
      verificationStatus: 'VERIFIED',
      images: ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // 3. Parking Spaces
  const space1Id = '6adc5b6d2ce035b95820c181';
  const space2Id = '6adc5b6d2ce035b95820c182';

  collections.parkingspaces = [
    {
      _id: space1Id,
      landId: land1Id,
      landownerId: landowner1Id,
      title: 'Indiranagar Covered Sedan Bay A-1',
      description: 'Premium covered sedan/SUV slot with dedicated EV charger point.',
      spaceSize: 'Standard Car / Sedan',
      vehicleTypesAllowed: ['4-Wheeler Car', 'SUV'],
      pricePerDay: 250,
      pricePerMonth: 4500,
      amenities: ['CCTV 24/7', 'Covered Roof', 'Gated Security', 'EV Charging'],
      availabilityStatus: 'AVAILABLE',
      verificationStatus: 'APPROVED',
      images: ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: space2Id,
      landId: land2Id,
      landownerId: landowner2Id,
      title: 'Koramangala Open SUV Bay B-3',
      description: 'Extra-wide SUV parking slot in 24/7 secured perimeter compound.',
      spaceSize: 'Large SUV / Truck',
      vehicleTypesAllowed: ['SUV', '4-Wheeler Car'],
      pricePerDay: 300,
      pricePerMonth: 5500,
      amenities: ['CCTV 24/7', 'Gated Security', 'Night Lighting'],
      availabilityStatus: 'AVAILABLE',
      verificationStatus: 'APPROVED',
      images: ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // 4. Vehicles
  const vehicle1Id = '6adc5b6d2ce035b95820c191';
  collections.vehicles = [
    {
      _id: vehicle1Id,
      ownerId: driver1Id,
      vehicleNumber: 'KA-01-MJ-8899',
      brand: 'Hyundai',
      model: 'Creta 1.5 SX',
      vehicleType: '4-Wheeler Car / SUV',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // 5. Bookings
  const booking1Id = '6adc5b6d2ce035b95820c201';
  collections.bookings = [
    {
      _id: booking1Id,
      parkingSpaceId: space1Id,
      landownerId: landowner1Id,
      vehicleOwnerId: driver1Id,
      vehicleId: vehicle1Id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      durationDays: 30,
      totalAmount: 4500,
      paymentStatus: 'PAID',
      bookingStatus: 'ACTIVE',
      qrCode: 'TENLEA-QR-BOOKING-8899-2026',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // 6. Agreements
  collections.agreements = [
    {
      _id: '6adc5b6d2ce035b95820c211',
      bookingId: booking1Id,
      landownerId: landowner1Id,
      vehicleOwnerId: driver1Id,
      vehicleId: vehicle1Id,
      parkingSpaceId: space1Id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      amount: 4500,
      terms: 'Standard TENLEA digital lease terms apply. 30-day notice required for cancellation.',
      landownerAccepted: true,
      vehicleOwnerAccepted: true,
      status: 'ACCEPTED_BY_BOTH',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // 7. Payments
  collections.payments = [
    {
      _id: '6adc5b6d2ce035b95820c221',
      bookingId: booking1Id,
      payerId: driver1Id,
      payeeId: landowner1Id,
      amount: 4500,
      platformFee: 450,
      landownerPayout: 4050,
      status: 'SUCCESS',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
};

// Run initial seed immediately
seedInitialData();

module.exports = {
  collections,
  createModel,
  generateId,
  seedInitialData,
};

