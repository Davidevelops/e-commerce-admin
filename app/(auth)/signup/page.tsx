"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/customComponents/Input";
import { AtSign, User, Lock, Loader } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import PasswordStrengthMeter from "@/components/ui/customComponents/PasswordStrengthMeter";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";

export default function page() {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { signup, error, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signup(email, password, name);
      router.push("/email-verification");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-sky-50 to-purple-300">
      <div className="form-container overflow-hidden rounded-2xl">
        <form
          onSubmit={handleSignUp}
          className="max-w-3xl min-w-xl p-8 shadow bg-white"
        >
          <h1 className="text-3xl font-semibold text-center my-8">
            Create Account
          </h1>
          <div className="input-group my-3">
            <CustomInput
              Icon={User}
              type="string"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-group my-3">
            <CustomInput
              Icon={AtSign}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group my-3">
            {" "}
            <CustomInput
              Icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          <div className="input-group mt-5">
            <PasswordStrengthMeter password={password} />
          </div>
          <Button
            className="w-full mt-6 bg-blue-500"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? <Loader className="animate-spin" /> : "Sign Up"}
          </Button>
        </form>
        <div className="bg-gray-200 p-2">
          <p className="text-center">
            Already have an account?{" "}
            <Link href={"/log-in"} className="text-blue-700 font-bold">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
