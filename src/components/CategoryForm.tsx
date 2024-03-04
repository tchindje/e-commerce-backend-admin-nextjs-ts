import React, { ChangeEventHandler, FormEventHandler, useState } from "react";
import { CategoryType } from "../../types";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  category: CategoryType;
};

const CategoryForm = ({ category }: Props) => {
  const router = useRouter();
  const [name, setName] = useState<string>(category.name || "");
  const [parentCat, setParentCar] = useState<CategoryType | undefined>(
    category.parent
  );

  const editParentHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    setParentCar((prevParent) => {
      return {
        ...prevParent,
        name: e.target.value,
      };
    });
  };

  const editFormHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    //validation
    if (name.length > 2) {
      const data = { _id: category._id, name, parent: parentCat?._id };
      const res = await axios.put("/api/categories", data);
      console.log(res.data);
      router.push("/categories");
    }
  };

  const CancelHandler = () => {
    router.push("/categories");
  };

  return (
    <form className="flex gap-1 flex-col" onSubmit={editFormHandler}>
      <div className="flex flex-col gap-1">
        <label className="w-[150px]">Category Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {parentCat && (
        <div className="flex flex-col gap-1">
          <label>Parent Category Name</label>
          <input
            type="text"
            value={parentCat.name}
            onChange={editParentHandler}
          />
        </div>
      )}

      <div className="flex gap-2 w-full justify-center ">
        <button className="btn-primary">Save</button>
        <button
          className="rounded-md bg-red-500 text-white px-3 py-2"
          onClick={CancelHandler}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
