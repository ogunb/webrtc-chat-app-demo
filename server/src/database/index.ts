import Datastore, { UpdateOptions, RemoveOptions } from "nedb";

const dbList: { [x: string]: Datastore } = {};

export function createDB(dbName: string): Datastore {
  const db = new Datastore();
  dbList[dbName] = db;

  return db;
}

export function getDB(dbName: string): Datastore {
  return dbList[dbName];
}

export function readDoc(db: Datastore, query: any): Promise<any> {
  return new Promise((resolve, reject) => {
    db.find(query, function (err: Error, doc: any) {
      if (err) {
        return reject(err);
      }

      resolve(doc);
    });
  });
}

export function insertDoc(db: Datastore, doc: any): Promise<any> {
  return new Promise((resolve, reject) => {
    db.insert(doc, function (err: Error, newDoc: any) {
      if (err) {
        return reject(err);
      }

      resolve(newDoc);
    });
  });
}

export function updateDoc(
  db: Datastore,
  query: string,
  update: any,
  options: UpdateOptions = {}
): Promise<any> {
  return new Promise((resolve, reject) => {
    db.update(query, update, options, function (err: Error, updatedDoc: any) {
      if (err) {
        return reject(err);
      }

      resolve(updatedDoc);
    });
  });
}

export function deleteDoc(
  db: Datastore,
  query: string,
  options: RemoveOptions = {}
): Promise<number> {
  return new Promise((resolve, reject) => {
    db.remove(query, options, function (err: Error, deletedDocsCount: any) {
      if (err) {
        return reject(err);
      }

      resolve(deletedDocsCount);
    });
  });
}
