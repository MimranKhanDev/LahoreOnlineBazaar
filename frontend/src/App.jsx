// src/App.jsx

// framer-motion react-icons/cg react-hot-toast react-redux @mui/lab react-icons/ai react-icons/md react-helmet-async @reduxjs/toolkit      these tools to install

// import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import WebFont from "webfontloader";
import axios from "axios";
// ❌ STRIPE - Commented out until implemented
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// 🆕 Import components
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import Home from "./components/Home/Home";
// ⚠️ Comment out components that don't exist yet
// import ProductDetails from "./components/Product/ProductDetails";
// import Products from "./components/Product/Products";
// import Search from "./components/Product/Search";
// import LoginSignUp from "./components/User/LoginSignUp";
// import UserOptions from "./components/layout/Header/UserOptions";
// import Profile from "./components/User/Profile";
// import ProtectedRoute from "./components/Route/ProtectedRoute";
// import UpdateProfile from "./components/User/UpdateProfile";
// import UpdatePassword from "./components/User/UpdatePassword";
// import ForgotPassword from "./components/User/ForgotPassword";
// import ResetPassword from "./components/User/ResetPassword";
// import Cart from "./components/Cart/Cart";
// import Shipping from "./components/Cart/Shipping";
// import ConfirmOrder from "./components/Cart/ConfirmOrder";
// import Payment from "./components/Cart/Payment";
// import OrderSuccess from "./components/Cart/OrderSuccess";
// import MyOrders from "./components/Order/MyOrders";
// import OrderDetails from "./components/Order/OrderDetails";
// import Dashboard from "./components/Admin/Dashboard";
// import ProductList from "./components/Admin/ProductList";
// import NewProduct from "./components/Admin/NewProduct";
// import UpdateProduct from "./components/Admin/UpdateProduct";
// import OrderList from "./components/Admin/OrderList";
// import ProcessOrder from "./components/Admin/ProcessOrder";
// import UsersList from "./components/Admin/UsersList";
// import UpdateUser from "./components/Admin/UpdateUser";
// import ProductReviews from "./components/Admin/ProductReviews";
import Contact from "./components/layout/Contact/Contact";
import About from "./components/layout/About/About";
import NotFound from "./components/layout/NotFound/NotFound";

// 🆕 Import Redux Toolkit actions
import { loadUser } from "./features/user/userSlice";
import { getProducts } from "./features/products/productSlice";

// ⚡ Selectors
import { selectIsAuthenticated, selectUser } from "./features/user/userSlice";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // ❌ STRIPE - Commented out until implemented
  // const [stripeApiKey, setStripeApiKey] = useState("");

  // ❌ STRIPE - Commented out until implemented
  // async function getStripeApiKey() {
  //   const { data } = await axios.get("/api/v1/stripeapikey");
  //   setStripeApiKey(data.stripeApiKey);
  // }

  useEffect(() => {
    // 🎨 Load Google Fonts
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    // 👤 Load user from cookie (if logged in)
    dispatch(loadUser());

    // ❌ STRIPE - Commented out until implemented
    // getStripeApiKey();

    // 🛒 Load products for home page
    dispatch(getProducts({}));
  }, [dispatch]);

  // 🚫 Disable right-click (from your original app)
  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Header />

      {/* 👤 User Options (shows if authenticated) */}
      {isAuthenticated && (
        // ⚠️ UserOptions component not created yet
        // <UserOptions user={user} />
        <div className="hidden">User Options (Coming Soon)</div>
      )}

      {/* ❌ STRIPE - Commented out until implemented */}
      {/* {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <Route path="/process/payment" element={<Payment />} />
        </Elements>
      )} */}

      <Routes>
        {/* 🏠 Public Routes - Only keep what exists */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        {/* ⚠️ Commented out routes for components not created yet */}
        {/* <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/cart" element={<Cart />} /> */}

        {/* 🔒 Protected Routes - Commented out */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<Profile />} />
          <Route path="/me/update" element={<UpdateProfile />} />
          <Route path="/password/update" element={<UpdatePassword />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order/confirm" element={<ConfirmOrder />} />
          <Route path="/order/:id" element={<OrderDetails />} />
        </Route> */}

        {/* 🔒 Admin Routes - Commented out */}
        {/* <Route element={<ProtectedRoute isAdmin={true} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/product" element={<NewProduct />} />
          <Route path="/admin/product/:id" element={<UpdateProduct />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/order/:id" element={<ProcessOrder />} />
          <Route path="/admin/users" element={<UsersList />} />
          <Route path="/admin/user/:id" element={<UpdateUser />} />
          <Route path="/admin/reviews" element={<ProductReviews />} />
        </Route> */}

        {/* 🔄 Password Reset - Commented out */}
        {/* <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} /> */}

        {/* 🚫 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
