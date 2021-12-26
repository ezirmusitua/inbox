const ButtonBaseClassNames = [
  "p-2",
  "outline-none",
  "border",
  "cursor-pointer",
  "hover:bg-opacity-80",
  "text-lg",
];

export function Button({
  children,
  onClick,
  primary,
  danger,
  block = false,
  className = [],
  style = {},
}: any) {
  const classNames = [...ButtonBaseClassNames, ...className];
  if (block) {
    classNames.push("w-full");
  }
  if (primary) {
    classNames.push("bg-blue-500");
    classNames.push("text-white");
  } else if (danger) {
    classNames.push("bg-red-500");
    classNames.push("text-white");
  } else {
    classNames.push("text-black");
  }
  return (
    <button className={classNames.join(" ")} style={style} onClick={onClick}>
      {children}
    </button>
  );
}
