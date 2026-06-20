import PropTypes from "prop-types";
import { memo } from "react";

import { getTodayDate } from "../../utils";

import { ErrorMessage, Label } from ".";

const DateInput = ({
  type = "date",
  border = "border border-gray-200 focus:border-gray-400 rounded",
  className = "",
  inputClassName = "",
  labelClassName = "",
  id = "",
  name = "",
  label = "",
  title = "",
  placeholder = "",
  min = getTodayDate(),
  max,
  value = "",
  errorMessage = "",
  onChange = () => {},
  disabled = false,
  readOnly = false,
  required = false,
  icon,
}) => {
  let borderClassname = errorMessage ? `${border} border-red-500` : border;
  const date = value?.slice(0, 10);

  return (
    <div className={`${label || errorMessage ? "space-y-1" : ""} ${className}`}>
      <Label
        className={labelClassName}
        id={id}
        icon={icon}
        label={label}
        required={required}
        readOnly={readOnly}
      />

      {readOnly ? (
        <div className={`p-2 bg-gray-50 ${borderClassname}`}>
          {date || "Not specified"}
        </div>
      ) : (
        <input
          type={type}
          className={`p-2 w-full outline-0 placeholder-gray-500 ${borderClassname} ${inputClassName}`}
          id={id}
          name={name}
          title={title}
          placeholder={placeholder}
          value={date}
          required={required}
          onChange={onChange}
          min={min}
          max={max}
          disabled={disabled}
          readOnly={readOnly}
        />
      )}

      <ErrorMessage error={errorMessage} />
    </div>
  );
};

DateInput.propTypes = {
  type: PropTypes.string,
  border: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.string,
  placeholder: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  errorMessage: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default memo(DateInput);
