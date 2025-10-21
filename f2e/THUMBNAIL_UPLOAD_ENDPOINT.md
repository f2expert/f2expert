# Thumbnail Upload Endpoint Implementation

## Backend Endpoint Required

To make the thumbnail upload fully functional, you need to implement this endpoint on your backend:

### Endpoint: `POST /api/upload/thumbnail`

```javascript
// Example implementation for Node.js/Express with multer
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/thumbnails/'); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'thumbnail-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload endpoint
app.post('/api/upload/thumbnail', upload.single('thumbnail'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return the file URL
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/thumbnails/${req.file.filename}`;
    
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));
```

### Alternative: Cloud Storage (AWS S3, Cloudinary, etc.)

For production, consider using cloud storage:

```javascript
// Example with Cloudinary
const cloudinary = require('cloudinary').v2;

app.post('/api/upload/thumbnail', upload.single('thumbnail'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'course-thumbnails',
      resource_type: 'image',
      transformation: [
        { width: 1280, height: 720, crop: 'fill' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});
```

## Frontend Features Implemented

✅ **File Selection**: Hidden file input with custom styled button
✅ **File Validation**: Type and size validation (images only, max 5MB)
✅ **Preview**: Real-time image preview with remove option
✅ **Upload Progress**: Loading state with spinner
✅ **Error Handling**: Graceful fallback to local preview if upload fails
✅ **Responsive Design**: Works on desktop and mobile
✅ **Cleanup**: Automatic cleanup of preview URLs to prevent memory leaks

## Usage Instructions

1. **Choose File**: Click "Choose File" to select an image
2. **Preview**: See the image preview immediately
3. **Upload**: Click "Upload" to send to server (or use local preview in demo mode)
4. **Remove**: Click the × button to remove the thumbnail

## Demo Mode

Currently, the upload falls back to using the local preview URL if the backend endpoint is not available. This allows you to test the functionality immediately while you implement the backend.