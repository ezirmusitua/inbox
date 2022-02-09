import { iBackendConfig } from "@inbox/shared";
import { fs, path } from "@tauri-apps/api";
import { Command } from "@tauri-apps/api/shell";
// alternatively, use `window.__TAURI__.shell.Command`
// `my-sidecar` is the value specified on `tauri.conf.json > tauri > bundle > externalBin`
async function call_start_backend_command(args: string[]) {
    try {
        const command = Command.sidecar("app", args);
        const resp = await command.execute();
        command.on("error", (args) => {
            console.log("command error");
        });
        if (resp.signal) {
            throw new Error(
                `Start process failed with signal ${resp.signal}, exit code ${resp.code}, stdout ${resp.stdout}, stderr ${resp.stderr}`,
            );
        }
    } catch (e) {
        // eslint-disable-next-line
        confirm("run start backend command failed: " + e.toString());
        console.log("run start backend command failed: ", e);
    }
}

export default {
    async check_initialized() {
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
        try {
            await fs.createDir(`${user_dir}.${app_name}`);
        } catch (e) {
            console.log("init app directory failed: ", e);
        }
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
            },
        };
    },
    init_setting() {},
    start_backend(backend_config: iBackendConfig) {
        const args = Object.keys(backend_config).map(
            (key) => `--${key}=${backend_config[key]}`,
        );
        return call_start_backend_command(args);
    },
};
