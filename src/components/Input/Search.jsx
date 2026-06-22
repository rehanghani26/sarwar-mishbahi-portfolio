import PropTypes from "prop-types";
import { memo } from "react";

import { search, x } from "../../assets/figmaIcons";

import Icon from "../Icon";

const Search = ({
  id = "",
  name = "",
  type = "text",
  className = "",
  border = "border border-gray-200 hover:border-gray-400 rounded",
  placeholder = "",
  placeholderClassName = "",
  value = "",
  onChange = () => {},
  onClick = () => {},
  onCrossClick = () => {},
  onSearchClick = () => {},
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchClick();
    }
  };

  return (
    <>
      <div
        // className={`p-2 flex gap-2 items-center border border-[#3e8b8250] hover:bg-[#f2f9f9] focus:border-[#3e8b82] focus:shadow-[#20504e] ${className}`}
        className={`p-2 h-10 flex gap-0.5 items-center ${border} ${className}`}
      >
        <label htmlFor={id}>
          <Icon svg={search} className=" text-gray-400" />
        </label>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          // className="w-full outline-0 placeholder-[#3e8b82d0] hover:bg-[#f2f9f9]"
          className={`w-full outline-0 placeholder-gray-500 ${placeholderClassName}`}
          placeholder={placeholder}
        />

        {value !== "" && (
          <>
            <Icon
              className="size-5 cursor-pointer hover:scale-110"
              svg={x}
              alt=""
              onClick={onCrossClick}
            />
            <Icon
              svg={search}
              className="cursor-pointer hover:scale-110"
              onClick={onSearchClick}
            />
          </>
        )}
      </div>
    </>
  );
};

Search.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  border: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderClassName: PropTypes.string,
  value: PropTypes.string,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  onCrossClick: PropTypes.func,
  onSearchClick: PropTypes.func,
};

export default memo(Search);
