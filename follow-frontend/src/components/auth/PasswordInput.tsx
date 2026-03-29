import { useState } from "react";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-white/80">
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="current-password"
          className="h-12 w-full rounded-2xl border border-white/12 bg-white/8 px-4 pr-16 text-sm text-white outline-none transition duration-200 placeholder:text-white/30 focus:border-cyan-300/45 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs font-medium text-cyan-200/90 transition hover:bg-white/8 hover:text-cyan-100"
        >
          {show ? "Ẩn" : "Hiện"}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;