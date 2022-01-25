import { NavLink } from "react-router-dom";

const Routes = [
    { label: "信息列表", path: "/" },
    { label: "设置", path: "/setting" },
];

export const SIDER_WIDTH = 240;

export default function Sider() {
    return (
        <nav
            style={{ width: `${SIDER_WIDTH}px` }}
            className="bg-white flex flex-col fixed left-0 shadow-md border-r border-gray-200 h-screen py-8"
        >
            {Routes.map(({ label, path }, index) => (
                <NavLink
                    key={index}
                    to={path}
                    className={({ isActive }: any) =>
                        `px-16 py-2 ${
                            isActive ? "border-r-4 border-blue-400" : ""
                        }`
                    }
                >
                    {label}
                </NavLink>
            ))}
        </nav>
    );
}
