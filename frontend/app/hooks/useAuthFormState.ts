import { useState } from "react";

export type AuthMode = "login" | "register";

export function useAuthFormState() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return {
    authMode,
    email,
    name,
    password,
    setAuthMode,
    setEmail,
    setName,
    setPassword,
  };
}
