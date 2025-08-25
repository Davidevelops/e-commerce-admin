"use client";

import { useProductStore } from "@/lib/productStore";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader, Plus, Trash, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch"; // ✅ Import Switch
import { Label } from "@/components/ui/label"; // ✅ Import Label

export default function EditProduct() {
  const params = useParams();
  const productId = params.id as string;
  const { getSingleProduct, product, isLoading, updateProduct } =
    useProductStore();
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [imageURL, setImageURL] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [isPopular, setIsPopular] = useState(false); // ✅ Added state
  const [properties, setProperties] = useState<
    { key: string; value: string }[]
  >([]);

  // Fetch product
  useEffect(() => {
    if (productId) getSingleProduct(productId);
  }, [productId, getSingleProduct]);

  // Populate local state from fetched product
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || 0);
      setProperties(product.properties || []);
      setCategory(product.category || "");
      setImageURL(product.imageUrl || []);
      setIsPopular(product.isPopular || false); // ✅ Pre-fill popular toggle
    }
  }, [product]);

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
        {
          method: "POST",
          body: data,
        }
      );

      const uploadedImageURL = await res.json();
      setImageURL((prev) => [...prev, uploadedImageURL.secure_url]);
    } catch (error) {
      console.log("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageURL((prev) => prev.filter((_, i) => i !== index));
  };

  const addProperties = () => {
    setProperties((prev) => [...prev, { key: "", value: "" }]);
  };

  const handlePropertyNameChange = (value: string, index: number) => {
    setProperties((prev) => {
      const updated = [...prev];
      updated[index].key = value;
      return updated;
    });
  };

  const handlePropertyValueChange = (value: string, index: number) => {
    setProperties((prev) => {
      const updated = [...prev];
      updated[index].value = value;
      return updated;
    });
  };

  const handleRemoveProperty = (index: number) => {
    setProperties((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
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
      await updateProduct(
        productId,
        name,
        description,
        properties,
        category,
        price,
        imageURL,
        isPopular // ✅ Send popular field to backend
      );
      toast.success("Product updated successfully");
      setTimeout(() => {
        router.push("/productList");
      }, 1000);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl h-screen overflow-y-scroll">
      {isLoading ? (
        <div className="h-full flex justify-center items-center">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <form className="p-3 mt-10" onSubmit={handleUpdateProduct}>
          {/* File upload */}
          <h1 className="font-semibold">Images </h1>
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
            {imageURL?.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt="product-image"
                  className="w-[200px] h-[250px] object-contain rounded-xl border hover:brightness-50 transition-all duration-200"
                />
                <div className="overlay absolute inset-0 bg-black opacity-0 group-hover:opacity-40 rounded-xl transition-opacity duration-200 z-10"></div>
                <Button
                  type="button"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:bg-black z-20"
                  onClick={() => removeImage(index)}
                >
                  <Trash />
                  Delete
                </Button>
              </div>
            ))}
          </div>

          {/* Inputs */}
          <div className="input-group">
            <h1 className="font-semibold mt-3">Name</h1>
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border w-full p-3 rounded-xl"
            />

            <h1 className="font-semibold mt-3">Description</h1>
            <textarea
              placeholder="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border w-full rounded h-[200px] p-2"
            />

            <h1 className="font-semibold">Price</h1>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="price"
              className="border w-full rounded p-3"
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

            {/* ✅ Popular Product Toggle */}
            <div className="flex items-center gap-3 mt-4">
              <Switch
                checked={isPopular}
                onCheckedChange={setIsPopular}
                id="popular-switch"
              />
              <Label htmlFor="popular-switch" className="font-semibold">
                Popular Product
              </Label>
            </div>
          </div>

          {/* Properties */}
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
                value={property.key}
                onChange={(e) =>
                  handlePropertyNameChange(e.target.value, index)
                }
                className="border rounded p-2 my-2 me-2"
              />
              <input
                type="text"
                placeholder="property value"
                value={property.value}
                onChange={(e) =>
                  handlePropertyValueChange(e.target.value, index)
                }
                className="border rounded p-2 my-2 me-2"
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
              Save Changes
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
