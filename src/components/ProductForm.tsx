import React, {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { CategoryType, ProductType, SubmitAction } from "../../types";
import axios from "axios";
import { File } from "buffer";
import ImagesPreview from "./ImagePreview";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Spinner from "./Spinner";

function ProductForm({
  product,
  action,
}: {
  product?: ProductType;
  action: SubmitAction;
}) {
  const [title, setTitle] = useState(product?.title || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState<number>(product?.price || 0);
  const [category, setCategory] = useState<string>(product?.category || "");
  const [listCategories, setListCategories] = useState<CategoryType[]>([]);

  const [images, setImages] = useState<File[]>([]);
  const [isUploadingFile, setUploadingFile] = useState<boolean>(false);
  const [error, setError] = useState(false);

  const [imagesUrl, setImagesUrl] = useState<string[] | undefined>(
    product?.images
  );

  let id = product?._id;

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = () => {
      axios
        .get("/api/categories")
        .then((res) => {
          setListCategories(res.data);
        })
        .catch((error) => {
          console.log("error while fetching  categories.");
        });
    };
    fetchCategories();
  }, []);

  const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    //validation input form
    if (price > 0 && description && title) {
      const data = { title, price, description, images: imagesUrl , category};

      if (action === SubmitAction.POST) {
        try {
          const res = await axios.post("/api/products", data);
          console.log(res.data.product);
          setError(false);
          return router.push("/products"); //redirect to product index
        } catch (error) {
          setError(true);
          console.log("error submit product");
        }
      }

      if (action === SubmitAction.PUT) {
        try {
          setError(false);

          const res = await axios.put("/api/products", { ...data, id });
          console.log(res.data.product);
          return router.push("/products");
        } catch (error) {
          setError(true);
          console.log("error updating new product");
        }
      }
    }
  };

  const imagesUploadHandler: ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const files = e.target?.files;
    let formData = new FormData();

    if (files && files?.length > 0) {
      //convert `FileList` to `File[]`
      const _files = Array.from(files) as unknown as File[];

      _files.forEach((image, index) => {
        formData.append("images", image as any);
      });

      try {
        setUploadingFile(true);
        let res = await axios.post("/api/upload", formData);
        setImagesUrl((oldLinks) => {
          if (oldLinks) {
            return [...oldLinks, ...res.data.links];
          } else {
            return [...res.data.links];
          }
        });
        setUploadingFile(false);
      } catch (error) {
        setUploadingFile(false);
        console.log("error while uploading iamges");
        throw error;
      }
    }
  };

  return (
    <form className="flex flex-col" onSubmit={submitHandler}>
      <label className="text-gray-800" htmlFor="name">
        Product name
      </label>
      <input
        name="name"
        id="name"
        type="text"
        placeholder="product name"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />

      <label className="text-gray-800" htmlFor="name">
        Category
      </label>

      <select
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        id=""
      >
        <option value="">Uncategorize</option>
        {listCategories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <label className="text-gray-800">photos</label>

      <div className="mb-2 flex flex-wrap  gap-2 pr-3">
        {imagesUrl && (
          <ImagesPreview images={imagesUrl} setImages={setImagesUrl} />
        )}
        {isUploadingFile && (
          <div className="h-24  p-1 flex items-center gap-1">
            <Spinner />
          </div>
        )}
        <label
          className="w-24 h-24 text-center flex flex-col items-center justify-center  text-sm gap-1 
                    cursor-pointer text-gray-500 rounded-lg bg-gray-200 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div className="">Upload</div>
          <input
            type="file"
            name="photos"
            multiple
            className="hidden"
            onChange={imagesUploadHandler}
          />
        </label>
      </div>

      <label className="text-gray-800 mt-2" htmlFor="description">
        Description
      </label>
      <textarea
        name="description"
        id="description"
        cols={30}
        rows={10}
        placeholder="Description 
          of your product"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
      ></textarea>

      <label className="text-gray-800" htmlFor="price">
        Price (FCFA)
      </label>
      <input
        name="price"
        onChange={(e) => setPrice(e.target.value as unknown as number)}
        type="number"
        min={0}
        id="price"
        placeholder="Price"
        value={price}
      />
      <button className="btn-primary  md:w-[100px]">Save</button>
    </form>
  );
}

export default ProductForm;
