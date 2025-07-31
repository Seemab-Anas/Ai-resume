import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
const clientPromise: Promise<MongoClient> = (() => {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env');
  }

  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
})();

export async function getMongoDb() {
  const client = await clientPromise;
  return client.db(dbName);
} 