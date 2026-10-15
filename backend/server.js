
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Application = require("./models/Application");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "Job Application Tracker API is running!"
    });
});

// Get all applications, with optional search and status filters
app.get("/api/applications", async (req, res) => {
    try {
        const { search, status } = req.query;
        const filter = {};

        if (status && status !== "All") {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { company: { $regex: search, $options: "i" } },
                { role: { $regex: search, $options: "i" } }
            ];
        }

        const applications = await Application.find(filter)
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create an application
app.post("/api/applications", async (req, res) => {
    try {
        const application = await Application.create(req.body);
        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update an application
app.put("/api/applications/:id", async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after', runValidators: true }
        );

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json(application);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an application
app.delete("/api/applications/:id", async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(
            req.params.id
        );

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({ message: "Application deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Dashboard statistics
app.get("/api/applications/stats", async (req, res) => {
    try {
        const stats = await Application.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = {
            total: 0,
            Applied: 0,
            Interview: 0,
            Offer: 0,
            Rejected: 0
        };

        stats.forEach((item) => {
            result[item._id] = item.count;
            result.total += item.count;
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start server after connecting to MongoDB
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    startServer();
}

module.exports = app;
