exports.test = async(req, res) => {
    try {
        return res.status(200).json({message : "API Status Running"})
    } catch (error) {
        return res.status(500).json({error : "An error occured"})
    }
}