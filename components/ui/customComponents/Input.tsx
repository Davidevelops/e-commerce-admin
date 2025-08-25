import React, { ReactElement } from "react";
import { Input } from "@/components/ui/input";
type Props = {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function CustomInput({ Icon, ...props }: Props) {
  return (
    <div className="relative">
      <span className="absolute left-1 top-1/2 -translate-y-1/2 border-r p-1">
        <Icon className="text-blue-500" />
      </span>
      <Input {...props} className="pl-10 bg-white"></Input>
    </div>
  );
}
