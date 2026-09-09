// Cached mongoose connection for serverless (Vercel functions reuse warm
// containers — reconnecting on every invocation would exhaust connections).
import mongoose from 'mongoose';

let cached = (globalThis as any)._estimatorMongoose;
if (!cached) {
  cached = (globalThis as any)._estimatorMongoose = { conn: null, promise: null };
}

export async function connectDb() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('Missing MONGODB_URI environment variable.');
    cached.promise = mongoose.connect(uri, { dbName: 'agitech' }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const userResponseSchema = new mongoose.Schema({
  selectedApps: [String],
  environmentSetup: {
    multicompany: Boolean,
    email: String,
    users: Number,
    products: Number,
    companies: Number,
    productionCenters: String,
    workcenters: String,
    qualityChecks: Boolean,
    manufacturedComponents: Boolean,
  },
  accounting: {
    type: String,
    hasPreviousSoftware: Boolean,
  },
  integrations: [Object],
  customDev: [Object],
  dataMigration: {
    source: String,
    objects: [String],
    productVariants: Number,
    recordCounts: Object,
  },
  iot: {
    needed: Boolean,
    devices: [Object],
  },
  hosting: {
    type: String,
    users: Number,
    licenseType: String,
    server: String,
  },
  maintenance: {
    hoursPerMonth: Number,
    evolutive: Boolean,
  },
  contactInfo: {
    fullName: String,
    email: String,
    company: String,
    implementationTimeline: String,
  },
  budget: {
    capex: Object,
    opex: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// mongoose.models is empty on cold start but can already hold the model on a
// warm invocation reusing the same container — guard against recompiling it.
export const UserResponse = mongoose.models.UserResponse || mongoose.model('UserResponse', userResponseSchema);
