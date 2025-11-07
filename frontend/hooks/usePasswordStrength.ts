import { useState, useEffect } from "react";

export function usePasswordStrength(password: string) {
  const [strength, setStrength] = useState("");

  useEffect(() => {
    if (!password) setStrength("");
    else if (password.length < 6) setStrength("Weak");
    else if (/[A-Z]/.test(password) && /[0-9]/.test(password) && password.length >= 8)
      setStrength("Strong");
    else setStrength("Medium");
  }, [password]);

  return strength;
}
