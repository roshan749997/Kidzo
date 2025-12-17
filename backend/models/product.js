import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },                  // Product title
    mrp: { type: Number, required: true },                    // MRP (maximum retail price)
    discountPercent: { type: Number, default: 0, min: 0, max: 100 }, // Discount in %
    description: { type: String },
    category: { type: String, required: true, index: true },
    categoryId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category',
      index: true 
    },

    product_info: {
      brand: { type: String },
      manufacturer: { type: String },

      /* ---- Kids Clothing ---- */
      clothingType: { type: String },          // T-shirt, Dress, Shorts
      gender: { type: String },                // Boys, Girls, Unisex
      ageGroup: { type: String },              // 0-1Y, 1-3Y, 3-5Y
      availableSizes: { type: [String], default: [] },
      fabric: { type: String },
      color: { type: String },

      /* ---- Footwear ---- */
      footwearType: { type: String },           // Shoes, Sandals, Slippers
      shoeMaterial: { type: String },
      soleMaterial: { type: String },

      /* ---- Kids Accessories ---- */
      accessoryType: { type: String },          // Cap, Bag, Sunglasses
      material: { type: String },

      /* ---- Baby Care ---- */
      babyCareType: { type: String },            // Lotion, Diaper, Shampoo
      ageRange: { type: String },                // 0-6 months, 6-12 months
      safetyStandard: { type: String },           // BPA Free, Dermatologically tested
      quantity: { type: String },                 // 200ml, 100 wipes

      /* ---- Toys ---- */
      toyType: { type: String },                  // Car, Puzzle, Soft Toy
      batteryRequired: { type: Boolean, default: false },
      batteryIncluded: { type: Boolean, default: false },

      /* ---- Universal ---- */
      includedComponents: { type: String },
    },

    images: {
      image1: { type: String, required: true },
      image2: { type: String },
      image3: { type: String },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// 💡 Virtual field: Automatically calculate final price after discount
productSchema.virtual("price").get(function () {
  const discount = (this.mrp * this.discountPercent) / 100;
  return Math.round(this.mrp - discount);
});

export const Product = mongoose.model("Product", productSchema);
