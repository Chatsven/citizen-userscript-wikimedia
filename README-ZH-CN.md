<div align="center">
<h1>Citizen-Userscript-Wikimedia</h1>
<p>

<p>
<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/"><img src="assets/badges/1-cc-by-nc-sa.svg" alt="CC BY-NC-SA 4.0"></a><a href="https://github.com/StarCitizenTools/mediawiki-skins-Citizen"><img src="assets/badges/2-mediawiki-citizen-skin.svg" alt="MediaWiki Citizen Skin"></a><a href="https://zh.wikipedia.org/"><img src="assets/badges/3-zh-wikipedia.svg" alt="中文维基百科"></a><a href="https://wikimediafoundation.org/"><img src="assets/badges/4-wikimedia-foundation.svg" alt="维基媒体基金会"></a>
</p>

**简体中文** [Engilsh](https://github.com/Chatsven/citizen-userscript-wikimedia/blob/main/READEME.md) 

此脚本允许您在维基百科和其他维基媒体项目中使用 [Citizen](https://github.com/StarCitizenTools/mediawiki-skins-Citizen) 皮肤。

本项目**不是 Citizen 的分支**，而是基于 Vector 2022 DOM 的脚本构建的 Citizen 界面。

<img width="3024" height="1895" alt="image" src="https://github.com/user-attachments/assets/dfe6670a-e49d-499e-95f4-4d14b754b595" />

</div>

## 兼容环境

浏览器类型           | 支持的脚本管理器
:------------------: | :---------------:
Chrome / Chromium 内核[^1] | [Tampermonkey][Tampermonkey], [Violentmonkey][Violentmonkey]
Safari（全平台）     | [Tampermonkey][Tampermonkey], [Macaque][Macaque], [Stay][Stay]

[^1]: [移动版除外](https://support.google.com/chrome/answer/2664769?hl=zh-Hans#zippy=%2C%E5%9C%A8%E6%89%8B%E6%9C%BA%E4%B8%8A%E5%AE%89%E8%A3%85%E6%89%A9%E5%B1%95%E7%A8%8B%E5%BA%8F)

## 安装

浏览器类型           | 用户脚本           | 视觉拓展 |
:------------------: | :---------------:| :---------------:
Chrome / Chromium 内核 |✅ |✅ |
Safari（全平台）     | ✅ | ❌ |

### 用户脚本（Tampermonkey）

1. 安装用户脚本管理器：
    - 推荐：[Tampermonkey][Tampermonkey]
1. **基于 Chrome / Chromium 内核浏览器：**
    1. 务必开启 “扩展程序” 管理中的 **“开发者模式”**
    1. 务必开启 “扩展程序” 管理中脚本管理器扩展的 **“允许运行用户脚本”**
    1. 具体可参考 [Tampermonkey 官方指引](https://www.tampermonkey.net/faq.php#Q209)
1. 选择安装源：
    - [GitHub](https://raw.githubusercontent.com/Chatsven/Citizen-skins-Wikimedia-Projects/main/citizen-wikimedia-projects.user.js)
1. 访问任何 `*.wikipedia.org` `*.wikimedia.org`页面即可激活脚本；**该脚本仅在 Vector 2022 皮肤上运行**。
1. 必要时，重启浏览器

### 视觉拓展 （Expansion）
1. 选择安装源：
    - [GitHub](https://github.com/Chatsven/citizen-userscript-wikimedia/releases/download/v3.00/v3.00.zip)
1.解压下载的封存档。
1.打开Chorme键入'chrome://extensions /'，开启 “扩展程序” 管理中的 **“开发者模式”**。
1.点击扩展程序中 '加载已解压的扩展程序’进行安装，选择‘Citizen-Visual-Expansion‘目录，点击确定即可。
1. 访问任何 `*.wikipedia.org` `*.wikimedia.org`页面即可激活脚本；**该脚本仅在 Vector 2022 皮肤上运行，且依赖`citizen-wikimedia-projects.user.js`**。
1. 必要时，重启浏览器。


## 兼容性

* 本项目仅在 ZH Wikipedia 上验证，可能与其他大多数语言存在兼容性问题。

* 本项目可能与一些小工具存在兼容性问题，以下是已兼容的小工具：`Hotcat`

## 许可

除非另有说明，本项目采用 [**CC BY-NC-SA 4.0**](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en) 许可发布，并可能适用其他条款。

<!-- LINK GROUP -->

[Tampermonkey]: http://tampermonkey.net/ "篡改猴"
[Violentmonkey]: https://violentmonkey.github.io/ "暴力猴"
[Macaque]: https://macaque.app/ "猕猴"
[Stay]: https://apps.apple.com/cn/app/stay-for-safari-%E6%B5%8F%E8%A7%88%E5%99%A8%E4%BC%B4%E4%BE%A3/id1591620171 "Stay"
