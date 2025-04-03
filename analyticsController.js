const path = require("path");
const Analytics = require(path.join(__dirname, "../models/Analytics")); // Ensure correct path and filename

const analyticsController = {
    async getWeeklyAnalytics(req, res) {
        try {
            const weeklyData = await Analytics.find({ period: "weekly" });
            res.status(200).json(weeklyData);
        } catch (error) {
            console.error("Error fetching weekly analytics:", error);
            res.status(500).json({ message: "Error fetching weekly analytics", error });
        }
    },

    async getMonthlyAnalytics(req, res) {
        try {
            const monthlyData = await Analytics.find({ period: "monthly" });
            res.status(200).json(monthlyData);
        } catch (error) {
            console.error("Error fetching monthly analytics:", error);
            res.status(500).json({ message: "Error fetching monthly analytics", error });
        }
    },

    async getProductivityScore(req, res) {
        try {
            const score = await Analytics.aggregate([
                { $match: { type: "productivity" } },
                { $group: { _id: null, averageScore: { $avg: "$score" } } }
            ]);
            res.status(200).json(score.length > 0 ? score[0] : { averageScore: 0 });
        } catch (error) {
            console.error("Error fetching productivity score:", error);
            res.status(500).json({ message: "Error fetching productivity score", error });
        }
    },

    async getHabitAnalysis(req, res) {
        try {
            const habits = await Analytics.find({ type: "habit" });
            res.status(200).json(habits);
        } catch (error) {
            console.error("Error fetching habit analysis:", error);
            res.status(500).json({ message: "Error fetching habit analysis", error });
        }
    }
};

module.exports = analyticsController;


