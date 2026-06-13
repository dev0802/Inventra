const goldRateService = require("../services/goldRateService");

exports.setGoldRate = async (req, res) => {
    try{
        const goldRateData = req.body;
        const newGoldRate = await goldRateService.setGoldRate(goldRateData);
        res.status(201).json(newGoldRate);
    }
    catch(error){
        console.error("Error setting gold rate:", error);
        res.status(500).json({ error: "Failed to set gold rate" });
    }
};

exports.getLatestGoldRate = async (req, res) => {
    try{
        const latestGoldRate = await goldRateService.getLatestGoldRate();
        res.status(200).json(latestGoldRate);
    }catch(error){
        console.error("Error fetching latest gold rate:", error);
        res.status(500).json({ error: "Failed to fetch latest gold rate" });
    }
};

exports.getGoldRateByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const goldRate = await goldRateService.getGoldRateByDate(date);
        if (goldRate) {
            res.status(200).json(goldRate);
        } else {
            res.status(404).json({ error: "Gold rate not found for the specified date" });
        }
    } catch (error) {
        console.error("Error fetching gold rate by date:", error);
        res.status(500).json({ error: "Failed to fetch gold rate by date" });
    }
};
