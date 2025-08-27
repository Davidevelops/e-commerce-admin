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

export default function SignUpPage() {
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-sky-50 to-purple-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-8 sm:px-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Create Account
          </h1>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="input-group">
              <CustomInput
                Icon={User}
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="input-group">
              <CustomInput
                Icon={AtSign}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="input-group">
              <CustomInput
                Icon={Lock}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>

            {error && (
              <p className="text-red-600 font-medium text-sm mt-2">{error}</p>
            )}

            <div className="input-group mt-4">
              <PasswordStrengthMeter password={password} />
            </div>

            <Button
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-3 text-base font-medium"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </div>
        <div className="bg-gray-100 px-6 py-4 text-center">
          <p className="text-gray-700 text-sm">
            Already have an account?{" "}
            <Link
              href="/log-in"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
