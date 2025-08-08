import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  const { slug } = req.query;

  if (req.method === 'POST') {
    try {
      // Save report data to Redis
      await redis.set(`report:${slug}`, req.body);
      console.log(`✅ Saved report for slug: ${slug}`);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('❌ Failed to save report:', error);
      res.status(500).json({ error: 'Failed to save report' });
    }
  } else if (req.method === 'GET') {
    try {
      // Get report data from Redis
      const data = await redis.get(`report:${slug}`);
      
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
