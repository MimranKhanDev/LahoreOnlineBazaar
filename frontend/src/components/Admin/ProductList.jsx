// src/components/Admin/ProductList.jsx

/**
 * 📋 PRODUCT LIST - Admin product management
 *
 * Features:
 * 1. Data grid with all products
 * 2. Edit product link
 * 3. Delete product action
 * 4. Stock status indicators
 *
 * 📦 Packages Used:
 * - @mui/x-data-grid: v6+ (modern data grid)
 * - react-hot-toast: v2+ (toast notifications)
 * - framer-motion: v9+ (animations)
 *
 * 🔄 Redux Toolkit:
 * - productSlice: getAdminProducts, deleteProduct, clearErrors
 */

import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import { Chip, IconButton } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { FaCheckCircle, FaTimesCircle, FaBox } from "react-icons/fa";

// ✅ Redux Toolkit imports
import {
  getAdminProducts,
  deleteProduct,
  clearErrors,
  selectAdminProducts,
  selectAdminLoading,
  selectAdminError,
} from "../../features/products/productSlice";

import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 📊 Redux state
  const products = useSelector(selectAdminProducts);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);
  const { isDeleted } = useSelector((state) => state.products);

  /**
   * 🗑️ Delete product handler
   */
  const deleteProductHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  /**
   * 📋 Data Grid Columns
   */
  const columns = [
    {
      field: "id",
      headerName: "Product ID",
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
      minWidth: 300,
      flex: 1,
      renderCell: (params) => (
        <span className="font-medium">{params.value}</span>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 150,
      flex: 0.4,
      renderCell: (params) => (
        <span className="font-semibold text-red-500">₹{params.value}</span>
      ),
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      renderCell: (params) => {
        const stock = params.value;
        return (
          <Chip
            icon={
              stock > 0 ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaTimesCircle className="text-red-500" />
              )
            }
            label={stock > 0 ? `${stock} in stock` : "Out of stock"}
            color={stock > 0 ? "success" : "error"}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 150,
      flex: 0.3,
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
            to={`/admin/product/${params.getValue(params.id, "id")}`}
            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
          >
            <Edit fontSize="small" />
          </Link>
          <button
            onClick={() =>
              deleteProductHandler(params.getValue(params.id, "id"))
            }
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
    products?.map((item) => ({
      id: item._id,
      name: item.name,
      price: item.price,
      stock: item.Stock,
      category: item.category || "Uncategorized",
    })) || [];

  // 🔄 Effects
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Product deleted successfully! 🎉");
      // Refresh products list
      dispatch(getAdminProducts());
    }

    dispatch(getAdminProducts());
  }, [dispatch, error, isDeleted]);

  if (loading) return <Loader />;

  return (
    <Fragment>
      <MetaData title="All Products | Admin Panel" />

      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <Sidebar />

          <div className="flex-1 ml-64 p-6">
            {/* 🏷️ Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <div>
                <h1 className="text-3xl font-bold">All Products</h1>
                <p className="text-gray-500">Manage your product inventory</p>
              </div>
              <Link
                to="/admin/product"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Add />
                <span>Add Product</span>
              </Link>
            </motion.div>

            {/* 📊 Products Table */}
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
                  <FaBox className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Total: <strong>{rows.length}</strong> products
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span className="text-sm text-gray-600">
                    In Stock:{" "}
                    <strong>{rows.filter((r) => r.stock > 0).length}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTimesCircle className="text-red-500" />
                  <span className="text-sm text-gray-600">
                    Out of Stock:{" "}
                    <strong>{rows.filter((r) => r.stock === 0).length}</strong>
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

export default ProductList;
