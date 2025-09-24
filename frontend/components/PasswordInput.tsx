"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  name?: string;
  id?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export function PasswordInput({ name, id, placeholder, value, onChange }: Props) {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!value) {
      setError("");
      return;
    }
    if (!strongPasswordRegex.test(value)) {
      setError(
        "Must be at least 8 chars, include uppercase, lowercase, number & special char"
      );
    } else {
      setError("");
    }
  }, [value]);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        autoComplete="new-password"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        tabIndex={-1}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
