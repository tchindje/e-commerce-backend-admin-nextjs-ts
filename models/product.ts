import mongoose from "mongoose";
import { Schema, model, models } from "mongoose";

const ProductShema = new Schema({
  title: {
    type: String,
    require: true,
  },

  price: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: false,
  },
  images: {
    type: [String],
    require: false,
  },
  category: {
    type: mongoose.Types.ObjectId,
    require: false,
    ref: "Category",
  },

  properties: {
    type: Object,
  },
});

export const Product = models.Product || model("Product", ProductShema);
