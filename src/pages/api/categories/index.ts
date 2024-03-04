import { NextApiRequest, NextApiResponse } from "next";
import { mongooseConnect } from "../../../../lib/mongoose";
import { Category } from "../../../../models/category";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //connect to monggodb via mongoose odm
  await mongooseConnect();

  const { method } = req;

  if (method === "POST") {
    try {
      const { category, parentCategory } = req.body;
      let newCategory = null;

      if (parentCategory) {
        newCategory = new Category({
          name: category,
          parent: parentCategory,
        });
      } else {
        newCategory = new Category({
          name: category,
        });
      }

      await newCategory.save();
      console.log(newCategory);

      return res.status(201).json({
        message: "Category created successfully!",
        category: newCategory,
      });
    } catch (error) {
      console.log("Error while saving category in DB.");
      res.status(500).send({ message: "Internal sever Error." });
    }
  }

  if (method === "GET") {
    if (req.query?.categoryId) {
      const category = await Category.findById({
        _id: req.query.categoryId,
      }).populate("parent");
      return res.status(200).json(category);
    } else {
      const categories = await Category.find().populate("parent");
      res.status(200).json(categories);
    }
  }

  if (method === "DELETE") {
    if (req.query?.categoryId) {
      await Category.deleteOne({ _id: req.query.categoryId });
      return res.status(200).json({ message: "category deleted succesfully." });
    }
  }

  if (method === "PUT") {
    const { name, parent, _id } = req.body;
    const category = await Category.updateOne({ _id: _id }, { name, parent });
    return res
      .status(200)
      .json({ message: "updating category successfully", category });
  }
}
