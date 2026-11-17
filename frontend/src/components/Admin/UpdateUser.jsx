import { Fragment, useEffect, useState } from "react";
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

import {
  getUserDetails,
  updateUser,
  clearErrors,
  clearMessages,
} from "../../features/user/userSlice";

import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";

const UpdateUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ FIXED: Read from userDetails instead of user
  const user = useSelector((state) => state.user.userDetails);
  const { userDetailsLoading, isUpdated, error } = useSelector(
    (state) => state.user,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !role) {
      toast.error("Please fill all fields");
      return;
    }
    dispatch(updateUser({ id, userData: { name, email, role } }));
  };

  useEffect(() => {
    if (id) {
      dispatch(getUserDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("User updated successfully! 🎉");
      dispatch(clearMessages());
      navigate("/admin/users");
    }
  }, [dispatch, error, isUpdated, navigate]);

  useEffect(() => {
    if (user && user._id) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "");
    }
  }, [user]);

  if (userDetailsLoading) return <Loader />;

  return (
    <Fragment>
      <MetaData title="Update User | Admin Panel" />
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64 p-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-3xl font-bold">Update User</h1>
              <p className="text-gray-500">Edit user details and permissions</p>
            </motion.div>

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
                  InputLabelProps={{ shrink: true }} // ✅ FIXED
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
                  InputLabelProps={{ shrink: true }} // ✅ FIXED
                  InputProps={{
                    startAdornment: <Mail className="text-gray-400 mr-2" />,
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel shrink>Role</InputLabel> {/* ✅ FIXED */}
                  <Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    startAdornment={
                      <VerifiedUser className="text-gray-400 mr-2" />
                    }
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  disabled={userDetailsLoading}
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
                  {userDetailsLoading ? (
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
