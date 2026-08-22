// src/components/Admin/UpdateUser.jsx

/**
 * ✏️ UPDATE USER - Admin user management
 *
 * Features:
 * 1. Update user name
 * 2. Update user email
 * 3. Change user role (admin/user)
 *
 * 🔄 Redux Toolkit:
 * - userSlice: getUserDetails, updateUser, clearErrors
 */

import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import { Person, Mail, VerifiedUser } from "@mui/icons-material";

// ✅ Redux Toolkit imports
import {
  getUserDetails,
  updateUser,
  clearErrors,
  selectUser,
  selectUserLoading,
  selectUserError,
} from "../../features/user/userSlice";

import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";

const UpdateUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 📊 Redux state
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const { isUpdated, loading: updateLoading } = useSelector(
    (state) => state.user,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  /**
   * 📝 Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !role) {
      toast.error("Please fill all fields");
      return;
    }
    dispatch(updateUser({ id, userData: { name, email, role } }));
  };

  // 🔄 Effects
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("User updated successfully! 🎉");
      navigate("/admin/users");
    }

    if (id) {
      dispatch(getUserDetails(id));
    }
  }, [dispatch, id, error, isUpdated, navigate]);

  // Populate form when user loads
  useEffect(() => {
    if (user && user._id) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "");
    }
  }, [user]);

  if (loading) return <Loader />;

  return (
    <Fragment>
      <MetaData title="Update User | Admin Panel" />

      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <Sidebar />

          <div className="flex-1 ml-64 p-6">
            {/* 🏷️ Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-3xl font-bold">Update User</h1>
              <p className="text-gray-500">Edit user details and permissions</p>
            </motion.div>

            {/* 📝 Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <Person className="text-gray-400 mr-2" />,
                  }}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <Mail className="text-gray-400 mr-2" />,
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    startAdornment={
                      <VerifiedUser className="text-gray-400 mr-2" />
                    }
                  >
                    <MenuItem value="">Select Role</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  disabled={updateLoading}
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                    },
                  }}
                >
                  {updateLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Update User"
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser;
