import React, { Fragment, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import { Button } from "@mui/material";
import { useAlert } from "react-alert";
import AccountIcon from "@mui/icons-material/AccountTree";
import {
  getOrderDetails,
  clearErrors,
  updateOrder,
} from "../../redux/actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { UPDATE_ORDERS_RESET } from "../../redux/constants/orderConstants";
import "./processOrder.css";

const ProcessOrder = () => {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updatedOrderError, isUpdated } = useSelector(
    (state) => state.order
  );
  // const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();
  const id = useParams()?.id;
  const [status, setStatus] = useState("");

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const myForm = new FormData();
    myForm.set("status", status);
    const response = Object.fromEntries(myForm);
    dispatch(updateOrder(id, response));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updatedOrderError) {
      alert.error(updatedOrderError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Order Updated Successfully");
      dispatch({ type: UPDATE_ORDERS_RESET });
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, alert, error, id, updatedOrderError, isUpdated]);

  return (
    <Fragment>
      <MetaData title="Process Order -- Admin" />

      <div className="dashboard">
        <Sidebar />

        <div className="newProductContainer">
          {loading ? (
            <Loader />
          ) : (
            <Fragment>
              <div
                className="confirmOrderPage"
                style={{
                  display:
                    order.ordersStatus === "Delivered" ? "block" : "grid",
                }}
              >
                <div>
                  <div className="confirmShippingArea">
                    <Typography>Shipping Info</Typography>

                    <div className="orderDetailsContainerBox">
                      <div>
                        <p>Name:</p>
                        <span>{order?.user && order?.user?.name}</span>
                      </div>

                      <div>
                        <p>Phone:</p>
                        <span>
                          {order?.shippingInfo && order?.shippingInfo?.phoneNo}
                        </span>
                      </div>

                      <div>
                        <p>Address:</p>
                        <span>
                          {order &&
                            order.shippingInfo &&
                            `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.country}, ${order.shippingInfo.pinCode}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="confirmShippingArea">
                    <Typography>Payment</Typography>
                    <div className="orderDetailsContainerBox">
                      <div>
                        <p
                          className={
                            order.paymentInfo &&
                            order.paymentInfo.status === "succeeded"
                              ? "greenColor"
                              : "redColor"
                          }
                        >
                          {order.paymentInfo &&
                          order.paymentInfo.status === "succeeded"
                            ? "PAID"
                            : "NOT PAID"}
                        </p>
                      </div>

                      <div>
                        <p>Amount:</p>
                        <span>{order.totalPrice && order.totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="confirmShippingArea">
                    <Typography>Order Status</Typography>
                    <div className="orderDetailsContainerBox">
                      <div>
                        <p
                          className={
                            order.ordersStatus &&
                            order.ordersStatus === "Delivered"
                              ? "greenColor"
                              : "redColor"
                          }
                        >
                          {order.ordersStatus && order.ordersStatus}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="confirmShippingArea">
                    <Typography>Your Cart Items</Typography>

                    <div className="confirmCartItemsContainer">
                      {order.orderItems &&
                        order.orderItems.map((item, index) => (
                          <div key={item.product}>
                            <img src={item.image} alt="Product" />
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                            <span>
                              {item.quantity} X ₹{item.price} =
                              <b>₹{item.price * item.quantity}</b>
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                {/*  */}
                <div
                  style={{
                    display:
                      order.ordersStatus === "Delivered" ? "none" : "block",
                  }}
                >
                  <form
                    className="updateOrderForm"
                    onSubmit={(e) => updateOrderSubmitHandler(e)}
                  >
                    <h1>Process Order</h1>

                    <div>
                      <AccountIcon />

                      <select onChange={(e) => setStatus(e.target.value)}>
                        <option value="">Choose Category</option>
                        {order.ordersStatus === "Processing" && (
                          <option value="Shipped">Shipped</option>
                        )}
                        {order.ordersStatus === "Shipped" && (
                          <option value="Delivered">Delivered</option>
                        )}
                      </select>
                    </div>

                    <Button
                      id="updateOrderBtn"
                      type="submit"
                      disabled={loading ? true : false}
                    >
                      Process
                    </Button>
                  </form>
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessOrder;
