import Sider from "./Sider";

export default function Layout({ children }: any) {
    return (
        <main className="relative">
            <Sider></Sider>
            <div>{children}</div>
        </main>
    );
}
