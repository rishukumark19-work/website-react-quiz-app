import React from "react";
import "./Input.scss";

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  error,
  name,
  min,
  max,
}) => {
  return (
    <div className={`input-group ${error ? "has-error" : ""}`}>
      {label && (
        <label htmlFor={name}>
          {label} {required && "*"}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input;
