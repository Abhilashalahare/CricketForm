import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/';
    
    // Choose folder based on the field name sent from the frontend
    if (file.fieldname === 'photo') {
      folder = 'uploads/profiles';
    } else if (file.fieldname === 'utrReceipt') {
      folder = 'uploads/receipts';
    }

    // Ensure the directory exists (create it if it doesn't)
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Save with a unique timestamp to prevent filename collisions
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage });