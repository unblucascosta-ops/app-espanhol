// Wrapper mínimo de IndexedDB com Promises.

export const DB_NAME = 'espanol-madrid';
export const DB_VERSION = 1;

// Para adicionar um novo "store" no futuro: aumente DB_VERSION e trate em upgrade().
export const STORES = {
  cards: { keyPath: 'id', indexes: { state: 'state', due: 'due', lessonId: 'lessonId' } },
  reviews: { keyPath: 'id', autoIncrement: true, indexes: { ts: 'ts', cardId: 'cardId' } },
  days: { keyPath: 'day' },
  kv: { keyPath: 'key' },
  texts: { keyPath: 'id' },
  journal: { keyPath: 'id' },
  words: { keyPath: 'word' },
};

let dbPromise = null;

function upgrade(db) {
  for (const [name, def] of Object.entries(STORES)) {
    if (db.objectStoreNames.contains(name)) continue;
    const store = db.createObjectStore(name, { keyPath: def.keyPath, autoIncrement: !!def.autoIncrement });
    for (const [idx, path] of Object.entries(def.indexes || {})) store.createIndex(idx, path);
  }
}

export function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => upgrade(req.result);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

const promisify = (req) =>
  new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

async function withStore(name, mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(name, mode);
    const store = tx.objectStore(name);
    let result;
    Promise.resolve(fn(store)).then((r) => (result = r), reject);
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export const get = (name, key) => withStore(name, 'readonly', (s) => promisify(s.get(key)));
export const getAll = (name) => withStore(name, 'readonly', (s) => promisify(s.getAll()));
export const put = (name, value) => withStore(name, 'readwrite', (s) => promisify(s.put(value)));
export const del = (name, key) => withStore(name, 'readwrite', (s) => promisify(s.delete(key)));
export const clear = (name) => withStore(name, 'readwrite', (s) => promisify(s.clear()));
export const count = (name) => withStore(name, 'readonly', (s) => promisify(s.count()));

export function putMany(name, values) {
  return withStore(name, 'readwrite', (s) => {
    for (const v of values) s.put(v);
  });
}

export function getAllByIndex(name, index, query) {
  return withStore(name, 'readonly', (s) => promisify(s.index(index).getAll(query)));
}

/** Escreve em vários stores numa única transação: ops = [{ store, value }] */
export async function putAcross(ops) {
  const db = await openDB();
  const names = [...new Set(ops.map((o) => o.store))];
  return new Promise((resolve, reject) => {
    const tx = db.transaction(names, 'readwrite');
    for (const o of ops) tx.objectStore(o.store).put(o.value);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
