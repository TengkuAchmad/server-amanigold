// LIBRARY IMPORT
const multer            = require('multer');
const multerS3          = require('multer-s3');

const upload = multer({
    dest: './uploads/',
})


// CONTROLLER
exports.upload = upload.single('file'), async (req, res) => {
     // Periksa apakah ada file yang diunggah
     if (!req.file) {
        // Jika tidak ada file yang diunggah, kirim respons dengan pesan gagal
        return res.status(400).json({ message: "Gagal mengunggah file" });
    }

    // Jika ada file yang diunggah, kirim respons dengan pesan berhasil
    return res.status(200).json({ message: "File berhasil diunggah" });
}
