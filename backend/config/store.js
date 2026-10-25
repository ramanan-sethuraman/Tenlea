const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const {
  isFirestoreReady,
  getDb,
  sanitizeForFirestore,
  parseFromFirestore,
  PROJECT_ID,
} = require('./firebase');

// Data Collections (in-memory cache synced with Cloud Firestore)
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

    // Persist to Cloud Firestore if connected
    if (isFirestoreReady()) {
      const db = getDb();
      if (db && doc._id) {
        try {
          await db.collection(collectionName)
            .doc(doc._id.toString())
            .set(sanitizeForFirestore(doc), { merge: true });
        } catch (err) {
          console.error(`[Firestore Save Error in ${collectionName}/${doc._id}]:`, err.message);
        }
      }
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

      // Sync to Cloud Firestore
      if (isFirestoreReady()) {
        const db = getDb();
        if (db && strId) {
          try {
            await db.collection(collectionName)
              .doc(strId)
              .set(sanitizeForFirestore(updatedDoc), { merge: true });
          } catch (err) {
            console.error(`[Firestore Update Error in ${collectionName}/${strId}]:`, err.message);
          }
        }
      }

      return wrapDoc(collectionName, options.new !== false ? updatedDoc : oldDoc, customMethods);
    },

    async findByIdAndDelete(id) {
      const strId = id?.toString();
      const index = collections[collectionName].findIndex((item) => item._id?.toString() === strId);
      if (index === -1) return null;
      const removed = collections[collectionName].splice(index, 1)[0];

      // Sync to Cloud Firestore
      if (isFirestoreReady()) {
        const db = getDb();
        if (db && strId) {
          try {
            await db.collection(collectionName)
              .doc(strId)
              .delete();
          } catch (err) {
            console.error(`[Firestore Delete Error in ${collectionName}/${strId}]:`, err.message);
          }
        }
      }

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

        // Sync to Cloud Firestore
        if (isFirestoreReady()) {
          const db = getDb();
          if (db) {
            try {
              await db.collection(collectionName)
                .doc(doc._id.toString())
                .set(sanitizeForFirestore(doc));
            } catch (err) {
              console.error(`[Firestore Create Error in ${collectionName}/${doc._id}]:`, err.message);
            }
          }
        }

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
        const allIds = collections[collectionName].map((d) => d._id?.toString()).filter(Boolean);
        collections[collectionName] = [];

        if (isFirestoreReady()) {
          const db = getDb();
          if (db && allIds.length > 0) {
            const batch = db.batch();
            allIds.forEach((id) => batch.delete(db.collection(collectionName).doc(id)));
            batch.commit().catch((err) => console.error(`[Firestore Batch Delete Error]:`, err.message));
          }
        }

        return { deletedCount: count };
      }

      const toDelete = collections[collectionName].filter((item) => matchQuery(item, query));
      const keep = collections[collectionName].filter((item) => !matchQuery(item, query));
      const deletedCount = toDelete.length;
      collections[collectionName] = keep;

      if (isFirestoreReady()) {
        const db = getDb();
        if (db && toDelete.length > 0) {
          const batch = db.batch();
          toDelete.forEach((doc) => {
            if (doc._id) {
              batch.delete(db.collection(collectionName).doc(doc._id.toString()));
            }
          });
          batch.commit().catch((err) => console.error(`[Firestore Batch Delete Error]:`, err.message));
        }
      }

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

// Pre-seed Demo Dataset Immediately on Load for local fallback
const seedInitialData = () => {
  const adminId = '6adc5b6d2ce035b95820c160';

  if (!collections.users.some((u) => u._id === adminId)) {
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
  }
};

// Seed immediately on startup
seedInitialData();

/**
 * Initialize and synchronize in-memory collections with Cloud Firestore
 */
const initDatabase = async () => {
  if (!isFirestoreReady()) {
    console.log(`ℹ️ [Database Engine]: Operating with in-memory store. Cloud Firestore (project "${PROJECT_ID}") will sync once serviceAccountKey.json is placed in backend/config/`);
    return true;
  }

  try {
    const db = getDb();
    console.log(`🔄 [Database Engine]: Connecting & synchronizing with Cloud Firestore (Project: "${PROJECT_ID}")...`);

    const collectionNames = Object.keys(collections);
    let totalLoaded = 0;

    for (const colName of collectionNames) {
      const snap = await db.collection(colName).get();
      if (!snap.empty) {
        collections[colName] = [];
        snap.forEach((docSnap) => {
          const doc = parseFromFirestore(docSnap);
          if (doc) {
            collections[colName].push(doc);
            totalLoaded++;
          }
        });
        console.log(`   📦 [Firestore] Collection "${colName}": ${snap.size} records`);
      }
    }

    console.log(`✅ [Database Engine]: Loaded ${totalLoaded} record(s) from Cloud Firestore.`);

    // If users collection in Firestore is empty, seed the official super admin
    if (collections.users.length === 0) {
      const adminId = '6adc5b6d2ce035b95820c160';
      const adminUser = {
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
      };
      collections.users.push(adminUser);
      await db.collection('users').doc(adminId).set(sanitizeForFirestore(adminUser));
      console.log(`👑 [Database Engine]: Seeded TENLEA Super Admin account in Cloud Firestore.`);
    }

    return true;
  } catch (err) {
    console.error(`[Database Engine Sync Error]:`, err.message);
    return false;
  }
};

module.exports = {
  collections,
  createModel,
  generateId,
  seedInitialData,
  initDatabase,
};
