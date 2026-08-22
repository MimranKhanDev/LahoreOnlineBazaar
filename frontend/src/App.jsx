// src/App.jsx

/**
 * 🎯 MAIN APP COMPONENT - The heart of our application
 *
 * This is where everything comes together:
 * 1. Routing (Navigation between pages)
 * 2. Global State (Redux integration)
 * 3. Loading user data on app start
 * 4. Loading products on app start
 * 5. Google Fonts loading
 * 6. Layout (Header + Footer)
 *
 * 🌟 THINK OF IT LIKE:
 *    - App.jsx = The "main building" of your app
 *    - Routes = Different rooms (pages)
 *    - Header = The entrance
 *    - Footer = The exit
 *    - Everything else = The rooms inside
 *
 * 📦 PACKAGES USED:
 *    - react-router-dom: For navigation
 *    - react-redux: For Redux state
 *    - webfontloader: For loading Google Fonts
 *    - axios: For API calls (Stripe only)
 *    - framer-motion: For animations (in components)
 *    - react-icons: For icons (in components)
 *    - react-hot-toast: For notifications (in components)
 */

// ✅ STEP 1: Import React and Hooks
import { useEffect, useState } from "react";

// ✅ STEP 2: Import Router (for navigation)
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// ✅ STEP 3: Import Redux
import { useDispatch, useSelector } from "react-redux";

// ✅ STEP 4: Import External Libraries
import WebFont from "webfontloader";
import axios from "axios";

// ❌ STRIPE - Commented out until implemented
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";

// ✅ STEP 5: Import Components
// Layout Components (Always visible)
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";

// Page Components
import Home from "./components/Home/Home";
import ProductDetails from "./components/Product/ProductDetails";
import Products from "./components/Product/Products";
import Search from "./components/Product/Search";
import Contact from "./components/layout/Contact/Contact";
import About from "./components/layout/About/About";
import NotFound from "./components/layout/NotFound/NotFound";
import LoginSignUp from "./components/User/LoginSignUp";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Profile from "./components/User/Profile";
import UpdateProfile from "./components/User/UpdateProfile";
import UpdatePassword from "./components/User/UpdatePassword";
import ProtectedRoute from "./components/Route/ProtectedRoute";
import Cart from "./components/Cart/Cart";
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder";
import Payment from "./components/Cart/Payment";
import OrderSuccess from "./components/Cart/OrderSuccess";
import MyOrders from "./components/Order/MyOrders";
import OrderDetails from "./components/Order/OrderDetails";
import Dashboard from "./components/Admin/Dashboard";
import ProductList from "./components/Admin/ProductList";
import NewProduct from "./components/Admin/NewProduct";
import UpdateProduct from "./components/Admin/UpdateProduct";
import OrderList from "./components/Admin/OrderList";
import ProcessOrder from "./components/Admin/ProcessOrder";
import UsersList from "./components/Admin/UsersList";
import UpdateUser from "./components/Admin/UpdateUser";
import ProductReviews from "./components/Admin/ProductReviews";

// ⚠️ Commented out - Not created yet
// import LoginSignUp from "./components/User/LoginSignUp";
// import UserOptions from "./components/layout/Header/UserOptions";
// import Profile from "./components/User/Profile";
// import ProtectedRoute from "./components/Route/ProtectedRoute";
// ... etc

// ✅ STEP 6: Import Redux Toolkit Actions
import { loadUser } from "./features/user/userSlice";
import { getProducts } from "./features/products/productSlice";

// ✅ STEP 7: Import Selectors
import { selectIsAuthenticated, selectUser } from "./features/user/userSlice";

/**
 * 🎨 The App Component
 *
 * This is the main component that renders everything
 * It runs once when the app starts
 */
function App() {
  // 📊 Get Redux dispatch function
  const dispatch = useDispatch();

  // 📊 Get authentication state from Redux
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // ❌ STRIPE - Commented out until implemented
  // const [stripeApiKey, setStripeApiKey] = useState("");

  // ❌ STRIPE - Commented out until implemented
  // async function getStripeApiKey() {
  //   const { data } = await axios.get("/api/v1/stripeapikey");
  //   setStripeApiKey(data.stripeApiKey);
  // }

  /**
   * 🔄 useEffect - Runs when the app loads
   *
   * This is the "setup" phase of the app
   * Things that should run once when the app starts:
   * 1. Load Google Fonts
   * 2. Check if user is logged in
   * 3. Get Stripe API key (when implemented)
   * 4. Load products for home page
   *
   * ❓ Why empty dependency array []?
   *    It means this effect runs ONLY ONCE
   *    When the app first loads
   *    It won't run again (good for setup)
   */
  useEffect(() => {
    // 🎨 Load Google Fonts
    // This downloads fonts so they display correctly
    // WebFont.load() is a Google Fonts API wrapper
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    // 👤 Load user from cookie (if logged in)
    // This checks if the user has a valid session cookie
    // If yes, it loads the user data into Redux
    // If no, isAuthenticated stays false
    dispatch(loadUser());

    // ❌ STRIPE - Commented out until implemented
    // getStripeApiKey();

    // 🛒 Load products for home page
    // This fetches products from the server
    // The result is stored in Redux (products state)
    // Home page uses useSelector to get products
    dispatch(getProducts({}));
  }, [dispatch]); // ← Only runs when dispatch changes (almost never)

  // 🚫 Disable right-click (from your original app)
  // This prevents users from right-clicking on the page
  // Some sites do this to prevent "Save Image As" or "Inspect Element"
  // ⚠️ Note: This is NOT foolproof (users can still use DevTools)
  window.addEventListener("contextmenu", (e) => e.preventDefault());

  /**
   * 🎨 The Return - What gets rendered
   *
   * This is the actual UI that users see
   * It follows a simple structure:
   * 1. Router (enables navigation)
   * 2. Header (always visible on top)
   * 3. Optional User Options (if logged in)
   * 4. Routes (different pages)
   * 5. Footer (always visible at bottom)
   */
  return (
    /**
     * 🌐 Router (from react-router-dom)
     *
     * This enables client-side routing
     * Without this, navigation links would refresh the page
     * With this, navigation is smooth (no page refresh)
     *
     * ❓ What does Router do?
     *    - Provides routing context to all child components
     *    - Allows use of Link, useNavigate, useParams
     *    - Enables the Routes system
     */
    <Router>
      {/* 🏠 Header - Always visible */}
      <Header />

      {/* 👤 User Options - Only visible when logged in */}
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
        {/* 🏠 Public Routes - Anyone can access */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        {/* 📦 Product Routes */}
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />

        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/cart" element={<Cart />} />

        {/* 🔒 Protected Routes - Need authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<Profile />} />
          <Route path="/me/update" element={<UpdateProfile />} />
          <Route path="/password/update" element={<UpdatePassword />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order/confirm" element={<ConfirmOrder />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/process/payment" element={<Payment />} />
        </Route>

        {/* 🔒 Admin Routes - Need admin role */}
        <Route element={<ProtectedRoute isAdmin={true} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/product" element={<NewProduct />} />
          <Route path="/admin/product/:id" element={<UpdateProduct />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/order/:id" element={<ProcessOrder />} />
          <Route path="/admin/users" element={<UsersList />} />
          <Route path="/admin/user/:id" element={<UpdateUser />} />
          <Route path="/admin/reviews" element={<ProductReviews />} />
        </Route>

        {/* 🔄 Password Reset Routes - Public with token */}
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        {/* 🚫 404 Not Found - Catches all unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* 🏠 Footer - Always visible */}
      <Footer />
    </Router>
  );
}

export default App;
