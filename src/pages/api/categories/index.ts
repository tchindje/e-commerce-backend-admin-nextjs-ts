import { NextApiRequest, NextApiResponse } from "next";
import { mongooseConnect } from "../../../../lib/mongoose";
import { Category } from "../../../../models/category";
import { isAdminRequest } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  
  //check admin user
  await isAdminRequest(req, res);

  //connect to monggodb via mongoose odm
  await mongooseConnect();

  const { method } = req;

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

  if (method === "POST") {
    try {
      const { category, parentCategory, properties } = req.body;
      console.log(properties);

      let newCategory = new Category({
        name: category,
        parent: parentCategory || undefined,
        properties: properties || undefined,
      });

      await newCategory.save();

      return res.status(201).json({
        message: "Category created successfully!",
        category: newCategory,
      });
    } catch (error) {
      console.log("Error while saving category in DB.");
      res.status(500).send({ message: "Internal sever Error." });
    }
  }

  if (method === "PUT") {
    const { category, parentCategory, _id, properties } = req.body;
    const cat = await Category.updateOne(
      { _id: _id },
      {
        name: category,
        parent: parentCategory || undefined,
        properties: properties || undefined,
      }
    );
    return res
      .status(200)
      .json({ message: "updating category successfully", cat });
  }
}
