const mongoose = require("mongoose");
const { convertToSlug, nanoId } = require("../utils/slug");


const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true
        },

        image: {
            url: String,
            publicId: String
        },

        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
            index: true
        },

        position: {
            type: Number,
            default: 0
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

categorySchema.pre("validate", function () {
    if (this.isModified("name") || !this.slug) {
        this.slug = convertToSlug(this.name)-nanoId();
    }
});

const CategoryModel = mongoose.model("Category", categorySchema);

module.exports= CategoryModel;