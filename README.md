<div align="center">
  <br>
  <img width="360" style="max-width:80%" src="resource/static/brand.svg" title="哪吒监控 Nezha Monitoring">
  </br>
  <br>
    <a href="https://nezha-v0.mereith.dev/guide/dashboard.html" target="_blank"><img src="https://img.shields.io/badge/Docs-Available-orange?style=for-the-badge&logo=gitbook&logoColor=white" alt="查看文档"></a>
    <a href="https://github.com/railzen/nezha-zero" target="_blank"><img alt="GitHub release (with filter)" src="https://img.shields.io/github/v/release/railzen/nezha-zero?color=brightgreen&style=for-the-badge&logo=github&label=Dashboard"></a>
    <a href="https://github.com/railzen/nezha-zero/releases" target="_blank"><img src="https://img.shields.io/badge/Agent-v0.20.22-bridhtgreen?logo=github&style=for-the-badge"></a>
    <a href="https://github.com/nezhahq/nezha" target="_blank"><img src="https://img.shields.io/badge/NEZHA-NAIBA-blue?logo=github&style=for-the-badge" alt="访问哪吒仓库"></a>
  </br>
  <p><b>Nezha Monitoring: Self-hostable, lightweight, servers and websites monitoring tool.</b></p>
  <p>Supports <b>monitoring</b> system status, HTTP, TCP, Ping, <b>push alerts</b> and <b>web terminal</b>.</p>
</div>

## 概要/Abstract

本项目基于哪吒V0版本进行二次修改，主要更新了：

- 最新的GEOIP库和管理界面安装Agent的链接

- 修复了部分失效的CDN引用，管理后台的所有静态文件本地化

- 增加用户名密码登陆功能

- 增加IPV4复制按钮

- 增加设备自动发现

- 支持国家码手动指定

- 有限的移动端优化和一些样式优化。

最新Agent版本以上面标签展示为准。Agent已经关闭自动升级功能，如无必要不会升级。面板也将尽可能减少更新，后续将只进行缺陷修复。一键安装脚本如下：

```shell
curl -L https://ba.sh/naza -o naza.sh && chmod +x naza.sh && ./naza.sh
```

## 一键迁移/Migiate

本项目是基于哪吒V0 Final的v0.20.13版本进行修改的，因此兼容v0.20.13版本配置和数据库，可以直接迁移。迁移脚本基于v0.20.13版本测试通过，其他版本理论也可以用。版本迁移前还请做好备份。迁移命令如下：

```shell
curl -L https://ba.sh/naza -o naza.sh && chmod +x naza.sh && ./naza.sh migrate_to_nezha_zero
```

## 自动发现/Auto Discover

作者比较眼馋哪吒V1和Komari的自动发现功能，所以自己也搓了一个，仅支持Linux。服务器列表首页会有一键安装链接可供复制，根据机器码进行自动发现和添加。

## 兼容API/Compatible API

合并了哪吒V1版本的部分读取功能API。目前支持了：

- 支持了账号密码登录（默认关闭，用户名是oauth的用户名，密码在后台设置配置）
- 前台界面的所有 API （包括 WebSocket）
- 后台界面的部分只读 API
- 支持服务器、告警、通知的信息获取
- 兼容 [Nezha-Mobile](https://github.com/hiDandelion/Nezha-Mobile) 的大部分只读功能
- 支持开启和关闭V1版本API
- 关于鉴权
  - 基于配置文件实现鉴权，密码可以设置界面进行修改
  - 支持V1版本 `/api/v1/login` 接口实现登录
    - 账号：设置界面的管理员列表
    - 密码：设置界面的管理员密码
  - 支持三种提供 API Key 的方式
    - Cookie: `nz-jwt` （v1 版本默认使用）
    - Header: `Authorization: Bearer <API Key>` （v1 版本 API 使用）
    - Header: `Authorization: <API Key>` （v0 版本 API 使用）

## 界面预览/Screenshots

#### **Dashboard**

| Dashboard                                                   | Login Panel                                        |
| ----------------------------------------------------------- | -------------------------------------------------- |
| <img src="agent/web/LookGlass_0_20_21.jpg" width="2800px"/> | <img src="agent/web/image_3.png" width="2200px" /> |

| <div align="center"><b>ServerStatus <a href="https://github.com/unclezs">@unclezs</a></b></div>        | DayNight [@JackieSung](https://github.com/JackieSung4ev)                                           | hotaru                                                                     |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| ![默认主题魔改](resource/template/theme-server-status/screenshot.jpg)                                        | <img src="resource/template/theme-daynight/screenshot.png" width="3000px"/>                        | <img src="resource/template/theme-hotaru/screenshot.png" width="1500px" /> |
| <div align="center"><b>Neko Mdui <a href="https://github.com/MikoyChinese">@MikoyChinese</a></b></div> | <div align="center"><b>AngelKanade <a href="https://github.com/adminsama">@adminsama</a></b></div> | <div align="center"><b>Default Theme</b></div>                             |
| ![Neko Mdui](resource/template/theme-mdui/screenshot.png)                                              | ![AngelKanade](resource/template/theme-angel-kanade/screenshot.png)                                | ![Default Theme](resource/template/theme-default/screenshot.png)           |

You can change the dashboard language in the settings page (`/setting`) after the dashboard is installed.

## 备注和公开备注/Public Note

半透明模式的开关默认隐藏，打开半透明模式需要在自定义代码中添加:

```html
<script>
    // server-status 默认开启分组
    localStorage.setItem("showGroup", true);
    // server-status 默认打开半透明模式
    localStorage.setItem("semiTransparent", true); 
</script>
```

新增到期时间展示和国家自定义，写在公开备注（Public Note）中。完整版配置在这里[账单信息备注](https://github.com/nezhahq/nezha/pull/425#issuecomment-2389107872)

```html
{
  "billingDataMod": {
    // 开始时间,格式为yyyy-mm-dd,
    "startDate": "2025-10-01",
    // 到期时间,格式为yyyy-mm-dd,长期可以写0000-00-00
    "endDate": "2027-01-01" 
  },
  // 两位国家码，可以手动指定未识别到的国旗，ISO 3166-1 Alpha-2规范
  "countryCode": "HK"
}
```

## Star历史/Star History
[![Star History Chart](https://api.star-history.com/svg?repos=railzen/nezha-zero&type=date&legend=top-left)](https://www.star-history.com/#railzen/nezha-zero&type=date&legend=top-left)

## 致谢/Acknowledgements

- [nezhahq/nezha](https://github.com/nezhahq/nezha): Original Nezha Dashboard. 原版哪吒面板
- [chenx-dust/nezha-compat](https://github.com/chenx-dust/nezha-compat):哪吒面板的V1版本API实现
- [hamster1963/nezha-dash](https://github.com/hamster1963/nezha-dash):哪吒探针nezha-dash前台主题实现
- [hi2shark/nazhua](https://github.com/hi2shark/nazhua):哪吒探针Nazhua前台主题实现