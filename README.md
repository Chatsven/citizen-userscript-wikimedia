<div align="center">
<h1>Citizen-Userscript-Wikimedia</h1>
<p>

A script that allows you to use [Citizen](https://github.com/StarCitizenTools/mediawiki-skins-Citizen) Skin in Wikipedia and other Wikimedia projects.

This project is **NOT A FORK OF CITIZEN**, but rather a Citizen interface built using scripts on the Vector 2022 DOM.

<img width="3024" height="1895" alt="image" src="https://github.com/user-attachments/assets/dfe6670a-e49d-499e-95f4-4d14b754b595" />

</div>

## Installation

### Userscript

1. Install [Tampermonkey](https://www.tampermonkey.net/) (or Violentmonkey)

2. [Click here to install](https://raw.githubusercontent.com/Chatsven/Citizen-skins-Wikimedia-Projects/main/citizen-wikimedia-projects.user.js) — Tampermonkey will automatically open the installation page.

3. Accessing any `*.wikipedia.org` page will activate the script; the script only runs on the Vector 2022 skin, skipping other skin.

The `@updateURL` is configured in the metadata, and the script will automatically check for upgrades when the repository updates. Remember to increment the `@version` header when releasing a new version; otherwise, the update will not be triggered.

## Compatibility

* This project has only been verified for ZH Wikipedia; it may have compatibility issues in most languages.

* This project may have compatibility issues with gadgets.


## License

Unless otherwise stated, this project is released under [**CC BY-NC-SA 4.0**](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en), and additional terms may apply.
