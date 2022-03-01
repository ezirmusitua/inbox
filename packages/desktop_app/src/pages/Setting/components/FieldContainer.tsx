export default function FieldContainer({ className = "", children }) {
    return <div className={`py-2 flex flex-col ${className}`}>{children}</div>;
}
