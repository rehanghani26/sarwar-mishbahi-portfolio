import PropTypes from "prop-types";
import { memo } from "react";

import { ErrorMessage, Label } from ".";

function TelInput({
  className = "",
  border = "border border-gray-200 focus:border-gray-400 rounded",
  inputClassName = "",
  labelClassName = "",
  id = "",
  name = "",
  label = "",
  title = "",
  placeholder = "",
  value = "",
  errorMessage = "",
  onChange = () => {},
  minLength = "10",
  maxLength = "10",
  required = false,
  disabled = false,
  readOnly = false,
}) {
  let borderClassname = errorMessage ? `${border} border-red-500` : border;

  function handleChange(e) {
    if (/^\d{0,10}$/.test(e.target.value)) {
      onChange(e);
    }
  }

  return (
    <div className={`${label || errorMessage ? "space-y-1" : ""} ${className}`}>
      <Label
        className={labelClassName}
        id={id}
        label={label}
        required={required}
        readOnly={readOnly}
      />

      {readOnly ? (
        <div className={`p-2 truncate bg-gray-50 ${borderClassname}`}>
          {value || "Not specified"}
        </div>
      ) : (
        <input
          type="tel"
          className={`p-2 w-full outline-0 placeholder-gray-500 ${borderClassname} ${inputClassName}`}
          id={id}
          name={name}
          title={title}
          placeholder={placeholder}
          value={value}
          required={required}
          onChange={handleChange}
          minLength={minLength}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
        />
      )}

      <ErrorMessage error={errorMessage} />
    </div>
  );
}

TelInput.propTypes = {
  className: PropTypes.string,
  border: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  errorMessage: PropTypes.string,
  onChange: PropTypes.func,
  minLength: PropTypes.string,
  maxLength: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
};

export default memo(TelInput);
