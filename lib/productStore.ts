import { create } from "zustand";
import axios from "axios";

export type Product = {
  _id: string;
  name: string | null;
  description: string | null;
  properties: { key: string; value: string }[];
  category: string;
  price: number | null;
  imageUrl?: string[] | null;
  isPopular: boolean;
  createdAt: Date;
};

export type ProductList = {
  products: Product[] | null;
  product: Product | null;
  isLoading: boolean;
  error: boolean | null;
  getProduct: () => Promise<void>;
  addProduct: (
    name: string,
    description: string,
    properties: { key: string; value: string }[],
    category: string,
    price: number,
    imageUrl?: string[],
    isPopular?: boolean
  ) => Promise<void>;
  getSingleProduct: (productId: string) => Promise<void>;
  updateProduct: (
    productId: string,
    name: string,
    description: string,
    properties: { key: string; value: string }[],
    category: string,
    price: number,
    imageUrl?: string[],
    isPopular?: boolean
  ) => Promise<void>;
  deleteProduct: (productID: string) => Promise<void>;
};

const API_URL = "https://e-commerce-server-rnas.onrender.com";

axios.defaults.withCredentials = true;

export const useProductStore = create<ProductList>((set) => ({
  products: null,
  isLoading: false,
  error: false,
  product: null,
  getProduct: async () => {
    set({ isLoading: true, error: null });

    try {
      let res = await axios.get(`${API_URL}/get-all-products`);
      set({ products: res.data.Products, isLoading: false, error: null });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response.data.message ||
          "Error while fetching all the products",
      });
    }
  },

  addProduct: async (
    name: string,
    description: string,
    properties: { key: string; value: string }[],
    category: string,
    price: number,
    imageUrl?: string[],
    isPopular?: boolean
  ) => {
    set({ isLoading: true, error: null });
    try {
      let res = await axios.post(`${API_URL}/add-product`, {
        name,
        description,
        properties,
        category,
        price,
        imageUrl,
        isPopular,
      });
      set({ isLoading: false, error: null });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response.data.message ||
          "An error occured while trying to add product",
      });
    }
  },
  getSingleProduct: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      let res = await axios.get(`${API_URL}/get-product/${productId}`);
      set({ product: res.data.product, isLoading: false, error: null });
    } catch (error: any) {
      set({ isLoading: false, error: error.response.data.message });
    }
  },
  updateProduct: async (
    productId: string,
    name: string,
    description: string,
    properties: { key: string; value: string }[],
    category: string,
    price: number,
    imageUrl?: string[],
    isPopular?: boolean
  ) => {
    set({ isLoading: true, error: null });
    try {
      let res = await axios.patch(`${API_URL}/update-product/${productId}`, {
        name,
        description,
        properties,
        category,
        price,
        imageUrl,
        isPopular,
      });
      set({ isLoading: false, error: null });
    } catch (error: any) {
      console.log(
        "An error occured while trying to update the product: ",
        error
      );
      set({ isLoading: false, error: error.response.message });
    }
  },
  deleteProduct: async (productID: string) => {
    set({ isLoading: true, error: null });
    try {
      let res = await axios.delete(`${API_URL}/delete-product/${productID}`);
      set((state) => ({
        products: state.products?.filter(
          (product) => product._id !== productID
        ),
      }));
      set({ isLoading: false, error: null });
    } catch (error: any) {
      console.log(
        "An error occured while trying to delete the product: ",
        error
      );
      set({ isLoading: false, error: error.response.message });
    }
  },
}));
