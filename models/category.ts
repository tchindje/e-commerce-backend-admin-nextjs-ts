import mongoose, { Schema, model, models } from "mongoose";

const CategoryShema = new Schema({
  name: {
    type: String,
    require: true,
  },

  parent: {
    type: mongoose.Types.ObjectId,
    require: false,
    ref: "Category",
  },
});

export const Category = models.Category || model("Category", CategoryShema);
