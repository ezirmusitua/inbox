function Input({
  value,
  onChange,
  type,
  placeholder,
  className = [],
  style = {},
}: any) {
  const _className = [
    "_ibe-bg-gray-200",
    "_ibe-text-lg",
    "_ibe-border-box",
    "_ibe-w-full",
    "_ibe-py-2",
    "_ibe-px-2",
    "_ibe-focus:outline-blue-500",
    "_ibe-focus:border-blue-500",
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
