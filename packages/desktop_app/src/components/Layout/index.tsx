import Content from "./Content";
import Sider, { SIDER_WIDTH } from "./Sider";

export default function Layout({ children }: any) {
    return (
        <main className="relative" style={{ paddingLeft: `${SIDER_WIDTH}px` }}>
            <Sider></Sider>
            <Content>{children}</Content>
        </main>
    );
}
