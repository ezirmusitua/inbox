import { Link, NavLink, useParams } from "react-router-dom";

const Routes = [
    { label: "Home", path: "/" },
    { label: "Setting", path: "/setting" },
];

export default function Sider() {
    return (
        <nav className="flex flex-col fixed left-0 w-60 shadow-md border-r border-gray-200 h-screen py-8">
            {Routes.map(({ label, path }, index) => (
                <NavLink
                    key={index}
                    to={path}
                    className={({ isActive }: any) =>
                        `py-2 ${isActive ? "border-r-2 border-blue-400" : ""}`
                    }
                >
                    {label}
                </NavLink>
            ))}
        </nav>
    );
}
