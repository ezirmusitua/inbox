import { iBackendSetting, iLogseqSetting } from "@inbox/shared";
import { BadRequestException } from "@nestjs/common";
import { can_user_execute, fstat } from "utils";

export class BackendSettingValueGuard {
  async validate(setting: iBackendSetting) {
    const _port = parseInt(setting.port as string, 10);
    if (_port < 1024 || _port > 65535) {
      throw new BadRequestException("无效的端口, 端口号必须在 1024-65535 之间");
    }
    if (!setting.browser_bin) {
      throw new BadRequestException("请设置浏览器路径以便保存 pdf 文件");
    }
    const can_execute = await can_user_execute(setting.browser_bin);
    if (!can_execute) {
      throw new BadRequestException(
        "浏览器文件非可执行文件, 请确认用户权限或文件类型",
      );
    }
  }
}

export class LogseqSettingValueGuard {
  async validate(setting: iLogseqSetting) {
    const stats = await fstat(setting.root);
    if (!stats.isDirectory()) {
      throw new BadRequestException(
        "提供的 logseq 库路径不是文件夹, 请重新指定",
      );
    }
  }
}
