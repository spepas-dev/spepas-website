import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/common/Breadcrumb";
import { forgotPasswordAPI } from "@/lib/auth";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const result = await forgotPasswordAPI({ email });
      // Assume result.data contains an OTP ID or similar identifier
      localStorage.setItem("otpID", result.data);
      setMessage("Reset link sent successfully. Please check your email.");
      navigate("/auth/reset-password");
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title="Forgot Password" pages={["Forgot Password"]} />
      <section className="overflow-hidden bg-white">
        <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-md p-6 sm:p-7.5 xl:p-11">
          <div className="text-center mb-11">
            <h2 className="font-semibold text-xl sm:text-2xl xl:text-3xl text-dark mb-1.5">
              Forgot Password
            </h2>
            <p>Enter your email to receive a password reset link.</p>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {message && <p className="text-green-500 mb-4">{message}</p>}
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2.5">
                Email Address <span className="text-red">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-7.5"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
