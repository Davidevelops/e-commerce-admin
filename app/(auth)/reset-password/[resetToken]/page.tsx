"use client";
import { useState } from "react";
import { useAuthStore } from "@/lib/authStore";
import CustomInput from "@/components/ui/customComponents/Input";
import { useParams } from "next/navigation";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
export default function page() {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { resetpassword, error, isLoading } = useAuthStore();
  const params = useParams<{ resetToken: string }>();
  const router = useRouter();
  const token = params.resetToken;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password do not match");
      return;
    }
    try {
      await resetpassword(token, password);
      toast.success("Password reset successful, redirecting...");
      setTimeout(() => {
        router.push("/log-in");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        {token}
        <CustomInput
          Icon={Lock}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <CustomInput
          Icon={Lock}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p className="text-red-500 font-semibold">{error}</p>}
        <Button type="submit">Set new password</Button>
      </form>
    </div>
  );
}
