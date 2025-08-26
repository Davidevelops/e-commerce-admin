"use client";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import { userOrderStore } from "@/lib/orderStore";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const {
    orders,
    isLoading,
    getOrders,
    error,
    updatePaymentStatus,
    updateOrderStatus,
  } = userOrderStore();

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || !user?.isVerified)) {
      router.push("/signup");
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  if (isCheckingAuth) {
    return <div>Checking authentication...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders && orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Products</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Payment Method</th>
                <th className="p-2 border">Payment Status</th>
                <th className="p-2 border">Order Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id} className="text-center">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">
                    {order.shippingAddress.fullname}
                  </td>
                  <td className="p-2 border text-left">
                    {order.products.map((p) => (
                      <div key={p.product} className="text-sm">
                        {p.name} × {p.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="p-2 border">₱{order.totalAmount}</td>
                  <td className="p-2 border">{order.paymentMethod}</td>

                  {/* Payment Status */}
                  <td className="p-2 border">
                    <div className="flex justify-center">
                      <Select
                        defaultValue={order.paymentStatus}
                        onValueChange={(value) =>
                          updatePaymentStatus(order._id, value)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>

                  {/* Order Status */}
                  <td className="p-2 border">
                    <div className="flex justify-center">
                      <Select
                        defaultValue={order.orderStatus}
                        onValueChange={(value) =>
                          updateOrderStatus(order._id, value)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}
