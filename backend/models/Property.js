import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      enum: ["apartment", "house", "villa", "plot", "commercial"],
      required: true,
    },
    location: {
      city: { type: String, required: true, trim: true },
      address: { type: String, required: true },
    },
    area: { type: Number, required: true }, // sq ft
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    images: [
      {
        url: String,
        fileId: String, // ImageKit se delete karne ke liye
      },
    ],
  },
  { timestamps: true }
);

// Max 4 images
propertySchema.path("images").validate(
  (arr) => arr.length <= 4,
  "Maximum 4 images allowed"
);

export default mongoose.model("Property", propertySchema);