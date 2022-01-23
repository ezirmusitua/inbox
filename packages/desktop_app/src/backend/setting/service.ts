import { InitSettingDto } from "shared/setting";
import { SettingEntity } from "./domain/agg/entity";

export class SettingService {
    static async check_initialized() {
        try {
            const setting = await SettingEntity.read_setting();
            console.log(setting);
            return { data: true, status: 1 };
        } catch (e) {
            console.log(e);
            return { data: false, status: 1 };
        }
    }

    static init_setting(dto: InitSettingDto) {
        const entity = new SettingEntity({
            logseq_root: dto.logseq_root,
            _created_at: new Date(),
        });
        return entity.save_setting();
    }

    static update_setting() {}
}
