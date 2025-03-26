const multer = require("multer");
const path = require("path");

// Configure Storage
const storage = multer.diskStorage({
    destination: "./events/",
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + Date.now() + ext);
    }
});

// File Filter (Validation)
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    console.log("extName:", extName);
    console.log("mimeType:", mimeType);

    if (mimeType && extName) {
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Invalid file type"));
    }
};

// Multer Upload Middleware
const upload = multer({ storage, fileFilter }).single("file");

// Upload Controller
const uploadFile = (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: "File type not supported!" });
        }
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        res.json({ message: "File uploaded successfully", file: req.file });
    });
};

module.exports = { uploadFile };
