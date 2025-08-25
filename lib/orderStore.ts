import { create } from "zustand";
import axios from "axios";

const API_URL = "https://e-commerce-server-rnas.onrender.com/";
axios.defaults.withCredentials = true;

export type OrderProduct = {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type ShippingAddress = {
  fullname: string;
  street: string;
  baranggay: string;
  city: string;
  province: string;
};

export type Order = {
  _id: string;
  user: string;
  products: OrderProduct[];
  totalAmount: number;
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod: "COD" | "gcash" | "paymaya";
  shippingAddress: ShippingAddress;
  orderStatus: "processing" | "shipped" | "delivered";
  createdAt?: string;
  updatedAt?: string;
};

export type orderState = {
  orders: Order[] | null;
  isLoading: boolean;
  error: string | null;
  getOrders: () => Promise<void>;
  updatePaymentStatus: (orderId: string, paymentStatus?: string) => void;
  updateOrderStatus: (orderId: string, orderStatus?: string) => void;
};

export const userOrderStore = create<orderState>((set) => ({
  orders: null,
  isLoading: false,
  error: null,

  getOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/orders`);
      set({ isLoading: false, orders: res.data.orders });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch orders",
      });
    }
  },

  updatePaymentStatus: async (orderId, paymentStatus) => {
    try {
      const res = await axios.patch(
        `${API_URL}/update-payment-status/${orderId}`,
        { paymentStatus }
      );

      const updatedPaymentStatus = res.data.updatedPaymentStatus;

      set((state) => ({
        orders: state.orders?.map((order) =>
          order._id === updatedPaymentStatus._id ? updatedPaymentStatus : order
        ),
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || `Failed to update status: ${error}`,
      });
    }
  },
  updateOrderStatus: async (orderId, orderStatus) => {
    try {
      const res = await axios.patch(
        `${API_URL}/update-order-status/${orderId}`,
        { orderStatus }
      );

      const updatedOrderStatus = res.data.updatedOrderStatus;

      set((state) => ({
        orders: state.orders?.map((order) =>
          order._id === updatedOrderStatus._id ? updatedOrderStatus : order
        ),
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || `Failed to update status: ${error}`,
      });
    }
  },
}));
