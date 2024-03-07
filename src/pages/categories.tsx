import React, {
  ChangeEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import Layout from "@/components/Layout";
import axios from "axios";
import { CategoryType } from "../../types";
import Modal from "@/components/Modal";

type Props = {};

type PropertyType = {
  name: string;
  values: string;
};

const Categories = (props: Props) => {
  const [isSaving, setSaving] = useState(false);

  const [category, setCategory] = useState<string>("");
  const [parentCategory, setParentCategory] = useState<string>("");
  const [editedCategory, setEditedCategory] = useState<CategoryType>();
  const [deletedCategory, setDeletedCategory] = useState<CategoryType>();
  const [loadedCaterories, setLoadedCategories] = useState<CategoryType[]>([]);
  const [properties, setProperties] = useState<PropertyType[]>([]);

  const [isOpenModal, setOpenModal] = useState(false);

  const saveCategoryHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    //validation caterogy
    if (category.length > 2) {
      let data: any = { category };

      if (parentCategory) {
        data = { ...data, parentCategory };
      }

      if (properties) {
        data = {
          ...data,
          properties: properties.map((p) => ({
            name: p.name,
            values: p.values.split(","),
          })),
        };
      }

      if (editedCategory) {
        try {
          data = { ...data, _id: editedCategory._id };
          setSaving(true);
          await axios.put("/api/categories", data);
          setCategory("");
          setEditedCategory(undefined);
          setProperties([]);
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
          setProperties([]);
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
      .get("/api/categories")
      .then((res) => {
        setLoadedCategories(res.data);
      })
      .catch((error) => {
        console.log("error while fetching  categories.");
      });
  };

  const EditCategoryHandler = (category: CategoryType) => {
    setEditedCategory(category);

    const properties = category.properties?.map((propperty) => {
      let values = propperty.values.join(",");
      let name = propperty.name;
      return {
        name,
        values,
      };
    });

    setProperties(properties || []);
    setCategory(category.name);
    setParentCategory(category.parent?._id || "");
  };

  const CloseModal = () => {
    setOpenModal(false);
  };

  const confirmDeleteHandler = (category: CategoryType) => {
    setDeletedCategory(category);
    setOpenModal(true);
  };

  const DeleteCategoryHandler = async (category: CategoryType) => {
    try {
      await axios.delete(`/api/categories?categoryId=${category._id}`);
      setDeletedCategory(undefined);
      fetchCategories();
    } catch (error) {
      console.log("Error occur while deleting a category.");
    }
  };

  const addPropertyHandler = () => {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  };

  const propertyNameChangeHandler = (index: number, newName: string) => {
    setProperties((prev) => {
      let properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  };

  const propertyValueChangeHandler = (index: number, newValue: string) => {
    setProperties((prev) => {
      let properties = [...prev];
      properties[index].values = newValue;
      return properties;
    });
  };

  const removePropertyHandler = (index: number) => {
    setProperties((prev) => {
      let newProperties = [...prev].filter((prop, i) => i !== index);
      return newProperties;
    });
  };

  useEffect(() => {
    fetchCategories();

    // if (loadedCaterories) {
    //  const properties = loadedCaterories.map((cat) => {
    //     cat.properties;
    //   });

    // }
  }, []);

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : `Create  new category `}
      </label>

      <form onSubmit={saveCategoryHandler} className="flex  flex-col gap-2">
        <div className="flex gap-1">
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
        </div>
        <div className="">
          <label className="block">Properties</label>
          <button
            type="button"
            className="btn-default"
            onClick={addPropertyHandler}
          >
            ADD New Properties
          </button>
          {properties &&
            properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <input
                  type="text"
                  className="mb-0"
                  placeholder="property name"
                  value={property.name}
                  onChange={(e) =>
                    propertyNameChangeHandler(index, e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="property value"
                  className="mb-0"
                  value={property.values}
                  onChange={(e) =>
                    propertyValueChangeHandler(index, e.target.value)
                  }
                />
                <button
                  className="btn-default"
                  type="button"
                  onClick={() => removePropertyHandler(index)}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        <div className="flex gap-2 mt-2">
          {editedCategory && (
            <button
              type="button"
              className="btn-default"
              onClick={() => {
                setEditedCategory(undefined);
                setCategory("");
                setProperties([]);
                setParentCategory("");
              }}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1  w-[100px] ">
            Save
          </button>
        </div>
      </form>

      {loadedCaterories && loadedCaterories.length > 0 && !editedCategory && (
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
                    onClick={() => confirmDeleteHandler(category)}
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
      )}

      {isOpenModal && deletedCategory && (
        <Modal
          onClose={CloseModal}
          category={deletedCategory}
          onDelete={DeleteCategoryHandler}
        />
      )}
    </Layout>
  );
};

export default Categories;
