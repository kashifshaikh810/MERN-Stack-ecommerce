import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getAllReviews,
  deleteReviews,
} from "../../redux/actions/productAction";
import "./productReviews.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar";
import Loader from "../layout/Loader/Loader";
import StarIcon from "@mui/icons-material/Star";
import { DELETE_REVIEWS_RESET } from "../../redux/constants/productConstants";

const ProductReviews = () => {
  const dispatch = useDispatch();
  const { isDeleted, error: deleteProductError } = useSelector(
    (state) => state.deleteReview
  );
  const { reviews, error, loading } = useSelector((state) => state.allReviews);
  const alert = useAlert();
  const [productId, setProductId] = useState("");
  const navigate = useNavigate();

  const columns = [
    { field: "no", headerName: "No", minWidth: 50 },
    { field: "id", headerName: "Review ID", minWidth: 100 },
    { field: "user", headerName: "User", minWidth: 180 },
    {
      field: "comment",
      headerName: "Comment",
      minWidth: 150,
    },
    {
      field: "rating",
      headerName: "Rating",
      minWidth: 100,
      cellClassName: (params) => {
        return params.getValue(params.id, "rating") >= 3
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button onClick={(e) => deleteReviewHandler(e, params?.id)}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];
  reviews &&
    reviews.forEach((item, i) => {
      rows.push({
        no: i + 1,
        id: item._id,
        user: item.name,
        comment: item.comment,
        rating: item.rating,
      });
    });

  const deleteReviewHandler = (e, id) => {
    e.preventDefault();
    dispatch(deleteReviews(id, productId));
  };

  const productReviewSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllReviews(productId));
  };

  useEffect(() => {
    if (productId.length === 24) {
      dispatch(getAllReviews(productId));
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteProductError) {
      alert.error(deleteProductError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Review Deleted Successfully");
      navigate("/admin/reviews");
      dispatch({ type: DELETE_REVIEWS_RESET });
    }
  }, [
    alert,
    error,
    dispatch,
    deleteProductError,
    isDeleted,
    navigate,
    productId,
  ]);

  return (
    <Fragment>
      <MetaData title={`ALL REVIEWS -- Admin`} />

      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="dashboard">
            <Sidebar />

            <div className="productReviewsContainer">
              <form
                className="productReviewsForm"
                encType="multipart/form-data"
                onSubmit={productReviewSubmitHandler}
              >
                <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

                <div>
                  <StarIcon />

                  <input
                    type="text"
                    placeholder="Product Id"
                    required
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                  />
                </div>

                <Button
                  id="createProductBtn"
                  type="submit"
                  disabled={
                    loading ? true : false || productId === "" ? true : false
                  }
                >
                  Search
                </Button>
              </form>

              {reviews && reviews.length > 0 ? (
                <DataGrid
                  columns={columns}
                  rows={rows}
                  pageSize={10}
                  disableSelectionOnClick
                  className="productListTable"
                  autoHeight
                />
              ) : (
                <h1 className="productReviewsFormHeading">No Reviews Found</h1>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductReviews;
