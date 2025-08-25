"use client";
import { useAuthStore } from "@/lib/authStore";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AtSign, Loader, ArrowLeft, Mail } from "lucide-react";
import CustomInput from "@/components/ui/customComponents/Input";
import Link from "next/link";
export default function page() {
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const { isLoading, forgotpassword } = useAuthStore();

  const handleForgotPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    forgotpassword(email);
    setSubmitted(true);
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="rounded overflow-hidden">
        <div className="container border w-screen p-4 max-w-lg min-w-md shadow bg-gray-200">
          {!submitted ? (
            <form onSubmit={handleForgotPassword}>
              <h1 className="text-center my-3 text-3xl font-bold">
                Forgot Password
              </h1>
              <CustomInput
                Icon={AtSign}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex justify-center mt-3">
                <Button type="submit">
                  {isLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Send Verification"
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex item-center justify-center my-2">
                <div className="bg-slate-800 rounded-full p-3">
                  <Mail className=" size-20   text-white" />
                </div>
              </div>
              <p className="text-lg">
                If an account exist for <strong>{email}</strong>, you will
                receive a password reset shortly.
              </p>
            </div>
          )}
        </div>
        <div className="text-center bg-gray-300 p-2">
          <Link
            href={"/log-in"}
            className="text-md text-blue-500 font-semibold flex items-center justify-center"
          >
            <ArrowLeft />
            Back to log in
          </Link>
        </div>
      </div>
    </div>
  );
}
