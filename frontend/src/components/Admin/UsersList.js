import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar";
import {
  getAllUsers,
  clearErrors,
  deleteUser,
} from "../../redux/actions/userAction";
import { DELETE_USER_RESET } from "../../redux/constants/userConstants";

const UsersList = () => {
  const dispatch = useDispatch();
  const { users, error } = useSelector((state) => state.allUsers);

  const {
    isDeleted,
    error: deleteError,
    message,
  } = useSelector((state) => state.profile);
  const alert = useAlert();
  const navigate = useNavigate();

  const columns = [
    { field: "no", headerName: "No", minWidth: 50 },
    { field: "id", headerName: "User ID", minWidth: 180 },
    { field: "email", headerName: "Email", minWidth: 200 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 150,
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/user/${params?.getValue(params?.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button onClick={(e) => deleteUserHandler(e, params?.id)}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];
  users &&
    users.forEach((item, i) => {
      rows.push({
        no: i + 1,
        id: item._id,
        email: item.email,
        name: item.name,
        role: item.role,
      });
    });

  const deleteUserHandler = (e, id) => {
    e.preventDefault();
    dispatch(deleteUser(id));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success(message);
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [alert, error, dispatch, deleteError, isDeleted, navigate, message]);

  return (
    <Fragment>
      <MetaData title={`ALL USERS -- Admin`} />
      <div className="dashboard">
        <Sidebar />

        <div className="productListContainer">
          <h1 className="productListHeading">ALL USERS</h1>
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
  );
};

export default UsersList;
