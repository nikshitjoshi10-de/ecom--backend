const mongoose = require("mongoose");
const { convertToSlug } = require("../utils/slug");


const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    logo: {
      url: String,
      publicId: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

brandSchema.pre("validate", function () {
    if (this.isModified("name") || !this.slug) {
        this.slug = convertToSlug(this.name);
    }
});

const BrandModel = mongoose.model("Brand", brandSchema);

module.exports = BrandModel;