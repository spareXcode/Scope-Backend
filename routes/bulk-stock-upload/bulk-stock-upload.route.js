const express=require('express');
const router=express();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const bulkStockUploadController=require('../../controller/bulk-stock-upload/bulk-stock-upload.controller');
const uploadsDir = './bulk-stock-uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
router.post('/stock',upload.single('excelFile'),bulkStockUploadController.uploadFile);

module.exports=router;