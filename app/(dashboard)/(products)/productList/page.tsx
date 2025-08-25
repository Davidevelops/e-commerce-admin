"use client";

import { useEffect } from "react";
import { useProductStore } from "@/lib/productStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CirclePlus, Loader, Pencil, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProductList() {
  const { products, error, isLoading, getProduct, deleteProduct } =
    useProductStore();
  const router = useRouter();

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  if (isLoading)
    return (
      <div className="h-full flex justify-center items-center ">
        <Loader className="animate-spin" />
      </div>
    );
  if (error) return <p>{error}</p>;
  const handleDelete = (productID: string) => {
    deleteProduct(productID);
  };
  return (
    <div className="border max-h-screen overflow-x-auto p-4">
      <div className="flex justify-between flex-wrap p-3">
        <h1 className="text-xl font-semibold mb-4">Product List</h1>
        <Link
          href="/addProduct"
          className=" border rounded-2xl flex gap-1 bg-blue-500 items-center hover:bg-blue-600 p-2 text-white transition-colors duration-300"
        >
          {" "}
          <CirclePlus />
          Add Product
        </Link>
      </div>

      {products && products.length > 0 ? (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Price</th>
              <th className="border px-4 py-2 text-left">Created At</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">${product.price}</td>
                <td className="border px-4 py-2">
                  {new Date(product.createdAt).toLocaleString()}
                </td>
                <td className="flex justify-center  border p-1 gap-2 flex-wrap">
                  <Link
                    href={`editProduct/${product._id}`}
                    className="bg-green-500 hover:bg-green-600 p-1 flex gap-1 items-center text-white rounded px-2 transition-colors duration-200"
                  >
                    <Pencil className="size-5" />
                    Edit
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger className="bg-red-500 text-white rounded p-1 flex gap-1 hover:bg-red-600  transition-colors duration-200 items-center">
                      <Trash /> Delete
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the product remove the data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => handleDelete(product._id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
}
