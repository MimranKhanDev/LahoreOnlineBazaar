// src/components/pages/Home/ProductCard.js
import React from "react";
import { Link } from "react-router-dom";
import { Rating } from "@material-ui/lab";

const ProductCard = ({ product }) => {
  // Rating options
  const options = {
    value: product.ratings || 0,
    readOnly: true,
    precision: 0.5,
    size: "small",
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
    >
      {/* Product Image */}
      <div className="overflow-hidden">
        <img
          src={product.images[0]?.url || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="font-semibold text-gray-800 truncate">{product.name}</p>

        <div className="flex items-center mt-1">
          <Rating {...options} />
          <span className="text-sm text-gray-500 ml-2">
            ({product.numOfReviews || 0} Reviews)
          </span>
        </div>

        <p className="text-red-500 font-bold text-lg mt-1">₹{product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
