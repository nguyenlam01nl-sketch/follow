import { Link } from "react-router-dom";

type Props = {
  text: string;
  linkText: string;
  to: string;
};

function AuthSwitch({ text, linkText, to }: Props) {
  return (
    <p className="mt-5 text-center text-sm text-white/55">
      {text}{" "}
      <Link
        to={to}
        className="font-medium text-cyan-300 transition hover:text-cyan-200"
      >
        {linkText}
      </Link>
    </p>
  );
}

export default AuthSwitch;