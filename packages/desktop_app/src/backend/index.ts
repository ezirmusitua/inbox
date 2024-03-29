import { iBackendSetting } from "@inbox/shared";
import { fs, path } from "@tauri-apps/api";
import { Command } from "@tauri-apps/api/shell";

const env = process.env.NODE_ENV;
const is_dev = env === "development";

async function call_start_backend_command(args: string[]) {
    try {
        const command = Command.sidecar("app", args);
        const resp = await command.execute();
        if (resp.signal) {
            throw new Error(
                `Start process failed with signal ${resp.signal}, exit code ${resp.code}, stdout ${resp.stdout}, stderr ${resp.stderr}`,
            );
        }
    } catch (e) {
        // eslint-disable-next-line
        alert("run start backend command failed: " + e.toString());
    }
}

export default {
    async check_initialized() {
        if (is_dev) return {};
        const user_dir = await path.homeDir();
        const app_name = "inbox";
        const app_config_dir = `${user_dir}.${app_name}`;
        try {
            await fs.readDir(app_config_dir);
            const backend_config_path = `${app_config_dir}${path.sep}backend.json`;
            const content = await fs.readTextFile(backend_config_path);
            return JSON.parse(content);
        } catch (e) {
            return null;
        }
    },

    async prepare_initialization_dto() {
        const document_dir = await path.documentDir();
        const user_dir = await path.homeDir();
        const app_name = "inbox";
        return {
            app: {
                name: app_name,
            },
            logseq: {
                root: "",
            },
            device: {
                document_dir,
                user_dir,
            },
            backend: {
                port: "31312",
                host: "127.0.0.1",
                db_type: "sqljs",
                db_database: `${user_dir}.${app_name}${path.sep}settings.db`,
                jwt_secret: "helloworld",
                jwt_expires: "30d",
                browser_bin: "",
            },
            service: {},
        };
    },
    start_backend(setting: iBackendSetting) {
        if (is_dev) return;
        const args = Object.keys(setting).map(
            (key) => `--${key}=${setting[key]}`,
        );
        return call_start_backend_command(args);
    },
};
