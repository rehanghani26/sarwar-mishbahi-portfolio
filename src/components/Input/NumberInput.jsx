import PropTypes from "prop-types";
import { forwardRef, memo } from "react";

import { ErrorMessage, Label } from ".";

const NumberInput = forwardRef(
  (
    {
      border = "border border-gray-200 focus:border-gray-400 rounded",
      className = "",
      inputClassName = "",
      labelClassName,
      id = "",
      name = "",
      label = "",
      helpText = "",
      title = "",
      placeholder = "",
      min,
      max,
      step,
      value,
      errorMessage,
      onChange = () => {},
      disabled = false,
      readOnly = false,
      required = false,
      icon,
    },
    ref
  ) => {
    let borderClassname = errorMessage ? `${border} border-red-500` : border;

    return (
      <div
        className={`${label || errorMessage ? "space-y-1" : ""} ${className}`}
        ref={ref}
      >
        <Label
          className={labelClassName}
          id={id}
          icon={icon}
          label={label}
          helpText={helpText}
          required={required}
          readOnly={readOnly}
        />
        {readOnly ? (
          <div className={`p-2 bg-gray-50 ${borderClassname}`}>
            {value || "Not specified"}
          </div>
        ) : (
          <input
            type="number"
            className={`p-2 w-full outline-0 placeholder-gray-500 ${borderClassname} ${inputClassName}`}
            id={id}
            name={name}
            title={title}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            value={value}
            required={required}
            onChange={onChange}
            onWheel={(e) => e.target.blur()}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", "."].includes(e.key)) {
                e.preventDefault();
              }
            }}
            disabled={disabled}
            readOnly={readOnly}
          />
        )}

        <ErrorMessage error={errorMessage} />
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";

NumberInput.propTypes = {
  border: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helpText: PropTypes.string,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  errorMessage: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default memo(NumberInput);
