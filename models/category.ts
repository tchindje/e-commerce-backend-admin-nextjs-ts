import mongoose, { Schema, model, models } from "mongoose";

const CategoryShema = new Schema({
  name: {
    type: String,
    require: true,
  },

  properties: [
    {
      type: Object,
    },
  ],

  parent: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
});

export const Category = models.Category || model("Category", CategoryShema);
