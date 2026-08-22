// src/components/Admin/UpdateProduct.jsx

/**
 * ✏️ UPDATE PRODUCT - Edit existing product
 *
 * Features:
 * 1. Pre-filled form with product data
 * 2. Update name, price, description, category, stock
 * 3. Add/remove images
 *
 * 🔄 Redux Toolkit:
 * - productSlice: getProductDetails, updateProduct, clearErrors
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
import {
  Spellcheck,
  AttachMoney,
  Description,
  AccountTree,
  Storage,
  PhotoCamera,
  Close,
} from "@mui/icons-material";

// ✅ Redux Toolkit imports
import {
  getProductDetails,
  updateProduct,
  clearErrors,
  clearProductStatus,
  selectProductDetails,
  selectProductDetailsLoading,
  selectProductDetailsError,
} from "../../features/products/productSlice";

import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";

const UpdateProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 📊 Redux state
  const { product, loading, error } = useSelector(selectProductDetails);
  const { isUpdated, loading: updateLoading } = useSelector(
    (state) => state.products,
  );

  // 🎨 Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  /**
   * 📂 Categories
   */
  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
    "Accessories",
  ];

  /**
   * 🖼️ Handle image upload
   */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  /**
   * ❌ Remove new image from preview
   */
  const removeNewImage = (index) => {
    setImagesPreview(imagesPreview.filter((_, i) => i !== index));
    setImages(images.filter((_, i) => i !== index));
  };

  /**
   * 📝 Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price || !description || !category || !stock) {
      toast.error("Please fill all fields");
      return;
    }

    // OLD CODE — BUGGY: FormData was not parsed by the backend, so product updates lost their fields.
    // const formData = new FormData();
    // formData.append("name", name);
    // formData.append("price", price);
    // formData.append("description", description);
    // formData.append("category", category);
    // formData.append("Stock", stock);
    // images.forEach((image) => formData.append("images", image));
    // dispatch(updateProduct({ id, productData: formData }));

    // NEW CODE — FIX: send the existing base64 image data as JSON for Express and Cloudinary.
    dispatch(
      updateProduct({
        id,
        productData: {
          name,
          price,
          description,
          category,
          Stock: stock,
          images,
        },
      }),
    );
  };

  // 🔄 Effects
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Product updated successfully! 🎉");
      dispatch(clearProductStatus());
      navigate("/admin/products");
    }

    // Fetch product details
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id, error, isUpdated, navigate]);

  // Populate form when product loads
  useEffect(() => {
    if (product && product._id) {
      setName(product.name || "");
      setPrice(product.price || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setStock(product.Stock || "");
      setOldImages(product.images || []);
    }
  }, [product]);

  if (loading) return <Loader />;

  return (
    <Fragment>
      <MetaData title="Update Product | Admin Panel" />

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
              <h1 className="text-3xl font-bold">Update Product</h1>
              <p className="text-gray-500">Edit product details</p>
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
                  label="Product Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <Spellcheck className="text-gray-400 mr-2" />
                    ),
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    fullWidth
                    label="Price (₹)"
                    type="number"
                    variant="outlined"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <AttachMoney className="text-gray-400 mr-2" />
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Stock Quantity"
                    type="number"
                    variant="outlined"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <Storage className="text-gray-400 mr-2" />
                      ),
                    }}
                  />
                </div>

                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <Description className="text-gray-400 mr-2" />
                    ),
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    startAdornment={
                      <AccountTree className="text-gray-400 mr-2" />
                    }
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Old Images */}
                {oldImages.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Images</p>
                    <div className="flex flex-wrap gap-2">
                      {oldImages.map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Upload */}
                <div>
                  <label className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-500 transition-colors">
                    <PhotoCamera className="text-gray-400" />
                    <span className="text-gray-600">Add New Images</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      multiple
                      className="hidden"
                    />
                  </label>

                  {imagesPreview.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {imagesPreview.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <Close fontSize="small" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

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
                    "Update Product"
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

export default UpdateProduct;
