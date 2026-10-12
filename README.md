<div align="center">
<h1>Citizen-Userscript-Wikimedia</h1>
<p>

<p>
<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/"><img src="assets/badges/1-cc-by-nc-sa.svg" alt="CC BY-NC-SA 4.0"></a><a href="https://github.com/StarCitizenTools/mediawiki-skins-Citizen"><img src="assets/badges/2-mediawiki-citizen-skin.svg" alt="MediaWiki Citizen Skin"></a><a href="https://zh.wikipedia.org/"><img src="assets/badges/3-zh-wikipedia.svg" alt="Chinese Wikipedia"></a><a href="https://wikimediafoundation.org/"><img src="assets/badges/4-wikimedia-foundation.svg" alt="Wikimedia Foundation"></a>
</p>

**English** [简体中文](https://github.com/Chatsven/citizen-userscript-wikimedia/blob/main/README-ZH-CN.md) 

This script allows you to use the [Citizen](https://github.com/StarCitizenTools/mediawiki-skins-Citizen) skin in Wikipedia and other Wikimedia projects.

This project **is not a fork of Citizen**, but rather a Citizen interface built using scripts based on the Vector 2022 DOM.
<img width="3024" height="1895" alt="image" src="https://github.com/user-attachments/assets/dfe6670a-e49d-499e-95f4-4d14b754b595" />
</div>

## Compatibility Environment

Browser Type | Supported Script Managers
:------------------: | :---------------:
Chrome / Chromium Kernel[^1] | [Tampermonkey][Tampermonkey], [Violentmonkey][Violentmonkey]
Safari (All Platforms) | [Tampermonkey][Tampermonkey], [Macaque][Macaque], [Stay][Stay]
[^1]: [Except for mobile](https://support.google.com/chrome/answer/2664769?hl=zh-Hans#zippy=%2C%E5%9C%A8%E6%89%8B%E6%9C%BA%E4%B8%8A%E5%AE%89%E8%A3%85%E6%89%A9%E5%B1%95%E7%A8%8B%E5%BA%8F)

## Installation

Browser Type | User Scripts | Visual Extensions |
:------------------: | :---------------:| :---------------:
Chrome / Chromium Kernel |✅ |✅ |
Safari (All Platforms) | ✅ | ❌ |

### User Scripts (Tampermonkey)
1. Install a user script manager:
  - Recommended: [Tampermonkey][Tampermonkey]
1. **Based on Chrome / Chromium Kernel Browser:
  1. Make sure to enable **"Developer Mode"** in the "Extensions" management.
  1. Make sure to enable **"Allow User Scripts"** in the Script Manager extension of the "Extensions" management.
  1. For details, please refer to the [Tampermonkey Official Guide](https://www.tampermonkey.net/faq.php#Q209)
1. Select the installation source:
- [GitHub](https://raw.githubusercontent.com/Chatsven/Citizen-skins-Wikimedia-Projects/main/citizen-wikimedia-projects.user.js)
1. Visit any *.wikipedia.org or *.wikimedia.org page to activate the script; **This script only runs on the Vector 2022 skin.**
1. Restart your browser if necessary.

### Visual Expansion
1. Choose an installation source:
  - [GitHub](https://github.com/Chatsven/citizen-userscript-wikimedia/releases/download/v3.00/v3.00.zip)
1. Unzip the downloaded archive.
1. Open Chrome and type 'chrome://extensions/' to enable **"Developer Mode"** in the Extensions management.
1. Click 'Load unzipped extension' in Extensions to install, select the 'Citizen-Visual-Expansion' directory, and click OK.
1. Visit any *.wikipedia.org or *.wikimedia.org page to activate the script; **this script only runs on the Vector 2022 skin and depends on `citizen-wikimedia-projects.user.js`**.
1. Restart your browser if necessary.

## Compatibility

* This project has only been validated on ZH Wikipedia and may have compatibility issues with most other languages.
* This project may have compatibility issues with some small tools. The following are compatible tools: `Hotcat`

## Licensing

Unless otherwise stated, this project is released under a [**CC BY-NC-SA 4.0**](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en) license, and additional terms may apply.

<!-- LINK GROUP -->

[Tampermonkey]: http://tampermonkey.net/ "Tampermonkey"
[Violentmonkey]: https://violentmonkey.github.io/ "Violentmonkey"
[Macaque]: https://macaque.app/ "Macaque"
[Stay]: https://apps.apple.com/cn/app/stay-for-safari-%E6%B5%8F%E8%A7%88%E5%99%A8%E4%BC%B4%E4%BE%A3/id1591620171 "Stay"
