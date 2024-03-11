import type { NextApiRequest, NextApiResponse } from "next";

import { Product } from "../../../../models/product";
import { mongooseConnect } from "../../../../lib/mongoose";
import { unlink } from "fs/promises";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // check admin user
  await isAdminRequest(req, res);

  //connect to monggodb via mongoose odm
  await mongooseConnect();

  const { method } = req;

  if (method === "GET") {
    if (req.query?.productId) {
      const product = await Product.findById({ _id: req.query.productId });
      return res.status(200).json(product);
    } else {
      const products = await Product.find();
      res.status(200).json(products);
    }
  }

  if (method === "POST") {
    try {
      const { title, price, description, images, category, properties } =
        req.body;

      let newProduct = new Product({
        title,
        price,
        description,
        category: category || undefined,
        properties: properties || undefined,
        images,
      });

      await newProduct.save();
      return res.status(201).json({
        message: "Product created successfully!",
        product: newProduct,
      });
    } catch (error) {
      console.log("error handling a file");
      return res.status(500).send({ message: error });
    }
  }

  if (method === "PUT") {
    const { title, price, description, images, id, category, properties } =
      req.body;
    let product = await Product.updateOne(
      { _id: id },
      {
        title,
        price,
        description,
        images,
        category: category || undefined,
        properties: properties || undefined,
      }
    );

    return res
      .status(200)
      .json({ message: "updating product successfully", product });
  }

  if (method === "DELETE") {
    if (req.query?.productId) {
      const product: any = await Product.findOne(
        { _id: req.query.productId },
        "images"
      );

      let images: string[] = product?.images;

      //try to deleting file associate with product
      try {
        images?.forEach(async (image) => {
          let path = `${process.cwd()}/public/upload/images/${image}`;
          await unlink(path);
        });
      } catch (error) {
        console.log(
          "errror while deleting file aassociated with upload product"
        );
      }
      await Product.deleteOne({ _id: req.query.productId });
      return res.status(200).json({ message: "product deleted succesfully." });
    }
  }
}
