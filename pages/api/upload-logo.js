import formidable from 'formidable';
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
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
    });

    const [fields, files] = await form.parse(req);
    const logoFile = files.logo?.[0];
    const clientName = fields.clientName?.[0];

    if (!logoFile) {
      return res.status(400).json({ error: 'No logo file uploaded' });
    }

    if (!clientName) {
      return res.status(400).json({ error: 'Client name is required' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(logoFile.mimetype)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Please upload JPG, PNG, or SVG files only.' 
      });
    }

    // Read file and convert to base64 (works in Vercel)
    const fileBuffer = fs.readFileSync(logoFile.filepath);
    const base64Logo = `data:${logoFile.mimetype};base64,${fileBuffer.toString('base64')}`;

    // Clean up temp file
    fs.unlinkSync(logoFile.filepath);

    res.status(200).json({
      success: true,
      logoUrl: base64Logo, // Return base64 data URL instead of file path
      clientName,
      message: 'Logo uploaded successfully'
    });

  } catch (error) {
    console.error('Logo upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload logo',
      details: error.message 
    });
  }
}