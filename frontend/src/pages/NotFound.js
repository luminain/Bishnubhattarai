import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#07080A] px-5">
      <div className="text-center">
        <div className="lux-kicker">404</div>
        <h1 className="font-serif text-5xl mt-3 text-[#E7EBF2]">This road doesn't exist.</h1>
        <p className="mt-3 text-[#C9D0DB]">Let's get you back to the lobby.</p>
        <Link to="/" className="btn-lux-primary inline-flex items-center justify-center h-11 px-6 rounded-md text-sm mt-8">
          Back to home
        </Link>
      </div>
    </main>
  );
}
