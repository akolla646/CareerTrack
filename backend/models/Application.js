
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            required: true,
            trim: true
        },
        jobLink: {
            type: String,
            trim: true,
            default: ""
        },
        salaryExpectation: {
            type: Number,
            min: 0,
            default: null
        },
        applicationDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ["Applied", "Interview", "Offer", "Rejected"],
            default: "Applied"
        },
        interviewDate: {
            type: Date,
            default: null
        },
        notes: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
