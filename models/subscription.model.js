import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription Name is required"],
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    price: {
        type: Number,
        required: [true, "Subscription Price is required"],
        min: [0, "Subscription Price cannot be less than 0"],
        max: [1000000, "Subscription Price cannot be more than 1,000,000"],
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "NGN", "INR"],
        default: "USD",
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
        default: "monthly",
    },
    category: {
        type: String,
        enum: ["entertainment", "education", "health", "finance", "Sports", "news", "lifestyle", "other"],
        required: true,
    },
    paymentMethod: {
        type: String,
        reuired: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: [true, "Subscription Start Date is required"],
        validate: {
            validator: (value) => value <= new Date(),
            message: "Subscription Start Date cannot be in the future",
        }
    },
    renewalDate: {
        type: Date,
        // required: [true, "Subscription Start Date is required"],
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: "Renewal Date must be after the Start Date",
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    }
}, {timestamps: true});

subscriptionSchema.pre('save', function (next) {
    if(!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    if(this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next();
})

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;