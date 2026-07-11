import type { FormEvent } from "react";

type AuthFormProps = {
  authMode: "login" | "register";
  email: string;
  error: string | null;
  name: string;
  password: string;
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  setPassword: (password: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export function AuthForm({
  authMode,
  email,
  error,
  name,
  password,
  setEmail,
  setName,
  setPassword,
  onSubmit,
}: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="authForm">
      {authMode === "register" ? (
        <label>
          表示名
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
      ) : null}
      <label>
        メールアドレス
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label>
        パスワード
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      {error ? <p className="errorText">{error}</p> : null}
      <button className="primaryButton" type="submit">
        {authMode === "register" ? "登録して開始" : "ログイン"}
      </button>
    </form>
  );
}
