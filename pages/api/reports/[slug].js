import { Redis } from '@upstash/redis'
import fs from 'fs';
import path from 'path';

// Try to initialize Redis, fallback to file storage for local development
let redis = null;
let useFileStorage = false;

try {
  // Check if Redis environment variables are set
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = Redis.fromEnv();
    console.log('✅ Using Redis for report storage');
  } else {
    useFileStorage = true;
    console.log('⚠️  Redis not configured, using file storage for development');
  }
} catch (error) {
  useFileStorage = true;
  console.log('⚠️  Redis initialization failed, using file storage:', error.message);
}

// File storage fallback functions
const getReportsDir = () => {
  const reportsDir = path.join(process.cwd(), 'tmp', 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  return reportsDir;
};

const saveToFile = (slug, data) => {
  const filePath = path.join(getReportsDir(), `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const readFromFile = (slug) => {
  const filePath = path.join(getReportsDir(), `${slug}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return null;
};

export default async function handler(req, res) {
  const { slug } = req.query;

  if (req.method === 'POST') {
    try {
      if (useFileStorage) {
        // Save to file system for local development
        saveToFile(slug, req.body);
        console.log(`✅ Saved report to file for slug: ${slug}`);
      } else {
        // Save to Redis for production
        await redis.set(`report:${slug}`, req.body);
        console.log(`✅ Saved report to Redis for slug: ${slug}`);
      }
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('❌ Failed to save report:', error);
      res.status(500).json({ error: 'Failed to save report' });
    }
  } else if (req.method === 'GET') {
    try {
      let data;
      
      if (useFileStorage) {
        // Get from file system for local development
        data = readFromFile(slug);
      } else {
        // Get from Redis for production
        data = await redis.get(`report:${slug}`);
      }
      
      if (!data) {
        console.log(`❌ No report found for slug: ${slug}`);
        return res.status(404).json({ error: 'Report not found' });
      }
      
      console.log(`✅ Retrieved report for slug: ${slug}`);
      res.status(200).json(data);
    } catch (error) {
      console.error('❌ Failed to retrieve report:', error);
      res.status(500).json({ error: 'Failed to retrieve report' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
