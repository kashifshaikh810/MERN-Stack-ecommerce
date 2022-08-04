import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import "./productList.css";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar";
import Loader from "../layout/Loader/Loader";
import {
  deleteOrder,
  getAllOrders,
  clearErrors,
} from "../../redux/actions/orderAction";
import { DELETE_ORDERS_RESET } from "../../redux/constants/orderConstants";

const OrderList = () => {
  const alert = useAlert();
  const { loading, orders, error } = useSelector((state) => state.allOrders);
  const dispatch = useDispatch();

  const { isDeleted, error: deleteOrderError } = useSelector(
    (state) => state.order
  );
  const navigate = useNavigate();

  const columns = [
    { field: "no", headerName: "No", minWidth: 50 },
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 300,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      minWidth: 150,
      type: "number",
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 250,
      type: "number",
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/order/${params?.getValue(params?.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button onClick={(e) => deleteOrderHandler(e, params?.id)}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];
  orders &&
    orders.forEach((item, i) => {
      rows.push({
        no: i + 1,
        id: item._id,
        status: item.ordersStatus,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
      });
    });

  const deleteOrderHandler = (e, id) => {
    e.preventDefault();
    dispatch(deleteOrder(id));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteOrderError) {
      alert.error(deleteOrderError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Order Deleted Successfully");
      dispatch({ type: DELETE_ORDERS_RESET });
    }

    dispatch(getAllOrders());
  }, [alert, error, dispatch, deleteOrderError, isDeleted, navigate]);

  return (
    <Fragment>
      <MetaData title={`ALL ORDERS -- Admin`} />

      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="dashboard">
            <Sidebar />

            <div className="productListContainer">
              <h1 className="productListHeading">ALL ORDERS</h1>
              <DataGrid
                columns={columns}
                rows={rows}
                pageSize={10}
                disableSelectionOnClick
                className="productListTable"
                autoHeight
              />
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default OrderList;
