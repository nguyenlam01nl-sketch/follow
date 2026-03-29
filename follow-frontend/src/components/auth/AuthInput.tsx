type Props = {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

function AuthInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-white/80">
        {label}
      </label>

      <div className="group relative">
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={name}
          className="h-12 w-full rounded-2xl border border-white/12 bg-white/8 px-4 text-sm text-white outline-none ring-0 transition duration-200 placeholder:text-white/30 focus:border-cyan-300/45 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
        />

        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/25 transition group-focus-within:text-cyan-300/70">
          ✦
        </div>
      </div>
    </div>
  );
}

export default AuthInput;