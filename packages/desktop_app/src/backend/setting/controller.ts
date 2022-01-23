import { InitSettingDto } from "shared/setting";
import { SettingService } from ".";

export class SettingController {
    check_initialized() {
        return SettingService.check_initialized();
    }
    init_setting(dto: InitSettingDto) {
        return SettingService.init_setting(dto);
    }
    update_setting() {}
}
