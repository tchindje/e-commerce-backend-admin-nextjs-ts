import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import { ProductType, SubmitAction } from "../../../types";

type Props = {};

const NewProduct = (props: Props) => {
  const product: ProductType = {
    title: "",
    description: "",
    price: 0,
  };
  return (
    <Layout>
      <h1>New Product</h1>
      <ProductForm product={product} action={SubmitAction.POST} />
    </Layout>
  );
};

export default NewProduct;
