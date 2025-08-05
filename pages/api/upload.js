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

    // Validate file type
    if (!csvFile.originalFilename?.endsWith('.csv') && csvFile.mimetype !== 'text/csv') {
      return res.status(400).json({ error: 'Please upload a valid CSV file' });
    }

    // Read and parse CSV file
    const csvContent = fs.readFileSync(csvFile.filepath, 'utf8');
    
    // Parse the competitive analysis CSV structure
    const parsedData = parseCompetitiveAnalysisCSV(csvContent);
    
    // Clean up temp file
    fs.unlinkSync(csvFile.filepath);

    // Generate a unique key for storing this data
    const dataKey = `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    res.status(200).json({
      success: true,
      data: parsedData,
      dataKey,
      message: 'CSV file processed successfully',
      filename: csvFile.originalFilename
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to process CSV file',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
}

function parseCompetitiveAnalysisCSV(csvContent) {
  const lines = csvContent.split('\n').map(line => line.trim()).filter(line => line);
  const sections = {};
  let currentSection = null;
  let sectionLines = [];

  // Parse sections based on separator lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for separator lines
    if (line.includes('───────────────') || line.match(/^-{5,}$/)) {
      // Save previous section
      if (currentSection && sectionLines.length > 0) {
        sections[currentSection] = sectionLines.slice();
      }
      sectionLines = [];
      continue;
    }
    
    // Check for section headers (all caps, significant length)
    if (line.match(/^[A-Z\s&]+$/) && line.length > 3 && !line.includes('COMPETELY') && !line.includes('CSV')) {
      // Save previous section
      if (currentSection && sectionLines.length > 0) {
        sections[currentSection] = sectionLines.slice();
      }
      currentSection = line.trim();
      sectionLines = [];
      continue;
    }
    
    // Add content to current section
    if (currentSection && line) {
      sectionLines.push(line);
    }
  }

  // Don't forget last section
  if (currentSection && sectionLines.length > 0) {
    sections[currentSection] = sectionLines.slice();
  }

  // Parse each section into structured data
  const structuredData = {
    sections: Object.keys(sections),
    raw: sections
  };
  
  // Parse OVERVIEW section to get company names
  if (sections.OVERVIEW || sections['COMPANY OVERVIEW']) {
    const overviewSection = sections.OVERVIEW || sections['COMPANY OVERVIEW'];
    const overviewCsv = overviewSection.join('\n');
    
    try {
      const overviewData = Papa.parse(overviewCsv, {
        header: true,
        skipEmptyLines: true,
        delimiter: ','
      });
      
      if (overviewData.data.length > 0 && overviewData.meta.fields) {
        const companies = overviewData.meta.fields.filter(field => 
          field && !field.toLowerCase().includes('name') && field.trim()
        );
        
        structuredData.companies = companies;
        structuredData.clientName = companies[0]; // First company is typically the client
        
        // Structure overview data
        structuredData.overview = {};
        overviewData.data.forEach(row => {
          if (row.Name || row.name) {
            const rowName = row.Name || row.name;
            companies.forEach(company => {
              if (!structuredData.overview[company]) {
                structuredData.overview[company] = {};
              }
              structuredData.overview[company][rowName] = row[company] || '';
            });
          }
        });
      }
    } catch (parseError) {
      console.warn('Error parsing overview section:', parseError);
      // Fallback: try to extract company names from header
      const headerLine = overviewSection[0];
      if (headerLine) {
        const companies = headerLine.split(',').slice(1).map(c => c.trim());
        structuredData.companies = companies;
        structuredData.clientName = companies[0];
      }
    }
  }

  // Parse other sections (SWOT, SERVICES, etc.)
  const sectionsToProcess = ['SWOT', 'SWOT ANALYSIS', 'SERVICES', 'SERVICE COMPARISON', 'AUDIENCE', 'TARGET AUDIENCE', 'SENTIMENT', 'MARKET', 'MARKETING'];
  
  sectionsToProcess.forEach(sectionName => {
    const section = sections[sectionName];
    if (section) {
      const sectionCsv = section.join('\n');
      const sectionKey = sectionName.toLowerCase().replace(/\s+/g, '_');
      
      try {
        const sectionData = Papa.parse(sectionCsv, {
          header: true,
          skipEmptyLines: true,
          delimiter: ','
        });
        
        structuredData[sectionKey] = {};
        if (sectionData.data.length > 0 && structuredData.companies) {
          sectionData.data.forEach(row => {
            const rowName = row.Name || row.name || row.Category || row.category;
            if (rowName) {
              structuredData.companies.forEach(company => {
                if (!structuredData[sectionKey][company]) {
                  structuredData[sectionKey][company] = {};
                }
                structuredData[sectionKey][company][rowName] = row[company] || '';
              });
            }
          });
        }
      } catch (parseError) {
        console.warn(`Error parsing ${sectionName} section:`, parseError);
        // Store raw data as fallback
        structuredData[sectionKey + '_raw'] = section;
      }
    }
  });

  return structuredData;
}
