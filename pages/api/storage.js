// Simple storage API using environment variables or external storage
// For Vercel, we'll use a combination of localStorage on client and URL parameters for sharing

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Store data - in production you'd use a database
    const { key, data } = req.body;
    
    // For now, return success - actual storage handled client-side
    res.status(200).json({ 
      success: true, 
      message: 'Data stored successfully',
      key 
    });
  } else if (req.method === 'GET') {
    // Retrieve data - in production you'd query a database
    const { key } = req.query;
    
    // For now, return empty - actual retrieval handled client-side
    res.status(200).json({ 
      success: true, 
      data: null,
      key 
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
