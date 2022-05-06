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

  static async put(collection, data) {
    let items = [];
    if (Array.isArray(data)) items = data.slice();
    else if (typeof data === 'object') items = [data];
    if (items.length) {
      const connection = await MongoDb.connect();
      try {
        const c = await connection.db(config.MONGODB_DB).collection(collection);
        const ops = items.map(item => ({ replaceOne: { filter: { _id: item._id }, replacement: item, upsert: true}}));
        const docs = await c.bulkWrite(ops, {ordered: false});
        console.log('putMany() upserted-records', docs.nUpserted);
        console.log('putMany() matched-records', docs.nMatched);
        console.log('putMany() modified-records', docs.nModified);
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  }
}
