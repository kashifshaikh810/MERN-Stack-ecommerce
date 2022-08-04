import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/layout/Header/Header.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import webfont from "webfontloader";
import Footer from "./components/layout/Footer/Footer";
import Home from "./components/Home/Home";
import ProductDetails from "./components/Product/ProductDetails";
import Products from "./components/Product/Products";
import Search from "./components/Product/Search";
import LoginSignup from "./components/User/LoginSignup";
import store from "./Store";
import { loadUser } from "./redux/actions/userAction";
import UserOptions from "./components/layout/Header/UserOptions";
import { useSelector } from "react-redux";
import Profile from "./components/User/Profile";
import UpdateProfile from "./components/User/UpdateProfile";
import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Cart from "./components/Cart/Cart";
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder";
import Payment from "./components/Cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
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
import NotFound from "./components/NotFound/NotFound";

function App(props) {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  useEffect(() => {
    const data = {
      stripeApiKey:
        "pk_test_51LNw3IDWNVVDmdu0eKD4EIzwTiXeJ7Z0TIjUusfFIbhKdcDLVsfike9bjLGUbafgeYf53M3KGWNImwjrfzpMzZD700R44cAwPy",
    };
    setStripeApiKey(data.stripeApiKey);
    webfont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());
  }, []);

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Elements stripe={loadStripe(stripeApiKey)}>
        <Routes>
          {isAuthenticated && (
            <Route extact path="/" element={<Home {...props} />} />
          )}
          {isAuthenticated && (
            <Route
              path="/product/:id"
              element={<ProductDetails {...props} />}
            />
          )}
          {isAuthenticated && (
            <Route path="/products" element={<Products {...props} />} />
          )}
          <Route path="/products/:keyword" element={<Products {...props} />} />
          {isAuthenticated && (
            <Route path="/search" element={<Search {...props} />} />
          )}
          <Route extact path="/account" element={<Profile {...props} />} />
          {isAuthenticated && (
            <Route
              extact
              path="/me/update"
              element={<UpdateProfile {...props} />}
            />
          )}
          <Route
            extact
            path="/password/update"
            element={<UpdatePassword {...props} />}
          />

          <Route
            extact
            path="/password/forgot"
            element={<ForgotPassword {...props} />}
          />

          <Route
            extact
            path="/password/reset/:token"
            element={<ResetPassword {...props} />}
          />

          <Route extact path="/login" element={<LoginSignup {...props} />} />
          {isAuthenticated && (
            <Route extact path="/cart" element={<Cart {...props} />} />
          )}
          {isAuthenticated && (
            <Route extact path="/shipping" element={<Shipping {...props} />} />
          )}

          {isAuthenticated && (
            <Route
              extact
              path="/process/payment"
              element={<Payment {...props} />}
            />
          )}

          {isAuthenticated && (
            <Route
              extact
              path="/success"
              element={<OrderSuccess {...props} />}
            />
          )}

          {isAuthenticated && (
            <Route extact path="/orders" element={<MyOrders {...props} />} />
          )}

          <Route
            extact
            path="/order/confirm"
            element={<ConfirmOrder {...props} />}
          />

          {isAuthenticated && (
            <Route
              extact
              path="/order/:id"
              element={<OrderDetails {...props} />}
            />
          )}

          {isAuthenticated && (
            <Route
              extact
              path="/admin/dashboard"
              element={<Dashboard {...props} />}
            />
          )}

          {isAuthenticated && (
            <Route
              extact
              path="/admin/products"
              element={<ProductList {...props} />}
            />
          )}

          {isAuthenticated && (
            <Route
              extact
              path="/admin/product"
              element={<NewProduct {...props} />}
            />
          )}

          {isAuthenticated && (
            <Route
              extact
              path="/admin/product/:id"
              element={<UpdateProduct {...props} />}
            />
          )}

          {isAuthenticated && (
            <Route
              extact
              path="/admin/orders"
              element={<OrderList {...props} />}
            />
          )}

          {isAuthenticated && (
            <Route
              extact
              path="/admin/order/:id"
              element={<ProcessOrder {...props} />}
            />
          )}

          {isAuthenticated && (
            <Route
              extact
              path="/admin/users"
              element={<UsersList {...props} />}
            />
          )}

          {isAuthenticated && (
            <Route
              extact
              path="/admin/user/:id"
              element={<UpdateUser {...props} />}
            />
          )}

          {isAuthenticated && (
            <Route
              extact
              path="/admin/reviews"
              element={<ProductReviews {...props} />}
            />
          )}
          <Route path="*" element={<NotFound {...props} />} />
        </Routes>
      </Elements>

      <Footer />
    </Router>
  );
}

export default App;
