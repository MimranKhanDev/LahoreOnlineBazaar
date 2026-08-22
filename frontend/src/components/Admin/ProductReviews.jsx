// src/components/Admin/ProductReviews.jsx

/**
 * ⭐ PRODUCT REVIEWS - Admin review management
 *
 * Features:
 * 1. Search reviews by product ID
 * 2. Data grid with reviews
 * 3. Delete review action
 * 4. Rating indicators
 *
 * 📦 Packages Used:
 * - @mui/x-data-grid: v6+ (modern data grid)
 * - react-hot-toast: v2+ (toast notifications)
 * - framer-motion: v9+ (animations)
 *
 * 🔄 Redux Toolkit:
 * - productSlice: getProductReviews, deleteReview, clearErrors
 */

import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField, Chip, CircularProgress } from "@mui/material";
import { Delete, Star, Search } from "@mui/icons-material";
import { FaStar, FaUser } from "react-icons/fa";

// ✅ Redux Toolkit imports
import {
  getProductReviews,
  deleteReview,
  clearErrors,
} from "../../features/products/productSlice";

import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";

const ProductReviews = () => {
  const dispatch = useDispatch();

  // 📊 Redux state
  const { reviews, reviewsLoading, reviewsError } = useSelector(
    (state) => state.products,
  );
  const { reviewDeleted, loading } = useSelector((state) => state.products);

  const [productId, setProductId] = useState("");

  /**
   * 🗑️ Delete review handler
   */
  const deleteReviewHandler = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview({ reviewId, productId }));
    }
  };

  /**
   * 🔍 Search reviews handler
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (!productId || productId.length !== 24) {
      toast.error("Please enter a valid 24-character Product ID");
      return;
    }
    dispatch(getProductReviews(productId));
  };

  /**
   * 📋 Data Grid Columns
   */
  const columns = [
    {
      field: "id",
      headerName: "Review ID",
      minWidth: 200,
      flex: 0.5,
      renderCell: (params) => (
        <span className="font-mono text-sm">
          #{params.value.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      field: "user",
      headerName: "User",
      minWidth: 180,
      flex: 0.5,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <FaUser className="text-gray-400" />
          <span className="font-medium">{params.value}</span>
        </div>
      ),
    },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      renderCell: (params) => {
        const rating = params.value;
        return (
          <div className="flex items-center gap-1">
            <FaStar
              className={`${rating >= 3 ? "text-yellow-400" : "text-gray-300"}`}
            />
            <span
              className={`font-bold ${rating >= 3 ? "text-green-600" : "text-red-500"}`}
            >
              {rating}
            </span>
          </div>
        );
      },
    },
    {
      field: "comment",
      headerName: "Comment",
      minWidth: 300,
      flex: 1,
      renderCell: (params) => (
        <span className="line-clamp-2">{params.value || "No comment"}</span>
      ),
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <button
          onClick={() => deleteReviewHandler(params.getValue(params.id, "id"))}
          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
        >
          <Delete fontSize="small" />
        </button>
      ),
    },
  ];

  /**
   * 📊 Format rows for Data Grid
   */
  const rows =
    reviews?.map((item) => ({
      id: item._id,
      rating: item.rating || 0,
      comment: item.comment || "",
      user: item.name || "Anonymous",
    })) || [];

  // 🔄 Effects
  useEffect(() => {
    if (reviewsError) {
      toast.error(reviewsError);
      dispatch(clearErrors());
    }

    if (reviewDeleted) {
      toast.success("Review deleted successfully! 🎉");
      if (productId) {
        dispatch(getProductReviews(productId));
      }
    }
  }, [dispatch, reviewsError, reviewDeleted, productId]);

  return (
    <Fragment>
      <MetaData title="Product Reviews | Admin Panel" />

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
              <h1 className="text-3xl font-bold">Product Reviews</h1>
              <p className="text-gray-500">Manage customer reviews</p>
            </motion.div>

            {/* 🔍 Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 mb-6"
            >
              <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="flex-1">
                  <TextField
                    fullWidth
                    label="Product ID"
                    variant="outlined"
                    placeholder="Enter 24-character Product ID"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <Star className="text-gray-400 mr-2" />,
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={reviewsLoading}
                  sx={{
                    px: 4,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                    },
                  }}
                >
                  {reviewsLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      <Search className="mr-2" />
                      Search Reviews
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* 📊 Reviews Table */}
            {rows.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-4"
              >
                <div style={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25]}
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
                    <Star className="text-yellow-400" />
                    <span className="text-sm text-gray-600">
                      Total: <strong>{rows.length}</strong> reviews
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Avg Rating:{" "}
                      <strong>
                        {(
                          rows.reduce((acc, r) => acc + r.rating, 0) /
                          rows.length
                        ).toFixed(1)}
                      </strong>
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              productId &&
              !reviewsLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl shadow-xl p-12 text-center"
                >
                  <div className="text-6xl mb-4">⭐</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    No Reviews Found
                  </h3>
                  <p className="text-gray-500">
                    This product doesn't have any reviews yet.
                  </p>
                </motion.div>
              )
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductReviews;
