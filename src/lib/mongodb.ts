import {MongoClient} from 'mongodb';
import config from '../../config';

export default class MongoDb {
  static connection;

  static async connect() {
    if (MongoDb.connection) {
      return MongoDb.connection;
    }
    const url = `mongodb://${config.MONGODB_USER}:${config.MONGODB_PASS}@${config.MONGODB_HOST}/${config.MONGODB_DB}?authSource=admin`;
    return MongoDb.connection = await MongoClient.connect(url);
  }

  static async disconnect() {
    if (MongoDb.connection) {
      MongoDb.connection.close();
      MongoDb.connection = undefined;
    }
  }

  static async findOne(collection:string, filter, options?) {
    const record = await MongoDb.find(collection, filter, options);
    return record[0];
  }

  static async find(collection:string, filter, options?) {
    const client = await MongoDb.connect();
    options = options || {};
    options.limit = isNaN(options.limit) ? 500 : options.limit;
    let result = [];
    try {
      result = await client
          .db(config.MONGODB_DB)
          .collection(collection)
          .find(filter, options)
          .toArray();
    } catch (e) {
      console.error(e);
    }
    return result;
  }

  static async put(collection:string, data) {
    let items = [];
    if (Array.isArray(data)) items = data.slice();
    else if (typeof data === 'object') items = [data];
    if (items.length) {
      const connection = await MongoDb.connect();
      try {
        const c = await connection.db(config.MONGODB_DB).collection(collection);
        const ops = items.map(item => ({ replaceOne: { filter: { _id: item._id }, replacement: item, upsert: true}}));
        const docs = await c.bulkWrite(ops, {ordered: false});
        console.log('bulkWrite() upserted', docs.nUpserted);
        console.log('bulkWrite() matched', docs.nMatched);
        console.log('bulkWrite() modified', docs.nModified);
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  }

  static async aggregate(collection:string, pipeline) {
    const client = await MongoDb.connect();
    try {
      const c = await client.db(config.MONGODB_DB).collection(collection);
      const result = await c.aggregate(pipeline);
      return result?.toArray();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async stats(collection:string) {
    const client = await MongoDb.connect();
    try {
      const c = await client.db(config.MONGODB_DB).collection(collection);
      return c.stats();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
