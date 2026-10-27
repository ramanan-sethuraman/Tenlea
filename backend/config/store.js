const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Generate standard 24-character hexadecimal IDs
const generateId = () => {
  return new mongoose.Types.ObjectId().toString();
};

// Map populate field name to collection / Model
const refMap = {
  landownerId: 'User',
  vehicleOwnerId: 'User',
  userId: 'User',
  reviewedBy: 'User',
  ownerId: 'User',
  payerId: 'User',
  receiverId: 'User',
  raisedBy: 'User',
  resolvedBy: 'User',
  targetUserId: 'User',
  landId: 'Land',
  parkingSpaceId: 'ParkingSpace',
  vehicleId: 'Vehicle',
  bookingId: 'Booking',
};

// In-Memory Data Collections (Fallback when MongoDB is offline)
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

// Map populate field name to collection for in-memory fallback
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

// Evaluate query filters for in-memory fallback
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

// In-Memory Query Builder
class InMemoryQuery {
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

// In-Memory Model Fallback Factory
const createInMemoryModel = (modelName, defaultSchema = {}, customMethods = {}) => {
  const collectionName = modelName.toLowerCase() + 's';
  if (!collections[collectionName]) {
    collections[collectionName] = [];
  }

  return {
    find(query = {}) {
      const matched = collections[collectionName].filter((item) => matchQuery(item, query));
      return new InMemoryQuery(collectionName, matched, false, customMethods);
    },

    findOne(query = {}) {
      const matched = collections[collectionName].filter((item) => matchQuery(item, query));
      return new InMemoryQuery(collectionName, matched, true, customMethods);
    },

    findById(id) {
      const strId = id?.toString();
      const matched = collections[collectionName].filter((item) => item._id?.toString() === strId);
      return new InMemoryQuery(collectionName, matched, true, customMethods);
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

// Build Mongoose Schema dynamically
function buildMongooseSchema(modelName, defaultSchema = {}, customMethods = {}) {
  const fields = {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  };

  for (const [key, val] of Object.entries(defaultSchema)) {
    if (refMap[key]) {
      fields[key] = { type: String, ref: refMap[key], default: null };
    } else if (Array.isArray(val)) {
      fields[key] = { type: [mongoose.Schema.Types.Mixed], default: val };
    } else if (typeof val === 'number') {
      fields[key] = { type: Number, default: val };
    } else if (typeof val === 'boolean') {
      fields[key] = { type: Boolean, default: val };
    } else if (val instanceof Date) {
      fields[key] = { type: Date, default: null };
    } else if (key === 'email') {
      fields[key] = { type: String, trim: true, lowercase: true, default: '' };
    } else {
      fields[key] = { type: String, default: val || '' };
    }
  }

  const schema = new mongoose.Schema(fields, {
    timestamps: true,
    strict: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  });

  // Attach custom methods
  for (const [name, fn] of Object.entries(customMethods)) {
    schema.methods[name] = fn;
  }

  // Pre-save hook for User password hashing
  if (modelName === 'User') {
    schema.pre('save', async function () {
      if (this.isModified('password') && this.password && typeof this.password === 'string' && !this.password.startsWith('$2')) {
        this.password = await bcrypt.hash(this.password, 10);
      }
    });
  }

  return schema;
}

// Master Create Model - Uses MongoDB / Mongoose when configured, with seamless in-memory fallback
const createModel = (modelName, defaultSchema = {}, customMethods = {}) => {
  const inMemModel = createInMemoryModel(modelName, defaultSchema, customMethods);

  // Register schema with Mongoose
  let mongooseModel = mongoose.models[modelName];
  if (!mongooseModel) {
    try {
      const schema = buildMongooseSchema(modelName, defaultSchema, customMethods);
      mongooseModel = mongoose.model(modelName, schema);
    } catch (e) {
      mongooseModel = mongoose.models[modelName] || null;
    }
  }

  // Unified Hybrid Model Interface (Online Atlas + Offline Resilient)
  return {
    find(query = {}) {
      if (mongoose.connection.readyState === 1 && mongooseModel) {
        try {
          const q = mongooseModel.find(query);
          const origExec = q.exec.bind(q);
          q.exec = async function () {
            try {
              return await origExec();
            } catch (err) {
              console.warn(`[Hybrid ${modelName}.find fallback]:`, err.message);
              return inMemModel.find(query).exec();
            }
          };
          return q;
        } catch (e) {
          console.warn(`[Hybrid ${modelName}.find note]:`, e.message);
        }
      }
      return inMemModel.find(query);
    },

    findOne(query = {}) {
      if (mongoose.connection.readyState === 1 && mongooseModel) {
        try {
          const q = mongooseModel.findOne(query);
          const origExec = q.exec.bind(q);
          q.exec = async function () {
            try {
              return await origExec();
            } catch (err) {
              console.warn(`[Hybrid ${modelName}.findOne fallback]:`, err.message);
              return inMemModel.findOne(query).exec();
            }
          };
          return q;
        } catch (e) {
          console.warn(`[Hybrid ${modelName}.findOne note]:`, e.message);
        }
      }
      return inMemModel.findOne(query);
    },

    findById(id) {
      if (mongoose.connection.readyState === 1 && mongooseModel) {
        try {
          const q = mongooseModel.findById(id);
          const origExec = q.exec.bind(q);
          q.exec = async function () {
            try {
              return await origExec();
            } catch (err) {
              console.warn(`[Hybrid ${modelName}.findById fallback]:`, err.message);
              return inMemModel.findById(id).exec();
            }
          };
          return q;
        } catch (e) {
          console.warn(`[Hybrid ${modelName}.findById note]:`, e.message);
        }
      }
      return inMemModel.findById(id);
    },

    async findByIdAndUpdate(id, update = {}, options = {}) {
      if (mongoose.connection.readyState === 1 && mongooseModel) {
        try {
          return await mongooseModel.findByIdAndUpdate(id, update, options);
        } catch (e) {
          console.warn(`[Hybrid ${modelName}.findByIdAndUpdate fallback]:`, e.message);
        }
      }
      return inMemModel.findByIdAndUpdate(id, update, options);
    },

    async findByIdAndDelete(id) {
      if (mongoose.connection.readyState === 1 && mongooseModel) {
        try {
          return await mongooseModel.findByIdAndDelete(id);
        } catch (e) {
          console.warn(`[Hybrid ${modelName}.findByIdAndDelete fallback]:`, e.message);
        }
      }
      return inMemModel.findByIdAndDelete(id);
    },

    async create(docOrArray) {
      try {
        await inMemModel.create(docOrArray);
      } catch (err) {
        // Non-fatal memory sync
      }

      if (mongoose.connection.readyState === 1 && mongooseModel) {
        try {
          return await mongooseModel.create(docOrArray);
        } catch (e) {
          console.warn(`[Hybrid ${modelName}.create fallback]:`, e.message);
        }
      }
      return inMemModel.create(docOrArray);
    },

    async countDocuments(query = {}) {
      if (mongoose.connection.readyState === 1 && mongooseModel) {
        try {
          return await mongooseModel.countDocuments(query);
        } catch (e) {
          console.warn(`[Hybrid ${modelName}.countDocuments fallback]:`, e.message);
        }
      }
      return inMemModel.countDocuments(query);
    },

    async deleteMany(query = {}) {
      if (mongoose.connection.readyState === 1 && mongooseModel) {
        try {
          return await mongooseModel.deleteMany(query);
        } catch (e) {
          console.warn(`[Hybrid ${modelName}.deleteMany fallback]:`, e.message);
        }
      }
      return inMemModel.deleteMany(query);
    },

    async aggregate(pipeline = []) {
      if (mongoose.connection.readyState === 1 && mongooseModel) {
        try {
          return await mongooseModel.aggregate(pipeline);
        } catch (e) {
          console.warn(`[Hybrid ${modelName}.aggregate fallback]:`, e.message);
        }
      }
      return inMemModel.aggregate(pipeline);
    },
  };
};

// Pre-seed Demo Admin in Memory fallback
const seedInitialData = () => {
  const adminId = '6adc5b6d2ce035b95820c160';
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
  ];
};

// Auto-seed persistent Super Admin into MongoDB Atlas
const seedMongoDBAdmin = async () => {
  try {
    const User = mongoose.models.User;
    if (!User) return;

    const existingAdmin = await User.findOne({
      email: { $in: ['admin@tenlea', 'admin@tenlea.com'] },
    });

    if (!existingAdmin) {
      await User.create({
        _id: '6adc5b6d2ce035b95820c160',
        name: 'TENLEA Super Admin',
        email: 'admin@tenlea',
        phone: '+91 98765 00001',
        password: 'admin28', // Will be hashed by pre-save hook
        role: 'ADMIN',
        kycStatus: 'VERIFIED',
        accountStatus: 'ACTIVE',
      });
      console.log('👑 [Seed]: Super Admin provisioned in MongoDB Atlas (admin@tenlea / admin28)');
    }
  } catch (err) {
    console.warn('⚠️ [Seed Note]:', err.message);
  }
};

// Trigger seed when Mongoose connects
mongoose.connection.on('connected', () => {
  seedMongoDBAdmin();
});

// Run initial in-memory seed on module load
seedInitialData();

module.exports = {
  collections,
  createModel,
  generateId,
  seedInitialData,
  seedMongoDBAdmin,
};
