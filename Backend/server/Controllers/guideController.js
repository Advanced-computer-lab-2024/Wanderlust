const Guide = require('../Models/Guide');

// Controller to fetch the guide
const getGuide = async (req, res) => {
    try {
        const { userId, destination } = req.query; // Parameters passed from frontend
        const guide = await Guide.findOne({ userId, destination });
        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }
        res.json(guide.steps); // Return only the steps
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = { getGuide };
