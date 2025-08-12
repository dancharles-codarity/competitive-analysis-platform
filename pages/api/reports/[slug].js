import { Redis } from '@upstash/redis'
import fs from 'fs';
import path from 'path';
import { memoryStorage } from './index.js';

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
    try {
      fs.mkdirSync(reportsDir, { recursive: true });
      console.log('✅ Created reports directory for file storage');
    } catch (error) {
      console.error('❌ Cannot create reports directory (production environment):', error);
      throw new Error('File system not writable in production environment');
    }
  }
  return reportsDir;
};

const saveToFile = (slug, data) => {
  try {
    const filePath = path.join(getReportsDir(), `${slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('✅ Saved report to file:', slug);
  } catch (error) {
    console.error('❌ Failed to save to file:', error);
    throw new Error('Cannot save to file system in production environment');
  }
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
      console.log(`💾 Saving report for slug: ${slug}`);
      const reportData = { ...req.body, slug, createdDate: new Date().toISOString() };
      
      if (!useFileStorage && redis) {
        // Production: Save to Redis
        try {
          await redis.set(`report:${slug}`, reportData);
          console.log(`✅ Saved report to Redis for slug: ${slug}`);
          return res.status(200).json({ success: true });
        } catch (redisError) {
          console.error('❌ Redis save failed:', redisError);
          // Fall through to memory storage
        }
      }
      
      if (useFileStorage) {
        // Development: Save to file system
        try {
          saveToFile(slug, reportData);
          console.log(`✅ Saved report to file for slug: ${slug}`);
          return res.status(200).json({ success: true });
        } catch (fileError) {
          console.error('❌ File storage failed:', fileError);
          // Fall through to memory storage
        }
      }
      
      // Fallback: Save to memory storage (production without Redis)
      console.log('⚠️  Using memory storage fallback for saving');
      memoryStorage.set(slug, reportData);
      console.log(`✅ Saved report to memory for slug: ${slug}`);
      res.status(200).json({ success: true });
      
    } catch (error) {
      console.error('❌ Failed to save report:', error);
      res.status(500).json({ error: 'Failed to save report: ' + error.message });
    }
  } else if (req.method === 'GET') {
    try {
      console.log(`📖 Loading report for slug: ${slug}`);
      let data;
      
      if (!useFileStorage && redis) {
        // Production: Get from Redis
        try {
          data = await redis.get(`report:${slug}`);
          if (data) {
            console.log(`✅ Retrieved report from Redis for slug: ${slug}`);
            return res.status(200).json(data);
          }
        } catch (redisError) {
          console.error('❌ Redis retrieval failed:', redisError);
          // Fall through to other storage methods
        }
      }
      
      if (useFileStorage) {
        // Development: Get from file system
        try {
          data = readFromFile(slug);
          if (data) {
            console.log(`✅ Retrieved report from file for slug: ${slug}`);
            return res.status(200).json(data);
          }
        } catch (fileError) {
          console.error('❌ File read failed:', fileError);
          // Fall through to memory storage
        }
      }
      
      // Fallback: Get from memory storage
      console.log('⚠️  Using memory storage fallback for retrieval');
      data = memoryStorage.get(slug);
      if (data) {
        console.log(`✅ Retrieved report from memory for slug: ${slug}`);
        return res.status(200).json(data);
      }
      
      console.log(`❌ No report found for slug: ${slug}`);
      return res.status(404).json({ error: 'Report not found' });
      
    } catch (error) {
      console.error('❌ Failed to retrieve report:', error);
      res.status(500).json({ error: 'Failed to retrieve report: ' + error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
