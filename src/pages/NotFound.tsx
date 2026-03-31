import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Seo from "@/components/Seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <Seo
        title="SP Traditional Pickles | Page Not Found"
        description="The page you are looking for could not be found."
      />

      <div className="w-full max-w-xl rounded-[2rem] bg-white px-8 py-12 text-center shadow-md ring-1 ring-[#eadfce]">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#fff4e4] text-[#8B0000]">
          <AlertCircle className="h-8 w-8" />
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.26em] text-[#8d5a17]">
          404 Error
        </p>
        <h1 className="mt-3 font-heading text-4xl font-semibold text-[#241612]">
          Page not found
        </h1>
        <p className="mt-4 text-base leading-8 text-[#6b5643]">
          The page you opened does not exist or may have moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#8B0000] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#6f0000]"
        >
          Return to home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
