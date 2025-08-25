import { Check, X } from "lucide-react";

type PasswordProps = {
  password: string;
};

const PasswordCriteria = ({ password }: PasswordProps) => {
  const criteria = [
    { label: "Contains at least 6 characters", vld: password.length >= 6 },
    { label: "Contains an upper case letter", vld: /[A-Z]/.test(password) },
    { label: "Contains a lower case letter", vld: /[a-z]/.test(password) },
    { label: "Contains a number", vld: /\d/.test(password) },
    {
      label: "Contains a special character",
      vld: /[^A-aZ-z0-9]/.test(password),
    },
  ];

  return (
    <div className="">
      {criteria.map((c, index) => (
        <div key={index} className="flex items-center gap-1 px-3 mt-2">
          {c.vld ? (
            <Check className="size-4 text-green-500" />
          ) : (
            <X className="size-4 text-red-500" />
          )}
          <p className={c.vld ? "text-green-500" : "text-red-500"}>{c.label}</p>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }: PasswordProps) => {
  const getStrength = (password: string) => {
    let strength = 0;

    if (password.match(/[A-Z]/) && password.match(/[a-z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.length >= 6) strength++;
    if (password.match(/[^A-aZ-Z0-9]/)) strength++;

    return strength;
  };

  let strength = getStrength(password);

  const getStengthText = (strength: number) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  const getStrenghColor = (strength: number) => {
    if (strength === 0) return "bg-red-500";
    if (strength === 1) return "bg-red-400";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div>
      <div className="flex justify-between p-2">
        {" "}
        <span>Strength Meter</span>
        <span>
          <p>{getStengthText(strength)}</p>
        </span>
      </div>

      <div className="flex gap-1 pt-1 px-2">
        {[...Array(4)].map((_, i) => (
          <div
            className={`h-1 w-1/4 transition-colors duration-300 rounded-full ${
              i < strength ? getStrenghColor(strength) : `bg-gray-300`
            }`}
            key={i}
          />
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;
