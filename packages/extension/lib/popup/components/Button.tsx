const ButtonBaseClassNames = [
  "_ibe-p-2",
  "_ibe-outline-none",
  "_ibe-border",
  "_ibe-cursor-pointer",
  "_ibe-hover:bg-opacity-80",
  "_ibe-text-lg",
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
    classNames.push("_ibe-w-full");
  }
  if (primary) {
    classNames.push("_ibe-bg-blue-500");
    classNames.push("_ibe-text-white");
  } else if (danger) {
    classNames.push("_ibe-bg-red-500");
    classNames.push("_ibe-text-white");
  } else {
    classNames.push("_ibe-text-black");
  }
  return (
    <button className={classNames.join(" ")} style={style} onClick={onClick}>
      {children}
    </button>
  );
}
