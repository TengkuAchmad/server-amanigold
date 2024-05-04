exports.uploadTest = async (req, res) => {
    if (!req.files || !req.files.length) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filename = req.files[0].originalname

    return res.json({ filename })
}