# 二维码自动生成功能 & JSON 格式支持

## 新增功能

### 1. 二维码自动生成功能

在节点链接转换完成后，**自动在页面下方生成二维码**，无需手动点击按钮。

## 使用方法

1. 在 **Clash 配置** 列输入或粘贴 Clash 配置
2. 点击 **转换为节点链接** 按钮
3. **二维码自动显示**在节点链接文本框下方
4. 可以：
   - 单独下载每个节点的二维码
   - 批量下载所有二维码（多节点时）
   - 展开/收起二维码面板

## 功能特性

- ✅ **自动显示**：转换后立即生成二维码，无需额外操作
- ✅ 支持单个节点和多节点
- ✅ 网格布局自适应
- ✅ 可展开/收起，不占用过多空间
- ✅ 单独下载或批量下载 PNG 格式
- ✅ 高分辨率下载（512x512）
- ✅ 响应式设计
- ✅ 完整国际化支持

## 技术实现

- 使用 `qrcode.react` 库生成二维码 SVG
- 自动检测节点链接变化并生成二维码
- 支持将 SVG 转换为 PNG 格式下载
- 网格布局，每个二维码 120x120 显示
- 使用 Fluent UI 组件保持设计一致性

## 国际化

新增以下翻译键：

- `qrCodeTitle`: 节点二维码 / Node QR Codes
- `qrCodeCount`: 共 {{count}} 个节点 / Total {{count}} nodes
- `nodeIndex`: 节点 {{index}} / Node {{index}}
- `downloadQRCode`: 下载二维码 / Download QR Code
- `downloadAllQRCodes`: 下载全部二维码 / Download All QR Codes
- `expand`: 展开 / Expand
- `collapse`: 收起 / Collapse

---

### 2. JSON 格式支持

现在 Clash 配置输入同时支持 **YAML** 和 **JSON** 格式。

#### 使用方法

可以直接粘贴 JSON 格式的 Clash 配置：

```json
{
  "proxies": [
    {
      "name": "节点1",
      "type": "ss",
      "server": "example.com",
      "port": 8388,
      "cipher": "aes-256-gcm",
      "password": "password"
    }
  ]
}
```

或者数组格式：

```json
[
  {
    "name": "节点1",
    "type": "ss",
    "server": "example.com",
    "port": 8388,
    "cipher": "aes-256-gcm",
    "password": "password"
  }
]
```

#### 技术实现

- 自动检测输入格式（检查是否以 `{` 或 `[` 开头）
- JSON 解析失败时自动降级到 YAML 解析器
- 完全兼容现有的 YAML 输入
- 零性能损失的快速路径（JSON.parse）

#### 支持的格式

✅ YAML 格式（原有支持）  
✅ JSON 对象格式 `{ "proxies": [...] }`  
✅ JSON 数组格式 `[{...}, {...}]`  
✅ proxy-providers 格式  
✅ 混合使用（自动识别）

## 部署说明

功能已完全集成，无需额外配置。推送到 GitHub 后，GitHub Actions 会自动构建并部署到 GitHub Pages。
