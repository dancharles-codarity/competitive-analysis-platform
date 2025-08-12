import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const reportsDir = path.join(process.cwd(), 'tmp', 'reports');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
      return res.json({ reports: [] });
    }

    // Read all JSON files in the reports directory
    const files = fs.readdirSync(reportsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const reports = [];
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(reportsDir, file);
        const stats = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        // Extract metadata for the list view
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
        console.error(`Error processing report file ${file}:`, error);
        // Skip corrupted files
        continue;
      }
    }
    
    // Sort by creation date (newest first)
    reports.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    
    res.json({ reports });
    
  } catch (error) {
    console.error('Error fetching reports list:', error);
    res.status(500).json({ error: 'Failed to fetch reports list' });
  }
}