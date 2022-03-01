export default function Button({
    children,
    primary = false,
    danger = false,
    ...props
}) {
    let color = "border-gray-200";
    if (primary) {
        color = "bg-blue-400 hover:bg-blue-500";
    }
    if (danger) {
        color = "bg-red-400 hover:bg-red-500";
    }
    return (
        <button
            {...props}
            className={`py-1 px-4 ${color} text-white text-md hover:font-bold rounded-md`}
        >
            {children}
        </button>
    );
}
