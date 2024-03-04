import React, { FormEventHandler, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import axios from "axios";
import { CategoryType } from "../../types";

type Props = {};

const Categories = (props: Props) => {
  const [isSaving, setSaving] = useState(false);

  const [category, setCategory] = useState<string>("");
  const [parentCategory, setParentCategory] = useState<string>("");
  const [editedCategory, setEditedCategory] = useState<CategoryType>();
  const [loadedCaterories, setLoadedCategories] = useState<CategoryType[]>([]);

  const saveCategoryHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    //validation caterogy
    if (category.length > 2) {
      let data = { name: category, parent: parentCategory };

      if (editedCategory) {
        try {
          setSaving(true);
          await axios.put("/api/categories", {
            ...data,
            _id: editedCategory._id,
          });
          setCategory("");
          setEditedCategory(undefined);
          setParentCategory("");
          setSaving(false);
          fetchCategories();
        } catch (error) {
          console.log("Error while updating category.");
        }
      } else {
        try {
          setSaving(true);
          await axios.post("/api/categories", data);
          setCategory("");
          setEditedCategory(undefined);
          setParentCategory("");
          setSaving(false);
          fetchCategories();
        } catch (error) {
          setSaving(false);
          console.log("error while saving new category");
        }
      }
    }
  };

  const fetchCategories = () => {
    axios
      .get("api/categories")
      .then((res) => {
        setLoadedCategories(res.data);
      })
      .catch((error) => {
        console.log("error while fetching  categories.");
      });
  };

  const EditCategoryHandler = (category: CategoryType) => {
    setEditedCategory(category);
    setCategory(category.name);
    setParentCategory(category.parent?._id || "");
  };

  const DeleteCategoryHandler = async (category: CategoryType) => {
    try {
      await axios.delete(`/api/categories?categoryId=${category._id}`);
      fetchCategories();
    } catch (error) {
      console.log("Error occur while deleting a category.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : `Create  new category `}
      </label>

      <form onSubmit={saveCategoryHandler} className="flex gap-1">
        <input
          type="text"
          placeholder="Category name"
          className="mb-0"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        />
        <select
          className="mb-0"
          name="parentCategory   "
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
        >
          <option>No parent category</option>
          {loadedCaterories?.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit" className="btn-primary py-1 ">
          Save
        </button>
      </form>

      {loadedCaterories && loadedCaterories.length > 0 ? (
        <table className="mt-4  rounded-md basic">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent Category</td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {loadedCaterories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    className=" flex gap-2 items-center btn-primary"
                    onClick={() => EditCategoryHandler(category)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="btn-red flex gap-2 items-center"
                    onClick={() => DeleteCategoryHandler(category)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No category to display</div>
      )}
    </Layout>
  );
};

export default Categories;
