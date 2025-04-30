import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useAuth } from "@/features/auth";

const Signin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title="Sign In" pages={["Sign In"]} />
      <section className="overflow-hidden bg-white">
        <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-md p-6 sm:p-7.5 xl:p-11">
          <div className="text-center mb-11">
            <h2 className="font-semibold text-xl sm:text-2xl xl:text-3xl text-dark mb-1.5">
              Sign In
            </h2>
            <p>Enter your credentials below</p>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2.5">
                Email Address <span className="text-red">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                required
              />
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="block mb-2.5">
                Password <span className="text-red">*</span>
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-7.5"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <p className="text-center mt-6">
              Don&apos;t have an account?{" "}
              <Link to="/auth/signup" className="text-dark hover:text-blue pl-2">
                Sign Up Now!
              </Link>
            </p>
            
            <p className="text-center mt-6">
              Forgot your password?{" "}
              <Link to="/auth/forgot-password" className="text-dark hover:text-blue">
                Reset it here
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
};

export default Signin;
