import type { ChangeEvent, FocusEvent } from "react";

import type { User } from "../types";

type WorkTableUserSelectProps = {
  value: string;
  userOptions: User[];
  onChange: (value: string) => void;
  onBlur?: (value: string) => void | Promise<void>;
};

export function WorkTableUserSelect({ value, userOptions, onChange, onBlur }: WorkTableUserSelectProps) {
  const currentUser = userOptions.find((user) => user.name === value || user.id === value || user.email === value);
  const hasCurrentValue = !value || userOptions.some((user) => user.name === value);

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange(event.target.value);
  }

  function handleBlur(event: FocusEvent<HTMLSelectElement>) {
    if (onBlur) {
      void onBlur(event.target.value);
    }
  }

  return (
    <select value={value} onChange={handleChange} onBlur={handleBlur}>
      <option value="">未選択</option>
      {!hasCurrentValue ? <option value={value}>{currentUser?.name ?? value}</option> : null}
      {userOptions.map((user) => (
        <option value={user.name} key={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  );
}
