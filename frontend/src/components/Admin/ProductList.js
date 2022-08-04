import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getAdminProducts,
  deleteProduct,
} from "../../redux/actions/productAction";
import "./productList.css";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar";
import Loader from "../layout/Loader/Loader";
import { DELETE_PRODUCT_RESET } from "../../redux/constants/productConstants";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, error, loading } = useSelector(
    (state) => state.adminProducts
  );
  const { isDeleted, error: deleteProductError } = useSelector(
    (state) => state.deleteProduct
  );
  const alert = useAlert();
  const navigate = useNavigate();

  const columns = [
    { field: "no", headerName: "No", minWidth: 50 },
    { field: "id", headerName: "Product ID", minWidth: 200 },
    { field: "name", headerName: "Name", minWidth: 300 },
    {
      field: "stock",
      headerName: "Stock",
      minWidth: 150,
      type: "number",
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 270,
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
            <Link to={`/admin/product/${params?.getValue(params?.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button onClick={(e) => deleteProductHandler(e, params?.id)}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];
  products &&
    products.forEach((item, i) => {
      rows.push({
        no: i + 1,
        id: item._id,
        stock: item.Stock,
        price: item.price,
        name: item.name,
      });
    });

  const deleteProductHandler = (e, id) => {
    e.preventDefault();
    dispatch(deleteProduct(id));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteProductError) {
      alert.error(deleteProductError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Product Deleted Successfully");
      dispatch({ type: DELETE_PRODUCT_RESET });
      navigate("/admin/products");
    }

    dispatch(getAdminProducts());
  }, [alert, error, dispatch, deleteProductError, isDeleted, navigate]);

  return (
    <Fragment>
      <MetaData title={`ALL PRODUCTS -- Admin`} />

      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="dashboard">
            <Sidebar />

            <div className="productListContainer">
              <h1 className="productListHeading">ALL PRODUCTS</h1>
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

export default ProductList;
