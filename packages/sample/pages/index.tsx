import { useEffect, useState } from "react";
import * as extension from "@logseq_inbox/proxy";

export default function Home() {
    const [extension_proxy, set_extension_proxy] = useState(null as any);

    useEffect(() => {
        extension.init_kccount_communication().then((proxy) => {
            set_extension_proxy(proxy);
        });
        return () => {
            if (extension_proxy) extension_proxy.destroy();
        };
    }, []);

    async function call_content_script() {
        try {
            await extension_proxy.send({ type: "content_event" });
        } catch (e) {
            alert("error code: " + e.code);
        }
    }

    return (
        <div
            style={{
                padding: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    margin: "auto",
                    width: "640px",
                    gap: "12px 32px",
                    overflow: "auto",
                }}
            >
                <div style={{ display: "flex", gap: "24px", width: "100%" }}>
                    <button
                        disabled={!extension_proxy}
                        style={{ flex: 1 }}
                        onClick={call_content_script}
                    >
                        Call content script
                    </button>
                </div>
            </div>
        </div>
    );
}
