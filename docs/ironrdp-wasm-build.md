# IronRDP 内嵌 WASM 的实际构建过程

本文记录 Nezha Zero 当前 RDP 资源在 2026 年 7 月 19 日的实际构建过程。内容来自当时的构建命令和修改记录，不是根据最终产物反推。

## 1. 先说明哪些文件是编译出来的

当前 RDP 页面使用两个不同的前端文件：

| 文件 | 实际来源 |
| --- | --- |
| `resource/static/cdn/iron-remote-desktop-rdp@0.7.0-nezha1/iron-remote-desktop-rdp.js` | 从 IronRDP `npm-iron-remote-desktop-rdp-v0.7.0` 标签源码重新编译；其中包含 Rust/WASM 和 WASM JavaScript glue |
| `resource/static/cdn/iron-remote-desktop@0.7.0-nezha1/iron-remote-desktop.js` | 以官方 npm 0.7.0 Web Component 发布产物为基线，保留其运行时接口，再做最小剪贴板扩展 |

真正经过 Rust/WASM 重编的是第一个 `iron-remote-desktop-rdp.js`。

最初切换 IronRDP 时，两个文件都直接取自官方 npm 0.7.0 包。后来为了修复 Microsoft Account 登录，修改了 IronRDP 使用的 `sspi 0.21.0`，因此重新编译了 RDP backend。

通用 Web Component 后来曾从同一 Git 提交的源码重新构建，但该源码对应的组件版本已经是 `0.11.0`，和页面原来使用的 npm 0.7.0 发布产物接口不完全一致，缺少页面依赖的 `onSessionEvent`，导致 RDP 无法连接。因此最终没有使用那次源码构建的 Web Component，而是恢复 npm 0.7.0 发布产物，仅增加手动剪贴板接口。

## 2. 实际使用的版本

- 构建系统：Windows 11 + WSL `Ubuntu-22.04`
- IronRDP 仓库：<https://github.com/Devolutions/IronRDP>
- IronRDP 标签：`npm-iron-remote-desktop-rdp-v0.7.0`
- 对应提交：`e45f68c7e52297ca50d33b44c0ace36c9940fbe6`
- SSPI crate：`sspi 0.21.0`
- Rust：`1.89.0`
- Rust target：`wasm32-unknown-unknown`
- `wasm-pack`：`0.13.1`
- `wasm-bindgen-cli`：构建时与依赖匹配的 `0.2.122`
- Node.js：`v24.16.0`
- npm：Node.js 发行包自带版本
- Python 3：只用于修改 `wasm-bindgen` 生成的 JavaScript glue

`0.7.0-nezha1` 是 Nezha 对本地补丁版资源使用的标识，不是新的上游 npm 版本。

## 3. 为什么必须重编

Microsoft Account 通过 RDP/NTLM 登录时，需要同时传入：

```text
domain   = MicrosoftAccount
username = user@example.com
```

IronRDP v0.7.0 使用的 `sspi 0.21.0` 在 `Username::new_down_level_logon_name()` 中禁止账户名包含 `@`，会在连接 Windows 前直接报错：

```text
custom error: mixed username format
```

如果简单地把域清空，将邮箱当普通 UPN 发送，虽然能绕过该错误，但 Windows 会把它识别为另一种身份，最终仍然报告用户名或密码错误。因此需要修补 SSPI 后重新编译 WASM。

## 4. 下载当时使用的源码

以下是整理后的 PowerShell 命令，目录与当时一致：

```powershell
$Iron = 'C:\tmp\IronRDP-npm-0.7.0'
$SspiArchive = 'C:\tmp\sspi-0.21.0.crate'
$Sspi = 'C:\tmp\sspi-0.21.0'

git clone --depth 1 `
  --branch npm-iron-remote-desktop-rdp-v0.7.0 `
  https://github.com/Devolutions/IronRDP.git `
  $Iron

Invoke-WebRequest `
  -Uri 'https://crates.io/api/v1/crates/sspi/0.21.0/download' `
  -OutFile $SspiArchive

New-Item -ItemType Directory -Force -Path $Sspi | Out-Null
tar -xzf $SspiArchive -C $Sspi

git -C $Iron rev-parse HEAD
```

最后一条命令应输出：

```text
e45f68c7e52297ca50d33b44c0ace36c9940fbe6
```

解压后的相对位置必须保持为：

```text
C:\tmp\
├─ IronRDP-npm-0.7.0\
└─ sspi-0.21.0\
   └─ sspi-0.21.0\
```

因为 IronRDP 的 Cargo patch 使用了这个相对目录关系。

## 5. 实际应用的 SSPI 补丁

在 `C:\tmp\IronRDP-npm-0.7.0\Cargo.toml` 的现有 `[patch.crates-io]` 下加入：

```toml
[patch.crates-io]
sspi = { path = "../sspi-0.21.0/sspi-0.21.0" }
```

修改：

```text
C:\tmp\sspi-0.21.0\sspi-0.21.0\src\auth_identity.rs
```

核心修改是把：

```rust
if account_name.contains(['\\', '@']) {
    return Err(UsernameError::MixedFormat);
}
```

改为：

```rust
// NTLM carries account name and domain in separate fields. Microsoft
// consumer accounts use domain "MicrosoftAccount" with the full email
// address as the account name, so '@' is valid in this representation.
if account_name.contains(['\\']) {
    return Err(UsernameError::MixedFormat);
}
```

同时修改 property test，使 down-level account name 的测试数据包含 `@`，并增加回归测试：

```rust
#[test]
fn microsoft_account_down_level_logon_name() {
    let username = Username::new_down_level_logon_name(
        "user@example.com",
        "MicrosoftAccount",
    )
    .expect("Microsoft account name");

    assert_eq!(username.account_name(), "user@example.com");
    assert_eq!(username.domain_name(), Some("MicrosoftAccount"));
    assert_eq!(username.format(), UserNameFormat::DownLevelLogonName);
}
```

这个补丁只放宽 down-level logon name 的账户字段对 `@` 的限制，反斜杠以及域字段的格式校验仍保留。普通 AD UPN 和 `DOMAIN\\user` 的处理逻辑没有被删除。

## 6. 当时如何准备 WSL 构建环境

当时在 WSL `Ubuntu-22.04` 中安装 Rust 1.89.0：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \
  | sh -s -- -y --profile minimal --default-toolchain 1.89.0

source "$HOME/.cargo/env"
rustup target add wasm32-unknown-unknown
```

`wasm-pack 0.13.1` 使用预编译的 Linux musl 版本：

```bash
cd /tmp
curl -fsSL -o wasm-pack.tar.gz \
  https://github.com/wasm-bindgen/wasm-pack/releases/download/v0.13.1/wasm-pack-v0.13.1-x86_64-unknown-linux-musl.tar.gz
tar -xzf wasm-pack.tar.gz
install -m 755 \
  wasm-pack-v0.13.1-x86_64-unknown-linux-musl/wasm-pack \
  "$HOME/.cargo/bin/wasm-pack"
```

Node.js 使用 `v24.16.0`：

```bash
cd /tmp
mkdir -p "$HOME/.local"
curl -fsSL -o node.tar.xz \
  https://nodejs.org/dist/v24.16.0/node-v24.16.0-linux-x64.tar.xz
tar -xJf node.tar.xz -C "$HOME/.local"

export PATH="$HOME/.cargo/bin:$HOME/.local/node-v24.16.0-linux-x64/bin:$PATH"
```

检查版本：

```bash
rustc --version
cargo --version
wasm-pack --version
node --version
npm --version
```

## 7. 实际执行的 WASM 构建脚本

当时把 Windows `C:\tmp` 中已经打好补丁的源码复制到 WSL 用户目录再编译。下面是实际成功脚本去掉 PowerShell Base64 包装后的内容：

```bash
set -euo pipefail

export PATH="$HOME/.cargo/bin:$HOME/.local/node-v24.16.0-linux-x64/bin:$PATH"
root="$HOME/build/nezha-ironrdp"

rm -rf "$root"
mkdir -p "$root"
cp -a /mnt/c/tmp/IronRDP-npm-0.7.0 "$root/IronRDP"
cp -a /mnt/c/tmp/sspi-0.21.0 "$root/sspi-0.21.0"

# 先验证 SSPI 补丁，而不是只检查能否编译。
cd "$root/sspi-0.21.0/sspi-0.21.0"
cargo test --no-default-features \
  microsoft_account_down_level_logon_name --lib

# 编译 IronRDP Rust crate 为 WebAssembly。
cd "$root/IronRDP/crates/ironrdp-web"
RUSTFLAGS='-Ctarget-feature=+simd128,+bulk-memory --cfg getrandom_backend="wasm_js"' \
  wasm-pack build --target web

# 改写 wasm-bindgen glue，让 Vite 按 URL asset 导入 WASM。
python3 - <<'PY'
from pathlib import Path

p = Path('pkg/ironrdp_web.js')
s = p.read_text()
s = "import wasmUrl from './ironrdp_web_bg.wasm?url';\n\n" + s
s = s.replace(
    "new URL('ironrdp_web_bg.wasm', import.meta.url)",
    'wasmUrl',
)
p.write_text(s)
PY

# 将 wasm-bindgen 产物和 RDP TypeScript 包一起交给 Vite 打包。
cd "$root/IronRDP/web-client/iron-remote-desktop-rdp"
npm install --no-audit --no-fund
npm run build-alone

# 复制回 Windows。
cp dist/iron-remote-desktop-rdp.js \
  /mnt/c/tmp/iron-remote-desktop-rdp-0.7.0-nezha1.js

ls -lh dist/iron-remote-desktop-rdp.js
```

这次成功构建过程中，`wasm-pack` 安装并使用了与 crate 依赖一致的 `wasm-bindgen-cli 0.2.122`。不能随意拿另一个 `wasm-bindgen-cli` 版本处理生成的 WASM，否则 JavaScript glue 与 WASM 导出表可能不匹配，典型表现就是：

```text
Cannot read properties of undefined (reading '__wbindgen_malloc')
```

## 8. WASM 为什么最终只剩一个 JS

`wasm-pack build --target web` 先在下面的目录生成至少两个关键文件：

```text
crates/ironrdp-web/pkg/ironrdp_web.js
crates/ironrdp-web/pkg/ironrdp_web_bg.wasm
```

随后脚本把 glue 中的 WASM 定位方式改成：

```js
import wasmUrl from './ironrdp_web_bg.wasm?url';
```

再由 `web-client/iron-remote-desktop-rdp` 的 Vite library build 打包。library 模式把 WASM URL 变成 Base64 data URL，因此最终文件中包含：

```text
data:application/wasm;base64,
```

最终不需要在 Dashboard 旁边再放一个 `.wasm` 文件，也不会在浏览器中额外请求 `.wasm` 路径。

可以这样验证：

```powershell
$Built = 'C:\tmp\iron-remote-desktop-rdp-0.7.0-nezha1.js'

if (-not (Select-String -Quiet -LiteralPath $Built `
    -Pattern 'data:application/wasm;base64')) {
    throw 'WASM was not embedded into the JavaScript bundle'
}
```

## 9. 如何放入 Nezha Zero

当时先把官方目录：

```text
iron-remote-desktop-rdp@0.7.0
```

改名为：

```text
iron-remote-desktop-rdp@0.7.0-nezha1
```

再用补丁构建替换其中的 JS：

```powershell
$Repo = 'Z:\nezha-zero'
$Source = 'C:\tmp\iron-remote-desktop-rdp-0.7.0-nezha1.js'
$Dest = "$Repo\resource\static\cdn\iron-remote-desktop-rdp@0.7.0-nezha1"

Copy-Item -LiteralPath $Source `
  -Destination "$Dest\iron-remote-desktop-rdp.js" `
  -Force

Get-FileHash -Algorithm SHA256 `
  "$Dest\iron-remote-desktop-rdp.js"
```

当前仓库中该文件的 SHA-256 是：

```text
D3CA9F43087AA04B587115AF33057CDAB2B4D8E46EC10664644E276C914FDFB1
```

构建后还应确认 RDP 页面导入的是 `0.7.0-nezha1`，避免浏览器继续命中原来 `0.7.0` 的缓存路径。

## 10. 它如何进入 Dashboard 二进制

WASM/Vite 构建结束后，不需要修改 Dashboard 的 Go 编译方式。`resource/resource.go` 已经包含：

```go
//go:embed static
var staticFS embed.FS
```

因此执行普通 Dashboard 构建时，`resource/static` 中的补丁版 JS 会被写入 Dashboard 可执行文件：

```powershell
Set-Location 'Z:\nezha-zero'

$env:CGO_ENABLED = '0'
$env:GOOS = 'linux'
$env:GOARCH = 'amd64'
go build -trimpath -ldflags '-s -w' `
  -o 'dashboard-linux-amd64' `
  ./cmd/dashboard
```

GitHub Actions 和 GoReleaser也只是在这里编译 Go；它们不会重新编译 Rust/WASM。因为生成后的 JS 已提交到仓库，所以 Linux amd64、Linux arm64、Linux s390x、Windows amd64 等 Dashboard 构建复用的是同一份浏览器 WASM。

WASM 在用户浏览器中运行，不在 Dashboard 服务器上执行，所以不需要为每个 Dashboard 的 `GOOS/GOARCH` 分别编译一次。

## 11. Web Component 为什么不能照搬同一次源码构建

同一个 IronRDP 提交同时带有：

```text
npm-iron-remote-desktop-rdp-v0.7.0
npm-iron-remote-desktop-v0.11.0
```

也就是说，该提交上的 RDP backend 是 0.7.0，而通用 Web Component 源码已经是 0.11.0。我们实际试过重新构建这个 Web Component，生成文件可以通过语法检查，却缺少现有页面依赖的 `onSessionEvent` 导出，导致浏览器运行时无法完成连接生命周期。

因此当前处理方式是：

- `iron-remote-desktop-rdp.js`：从固定标签源码加 SSPI 补丁后重新编译；
- `iron-remote-desktop.js`：保留已验证可连接的 npm 0.7.0 发布产物，再做最小剪贴板扩展；
- 不能用同一提交下重新构建的 0.11.0 Web Component 直接覆盖当前文件。

## 12. 重新构建后的最低验证项

每次修改 SSPI、IronRDP 或构建工具后，至少完成：

1. SSPI 的 `microsoft_account_down_level_logon_name` 单元测试通过；
2. JS 中存在 `data:application/wasm;base64`；
3. 浏览器调用 `await init(...)` 后再创建 `SessionBuilder` 或 Web Component；
4. Node 或真实浏览器能够完成 WASM 初始化，不能出现 `__wbindgen_malloc` 错误；
5. 本地账户、`DOMAIN\\user`、AD UPN 和 `MicrosoftAccount\\邮箱` 分别测试；
6. 保留 `onSessionEvent`、剪贴板发送和远端剪贴板读取接口；
7. 运行 Dashboard 的模板测试、`go test ./...` 和实际 RDP 端到端连接；
8. 比对复制前后的 SHA-256，确保仓库中使用的就是刚验证过的构建产物。

