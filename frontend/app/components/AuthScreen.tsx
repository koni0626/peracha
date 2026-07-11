import type { FormEvent } from "react";

import { AuthForm } from "./AuthForm";
import { AuthModeTabs } from "./AuthModeTabs";


type AuthScreenProps = {
  authMode: "login" | "register";
  name: string;
  email: string;
  password: string;
  error: string | null;
  setAuthMode: (mode: "login" | "register") => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};


export function AuthScreen({
  authMode,
  name,
  email,
  password,
  error,
  setAuthMode,
  setName,
  setEmail,
  setPassword,
  onSubmit,
}: AuthScreenProps) {
  return (
    <main className="authShell">
      <section className="authPanel">
        <div>
          <p className="eyebrow">ペラチャ</p>
          <h1>言いたいことを、伝わる一枚へ。</h1>
        </div>

        <AuthModeTabs authMode={authMode} setAuthMode={setAuthMode} />

        <AuthForm
          authMode={authMode}
          email={email}
          error={error}
          name={name}
          password={password}
          setEmail={setEmail}
          setName={setName}
          setPassword={setPassword}
          onSubmit={onSubmit}
        />
      </section>
    </main>
  );
}
