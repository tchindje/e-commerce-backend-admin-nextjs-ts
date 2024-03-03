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
});

export const Product = models.Product || model("Product", ProductShema);
