import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

import Layout from "@/components/Layout";
import { ProductType } from "../../../../types";
import ProductForm from "@/components/ProductForm";
import { SubmitAction } from "../../../../types";

type Props = {};

const Editproduct = (props: Props) => {
  const params = useParams();
  const productId = params?.productId;

  const [productToEdited, setProductToEdited] = useState<ProductType>();
  const [errorUpdate, setErrorUpdate] = useState(false);

  useEffect(() => {
    if (!productId) {
      return;
    }

    const fetchProductById = async (productId: any) => {
      const res = await axios.get(`/api/products?productId=${productId}`);
      const product: ProductType = await res.data;
      setProductToEdited(product);
    };

    fetchProductById(productId);
  }, [productId]);

  if (!productToEdited) {
    return <div>Loading</div>;
  }

  return (
    <Layout>
      <h1>Edit product</h1>
      <ProductForm product={productToEdited} action={SubmitAction.PUT} />
      {errorUpdate && <div>Error while updating a product</div>}
    </Layout>
  );
};

export default Editproduct;
