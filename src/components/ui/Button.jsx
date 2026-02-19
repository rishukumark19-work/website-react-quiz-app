import React from "react";
import "./Button.scss";
import PropTypes from "prop-types";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary", // variants
  size = "md", // sizes
  disabled = false,
  className = "",
  loading = false,
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className} ${loading ? "loading" : ""}`}
      onClick={!loading ? onClick : undefined}
      disabled={disabled || loading}
    >
      {loading ? <span className="spinner" /> : children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "outline",
    "success",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

Button.defaultProps = {
  type: "button",
  variant: "primary",
  size: "md",
  disabled: false,
  className: "",
  loading: false,
};

export default Button;
