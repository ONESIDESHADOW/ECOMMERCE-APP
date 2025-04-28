import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState("");

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const checkPasswordStrength = (pass) => {
    if (pass.length < 8) return "Weak";
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass))
      return "Strong";
    return "Medium";
  };

  useEffect(() => {
    if (currentState === "Sign Up") {
      setStrength(checkPasswordStrength(password));
    }
  }, [password]);

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(email)) {
      toast.error("Invalid email format");
      return setLoading(false);
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return setLoading(false);
    }

    try {
      const url = backendUrl + (currentState === "Sign Up" ? "/api/user/register" : "/api/user/login");
      const payload = currentState === "Sign Up" ? { name, email, password } : { email, password };

      const { data } = await axios.post(url, payload);

      if (data.success) {
        setToken(data.token);
      
        // if (rememberMe) {
        //   localStorage.setItem("token", data.token);
        //   localStorage.setItem("remember", "true");
        // } else {
        //   localStorage.removeItem("token");
        //   localStorage.removeItem("remember");
        // }
      
        toast.success("Success!");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Sign Up" && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-800"
          required
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`w-full px-3 py-2 border ${validateEmail(email) || !email ? "border-gray-800" : "border-red-500"}`}
        required
      />

      <div className="w-full relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-3 py-2 border ${password.length >= 8 || !password ? "border-gray-800" : "border-red-500"}`}
          required
        />
        <span
          className="absolute right-3 top-2.5 text-sm cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? "🙈" : "👁️"}
        </span>
      </div>

      {currentState === "Sign Up" && (
        <>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-3 py-2 border ${
              confirmPassword === password || !confirmPassword ? "border-gray-800" : "border-red-500"
            }`}
            required
          />
          <div className="w-full text-sm">
            Password Strength:{" "}
            <span
              className={
                strength === "Strong"
                  ? "text-green-600"
                  : strength === "Medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }
            >
              {strength}
            </span>
          </div>
        </>
      )}

      <div className="w-full flex justify-between text-sm">
        {/* <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          Remember Me
        </label> */}

        <p
          className="cursor-pointer "
          onClick={() => navigate("/reset-password")}
        >
          Forgot Password?
        </p>
      </div>

      <button
        className="bg-black text-white font-light px-8 py-2 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Loading..." : currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>

      <p
        onClick={() => setCurrentState(currentState === "Login" ? "Sign Up" : "Login")}
        className="cursor-pointer text-sm "
      >
        {currentState === "Login" ? "Create Account" : "Login Here"}
      </p>
    </form>
  );
};

export default Login;
