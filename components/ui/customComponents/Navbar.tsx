"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../button";
import { useAuthStore } from "@/lib/authStore";
import { LayoutDashboard, Package, Boxes } from "lucide-react";
export default function Navbar() {
  const { logout } = useAuthStore();

  const handleLogOut = () => {
    logout();
  };

  return (
    <div className="bg-gray-700 flex justify-between flex-col items-center">
      <nav className="text-white font-semibold flex flex-col gap-3 p-3 mt-10">
        <Link href={"/dashboard"} className="flex gap-1">
          <LayoutDashboard />
          Dashboard
        </Link>
        <Link href={"/orders"} className="flex gap-1">
          <Package />
          Orders
        </Link>
        <Link href={"/productList"} className="flex gap-1">
          <Boxes />
          Products
        </Link>
      </nav>
      <div>
        <Button type="button" onClick={handleLogOut} className="mb-3">
          Log out
        </Button>
      </div>
    </div>
  );
}
