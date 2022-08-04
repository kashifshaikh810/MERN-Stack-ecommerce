import React from "react";
import { Rating } from "@mui/material";
import profilePng from "../images/Profile.png";

const ReviewCard = (props) => {
  const { rating, name, comment } = props?.review;

  const options = {
    value: rating,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <div className="reviewCard">
      <img src={profilePng} alt="User" />
      <p>{name}</p>
      <Rating {...options} />
      <span className="reviewCardComment">{comment}</span>
    </div>
  );
};

export default ReviewCard;
