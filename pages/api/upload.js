import formidable from 'formidable';
import Papa from 'papaparse';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await form.parse(req);
    const csvFile = files.file?.[0];

    if (!csvFile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read and parse CSV file
    const csvContent = fs.readFileSync(csvFile.filepath, 'utf8');
    
    // Parse the competitive analysis CSV structure
    const parsedData = parseCompetitiveAnalysisCSV(csvContent);
    
    // Clean up temp file
    fs.unlinkSync(csvFile.filepath);

    res.status(200).json({
      success: true,
      data: parsedData,
      message: 'CSV file processed successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to process CSV file',
      details: error.message 
    });
  }
}

function parseCompetitiveAnalysisCSV(csvContent) {
  const lines = csvContent.split('\\n');
  const sections = {};
  let currentSection = null;
  let sectionLines = [];

  // Parse sections based on separator lines
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('───────────────')) {
      // Save previous section
      if (currentSection && sectionLines.length > 0) {
        sections[currentSection] = sectionLines.slice();
      }
      sectionLines = [];
    } else if (lines[i].trim().match(/^[A-Z\\s]+$/) && lines[i].trim().length > 3 && !lines[i].includes('COMPETELY')) {
      currentSection = lines[i].trim();
    } else if (currentSection && lines[i].trim()) {
      sectionLines.push(lines[i]);
    }
  }

  // Don't forget last section
  if (currentSection && sectionLines.length > 0) {
    sections[currentSection] = sectionLines.slice();
  }

  // Parse each section into structured data
  const structuredData = {};
  
  // Parse OVERVIEW section to get company names
  if (sections.OVERVIEW) {
    const overviewCsv = sections.OVERVIEW.join('\\n');
    const overviewData = Papa.parse(overviewCsv, {
      header: true,
      skipEmptyLines: true
    });
    
    const companies = overviewData.meta.fields.slice(1); // Remove 'Name' field
    structuredData.companies = companies;
    structuredData.clientName = companies[0]; // First company is the client
    
    // Structure overview data
    structuredData.overview = {};
    overviewData.data.forEach(row => {
      if (row.Name) {
        companies.forEach(company => {
          if (!structuredData.overview[company]) {
            structuredData.overview[company] = {};
          }
          structuredData.overview[company][row.Name] = row[company];
        });
      }
    });
  }

  // Parse other sections (SWOT, SERVICES, etc.)
  ['SWOT', 'SERVICES', 'AUDIENCE', 'SENTIMENT', 'MARKET', 'MARKETING'].forEach(sectionName => {
    if (sections[sectionName]) {
      const sectionCsv = sections[sectionName].join('\\n');
      const sectionData = Papa.parse(sectionCsv, {
        header: true,
        skipEmptyLines: true
      });
      
      structuredData[sectionName.toLowerCase()] = {};
      sectionData.data.forEach(row => {
        if (row.Name && structuredData.companies) {
          structuredData.companies.forEach(company => {
            if (!structuredData[sectionName.toLowerCase()][company]) {
              structuredData[sectionName.toLowerCase()][company] = {};
            }
            structuredData[sectionName.toLowerCase()][company][row.Name] = row[company];
          });
        }
      });
    }
  });

  return structuredData;
}
