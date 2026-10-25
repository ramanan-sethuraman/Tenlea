const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const {
  isFirestoreReady,
  getDb,
  sanitizeForFirestore,
  parseFromFirestore,
  PROJECT_ID,
} = require('./firebase');

// In-memory cache for fast local lookup & fallback
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

// Generate standard 24-character hexadecimal IDs (Mongoose compatible)
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

// Evaluate query filters (supporting standard MongoDB operators like $or, $and, $in, $gte, $lte, $regex)
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
      if (val.$regex !== undefined) {
        const regex = new RegExp(val.$regex, val.$options || '');
        if (!regex.test(String(itemVal || ''))) return false;
        continue;
      }
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
        const compVal = itemVal instanceof Date ? itemVal.getTime() : Number(itemVal);
        if (val.$lte !== undefined && compVal > (val.$lte instanceof Date ? val.$lte.getTime() : Number(val.$lte))) return false;
        if (val.$gte !== undefined && compVal < (val.$gte instanceof Date ? val.$gte.getTime() : Number(val.$gte))) return false;
        if (val.$lt !== undefined && compVal >= (val.$lt instanceof Date ? val.$lt.getTime() : Number(val.$lt))) return false;
        if (val.$gt !== undefined && compVal <= (val.$gt instanceof Date ? val.$gt.getTime() : Number(val.$gt))) return false;
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
    const strId = doc._id ? doc._id.toString() : generateId();
    doc._id = strId;

    // Persist to Cloud Firestore if connected
    if (isFirestoreReady()) {
      const db = getDb();
      if (db) {
        try {
          await db.collection(collectionName)
            .doc(strId)
            .set(sanitizeForFirestore(doc), { merge: true });
        } catch (err) {
          console.error(`[Firestore Save Error in ${collectionName}/${strId}]:`, err.message);
          throw err;
        }
      }
    }

    // Update in-memory cache
    if (collections[collectionName]) {
      const index = collections[collectionName].findIndex((x) => x._id?.toString() === strId);
      if (index !== -1) {
        collections[collectionName][index] = { ...doc };
      } else {
        collections[collectionName].push({ ...doc });
      }
    }

    return wrapDoc(collectionName, doc, customMethods);
  };

  for (const [methodName, fn] of Object.entries(customMethods)) {
    doc[methodName] = fn.bind(doc);
  }

  return doc;
};

// Helper: Fetch a single document by ID from Firestore or cache
async function getDocById(collectionName, id) {
  if (!id) return null;
  const strId = id?._id ? id._id.toString() : id.toString();

  if (isFirestoreReady()) {
    const db = getDb();
    if (db) {
      try {
        const snap = await db.collection(collectionName).doc(strId).get();
        if (snap.exists) {
          return parseFromFirestore(snap);
        }
        return null;
      } catch (err) {
        console.warn(`[Firestore getDocById Warn]: ${err.message}`);
      }
    }
  }

  return collections[collectionName]?.find((x) => x._id?.toString() === strId) || null;
}

// Helper: Query documents from Cloud Firestore or fallback to cache
async function queryDocs(collectionName, query = {}) {
  if (isFirestoreReady()) {
    const db = getDb();
    if (db) {
      try {
        // Direct ID lookup optimization
        if (query._id) {
          const strId = query._id?._id ? query._id._id.toString() : query._id.toString();
          const snap = await db.collection(collectionName).doc(strId).get();
          if (snap.exists) {
            const doc = parseFromFirestore(snap);
            return matchQuery(doc, query) ? [doc] : [];
          }
          return [];
        }

        // Fetch collection from Cloud Firestore
        const snap = await db.collection(collectionName).get();
        const results = [];
        snap.forEach((docSnap) => {
          const item = parseFromFirestore(docSnap);
          if (item && matchQuery(item, query)) {
            results.push(item);
          }
        });

        // Update in-memory collection cache
        collections[collectionName] = results.map((d) => ({ ...d }));
        return results;
      } catch (err) {
        console.error(`[Firestore queryDocs Error in ${collectionName}]:`, err.message);
      }
    }
  }

  return (collections[collectionName] || []).filter((item) => matchQuery(item, query));
}

// Query Builder with chainable methods
class Query {
  constructor(collectionName, queryObj = {}, isSingle = false, customMethods = {}) {
    this.collectionName = collectionName;
    this.queryObj = queryObj;
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
    let rawItems = [];

    if (this.isSingle && this.queryObj._id) {
      const singleDoc = await getDocById(this.collectionName, this.queryObj._id);
      rawItems = singleDoc && matchQuery(singleDoc, this.queryObj) ? [singleDoc] : [];
    } else {
      rawItems = await queryDocs(this.collectionName, this.queryObj);
    }

    let result = rawItems.map((item) => ({ ...item }));

    // Apply sorting
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

    // Apply skip & limit
    if (this._skip) {
      result = result.slice(this._skip);
    }
    if (this._limit) {
      result = result.slice(0, this._limit);
    }

    // Populate references directly
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
              const found = await getDocById(targetColl, strRefId);
              if (found) {
                if (pop.select) {
                  const allowed = pop.select.split(/\s+/).filter(Boolean);
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

    // Apply field projection
    if (this._selectFields) {
      const fieldList = this._selectFields.split(/\s+/).filter(Boolean);
      const isExclude = fieldList.some((f) => f.startsWith('-'));
      if (isExclude) {
        const excludeKeys = fieldList.filter((f) => f.startsWith('-')).map((f) => f.slice(1));
        result = result.map((doc) => {
          const copy = { ...doc };
          excludeKeys.forEach((k) => delete copy[k]);
          return copy;
        });
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
      return new Query(collectionName, query, false, customMethods);
    },

    findOne(query = {}) {
      return new Query(collectionName, query, true, customMethods);
    },

    findById(id) {
      const strId = id?._id ? id._id.toString() : id?.toString();
      return new Query(collectionName, { _id: strId }, true, customMethods);
    },

    async findByIdAndUpdate(id, update = {}, options = {}) {
      const strId = id?._id ? id._id.toString() : id?.toString();
      if (!strId) return null;

      const existingDoc = await getDocById(collectionName, strId);
      const oldDoc = existingDoc || { _id: strId, ...defaultSchema };

      const fieldsToUpdate = update.$set ? { ...update.$set } : { ...update };
      delete fieldsToUpdate.$set;

      const updatedDoc = {
        ...oldDoc,
        ...fieldsToUpdate,
        _id: strId,
        updatedAt: new Date(),
      };

      // Persist to Cloud Firestore
      if (isFirestoreReady()) {
        const db = getDb();
        if (db) {
          try {
            await db.collection(collectionName)
              .doc(strId)
              .set(sanitizeForFirestore(updatedDoc), { merge: true });
          } catch (err) {
            console.error(`[Firestore Update Error in ${collectionName}/${strId}]:`, err.message);
            throw err;
          }
        }
      }

      // Update in-memory cache
      const index = collections[collectionName].findIndex((item) => item._id?.toString() === strId);
      if (index !== -1) {
        collections[collectionName][index] = updatedDoc;
      } else {
        collections[collectionName].push(updatedDoc);
      }

      return wrapDoc(collectionName, options.new !== false ? updatedDoc : oldDoc, customMethods);
    },

    async findByIdAndDelete(id) {
      const strId = id?._id ? id._id.toString() : id?.toString();
      if (!strId) return null;

      const existingDoc = await getDocById(collectionName, strId);

      // Delete from Cloud Firestore
      if (isFirestoreReady()) {
        const db = getDb();
        if (db) {
          try {
            await db.collection(collectionName).doc(strId).delete();
          } catch (err) {
            console.error(`[Firestore Delete Error in ${collectionName}/${strId}]:`, err.message);
          }
        }
      }

      // Remove from cache
      const index = collections[collectionName].findIndex((item) => item._id?.toString() === strId);
      if (index !== -1) {
        collections[collectionName].splice(index, 1);
      }

      return existingDoc ? wrapDoc(collectionName, existingDoc, customMethods) : null;
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

        // Persist directly to Cloud Firestore
        if (isFirestoreReady()) {
          const db = getDb();
          if (db) {
            try {
              await db.collection(collectionName)
                .doc(doc._id.toString())
                .set(sanitizeForFirestore(doc));
              console.log(`🔥 [Firestore Saved]: Collection "${collectionName}" -> Document "${doc._id}"`);
            } catch (err) {
              console.error(`[Firestore Create Error in ${collectionName}/${doc._id}]:`, err.message);
              throw err;
            }
          }
        }

        // Cache in memory
        const idx = collections[collectionName].findIndex((x) => x._id?.toString() === doc._id.toString());
        if (idx !== -1) {
          collections[collectionName][idx] = doc;
        } else {
          collections[collectionName].push(doc);
        }

        created.push(wrapDoc(collectionName, doc, customMethods));
      }

      return Array.isArray(docOrArray) ? created : created[0];
    },

    async countDocuments(query = {}) {
      const docs = await queryDocs(collectionName, query);
      return docs.length;
    },

    async deleteMany(query = {}) {
      const docs = await queryDocs(collectionName, query);
      const allIds = docs.map((d) => d._id?.toString()).filter(Boolean);

      if (isFirestoreReady()) {
        const db = getDb();
        if (db && allIds.length > 0) {
          const batch = db.batch();
          allIds.forEach((id) => batch.delete(db.collection(collectionName).doc(id)));
          await batch.commit().catch((err) => console.error(`[Firestore Batch Delete Error]:`, err.message));
        }
      }

      collections[collectionName] = collections[collectionName].filter((item) => !matchQuery(item, query));
      return { deletedCount: allIds.length };
    },

    async aggregate(pipeline = []) {
      let data = await queryDocs(collectionName, {});

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

// Seed admin fallback into memory
const seedInitialData = () => {
  const adminId = '6adc5b6d2ce035b95820c160';

  if (!collections.users.some((u) => u._id === adminId)) {
    collections.users.push({
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
    });
  }
};

seedInitialData();

/**
 * Initialize and synchronize in-memory collections with Cloud Firestore
 */
const initDatabase = async () => {
  if (!isFirestoreReady()) {
    console.log(`ℹ️ [Database Engine]: Operating with in-memory store. Cloud Firestore (project "${PROJECT_ID}") will sync once credentials are provided.`);
    return true;
  }

  try {
    const db = getDb();
    console.log(`🔄 [Database Engine]: Synchronizing with Cloud Firestore (Project: "${PROJECT_ID}")...`);

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
