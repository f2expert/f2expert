import React from "react";

type ButtonProps = {
  classes: string;
  text: string;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ classes, text, onClick }) => {
  return (
    <button
      className={classes}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
