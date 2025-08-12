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

// In-memory storage for production fallback (temporary session-based)
let memoryStorage = new Map();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Fetching reports list...');
    
    if (!useFileStorage && redis) {
      // Production: Get from Redis
      try {
        const keys = await redis.keys('report:*');
        console.log('📋 Found Redis keys:', keys.length);
        
        const reports = [];
        for (const key of keys) {
          try {
            const data = await redis.get(key);
            if (data) {
              const slug = key.replace('report:', '');
              reports.push({
                slug,
                clientName: data.clientName || 'Unknown Client',
                industry: data.industry || 'Unknown Industry',
                analysisDate: data.analysisDate || new Date().toISOString().split('T')[0],
                createdDate: new Date().toISOString(),
                competitorsCount: data.selectedCompetitors ? data.selectedCompetitors.length : 0,
                hasLogo: !!data.clientLogo
              });
            }
          } catch (reportError) {
            console.error(`Error processing Redis report ${key}:`, reportError);
          }
        }
        
        reports.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        console.log('✅ Retrieved', reports.length, 'reports from Redis');
        return res.json({ reports });
        
      } catch (redisError) {
        console.error('❌ Redis operation failed:', redisError);
        // Fall through to memory storage
      }
    }

    if (useFileStorage) {
      // Development: Get from file system
      try {
        const reportsDir = path.join(process.cwd(), 'tmp', 'reports');
        
        if (!fs.existsSync(reportsDir)) {
          fs.mkdirSync(reportsDir, { recursive: true });
          return res.json({ reports: [] });
        }

        const files = fs.readdirSync(reportsDir);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        const reports = [];
        for (const file of jsonFiles) {
          try {
            const filePath = path.join(reportsDir, file);
            const stats = fs.statSync(filePath);
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);
            
            reports.push({
              slug: file.replace('.json', ''),
              clientName: data.clientName || 'Unknown Client',
              industry: data.industry || 'Unknown Industry',
              analysisDate: data.analysisDate || stats.mtime.toISOString().split('T')[0],
              createdDate: stats.mtime.toISOString(),
              competitorsCount: data.selectedCompetitors ? data.selectedCompetitors.length : 0,
              hasLogo: !!data.clientLogo
            });
          } catch (error) {
            console.error(`Error processing file ${file}:`, error);
          }
        }
        
        reports.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        console.log('✅ Retrieved', reports.length, 'reports from files');
        return res.json({ reports });
        
      } catch (fileError) {
        console.error('❌ File system failed:', fileError);
        // Fall through to memory storage
      }
    }
    
    // Fallback: Use memory storage (production without Redis)
    console.log('⚠️  Using memory storage fallback');
    const reports = Array.from(memoryStorage.values()).map(data => ({
      slug: data.slug || 'unknown',
      clientName: data.clientName || 'Unknown Client',
      industry: data.industry || 'Unknown Industry',
      analysisDate: data.analysisDate || new Date().toISOString().split('T')[0],
      createdDate: data.createdDate || new Date().toISOString(),
      competitorsCount: data.selectedCompetitors ? data.selectedCompetitors.length : 0,
      hasLogo: !!data.clientLogo
    }));
    
    reports.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    console.log('✅ Retrieved', reports.length, 'reports from memory');
    return res.json({ reports });
    
  } catch (error) {
    console.error('❌ Error fetching reports list:', error);
    res.status(500).json({ error: 'Failed to fetch reports list: ' + error.message });
  }
}

// Export memory storage for use by other API routes
export { memoryStorage };