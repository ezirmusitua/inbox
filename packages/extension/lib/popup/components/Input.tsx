function Input({
  value,
  onChange,
  type,
  placeholder,
  className = [],
  style = {},
}: any) {
  const _className = [
    "bg-gray-200",
    "text-lg",
    "border-box",
    "w-full",
    "py-2",
    "px-2",
    "focus:outline-blue-500",
    "focus:border-blue-500",
    ...className,
  ];
  return (
    <input
      className={_className.join(" ")}
      style={style}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    ></input>
  );
}

export default Input;
