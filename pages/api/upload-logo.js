import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

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
    // Ensure public/logos directory exists
    const logoDir = path.join(process.cwd(), 'public', 'logos');
    if (!fs.existsSync(logoDir)) {
      fs.mkdirSync(logoDir, { recursive: true });
    }

    const form = formidable({
      uploadDir: logoDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      filename: (name, ext, part) => {
        // Generate clean filename
        const clientName = part.originalFilename.split('.')[0];
        const cleanName = clientName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        return `${cleanName}${ext}`;
      },
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
      fs.unlinkSync(logoFile.filepath);
      return res.status(400).json({ 
        error: 'Invalid file type. Please upload JPG, PNG, or SVG files only.' 
      });
    }

    // Get the final filename
    const filename = path.basename(logoFile.filepath);
    const logoUrl = `/logos/${filename}`;

    res.status(200).json({
      success: true,
      logoUrl,
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