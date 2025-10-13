import multer from "multer"
import path from "path"
import fs from "fs"

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads", "users")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and original extension
    const userId = req.params.id || req.body.userId || Date.now()
    const extension = path.extname(file.originalname)
    const filename = `user-${userId}-${Date.now()}${extension}`
    cb(null, filename)
  }
})

// File filter to allow only images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error("Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed"))
  }
}

// Configure multer
export const uploadUserPhoto = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
})

// Middleware for single photo upload
export const uploadSinglePhoto = uploadUserPhoto.single("photo")

// Utility function to delete old photo file
export const deletePhotoFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error("Error deleting photo file:", error)
  }
}

// Get photo URL helper
export const getPhotoUrl = (filename: string, req: any): string | undefined => {
  if (!filename) return undefined
  const baseUrl = `${req.protocol}://${req.get('host')}`
  return `${baseUrl}/uploads/users/${filename}`
}