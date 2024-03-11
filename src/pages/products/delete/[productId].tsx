import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import Layout from "@/components/Layout";
import { ProductType } from "../../../../types";

type Props = {};

const DeleteProduct = (props: Props) => {
  const params = useParams();
  const router = useRouter();

  const [errorDeleting, setErrorDeleting] = useState(false);
  const productId = params?.productId;
  const [product, setProduct] = useState<ProductType>();

  useEffect(() => {
    if (!productId) {
      return;
    }

    axios.get(`/api/products?productId=${productId}`).then((res) => {
      setProduct(res.data);
    });
  }, [productId]);

  const deleteHandler = async () => {
    setErrorDeleting(false);
    try {
      const res = await axios.delete(`/api/products?productId=${productId}`);
      console.log(res.data.message);
      return router.push("/products");
    } catch (error) {
      setErrorDeleting(true);
      console.log("Error occur while deleting a product.");
    }
  };

  const cancelhandler = () => {
    return router.push("/products");
  };

  return (
    <Layout>
      <h1 className="text-center">
        Do you really want to Delete the product &nbsp; &quot;
        {product?.title}&quot; ?
      </h1>
      <div className="flex gap-2 justify-center">
        <button className="btn-default" onClick={cancelhandler}>
          NO
        </button>
        <button className="btn-red" onClick={deleteHandler}>
          YES{" "}
        </button>
      </div>
    </Layout>
  );
};

export default DeleteProduct;
