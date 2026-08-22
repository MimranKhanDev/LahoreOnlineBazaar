// src/components/Admin/UsersList.jsx

/**
 * 👥 USERS LIST - Admin user management
 *
 * Features:
 * 1. Data grid with all users
 * 2. Edit user link
 * 3. Delete user action
 * 4. Role indicators
 *
 * 🔄 Redux Toolkit:
 * - userSlice: getAllUsers, deleteUser, clearErrors
 */

import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import { Chip, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { FaUserShield, FaUser, FaUsers } from "react-icons/fa";

// ✅ Redux Toolkit imports
import {
  getAllUsers,
  deleteUser,
  clearErrors,
  selectAllUsers,
  selectUserLoading,
  selectUserError,
} from "../../features/user/userSlice";

import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 📊 Redux state
  const users = useSelector(selectAllUsers);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const { isDeleted } = useSelector((state) => state.user);

  /**
   * 🗑️ Delete user handler
   */
  const deleteUserHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  /**
   * 📋 Data Grid Columns
   */
  const columns = [
    {
      field: "id",
      headerName: "User ID",
      minWidth: 200,
      flex: 0.5,
      renderCell: (params) => (
        <span className="font-mono text-sm">
          #{params.value.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 0.5,
      renderCell: (params) => (
        <span className="font-medium">{params.value}</span>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 250,
      flex: 0.7,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 150,
      flex: 0.3,
      renderCell: (params) => {
        const role = params.value;
        return (
          <Chip
            icon={role === "admin" ? <FaUserShield /> : <FaUser />}
            label={role === "admin" ? "Admin" : "User"}
            color={role === "admin" ? "primary" : "default"}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Joined",
      minWidth: 150,
      flex: 0.3,
      renderCell: (params) => (
        <span className="text-sm text-gray-500">
          {new Date(params.value).toLocaleDateString()}
        </span>
      ),
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/user/${params.getValue(params.id, "id")}`}
            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
          >
            <Edit fontSize="small" />
          </Link>
          <button
            onClick={() => deleteUserHandler(params.getValue(params.id, "id"))}
            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
          >
            <Delete fontSize="small" />
          </button>
        </div>
      ),
    },
  ];

  /**
   * 📊 Format rows for Data Grid
   */
  const rows =
    users?.map((item) => ({
      id: item._id,
      name: item.name || "N/A",
      email: item.email || "N/A",
      role: item.role || "user",
      createdAt: item.createdAt || new Date(),
    })) || [];

  // 🔄 Effects
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("User deleted successfully! 🎉");
      dispatch(getAllUsers());
    }

    dispatch(getAllUsers());
  }, [dispatch, error, isDeleted]);

  if (loading) return <Loader />;

  return (
    <Fragment>
      <MetaData title="All Users | Admin Panel" />

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
              <h1 className="text-3xl font-bold">All Users</h1>
              <p className="text-gray-500">Manage your store users</p>
            </motion.div>

            {/* 📊 Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-4"
            >
              <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  disableSelectionOnClick
                  getRowId={(row) => row.id}
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#f1f5f9",
                      borderRadius: "12px",
                      "& .MuiDataGrid-columnHeader": {
                        "&:focus": { outline: "none" },
                        "& .MuiDataGrid-columnHeaderTitle": {
                          fontWeight: 700,
                          color: "#1e293b",
                        },
                      },
                    },
                    "& .MuiDataGrid-row": {
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                    },
                    "& .MuiDataGrid-cell": {
                      "&:focus": { outline: "none" },
                    },
                    "& .MuiDataGrid-footerContainer": {
                      borderTop: "1px solid #e2e8f0",
                    },
                  }}
                />
              </div>

              {/* 📊 Stats */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <FaUsers className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Total: <strong>{rows.length}</strong> users
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUserShield className="text-blue-500" />
                  <span className="text-sm text-gray-600">
                    Admins:{" "}
                    <strong>
                      {rows.filter((r) => r.role === "admin").length}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Users:{" "}
                    <strong>
                      {rows.filter((r) => r.role === "user").length}
                    </strong>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UsersList;
