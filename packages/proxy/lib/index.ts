import {
    eErrorCode,
    EXTENSION_CONTENT_BTN_ID,
    iMsg,
} from "@inbox/shared";

export async function check_extension_installed(max_retry = 10) {
    function _check_installed() {
        return new Promise((resolve) =>
            setTimeout(() => {
                const button = document.getElementById(
                    EXTENSION_CONTENT_BTN_ID,
                );
                if (button) {
                    return resolve(button);
                }
            }, 300),
        );
    }
    let button;
    for (const _ of Array.from({ length: max_retry })) {
        button = await _check_installed();
        if (button) break;
    }
    if (!button) {
        throw new Error(eErrorCode.CONTENT_REGISTER_FAILED + "");
    }
    return button;
}

class Proxy {
    constructor(private readonly button: HTMLElement) {}

    destroy() {
        if (!this.button) return null as any;
        this.button.innerHTML = JSON.stringify({ type: "$$destroy" });
        this.button.click();
    }

    async send<T>(msg: iMsg): Promise<T> {
        if (!this.button) return null as any;
        this.button.innerHTML = JSON.stringify(msg);
        this.button.click();
        const result = await new Promise((resolve, reject) =>
            window.addEventListener(
                "message",
                (msg: any) => {
                    if (msg.source != window) return;
                    if (msg.data.type === "error") {
                        return reject(msg.data.data);
                    } else {
                        return resolve(msg.data.data);
                    }
                },
                { once: true },
            ),
        );
        return result as T;
    }
}

export async function init_kccount_communication() {
    const kccount_comm_btn = (await check_extension_installed()) as any;
    return new Proxy(kccount_comm_btn);
}
