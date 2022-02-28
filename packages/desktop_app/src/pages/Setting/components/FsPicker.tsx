import { dialog } from "@tauri-apps/api";
import { useState } from "react";

export default function FsPicker({
    value,
    onChange,
    onFocus,
    onBlur,
    className,
}) {
    const [state, set_state] = useState({ notified: false });
    async function pick() {
        let bin_path = value;
        if (window.__TAURI__) {
            onFocus();
            bin_path = (await dialog.open({
                multiple: false,
                directory: true,
            })) as string;
            onChange(bin_path);
            onBlur();
        } else {
            alert("暂不支持在浏览器中获取文件(夹)路径, 请直接输入路径");
            set_state({ notified: true });
        }
    }
    if (state.notified) {
        return (
            <input
                autoFocus
                value={value}
                className={className}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
            ></input>
        );
    }
    return (
        <div className={className} onClick={pick}>
            {value}
        </div>
    );
}
