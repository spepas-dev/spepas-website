import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/common/Breadcrumb"; // Update path if necessary
import { signupAPI } from "@/lib/auth";
 
// Helper to ensure messages are strings.
const getMessage = (msg: unknown): string => {
  if (typeof msg === "object" && msg !== null) {
    try {
      return JSON.stringify(msg);
    } catch (error) {
      return String(msg);
    }
  }
  return String(msg);
};

interface FormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  user_type: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    user_type: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    // if (formData.password !== formData.retypePassword) {
    //   setError("Passwords do not match.");
    //   return;
    // }

    setLoading(true);

    try {
      const result = await signupAPI(formData);
      // Assume the API returns an OTP ID as result.data.
      const otpID = result.data;
      localStorage.setItem("otpID", otpID);
      navigate("/auth/activate");
    } catch (err) {
      console.error("Error during signup:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title="Signup" pages={["Signup"]} />
      <section className="overflow-hidden bg-white">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-md p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-3xl text-dark mb-1.5">
                Create an Account
              </h2>
              <p>Enter your detail below</p>
            </div>
            <div className="mt-5.5">
              <form onSubmit={handleSubmit}>
                {error && (
                  <p className="text-red-500 mb-4">{getMessage(error)}</p>
                )}
                <div className="mb-5">
                  <label htmlFor="name" className="block mb-2.5">
                    Full Name <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Email Address <span className="text-red">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Password <span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="on"
                    className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                  />
                </div>
                {/* <div className="mb-5.5">
                  <label htmlFor="retypePassword" className="block mb-2.5">
                    Re-type Password <span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    name="retypePassword"
                    id="retypePassword"
                    placeholder="Re-type your password"
                    value={formData.retypePassword}
                    onChange={handleChange}
                    autoComplete="on"
                    className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                  />
                </div> */}
                <div className="mb-5">
                  <label htmlFor="phoneNumber" className="block mb-2.5">
                    Phone Number <span className="text-red">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="user_type" className="block mb-2.5">
                    User Type <span className="text-red">*</span>
                  </label>
                  <select
                    name="user_type"
                    id="user_type"
                    value={formData.user_type}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5"
                  >
                    <option value="">Select user type</option>
                    <option value="BUYER">Buyer</option>
                    <option value="SELLER">Seller</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg mt-7.5"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
                <p className="text-center mt-6">
                  Already have an account?{" "}
                  <Link to="/auth/signin" className="text-dark hover:text-blue">
                    Sign in Now
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
