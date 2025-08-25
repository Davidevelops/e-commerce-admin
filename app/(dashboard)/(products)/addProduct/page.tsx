"use client";

import { useProductStore } from "@/lib/productStore";
import { useState, useEffect } from "react";
import { Plus, Loader, CirclePlus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function AddProduct() {
  const { isLoading, error, addProduct } = useProductStore();
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [imageURL, setImageURL] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [properties, setProperties] = useState<
    { key: string; value: string }[]
  >([]);
  const [isPopular, setIsPopular] = useState(false);

  const addProperties = () => {
    setProperties((prev) => [...prev, { key: "", value: "" }]);
  };

  const handlePropertyNameChange = (newName: string, index: number) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].key = newName;
      return properties;
    });
  };

  const handlePropertyValueChange = (newValue: string, index: number) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].value = newValue;
      return properties;
    });
  };

  const handleRemoveProperty = (index: number) =>
    setProperties((prev) => prev.filter((_, i) => i !== index));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "e-commecre");
    data.append("cloud_name", "dalbisegj");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dalbisegj/image/upload",
        { method: "POST", body: data }
      );
      const uploadedImageURL = await res.json();
      setImageURL((prev) => [...prev, uploadedImageURL.secure_url]);
    } catch (error) {
      console.log("Error uploading image: ", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageURL((prev) => prev.filter((_, URLindex) => URLindex !== index));
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !description.trim() ||
      !price ||
      imageURL.length === 0
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      await addProduct(
        name,
        description,
        properties,
        category,
        price,
        imageURL,
        isPopular // ✅ Send checkbox value
      );

      toast.success("Product added successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl h-screen overflow-y-scroll">
      {isLoading ? (
        <div className="h-full flex justify-center items-center">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <form className="p-3 mt-10" onSubmit={handleAddProduct}>
          {/* File Upload */}
          <h1 className="font-semibold">Images</h1>
          <div className="uploads-wrapper flex items-center gap-2 flex-wrap">
            <label className="flex p-2 border-2 border-dashed my-2 w-[200px] h-[250px] items-center justify-center rounded-xl">
              {uploading ? (
                <div className="flex flex-col items-center justify-center p-2">
                  <Loader className="animate-spin" />
                  <p className="text-xs text-gray-600">Uploading image...</p>
                </div>
              ) : (
                <Plus className="size-14 text-gray-500" />
              )}
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>

            {/* Display uploaded images */}
            {imageURL.map((url, index) => (
              <div className="relative group" key={index}>
                <img
                  src={url}
                  alt="product image"
                  className="w-[200px] h-[250px] rounded-xl object-contain border hover:brightness-50 transition-all duration-200"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-200 z-10 rounded-2xl"></div>
                <Button
                  type="button"
                  className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 z-20 group-hover:bg-black transition-all duration-300"
                  onClick={() => removeImage(index)}
                >
                  <Trash />
                  Delete
                </Button>
              </div>
            ))}
          </div>

          {/* Input Group */}
          <div className="input-group">
            <h1 className="font-semibold mt-3">Name</h1>
            <input
              type="text"
              placeholder="name"
              className="border w-full p-3 rounded-xl"
              onChange={(e) => setName(e.target.value)}
            />

            <h1 className="font-semibold mt-3">Description</h1>
            <textarea
              name="description"
              id="description"
              placeholder="description"
              className="border w-full rounded h-[200px] p-2"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <h1 className="font-semibold">Price</h1>
            <input
              type="number"
              placeholder="price"
              className="border w-full rounded p-3"
              onChange={(e) => setPrice(Number(e.target.value))}
            />

            <h1 className="mt-3 font-semibold">Category</h1>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="table">Table</SelectItem>
                <SelectItem value="sofa">Sofa</SelectItem>
                <SelectItem value="lighting">Lighting</SelectItem>
                <SelectItem value="bed">Bed</SelectItem>
                <SelectItem value="chair">Chair</SelectItem>
                <SelectItem value="wardrobe">Wardrobe</SelectItem>
              </SelectContent>
            </Select>

            {/* ✅ Popular Checkbox */}
            <div className="flex items-center gap-2 mt-4">
              <Checkbox
                id="isPopular"
                checked={isPopular}
                onCheckedChange={(checked) => setIsPopular(Boolean(checked))}
              />
              <label
                htmlFor="isPopular"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Mark as Popular
              </label>
            </div>
          </div>

          <h1 className="mt-3 font-semibold">Properties</h1>
          <Button
            type="button"
            onClick={addProperties}
            className="bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
          >
            <CirclePlus /> Add properties
          </Button>

          {properties.map((property, index) => (
            <div className="properties-container flex items-center" key={index}>
              <input
                type="text"
                placeholder="property name"
                className="border rounded p-2 my-2 me-2"
                value={property.key}
                onChange={(e) =>
                  handlePropertyNameChange(e.target.value, index)
                }
              />
              <input
                type="text"
                placeholder="property value"
                className="border rounded p-2 my-2 me-2"
                value={property.value}
                onChange={(e) =>
                  handlePropertyValueChange(e.target.value, index)
                }
              />
              <Button
                type="button"
                onClick={() => handleRemoveProperty(index)}
                className="bg-red-500 hover:bg-red-600 transition-colors duration-200"
              >
                <Trash />
              </Button>
            </div>
          ))}

          {/* Buttons */}
          <div className="buttons flex justify-between my-10">
            <Button
              className="bg-red-500 hover:bg-red-600 transition-colors duration-300"
              onClick={() => router.push("/productList")}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 transition-colors duration-300"
            >
              Add Product
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
