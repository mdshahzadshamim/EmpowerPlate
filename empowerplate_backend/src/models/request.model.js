import mongoose, { Schema } from "mongoose";
import { config } from "../config/config.js";
import { grainOrFlourTypes } from "../../constantsConfig.js";

const statusHistorySchema = new Schema({
    status: {
        type: String,
        enum: [
            "PENDING",
            "ACCEPTED",
            "REJECTED",
            "ONTHEWAY",
            "HALFWAY",
            "FULFILLED",
            "CANCELLED"
        ],
        required: true
    }
}, { timestamps: true });

const cookedFoodSchema = new Schema({
    ageGroup: {
        type: String,
        enum: [
            "CHILD",
            "ADULT",
            // "INFANT",
            // "SENIOR_CITIZEN",
            // "PREGNANT_LADY"
        ],
        required: true
    },
    count: {
        type: Number,
        min: 1,
        max: 1000,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not allowed, should be an INT: 1 to 5'
        },
        required: true
    }
});

const rawFoodSchema = new Schema({
    grainOrFlourType: {
        type: String,
        enum: grainOrFlourTypes,
        required: true
    },
    amountInKg: {
        type: Number,
        min: 1,
        max: 1000,
        required: true
    }
})

const requestSchema = new Schema({
    admin: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: undefined
    },
    volunteer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: undefined
    },
    requester: {
        type: Schema.Types.ObjectId,
        ref: "User", // A donor or a recipient
        required: true
    },
    type: {
        type: String,
        enum: [
            "DONATE",
            "RECEIVE"
        ],
        required: true
    },
    foodType: {
        type: String,
        enum: [
            "RAW",
            "COOKED"
        ],
        required: true
    },
    cookedFood: {
        type: [cookedFoodSchema],
        default: undefined
    },
    rawFood: {
        type: [rawFoodSchema],
        default: undefined
    },
    currentStatus: {
        type: String,
        enum: [
            "PENDING",
            "ACCEPTED",
            "REJECTED",
            "ONTHEWAY",
            "HALFWAY", // In case of a donor request
            "FULFILLED",
            "CANCELLED"
        ],
        default: "PENDING"
    },
    statusHistory: {
        type: [statusHistorySchema],
        default: undefined
    },
    location: {
        type: [Number], // Array of numbers [longitude, latitude]
        index: '2dsphere', // Adding 2dsphere index for geospatial queries
        default: undefined
    },
    city: {
        type: String,
        enum: [
            config.currentCity,
        ],
        default: config.currentCity
    },
    reasonToCancel: {
        type: String,
        default: undefined
    },
}, { timestamps: true });

export const Request = mongoose.model("Request", requestSchema);