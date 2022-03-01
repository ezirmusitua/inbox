import Title from "./Title";

export default function Section({ title, children }) {
    return (
        <div className="pb-4">
            <Title>{title}</Title>
            {children}
        </div>
    );
}
