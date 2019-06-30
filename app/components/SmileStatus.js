// <i class="fas fa-smile"></i>
import React from "react";

const SmileStatus = ({ status, onClick }) => {
  switch (status) {
    case 'win':
      return <i onClick={onClick} className="fa fa-thumbs-o-up"></i>
    case 'lose':
      return <i onClick={onClick} className="fa fa-frown-o"></i>
    default:
      return <i onClick={onClick} className="fa fa-smile-o"></i>
  }
}

export default SmileStatus;
