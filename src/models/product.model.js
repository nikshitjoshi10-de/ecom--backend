const mongoose = require("mongoose");
const { convertToSlug, nanoId } = require("../utils/slug");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      maxlength: 4000,
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    mrp: {
      type: Number,
      required: true,
      min: 1,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
        },
      },
    ],

    video: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      index: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    stockQty: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    ratingAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.virtual("discountPercent").get(function () {
  if (!this.mrp || this.mrp <= 0) return 0;

  return Math.round(((this.mrp - this.price) / this.mrp) * 100);
});

productSchema.virtual("inStock").get(function () {
  return this.stockQty > 0;
});

productSchema.set("toJSON", {
  virtuals: true,
});

productSchema.set("toObject", {
  virtuals: true,
});
productSchema.pre("validate", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug =  this.slug = convertToSlug(this.name)-nanoId();
  }

  next();
});

productSchema.pre("validate", function (next) {
  if (this.price >this.mrp) {
    this.invalidate("price","Price cannot exceed MRP");
  }
  next();
});



const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;