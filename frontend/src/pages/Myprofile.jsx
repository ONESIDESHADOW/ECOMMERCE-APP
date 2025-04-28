import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [profile, setProfile] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadProfileData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/user/myprofile`,
        {},
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const validatePasswordStrength = (password) => {
    return password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (!validatePasswordStrength(newPassword)) {
      return toast.error(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
      );
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/changepassword`,
        { oldPassword, newPassword },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Password updated successfully");
        setShowChangePassword(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"PROFILE"} />
      </div>

      {profile ? (
        <div className="mt-6 text-gray-700 space-y-4">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>

          <button
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="mt-4 text-sm bg-black text-white px-4 py-2"
          >
            {showChangePassword ? "Cancel" : "Change Password"}
          </button>

          {showChangePassword && (
            <form
              onSubmit={handlePasswordChange}
              className="mt-4 flex flex-col gap-3 text-sm bg-white p-4 shadow rounded-md w-full sm:w-[400px]"
            >
              {/* Old Password */}
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-800"
                />
                <span
                  className="absolute right-3 top-2 cursor-pointer"
                  onClick={() => setShowOld(!showOld)}
                >
                  {showOld ? "🙈" : "👁️"}
                </span>
              </div>

              {/* New Password */}
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-800"
                />
                <span
                  className="absolute right-3 top-2 cursor-pointer"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? "🙈" : "👁️"}
                </span>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-800"
                />
                <span
                  className="absolute right-3 top-2 cursor-pointer"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "🙈" : "👁️"}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                🔒 Password must include 8+ chars, uppercase, lowercase, number, special symbol.
              </p>

              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 mt-2"
              >
                Update Password
              </button>
            </form>
          )}
        </div>
      ) : (
        <p className="mt-6 text-gray-400">Loading profile...</p>
      )}
    </div>
  );
};

export default MyProfile;
