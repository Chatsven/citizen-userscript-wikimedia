// ==UserScript==
// @name         Vector 2022 → Citizen skin
// @namespace    Citizen
// @version      3.00
// @description  A script that allows you to use Citizen Skin in Wikipedia and other Wikimedia projects.
// @author       Citizen
// @updateURL    https://raw.githubusercontent.com/Chatsven/citizen-userscript-wikimedia/main/citizen-wikimedia-projects.user.js
// @downloadURL  https://raw.githubusercontent.com/Chatsven/citizen-userscript-wikimedia/main/citizen-wikimedia-projects.user.js
// @match        *://*.wikipedia.org/*
// @match        *://*.wiktionary.org/*
// @match        *://*.wikisource.org/*
// @match        *://*.wikiquote.org/*
// @match        *://*.wikibooks.org/*
// @match        *://*.wikivoyage.org/*
// @match        *://*.wikiversity.org/*
// @match        *://*.wikifunctions.org/*
// @match        *://*.wikimedia.org/*
// @match        *://*.wikidata.org/*
// @match        *://*.mediawiki.org/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
	if (window.__cvAnchorGuard) return;
	window.__cvAnchorGuard = true;
	var ATTR = 'data-mw-ve-target-container';
	function cvStripAnchors() {
		var list = document.querySelectorAll('[' + ATTR + ']');
		for (var i = 0; i < list.length; i++) {
			list[i].removeAttribute(ATTR);
		}
	}
	var mo = null;
	function cvWatchAnchors(mutations) {
		for (var i = 0; i < mutations.length; i++) {
			var m = mutations[i];
			if (m.type === 'attributes') {
				m.target.removeAttribute(ATTR);
				continue;
			}
			for (var j = 0; j < m.addedNodes.length; j++) {
				var n = m.addedNodes[j];
				if (n.nodeType !== 1) continue;
				if (n.hasAttribute(ATTR)) n.removeAttribute(ATTR);
				else if (n.children.length && n.querySelector('[' + ATTR + ']')) cvStripAnchors();
			}
		}
	}
	try {
		mo = new MutationObserver(cvWatchAnchors);
		mo.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: [ATTR] });
	} catch (e) {  }
	cvStripAnchors();
	function cvStopWatching() {
		cvStripAnchors();
		if (mo) { mo.disconnect(); mo = null; }
	}
	if (document.readyState === 'complete') {
		cvStopWatching();
	} else {
		document.addEventListener('DOMContentLoaded', cvStopWatching);
	}
}());

(function () {
})();

function cvNs2Guard(css) {
	'use strict';
	return css.replace(/\/\*CVNS2-B\*\/([\s\S]*?)\/\*CVNS2-E\*\//g, function (m, block) {
		return block.split('\n').map(function (line) {
			if (/:is\(\s*a\s*,|[\s>+~]a\s*[,{]/.test(line)) return line;
			if (/^[ \t]*html body /.test(line)) {
				return line.replace(/^([ \t]*)html body /, '$1html body:where(:not(.ns-2)) ');
			}
			if (/^[.#:\[a-z]/.test(line) && !/^html\b/.test(line) &&
				(line.indexOf('{') !== -1 || /,\s*$/.test(line))) {
				return ':where(html body:not(.ns-2)) ' + line;
			}
			return line;
		}).join('\n');
	});
}

function cvInjectCSS() {
	'use strict';

	if (document.querySelector('style[data-citizen-vector]')) return;

	if (!document.documentElement) return;

	var s = document.createElement('style');
	s.setAttribute('data-citizen-vector','1');
	try {
		var cvAccentStored = localStorage.getItem('cv-pref-accent');
		if (cvAccentStored && document.documentElement) {
			document.documentElement.style.setProperty('--cv-accent-h', cvAccentStored);
		}
	} catch (e) {}
	['hotcat', 'popups', 'factbox'].forEach(function (id) {
		try {
			if (document.documentElement &&
				localStorage.getItem('cv-pref-gadget-' + id) === 'original') {
				document.documentElement.classList.add('cv-gadget-' + id + '-original');
			}
		} catch (e) {}
	});
	s.textContent = cvNs2Guard(`


.citizen-cdx-button--size-large.cdx-button{min-height:40px}.citizen-cdx-button--size-large.cdx-button--icon-only{display:grid;place-items:center;min-width:40px;padding:0}.skin-citizen .cdx-button{font-weight:var(--font-weight-medium);border-radius:var(--border-radius-base)}.skin-citizen .cdx-button--weight-quiet{--mix-blend-mode-blend:normal}.skin-citizen .cdx-button:enabled:not(:active):not(.cdx-button--is-active):focus,.skin-citizen .cdx-button.cdx-button--fake-button--enabled:not(:active):not(.cdx-button--is-active):focus{border-color:transparent;box-shadow:none}.skin-citizen .cdx-button:enabled:not(:active):not(.cdx-button--is-active):focus-visible,.skin-citizen .cdx-button.cdx-button--fake-button--enabled:not(:active):not(.cdx-button--is-active):focus-visible{outline:1px solid transparent;border-color:var(--border-color-progressive--focus);box-shadow:inset 0 0 0 1px var(--color-progressive)}.citizen-v4 .cdx-button:enabled,.citizen-v4 .cdx-button.cdx-button--fake-button--enabled{color:var(--color-neutral)}.citizen-v4 .cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-progressive,.citizen-v4 .cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive,.citizen-v4 .cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive,.citizen-v4 .cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive,.citizen-v4 .cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-progressive:hover,.citizen-v4 .cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive:hover,.citizen-v4 .cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive:hover,.citizen-v4 .cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive:hover,.citizen-v4 .cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-progressive:active,.citizen-v4 .cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive:active,.citizen-v4 .cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive:active,.citizen-v4 .cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive:active{border-color:transparent}.skin-citizen .cdx-checkbox__icon::before{box-sizing:content-box}.skin-citizen .cdx-message{border-radius:var(--border-radius-medium)}.cdx-button{display:inline-flex;align-items:center;justify-content:center;gap:4px;box-sizing:border-box;min-height:32px;max-width:28rem;margin:0;border-width:1px;border-style:solid;border-radius:2px;padding-right:11px;padding-left:11px;font-family:inherit;font-size:inherit;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-transform:none;transition-property:background-color,color,border-color,box-shadow;transition-duration:.1s}.cdx-button--size-large{min-height:44px;padding-right:15px;padding-left:15px}.cdx-button--icon-only{min-width:32px;padding-right:5px;padding-left:5px}.cdx-button--icon-only.cdx-button--size-large{min-width:44px;padding-right:11px;padding-left:11px}.cdx-button::-moz-focus-inner{border:0;padding:0}.cdx-button .cdx-button__icon,.cdx-button .cdx-icon{vertical-align:middle}.cdx-button .cdx-icon{color:inherit}.cdx-button--fake-button,.cdx-button--fake-button:hover,.cdx-button--fake-button:focus{text-decoration:none}.cdx-button:enabled,.cdx-button.cdx-button--fake-button--enabled{background-color:var(--background-color-interactive-subtle,#f8f9fa);color:var(--color-base,#202122);border-color:var(--border-color-base,#a2a9b1)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled .cdx-button__icon{background-color:var(--color-base,#202122)}}.cdx-button:enabled:hover,.cdx-button.cdx-button--fake-button--enabled:hover{background-color:var(--background-color-base,#fff);color:var(--color-base--hover,#404244);cursor:pointer}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled:hover .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled:hover .cdx-button__icon{background-color:var(--color-base--hover,#404244)}}.cdx-button:enabled:active,.cdx-button.cdx-button--fake-button--enabled:active,.cdx-button:enabled.cdx-button--is-active,.cdx-button.cdx-button--fake-button--enabled.cdx-button--is-active{background-color:var(--background-color-interactive,#eaecf0);color:var(--color-emphasized,#101418);border-color:var(--border-color-interactive,#72777d)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled:active .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled:active .cdx-button__icon,.cdx-button:enabled.cdx-button--is-active .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--is-active .cdx-button__icon{background-color:var(--color-emphasized,#101418)}}.cdx-button:enabled:focus,.cdx-button.cdx-button--fake-button--enabled:focus{outline:1px solid transparent}.cdx-button:enabled:focus:not(:active):not(.cdx-button--is-active),.cdx-button.cdx-button--fake-button--enabled:focus:not(:active):not(.cdx-button--is-active){border-color:var(--border-color-progressive--focus,#36c);box-shadow:inset 0 0 0 1px var(--box-shadow-color-progressive--focus,#36c)}.cdx-button:enabled.cdx-button--action-progressive,.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-progressive{color:var(--color-progressive,#36c)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--action-progressive .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-progressive .cdx-button__icon{background-color:var(--color-progressive,#36c)}}.cdx-button:enabled.cdx-button--action-progressive:hover,.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-progressive:hover{color:var(--color-progressive--hover,#4b77d6);border-color:var(--border-color-progressive--hover,#4b77d6)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--action-progressive:hover .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-progressive:hover .cdx-button__icon{background-color:var(--color-progressive--hover,#4b77d6)}}.cdx-button:enabled.cdx-button--action-progressive:active,.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-progressive:active,.cdx-button:enabled.cdx-button--action-progressive.cdx-button--is-active,.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-progressive.cdx-button--is-active{background-color:var(--background-color-progressive-subtle,#f1f4fd);color:var(--color-progressive--active,#233566);border-color:var(--border-color-progressive--active,#233566)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--action-progressive:active .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-progressive:active .cdx-button__icon,.cdx-button:enabled.cdx-button--action-progressive.cdx-button--is-active .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-progressive.cdx-button--is-active .cdx-button__icon{background-color:var(--color-progressive--active,#233566)}}.cdx-button:enabled.cdx-button--action-destructive,.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-destructive{color:var(--color-destructive,#d73333)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--action-destructive .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-destructive .cdx-button__icon{background-color:var(--color-destructive,#d73333)}}.cdx-button:enabled.cdx-button--action-destructive:hover,.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-destructive:hover{color:var(--color-destructive--hover,#fc493b);border-color:var(--border-color-destructive--hover,#fc493b)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--action-destructive:hover .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-destructive:hover .cdx-button__icon{background-color:var(--color-destructive--hover,#fc493b)}}.cdx-button:enabled.cdx-button--action-destructive:active,.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-destructive:active,.cdx-button:enabled.cdx-button--action-destructive.cdx-button--is-active,.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-destructive.cdx-button--is-active{background-color:var(--background-color-destructive-subtle,#ffe9e5);color:var(--color-destructive--active,#9f3526);border-color:var(--border-color-destructive--active,#9f3526)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--action-destructive:active .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-destructive:active .cdx-button__icon,.cdx-button:enabled.cdx-button--action-destructive.cdx-button--is-active .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-destructive.cdx-button--is-active .cdx-button__icon{background-color:var(--color-destructive--active,#9f3526)}}.cdx-button:enabled.cdx-button--action-destructive:focus:not(:active):not(.cdx-button--is-active),.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-destructive:focus:not(:active):not(.cdx-button--is-active){border-color:var(--border-color-destructive--focus,#36c);box-shadow:inset 0 0 0 1px var(--box-shadow-color-destructive--focus,#36c)}.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-progressive,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive{background-color:var(--background-color-progressive,#36c);color:var(--color-inverted-fixed,#fff);border-color:var(--border-color-progressive,#36c)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-progressive .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive .cdx-button__icon{background-color:var(--color-inverted-fixed,#fff)}}.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-progressive:hover,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive:hover{background-color:var(--background-color-progressive--hover,#4b77d6);border-color:var(--border-color-progressive--hover,#4b77d6)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-progressive:hover .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive:hover .cdx-button__icon{background-color:var(--color-inverted-fixed,#fff)}}.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-progressive:active,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive:active,.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-progressive.cdx-button--is-active,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive.cdx-button--is-active{background-color:var(--background-color-progressive--active,#233566);border-color:var(--border-color-progressive--active,#233566)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-progressive:active .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive:active .cdx-button__icon,.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-progressive.cdx-button--is-active .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive.cdx-button--is-active .cdx-button__icon{background-color:var(--color-inverted-fixed,#fff)}}.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-progressive:focus:not(:active):not(.cdx-button--is-active),.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive:focus:not(:active):not(.cdx-button--is-active){border-color:var(--border-color-progressive--focus,#36c);box-shadow:inset 0 0 0 1px var(--box-shadow-color-progressive--focus,#36c),inset 0 0 0 2px var(--box-shadow-color-inverted,#fff)}.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive{background-color:var(--background-color-destructive,#d73333);color:var(--color-inverted-fixed,#fff);border-color:var(--border-color-destructive,#d73333)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive .cdx-button__icon{background-color:var(--color-inverted-fixed,#fff)}}.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive:hover,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive:hover{background-color:var(--background-color-destructive--hover,#fc493b);border-color:var(--border-color-destructive--hover,#fc493b)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive:hover .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive:hover .cdx-button__icon{background-color:var(--color-inverted-fixed,#fff)}}.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive:active,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive:active,.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive.cdx-button--is-active,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive.cdx-button--is-active{background-color:var(--background-color-destructive--active,#9f3526);border-color:var(--border-color-destructive--active,#9f3526)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive:active .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive:active .cdx-button__icon,.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive.cdx-button--is-active .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive.cdx-button--is-active .cdx-button__icon{background-color:var(--color-inverted-fixed,#fff)}}.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive:focus:not(:active):not(.cdx-button--is-active),.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive:focus:not(:active):not(.cdx-button--is-active){border-color:var(--border-color-destructive--focus,#36c);box-shadow:inset 0 0 0 1px var(--box-shadow-color-destructive--focus,#36c),inset 0 0 0 2px var(--box-shadow-color-inverted,#fff)}.cdx-button:enabled.cdx-button--weight-quiet,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet{background-color:var(--background-color-transparent,transparent);border-color:var(--border-color-transparent,transparent)}.cdx-button:enabled.cdx-button--weight-quiet:hover,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet:hover{background-color:var(--background-color-button-quiet--hover,rgba(0,24,73,.027))}.cdx-button:enabled.cdx-button--weight-quiet:active,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet:active,.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--is-active,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--is-active{background-color:var(--background-color-button-quiet--active,rgba(0,24,73,.082));color:var(--color-emphasized,#101418);border-color:var(--border-color-interactive,#72777d)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--weight-quiet:active .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet:active .cdx-button__icon,.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--is-active .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--is-active .cdx-button__icon{background-color:var(--color-emphasized,#101418)}}.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-progressive,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-progressive{color:var(--color-progressive,#36c)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-progressive .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-progressive .cdx-button__icon{background-color:var(--color-progressive,#36c)}}.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-progressive:hover,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-progressive:hover{background-color:var(--background-color-progressive-subtle,#f1f4fd);color:var(--color-progressive--hover,#4b77d6)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-progressive:hover .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-progressive:hover .cdx-button__icon{background-color:var(--color-progressive--hover,#4b77d6)}}.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-progressive:active,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-progressive:active,.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-progressive.cdx-button--is-active,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-progressive.cdx-button--is-active{background-color:var(--background-color-progressive--active,#233566);color:var(--color-inverted-fixed,#fff);border-color:var(--border-color-progressive--active,#233566)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-progressive:active .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-progressive:active .cdx-button__icon,.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-progressive.cdx-button--is-active .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-progressive.cdx-button--is-active .cdx-button__icon{background-color:var(--color-inverted,#fff)}}.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-destructive,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-destructive{color:var(--color-destructive,#d73333)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-destructive .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-destructive .cdx-button__icon{background-color:var(--color-destructive,#d73333)}}.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-destructive:hover,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-destructive:hover{background-color:var(--background-color-destructive-subtle,#ffe9e5);color:var(--color-destructive--hover,#fc493b)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-destructive:hover .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-destructive:hover .cdx-button__icon{background-color:var(--color-destructive--hover,#fc493b)}}.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-destructive:active,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-destructive:active,.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-destructive.cdx-button--is-active,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-destructive.cdx-button--is-active{background-color:var(--background-color-destructive--active,#9f3526);color:var(--color-inverted-fixed,#fff);border-color:var(--border-color-destructive--active,#9f3526)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-destructive:active .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-destructive:active .cdx-button__icon,.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-destructive.cdx-button--is-active .cdx-button__icon,.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-destructive.cdx-button--is-active .cdx-button__icon{background-color:var(--color-inverted,#fff)}}.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-destructive:focus:not(:active):not(.cdx-button--is-active),.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-destructive:focus:not(:active):not(.cdx-button--is-active){border-color:var(--border-color-destructive--focus,#36c);box-shadow:inset 0 0 0 1px var(--box-shadow-color-destructive--focus,#36c)}.cdx-button:disabled,.cdx-button.cdx-button--fake-button--disabled{background-color:var(--background-color-disabled,#c8ccd1);color:var(--color-inverted,#fff);border-color:var(--border-color-transparent,transparent)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:disabled .cdx-button__icon,.cdx-button.cdx-button--fake-button--disabled .cdx-button__icon{background-color:var(--color-inverted,#fff)}}.cdx-button:disabled.cdx-button--weight-quiet,.cdx-button.cdx-button--fake-button--disabled.cdx-button--weight-quiet{background-color:var(--background-color-transparent,transparent);color:var(--color-disabled,#72777d)}@supports ((-webkit-mask-image:none) or (mask-image:none)){.cdx-button:disabled.cdx-button--weight-quiet .cdx-button__icon,.cdx-button.cdx-button--fake-button--disabled.cdx-button--weight-quiet .cdx-button__icon{background-color:var(--color-disabled,#72777d)}}.mw-ui-icon-wikimedia-bell:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYmVsbAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTYgN2E1LjM4IDUuMzggMCAwIDAtNC40Ni00Ljg1QzExLjYgMS40NiAxMS41MyAwIDEwIDBTOC40IDEuNDYgOC40NiAyLjE1QTUuMzggNS4zOCAwIDAgMCA0IDd2NmwtMiAydjFoMTZ2LTFsLTItMnptLTYgMTNhMyAzIDAgMCAwIDMtM0g3YTMgMyAwIDAgMCAzIDMiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYmVsbAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTYgN2E1LjM4IDUuMzggMCAwIDAtNC40Ni00Ljg1QzExLjYgMS40NiAxMS41MyAwIDEwIDBTOC40IDEuNDYgOC40NiAyLjE1QTUuMzggNS4zOCAwIDAgMCA0IDd2NmwtMiAydjFoMTZ2LTFsLTItMnptLTYgMTNhMyAzIDAgMCAwIDMtM0g3YTMgMyAwIDAgMCAzIDMiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-message:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJbWVzc2FnZQoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMCA4djhhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjhsLTEwIDR6Ii8+PHBhdGggZD0iTTIgMmEyIDIgMCAwIDAtMiAydjJsMTAgNCAxMC00VjRhMiAyIDAgMCAwLTItMnoiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJbWVzc2FnZQoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMCA4djhhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjhsLTEwIDR6Ii8+PHBhdGggZD0iTTIgMmEyIDIgMCAwIDAtMiAydjJsMTAgNCAxMC00VjRhMiAyIDAgMCAwLTItMnoiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-speechBubbleAdd:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYWRkIHNwZWVjaCBidWJibGUKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTMgMWEyIDIgMCAwIDAtMiAydjE2bDQtNGgxMmEyIDIgMCAwIDAgMi0yVjNhMiAyIDAgMCAwLTItMnptMTIgOGgtNHY0SDlWOUg1VjdoNFYzaDJ2NGg0eiIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYWRkIHNwZWVjaCBidWJibGUKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTMgMWEyIDIgMCAwIDAtMiAydjE2bDQtNGgxMmEyIDIgMCAwIDAgMi0yVjNhMiAyIDAgMCAwLTItMnptMTIgOGgtNHY0SDlWOUg1VjdoNFYzaDJ2NGg0eiIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-speechBubbles:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJc3BlZWNoIGJ1YmJsZXMKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTE3IDR2N2EyIDIgMCAwIDEtMiAySDR2MWEyIDIgMCAwIDAgMiAyaDEwbDQgNFY2YTIgMiAwIDAgMC0yLTJ6TTYgMTBIMHY2eiIvPjxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSIxMiIgcng9IjIiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJc3BlZWNoIGJ1YmJsZXMKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTE3IDR2N2EyIDIgMCAwIDEtMiAySDR2MWEyIDIgMCAwIDAgMiAyaDEwbDQgNFY2YTIgMiAwIDAgMC0yLTJ6TTYgMTBIMHY2eiIvPjxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSIxMiIgcng9IjIiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-article:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYXJ0aWNsZQoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNNSAxYTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmgxMGEyIDIgMCAwIDAgMi0yVjNhMiAyIDAgMCAwLTItMnptMCAzaDV2MUg1em0wIDJoNXYxSDV6bTAgMmg1djFINXptMTAgN0g1di0xaDEwem0wLTJINXYtMWgxMHptMC0ySDV2LTFoMTB6bTAtMmgtNFY0aDR6Ii8+PC9nPjwvc3ZnPgo=");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYXJ0aWNsZQoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNNSAxYTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmgxMGEyIDIgMCAwIDAgMi0yVjNhMiAyIDAgMCAwLTItMnptMCAzaDV2MUg1em0wIDJoNXYxSDV6bTAgMmg1djFINXptMTAgN0g1di0xaDEwem0wLTJINXYtMWgxMHptMC0ySDV2LTFoMTB6bTAtMmgtNFY0aDR6Ii8+PC9nPjwvc3ZnPgo=")}.mw-ui-icon-wikimedia-articleNotFound:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYXJ0aWNsZSBub3QgZm91bmQKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTE1IDFINWEyIDIgMCAwIDAtMiAydjE0YTIgMiAwIDAgMCAyIDJoMTBhMiAyIDAgMCAwIDItMlYzYTIgMiAwIDAgMC0yLTJtLTQgMTVIOXYtMmgyem0yLjctNy42YTUgNSAwIDAgMS0uMy43IDIuNyAyLjcgMCAwIDEtLjUuNmwtLjUuNWEyLjcgMi43IDAgMCAxLS42LjVjLS4yLjItLjMuNC0uNS42YTEuOSAxLjkgMCAwIDAtLjMuOCAzLjQgMy40IDAgMCAwLS4xIDFIOS4xYTUgNSAwIDAgMSAuMS0xLjIgMyAzIDAgMCAxIC4yLS45IDIuNSAyLjUgMCAwIDEgLjQtLjdsLjYtLjZhMS44IDEuOCAwIDAgMSAuNS0uNGMuMi0uMS4zLS4zLjQtLjRsLjMtLjZhMS43IDEuNyAwIDAgMCAuMS0uNyAzIDMgMCAwIDAtLjItLjkgMi4yIDIuMiAwIDAgMC0xLS45LjkuOSAwIDAgMC0uNS0uMSAxLjY4IDEuNjggMCAwIDAtMS41LjdBMi44NiAyLjg2IDAgMCAwIDggOC4xSDYuMmE1LjEgNS4xIDAgMCAxIC4zLTEuNyAzLjUgMy41IDAgMCAxIC44LTEuMyAzLjYgMy42IDAgMCAxIDEuMi0uOCA1LjEgNS4xIDAgMCAxIDEuNy0uMyA2IDYgMCAwIDEgMS40LjIgMi42IDIuNiAwIDAgMSAxLjEuNyA0LjQgNC40IDAgMCAxIC44IDEuMSA0IDQgMCAwIDEgLjMgMS41IDMgMyAwIDAgMS0uMS45Ii8+PC9nPjwvc3ZnPgo=");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYXJ0aWNsZSBub3QgZm91bmQKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTE1IDFINWEyIDIgMCAwIDAtMiAydjE0YTIgMiAwIDAgMCAyIDJoMTBhMiAyIDAgMCAwIDItMlYzYTIgMiAwIDAgMC0yLTJtLTQgMTVIOXYtMmgyem0yLjctNy42YTUgNSAwIDAgMS0uMy43IDIuNyAyLjcgMCAwIDEtLjUuNmwtLjUuNWEyLjcgMi43IDAgMCAxLS42LjVjLS4yLjItLjMuNC0uNS42YTEuOSAxLjkgMCAwIDAtLjMuOCAzLjQgMy40IDAgMCAwLS4xIDFIOS4xYTUgNSAwIDAgMSAuMS0xLjIgMyAzIDAgMCAxIC4yLS45IDIuNSAyLjUgMCAwIDEgLjQtLjdsLjYtLjZhMS44IDEuOCAwIDAgMSAuNS0uNGMuMi0uMS4zLS4zLjQtLjRsLjMtLjZhMS43IDEuNyAwIDAgMCAuMS0uNyAzIDMgMCAwIDAtLjItLjkgMi4yIDIuMiAwIDAgMC0xLS45LjkuOSAwIDAgMC0uNS0uMSAxLjY4IDEuNjggMCAwIDAtMS41LjdBMi44NiAyLjg2IDAgMCAwIDggOC4xSDYuMmE1LjEgNS4xIDAgMCAxIC4zLTEuNyAzLjUgMy41IDAgMCAxIC44LTEuMyAzLjYgMy42IDAgMCAxIDEuMi0uOCA1LjEgNS4xIDAgMCAxIDEuNy0uMyA2IDYgMCAwIDEgMS40LjIgMi42IDIuNiAwIDAgMSAxLjEuNyA0LjQgNC40IDAgMCAxIC44IDEuMSA0IDQgMCAwIDEgLjMgMS41IDMgMyAwIDAgMS0uMS45Ii8+PC9nPjwvc3ZnPgo=")}.mw-ui-icon-wikimedia-articleSearch:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYXJ0aWNsZSBzZWFyY2gKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTEyLjQzIDE0LjM0QTUgNSAwIDAgMSAxMCAxNWE1IDUgMCAxIDEgMy45NS0yTDE3IDE2LjA5VjNhMiAyIDAgMCAwLTItMkg1YTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmgxMGEyIDIgMCAwIDAgMS40NS0uNjN6Ii8+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMyIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYXJ0aWNsZSBzZWFyY2gKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTEyLjQzIDE0LjM0QTUgNSAwIDAgMSAxMCAxNWE1IDUgMCAxIDEgMy45NS0yTDE3IDE2LjA5VjNhMiAyIDAgMCAwLTItMkg1YTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmgxMGEyIDIgMCAwIDAgMS40NS0uNjN6Ii8+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMyIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-articlesSearch:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJc2VhcmNoIGFydGljbGVzCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik03IDBhMiAyIDAgMCAwLTIgMmg5YTIgMiAwIDAgMSAyIDJ2MTJhMiAyIDAgMCAwIDItMlYyYTIgMiAwIDAgMC0yLTJ6Ii8+PHBhdGggZD0iTTEwLjggMTUuNmE0LjYgNC43IDAgMCAxLTIuMy42IDQuNiA0LjcgMCAxIDEgMy43LTEuOWwyLjggM1Y0LjlBMS45IDEuOSAwIDAgMCAxMy4xIDNINGExLjkgMS45IDAgMCAwLTIgMS45VjE4YTEuOSAxLjkgMCAwIDAgMS45IDJIMTNhMS45IDEuOSAwIDAgMCAxLjQtLjZ6Ii8+PGNpcmNsZSBjeD0iOC41IiBjeT0iMTEuNSIgcj0iMyIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJc2VhcmNoIGFydGljbGVzCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik03IDBhMiAyIDAgMCAwLTIgMmg5YTIgMiAwIDAgMSAyIDJ2MTJhMiAyIDAgMCAwIDItMlYyYTIgMiAwIDAgMC0yLTJ6Ii8+PHBhdGggZD0iTTEwLjggMTUuNmE0LjYgNC43IDAgMCAxLTIuMy42IDQuNiA0LjcgMCAxIDEgMy43LTEuOWwyLjggM1Y0LjlBMS45IDEuOSAwIDAgMCAxMy4xIDNINGExLjkgMS45IDAgMCAwLTIgMS45VjE4YTEuOSAxLjkgMCAwIDAgMS45IDJIMTNhMS45IDEuOSAwIDAgMCAxLjQtLjZ6Ii8+PGNpcmNsZSBjeD0iOC41IiBjeT0iMTEuNSIgcj0iMyIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-articleRedirect:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYXJ0aWNsZSByZWRpcmVjdAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNNSAxYTIgMiAwIDAgMC0yIDJ2MWMwIDUgMiA4IDcgOFY5bDUgNC01IDR2LTNjLTMuMTggMC01LjUxLS44NS03LTIuNjhWMTdhMiAyIDAgMCAwIDIgMmgxMGEyIDIgMCAwIDAgMi0yVjNhMiAyIDAgMCAwLTItMnoiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYXJ0aWNsZSByZWRpcmVjdAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNNSAxYTIgMiAwIDAgMC0yIDJ2MWMwIDUgMiA4IDcgOFY5bDUgNC01IDR2LTNjLTMuMTggMC01LjUxLS44NS03LTIuNjhWMTdhMiAyIDAgMCAwIDIgMmgxMGEyIDIgMCAwIDAgMi0yVjNhMiAyIDAgMCAwLTItMnoiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-die:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJZGllCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0zIDFhMiAyIDAgMCAwLTIgMnYxNGEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJWM2EyIDIgMCAwIDAtMi0yem0yIDE2YTIgMiAwIDEgMSAyLTIgMiAyIDAgMCAxLTIgMk01IDdhMiAyIDAgMSAxIDItMiAyIDIgMCAwIDEtMiAybTUgNWEyIDIgMCAxIDEgMi0yIDIgMiAwIDAgMS0yIDJtNSA1YTIgMiAwIDEgMSAyLTIgMiAyIDAgMCAxLTIgMm0wLTEwYTIgMiAwIDEgMSAyLTIgMiAyIDAgMCAxLTIgMiIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJZGllCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0zIDFhMiAyIDAgMCAwLTIgMnYxNGEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJWM2EyIDIgMCAwIDAtMi0yem0yIDE2YTIgMiAwIDEgMSAyLTIgMiAyIDAgMCAxLTIgMk01IDdhMiAyIDAgMSAxIDItMiAyIDIgMCAwIDEtMiAybTUgNWEyIDIgMCAxIDEgMi0yIDIgMiAwIDAgMS0yIDJtNSA1YTIgMiAwIDEgMSAyLTIgMiAyIDAgMCAxLTIgMm0wLTEwYTIgMiAwIDEgMSAyLTIgMiAyIDAgMCAxLTIgMiIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-history:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJaGlzdG9yeQoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNOSA2djVoLjA2bDIuNDggMi40NyAxLjQxLTEuNDFMMTEgMTAuMTFWNnoiLz48cGF0aCBkPSJNMTAgMWE5IDkgMCAwIDAtNy44NSAxMy4zNUwuNSAxNkg2di01LjVsLTIuMzggMi4zOEE3IDcgMCAxIDEgMTAgMTd2MmE5IDkgMCAwIDAgMC0xOCIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJaGlzdG9yeQoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNOSA2djVoLjA2bDIuNDggMi40NyAxLjQxLTEuNDFMMTEgMTAuMTFWNnoiLz48cGF0aCBkPSJNMTAgMWE5IDkgMCAwIDAtNy44NSAxMy4zNUwuNSAxNkg2di01LjVsLTIuMzggMi4zOEE3IDcgMCAxIDEgMTAgMTd2MmE5IDkgMCAwIDAgMC0xOCIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-infoFilled:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJaW5mbwoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTAgMEM0LjQ3NyAwIDAgNC40NzcgMCAxMHM0LjQ3NyAxMCAxMCAxMCAxMC00LjQ3NyAxMC0xMFMxNS41MjMgMCAxMCAwTTkgNWgydjJIOXptMCA0aDJ2Nkg5eiIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJaW5mbwoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTAgMEM0LjQ3NyAwIDAgNC40NzcgMCAxMHM0LjQ3NyAxMCAxMCAxMCAxMC00LjQ3NyAxMC0xMFMxNS41MjMgMCAxMCAwTTkgNWgydjJIOXptMCA0aDJ2Nkg5eiIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-qrCode:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJUVIgY29kZQoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNNyAzSDN2NGg0em02IDB2NGg0VjN6TTcgMTNIM3Y0aDR6bTggMHYtMmg0djJoLTJ2NGgtMnYyaDR2LTRoLTR2MmgtNHYyaDJ2LTRoLTJ2LTRoMnYyem0tNC00VjFoOHY4ek0xIDlWMWg4djh6bTAgMmg4djhIMXoiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJUVIgY29kZQoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNNyAzSDN2NGg0em02IDB2NGg0VjN6TTcgMTNIM3Y0aDR6bTggMHYtMmg0djJoLTJ2NGgtMnYyaDR2LTRoLTR2MmgtNHYyaDJ2LTRoLTJ2LTRoMnYyem0tNC00VjFoOHY4ek0xIDlWMWg4djh6bTAgMmg4djhIMXoiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-share:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJc2hhcmUKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTEyIDZWMmw3IDctNyA3di00Yy01IDAtOC41IDEuNS0xMSA1bC44LTMgLjItLjRBMTIgMTIgMCAwIDEgMTIgNiIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJc2hhcmUKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTEyIDZWMmw3IDctNyA3di00Yy01IDAtOC41IDEuNS0xMSA1bC44LTMgLjItLjRBMTIgMTIgMCAwIDEgMTIgNiIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-specialPages:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJc3BlY2lhbCBwYWdlcwoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNNyAwYTIgMiAwIDAgMC0yIDJoOWEyIDIgMCAwIDEgMiAydjEyYTIgMiAwIDAgMCAyLTJWMmEyIDIgMCAwIDAtMi0yeiIvPjxwYXRoIGQ9Ik0xMyAyMEg0YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDlhMiAyIDAgMCAxIDIgMnYxM2EyIDIgMCAwIDEtMiAybS02LjUtMy41LjQxLTEuMDlMOCAxNWwtMS4wOS0uNDEtLjQxLTEuMDktLjQxIDEuMDlMNSAxNWwxLjA5LjQxem0yLjk4Mi0uOTQ5Ljk1Mi0yLjU2MSAyLjUzLS45NjQtMi41My0uOTY0TDkuNDgyIDguNWwtLjk1MiAyLjU2Mi0yLjUzLjk2NCAyLjUzLjk2NHpNNiAxMC41bC41NDctMS40NTNMOCA4LjVsLTEuNDUzLS41NDdMNiA2LjVsLS41NDcgMS40NTNMNCA4LjVsMS40NTMuNTQ3eiIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJc3BlY2lhbCBwYWdlcwoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNNyAwYTIgMiAwIDAgMC0yIDJoOWEyIDIgMCAwIDEgMiAydjEyYTIgMiAwIDAgMCAyLTJWMmEyIDIgMCAwIDAtMi0yeiIvPjxwYXRoIGQ9Ik0xMyAyMEg0YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDlhMiAyIDAgMCAxIDIgMnYxM2EyIDIgMCAwIDEtMiAybS02LjUtMy41LjQxLTEuMDlMOCAxNWwtMS4wOS0uNDEtLjQxLTEuMDktLjQxIDEuMDlMNSAxNWwxLjA5LjQxem0yLjk4Mi0uOTQ5Ljk1Mi0yLjU2MSAyLjUzLS45NjQtMi41My0uOTY0TDkuNDgyIDguNWwtLjk1MiAyLjU2Mi0yLjUzLjk2NCAyLjUzLjk2NHpNNiAxMC41bC41NDctMS40NTNMOCA4LjVsLTEuNDUzLS41NDdMNiA2LjVsLS41NDcgMS40NTNMNCA4LjVsMS40NTMuNTQ3eiIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-upload:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJdXBsb2FkCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0xNyAxMnY1SDN2LTVIMXY1YTIgMiAwIDAgMCAyIDJoMTRhMiAyIDAgMCAwIDItMnYtNXoiLz48cGF0aCBkPSJNMTAgMSA1IDdoNHY4aDJWN2g0eiIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJdXBsb2FkCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0xNyAxMnY1SDN2LTVIMXY1YTIgMiAwIDAgMCAyIDJoMTRhMiAyIDAgMCAwIDItMnYtNXoiLz48cGF0aCBkPSJNMTAgMSA1IDdoNHY4aDJWN2g0eiIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-labFlask:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJbGFib3JhdG9yeSBmbGFzawoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTMgNy42MVYzaDFWMUg2djJoMXY0LjYxbC01Ljg2IDkuODhBMSAxIDAgMCAwIDIgMTloMTZhMSAxIDAgMCAwIC44Ni0xLjUxem0tNC4yLjg4YTEgMSAwIDAgMCAuMi0uNlYzaDJ2NC44OWExIDEgMCAwIDAgLjE0LjUxbDIuMTQgMy42SDYuNzJ6Ii8+PC9nPjwvc3ZnPgo=");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJbGFib3JhdG9yeSBmbGFzawoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTMgNy42MVYzaDFWMUg2djJoMXY0LjYxbC01Ljg2IDkuODhBMSAxIDAgMCAwIDIgMTloMTZhMSAxIDAgMCAwIC44Ni0xLjUxem0tNC4yLjg4YTEgMSAwIDAgMCAuMi0uNlYzaDJ2NC44OWExIDEgMCAwIDAgLjE0LjUxbDIuMTQgMy42SDYuNzJ6Ii8+PC9nPjwvc3ZnPgo=")}.mw-ui-icon-wikimedia-language:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJbGFuZ3VhZ2UKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTIwIDE4aC0xLjQ0YS42LjYgMCAwIDEtLjQtLjEyLjguOCAwIDAgMS0uMjMtLjMxTDE3IDE1aC01bC0xIDIuNTRhLjguOCAwIDAgMS0uMjIuMy42LjYgMCAwIDEtLjQuMTRIOWw0LjU1LTExLjQ3aDEuODl6bS0zLjUzLTQuMzFMMTQuODkgOS41YTEyIDEyIDAgMCAxLS4zOS0xLjI0cS0uMDkuMzctLjE5LjY5bC0uMTkuNTYtMS41OCA0LjE5em0tNi4zLTEuNThhMTMuNCAxMy40IDAgMCAxLTIuOTEtMS40MSAxMS40NiAxMS40NiAwIDAgMCAyLjgxLTUuMzdIMTJWNEg3LjMxYTQgNCAwIDAgMC0uMi0uNTZDNi44NyAyLjc5IDYuNiAyIDYuNiAybC0xLjQ3LjVzLjQuODkuNiAxLjVIMHYxLjMzaDIuMTVBMTEuMjMgMTEuMjMgMCAwIDAgNSAxMC43YTE3LjIgMTcuMiAwIDAgMS01IDIuMXEuNTYuODIuODcgMS4zOGEyMy4zIDIzLjMgMCAwIDAgNS4yMi0yLjUxIDE1LjYgMTUuNiAwIDAgMCAzLjU2IDEuNzd6TTMuNjMgNS4zM2g0LjkxYTguMSA4LjEgMCAwIDEtMi40NSA0LjQ1IDkuMSA5LjEgMCAwIDEtMi40Ni00LjQ1Ii8+PC9nPjwvc3ZnPgo=");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJbGFuZ3VhZ2UKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTIwIDE4aC0xLjQ0YS42LjYgMCAwIDEtLjQtLjEyLjguOCAwIDAgMS0uMjMtLjMxTDE3IDE1aC01bC0xIDIuNTRhLjguOCAwIDAgMS0uMjIuMy42LjYgMCAwIDEtLjQuMTRIOWw0LjU1LTExLjQ3aDEuODl6bS0zLjUzLTQuMzFMMTQuODkgOS41YTEyIDEyIDAgMCAxLS4zOS0xLjI0cS0uMDkuMzctLjE5LjY5bC0uMTkuNTYtMS41OCA0LjE5em0tNi4zLTEuNThhMTMuNCAxMy40IDAgMCAxLTIuOTEtMS40MSAxMS40NiAxMS40NiAwIDAgMCAyLjgxLTUuMzdIMTJWNEg3LjMxYTQgNCAwIDAgMC0uMi0uNTZDNi44NyAyLjc5IDYuNiAyIDYuNiAybC0xLjQ3LjVzLjQuODkuNiAxLjVIMHYxLjMzaDIuMTVBMTEuMjMgMTEuMjMgMCAwIDAgNSAxMC43YTE3LjIgMTcuMiAwIDAgMS01IDIuMXEuNTYuODIuODcgMS4zOGEyMy4zIDIzLjMgMCAwIDAgNS4yMi0yLjUxIDE1LjYgMTUuNiAwIDAgMCAzLjU2IDEuNzd6TTMuNjMgNS4zM2g0LjkxYTguMSA4LjEgMCAwIDEtMi40NSA0LjQ1IDkuMSA5LjEgMCAwIDEtMi40Ni00LjQ1Ii8+PC9nPjwvc3ZnPgo=")}.mw-ui-icon-wikimedia-conversion:before{-webkit-mask-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iOTUgMjA2IDQxNCAzNDgiPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik00NzguNiw0NTYuNmgtODRjMC42LTMsMS4yLTUuNywxLjUtOC43aDcyLjZ2LTMxLjVIMzk3di04LjdoNjguMXYtNjMuNkgzOTd2LTYuOWg0NS42di0zNS40aDMwLjN2LTMyLjdoLTMwLjN2LTE0LjRoLTQ0LjF2MTQuNGgtMzAuNmwtMzIuMSw2OC4xaDE5Ljh2Ni45aC0yMy4xbC0zMCw2My42aDUzLjF2OC43aC01Ny4ybC04LjIsMTcuNXYxNGg2NC4yYy0wLjYsMy0xLjIsNi0yLjEsOC43aC03Mi44bC0xLDIuMXYyOS43aDQ5LjhjLTEyLjMsOC40LTMwLjMsMTUtNTUuNSwxOS4yYzguNyw4LjEsMjAuMSwyNCwyNC45LDMzYzQ0LjQtMTAuOCw3MC41LTI5LjEsODQuOS01Mi4yaDEzLjhsLTE1LjMsMjMuNGMyNC45LDcuMiw2MCwxOS44LDc3LjEsMjguNWwxOS44LTMyLjFjLTEzLjUtNi0zNi45LTEzLjgtNTcuNi0xOS44aDU4LjJMNDc4LjYsNDU2LjZMNDc4LjYsNDU2LjZ6IE0zNTUuNiwzODAuNGgtMjUuOHYtOS4zaDI1LjhWMzgwLjR6IE00MjMuNywzNzEuMXY5LjNIMzk3di05LjNINDIzLjd6IE0zNTUsMzEwLjV2LTguN2g0My41djguN0gzNTV6Ii8+PHBhdGggZD0iTTI2NC4zLDI2Ni4xaDgwLjJsMjAtNDIuNGwtMS41LTAuNWwtNi45LDEuOEgyMTYuNnY0MS4xaDMxLjJsLTI0LjksNS4xYzEyLjYsNTMuNCwyOS40LDk5LjMsNTQsMTM2LjVjLTIxLjYsMjEuNi00OC4zLDM3LjUtNzguOSw0Ny43YzguNyw4LjQsMTkuMiwyNS4yLDI0LjYsMzYuNmM2LjctMi43LDEzLjItNS42LDE5LjUtOC42bDU3LjMtMTIxLjdDMjgzLjYsMzMzLjUsMjcyLDMwMSwyNjQuMywyNjYuMXoiLz48cGF0aCBkPSJNMTk4LDMyMy40Yy0xMy41LTkuOS00MS4xLTIyLjgtNTkuNy0zMEwxMTcsMzI2LjdjMTkuMiw4LjcsNDUuOSwyMy4xLDU4LjIsMzMuNkwxOTgsMzIzLjR6Ii8+PHBhdGggZD0iTTIxMS41LDI0NS4xYy0xMi42LTEwLjgtMzguNC0yNC01Ni43LTMxLjVMMTMyLDI0NS43YzE4LjksOSw0My44LDI0LDU0LjksMzQuOEwyMTEuNSwyNDUuMXoiLz48cGF0aCBkPSJNMTgwLDM2Ni42Yy0xOCwzNS4xLTQwLjIsNzEuNC01NS44LDkzLjZsMzUuMSwyOS43YzE4LTMwLDM1LjQtNjIuNCw1MS05My45TDE4MCwzNjYuNnoiLz48L2c+PC9zdmc+");mask-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iOTUgMjA2IDQxNCAzNDgiPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik00NzguNiw0NTYuNmgtODRjMC42LTMsMS4yLTUuNywxLjUtOC43aDcyLjZ2LTMxLjVIMzk3di04LjdoNjguMXYtNjMuNkgzOTd2LTYuOWg0NS42di0zNS40aDMwLjN2LTMyLjdoLTMwLjN2LTE0LjRoLTQ0LjF2MTQuNGgtMzAuNmwtMzIuMSw2OC4xaDE5Ljh2Ni45aC0yMy4xbC0zMCw2My42aDUzLjF2OC43aC01Ny4ybC04LjIsMTcuNXYxNGg2NC4yYy0wLjYsMy0xLjIsNi0yLjEsOC43aC03Mi44bC0xLDIuMXYyOS43aDQ5LjhjLTEyLjMsOC40LTMwLjMsMTUtNTUuNSwxOS4yYzguNyw4LjEsMjAuMSwyNCwyNC45LDMzYzQ0LjQtMTAuOCw3MC41LTI5LjEsODQuOS01Mi4yaDEzLjhsLTE1LjMsMjMuNGMyNC45LDcuMiw2MCwxOS44LDc3LjEsMjguNWwxOS44LTMyLjFjLTEzLjUtNi0zNi45LTEzLjgtNTcuNi0xOS44aDU4LjJMNDc4LjYsNDU2LjZMNDc4LjYsNDU2LjZ6IE0zNTUuNiwzODAuNGgtMjUuOHYtOS4zaDI1LjhWMzgwLjR6IE00MjMuNywzNzEuMXY5LjNIMzk3di05LjNINDIzLjd6IE0zNTUsMzEwLjV2LTguN2g0My41djguN0gzNTV6Ii8+PHBhdGggZD0iTTI2NC4zLDI2Ni4xaDgwLjJsMjAtNDIuNGwtMS41LTAuNWwtNi45LDEuOEgyMTYuNnY0MS4xaDMxLjJsLTI0LjksNS4xYzEyLjYsNTMuNCwyOS40LDk5LjMsNTQsMTM2LjVjLTIxLjYsMjEuNi00OC4zLDM3LjUtNzguOSw0Ny43YzguNyw4LjQsMTkuMiwyNS4yLDI0LjYsMzYuNmM2LjctMi43LDEzLjItNS42LDE5LjUtOC42bDU3LjMtMTIxLjdDMjgzLjYsMzMzLjUsMjcyLDMwMSwyNjQuMywyNjYuMXoiLz48cGF0aCBkPSJNMTk4LDMyMy40Yy0xMy41LTkuOS00MS4xLTIyLjgtNTkuNy0zMEwxMTcsMzI2LjdjMTkuMiw4LjcsNDUuOSwyMy4xLDU4LjIsMzMuNkwxOTgsMzIzLjR6Ii8+PHBhdGggZD0iTTIxMS41LDI0NS4xYy0xMi42LTEwLjgtMzguNC0yNC01Ni43LTMxLjVMMTMyLDI0NS43YzE4LjksOSw0My44LDI0LDU0LjksMzQuOEwyMTEuNSwyNDUuMXoiLz48cGF0aCBkPSJNMTgwLDM2Ni42Yy0xOCwzNS4xLTQwLjIsNzEuNC01NS44LDkzLjZsMzUuMSwyOS43YzE4LTMwLDM1LjQtNjIuNCw1MS05My45TDE4MCwzNjYuNnoiLz48L2c+PC9zdmc+")}.mw-ui-icon-wikimedia-quotes:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJcXVvdGVzCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Im03IDYgMS0ySDZDMy43OSA0IDIgNi43OSAyIDl2N2g3VjlINWMwLTMgMi0zIDItM203IDNjMC0zIDItMyAyLTNsMS0yaC0yYy0yLjIxIDAtNCAyLjc5LTQgNXY3aDdWOXoiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJcXVvdGVzCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Im03IDYgMS0ySDZDMy43OSA0IDIgNi43OSAyIDl2N2g3VjlINWMwLTMgMi0zIDItM203IDNjMC0zIDItMyAyLTNsMS0yaC0yYy0yLjIxIDAtNCAyLjc5LTQgNXY3aDdWOXoiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-sandbox:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJc2FuZGJveAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNOCAxMlY5bDYtNiAzIDMtNiA2em0xMC03LTMtMyAyLTIgMyAzek04IDJoMnYySDh6TTQgMmgydjJINHpNMCAzYTEgMSAwIDAgMSAxLTFoMXYySDB6bTAgM2gydjJIMHptMCA0aDJ2Mkgwem0wIDRoMnYySDB6bTAgNGgydjJIMWExIDEgMCAwIDEtMS0xem00IDBoMnYySDR6bTQgMGgydjJIOHptNCAwaDJ2MWExIDEgMCAwIDEtMSAxaC0xem0wLTRoMnYyaC0yeiIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJc2FuZGJveAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNOCAxMlY5bDYtNiAzIDMtNiA2em0xMC03LTMtMyAyLTIgMyAzek04IDJoMnYySDh6TTQgMmgydjJINHpNMCAzYTEgMSAwIDAgMSAxLTFoMXYySDB6bTAgM2gydjJIMHptMCA0aDJ2Mkgwem0wIDRoMnYySDB6bTAgNGgydjJIMWExIDEgMCAwIDEtMS0xem00IDBoMnYySDR6bTQgMGgydjJIOHptNCAwaDJ2MWExIDEgMCAwIDEtMSAxaC0xem0wLTRoMnYyaC0yeiIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-wikiText:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJV2lraXRleHQKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTEgM3YxNGgzdi0ySDNWNWgxVjN6bTQgMHYxNGg0di0ySDdWNWgyVjN6bTExIDB2MmgxdjEwaC0xdjJoM1Yzem0tNSAwdjJoMnYxMGgtMnYyaDRWM3oiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJV2lraXRleHQKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTEgM3YxNGgzdi0ySDNWNWgxVjN6bTQgMHYxNGg0di0ySDdWNWgyVjN6bTExIDB2MmgxdjEwaC0xdjJoM1Yzem0tNSAwdjJoMnYxMGgtMnYyaDRWM3oiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-reference:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJcmVmZXJlbmNlCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Im0xNSAxMC0yLjc4LTIuNzhMOS40NCAxMFYxSDVhMiAyIDAgMCAwLTIgMnYxNGEyIDIgMCAwIDAgMiAyaDEwYTIgMiAwIDAgMCAyLTJWM2EyIDIgMCAwIDAtMi0yeiIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJcmVmZXJlbmNlCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Im0xNSAxMC0yLjc4LTIuNzhMOS40NCAxMFYxSDVhMiAyIDAgMCAwLTIgMnYxNGEyIDIgMCAwIDAgMiAyaDEwYTIgMiAwIDAgMCAyLTJWM2EyIDIgMCAwIDAtMi0yeiIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-edit:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJZWRpdAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJtMTYuNzcgOCAxLjk0LTJhMSAxIDAgMCAwIDAtMS40MWwtMy4zNC0zLjNhMSAxIDAgMCAwLTEuNDEgMEwxMiAzLjIzek0xIDE0LjI1VjE5aDQuNzVsOS45Ni05Ljk2LTQuNzUtNC43NXoiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJZWRpdAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJtMTYuNzcgOCAxLjk0LTJhMSAxIDAgMCAwIDAtMS40MWwtMy4zNC0zLjNhMSAxIDAgMCAwLTEuNDEgMEwxMiAzLjIzek0xIDE0LjI1VjE5aDQuNzVsOS45Ni05Ljk2LTQuNzUtNC43NXoiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-editLock:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJZWRpdCBsb2NrCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0xMiAxMmEyIDIgMCAwIDEtMi0yVjUuMjVsLTkgOVYxOWg0Ljc1bDctN3ptNy04aC0uNVYyLjVhMi41IDIuNSAwIDAgMC01IDBWNEgxM2ExIDEgMCAwIDAtMSAxdjRhMSAxIDAgMCAwIDEgMWg2YTEgMSAwIDAgMCAxLTFWNWExIDEgMCAwIDAtMS0xbS0zIDRhMSAxIDAgMSAxIDEtMSAxIDEgMCAwIDEtMSAxbTEuNS00aC0zVjIuNzVDMTQuNSAyIDE0LjUgMSAxNiAxczEuNSAxIDEuNSAxLjc1eiIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJZWRpdCBsb2NrCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0xMiAxMmEyIDIgMCAwIDEtMi0yVjUuMjVsLTkgOVYxOWg0Ljc1bDctN3ptNy04aC0uNVYyLjVhMi41IDIuNSAwIDAgMC01IDBWNEgxM2ExIDEgMCAwIDAtMSAxdjRhMSAxIDAgMCAwIDEgMWg2YTEgMSAwIDAgMCAxLTFWNWExIDEgMCAwIDAtMS0xbS0zIDRhMSAxIDAgMSAxIDEtMSAxIDEgMCAwIDEtMSAxbTEuNS00aC0zVjIuNzVDMTQuNSAyIDE0LjUgMSAxNiAxczEuNSAxIDEuNSAxLjc1eiIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-link:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJbGluawoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNNC44MyAxNWgyLjkxYTQuOSA0LjkgMCAwIDEtMS41NS0ySDVhMyAzIDAgMSAxIDAtNmgzYTMgMyAwIDAgMSAyLjgyIDRoMi4xYTUgNSAwIDAgMCAuMDgtLjgzdi0uMzRBNC44MyA0LjgzIDAgMCAwIDguMTcgNUg0LjgzQTQuODMgNC44MyAwIDAgMCAwIDkuODN2LjM0QTQuODMgNC44MyAwIDAgMCA0LjgzIDE1Ii8+PHBhdGggZD0iTTE1LjE3IDVoLTIuOTFhNC45IDQuOSAwIDAgMSAxLjU1IDJIMTVhMyAzIDAgMSAxIDAgNmgtM2EzIDMgMCAwIDEtMi44Mi00aC0yLjFhNSA1IDAgMCAwLS4wOC44M3YuMzRBNC44MyA0LjgzIDAgMCAwIDExLjgzIDE1aDMuMzRBNC44MyA0LjgzIDAgMCAwIDIwIDEwLjE3di0uMzRBNC44MyA0LjgzIDAgMCAwIDE1LjE3IDUiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJbGluawoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNNC44MyAxNWgyLjkxYTQuOSA0LjkgMCAwIDEtMS41NS0ySDVhMyAzIDAgMSAxIDAtNmgzYTMgMyAwIDAgMSAyLjgyIDRoMi4xYTUgNSAwIDAgMCAuMDgtLjgzdi0uMzRBNC44MyA0LjgzIDAgMCAwIDguMTcgNUg0LjgzQTQuODMgNC44MyAwIDAgMCAwIDkuODN2LjM0QTQuODMgNC44MyAwIDAgMCA0LjgzIDE1Ii8+PHBhdGggZD0iTTE1LjE3IDVoLTIuOTFhNC45IDQuOSAwIDAgMSAxLjU1IDJIMTVhMyAzIDAgMSAxIDAgNmgtM2EzIDMgMCAwIDEtMi44Mi00aC0yLjFhNSA1IDAgMCAwLS4wOC44M3YuMzRBNC44MyA0LjgzIDAgMCAwIDExLjgzIDE1aDMuMzRBNC44MyA0LjgzIDAgMCAwIDIwIDEwLjE3di0uMzRBNC44MyA0LjgzIDAgMCAwIDE1LjE3IDUiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-linkExternal:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJZXh0ZXJuYWwgbGluawoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTcgMTdIM1YzaDVWMUgzYTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmgxNGEyIDIgMCAwIDAgMi0ydi01aC0yeiIvPjxwYXRoIGQ9Im0xMSAxIDMuMjkgMy4yOS01LjczIDUuNzMgMS40MiAxLjQyIDUuNzMtNS43M0wxOSA5VjF6Ii8+PC9nPjwvc3ZnPgo=");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJZXh0ZXJuYWwgbGluawoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTcgMTdIM1YzaDVWMUgzYTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmgxNGEyIDIgMCAwIDAgMi0ydi01aC0yeiIvPjxwYXRoIGQ9Im0xMSAxIDMuMjkgMy4yOS01LjczIDUuNzMgMS40MiAxLjQyIDUuNzMtNS43M0wxOSA5VjF6Ii8+PC9nPjwvc3ZnPgo=")}.mw-ui-icon-wikimedia-listBullet:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYnVsbGV0IGxpc3QKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTcgMTVoMTJ2Mkg3em0wLTZoMTJ2Mkg3em0wLTZoMTJ2Mkg3eiIvPjxjaXJjbGUgY3g9IjMiIGN5PSI0IiByPSIyIi8+PGNpcmNsZSBjeD0iMyIgY3k9IjEwIiByPSIyIi8+PGNpcmNsZSBjeD0iMyIgY3k9IjE2IiByPSIyIi8+PC9nPjwvc3ZnPgo=");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYnVsbGV0IGxpc3QKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTcgMTVoMTJ2Mkg3em0wLTZoMTJ2Mkg3em0wLTZoMTJ2Mkg3eiIvPjxjaXJjbGUgY3g9IjMiIGN5PSI0IiByPSIyIi8+PGNpcmNsZSBjeD0iMyIgY3k9IjEwIiByPSIyIi8+PGNpcmNsZSBjeD0iMyIgY3k9IjE2IiByPSIyIi8+PC9nPjwvc3ZnPgo=")}.mw-ui-icon-wikimedia-ellipsis:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJZWxsaXBzaXMKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIvPjxjaXJjbGUgY3g9IjMiIGN5PSIxMCIgcj0iMiIvPjxjaXJjbGUgY3g9IjE3IiBjeT0iMTAiIHI9IjIiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJZWxsaXBzaXMKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIvPjxjaXJjbGUgY3g9IjMiIGN5PSIxMCIgcj0iMiIvPjxjaXJjbGUgY3g9IjE3IiBjeT0iMTAiIHI9IjIiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-help:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJaGVscAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTAuMDYgMUMxMyAxIDE1IDIuODkgMTUgNS41M2E0LjU5IDQuNTkgMCAwIDEtMi4yOSA0LjA4Yy0xLjQyLjkyLTEuODIgMS41My0xLjgyIDIuNzFWMTNIOC4zOHYtLjgxYTMuODQgMy44NCAwIDAgMSAyLTMuODRjMS4zNC0uOSAxLjc5LTEuNTMgMS43OS0yLjcxYTIuMSAyLjEgMCAwIDAtMi4wOC0yLjE0aC0uMTdhMi4zIDIuMyAwIDAgMC0yLjM4IDIuMjJ2LjE3SDVBNC43MSA0LjcxIDAgMCAxIDkuNTEgMWE1IDUgMCAwIDEgLjU1IDAiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjE3IiByPSIyIi8+PC9nPjwvc3ZnPgo=");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJaGVscAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTAuMDYgMUMxMyAxIDE1IDIuODkgMTUgNS41M2E0LjU5IDQuNTkgMCAwIDEtMi4yOSA0LjA4Yy0xLjQyLjkyLTEuODIgMS41My0xLjgyIDIuNzFWMTNIOC4zOHYtLjgxYTMuODQgMy44NCAwIDAgMSAyLTMuODRjMS4zNC0uOSAxLjc5LTEuNTMgMS43OS0yLjcxYTIuMSAyLjEgMCAwIDAtMi4wOC0yLjE0aC0uMTdhMi4zIDIuMyAwIDAgMC0yLjM4IDIuMjJ2LjE3SDVBNC43MSA0LjcxIDAgMCAxIDkuNTEgMWE1IDUgMCAwIDEgLjU1IDAiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjE3IiByPSIyIi8+PC9nPjwvc3ZnPgo=")}.mw-ui-icon-wikimedia-home:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJaG9tZQoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTAgMSAwIDEwaDN2OWg0di00LjZjMC0xLjQ3IDEuMzEtMi42NiAzLTIuNjZzMyAxLjE5IDMgMi42NlYxOWg0di05aDN6Ii8+PC9nPjwvc3ZnPgo=");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJaG9tZQoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTAgMSAwIDEwaDN2OWg0di00LjZjMC0xLjQ3IDEuMzEtMi42NiAzLTIuNjZzMyAxLjE5IDMgMi42NlYxOWg0di05aDN6Ii8+PC9nPjwvc3ZnPgo=")}.mw-ui-icon-wikimedia-logIn:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJbG9nIGluCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0xIDExdjZjMCAxLjEuOSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMlYzYzAtMS4xLS45LTItMi0ySDNjLTEuMSAwLTIgLjktMiAydjZoOFY1bDQuNzUgNUw5IDE1di00eiIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJbG9nIGluCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0xIDExdjZjMCAxLjEuOSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMlYzYzAtMS4xLS45LTItMi0ySDNjLTEuMSAwLTIgLjktMiAydjZoOFY1bDQuNzUgNUw5IDE1di00eiIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-logOut:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJbG9nIG91dAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMyAzaDhWMUgzYTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmg4di0ySDN6Ii8+PHBhdGggZD0iTTEzIDV2NEg1djJoOHY0bDYtNXoiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJbG9nIG91dAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMyAzaDhWMUgzYTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmg4di0ySDN6Ii8+PHBhdGggZD0iTTEzIDV2NEg1djJoOHY0bDYtNXoiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-printer:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJcHJpbnRlcgoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNNSAxaDEwdjRINXpNMyA2YTIgMiAwIDAgMC0yIDJ2N2g0djRoMTB2LTRoNFY4YTIgMiAwIDAgMC0yLTJ6bTExIDEySDZ2LTZoOHptMi04YTEgMSAwIDEgMSAxLTEgMSAxIDAgMCAxLTEgMSIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJcHJpbnRlcgoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNNSAxaDEwdjRINXpNMyA2YTIgMiAwIDAgMC0yIDJ2N2g0djRoMTB2LTRoNFY4YTIgMiAwIDAgMC0yLTJ6bTExIDEySDZ2LTZoOHptMi04YTEgMSAwIDEgMSAxLTEgMSAxIDAgMCAxLTEgMSIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-reload:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJcmVsb2FkCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0xNS42NSA0LjM1QTggOCAwIDEgMCAxNy40IDEzaC0yLjIyYTYgNiAwIDEgMS0xLTcuMjJMMTEgOWg3VjJ6Ii8+PC9nPjwvc3ZnPgo=");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJcmVsb2FkCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0xNS42NSA0LjM1QTggOCAwIDEgMCAxNy40IDEzaC0yLjIyYTYgNiAwIDEgMS0xLTcuMjJMMTEgOWg3VjJ6Ii8+PC9nPjwvc3ZnPgo=")}.mw-ui-icon-wikimedia-search:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJc2VhcmNoCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0xMi4yIDEzLjZhNyA3IDAgMSAxIDEuNC0xLjRsNS40IDUuNC0xLjQgMS40ek0zIDhhNSA1IDAgMSAwIDEwIDBBNSA1IDAgMCAwIDMgOCIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJc2VhcmNoCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0xMi4yIDEzLjZhNyA3IDAgMSAxIDEuNC0xLjRsNS40IDUuNC0xLjQgMS40ek0zIDhhNSA1IDAgMSAwIDEwIDBBNSA1IDAgMCAwIDMgOCIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-settings:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCI+PHRpdGxlPgoJCXNldHRpbmdzCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxnIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMCAxMCkiPjxwYXRoIGlkPSJhIiBkPSJNMS41LTEwaC0zbC0xIDYuNWg1bTAgN2gtNWwxIDYuNWgzIi8+PHVzZSB4bGluazpocmVmPSIjYSIgdHJhbnNmb3JtPSJyb3RhdGUoNDUpIi8+PHVzZSB4bGluazpocmVmPSIjYSIgdHJhbnNmb3JtPSJyb3RhdGUoOTApIi8+PHVzZSB4bGluazpocmVmPSIjYSIgdHJhbnNmb3JtPSJyb3RhdGUoMTM1KSIvPjwvZz48cGF0aCBkPSJNMTAgMi41YTcuNSA3LjUgMCAwIDAgMCAxNSA3LjUgNy41IDAgMCAwIDAtMTV2NGEzLjUgMy41IDAgMCAxIDAgNyAzLjUgMy41IDAgMCAxIDAtNyIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCI+PHRpdGxlPgoJCXNldHRpbmdzCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxnIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMCAxMCkiPjxwYXRoIGlkPSJhIiBkPSJNMS41LTEwaC0zbC0xIDYuNWg1bTAgN2gtNWwxIDYuNWgzIi8+PHVzZSB4bGluazpocmVmPSIjYSIgdHJhbnNmb3JtPSJyb3RhdGUoNDUpIi8+PHVzZSB4bGluazpocmVmPSIjYSIgdHJhbnNmb3JtPSJyb3RhdGUoOTApIi8+PHVzZSB4bGluazpocmVmPSIjYSIgdHJhbnNmb3JtPSJyb3RhdGUoMTM1KSIvPjwvZz48cGF0aCBkPSJNMTAgMi41YTcuNSA3LjUgMCAwIDAgMCAxNSA3LjUgNy41IDAgMCAwIDAtMTV2NGEzLjUgMy41IDAgMCAxIDAgNyAzLjUgMy41IDAgMCAxIDAtNyIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-recentChanges:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJcmVjZW50IGNoYW5nZXMKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTEgM2gxNnYySDF6bTAgNmgxMXYySDF6bTAgNmg3djJIMXptMTcuOC0zLjEgMS0xLjFhLjYuNiAwIDAgMCAwLS44TDE4IDguMmEuNi42IDAgMCAwLS44IDBsLTEgMXptLTMuMy0yTDEwIDE1LjNWMThoMi42bDUuNi01LjUtMi43LTIuN1oiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJcmVjZW50IGNoYW5nZXMKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTEgM2gxNnYySDF6bTAgNmgxMXYySDF6bTAgNmg3djJIMXptMTcuOC0zLjEgMS0xLjFhLjYuNiAwIDAgMCAwLS44TDE4IDguMmEuNi42IDAgMCAwLS44IDBsLTEgMXptLTMuMy0yTDEwIDE1LjNWMThoMi42bDUuNi01LjUtMi43LTIuN1oiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-image:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJaW1hZ2UKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTIgMmEyIDIgMCAwIDAtMiAydjEyYTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMlY0YTIgMiAwIDAgMC0yLTJ6bS0uMTcgMTMgNC4wOS01LjI1IDIuOTIgMy41MUwxMi45MiA4bDUuMjUgN3oiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJaW1hZ2UKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTIgMmEyIDIgMCAwIDAtMiAydjEyYTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMlY0YTIgMiAwIDAgMC0yLTJ6bS0uMTcgMTMgNC4wOS01LjI1IDIuOTIgMy41MUwxMi45MiA4bDUuMjUgN3oiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-imageGallery:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJaW1hZ2UgZ2FsbGVyeQoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMyA1YTIgMiAwIDAgMC0yIDJ2MTBhMiAyIDAgMCAwIDIgMmgxNGEyIDIgMCAwIDAgMi0yVjdhMiAyIDAgMCAwLTItMnptMCAxMSAzLjUtNC41IDIuNSAzIDMuNS00LjUgNC41IDZ6TTE2IDJhMiAyIDAgMCAxIDIgMkgyYTIgMiAwIDAgMSAyLTJ6Ii8+PC9nPjwvc3ZnPgo=");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJaW1hZ2UgZ2FsbGVyeQoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMyA1YTIgMiAwIDAgMC0yIDJ2MTBhMiAyIDAgMCAwIDIgMmgxNGEyIDIgMCAwIDAgMi0yVjdhMiAyIDAgMCAwLTItMnptMCAxMSAzLjUtNC41IDIuNSAzIDMuNS00LjUgNC41IDZ6TTE2IDJhMiAyIDAgMCAxIDIgMkgyYTIgMiAwIDAgMSAyLTJ6Ii8+PC9nPjwvc3ZnPgo=")}.mw-ui-icon-wikimedia-block:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYmxvY2sKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTEwIDFhOSA5IDAgMSAwIDkgOSA5IDkgMCAwIDAtOS05bTUgMTBINVY5aDEweiIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYmxvY2sKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTEwIDFhOSA5IDAgMSAwIDkgOSA5IDkgMCAwIDAtOS05bTUgMTBINVY5aDEweiIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-lock:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJbG9jawoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTYuMDcgOEgxNVY1czAtNS01LTUtNSA1LTUgNXYzSDMuOTNBMS45MyAxLjkzIDAgMCAwIDIgOS45M3Y4LjE1QTEuOTMgMS45MyAwIDAgMCAzLjkzIDIwaDEyLjE0QTEuOTMgMS45MyAwIDAgMCAxOCAxOC4wN1Y5LjkzQTEuOTMgMS45MyAwIDAgMCAxNi4wNyA4TTEwIDE2YTIgMiAwIDEgMSAyLTIgMiAyIDAgMCAxLTIgMm0zLThIN1Y1LjVDNyA0IDcgMiAxMCAyczMgMiAzIDMuNXoiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJbG9jawoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTYuMDcgOEgxNVY1czAtNS01LTUtNSA1LTUgNXYzSDMuOTNBMS45MyAxLjkzIDAgMCAwIDIgOS45M3Y4LjE1QTEuOTMgMS45MyAwIDAgMCAzLjkzIDIwaDEyLjE0QTEuOTMgMS45MyAwIDAgMCAxOCAxOC4wN1Y5LjkzQTEuOTMgMS45MyAwIDAgMCAxNi4wNyA4TTEwIDE2YTIgMiAwIDEgMSAyLTIgMiAyIDAgMCAxLTIgMm0zLThIN1Y1LjVDNyA0IDcgMiAxMCAyczMgMiAzIDMuNXoiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-unLock:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJdW4tbG9jawoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTUgOFY1czAtNS01LTVhNC42MyA0LjYzIDAgMCAwLTQuODggNGgyQzcuMzEgMi45MyA4IDIgMTAgMmMzIDAgMyAyIDMgMy41VjhIMy45M0ExLjkzIDEuOTMgMCAwIDAgMiA5LjkzdjguMTVBMS45MyAxLjkzIDAgMCAwIDMuOTMgMjBoMTIuMTRBMS45MyAxLjkzIDAgMCAwIDE4IDE4LjA3VjkuOTNBMS45MyAxLjkzIDAgMCAwIDE2LjA3IDh6bS01IDhhMiAyIDAgMSAxIDItMiAyIDIgMCAwIDEtMiAyIi8+PC9nPjwvc3ZnPgo=");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJdW4tbG9jawoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMTUgOFY1czAtNS01LTVhNC42MyA0LjYzIDAgMCAwLTQuODggNGgyQzcuMzEgMi45MyA4IDIgMTAgMmMzIDAgMyAyIDMgMy41VjhIMy45M0ExLjkzIDEuOTMgMCAwIDAgMiA5LjkzdjguMTVBMS45MyAxLjkzIDAgMCAwIDMuOTMgMjBoMTIuMTRBMS45MyAxLjkzIDAgMCAwIDE4IDE4LjA3VjkuOTNBMS45MyAxLjkzIDAgMCAwIDE2LjA3IDh6bS01IDhhMiAyIDAgMSAxIDItMiAyIDIgMCAwIDEtMiAyIi8+PC9nPjwvc3ZnPgo=")}.mw-ui-icon-wikimedia-star:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJc3RhcgoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMjAgN2gtN0wxMCAuNSA3IDdIMGw1LjQ2IDUuNDctMS42NCA3IDYuMTgtMy43IDYuMTggMy43My0xLjYzLTd6bS0xMCA2LjktMy43NiAyLjI3IDEtNC4yOEwzLjUgOC41aDQuNjFMMTAgNC42bDEuOSAzLjloNC42bC0zLjczIDMuNCAxIDQuMjh6Ii8+PC9nPjwvc3ZnPgo=");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJc3RhcgoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMjAgN2gtN0wxMCAuNSA3IDdIMGw1LjQ2IDUuNDctMS42NCA3IDYuMTgtMy43IDYuMTggMy43My0xLjYzLTd6bS0xMCA2LjktMy43NiAyLjI3IDEtNC4yOEwzLjUgOC41aDQuNjFMMTAgNC42bDEuOSAzLjloNC42bC0zLjczIDMuNCAxIDQuMjh6Ii8+PC9nPjwvc3ZnPgo=")}.mw-ui-icon-wikimedia-unStar:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJdW4tc3RhcgoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMjAgN2gtN0wxMCAuNSA3IDdIMGw1LjQ2IDUuNDctMS42NCA3IDYuMTgtMy43IDYuMTggMy43My0xLjYzLTd6Ii8+PC9nPjwvc3ZnPgo=");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJdW4tc3RhcgoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJNMjAgN2gtN0wxMCAuNSA3IDdIMGw1LjQ2IDUuNDctMS42NCA3IDYuMTgtMy43IDYuMTggMy43My0xLjYzLTd6Ii8+PC9nPjwvc3ZnPgo=")}.mw-ui-icon-wikimedia-trash:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJdHJhc2gKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTE3IDJoLTMuNWwtMS0xaC01bC0xIDFIM3YyaDE0ek00IDE3YTIgMiAwIDAgMCAyIDJoOGEyIDIgMCAwIDAgMi0yVjVINHoiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJdHJhc2gKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTE3IDJoLTMuNWwtMS0xaC01bC0xIDFIM3YyaDE0ek00IDE3YTIgMiAwIDAgMCAyIDJoOGEyIDIgMCAwIDAgMi0yVjVINHoiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-arrowPrevious:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJcHJldmlvdXMKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0ibTUuODMgOSA1LjU4LTUuNThMMTAgMmwtOCA4IDggOCAxLjQxLTEuNDFMNS44MyAxMUgxOFY5eiIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJcHJldmlvdXMKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0ibTUuODMgOSA1LjU4LTUuNThMMTAgMmwtOCA4IDggOCAxLjQxLTEuNDFMNS44MyAxMUgxOFY5eiIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-collapse:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJY29sbGFwc2UKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0ibTIuNSAxNS4yNSA3LjUtNy41IDcuNSA3LjUgMS41LTEuNS05LTktOSA5eiIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJY29sbGFwc2UKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0ibTIuNSAxNS4yNSA3LjUtNy41IDcuNSA3LjUgMS41LTEuNS05LTktOSA5eiIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-move:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJbW92ZQoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJtMTkgMTAtNC0zdjJoLTRWNWgybC0zLTQtMyA0aDJ2NEg1VjdsLTQgMyA0IDN2LTJoNHY0SDdsMyA0IDMtNGgtMnYtNGg0djJ6Ii8+PC9nPjwvc3ZnPgo=");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJbW92ZQoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJtMTkgMTAtNC0zdjJoLTRWNWgybC0zLTQtMyA0aDJ2NEg1VjdsLTQgMyA0IDN2LTJoNHY0SDdsMyA0IDMtNGgtMnYtNGg0djJ6Ii8+PC9nPjwvc3ZnPgo=")}.mw-ui-icon-wikimedia-userAdd:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYWRkIHVzZXIKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PGNpcmNsZSBjeD0iOC41IiBjeT0iMTAuNSIgcj0iMy41Ii8+PHBhdGggZD0iTTE0IDB2NGgtNHYyaDR2NGgyVjZoNFY0aC00VjB6TTggMTVjLTQuNiAwLTcgMi42OS03IDQuMjNWMjBoMTR2LS43N0MxNSAxNy42OSAxMi42IDE1IDggMTUiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJYWRkIHVzZXIKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PGNpcmNsZSBjeD0iOC41IiBjeT0iMTAuNSIgcj0iMy41Ii8+PHBhdGggZD0iTTE0IDB2NGgtNHYyaDR2NGgyVjZoNFY0aC00VjB6TTggMTVjLTQuNiAwLTcgMi42OS03IDQuMjNWMjBoMTR2LS43N0MxNSAxNy42OSAxMi42IDE1IDggMTUiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-userAvatar:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJdXNlciBhdmF0YXIKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTEwIDExYy01LjkyIDAtOCAzLTggNXYzaDE2di0zYzAtMi0yLjA4LTUtOC01Ii8+PGNpcmNsZSBjeD0iMTAiIGN5PSI1LjUiIHI9IjQuNSIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJdXNlciBhdmF0YXIKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTEwIDExYy01LjkyIDAtOCAzLTggNXYzaDE2di0zYzAtMi0yLjA4LTUtOC01Ii8+PGNpcmNsZSBjeD0iMTAiIGN5PSI1LjUiIHI9IjQuNSIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-userContributions:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJdXNlciBjb250cmlidXRpb25zCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxjaXJjbGUgY3g9IjE1LjUiIGN5PSIxMC41IiByPSIyLjUiLz48cGF0aCBkPSJNMSAxNWg4djJIMVptMC02aDEwdjJIMVptMC02aDE2djJIMVptMTQuNSAxMC42Yy0zLjMgMC00LjUgMS42LTQuNSAyLjdWMThoOXYtMS43YzAtMS0xLjItMi43LTQuNS0yLjciLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJdXNlciBjb250cmlidXRpb25zCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxjaXJjbGUgY3g9IjE1LjUiIGN5PSIxMC41IiByPSIyLjUiLz48cGF0aCBkPSJNMSAxNWg4djJIMVptMC02aDEwdjJIMVptMC02aDE2djJIMVptMTQuNSAxMC42Yy0zLjMgMC00LjUgMS42LTQuNSAyLjdWMThoOXYtMS43YzAtMS0xLjItMi43LTQuNS0yLjciLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-userGroup:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJdXNlciBncm91cAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48Y2lyY2xlIGN4PSI2IiBjeT0iNiIgcj0iMyIvPjxjaXJjbGUgY3g9IjE0IiBjeT0iNiIgcj0iMyIvPjxwYXRoIGQ9Ik0xNCAxMGMzLjMxIDAgNiAxLjc5IDYgNHYyaC02di0yYzAtMS40OC0xLjIxLTIuNzctMy0zLjQ2Ljg4LS4zNSAxLjkxLS41NCAzLS41NG0tOCAwYzMuMzEgMCA2IDEuNzkgNiA0djJIMHYtMmMwLTIuMjEgMi42OS00IDYtNCIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJdXNlciBncm91cAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48Y2lyY2xlIGN4PSI2IiBjeT0iNiIgcj0iMyIvPjxjaXJjbGUgY3g9IjE0IiBjeT0iNiIgcj0iMyIvPjxwYXRoIGQ9Ik0xNCAxMGMzLjMxIDAgNiAxLjc5IDYgNHYyaC02di0yYzAtMS40OC0xLjIxLTIuNzctMy0zLjQ2Ljg4LS4zNSAxLjkxLS41NCAzLS41NG0tOCAwYzMuMzEgMCA2IDEuNzkgNiA0djJIMHYtMmMwLTIuMjEgMi42OS00IDYtNCIvPjwvZz48L3N2Zz4K")}.mw-ui-icon-wikimedia-userTalk:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJdXNlciB0YWxrCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0xOCAwSDJhMiAyIDAgMCAwLTIgMnYxOGw0LTRoMTRhMiAyIDAgMCAwIDItMlYyYTIgMiAwIDAgMC0yLTJtLTQgNGExLjUgMS41IDAgMSAxLTEuNSAxLjVBMS41IDEuNSAwIDAgMSAxNCA0TTYgNGExLjUgMS41IDAgMSAxLTEuNSAxLjVBMS41IDEuNSAwIDAgMSA2IDRtNCA4Yy0yLjYxIDAtNC44My0uNjctNS42NS0zaDExLjNjLS44MiAyLjMzLTMuMDQgMy01LjY1IDMiLz48L2c+PC9zdmc+Cg==");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJdXNlciB0YWxrCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0xOCAwSDJhMiAyIDAgMCAwLTIgMnYxOGw0LTRoMTRhMiAyIDAgMCAwIDItMlYyYTIgMiAwIDAgMC0yLTJtLTQgNGExLjUgMS41IDAgMSAxLTEuNSAxLjVBMS41IDEuNSAwIDAgMSAxNCA0TTYgNGExLjUgMS41IDAgMSAxLTEuNSAxLjVBMS41IDEuNSAwIDAgMSA2IDRtNCA4Yy0yLjYxIDAtNC44My0uNjctNS42NS0zaDExLjNjLS44MiAyLjMzLTMuMDQgMy01LjY1IDMiLz48L2c+PC9zdmc+Cg==")}.mw-ui-icon-wikimedia-watchlist:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJd2F0Y2hsaXN0Cgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0xIDNoMTZ2MkgxWm0wIDZoNnYySDFabTAgNmg4djJIMVptOC00LjI0aDMuODVMMTQuNSA3bDEuNjUgMy43NkgyMGwtMyAzLjE3LjkgNC4wNS0zLjQtMi4xNEwxMS4xIDE4bC45LTQuMDVaIi8+PC9nPjwvc3ZnPgo=");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJd2F0Y2hsaXN0Cgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0xIDNoMTZ2MkgxWm0wIDZoNnYySDFabTAgNmg4djJIMVptOC00LjI0aDMuODVMMTQuNSA3bDEuNjUgMy43NkgyMGwtMyAzLjE3LjkgNC4wNS0zLjQtMi4xNEwxMS4xIDE4bC45LTQuMDVaIi8+PC9nPjwvc3ZnPgo=")}.mw-ui-icon-wikimedia-logoWikidata:before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgc3Ryb2tlLXdpZHRoPSIzMC4yIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjx0aXRsZT4KCQlXaWtpZGF0YSBsb2dvCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0wIDR2MTIuMjU4aC43NDJWNHptMS40ODIgMHYxMi4yNThoMi4yMjNWNHptMi45NiAwdjEyLjI1OEg2LjY3VjR6bTIuOTY0IDB2MTIuMjU4aC43NDRWNHptMS40OCAwdjEyLjI1OGguNzQ1VjR6bTEuNDgzIDB2MTIuMjU4aDIuMjI0VjR6bTIuOTYyIDB2MTIuMjU4aC43NDJWNHptMS40ODIgMHYxMi4yNThoMi4yMjNWNHptMi45NiAwdjEyLjI1OGguNzQ0VjR6bTEuNDg0IDB2MTIuMjU4SDIwVjR6Ii8+PC9nPjwvc3ZnPgo=");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgc3Ryb2tlLXdpZHRoPSIzMC4yIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjx0aXRsZT4KCQlXaWtpZGF0YSBsb2dvCgk8L3RpdGxlPjxnIGZpbGw9IiMwMDAiPjxwYXRoIGQ9Ik0wIDR2MTIuMjU4aC43NDJWNHptMS40ODIgMHYxMi4yNThoMi4yMjNWNHptMi45NiAwdjEyLjI1OEg2LjY3VjR6bTIuOTY0IDB2MTIuMjU4aC43NDRWNHptMS40OCAwdjEyLjI1OGguNzQ1VjR6bTEuNDgzIDB2MTIuMjU4aDIuMjI0VjR6bTIuOTYyIDB2MTIuMjU4aC43NDJWNHptMS40ODIgMHYxMi4yNThoMi4yMjNWNHptMi45NiAwdjEyLjI1OGguNzQ0VjR6bTEuNDg0IDB2MTIuMjU4SDIwVjR6Ii8+PC9nPjwvc3ZnPgo=")}@media (prefers-reduced-motion:reduce){*,::before,::after{animation-delay:-0.01ms !important;animation-duration:0.01ms !important;animation-iteration-count:1 !important;scroll-behavior:auto !important;transition-duration:0ms !important}}body{margin:0}main{display:block}hr{box-sizing:content-box;height:0;overflow:visible}abbr[title]{border-bottom:1px dotted;cursor:help}@supports (text-decoration:underline dotted){abbr[title]{border-bottom:0;text-decoration:underline dotted}}pre,code,tt,kbd,samp{font-family:monospace,monospace}sub,sup{line-height:1}img{border:0}figure{margin:0}button,input,optgroup,select,textarea{margin:0}button::-moz-focus-inner,[type='button']::-moz-focus-inner,[type='reset']::-moz-focus-inner,[type='submit']::-moz-focus-inner{border-style:none;padding:0}legend{color:inherit;padding:0}@media screen{.mw-body-content::after{clear:both;content:'';display:block}.mw-body-content a.external.free{word-wrap:break-word}.mw-body-content .error{font-size:larger;color:var(--color-error,#d73333)}.rtl .mw-parser-output a.external.free,.rtl .mw-parser-output a.external.autonumber{direction:ltr;unicode-bidi:embed}.mw-hide-empty-elt .mw-parser-output:not(.mw-show-empty-elt) .mw-empty-elt{display:none}.emptyPortlet{display:none}.printfooter,.client-nojs #t-print{display:none}.noresize{max-width:100%;overflow-x:auto}@counter-style meetei{system:numeric;symbols:'\\ABF0' '\\ABF1' '\\ABF2' '\\ABF3' '\\ABF4' '\\ABF5' '\\ABF6' '\\ABF7' '\\ABF8' '\\ABF9';suffix:') '}@counter-style santali{system:numeric;symbols:'\\1C50' '\\1C51' '\\1C52' '\\1C53' '\\1C54' '\\1C55' '\\1C56' '\\1C57' '\\1C58' '\\1C59'}@counter-style myanmar_with_period{system:numeric;symbols:'\\1040' '\\1041' '\\1042' '\\1043' '\\1044' '\\1045' '\\1046' '\\1047' '\\1048' '\\1049';suffix:'\\104B\\0020'}ol:lang(azb) li,ol:lang(bcc) li,ol:lang(bgn) li,ol:lang(bqi) li,ol:lang(fa) li,ol:lang(glk) li,ol:lang(kk-arab) li,ol:lang(lrc) li,ol:lang(luz) li,ol:lang(mzn) li{list-style-type:persian}ol:lang(ckb) li,ol:lang(sdh) li{list-style-type:arabic-indic}ol:lang(hi) li,ol:lang(mai) li,ol:lang(mr) li,ol:lang(ne) li{list-style-type:devanagari}ol:lang(as) li,ol:lang(bn) li{list-style-type:bengali}ol:lang(mni) li{list-style-type:meetei}ol:lang(or) li{list-style-type:oriya}ol:lang(sat) li{list-style-type:santali}ol:lang(blk) li,ol:lang(kjp) li,ol:lang(ksw) li,ol:lang(mnw) li,ol:lang(my) li,ol:lang(shn) li{list-style-type:myanmar_with_period}.mw-heading1:lang(anp),.mw-heading1:lang(as),.mw-heading1:lang(awa),.mw-heading1:lang(bgc),.mw-heading1:lang(bh),.mw-heading1:lang(bho),.mw-heading1:lang(blk),.mw-heading1:lang(bn),.mw-heading1:lang(bo),.mw-heading1:lang(bpy),.mw-heading1:lang(ccp),.mw-heading1:lang(dty),.mw-heading1:lang(dz),.mw-heading1:lang(gom),.mw-heading1:lang(gu),.mw-heading1:lang(hi),.mw-heading1:lang(kjp),.mw-heading1:lang(km),.mw-heading1:lang(kn),.mw-heading1:lang(ks),.mw-heading1:lang(ksw),.mw-heading1:lang(mag),.mw-heading1:lang(mai),.mw-heading1:lang(ml),.mw-heading1:lang(mnw),.mw-heading1:lang(mr),.mw-heading1:lang(my),.mw-heading1:lang(new),.mw-heading1:lang(nit),.mw-heading1:lang(nod),.mw-heading1:lang(or),.mw-heading1:lang(pa),.mw-heading1:lang(pi),.mw-heading1:lang(rki),.mw-heading1:lang(sa),.mw-heading1:lang(shn),.mw-heading1:lang(si),.mw-heading1:lang(syl),.mw-heading1:lang(ta),.mw-heading1:lang(tcy),.mw-heading1:lang(tdd),.mw-heading1:lang(te),h1:lang(anp),h1:lang(as),h1:lang(awa),h1:lang(bgc),h1:lang(bh),h1:lang(bho),h1:lang(blk),h1:lang(bn),h1:lang(bo),h1:lang(bpy),h1:lang(ccp),h1:lang(dty),h1:lang(dz),h1:lang(gom),h1:lang(gu),h1:lang(hi),h1:lang(kjp),h1:lang(km),h1:lang(kn),h1:lang(ks),h1:lang(ksw),h1:lang(mag),h1:lang(mai),h1:lang(ml),h1:lang(mnw),h1:lang(mr),h1:lang(my),h1:lang(new),h1:lang(nit),h1:lang(nod),h1:lang(or),h1:lang(pa),h1:lang(pi),h1:lang(rki),h1:lang(sa),h1:lang(shn),h1:lang(si),h1:lang(syl),h1:lang(ta),h1:lang(tcy),h1:lang(tdd),h1:lang(te){line-height:1.6em !important}.mw-heading:lang(anp),.mw-heading:lang(as),.mw-heading:lang(awa),.mw-heading:lang(bgc),.mw-heading:lang(bh),.mw-heading:lang(bho),.mw-heading:lang(blk),.mw-heading:lang(bn),.mw-heading:lang(bo),.mw-heading:lang(bpy),.mw-heading:lang(ccp),.mw-heading:lang(dty),.mw-heading:lang(dz),.mw-heading:lang(gom),.mw-heading:lang(gu),.mw-heading:lang(hi),.mw-heading:lang(kjp),.mw-heading:lang(km),.mw-heading:lang(kn),.mw-heading:lang(ks),.mw-heading:lang(ksw),.mw-heading:lang(mag),.mw-heading:lang(mai),.mw-heading:lang(ml),.mw-heading:lang(mnw),.mw-heading:lang(mr),.mw-heading:lang(my),.mw-heading:lang(new),.mw-heading:lang(nit),.mw-heading:lang(nod),.mw-heading:lang(or),.mw-heading:lang(pa),.mw-heading:lang(pi),.mw-heading:lang(rki),.mw-heading:lang(sa),.mw-heading:lang(shn),.mw-heading:lang(si),.mw-heading:lang(syl),.mw-heading:lang(ta),.mw-heading:lang(tcy),.mw-heading:lang(tdd),.mw-heading:lang(te),h2:lang(anp),h2:lang(as),h2:lang(awa),h2:lang(bgc),h2:lang(bh),h2:lang(bho),h2:lang(blk),h2:lang(bn),h2:lang(bo),h2:lang(bpy),h2:lang(ccp),h2:lang(dty),h2:lang(dz),h2:lang(gom),h2:lang(gu),h2:lang(hi),h2:lang(kjp),h2:lang(km),h2:lang(kn),h2:lang(ks),h2:lang(ksw),h2:lang(mag),h2:lang(mai),h2:lang(ml),h2:lang(mnw),h2:lang(mr),h2:lang(my),h2:lang(new),h2:lang(nit),h2:lang(nod),h2:lang(or),h2:lang(pa),h2:lang(pi),h2:lang(rki),h2:lang(sa),h2:lang(shn),h2:lang(si),h2:lang(syl),h2:lang(ta),h2:lang(tcy),h2:lang(tdd),h2:lang(te),h3:lang(anp),h3:lang(as),h3:lang(awa),h3:lang(bgc),h3:lang(bh),h3:lang(bho),h3:lang(blk),h3:lang(bn),h3:lang(bo),h3:lang(bpy),h3:lang(ccp),h3:lang(dty),h3:lang(dz),h3:lang(gom),h3:lang(gu),h3:lang(hi),h3:lang(kjp),h3:lang(km),h3:lang(kn),h3:lang(ks),h3:lang(ksw),h3:lang(mag),h3:lang(mai),h3:lang(ml),h3:lang(mnw),h3:lang(mr),h3:lang(my),h3:lang(new),h3:lang(nit),h3:lang(nod),h3:lang(or),h3:lang(pa),h3:lang(pi),h3:lang(rki),h3:lang(sa),h3:lang(shn),h3:lang(si),h3:lang(syl),h3:lang(ta),h3:lang(tcy),h3:lang(tdd),h3:lang(te),h4:lang(anp),h4:lang(as),h4:lang(awa),h4:lang(bgc),h4:lang(bh),h4:lang(bho),h4:lang(blk),h4:lang(bn),h4:lang(bo),h4:lang(bpy),h4:lang(ccp),h4:lang(dty),h4:lang(dz),h4:lang(gom),h4:lang(gu),h4:lang(hi),h4:lang(kjp),h4:lang(km),h4:lang(kn),h4:lang(ks),h4:lang(ksw),h4:lang(mag),h4:lang(mai),h4:lang(ml),h4:lang(mnw),h4:lang(mr),h4:lang(my),h4:lang(new),h4:lang(nit),h4:lang(nod),h4:lang(or),h4:lang(pa),h4:lang(pi),h4:lang(rki),h4:lang(sa),h4:lang(shn),h4:lang(si),h4:lang(syl),h4:lang(ta),h4:lang(tcy),h4:lang(tdd),h4:lang(te),h5:lang(anp),h5:lang(as),h5:lang(awa),h5:lang(bgc),h5:lang(bh),h5:lang(bho),h5:lang(blk),h5:lang(bn),h5:lang(bo),h5:lang(bpy),h5:lang(ccp),h5:lang(dty),h5:lang(dz),h5:lang(gom),h5:lang(gu),h5:lang(hi),h5:lang(kjp),h5:lang(km),h5:lang(kn),h5:lang(ks),h5:lang(ksw),h5:lang(mag),h5:lang(mai),h5:lang(ml),h5:lang(mnw),h5:lang(mr),h5:lang(my),h5:lang(new),h5:lang(nit),h5:lang(nod),h5:lang(or),h5:lang(pa),h5:lang(pi),h5:lang(rki),h5:lang(sa),h5:lang(shn),h5:lang(si),h5:lang(syl),h5:lang(ta),h5:lang(tcy),h5:lang(tdd),h5:lang(te),h6:lang(anp),h6:lang(as),h6:lang(awa),h6:lang(bgc),h6:lang(bh),h6:lang(bho),h6:lang(blk),h6:lang(bn),h6:lang(bo),h6:lang(bpy),h6:lang(ccp),h6:lang(dty),h6:lang(dz),h6:lang(gom),h6:lang(gu),h6:lang(hi),h6:lang(kjp),h6:lang(km),h6:lang(kn),h6:lang(ks),h6:lang(ksw),h6:lang(mag),h6:lang(mai),h6:lang(ml),h6:lang(mnw),h6:lang(mr),h6:lang(my),h6:lang(new),h6:lang(nit),h6:lang(nod),h6:lang(or),h6:lang(pa),h6:lang(pi),h6:lang(rki),h6:lang(sa),h6:lang(shn),h6:lang(si),h6:lang(syl),h6:lang(ta),h6:lang(tcy),h6:lang(tdd),h6:lang(te){line-height:1.4em}.mw-heading1:lang(ne),h1:lang(ne){line-height:1.9}.mw-heading2:lang(th),.mw-heading2:lang(ne),h2:lang(th),h2:lang(ne){line-height:1.6}}@media print{.mw-parser-output a.external{}.mw-parser-output a.external.text::after,.mw-parser-output a.external.autonumber::after{content:' (' attr(href) ')';word-break:break-all;word-wrap:break-word}.mw-parser-output a.external.text[href^='//']:after,.mw-parser-output a.external.autonumber[href^='//']:after{content:' (https:' attr(href) ')'}.mw-editsection,.mw-editsection-like,.mw-indicators,#siteNotice,.usermessage{display:none}.printfooter{clear:both;padding:1em 0}}:root{--border-radius-medium:calc(var(--border-radius-base) * 2);--border-radius-large:calc(var(--border-radius-base) * 3);--box-shadow-border:var(--border-color-base) 0 0 0 1px;--filter-invert-fixed:invert(1) hue-rotate(180deg);--filter-image-brightness:none;--font-family-citizen-base:'Roboto','Roboto-fallback';--font-family-citizen-serif:'Roboto Serif';--font-family-citizen-monospace:'Roboto Mono';--font-family-language-base:'';--font-family-language-serif:'';--font-family-language-monospace:'';--size-icon:1.25rem;--toolbar-size:2.5rem;--height-sticky-header:0px;--header-size:3.5rem;--header-card-maxheight:calc(100dvh - var(--header-size) - var(--space-xs) * 2);--overflow-gradient-size:2rem;--width-layout:1080px;--width-layout--extended:calc(var(--width-layout) * 1.5);--width-toc:240px;--width-page:1080px;--padding-page:16px;--space-unit:1rem;--space-xxs:calc(0.25 * var(--space-unit));--space-xs:calc(0.5 * var(--space-unit));--space-sm:calc(0.75 * var(--space-unit));--space-md:var(--space-unit);--space-lg:calc(1.25 * var(--space-unit));--space-xl:calc(1.5 * var(--space-unit));--space-xxl:calc(2 * var(--space-unit));--transition-timing-function-ease:cubic-bezier(0.2,0,0,1);--transition-timing-function-ease-in:cubic-bezier(0.3,0,0.8,0.15);--transition-timing-function-ease-out:cubic-bezier(0.05,0.7,0.1,1);--transform-image-hover:scale(1.1);--citizen-clip-expand-up:inset(100% 0 0 0);--citizen-clip-expand-down:inset(0 0 100% 0);--citizen-clip-expand-right:inset(0 100% 0 0);--citizen-clip-expand-left:inset(0 0 0 100%);--citizen-translate-expand-up:translateY(var(--space-xs));--citizen-translate-expand-down:translateY(calc(var(--space-xs) * -1));--citizen-translate-expand-right:translateX(calc(var(--space-xs) * -1));--citizen-translate-expand-left:translateX(var(--space-xs));--border-base:var(--border-width-base) solid var(--border-color-base);--border-subtle:var(--border-width-base) solid var(--border-color-subtle);--border-width-base:1px;--border-width-thick:2px;--border-radius-base:4px;--border-radius-sharp:0;--border-radius-pill:9999px;--border-radius-circle:50%;--box-shadow-small:0 0 0 1px var(--border-color-base);--box-shadow-medium:0 0.5px 0.6px var(--box-shadow-color-alpha-base),0 1.6px 1.8px -0.8px var(--box-shadow-color-alpha-base),0 4px 4.5px -1.7px var(--box-shadow-color-alpha-base),0 9.800000000000001px 11px -2.5px var(--box-shadow-color-alpha-base);--box-shadow-large:0 0.5px 0.6px var(--box-shadow-color-alpha-base),0 2.8px 3.1px -0.4px var(--box-shadow-color-alpha-base),0 5.3px 6px -0.7px var(--box-shadow-color-alpha-base),0 8.699999999999999px 9.800000000000001px -1.1px var(--box-shadow-color-alpha-base),0 13.9px 15.6px -1.4px var(--box-shadow-color-alpha-base),0 21.8px 24.5px -1.8px var(--box-shadow-color-alpha-base);--font-family-base:var(--font-family-citizen-base),var(--font-family-language-base),system-ui,-apple-system,sans-serif;--font-family-serif:var(--font-family-citizen-serif),var(--font-family-language-serif),'Linux Libertine','Georgia','Times','Source Serif Pro',serif;--font-family-monospace:var(--font-family-citizen-monospace),var(--font-family-language-monospace),'Menlo','Consolas','Liberation Mono','Fira Code','Courier New',monospace;--font-weight-normal:400;--font-weight-medium:calc(var(--font-weight-normal) + 100);--font-weight-semi-bold:calc(var(--font-weight-normal) + 200);--font-weight-bold:calc(var(--font-weight-normal) + 300);--font-family-overline:var(--font-family-base);--font-weight-overline:var(--font-weight-medium);--font-size-overline:var(--font-size-small);--line-height-overline:var(--line-height-small);--text-transform-overline:none;--letter-spacing-overline:normal;--citizen-clip-closed:var(--citizen-clip-expand-up);--citizen-translate-closed:var(--citizen-translate-expand-up);--header-direction:row;--header-size-inline-start:0px;--header-size-inline-end:0px;--header-size-block-start:0px;--header-size-block-end:0px;--header-inset-block-start:0px;--header-inset-block-end:0px;--header-inset-inline-start:0px;--header-inset-inline-end:0px;--header-border-block-start-width:0px;--header-border-block-end-width:0px;--header-border-inline-start-width:0px;--header-border-inline-end-width:0px;--header-offset-block-start:var(--header-size-block-start);--header-offset-block-end:var(--header-size-block-end);--color-primary__h:var(--color-progressive-hsl__h);--color-primary__s:var(--color-progressive-hsl__s);--color-primary__l:var(--color-progressive-hsl__l);--font-size-base:var(--font-size-medium);--line-height:1.6;--line-height-xxx-small:1.25;--line-height-xx-small:1.375;--box-shadow-drop-small:var(--box-shadow-small);--box-shadow-drop-medium:var(--box-shadow-medium);--box-shadow-drop-xx-large:var(--box-shadow-large)}@media (min-width:640px){:root{--padding-page:calc(16px * 1.5)}}@media (min-width:1120px){:root{--padding-page:calc(16px * 2)}}@media (prefers-contrast:more){:root{--font-weight-normal:500}}@media (prefers-contrast:less){:root{--font-weight-normal:300}}@media (max-width:1119.98px){:root{--header-direction:row;--header-inset-inline-start:0px;--header-inset-inline-end:0px;--header-size-block-end:var(--header-size);--header-inset-block-start:auto;--header-inset-block-end:0px;--header-border-block-start-width:var(--border-width-base)}}@media (max-width:1119.98px){:root.citizen-header-position-mobile-top{--header-size-block-start:var(--header-size);--header-size-block-end:0px;--header-inset-block-start:0px;--header-inset-block-end:auto;--header-border-block-start-width:0px;--header-border-block-end-width:var(--border-width-base);--citizen-clip-closed:var(--citizen-clip-expand-down);--citizen-translate-closed:var(--citizen-translate-expand-down)}}@media (min-width:1120px){:root.citizen-header-position-left,:root.citizen-header-position-right{--header-direction:column;--header-inset-block-start:0px;--header-inset-block-end:0px;--header-card-maxheight:calc(100dvh - var(--space-xs) * 2)}:root.citizen-header-position-top,:root.citizen-header-position-bottom{--header-direction:row;--header-inset-inline-start:0px;--header-inset-inline-end:0px}:root.citizen-header-position-left{--header-size-inline-start:var(--header-size);--header-inset-inline-start:0px;--header-inset-inline-end:auto;--header-border-inline-end-width:var(--border-width-base);--citizen-clip-closed:var(--citizen-clip-expand-right);--citizen-translate-closed:var(--citizen-translate-expand-right)}:root.citizen-header-position-right{--header-size-inline-end:var(--header-size);--header-inset-inline-start:auto;--header-inset-inline-end:0px;--header-border-inline-start-width:var(--border-width-base);--citizen-clip-closed:var(--citizen-clip-expand-left);--citizen-translate-closed:var(--citizen-translate-expand-left)}:root.citizen-header-position-top{--header-size-block-start:var(--header-size);--header-inset-block-start:0px;--header-inset-block-end:auto;--header-border-block-end-width:var(--border-width-base);--citizen-clip-closed:var(--citizen-clip-expand-down);--citizen-translate-closed:var(--citizen-translate-expand-down)}:root.citizen-header-position-bottom{--header-size-block-end:var(--header-size);--header-inset-block-start:auto;--header-inset-block-end:0px;--header-border-block-start-width:var(--border-width-base);--citizen-clip-closed:var(--citizen-clip-expand-up);--citizen-translate-closed:var(--citizen-translate-expand-up)}}.citizen-animations-ready{--transition-hover:var(--transition-duration-base) var(--transition-timing-function-ease);--transition-menu:var(--transition-duration-medium) var(--transition-timing-function-ease-out);--transition-duration-base:100ms;--transition-duration-medium:250ms}@font-face{font-family:'Roboto';font-style:normal;font-weight:100 1000;src:url(/skins/Citizen/resources/skins.citizen.styles/fonts/RobotoFlex_cyrillic-ext.woff2?8fdc6) format('woff2-variations');font-display:swap;unicode-range:U+0460-052F,U+1C80-1C88,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F}@font-face{font-family:'Roboto';font-style:normal;font-weight:100 1000;src:url(/skins/Citizen/resources/skins.citizen.styles/fonts/RobotoFlex_cyrillic.woff2?93b62) format('woff2-variations');font-display:swap;unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}@font-face{font-family:'Roboto';font-style:normal;font-weight:100 1000;src:url(/skins/Citizen/resources/skins.citizen.styles/fonts/RobotoFlex_greek.woff2?1b9d4) format('woff2-variations');font-display:swap;unicode-range:U+0370-03FF}@font-face{font-family:'Roboto';font-style:normal;font-weight:100 1000;src:url(/skins/Citizen/resources/skins.citizen.styles/fonts/RobotoFlex_vietnamese.woff2?e22f5) format('woff2-variations');font-display:swap;unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+1EA0-1EF9,U+20AB}@font-face{font-family:'Roboto';font-style:normal;font-weight:100 1000;src:url(/skins/Citizen/resources/skins.citizen.styles/fonts/RobotoFlex_latin-ext.woff2?a2395) format('woff2-variations');font-display:swap;unicode-range:U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:'Roboto';font-style:normal;font-weight:100 1000;src:url(/skins/Citizen/resources/skins.citizen.styles/fonts/RobotoFlex_latin.woff2?d34c0) format('woff2-variations');font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:'Roboto-fallback';src:local('Arial'),local('Liberation Sans');size-adjust:99.06%;ascent-override:93.66%;descent-override:24.65%;line-gap-override:0%}@font-face{font-family:'Roboto Mono';font-style:normal;font-weight:100 700;src:url(/skins/Citizen/resources/skins.citizen.styles/fonts/RobotoMono_latin-ext.woff2?88102) format('woff2-variations');font-display:swap;unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:'Roboto Mono';font-style:normal;font-weight:100 700;src:url(/skins/Citizen/resources/skins.citizen.styles/fonts/RobotoMono_latin.woff2?87772) format('woff2-variations');font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}.mw-ui-icon-wikimedia-configure::before{-webkit-mask-image:url(data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%0A%09%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M3%204.17V2h2v2.17a3.001%203.001%200%200%201%200%205.66V18H3V9.83a3.001%203.001%200%200%201%200-5.66M4%206a1%201%200%201%201%200%202%201%201%200%200%201%200-2m11%2012v-6.17a3.001%203.001%200%200%201%200-5.66V2h2v4.17a3.001%203.001%200%200%201%200%205.66V18zm2-9a1%201%200%201%200-2%200%201%201%200%200%200%202%200%22%2F%3E%0A%09%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M11%2011.17a3.001%203.001%200%200%201%200%205.66V18H9v-1.17a3.001%203.001%200%200%201%200-5.66V2h2zM10%2013a1%201%200%201%201%200%202%201%201%200%200%201%200-2%22%2F%3E%0A%3C%2Fsvg%3E);mask-image:url(data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%0A%09%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M3%204.17V2h2v2.17a3.001%203.001%200%200%201%200%205.66V18H3V9.83a3.001%203.001%200%200%201%200-5.66M4%206a1%201%200%201%201%200%202%201%201%200%200%201%200-2m11%2012v-6.17a3.001%203.001%200%200%201%200-5.66V2h2v4.17a3.001%203.001%200%200%201%200%205.66V18zm2-9a1%201%200%201%200-2%200%201%201%200%200%200%202%200%22%2F%3E%0A%09%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M11%2011.17a3.001%203.001%200%200%201%200%205.66V18H9v-1.17a3.001%203.001%200%200%201%200-5.66V2h2zM10%2013a1%201%200%201%201%200%202%201%201%200%200%201%200-2%22%2F%3E%0A%3C%2Fsvg%3E)}.mw-ui-icon-wikimedia-arrowUp::before{-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJY29sbGFwc2UKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0ibTIuNSAxNS4yNSA3LjUtNy41IDcuNSA3LjUgMS41LTEuNS05LTktOSA5eiIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJY29sbGFwc2UKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0ibTIuNSAxNS4yNSA3LjUtNy41IDcuNSA3LjUgMS41LTEuNS05LTktOSA5eiIvPjwvZz48L3N2Zz4K")}html,body{font-family:var(--font-family-base);font-variation-settings:'GRAD' var(--font-grade);font-weight:var(--font-weight-normal)}body{text-autospace:normal;text-spacing-trim:normal}input{font-family:var(--font-family-base)}b,strong{font-weight:var(--font-weight-semi-bold)}cite{font-style:inherit}p:not(.mw-empty-elt) + ul,p:not(.mw-empty-elt) + ol,p:not(.mw-empty-elt) + table,p:not(.mw-empty-elt) + dl,p:not(.mw-empty-elt) + blockquote{margin-top:calc(var(--space-xs) * -1)}blockquote{font-style:italic;text-wrap:pretty;font-size:var(--font-size-medium);line-height:var(--line-height-medium)}blockquote cite{font-style:normal;font-size:var(--font-size-small);line-height:var(--line-height-small)}figcaption{color:var(--color-subtle);font-size:var(--font-size-small);line-height:var(--line-height-small)}em:lang(zh),em:lang(ja),em:lang(ko),em:lang(mn-Mong){font-style:normal}em:lang(zh){-webkit-text-emphasis:filled dot;text-emphasis:filled dot;-webkit-text-emphasis-position:under;text-emphasis-position:under right}em:lang(ja),em:lang(ko){-webkit-text-emphasis:filled;text-emphasis:filled;-webkit-text-emphasis-position:over;text-emphasis-position:over right}em:lang(mn-Mong){text-decoration:underline wavy}.citizen-body{font-size:var(--font-size-medium);line-height:var(--line-height-content)}.citizen-body:lang(ja),.citizen-body:lang(ko),.citizen-body:lang(zh){--line-height-content:1.75}.citizen-text-heading-1{font-size:var(--font-size-xxx-large);font-weight:var(--font-weight-semi-bold);line-height:var(--line-height-xxx-large)}.citizen-text-heading-2{font-size:var(--font-size-xx-large);font-weight:var(--font-weight-semi-bold);line-height:var(--line-height-xx-large)}.citizen-text-heading-3{font-size:var(--font-size-x-large);font-weight:var(--font-weight-semi-bold);line-height:var(--line-height-x-large)}.citizen-text-heading-4{font-size:var(--font-size-large);font-weight:var(--font-weight-semi-bold);line-height:var(--line-height-large)}.citizen-text-body{font-size:var(--font-size-medium);line-height:var(--line-height-medium)}.citizen-text-small{font-size:var(--font-size-small);line-height:var(--line-height-small)}.citizen-text-overline{font-family:var(--font-family-overline);font-size:var(--font-size-overline);font-weight:var(--font-weight-overline);line-height:var(--line-height-overline);text-transform:var(--text-transform-overline);letter-spacing:var(--letter-spacing-overline)}img{vertical-align:middle}hr{margin-block:var(--space-md);border:0;border-top:var(--border-width-base) solid var(--border-color-base)}h1,h2,h3,h4,h5,h6{margin-block-end:0.25em;color:var(--color-emphasized)}h1,h2{margin-block-start:2em}h3,h4{margin-block-start:1.5em}h5,h6{margin-block-start:1.25em;font-size:var(--font-size-medium);font-weight:var(--font-weight-semi-bold)}h1{font-size:var(--font-size-xxx-large);font-weight:var(--font-weight-semi-bold);line-height:var(--line-height-xxx-large)}h2{font-size:var(--font-size-xx-large);font-weight:var(--font-weight-semi-bold);line-height:var(--line-height-xx-large)}h3{font-size:var(--font-size-x-large);font-weight:var(--font-weight-semi-bold);line-height:var(--line-height-x-large)}h4{font-size:var(--font-size-large);font-weight:var(--font-weight-semi-bold);line-height:var(--line-height-large)}p{margin-block:var(--space-md);overflow-wrap:break-word}p img{margin:0}ol,ul{padding:0;margin-block:var(--space-md);margin-inline:var(--space-xxl) 0}ol ol,ul ol,ol ul,ul ul{margin-block:0}dt{font-weight:var(--font-weight-semi-bold);color:var(--color-emphasized)}dl{margin-block:var(--space-md)}dd{margin-inline-start:var(--space-xl)}pre,code,tt,kbd,samp,.mw-code{font-family:var(--font-family-monospace);font-size:var(--font-size-small);line-height:var(--line-height-small)}pre,code,.mw-code{color:var(--color-emphasized);background-color:var(--color-surface-2);border:var(--border-width-base) solid var(--border-color-base)}code{padding:2px 4px;border-radius:var(--border-radius-base)}pre,.mw-code{padding:1rem;overflow:auto;border-radius:var(--border-radius-large)}fieldset{padding:var(--space-xs) var(--space-md);margin:var(--space-md) 0;border:var(--border-width-base) solid var(--border-color-base)}legend{padding:var(--space-xxs);color:var(--color-subtle)}figure{margin:0}figure[typeof~='mw:File'].mw-halign-none,figure[typeof~='mw:File/Frameless'].mw-halign-none,figure[typeof~='mw:File/Thumb'].mw-halign-none,figure[typeof~='mw:File/Frame'].mw-halign-none{float:none;clear:none}figure[typeof~='mw:File'].mw-halign-center,figure[typeof~='mw:File/Frameless'].mw-halign-center,figure[typeof~='mw:File/Thumb'].mw-halign-center,figure[typeof~='mw:File/Frame'].mw-halign-center{margin-inline:auto;text-align:center}figure[typeof~='mw:File'] > figcaption,figure[typeof~='mw:File/Frameless'] > figcaption{display:none}figure[typeof~='mw:File/Thumb'],figure[typeof~='mw:File/Frame']{display:table;margin:var(--space-xs) auto var(--space-md) auto;text-align:center;font-size:var(--font-size-small);line-height:var(--line-height-small)}figure[typeof~='mw:File/Thumb'] > a:first-child span.mw-broken-media,figure[typeof~='mw:File/Frame'] > a:first-child span.mw-broken-media,figure[typeof~='mw:File/Thumb'] > span:first-child span.mw-broken-media,figure[typeof~='mw:File/Frame'] > span:first-child span.mw-broken-media{display:inline-block;width:180px;overflow-wrap:break-word}figure[typeof~='mw:File/Thumb'] > figcaption,figure[typeof~='mw:File/Frame'] > figcaption{display:table-caption;padding-inline:var(--border-radius-base);caption-side:bottom}figure[typeof~='mw:File/Thumb'] > figcaption:not(:empty),figure[typeof~='mw:File/Frame'] > figcaption:not(:empty){margin-top:var(--space-xs)}.mw-valign-middle .mw-file-element{vertical-align:middle}.mw-valign-baseline .mw-file-element{vertical-align:baseline}.mw-valign-sub .mw-file-element{vertical-align:sub}.mw-valign-super .mw-file-element{vertical-align:super}.mw-valign-top .mw-file-element{vertical-align:top}.mw-valign-text-top .mw-file-element{vertical-align:text-top}.mw-valign-bottom .mw-file-element{vertical-align:bottom}.mw-valign-text-bottom .mw-file-element{vertical-align:text-bottom}@media (min-width:640px){figure[typeof~='mw:File/Thumb'] > figcaption,figure[typeof~='mw:File/Frame'] > figcaption{text-align:start}.mw-content-ltr figure[typeof~='mw:File/Thumb'],.mw-content-ltr figure[typeof~='mw:File/Frame']{float:right;clear:right;margin-left:var(--space-lg)}.mw-content-rtl figure[typeof~='mw:File/Thumb'],.mw-content-rtl figure[typeof~='mw:File/Frame']{float:left;clear:left;margin-right:var(--space-lg)}figure[typeof~='mw:File'].mw-halign-right,figure[typeof~='mw:File/Frameless'].mw-halign-right,figure[typeof~='mw:File/Thumb'].mw-halign-right,figure[typeof~='mw:File/Frame'].mw-halign-right{float:right;clear:right;margin-left:var(--space-lg);margin-right:0}figure[typeof~='mw:File'].mw-halign-left,figure[typeof~='mw:File/Frameless'].mw-halign-left,figure[typeof~='mw:File/Thumb'].mw-halign-left,figure[typeof~='mw:File/Frame'].mw-halign-left{float:left;clear:left;margin-right:var(--space-lg);margin-left:0}figure[typeof~='mw:File'].mw-halign-center,figure[typeof~='mw:File/Frameless'].mw-halign-center,figure[typeof~='mw:File/Thumb'].mw-halign-center,figure[typeof~='mw:File/Frame'].mw-halign-center{float:none;clear:both;margin-inline:auto;text-align:center}}#siteSub,#contentSub,#contentSub2{overflow:hidden;text-overflow:ellipsis;color:var(--color-subtle);font-size:var(--font-size-small);line-height:var(--line-height-small)}#siteSub{line-height:var(--line-height-x-small)}#contentSub + #contentSub2{margin-top:calc(var(--space-xs) * -1)}#citizen-tagline-user > span + span::before{margin:0 var(--space-xxs);-webkit-user-select:none;user-select:none;content:'·'}span.subpages{display:block}@media screen{.citizen-page-container{display:flex;flex-direction:column;min-height:inherit}.mw-body,.parsoid-body{flex-grow:1}.citizen-body-container{display:grid;grid-template-areas:'content' 'footer';grid-template-columns:minmax(0,var(--width-layout));gap:0 var(--space-lg);justify-content:center;padding:0 var(--padding-page);margin-bottom:var(--space-xl)}.citizen-body{z-index:0;grid-area:content;word-wrap:break-word}#mw-data-after-content:not(:empty){margin-top:var(--space-xl)}.skin-invert-image img,.skin-invert{filter:var(--filter-invert)}.citizen-feature-custom-font-size-clientpref-small .citizen-body{--font-size-x-small:0.625rem;--font-size-small:0.75rem;--font-size-medium:0.875rem;--font-size-large:1rem;--font-size-x-large:1.125rem;--font-size-xx-large:1.375rem;--font-size-xxx-large:1.625rem;--line-height-x-small:1.125rem;--line-height-small:1.25rem;--line-height-medium:1.375rem;--line-height-large:1.625rem;--line-height-x-large:1.75rem;--line-height-xx-large:2rem;--line-height-xxx-large:2.25rem;--line-height-content:1.5714285}.citizen-feature-custom-font-size-clientpref-large .citizen-body{--font-size-x-small:0.875rem;--font-size-small:1rem;--font-size-medium:1.125rem;--font-size-large:1.25rem;--font-size-x-large:1.375rem;--font-size-xx-large:1.625rem;--font-size-xxx-large:1.875rem;--line-height-x-small:1.375rem;--line-height-small:1.625rem;--line-height-medium:1.75rem;--line-height-large:1.875rem;--line-height-x-large:2rem;--line-height-xx-large:2.25rem;--line-height-xxx-large:2.5rem;--line-height-content:1.55}.citizen-feature-custom-font-size-clientpref-xlarge .citizen-body{--font-size-x-small:1rem;--font-size-small:1.125rem;--font-size-medium:1.25rem;--font-size-large:1.375rem;--font-size-x-large:1.5rem;--font-size-xx-large:1.75rem;--font-size-xxx-large:2rem;--line-height-x-small:1.625rem;--line-height-small:1.75rem;--line-height-medium:1.875rem;--line-height-large:2rem;--line-height-x-large:2.125rem;--line-height-xx-large:2.375rem;--line-height-xxx-large:2.625rem;--line-height-content:1.5}:root.citizen-feature-custom-width-clientpref-standard{--width-layout:1080px}:root.citizen-feature-custom-width-clientpref-wide{--width-layout:1600px}:root.citizen-feature-custom-width-clientpref-full{--width-layout:100vw}:root:not(.citizen-v4).skin-theme-clientpref-night.citizen-feature-pure-black-clientpref-1{--color-surface-0-oklch__l:0%;--color-surface-0-oklch__c:0;--color-surface-1-oklch__c:0;--color-surface-2-oklch__c:0;--color-surface-3-oklch__c:0;--color-surface-4-oklch__c:0;--color-surface-0-hsl__l:0%;--color-surface-0-hsl__s:0%;--color-surface-1-hsl__s:0%;--color-surface-2-hsl__s:0%;--color-surface-3-hsl__s:0%;--color-surface-4-hsl__s:0%;--color-emphasized-oklch__c:0;--color-base-oklch__c:0;--color-subtle-oklch__c:0;--color-placeholder-oklch__c:0;--color-emphasized-hsl__s:0%;--color-base-hsl__s:0%;--color-subtle-hsl__s:0%;--color-placeholder-hsl__s:0%;--border-color-base:rgba(255,255,255,0.1);--border-color-subtle:rgba(255,255,255,0.05);--border-color-interactive:rgba(255,255,255,0.15);--border-color-interactive--hover:rgba(255,255,255,0.25);--border-color-interactive--active:rgba(255,255,255,0.35);--color-neutral-50:oklch(98% 0 var(--color-primary-oklch__h));--color-neutral-100:oklch(94% 0 var(--color-primary-oklch__h));--color-neutral-200:oklch(90% 0 var(--color-primary-oklch__h));--color-neutral-300:oklch(84% 0 var(--color-primary-oklch__h));--color-neutral-400:oklch(73% 0 var(--color-primary-oklch__h));--color-neutral-500:oklch(51% 0 var(--color-primary-oklch__h));--color-neutral-600:oklch(39% 0 var(--color-primary-oklch__h));--color-neutral-700:oklch(30% 0 var(--color-primary-oklch__h));--color-neutral-800:oklch(22% 0 var(--color-primary-oklch__h));--color-neutral-900:oklch(17% 0 var(--color-primary-oklch__h));--color-neutral-1000:oklch(0% 0 var(--color-primary-oklch__h))}:root.citizen-feature-performance-mode-clientpref-1{--backdrop-filter-frosted-glass:none !important;--opacity-glass:1 !important}.citizen-feature-performance-mode-clientpref-1 *,.citizen-feature-performance-mode-clientpref-1 ::before,.citizen-feature-performance-mode-clientpref-1 ::after{scroll-behavior:auto !important;transition-duration:0ms !important;animation-duration:0.01ms !important;animation-delay:-0.01ms !important;animation-iteration-count:1 !important}:root.skin-theme-clientpref-night.citizen-feature-image-dimming-clientpref-1,:root.skin-theme-clientpref-black.citizen-feature-image-dimming-clientpref-1{--filter-image-brightness:brightness(0.8)}:root{interpolate-size:allow-keywords}html{box-sizing:border-box;font-size:100%;scroll-padding-top:calc(var(--header-offset-block-start) + var(--height-sticky-header) + var(--space-xl));scroll-padding-bottom:calc(var(--header-offset-block-end) + var(--space-xl))}body{min-height:calc(100vh - env(safe-area-inset-bottom,0) - env(safe-area-inset-top,0));min-height:100dvh;color:var(--color-base);accent-color:var(--accent-color-base);background:var(--color-surface-0)}*,*::before,*::after{box-sizing:inherit;border-color:var(--border-color-base);border-style:solid;border-width:0}:focus{outline-color:var(--color-progressive)}::placeholder{color:var(--color-placeholder)}::selection{color:var(--color-inverted-primary);background-color:var(--color-progressive)}input,select,textarea{color:var(--color-emphasized);background-color:transparent;border:var(--border-width-base) solid var(--border-color-interactive)}input[disabled],select[disabled],textarea[disabled]{color:var(--color-disabled);border-color:var(--border-color-disabled)}input[disabled] ~ label,select[disabled] ~ label,textarea[disabled] ~ label{color:var(--color-disabled)}select option{background-color:var(--color-surface-1)}textarea{width:100%}blockquote{margin:var(--space-md);color:var(--color-subtle)}blockquote cite{display:block;margin-top:var(--space-sm)}blockquote cite::before{content:'— '}button{font-family:var(--font-family-base);color:var(--color-base)}th{font-weight:var(--font-weight-semi-bold);color:var(--color-emphasized)}th > p:first-child,td > p:first-child,th > ul:first-child,td > ul:first-child,th > ol:first-child,td > ol:first-child{margin-top:0}th > p:last-child,td > p:last-child,th > ul:last-child,td > ul:last-child,th > ol:last-child,td > ol:last-child{margin-bottom:0}.hidden,.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;white-space:nowrap;clip-path:inset(50%)}.nowrap{white-space:nowrap}.citizen-button{padding:0;appearance:none;cursor:pointer;background:transparent;border:0}.citizen-sitenotice-container{background-color:var(--color-surface-2)}.mw-body,.parsoid-body{direction:ltr}#mw-content-text{margin-block-start:var(--space-md)}.mw-indicators{display:flex;column-gap:var(--space-xs);align-items:center;padding-inline-start:var(--space-xs);margin-inline-start:var(--space-xs);font-size:var(--font-size-small);border-inline-start:var(--border-width-base) solid var(--border-color-base)}#mw-indicator-mw-helplink a{font-size:0}video{max-width:100%}.citizen-body a.image{display:inline-block;overflow:hidden;vertical-align:top}.citizen-body a.image > img{transition:var(--transition-hover);transition-property:transform}.citizen-body a.image:hover:not(.lazy):not(.new) > img{transform:var(--transform-image-hover)}.page-Main_Page.action-view #citizen-page-header-sticky-sentinel{display:none}.page-Main_Page.action-view .citizen-page-header{margin-top:calc(var(--space-xl) * 2)}.page-Main_Page.action-view .citizen-page-header-inner{justify-content:center}.page-Main_Page.action-view #contentSub,.page-Main_Page.action-view .citizen-page-heading{display:none}.page-Main_Page.action-view .citizen-body-container{margin-top:var(--space-xl)}.page-Main_Page.action-view .citizen-page-actions{margin-inline-start:0}.mw-heading{display:flex;align-items:center;margin-top:var(--space-md)}.mw-heading1,.mw-heading2{margin-top:3rem}.mw-heading3,.mw-heading4{margin-top:2rem}.mw-heading h1,.mw-heading h2,.mw-heading h3,.mw-heading h4,.mw-heading h5,.mw-heading h6{flex-grow:1;margin:0}a.feedlink{background:none !important}.screen-reader-text{position:absolute;width:1px;height:1px;overflow:hidden;white-space:nowrap;clip-path:inset(50%)}.center{width:100%;text-align:center}*.center *{margin-inline:auto}.floatleft,.floatright{margin:0}div.tleft,div.tright{margin:var(--space-xs) 0 var(--space-md) 0}.citizen-loading::after{--delay-progress-bar:500ms;--height-progress-bar:2px;z-index:9999;box-sizing:border-box;display:block;width:100%;height:var(--height-progress-bar);content:'';background:linear-gradient(90deg,var(--color-progressive) 0%,var(--color-progressive) 100%) -10% 0 / 0 var(--height-progress-bar) no-repeat,transparent;border-radius:0 0 var(--border-radius-large) var(--border-radius-large);filter:drop-shadow(0 0 16px var(--color-progressive)) drop-shadow(0 0 24px var(--color-progressive));animation:progressbar 1200ms linear var(--delay-progress-bar) infinite alternate}@keyframes progressbar{0%{background-position:-10% 0;background-size:0 var(--height-progress-bar)}30%{background-position:-10% 0;background-size:30% var(--height-progress-bar)}70%{background-position:110% 0;background-size:30% var(--height-progress-bar)}100%{background-position:110% 0;background-size:0 var(--height-progress-bar)}}html.citizen-loading::after{position:fixed;top:0}a{text-decoration:none;text-underline-offset:0.25em}a:where(:not([role='button'])){color:var(--color-progressive,#36c);border-radius:2px;text-decoration:none;color:var(--color-link)}a:where(:not([role='button'])):visited{color:var(--color-visited,#6a60b0)}a:where(:not([role='button'])):visited:hover{color:var(--color-visited,#6a60b0)}a:where(:not([role='button'])):hover{color:var(--color-progressive--hover,#4b77d6);text-decoration:underline}a:where(:not([role='button'])):active{color:var(--color-progressive--active,#233566);text-decoration:underline}a:where(:not([role='button'])):focus-visible{outline:solid 2px var(--outline-color-progressive--focus,#36c)}@supports not selector(:focus-visible){a:where(:not([role='button'])):focus{outline:solid 2px var(--outline-color-progressive--focus,#36c)}}a:where(:not([role='button'])) .cdx-icon:not(.cdx-thumbnail__placeholder__icon--vue):last-child{min-width:12px;min-height:12px;width:1rem;height:1rem;padding-left:4px;vertical-align:middle}a:where(:not([role='button'])):hover{color:var(--color-link--hover)}a:where(:not([role='button'])):active{color:var(--color-link--active)}a:where(:not([role='button'])):visited:hover{color:var(--color-visited--hover)}a:where(:not([role='button'])):visited:active{color:var(--color-visited--active)}a:where(.new:not([role='button'])){color:var(--color-destructive,#d73333)}a:where(.new:not([role='button'])):visited{color:var(--color-destructive--visited,#9f5555)}a:where(.new:not([role='button'])):visited:hover{color:var(--color-destructive--visited,#9f5555)}a:where(.new:not([role='button'])):hover{color:var(--color-destructive--hover,#fc493b);text-decoration:underline}a:where(.new:not([role='button'])):active{color:var(--color-destructive--active,#9f3526);text-decoration:underline}a:where(.new:not([role='button'])):focus{outline-color:var(--outline-color-progressive--focus,#36c)}.mw-parser-output a.external::after{margin-inline-start:4px;content:'';min-width:12px;min-height:12px;width:0.75rem;height:0.75rem;vertical-align:text-bottom;display:inline-block;vertical-align:baseline}@supports not ((-webkit-mask-image:none) or (mask-image:none)){.mw-parser-output a.external::after{background-position:center;background-repeat:no-repeat;background-size:calc(max(0.75rem,12px))}}@supports (-webkit-mask-image:none) or (mask-image:none){.mw-parser-output a.external::after{-webkit-mask-size:calc(max(0.75rem,12px));mask-size:calc(max(0.75rem,12px));-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center}}@supports not ((-webkit-mask-image:none) or (mask-image:none)){.mw-parser-output a.external::after{background-image:url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" width=\\"20\\" height=\\"20\\" viewBox=\\"0 0 20 20\\" fill=\\"%23000000\\"><path d=\\"M19 1h-8l3.286 3.286L6 12l1.371 1.472 8.332-7.77.007.008L19 9zM2 5h4v2H3v10h10v-4.004h2V18a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1\\"/></svg>");filter:invert(var(--filter-invert-icon,0));opacity:var(--opacity-icon-base,0.87)}.cdx-button:not(.cdx-button--weight-quiet):disabled .mw-parser-output a.external::after,.cdx-button--weight-primary.cdx-button--action-progressive .mw-parser-output a.external::after,.cdx-button--weight-primary.cdx-button--action-destructive .mw-parser-output a.external::after{filter:invert(var(--filter-invert-primary-button-icon,1))}}@supports (-webkit-mask-image:none) or (mask-image:none){.mw-parser-output a.external::after{-webkit-mask-image:url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" width=\\"20\\" height=\\"20\\" viewBox=\\"0 0 20 20\\" fill=\\"%23000000\\"><path d=\\"M19 1h-8l3.286 3.286L6 12l1.371 1.472 8.332-7.77.007.008L19 9zM2 5h4v2H3v10h10v-4.004h2V18a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1\\"/></svg>");mask-image:url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" width=\\"20\\" height=\\"20\\" viewBox=\\"0 0 20 20\\" fill=\\"%23000000\\"><path d=\\"M19 1h-8l3.286 3.286L6 12l1.371 1.472 8.332-7.77.007.008L19 9zM2 5h4v2H3v10h10v-4.004h2V18a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1\\"/></svg>");background-color:currentColor}}.mw-parser-output a.external::after[dir='rtl'],html[dir='rtl'] .mw-parser-output a.external::after:not([dir='ltr']){transform:scaleX(-1)}.mw-parser-output .plainlinks a.external::after{display:none}a.mw-selflink{font-weight:var(--font-weight-semi-bold);color:inherit;text-decoration:inherit}a.mw-selflink:hover{cursor:inherit}.mw-underline-always a{text-decoration:underline}.mw-underline-never a{text-decoration:none}.cdx-button.cdx-button--icon-only span + span{position:absolute;width:1px;height:1px;overflow:hidden;white-space:nowrap;clip-path:inset(50%);-webkit-user-select:none;-moz-user-select:none;user-select:none}.citizen-header{position:fixed;top:var(--header-inset-block-start);right:var(--header-inset-inline-end);bottom:var(--header-inset-block-end);left:var(--header-inset-inline-start);z-index:200;display:flex;flex-direction:var(--header-direction);gap:var(--space-xxs);padding:var(--space-xs) max(env(safe-area-inset-right),var(--space-xs)) max(env(safe-area-inset-bottom),var(--space-xs)) max(env(safe-area-inset-left),var(--space-xs));background-color:var(--color-surface-0);border-color:var(--border-color-base);border-style:solid;border-width:0;border-block-start-width:var(--header-border-block-start-width);border-block-end-width:var(--header-border-block-end-width);border-inline-start-width:var(--header-border-inline-start-width);border-inline-end-width:var(--header-border-inline-end-width)}.citizen-header__item{display:flex;align-items:center}.citizen-header__logo{padding:0 var(--space-xs) 0 0;margin:0 var(--space-xxs);border:0 solid var(--border-color-subtle);border-right-width:var(--border-width-base)}.citizen-header__logo .cdx-button{position:relative}.citizen-header__logo img{margin:auto}.citizen-header__logo .citizen-ui-icon{position:absolute;inset:0;margin:auto}.citizen-header__inner{display:flex;flex-grow:1;flex-direction:var(--header-direction);gap:var(--space-xxs);justify-content:space-between;min-width:0;overflow-x:auto}.citizen-header__start,.citizen-header__end{display:flex;flex-shrink:0;flex-direction:var(--header-direction);gap:var(--space-xxs)}.citizen-header__start > .citizen-menu > .citizen-menu__heading,.citizen-header__end > .citizen-menu > .citizen-menu__heading{position:absolute;width:1px;height:1px;overflow:hidden;white-space:nowrap;clip-path:inset(50%)}.citizen-header__start{align-items:center;min-width:0}.citizen-header .citizen-dropdown-summary{contain:layout paint style}.citizen-notifications-button{position:relative}.citizen-notifications-button.cdx-button.cdx-button--icon-only{gap:0;min-height:40px;padding-inline:0}.citizen-notifications-button[data-counter-text]:not([data-counter-text='0'])::after{position:absolute;top:var(--space-xxs);right:var(--space-xxs);box-sizing:content-box;width:0.5rem;height:0.5rem;content:'';background:var(--color-progressive);border:4px solid var(--color-surface-0);border-radius:var(--border-radius-circle)}.client-nojs .citizen-preferences-dropdown{display:none}.citizen-jump-link:not(:focus){position:absolute;width:1px;height:1px;overflow:hidden;white-space:nowrap;clip-path:inset(50%);-webkit-user-select:none;-moz-user-select:none;user-select:none}.citizen-jump-link:focus{position:fixed;inset-block-start:var(--space-xs);inset-inline-start:var(--space-xs);z-index:450;padding:var(--space-xs) var(--space-md);font-weight:var(--font-weight-medium);color:var(--color-emphasized);background-color:var(--color-surface-2);border-width:var(--border-width-base);border-radius:var(--border-radius-medium);box-shadow:var(--box-shadow-drop-medium)}.citizen-drawer__card{right:0;bottom:100%;left:0;max-height:var(--header-card-maxheight)}.citizen-drawer__header{display:flex;gap:var(--space-md);align-items:center;justify-content:center;padding:var(--space-md);border-bottom:var(--border-subtle)}.citizen-drawer__logo img{width:auto;height:3rem}.citizen-drawer__siteinfo{display:flex;flex-direction:column;gap:var(--space-xxs)}.citizen-drawer__menu{--size-icon:1rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(15rem,auto));gap:var(--space-sm);justify-content:center;max-width:inherit;padding:var(--space-xs);margin-bottom:var(--space-xs)}.citizen-drawer__menu .mw-list-item a{border-radius:var(--border-radius-base)}.citizen-drawer .citizen-dropdown-summary > svg > rect{transform-origin:center;transform-box:fill-box;transition:var(--transition-hover);transition-property:transform,opacity}.citizen-drawer > .citizen-dropdown-details[open] > .citizen-dropdown-summary > svg > rect:first-child{transform:translateY(6px) rotate(45deg)}.citizen-drawer > .citizen-dropdown-details[open] > .citizen-dropdown-summary > svg > rect:nth-child(2){opacity:0;transform:scaleX(0)}.citizen-drawer > .citizen-dropdown-details[open] > .citizen-dropdown-summary > svg > rect:last-child{transform:translateY(-6px) rotate(-45deg)}.citizen-userMenu .citizen-menu__card .citizen-menu__heading{position:absolute;width:1px;height:1px;overflow:hidden;white-space:nowrap;clip-path:inset(50%)}#pt-createaccount a,#pt-login a,#pt-login-private a,#pt-logout a{margin:var(--space-xs);border:var(--border-width-base) solid var(--border-color-base);border-radius:var(--border-radius-medium)}#pt-createaccount .citizen-keyboard-hint-key,#pt-login .citizen-keyboard-hint-key,#pt-login-private .citizen-keyboard-hint-key,#pt-logout .citizen-keyboard-hint-key{display:none}#pt-login a{color:var(--color-inverted-primary) !important;background-color:var(--background-color-progressive)}#pt-login a:hover{background-color:var(--background-color-progressive--hover)}#pt-login a:active{background-color:var(--background-color-progressive--active)}#pt-logout a{color:var(--color-inverted-fixed) !important;background-color:var(--background-color-destructive)}#pt-logout a:hover{background-color:var(--background-color-destructive--hover)}#pt-logout a:active{background-color:var(--background-color-destructive--active)}.citizen-search .citizen-menu__card{--size-icon:1rem;top:0;right:0;left:0;width:56rem;max-width:calc(100vw - var(--padding-page));max-height:var(--header-card-maxheight);margin-inline:auto;--citizen-clip-closed:var(--citizen-clip-expand-down);--citizen-translate-closed:var(--citizen-translate-expand-down)}.citizen-search.citizen-dropdown .citizen-menu__card{content-visibility:visible}.citizen-search .citizen-dropdown-details + .citizen-menu__card{position:fixed}.citizen-search .citizen-dropdown-details[open] + .citizen-menu__card > .citizen-search__form{transition:none}.citizen-search__formIcon{--size-icon:20px;display:grid;place-content:center;width:56px;height:56px}.citizen-search__form{position:sticky;top:0;z-index:1;background-color:color-mix(in oklch,var(--color-surface-1) calc(var(--opacity-glass) * 100%),transparent);-webkit-backdrop-filter:var(--backdrop-filter-frosted-glass);backdrop-filter:var(--backdrop-filter-frosted-glass);display:flex;height:100%;overflow:hidden;font-size:var(--font-size-medium)}@supports (-webkit-touch-callout:none){.citizen-search__form{font-size:1rem}}.citizen-search__form.citizen-loading::after{position:absolute;bottom:0}#searchInput{flex-grow:1;padding:0;font-size:inherit;appearance:none;background:transparent;border:0}#searchInput:focus{outline:0}#searchInput::-webkit-search-cancel-button{-webkit-appearance:none}.citizen-search .citizen-dropdown-summary > svg > circle{stroke-dasharray:37.699;stroke-dashoffset:0;transition:var(--transition-hover);transition-property:stroke-dashoffset,opacity}.citizen-search .citizen-dropdown-summary > svg .citizen-icon-search__handle{stroke-dasharray:7.778;stroke-dashoffset:0;transition:var(--transition-hover);transition-property:stroke-dashoffset,opacity}.citizen-search .citizen-dropdown-summary > svg .citizen-icon-search__close{opacity:0;transition:var(--transition-hover);transition-property:opacity}.citizen-search > .citizen-dropdown-details[open] > .citizen-dropdown-summary > svg > circle{opacity:0;stroke-dashoffset:37.699}.citizen-search > .citizen-dropdown-details[open] > .citizen-dropdown-summary > svg .citizen-icon-search__handle{opacity:0}.citizen-search > .citizen-dropdown-details[open] > .citizen-dropdown-summary > svg .citizen-icon-search__close{opacity:1}.citizen-page-actions{display:flex;gap:var(--space-xxs);align-items:center;margin-inline-start:auto}.citizen-page-actions__item{display:flex}.citizen-page-actions .citizen-menu__card{right:calc(var(--space-xs) * -1);display:grid;gap:var(--space-xs);max-height:60vh;--citizen-clip-closed:var(--citizen-clip-expand-up);--citizen-translate-closed:var(--citizen-translate-expand-up)}.citizen-page-actions .citizen-menu__card-content{padding-block:var(--space-xs)}.citizen-page-actions > .mw-portlet ul{display:flex;gap:var(--space-xxs)}.citizen-page-actions > .mw-portlet li > a{gap:0;padding-right:var(--space-sm);padding-left:var(--space-sm);font-size:0;border-radius:var(--border-radius-medium)}.citizen-page-actions li{margin:0}.citizen-page-actions > .citizen-menu > .citizen-menu__heading{position:absolute;width:1px;height:1px;overflow:hidden;white-space:nowrap;clip-path:inset(50%)}.citizen-page-languages .citizen-dropdown-summary{position:relative}.citizen-page-languages .citizen-dropdown-summary::after{position:absolute;top:0;right:0;display:block;padding:0.1em 0.4em;font-size:0.65rem;content:attr(data-counter-text);background:var(--color-surface-0);border-radius:var(--border-radius-pill)}#ca-ve-edit{order:98}#ca-edit{order:99}.client-js .citizen-ve-edit-merged#ca-ve-edit:has(+ #ca-edit:not(.selected)) > a{border-top-right-radius:0;border-bottom-right-radius:0}.client-js .citizen-ve-edit-merged#ca-edit{margin-left:calc(var(--space-xxs) * -1)}.client-js .citizen-ve-edit-merged#ca-edit > a{gap:0;font-size:0;border-left:var(--border-subtle);border-top-left-radius:0;border-bottom-left-radius:0}.client-nojs .citizen-share{display:none}.citizen-menu{font-size:var(--font-size-small);line-height:var(--line-height-small)}.citizen-menu__card{margin:var(--space-xs);contain:content;-webkit-user-select:none;user-select:none;border:var(--border-width-base) solid var(--border-color-base);border-radius:var(--border-radius-medium);box-shadow:var(--box-shadow-large);clip-path:var(--citizen-clip-closed);transform:var(--citizen-translate-closed);background-color:color-mix(in oklch,var(--color-surface-1) calc(var(--opacity-glass) * 100%),transparent);-webkit-backdrop-filter:var(--backdrop-filter-frosted-glass);backdrop-filter:var(--backdrop-filter-frosted-glass)}.citizen-menu__card-content{max-width:inherit;max-height:inherit;overflow:auto;overscroll-behavior:contain;scrollbar-width:none;-ms-overflow-style:none}.citizen-menu__card-content::-webkit-scrollbar{display:none}.citizen-menu__heading{padding:var(--space-xs) var(--space-md);color:var(--color-subtle);font-family:var(--font-family-overline);font-size:var(--font-size-overline);font-weight:var(--font-weight-overline);line-height:var(--line-height-overline);text-transform:var(--text-transform-overline);letter-spacing:var(--letter-spacing-overline)}.citizen-menu__content-list{margin:0;list-style:none}.citizen-menu .mw-list-item a{display:flex;gap:var(--space-sm);align-items:center;min-height:2.25rem;padding-inline:var(--space-md);font-weight:var(--font-weight-medium);color:var(--color-base);transition:var(--transition-hover);transition-property:opacity}.citizen-menu .mw-list-item a:hover{background-color:var(--background-color-button-quiet--hover)}.citizen-menu .mw-list-item a:active{background-color:var(--background-color-button-quiet--active)}.citizen-menu .mw-list-item a:hover,.citizen-menu .mw-list-item a:focus{text-decoration:none}.citizen-ui-icon{display:block;width:var(--size-icon);min-width:var(--size-icon);height:var(--size-icon);min-height:var(--size-icon);contain:strict}.citizen-ui-icon::before{display:block;width:100%;height:100%;content:'';background-color:currentcolor;background-image:none !important;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;-webkit-mask-size:contain;mask-size:contain}.mw-portlet .selected{position:absolute;width:1px;height:1px;overflow:hidden;white-space:nowrap;clip-path:inset(50%)}.mw-portlet-empty{display:none !important}.action-view:has(.diff) #ca-view,.action-view:has(.mw-revision) #ca-view{position:relative;width:auto;height:auto;overflow:initial;white-space:unset;clip-path:unset}.citizen-dropdown .citizen-menu__card{z-index:50;min-width:16rem;max-width:80vw;content-visibility:hidden;transition-timing-function:var(--transition-timing-function-ease-in);transition-duration:var(--transition-duration-base);transition-property:clip-path,transform,content-visibility;transition-behavior:allow-discrete}.citizen-dropdown .citizen-menu__card .citizen-menu__card-content{opacity:0;transition-timing-function:var(--transition-timing-function-ease-in);transition-duration:var(--transition-duration-base);transition-property:opacity}.citizen-dropdown .citizen-menu__card:empty{display:none}.citizen-dropdown-summary{cursor:pointer}.citizen-dropdown-summary > span:not(.citizen-ui-icon){position:absolute;width:1px;height:1px;overflow:hidden;white-space:nowrap;clip-path:inset(50%)}.citizen-dropdown-summary:hover{background-color:var(--background-color-button-quiet--hover)}.citizen-dropdown-summary:active{background-color:var(--background-color-button-quiet--active)}.citizen-dropdown-summary::-webkit-details-marker{display:none}.citizen-dropdown-details + .citizen-menu__card{position:absolute}.citizen-dropdown-details[open] + .citizen-menu__card{content-visibility:visible;clip-path:inset(0 0 0 0);transform:none;transition-timing-function:var(--transition-timing-function-ease-out);transition-duration:var(--transition-duration-medium)}.citizen-dropdown-details[open] + .citizen-menu__card .citizen-menu__card-content{opacity:1;transition-timing-function:var(--transition-timing-function-ease-out);transition-duration:var(--transition-duration-medium)}.citizen-dropdown-details[open] > .citizen-dropdown-summary.cdx-button{color:var(--color-emphasized);background-color:var(--background-color-button-quiet--active)}.citizen-header__end .citizen-dropdown .citizen-menu__card{right:0;bottom:100%;left:0;max-height:var(--header-card-maxheight)}.citizen-page-header{position:relative;z-index:1;padding-inline:var(--padding-page);margin-top:var(--space-xl)}.citizen-page-header-inner{display:flex;flex-wrap:wrap;gap:var(--space-md);align-items:center;max-width:var(--width-layout);padding-block:var(--space-md);margin-inline:auto}.citizen-page-heading{flex-grow:1}.firstHeading-container{display:flex;flex-wrap:wrap;align-items:center}.firstHeading{margin-block:0;line-height:2rem;overflow-wrap:break-word}.mw-page-title-namespace{color:var(--color-base)}.mw-page-title-separator{margin-right:var(--space-xxs);color:var(--color-subtle)}.mw-page-title-parenthesis{color:var(--color-subtle);font-size:var(--font-size-large);font-weight:var(--font-weight-semi-bold);line-height:var(--line-height-large)}.citizen-page-sidebar{--size-icon:1rem}.citizen-page-sidebar .citizen-menu__heading,.citizen-page-sidebar .citizen-menu .mw-list-item a{padding-inline:var(--space-xs)}.citizen-page-sidebar .citizen-menu .mw-list-item a{gap:var(--space-xs);border-radius:var(--border-radius-base)}.citizen-page-footer{display:flex;flex-direction:column;grid-area:footer;gap:var(--space-xl);padding-top:var(--space-xl);margin-top:var(--space-xl);font-size:var(--font-size-small);line-height:var(--line-height-small)}.page-info{display:flex;flex-wrap:wrap;gap:var(--space-xl)}.page-info__item{display:flex;flex-direction:column;gap:var(--space-xxs)}.page-info__label{color:var(--color-subtle);font-family:var(--font-family-overline);font-size:var(--font-size-overline);font-weight:var(--font-weight-overline);line-height:var(--line-height-overline);text-transform:var(--text-transform-overline);letter-spacing:var(--letter-spacing-overline)}.citizen-footer{--min-width-footer-link:10rem;clear:both;padding:var(--space-xxl) var(--padding-page);margin-top:8rem;contain:content;color:var(--color-subtle);background-color:var(--color-surface-1);direction:ltr;font-size:var(--font-size-small);line-height:var(--line-height-small)}.citizen-footer__container{max-width:var(--width-page);margin-inline:auto}.citizen-footer__content,.citizen-footer__bottom{display:flex;gap:var(--space-md) var(--space-xxl);justify-content:space-between;padding:var(--space-md) 0;margin-inline:auto}.citizen-footer__bottom{margin-inline:auto;border-top:var(--border-width-base) solid var(--border-color-base)}.citizen-footer__siteinfo{display:flex;flex-grow:1;flex-direction:column;gap:var(--space-xs);max-width:90ch}.citizen-footer__sitetitle{display:flex;flex-direction:column;gap:var(--space-sm)}.citizen-footer__sitetitle .mw-logo-wordmark{font-size:var(--font-size-xxx-large)}.citizen-footer__desc{margin:0;line-height:var(--line-height-small)}.citizen-footer a{font-weight:var(--font-weight-medium);color:var(--color-emphasized)}.citizen-footer ul{margin:0}.citizen-footer li{list-style:none}#footer-places{display:flex;flex-grow:1;align-items:flex-end}#footer-places ul{display:grid;flex-grow:1;grid-template-columns:repeat(auto-fit,minmax(var(--min-width-footer-link),1fr))}#footer-places a{display:block;padding:var(--space-xs) var(--space-md);border-radius:var(--border-radius-base)}#footer-places a:hover{background-color:var(--background-color-button-quiet--hover)}#footer-places a:active{background-color:var(--background-color-button-quiet--active)}#footer-places a:hover,#footer-places a:focus{text-decoration:none}#footer-icons ul{display:flex;flex-wrap:wrap;gap:var(--space-xs)}#footer-icons li{display:flex;gap:var(--space-xs)}#footer-icons a{display:flex;align-items:center;background-color:var(--background-color-base-fixed)}.citizen-notifications__placeholder{display:flex;flex-direction:column;height:min(20rem,60vh);max-height:var(--header-card-maxheight)}.citizen-notifications__placeholder-header{display:flex;flex-shrink:0;gap:var(--space-sm);align-items:center;justify-content:space-between;padding:var(--space-sm) var(--space-md)}.citizen-notifications__placeholder-title{margin:0;font-size:var(--font-size-medium);font-weight:var(--font-weight-semi-bold)}.citizen-notifications__placeholder-body{display:flex;flex:1;flex-direction:column;min-height:0;overflow:hidden}.citizen-notifications__placeholder-item{display:grid;flex-shrink:0;grid-template-columns:auto 1fr;gap:var(--space-xs);column-gap:var(--space-sm);padding:var(--space-sm) var(--space-md)}.citizen-notifications__placeholder-item + .citizen-notifications__placeholder-item{border-top:var(--border-subtle)}.citizen-notifications__placeholder-icon{grid-row:span 2;width:2rem;height:2rem;margin-block-start:0.125rem;background-color:var(--color-surface-3);border-radius:var(--border-radius-circle)}.citizen-notifications__placeholder-line{height:var(--font-size-small);background-color:var(--background-color-neutral);background-image:linear-gradient(90deg,transparent 0%,var(--background-color-interactive--hover) 50%,transparent 100%);background-repeat:no-repeat;background-position:200% 0;background-size:200% 100%;border-radius:var(--border-radius-base)}.citizen-notifications__placeholder-line--title{width:70%}.citizen-notifications__placeholder-line--meta{width:40%}.citizen-notifications__placeholder-footer{display:flex;flex-shrink:0;gap:var(--space-xs);padding:0 var(--space-md) var(--space-sm)}.citizen-notifications__placeholder-history{flex:1}.citizen-notifications__placeholder-history .citizen-ui-icon,.citizen-notifications__placeholder-prefs .citizen-ui-icon{padding-left:0}.citizen-notifications__empty{display:flex;flex:1;flex-direction:column;gap:var(--space-sm);align-items:center;justify-content:center;padding:var(--space-xl) var(--space-md);color:var(--color-subtle);text-align:center}.citizen-notifications > .citizen-notifications__see-all{display:block;padding:var(--space-md);font-size:var(--font-size-small)}.citizen-notifications__error{display:flex;flex:1;flex-direction:column;gap:var(--space-sm);align-items:center;justify-content:center;padding:var(--space-xl) var(--space-md);color:var(--color-subtle);text-align:center}@keyframes citizen-notifications-placeholder-shimmer{to{background-position:-200% 0}}.citizen-notifications__placeholder-body[hidden],.citizen-notifications__empty[hidden],.citizen-notifications__error[hidden]{display:none}.client-nojs .citizen-notifications__placeholder-body{display:none}.citizen-preferences{min-width:20rem}.citizen-preferences-skeleton{display:flex;flex-direction:column;gap:var(--space-sm);min-height:18rem;padding:var(--space-md)}.citizen-preferences-skeleton__heading{width:5rem;height:0.625rem;margin-block:var(--space-sm) var(--space-xs);border-radius:var(--border-radius-base)}.citizen-preferences-skeleton__heading:first-child{margin-block-start:0}.citizen-preferences-skeleton__row{display:flex;flex-direction:column;gap:var(--space-xxs);padding-block:var(--space-xxs)}.citizen-preferences-skeleton__label{width:55%;height:var(--font-size-small);border-radius:var(--border-radius-base)}.citizen-preferences-skeleton__description{width:80%;height:var(--font-size-small);border-radius:var(--border-radius-base)}.citizen-preferences-skeleton__heading,.citizen-preferences-skeleton__label,.citizen-preferences-skeleton__description{background-color:var(--background-color-neutral);background-image:linear-gradient(90deg,transparent 0%,var(--background-color-interactive--hover) 50%,transparent 100%);background-repeat:no-repeat;background-position:200% 0;background-size:200% 100%}@keyframes citizen-preferences-skeleton-shimmer{to{background-position:-200% 0}}.citizen-preferences-error{display:flex;flex-direction:column;gap:var(--space-sm);align-items:center;justify-content:center;min-height:12rem;padding:var(--space-md);text-align:center}.citizen-preferences-error__message{margin:0;color:var(--color-subtle)}.citizen-preferences-skeleton[hidden],.citizen-preferences-error[hidden]{display:none}.citizen-share-dialog{box-sizing:content-box;width:32rem;max-height:calc(100vh - 2 * var(--space-md));padding:0;overflow:hidden auto;background-color:var(--background-color-base);border:var(--border-base);border-radius:var(--border-radius-medium);box-shadow:var(--box-shadow-drop-xx-large)}.citizen-share-dialog::backdrop{background-color:var(--background-color-backdrop-light);-webkit-backdrop-filter:var(--backdrop-filter-blur);backdrop-filter:var(--backdrop-filter-blur)}.citizen-share-dialog__content{display:flex;flex-direction:column}.citizen-share-skeleton{display:flex;flex-direction:column;gap:var(--space-sm);min-height:8rem;padding:var(--space-md)}.citizen-share-skeleton__bar{height:0.625rem;background-color:var(--background-color-neutral);background-image:linear-gradient(90deg,transparent 0%,var(--background-color-interactive--hover) 50%,transparent 100%);background-repeat:no-repeat;background-position:200% 0;background-size:200% 100%;border-radius:var(--border-radius-base)}.citizen-share-skeleton__bar--short{width:30%}.citizen-share-skeleton__bar--medium{width:60%}.citizen-share-skeleton__bar--wide{width:90%}@keyframes citizen-share-skeleton-shimmer{to{background-position:-200% 0}}.citizen-toc{font-size:var(--font-size-small);line-height:var(--line-height-small)}.citizen-toc-contents{position:relative;margin:0 0 0 var(--space-xs);border-left:var(--border-width-thick) solid var(--border-color-base)}.citizen-toc-contents > .citizen-toc-list{padding-left:0}.citizen-toc-list{position:relative;width:100%;padding-left:var(--space-xs);margin:0;list-style:none}.citizen-toc .citizen-toc-link{display:flex;flex-grow:1;gap:var(--space-xs);align-items:center;justify-content:normal;max-width:none;font-size:inherit;font-weight:var(--font-weight-medium);text-wrap:auto;border-top-left-radius:0;border-bottom-left-radius:0}.citizen-toc .citizen-toc-link.citizen-toc-top{height:0;min-height:0;padding:0;overflow:hidden;opacity:0;transition-timing-function:var(--transition-timing-function-ease-out);transition-duration:var(--transition-duration-medium);transition-property:opacity,height,padding}.citizen-toc .citizen-toc-toggle{display:none;padding:0}.citizen-toc-indicator{position:absolute;top:0;left:0;z-index:1;width:var(--border-width-thick);height:var(--indicator-unit-height,2rem);margin-left:calc(var(--border-width-thick) * -1);background-color:var(--color-progressive);border-radius:var(--border-width-thick);transform:translateY(var(--indicator-top,0)) scaleY(var(--indicator-scale,0));transform-origin:top center;transition-timing-function:var(--transition-timing-function-ease-out);transition-duration:var(--transition-duration-medium);transition-property:transform}.citizen-toc-text{display:flex;gap:var(--space-xs)}.citizen-toc-numb{display:none;color:var(--color-subtle)}.citizen-toc-summary{color:var(--color-subtle)}.citizen-toc-list-item{position:relative;display:flex;flex-wrap:wrap}.citizen-toc .citizen-toc-list-item--active > .citizen-toc-link{color:var(--color-progressive)}.client-js .citizen-toc--collapse-enabled .citizen-toc-level-1 .citizen-toc-list-item{display:none}.client-js .citizen-toc--collapse-enabled .citizen-toc-level-1.citizen-toc-list-item--expanded .citizen-toc-list-item{display:flex}.client-js .citizen-toc--collapse-enabled .citizen-toc-toggle{--size-icon:var(--font-size-x-small);display:grid;place-content:center}.client-js .citizen-toc--collapse-enabled .citizen-toc-toggle .citizen-ui-icon::before{transform:rotate3d(1,0,0,180deg);transition:var(--transition-hover);transition-property:transform}.client-js .citizen-toc--collapse-enabled .citizen-toc-level-1.citizen-toc-list-item--expanded .citizen-toc-toggle .citizen-ui-icon::before{transform:none}.citizen-sticky-header-visible .citizen-toc .citizen-toc-top.citizen-toc-link{height:2rem;padding-block:var(--space-xs);overflow:visible;opacity:1}#citizen-page-header-sticky-sentinel{visibility:hidden;height:1px;margin-top:-1px;contain:strict}.ve-activated #citizen-page-header-sticky-sentinel,.action-edit #citizen-page-header-sticky-sentinel{display:none}.citizen-sticky-header{padding-inline:var(--padding-page);border-bottom:var(--border-base)}.citizen-sticky-header-background{position:absolute;inset:0;z-index:-100;background-color:color-mix(in oklch,var(--color-surface-0) calc(var(--opacity-glass) * 100%),transparent);-webkit-backdrop-filter:var(--backdrop-filter-frosted-glass);backdrop-filter:var(--backdrop-filter-frosted-glass)}.citizen-sticky-header-container{position:fixed;top:0;right:0;left:0;z-index:100;visibility:hidden;margin-top:var(--header-size-block-start);transform:translateY(-100%);transition-timing-function:var(--transition-timing-function-ease-out);transition-duration:var(--transition-duration-medium);transition-property:transform,visibility}.citizen-sticky-header-inner{display:flex;gap:var(--space-md);align-items:center;justify-content:space-between;max-width:var(--width-page);min-height:3.25rem;padding-block:var(--space-xxs);margin-inline:auto}.citizen-sticky-header-start{display:flex;flex-grow:1;align-items:center;margin-inline-start:-16px;overflow:hidden}.citizen-sticky-header-end{display:flex;align-items:center}.citizen-sticky-header-backtotop{flex-grow:1}.citizen-sticky-header-backtotop.cdx-button{gap:var(--space-xs);justify-content:flex-start;max-width:none}.citizen-sticky-header-backtotop:hover .citizen-ui-icon.mw-ui-icon-wikimedia-arrowUp{opacity:1;transform:none}.citizen-sticky-header-backtotop:hover .citizen-sticky-header-page-info{transform:translateX(calc(var(--size-icon) + var(--space-xs)))}.citizen-sticky-header-backtotop .citizen-ui-icon{position:absolute;opacity:0;transform:translateX(-25%);transition-timing-function:var(--transition-timing-function-ease);transition-duration:var(--transition-duration-medium);transition-property:opacity,transform}.citizen-sticky-header-page-info{overflow:hidden;transition-timing-function:var(--transition-timing-function-ease);transition-duration:var(--transition-duration-base);transition-property:transform}.citizen-sticky-header-page-title,.citizen-sticky-header-page-tagline{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.citizen-sticky-header-page-title{font-size:var(--font-size-large);font-weight:var(--font-weight-semi-bold);color:var(--color-emphasized)}.citizen-sticky-header-page-tagline{display:none;font-size:var(--font-size-x-small);color:var(--color-subtle)}.citizen-sticky-header-dropdown-container .citizen-dropdown-details[open] .citizen-dropdown-summary{background-color:var(--background-color-button-quiet--active)}.citizen-sticky-header-dropdown-container .citizen-dropdown{position:relative}.citizen-sticky-header-dropdown-container .citizen-menu__card{top:calc(100% + var(--space-xs));right:calc(var(--space-xs) * -1);max-width:80vw;max-height:60vh;--citizen-clip-closed:var(--citizen-clip-expand-down);--citizen-translate-closed:var(--citizen-translate-expand-down)}.citizen-sticky-header-dropdown-container .citizen-menu__card-content{padding-block:var(--space-xs)}.citizen-sticky-header-visible .citizen-sticky-header-container{visibility:visible;transform:none}.mw-sticky-header-element{top:var(--header-offset-block-start) !important;transition-timing-function:var(--transition-timing-function-ease);transition-duration:var(--transition-duration-medium);transition-property:top}.citizen-sticky-header-visible .mw-sticky-header-element{--header-offset-block-start:calc(var(--header-size-block-start) + var(--height-sticky-header))}.citizen-siteStats{--size-icon:0.875rem;display:flex;gap:var(--space-md);font-family:var(--font-family-overline);font-size:var(--font-size-overline);font-weight:var(--font-weight-overline);line-height:var(--line-height-overline);text-transform:var(--text-transform-overline);letter-spacing:var(--letter-spacing-overline);white-space:nowrap}.citizen-siteStats__item{display:flex;gap:var(--space-xs);align-items:center}.citizen-siteStats .citizen-ui-icon{width:0.875rem;height:0.875rem}.citizen-section-heading,section[data-mw-section-id] > .mw-heading,.mw-editsection{--size-icon:1.125rem}.citizen-section-heading{display:flex;align-items:center}.citizen-section-heading .mw-headline{flex-grow:1}.client-js .citizen-sections-enabled section:is([data-mw-section-id],.citizen-section) > :is(.mw-heading,.citizen-section-heading){cursor:pointer;-webkit-user-select:none;user-select:none}.client-js .citizen-sections-enabled section:is([data-mw-section-id],.citizen-section) > :is(.mw-heading,.citizen-section-heading)::before{flex-shrink:0;order:-2;margin-inline-end:var(--space-sm);display:block;width:var(--size-icon);height:var(--size-icon);content:'';background-color:currentcolor;-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJY29sbGFwc2UKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0ibTIuNSAxNS4yNSA3LjUtNy41IDcuNSA3LjUgMS41LTEuNS05LTktOSA5eiIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJY29sbGFwc2UKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0ibTIuNSAxNS4yNSA3LjUtNy41IDcuNSA3LjUgMS41LTEuNS05LTktOSA5eiIvPjwvZz48L3N2Zz4K");-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;-webkit-mask-size:contain;mask-size:contain;transition:var(--transition-hover);transition-property:transform}.client-js .citizen-sections-enabled section:is([data-mw-section-id],.citizen-section) > :is(.mw-heading,.citizen-section-heading) :is(.mw-headline,h1,h2,h3,h4,h5,h6){transition:var(--transition-hover);transition-property:opacity}.client-js .citizen-sections-enabled.citizen-sections-interactive section:is([data-mw-section-id],.citizen-section) > :is(.mw-heading,.citizen-section-heading)::before{content:none}.client-js .citizen-sections-enabled .citizen-section-toggle{display:flex;flex-shrink:0;align-items:center;justify-content:center;order:-2;padding:0;margin-inline-end:var(--space-sm);color:inherit;appearance:none;cursor:pointer;background:transparent;border:0;border-radius:var(--border-radius-base)}.client-js .citizen-sections-enabled .citizen-section-toggle--noop::before{display:block;width:var(--size-icon);height:var(--size-icon);content:'';background-color:currentcolor;-webkit-mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJY29sbGFwc2UKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0ibTIuNSAxNS4yNSA3LjUtNy41IDcuNSA3LjUgMS41LTEuNS05LTktOSA5eiIvPjwvZz48L3N2Zz4K");mask-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJY29sbGFwc2UKCTwvdGl0bGU+PGcgZmlsbD0iIzAwMCI+PHBhdGggZD0ibTIuNSAxNS4yNSA3LjUtNy41IDcuNSA3LjUgMS41LTEuNS05LTktOSA5eiIvPjwvZz48L3N2Zz4K");-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;-webkit-mask-size:contain;mask-size:contain;transition:var(--transition-hover);transition-property:transform}.client-js .citizen-sections-enabled .citizen-section-toggle:focus-visible{outline:var(--border-width-thick) solid var(--color-progressive);outline-offset:var(--space-xxs)}.client-js .citizen-sections-enabled section:is([data-mw-section-id],.citizen-section).citizen-section--collapsed > :is(.mw-heading,.citizen-section-heading)::before,.client-js .citizen-sections-enabled section:is([data-mw-section-id],.citizen-section).citizen-section--collapsed > :is(.mw-heading,.citizen-section-heading) > .citizen-section-toggle::before{transform:rotate3d(1,0,0,180deg)}.client-js .citizen-sections-enabled section:is([data-mw-section-id],.citizen-section).citizen-section--collapsed > :is(.mw-heading,.citizen-section-heading) :is(.mw-headline,h1,h2,h3,h4,h5,h6){color:var(--color-subtle)}.client-js .citizen-sections-enabled section:is([data-mw-section-id],.citizen-section).citizen-section--collapsed > [hidden]{display:none}.client-js .citizen-sections-enabled section:is([data-mw-section-id],.citizen-section).citizen-section--collapsed > [hidden='until-found']{display:block;margin-block:0}.citizen-overflow{overflow:auto hidden}.citizen-overflow-wrapper{position:relative;display:flex}.citizen-overflow-wrapper:has(.citizen-overflow-content > .wikitable){max-width:max-content;margin-block:var(--space-md);margin-inline:var(--border-width-base);border-radius:var(--border-radius-medium);box-shadow:var(--box-shadow-border)}.citizen-overflow-wrapper:has(.citizen-overflow-content > .wikitable--fluid){max-width:none}.citizen-overflow-wrapper:has(.citizen-overflow-content > :is(ul,ol,dl,blockquote)){margin-block:var(--space-md)}.citizen-overflow-wrapper:has(.citizen-overflow-content > :is(ul,ol,dl,blockquote)).floatleft,.citizen-overflow-wrapper:has(.citizen-overflow-content > :is(ul,ol,dl,blockquote)).floatright{margin-block:0}p:not(.mw-empty-elt) + .citizen-overflow-wrapper:has(.citizen-overflow-content > :is(ul,ol,table,dl,blockquote)){margin-top:calc(var(--space-xs) * -1)}.citizen-overflow-wrapper--floatleft,.citizen-overflow-wrapper--floatright,.citizen-overflow-wrapper.floatleft,.citizen-overflow-wrapper.floatright{margin:0}.citizen-overflow-wrapper--floatleft .citizen-overflow-content > *,.citizen-overflow-wrapper--floatright .citizen-overflow-content > *,.citizen-overflow-wrapper.floatleft .citizen-overflow-content > *,.citizen-overflow-wrapper.floatright .citizen-overflow-content > *{margin:0 !important}.citizen-overflow-content{width:100%;overflow:auto hidden}.citizen-overflow-content > *{float:none !important}.citizen-overflow-content > .citizen-overflow{margin-block:0;overflow:initial}.citizen-overflow-content > .wikitable{display:table;max-width:none;margin:0;overflow:initial;box-shadow:none}.citizen-overflow-content > .wikitable--fluid{width:100%}.citizen-overflow--left > .citizen-overflow-content{-webkit-mask-image:linear-gradient(90deg,transparent,#000 var(--overflow-gradient-size));mask-image:linear-gradient(90deg,transparent,#000 var(--overflow-gradient-size))}.citizen-overflow--right > .citizen-overflow-content{-webkit-mask-image:linear-gradient(270deg,transparent,#000 var(--overflow-gradient-size));mask-image:linear-gradient(270deg,transparent,#000 var(--overflow-gradient-size))}.citizen-overflow--left.citizen-overflow--right > .citizen-overflow-content{-webkit-mask-image:linear-gradient(90deg,transparent,#000 var(--overflow-gradient-size),#000 calc(100% - var(--overflow-gradient-size)),transparent);mask-image:linear-gradient(90deg,transparent,#000 var(--overflow-gradient-size),#000 calc(100% - var(--overflow-gradient-size)),transparent)}.citizen-overflow-nav{position:absolute;inset:0;display:flex;justify-content:space-between;pointer-events:none}.citizen-overflow-navButton{display:flex;align-items:center;justify-content:center;width:2rem;height:100%;padding:0;appearance:none;cursor:pointer;background:transparent;border:0;border-radius:var(--border-radius-medium);visibility:hidden;pointer-events:none}.citizen-overflow-navButton::before{width:1.25rem}.citizen-overflow--left .citizen-overflow-navButton-left{z-index:3;visibility:visible;pointer-events:auto}.citizen-overflow-navButton-left::before{transform:rotate(-90deg)}.citizen-overflow--right .citizen-overflow-navButton-right{z-index:3;visibility:visible;pointer-events:auto}.citizen-overflow-navButton-right::before{transform:rotate(90deg)}.citizen-overflow-navButton:hover{background-color:var(--background-color-button-quiet--hover)}.citizen-overflow-navButton:active{background-color:var(--background-color-button-quiet--active)}.citizen-overflow-sticky-row{position:relative;z-index:1}.citizen-overflow-sticky-row > th,.citizen-overflow-sticky-row > td{background-color:var(--color-surface-0)}.citizen-overflow-sticky-row:not(tr){background-color:var(--color-surface-0)}.citizen-overflow-sticky-row--boundary > th,.citizen-overflow-sticky-row--boundary > td{box-shadow:0 1px 0 0 var(--border-color-base)}.citizen-overflow-sticky-row--boundary:not(tr){box-shadow:0 1px 0 0 var(--border-color-base)}.citizen-overflow-wrapper--sticky-js .citizen-overflow-sticky-row{transform:translateY(clamp(0px,calc(var(--header-offset-block-start) - var(--citizen-overflow-sticky-top,9999px)),var(--citizen-overflow-sticky-travel,0px)))}.citizen-sticky-header-visible .citizen-overflow-wrapper--sticky-js .citizen-overflow-sticky-row{--header-offset-block-start:calc(var(--header-size-block-start) + var(--height-sticky-header))}@supports (animation-timeline:view()) and (animation-range:exit-crossing 0%){.citizen-overflow-wrapper--sticky-css{view-timeline:--citizen-overflow block;view-timeline-inset:var(--header-offset-block-start) 0}.citizen-sticky-header-visible .citizen-overflow-wrapper--sticky-css{--header-offset-block-start:calc(var(--header-size-block-start) + var(--height-sticky-header))}@media (max-width:1119.98px){.citizen-feature-autohide-navigation-clientpref-1 .citizen-scroll--down .citizen-overflow-wrapper--sticky-css{--header-offset-block-start:0px}}.citizen-overflow-wrapper--sticky-css .citizen-overflow-sticky-row{animation:citizen-overflow-sticky-band linear both;animation-timeline:--citizen-overflow;animation-range:exit-crossing 0% exit-crossing calc(100% - var(--citizen-overflow-sticky-band,0px))}}@keyframes citizen-overflow-sticky-band{from{transform:translateY(0)}to{transform:translateY(var(--citizen-overflow-sticky-travel,0))}}.citizen-animations-ready .citizen-overflow-content{scroll-behavior:smooth}.citizen-userInfo{padding:var(--space-sm) var(--space-md) var(--space-md);margin-bottom:var(--space-xs);border-bottom:var(--border-subtle);font-size:var(--font-size-small);line-height:var(--line-height-small)}.citizen-userInfo-title{font-weight:var(--font-weight-medium)}.citizen-userInfo-title > div,.citizen-userInfo #pt-userpage-2 > a,.citizen-userInfo #pt-tmpuserpage-2 > span{padding-block:var(--space-xxs);color:var(--color-emphasized);font-size:var(--font-size-large);font-weight:var(--font-weight-semi-bold);line-height:var(--line-height-large)}.citizen-userInfo #pt-userpage-2 > a > span{display:flex;flex-grow:1;flex-wrap:wrap;gap:var(--space-xs);align-items:baseline}.citizen-userInfo #pt-userpage-2 .citizen-keyboard-hint-key{display:none}.citizen-userInfo #pt-tmpuserpage-2 > span{display:block}.citizen-userInfo #pt-userpage-username{color:var(--color-subtle)}.citizen-userInfo-text{color:var(--color-subtle)}.citizen-userInfo-usergroups{display:flex;flex-wrap:wrap;gap:0 var(--space-xs);margin:0;list-style:none}.citizen-userInfo-usergroups a{color:var(--color-subtle)}.citizen-userInfo-stats{display:flex;flex-wrap:wrap;gap:var(--space-xs) var(--space-lg);margin-top:var(--space-sm)}.citizen-userInfo-stats-item{display:flex;flex-direction:column}.citizen-userInfo-stats-item-value{font-weight:var(--font-weight-medium);color:var(--color-emphasized);white-space:nowrap;font-size:var(--font-size-medium);line-height:var(--line-height-medium)}.citizen-userInfo-stats-item-label{color:var(--color-subtle);font-family:var(--font-family-overline);font-size:var(--font-size-overline);font-weight:var(--font-weight-overline);line-height:var(--line-height-overline);text-transform:var(--text-transform-overline);letter-spacing:var(--letter-spacing-overline)}#pt-userpage-2 > a{padding-inline:0;border-radius:var(--border-radius-base)}.mw-logo-wordmark{font-size:1.25rem;font-weight:var(--font-weight-semi-bold);line-height:1;color:var(--color-emphasized)}img.mw-logo-wordmark{width:100%;height:1rem;margin:0.125rem 0;object-fit:contain;object-position:left center;filter:var(--filter-invert)}.citizen-keyboard-hint{display:none;gap:var(--space-xs);align-items:center}.citizen-keyboard-hint-label{color:var(--color-base)}.citizen-keyboard-hint-key{font-family:var(--font-family-base);font-weight:var(--font-weight-medium);color:var(--color-subtle);text-transform:capitalize;direction:ltr;unicode-bidi:isolate}.citizen-menu .mw-list-item .citizen-keyboard-hint-key{margin-left:auto}#p-navigation .citizen-keyboard-hint-key{display:none}:is(.citizen-drawer,.citizen-search) > .citizen-dropdown-details[open] > .citizen-dropdown-summary > svg{transition:var(--transition-hover);transition-property:transform}:is(a,button,summary) .citizen-ui-icon{transition:var(--transition-hover);transition-property:transform}:is(a,button,summary) .citizen-ui-icon.mw-ui-icon-wikimedia-configure{transition:none}.citizen-header__logo .mw-logo-icon,.citizen-header__logo .citizen-ui-icon{transform-origin:center center;transition-timing-function:var(--transition-timing-function-ease);transition-duration:var(--transition-duration-base);transition-property:color,transform,opacity}.skin-citizen .citizen-header__logo .cdx-button{color:transparent}.skin-citizen .citizen-header__logo .cdx-button:hover{color:var(--color-base)}.skin-citizen .citizen-header__logo .cdx-button:hover .mw-logo-icon{opacity:0}.skin-citizen .citizen-header__logo .cdx-button:hover .mw-logo-icon,.skin-citizen .citizen-header__logo .cdx-button:hover .citizen-ui-icon{transform:rotate(360deg);transition-duration:var(--transition-duration-medium)}.wikitable{display:block;max-width:max-content;margin-block:var(--space-md);margin-inline:var(--border-width-base);overflow-x:auto;border-collapse:collapse;border-color:var(--border-color-base);border-radius:var(--border-radius-medium);box-shadow:var(--box-shadow-border);font-size:var(--font-size-small);line-height:var(--line-height-small)}.wikitable caption{padding:var(--space-xs) var(--space-sm);color:var(--color-emphasized);text-align:start;font-size:var(--font-size-large);font-weight:var(--font-weight-semi-bold);line-height:var(--line-height-large)}.wikitable tbody tr:hover{background-color:var(--background-color-button-quiet--hover)}.wikitable th{text-align:start}.wikitable th,.wikitable td{padding:var(--space-xs) var(--space-sm)}.wikitable tr:first-of-type th:first-child,.wikitable tr:first-of-type td:first-child{border-left-width:0;border-top-left-radius:var(--border-radius-medium)}.wikitable tr:first-of-type th:last-child,.wikitable tr:first-of-type td:last-child{border-right-width:0;border-top-right-radius:var(--border-radius-medium)}.wikitable tr:last-of-type th:first-child,.wikitable tr:last-of-type td:first-child{border-left-width:0;border-bottom-left-radius:var(--border-radius-medium)}.wikitable tr:last-of-type th:last-child,.wikitable tr:last-of-type td:last-child{border-right-width:0;border-bottom-right-radius:var(--border-radius-medium)}.wikitable > :where(caption,tr,thead,tbody,tfoot):not([hidden]) ~ :where(caption,tr,thead,tbody,tfoot):not([hidden]),.wikitable > :where(thead,tbody,tfoot) > :where(tr,thead,tbody,tfoot):not([hidden]) ~ :where(tr,thead,tbody,tfoot):not([hidden]){border-top:var(--border-width-base) solid var(--border-color-base)}.wikitable > :where(thead,tbody,tfoot):has(+ :where(thead,tbody,tfoot):not(:empty)) tr:last-of-type th:first-child,.wikitable > :where(thead,tbody,tfoot):has(+ :where(thead,tbody,tfoot):not(:empty)) tr:last-of-type td:first-child{border-bottom-left-radius:var(--border-radius-sharp)}.wikitable > :where(thead,tbody,tfoot):has(+ :where(thead,tbody,tfoot):not(:empty)) tr:last-of-type th:last-child,.wikitable > :where(thead,tbody,tfoot):has(+ :where(thead,tbody,tfoot):not(:empty)) tr:last-of-type td:last-child{border-bottom-right-radius:var(--border-radius-sharp)}.wikitable > :where(thead,tbody,tfoot) + :where(thead,tbody,tfoot):not(:empty) tr:first-of-type th:first-child,.wikitable > :where(thead,tbody,tfoot) + :where(thead,tbody,tfoot):not(:empty) tr:first-of-type td:first-child{border-top-left-radius:var(--border-radius-sharp)}.wikitable > :where(thead,tbody,tfoot) + :where(thead,tbody,tfoot):not(:empty) tr:first-of-type th:last-child,.wikitable > :where(thead,tbody,tfoot) + :where(thead,tbody,tfoot):not(:empty) tr:first-of-type td:last-child{border-top-right-radius:var(--border-radius-sharp)}.wikitable--border tr > :is(th,td):not([hidden]){border-right:var(--border-width-base) solid var(--border-color-base);border-left:var(--border-width-base) solid var(--border-color-base)}.wikitable--border tr > :is(th,td):not([hidden]):first-child{border-left:0}.wikitable--border tr > :is(th,td):not([hidden]):last-child{border-right:0}.wikitable--stripe tbody tr:nth-child(even){background-color:var(--color-surface-2)}.wikitable--fluid{max-width:none}figure[typeof~='mw:File'] > .mw-file-description,figure[typeof~='mw:File/Frameless'] > .mw-file-description,figure[typeof~='mw:File/Thumb'] > .mw-file-description,figure[typeof~='mw:File/Frame'] > .mw-file-description{display:inline-block;overflow:hidden}figure[typeof~='mw:File'] > .mw-file-description .mw-file-element,figure[typeof~='mw:File/Frameless'] > .mw-file-description .mw-file-element,figure[typeof~='mw:File/Thumb'] > .mw-file-description .mw-file-element,figure[typeof~='mw:File/Frame'] > .mw-file-description .mw-file-element,figure[typeof~='mw:File'] > .mw-file-description source,figure[typeof~='mw:File/Frameless'] > .mw-file-description source,figure[typeof~='mw:File/Thumb'] > .mw-file-description source,figure[typeof~='mw:File/Frame'] > .mw-file-description source{contain:strict;filter:var(--filter-image-brightness);transition:var(--transition-hover);transition-property:transform}table figure[typeof~='mw:File'] > .mw-file-description .mw-file-element,table figure[typeof~='mw:File/Frameless'] > .mw-file-description .mw-file-element,table figure[typeof~='mw:File/Thumb'] > .mw-file-description .mw-file-element,table figure[typeof~='mw:File/Frame'] > .mw-file-description .mw-file-element,table figure[typeof~='mw:File'] > .mw-file-description source,table figure[typeof~='mw:File/Frameless'] > .mw-file-description source,table figure[typeof~='mw:File/Thumb'] > .mw-file-description source,table figure[typeof~='mw:File/Frame'] > .mw-file-description source{max-width:none}figure[typeof~='mw:File'] > .mw-file-description:hover:not(.lazy):not(.new) .mw-file-element,figure[typeof~='mw:File/Frameless'] > .mw-file-description:hover:not(.lazy):not(.new) .mw-file-element,figure[typeof~='mw:File/Thumb'] > .mw-file-description:hover:not(.lazy):not(.new) .mw-file-element,figure[typeof~='mw:File/Frame'] > .mw-file-description:hover:not(.lazy):not(.new) .mw-file-element,figure[typeof~='mw:File'] > .mw-file-description:hover:not(.lazy):not(.new) source,figure[typeof~='mw:File/Frameless'] > .mw-file-description:hover:not(.lazy):not(.new) source,figure[typeof~='mw:File/Thumb'] > .mw-file-description:hover:not(.lazy):not(.new) source,figure[typeof~='mw:File/Frame'] > .mw-file-description:hover:not(.lazy):not(.new) source{transform:var(--transform-image-hover)}figure[typeof~='mw:File/Thumb'] > .mw-file-description,figure[typeof~='mw:File/Frame'] > .mw-file-description,figure[typeof~='mw:File/Thumb'] > span:first-child,figure[typeof~='mw:File/Frame'] > span:first-child{display:block;border-radius:var(--border-radius-base)}figure[typeof~='mw:File/Thumb'] > a:first-child:not(.mw-file-description):hover,figure[typeof~='mw:File/Frame'] > a:first-child:not(.mw-file-description):hover{color:var(--color-inverted-primary);background-color:var(--color-progressive--hover)}figure[typeof~='mw:File/Thumb'] > a:first-child:not(.mw-file-description):active,figure[typeof~='mw:File/Frame'] > a:first-child:not(.mw-file-description):active{color:var(--color-inverted-primary);background-color:var(--color-progressive--active)}figure[typeof~='mw:File/Thumb'] > a:first-child:not(.mw-file-description).new,figure[typeof~='mw:File/Frame'] > a:first-child:not(.mw-file-description).new{padding:var(--space-sm);border:var(--border-width-base) solid var(--border-color-interactive);border-style:dashed}figure[typeof~='mw:File/Thumb'] > a:first-child:not(.mw-file-description).new:hover,figure[typeof~='mw:File/Frame'] > a:first-child:not(.mw-file-description).new:hover{background-color:var(--color-destructive--hover)}figure[typeof~='mw:File/Thumb'] > a:first-child:not(.mw-file-description).new:active,figure[typeof~='mw:File/Frame'] > a:first-child:not(.mw-file-description).new:active{background-color:var(--color-destructive--active)}body.skin--responsive .mw-parser-output .noresize figure img.mw-file-element,body.skin--responsive .mw-parser-output figure.noresize img.mw-file-element,body.skin--responsive .mw-parser-output .noresize figure source,body.skin--responsive .mw-parser-output figure.noresize source{max-width:none}.mw-editsection{float:right;display:flex;align-items:center;margin-left:var(--space-sm);-webkit-user-select:none;user-select:none;font-size:var(--font-size-small);line-height:var(--line-height-small)}.mw-editsection .cdx-button--icon-only span:not(.citizen-ui-icon){display:none}.mw-content-ltr .mw-editsection,.mw-content-rtl .mw-content-ltr .mw-editsection{margin-right:0;margin-left:var(--space-sm)}.mw-content-rtl .mw-editsection,.mw-content-ltr .mw-content-rtl .mw-editsection{margin-right:var(--space-sm);margin-left:0}.mw-message-box{padding:var(--space-sm) var(--space-md);overflow:hidden;color:var(--color-emphasized);overflow-wrap:break-word;background-color:var(--color-surface-2);border:var(--border-width-base) solid var(--border-color-base);border-radius:var(--border-radius-base)}.mw-message-box > :only-child{margin:0}.mw-message-box .mw-logevent-loglines li{font-size:90%}.mw-message-box-error{background-color:var(--background-color-destructive-subtle)}.mw-message-box-warning{background-color:var(--background-color-warning-subtle)}.mw-message-box-success{background-color:var(--background-color-success-subtle)}#siteNotice .mw-message-box{border:0;border-radius:0}.usermessage{padding:var(--space-sm) var(--space-md);overflow:hidden;color:var(--color-emphasized);overflow-wrap:break-word;background-color:var(--background-color-warning-subtle);border:var(--border-width-base) solid var(--border-color-base);border-radius:var(--border-radius-base)}#siteNotice{position:relative;text-align:center}#localNotice{margin-bottom:var(--space-md)}.catlinks{clear:both;display:flex;flex-wrap:wrap;gap:var(--space-xs)}.catlinks ul{display:flex;flex-wrap:wrap;gap:var(--space-xs);margin:var(--space-xs) 0 0 0}.catlinks li{display:block}.catlinks li > a{display:block;padding:var(--space-xxs) var(--space-sm);color:var(--color-base);border:var(--border-width-base) solid var(--border-color-interactive);border-radius:var(--border-radius-pill);transition-timing-function:var(--transition-timing-function-ease);transition-duration:var(--transition-duration-base);transition-property:transform}.catlinks li > a:hover,.catlinks li > a:hover:visited{color:var(--color-inverted-primary);background-color:var(--background-color-progressive);border-radius:var(--border-radius-medium);transform:scale(1.05)}.catlinks li > a:hover,.catlinks li > a:focus{text-decoration:none}.catlinks li > a.new{border-style:dashed}.catlinks li > a.new:hover,.catlinks li > a.new:hover:visited{color:var(--color-inverted-fixed);background-color:var(--background-color-destructive)}.catlinks li > a.mw-redirect{font-style:italic}.mw-normal-catlinks > a,.mw-hidden-catlinks{color:var(--color-subtle);font-family:var(--font-family-overline);font-size:var(--font-size-overline);font-weight:var(--font-weight-overline);line-height:var(--line-height-overline);text-transform:var(--text-transform-overline);letter-spacing:var(--letter-spacing-overline)}.mw-hidden-cats-hidden,.catlinks-allhidden{display:none}}@media screen and (max-width:1119.98px){.citizen-page-container{padding-block-start:var(--header-size-block-start)}}@media screen and (min-width:1120px){.citizen-page-container{padding-block:var(--header-size-block-start) var(--header-size-block-end);padding-inline:var(--header-size-inline-start) var(--header-size-inline-end)}.citizen-toc-enabled{--width-page:calc(var(--width-layout) + var(--width-toc) + var(--space-lg))}.citizen-toc-enabled .citizen-body-container{grid-template-areas:'content sidebar' 'footer footer';grid-template-columns:minmax(0,var(--width-layout)) var(--width-toc)}.citizen-page-header,.citizen-body-container{transition-timing-function:var(--transition-timing-function-ease);transition-duration:var(--transition-duration-medium)}.citizen-page-header{transition-property:max-width}.citizen-page-header,.firstHeading-container{flex-wrap:nowrap}.citizen-page-actions .mw-list-item{text-wrap:nowrap}.citizen-body-container{transition-property:grid}}@media screen and (min-width:1680px){.ns--1,.ns-6,.ns-14{--width-layout:var(--width-layout--extended);--width-page:calc(var(--width-layout--extended) + var(--width-toc) + var(--space-lg))}}@media screen and (prefers-color-scheme:dark){:root:not(.citizen-v4).skin-theme-clientpref-os.citizen-feature-pure-black-clientpref-1{--color-surface-0-oklch__l:0%;--color-surface-0-oklch__c:0;--color-surface-1-oklch__c:0;--color-surface-2-oklch__c:0;--color-surface-3-oklch__c:0;--color-surface-4-oklch__c:0;--color-surface-0-hsl__l:0%;--color-surface-0-hsl__s:0%;--color-surface-1-hsl__s:0%;--color-surface-2-hsl__s:0%;--color-surface-3-hsl__s:0%;--color-surface-4-hsl__s:0%;--color-emphasized-oklch__c:0;--color-base-oklch__c:0;--color-subtle-oklch__c:0;--color-placeholder-oklch__c:0;--color-emphasized-hsl__s:0%;--color-base-hsl__s:0%;--color-subtle-hsl__s:0%;--color-placeholder-hsl__s:0%;--border-color-base:rgba(255,255,255,0.1);--border-color-subtle:rgba(255,255,255,0.05);--border-color-interactive:rgba(255,255,255,0.15);--border-color-interactive--hover:rgba(255,255,255,0.25);--border-color-interactive--active:rgba(255,255,255,0.35);--color-neutral-50:oklch(98% 0 var(--color-primary-oklch__h));--color-neutral-100:oklch(94% 0 var(--color-primary-oklch__h));--color-neutral-200:oklch(90% 0 var(--color-primary-oklch__h));--color-neutral-300:oklch(84% 0 var(--color-primary-oklch__h));--color-neutral-400:oklch(73% 0 var(--color-primary-oklch__h));--color-neutral-500:oklch(51% 0 var(--color-primary-oklch__h));--color-neutral-600:oklch(39% 0 var(--color-primary-oklch__h));--color-neutral-700:oklch(30% 0 var(--color-primary-oklch__h));--color-neutral-800:oklch(22% 0 var(--color-primary-oklch__h));--color-neutral-900:oklch(17% 0 var(--color-primary-oklch__h));--color-neutral-1000:oklch(0% 0 var(--color-primary-oklch__h))}}@media screen and (max-width:1119.98px){.citizen-feature-autohide-navigation-clientpref-1 .citizen-header,.citizen-feature-autohide-navigation-clientpref-1 .citizen-page-header,.citizen-feature-autohide-navigation-clientpref-1 .citizen-page-heading,.citizen-feature-autohide-navigation-clientpref-1 .citizen-toc,.citizen-feature-autohide-navigation-clientpref-1 .citizen-page-actions{transition-timing-function:var(--transition-timing-function-ease-out);transition-duration:var(--transition-duration-medium)}.citizen-feature-autohide-navigation-clientpref-1 .citizen-header{transition-property:transform}.citizen-feature-autohide-navigation-clientpref-1 .citizen-page-header,.citizen-feature-autohide-navigation-clientpref-1 .citizen-toc,.citizen-feature-autohide-navigation-clientpref-1 .citizen-page-actions{transition-property:transform,opacity}.citizen-feature-autohide-navigation-clientpref-1 .citizen-page-heading{transition-property:opacity}.citizen-feature-autohide-navigation-clientpref-1 .citizen-scroll--down .citizen-sticky-header-container,.citizen-feature-autohide-navigation-clientpref-1 .citizen-scroll--down .citizen-header,.citizen-feature-autohide-navigation-clientpref-1 .citizen-scroll--down .citizen-toc,.citizen-feature-autohide-navigation-clientpref-1 .citizen-scroll--down .citizen-page-actions{transition-timing-function:var(--transition-timing-function-ease-in)}.citizen-feature-autohide-navigation-clientpref-1 .citizen-scroll--down .citizen-header{transform:translate3d(0,100%,0)}.citizen-feature-autohide-navigation-clientpref-1 .citizen-scroll--down .citizen-toc,.citizen-feature-autohide-navigation-clientpref-1 .citizen-scroll--down .citizen-page-actions{pointer-events:none;opacity:0;transform:translate3d(0,var(--header-offset-block-end),0)}.citizen-feature-autohide-navigation-clientpref-1 .citizen-scroll--down.citizen-sticky-header-visible .citizen-sticky-header-container{transform:translate3d(0,calc(-100% - var(--header-size-block-start)),0)}.citizen-feature-autohide-navigation-clientpref-1.citizen-header-position-mobile-top .citizen-scroll--down .citizen-header{transform:translate3d(0,-100%,0)}}@media screen and (prefers-reduced-transparency:reduce){:root{--backdrop-filter-frosted-glass:none;--opacity-glass:1}}@media screen and (prefers-color-scheme:dark){:root.skin-theme-clientpref-os.citizen-feature-image-dimming-clientpref-1{--filter-image-brightness:brightness(0.8)}}@media screen and (hover:none){a,button,label{touch-action:manipulation}}@media screen and (max-width:1119.98px){.mw-body,.parsoid-body{overflow-x:hidden;overflow-x:clip}}@media screen and (min-width:1120px){.page-Main_Page.action-view .citizen-page-header-inner{border-top:var(--border-width-base) solid var(--border-color-base)}}@media screen and (min-width:640px){div.tright,.floatright{float:right;clear:right;margin-left:var(--space-lg)}div.tleft,.floatleft{float:left;clear:left;margin-right:var(--space-lg)}}@media screen and (display-mode:standalone){html.citizen-loading::after{--delay-progress-bar:0ms}}@media screen and (max-width:1119.98px){.citizen-header-position-mobile-top .citizen-header{padding:max(env(safe-area-inset-top),var(--space-xs)) max(env(safe-area-inset-right),var(--space-xs)) var(--space-xs) max(env(safe-area-inset-left),var(--space-xs))}}@media screen and (max-width:1120px){.citizen-feature-performance-mode-clientpref-0 .citizen-header{background:transparent}.citizen-feature-performance-mode-clientpref-0 .citizen-header::after{position:absolute;inset:0;z-index:-100;content:'';background-color:color-mix(in oklch,var(--color-surface-0) calc(var(--opacity-glass) * 100%),transparent);-webkit-backdrop-filter:var(--backdrop-filter-frosted-glass);backdrop-filter:var(--backdrop-filter-frosted-glass)}}@media screen and (min-width:1120px){.citizen-header{inset-block:var(--header-inset-block-start) var(--header-inset-block-end);inset-inline:var(--header-inset-inline-start) var(--header-inset-inline-end);border-block-start-width:var(--header-border-block-start-width);border-block-end-width:var(--header-border-block-end-width);border-inline-start-width:var(--header-border-inline-start-width);border-inline-end-width:var(--header-border-inline-end-width)}.citizen-header-position-left .citizen-header__logo,.citizen-header-position-right .citizen-header__logo{padding:0 0 var(--space-xs) 0;margin:var(--space-xxs) 0;border-right:0;border-bottom-width:var(--border-width-base)}.citizen-header-position-top .citizen-header{padding:var(--space-xs) var(--space-xxl)}}@media screen and (max-width:1119.98px){.citizen-header-position-mobile-top .citizen-drawer__card{top:100%;bottom:unset}}@media screen and (min-width:640px){.citizen-drawer__card{right:unset}}@media screen and (min-width:1120px){.citizen-drawer__card{right:unset;left:100%;top:0;bottom:unset}}@media screen and (min-width:1120px){.citizen-header-position-left .citizen-drawer__card{right:unset;left:100%}.citizen-header-position-right .citizen-drawer__card{right:100%;left:unset}.citizen-header-position-top .citizen-drawer__card{top:100%;right:unset;bottom:unset;left:0}.citizen-header-position-bottom .citizen-drawer__card{top:unset;right:unset;bottom:100%;left:0}}@media screen and (min-width:640px){.citizen-drawer__logo img{height:5rem}}@media screen and (min-width:1120px){.citizen-drawer__header{justify-content:flex-start}}@media screen and (hover:hover){.citizen-drawer .citizen-dropdown-summary:hover > svg > rect:first-child{transform:translateX(-25%) scaleX(0.5)}}@media screen and (min-width:1120px){.citizen-search .citizen-menu__card{top:3rem;max-height:calc(100vh - (var(--space-xs) + 3rem) * 2)}}@media screen and (max-width:1119.98px){.citizen-search .citizen-menu__card{width:auto}.citizen-search > .citizen-dropdown[open] > .citizen-menu__card{transition:none}}@media screen and (hover:hover){.citizen-search .citizen-dropdown-summary:hover > svg .citizen-icon-search__handle{stroke-dashoffset:-3.889}}@media screen and (min-width:1120px){.citizen-page-actions .citizen-menu__card{top:100%;--citizen-clip-closed:var(--citizen-clip-expand-down);--citizen-translate-closed:var(--citizen-translate-expand-down)}}@media screen and (min-width:1120px){.citizen-page-actions .citizen-dropdown{position:relative}}@media screen and (max-width:1119.98px){.citizen-page-actions{position:fixed;right:0;bottom:calc(var(--header-size-block-end) + max(env(safe-area-inset-bottom),var(--space-xs)));height:var(--toolbar-size);margin:var(--space-xs);background:var(--color-surface-1);border:1px solid var(--border-color-base);border-radius:var(--border-radius-medium);box-shadow:var(--box-shadow-large)}.citizen-page-actions :not(.citizen-menu__card) .mw-list-item{--size-icon:1rem}.citizen-page-actions > .mw-portlet li > a{height:var(--toolbar-size)}.citizen-page-actions__item{position:unset}.citizen-page-actions .citizen-menu__card{bottom:100%;width:max-content}.citizen-page-languages .citizen-dropdown-summary::after{background:var(--color-surface-1)}}@media screen and (min-width:1120px){.citizen-page-actions > .mw-portlet li > a{gap:var(--space-xs);font-size:inherit}.citizen-page-actions .citizen-menu__card{white-space:nowrap}}@media screen and (hover:none){.citizen-dropdown-summary:hover{background-color:transparent}}@media screen and (max-width:1119.98px){.citizen-header-position-mobile-top .citizen-header__end .citizen-dropdown .citizen-menu__card{top:100%;bottom:unset}}@media screen and (min-width:640px){.citizen-header__end .citizen-dropdown .citizen-menu__card{left:unset}}@media screen and (min-width:1120px){.citizen-header__end .citizen-dropdown .citizen-menu__card{right:unset;left:100%;bottom:0}}@media screen and (min-width:1120px){.citizen-header-position-left .citizen-header__end .citizen-dropdown .citizen-menu__card{right:unset;left:100%}.citizen-header-position-right .citizen-header__end .citizen-dropdown .citizen-menu__card{right:100%;left:unset}.citizen-header-position-top .citizen-header__end .citizen-dropdown .citizen-menu__card{top:100%;right:0;bottom:unset;left:unset}.citizen-header-position-bottom .citizen-header__end .citizen-dropdown .citizen-menu__card{top:unset;right:0;bottom:100%;left:unset}}@media screen and (max-width:1119.98px){.citizen-dropdown .citizen-menu__card{max-width:calc(100vw - var(--space-xs) * 2)}.citizen-dropdown-details::before{content:'';background:var(--background-color-backdrop-light);opacity:0;transition-timing-function:var(--transition-timing-function-ease-in);transition-duration:var(--transition-duration-base);transition-property:opacity}.citizen-dropdown-details[open]::before{position:fixed;inset:0;z-index:300;opacity:1;transition-timing-function:var(--transition-timing-function-ease-out);transition-duration:var(--transition-duration-medium)}.citizen-dropdown-details[open] > .citizen-dropdown-summary{position:relative;z-index:351}.citizen-dropdown-details[open] + .citizen-menu__card{z-index:350}}@media screen and (max-width:1119.98px){body:has(.citizen-dropdown-details[open]){overflow:hidden}}@media screen and (min-width:1120px){.citizen-toc-enabled .citizen-page-header-inner{max-width:var(--width-page)}}@media screen and (min-width:1120px){.citizen-page-sidebar{display:flex;flex-direction:column;grid-area:sidebar;gap:var(--space-sm);margin-top:var(--space-sm);contain:size paint style}}@media screen and (max-width:1119.98px){#citizen-sidebar-lastmod{display:none}}@media screen and (max-width:1120px){.citizen-feature-autohide-navigation-clientpref-0 .citizen-footer{margin-bottom:var(--header-size-block-end)}}@media screen and (max-width:640px){.citizen-footer__content,.citizen-footer__bottom{flex-direction:column}}@media screen and (min-width:640px){.citizen-footer__bottom{align-items:center}}@media screen and (max-width:1119.98px){#footer-places{margin-inline:calc(-1 * var(--space-md))}}@media screen and (min-width:1120px){#footer-places{margin-top:calc(-1 * var(--space-xs))}}@media screen and (min-width:1120px){.citizen-footer{margin-bottom:0}}@media screen and (min-width:640px){#citizen-notifications-dropdown__card{width:24rem}}@media screen and (prefers-reduced-motion:no-preference){.citizen-notifications__placeholder-line{animation:citizen-notifications-placeholder-shimmer 1600ms linear infinite}}@media screen and (prefers-reduced-motion:no-preference){.citizen-preferences-skeleton__heading,.citizen-preferences-skeleton__label,.citizen-preferences-skeleton__description{animation:citizen-preferences-skeleton-shimmer 1600ms linear infinite}}@media screen and (prefers-reduced-motion:no-preference){.citizen-share-dialog{opacity:0;transform:scale(0.96);transition-timing-function:var(--transition-timing-function-ease-out);transition-duration:var(--transition-duration-medium);transition-property:opacity,transform,display,overlay;transition-behavior:allow-discrete}.citizen-share-dialog--animated{transition-property:opacity,transform,height,display,overlay}.citizen-share-dialog[open]{opacity:1;transform:scale(1)}@starting-style{.citizen-share-dialog[open]{opacity:0;transform:scale(0.96)}}.citizen-share-dialog::backdrop{opacity:0;transition-timing-function:var(--transition-timing-function-ease-out);transition-duration:var(--transition-duration-medium);transition-property:opacity,display,overlay;transition-behavior:allow-discrete}.citizen-share-dialog[open]::backdrop{opacity:1}@starting-style{.citizen-share-dialog[open]::backdrop{opacity:0}}}@media screen and (prefers-reduced-motion:no-preference){.citizen-share-skeleton__bar{animation:citizen-share-skeleton-shimmer 1600ms linear infinite}}@media screen and (max-width:1119.98px){.citizen-toc{position:fixed;bottom:calc(var(--header-size-block-end) + max(env(safe-area-inset-bottom),var(--space-xs)));left:0;z-index:100;pointer-events:none}.citizen-toc-card{bottom:calc(100% - var(--space-xs));width:max-content;max-height:calc(var(--header-card-maxheight) - 8rem);padding:var(--space-xs);--citizen-clip-closed:var(--citizen-clip-expand-up);--citizen-translate-closed:var(--citizen-translate-expand-up)}.citizen-toc .citizen-dropdown-summary{box-sizing:border-box;display:grid;place-content:center;width:var(--toolbar-size);height:var(--toolbar-size);margin:var(--space-xs);pointer-events:auto;background-color:var(--color-surface-1);border:1px solid var(--border-color-base);border-radius:var(--border-radius-medium);box-shadow:var(--box-shadow-large)}.citizen-toc .citizen-dropdown-summary:hover{background:linear-gradient(var(--background-color-button-quiet--hover),var(--background-color-button-quiet--hover)) var(--color-surface-1)}.citizen-toc .citizen-dropdown-summary:active{background:linear-gradient(var(--background-color-button-quiet--active),var(--background-color-button-quiet--active)) var(--color-surface-1)}.citizen-toc .citizen-dropdown-details[open] + .citizen-menu__card{pointer-events:auto}.citizen-toc .citizen-dropdown-details[open] > .citizen-dropdown-summary{background:linear-gradient(var(--background-color-button-quiet--active),var(--background-color-button-quiet--active)) var(--color-surface-1)}}@media screen and (min-width:1120px){.citizen-toc{position:-webkit-sticky;position:sticky;top:var(--header-offset-block-start);max-height:calc(100vh - var(--header-offset-block-start));padding:var(--space-xs) 0;overflow-y:auto;overscroll-behavior:contain}.citizen-sticky-header-visible .citizen-toc{--header-offset-block-start:calc(var(--header-size-block-start) + var(--height-sticky-header))}.citizen-toc .citizen-menu__card{position:relative;min-width:auto;margin:0;contain:none;content-visibility:visible;background:transparent;border:0;border-radius:0;box-shadow:none;clip-path:none;transform:none}.citizen-toc .citizen-menu__card .citizen-menu__card-content{overflow:visible;opacity:1}.citizen-toc .citizen-dropdown-summary{display:none}}@media screen and (min-width:1120px) and (max-width:1119.98px){.citizen-feature-autohide-navigation-clientpref-1 .citizen-scroll--down .citizen-toc{--header-offset-block-start:0px}}@media screen and (min-width:1120px){.citizen-sticky-header-container{margin-right:var(--header-size-inline-end);margin-left:var(--header-size-inline-start)}}@media screen and (max-width:1119.98px){.citizen-sticky-header-end{display:none}}@media screen and (max-width:1119.98px){.citizen-feature-autohide-navigation-clientpref-1 .citizen-scroll--down .mw-sticky-header-element{--header-offset-block-start:0px}}@media screen and (max-width:480px){#citizen-siteStats__item--images{display:none}}@media screen and (hover:hover){.client-js .citizen-sections-enabled section:is([data-mw-section-id],.citizen-section) > :is(.mw-heading,.citizen-section-heading) :is(.mw-headline,h1,h2,h3,h4,h5,h6):hover{opacity:var(--opacity-icon-base--hover)}.client-js .citizen-sections-enabled section:is([data-mw-section-id],.citizen-section) > :is(.mw-heading,.citizen-section-heading) :is(.mw-headline,h1,h2,h3,h4,h5,h6):active{opacity:var(--opacity-icon-base--selected)}}@media screen and (hover:hover){.client-js .citizen-sections-enabled .citizen-section-toggle:hover{opacity:var(--opacity-icon-base--hover)}.client-js .citizen-sections-enabled .citizen-section-toggle:active{opacity:var(--opacity-icon-base--selected)}}@media screen and (min-width:640px){.citizen-overflow-wrapper--floatright{float:right;clear:right;margin-left:var(--space-lg)}.citizen-overflow-wrapper--floatright:has(.citizen-overflow-content > .wikitable){margin-left:var(--space-lg)}.citizen-overflow-wrapper--floatleft{float:left;clear:left;margin-right:var(--space-lg)}.citizen-overflow-wrapper--floatleft:has(.citizen-overflow-content > .wikitable){margin-right:var(--space-lg)}}@media screen and (max-width:1119.98px){.citizen-feature-autohide-navigation-clientpref-1 .citizen-scroll--down .citizen-overflow-wrapper--sticky-js .citizen-overflow-sticky-row{--header-offset-block-start:0px}}@media screen and print{.citizen-overflow-sticky-row{transform:none !important;animation:none !important}}@media screen and (min-width:640px){.mw-logo-wordmark{font-size:2rem;white-space:nowrap}img.mw-logo-wordmark{height:1.5rem;margin:0.25rem 0}}@media screen and (hover:hover) and (pointer:fine){.citizen-keyboard-hint{display:flex}}@media screen and (hover:hover){:is(.citizen-drawer,.citizen-search) > .citizen-dropdown-details[open] > .citizen-dropdown-summary:hover > svg{transform:scale(0.85)}}@media screen and (hover:hover){:is(a,button,summary):hover .citizen-ui-icon.mw-ui-icon-wikimedia-configure{transform:rotate(180deg)}:is(a,button,summary):hover .citizen-ui-icon.mw-ui-icon-wikimedia-edit{transform:translateX(2px)}:is(a,button,summary):hover .citizen-ui-icon.mw-ui-icon-wikimedia-ellipsis{transform:rotate(-90deg)}:is(a,button,summary):hover .citizen-ui-icon.mw-ui-icon-wikimedia-arrowUp,:is(a,button,summary):hover .citizen-ui-icon.mw-ui-icon-wikimedia-speechBubbles,:is(a,button,summary):hover .citizen-ui-icon.mw-ui-icon-wikimedia-userAdd{transform:translateY(-2px)}:is(a,button,summary):hover .citizen-ui-icon.mw-ui-icon-wikimedia-history{transform:rotate(-270deg)}:is(a,button,summary):hover .citizen-ui-icon.mw-ui-icon-wikimedia-logIn,:is(a,button,summary):hover .citizen-ui-icon.mw-ui-icon-wikimedia-share{transform:translateX(2px)}}@media print{@page{margin:1cm}:root{--border-color-base:#aaa !important;--border-width-base:1pt;--border-width-thick:2pt}.noprint,.mw-jump-link,.citizen-header,.citizen-sitenotice-container,.citizen-page-actions,.citizen-sticky-header-container,#citizen-page-header-sticky-sentinel,#citizen-page-header-sticky-placeholder,.citizen-page-footer,.citizen-page-sidebar,#footer-desc,#footer-places,.citizen-overflow-nav{display:none !important}a{color:#000;border-bottom:1pt solid var(--border-color-base)}table,img,svg{break-inside:avoid}.citizen-page-container{display:flex;flex-direction:column}.citizen-footer{order:-1;padding-block:var(--space-md);margin-bottom:var(--space-md);border-bottom:1pt solid var(--border-color-base)}.citizen-footer__container{display:flex;align-items:center;justify-content:space-between}#footer-tagline{font-size:9pt}#firstHeading{margin:0}.printfooter{margin-top:1em;font-size:9pt;border-top:1pt solid var(--border-color-base)}.wikitable{margin:1em 0;border-collapse:collapse;border:1pt solid var(--border-color-base)}.wikitable th,.wikitable td{padding:var(--space-xs) var(--space-sm);border:1pt solid var(--border-color-base)}}@layer citizen-tokens{:root{--color-base:oklch(var(--color-base-oklch__l) var(--color-base-oklch__c) var(--color-progressive-oklch__h));--color-base-fixed:#202122;--color-base--hover:oklch(calc(var(--color-base-oklch__l) + var(--delta-lightness-hover-state)) var(--color-base-oklch__c) var(--color-progressive-oklch__h));--color-emphasized:oklch(var(--color-emphasized-oklch__l) var(--color-emphasized-oklch__c) var(--color-progressive-oklch__h));--color-subtle:oklch(var(--color-subtle-oklch__l) var(--color-subtle-oklch__c) var(--color-progressive-oklch__h));--color-placeholder:oklch(var(--color-placeholder-oklch__l) var(--color-placeholder-oklch__c) var(--color-progressive-oklch__h));--color-disabled:oklch(var(--color-disabled-oklch__l) var(--color-disabled-oklch__c) var(--color-progressive-oklch__h));--color-base--subtle:var(--color-subtle);--color-inverted:#fff;--color-inverted-fixed:#fff;--color-progressive:oklch(var(--color-progressive-oklch__l) var(--color-progressive-oklch__c) var(--color-progressive-oklch__h));--color-progressive--hover:oklch(calc(var(--color-progressive-oklch__l) + var(--delta-lightness-hover-state)) var(--color-progressive-oklch__c) var(--color-progressive-oklch__h));--color-progressive--active:oklch(calc(var(--color-progressive-oklch__l) + var(--delta-lightness-active-state)) var(--color-progressive-oklch__c) var(--color-progressive-oklch__h));--color-progressive--focus:var(--color-progressive);--color-destructive:hsl(var(--color-destructive__h),100%,var(--color-destructive__l));--color-destructive--hover:hsl(var(--color-destructive__h),100%,calc(var(--color-destructive__l) + var(--delta-lightness-hover-state)));--color-destructive--active:hsl(var(--color-destructive__h),100%,calc(var(--color-destructive__l) + var(--delta-lightness-active-state)));--color-destructive--focus:var(--color-progressive);--color-visited:var(--color-link);--color-destructive--visited:var(--color-destructive);--color-error:var(--color-destructive);--color-warning:hsl(var(--color-warning__h),100%,var(--color-warning__l));--color-success:hsl(var(--color-success__h),100%,var(--color-success__l));--color-notice:var(--color-base);--color-content-added:var(--color-success);--color-content-removed:var(--color-destructive);--filter-invert-icon:0;--filter-invert-primary-button-icon:1;--box-shadow-color-base:var(--box-shadow-color-alpha-base);--box-shadow-color-progressive--active:var(--color-progressive--active);--box-shadow-color-progressive--focus:var(--color-progressive);--box-shadow-color-progressive-selected:var(--color-progressive);--box-shadow-color-progressive-selected--hover:var(--color-progressive--hover);--box-shadow-color-progressive-selected--active:var(--color-progressive--active);--box-shadow-color-destructive--focus:var(--color-progressive);--box-shadow-color-inverted:#fff;--box-shadow-color-transparent:transparent;--background-color-base:var(--color-surface-0);--background-color-base-fixed:oklch(96% 0.01 var(--color-progressive-oklch__h));--background-color-neutral:var(--color-surface-2);--background-color-neutral-subtle:var(--color-surface-1);--background-color-interactive:var(--color-surface-2);--background-color-interactive-subtle:var(--color-surface-1);--background-color-disabled:var(--color-surface-3);--background-color-disabled-subtle:var(--color-surface-1);--background-color-inverted:#101418;--background-color-progressive:var(--color-progressive);--background-color-progressive--hover:var(--color-progressive--hover);--background-color-progressive--active:var(--color-progressive--active);--background-color-progressive--focus:var(--color-progressive);--background-color-progressive-subtle:hsl(var(--color-progressive-hsl__h),var(--color-progressive-hsl__s),var(--background-color-subtle__l));--background-color-destructive:var(--color-destructive);--background-color-destructive--hover:var(--color-destructive--hover);--background-color-destructive--active:var(--color-destructive--active);--background-color-destructive--focus:var(--color-progressive);--background-color-destructive-subtle:hsl(var(--color-destructive__h),var(--background-color-subtle__s),var(--background-color-subtle__l));--background-color-error:var(--color-destructive);--background-color-error--hover:var(--color-destructive--hover);--background-color-error--active:var(--color-destructive--active);--background-color-error-subtle:var(--background-color-destructive-subtle);--background-color-warning-subtle:hsl(var(--color-warning__h),var(--background-color-subtle__s),var(--background-color-subtle__l));--background-color-success-subtle:hsl(var(--color-success__h),var(--background-color-subtle__s),var(--background-color-subtle__l));--background-color-notice-subtle:var(--color-surface-2);--background-color-content-added:var(--background-color-success-subtle);--background-color-content-removed:var(--background-color-destructive-subtle);--background-color-transparent:transparent;--background-color-backdrop-light:oklch(var(--color-surface-0-oklch__l) var(--color-surface-0-oklch__c) var(--color-progressive-oklch__h) / var(--backdrop-opacity));--background-color-backdrop-dark:rgba(0,0,0,var(--backdrop-opacity));--background-color-button-quiet--hover:rgba(0,24,73,0.027);--background-color-button-quiet--active:rgba(0,24,73,0.082);--background-color-input-binary--checked:var(--color-progressive);--background-color-tab-list-item-framed--hover:rgba(255,255,255,0.3);--background-color-tab-list-item-framed--active:rgba(255,255,255,0.65);--opacity-icon-base:0.6;--opacity-icon-base--hover:0.74;--opacity-icon-base--active:0.87;--opacity-icon-base--selected:1;--opacity-icon-base--disabled:0.51;--opacity-icon-placeholder:0.51;--opacity-icon-subtle:0.67;--border-color-base:rgb(0 0 0 / 0.1);--border-color-subtle:rgb(0 0 0 / 0.05);--border-color-muted:rgb(0 0 0 / 0.03);--border-color-interactive:rgb(0 0 0 / 0.1);--border-color-disabled:var(--border-color-subtle);--border-color-inverted:#fff;--border-color-progressive:var(--color-progressive);--border-color-progressive--hover:var(--color-progressive--hover);--border-color-progressive--active:var(--color-progressive--active);--border-color-progressive--focus:var(--color-progressive);--border-color-destructive:var(--color-destructive);--border-color-destructive--hover:var(--color-destructive--hover);--border-color-destructive--active:var(--color-destructive--active);--border-color-destructive--focus:var(--color-progressive);--border-color-error:var(--border-color-base);--border-color-error--hover:var(--border-color-base);--border-color-warning:var(--border-color-base);--border-color-success:var(--border-color-base);--border-color-notice:var(--border-color-base);--border-color-content-added:var(--border-color-base);--border-color-content-removed:var(--border-color-base);--border-color-transparent:transparent;--border-color-divider:var(--border-color-base);--outline-color-progressive--focus:var(--color-progressive);--color-link-red:var(--color-destructive);--color-link-red--hover:var(--color-destructive--hover);--color-link-red--active:var(--color-destructive--active);--color-link-red--focus:var(--color-destructive--focus);--color-link-red--visited:var(--color-destructive--visited);--border-color-input--hover:var(--border-color-interactive);--border-color-input-binary:var(--border-color-interactive);--border-color-input-binary--hover:var(--border-color-progressive--hover);--border-color-input-binary--active:var(--border-color-progressive--active);--border-color-input-binary--focus:var(--border-color-progressive--focus);--border-color-input-binary--checked:var(--border-color-progressive);--color-disabled-emphasized:var(--color-disabled);--color-visited--hover:var(--color-progressive--hover);--color-visited--active:var(--color-progressive--active);--color-destructive--visited--hover:var(--color-destructive--hover);--color-destructive--visited--active:var(--color-destructive--active);--color-error--hover:var(--color-destructive--hover);--color-error--active:var(--color-destructive--active);--color-icon-error:var(--color-destructive);--color-icon-warning:var(--color-warning);--color-icon-success:var(--color-success);--color-icon-notice:var(--color-placeholder);--mix-blend-mode-base:normal;--mix-blend-mode-blend:multiply;--background-color-interactive--hover:var(--color-surface-2--hover);--background-color-interactive--active:var(--color-surface-2--active);--background-color-progressive-subtle--hover:hsl(var(--color-progressive-hsl__h),var(--color-progressive-hsl__s),calc(var(--background-color-subtle__l) + (var(--delta-lightness-surface-base) * 3)));--background-color-progressive-subtle--active:hsl(var(--color-progressive-hsl__h),var(--color-progressive-hsl__s),calc(var(--background-color-subtle__l) + (var(--delta-lightness-surface-base) * 6)));--background-color-destructive-subtle--hover:hsl(var(--color-destructive__h),var(--background-color-subtle__s),calc(var(--background-color-subtle__l) + (var(--delta-lightness-surface-base) * 3)));--background-color-destructive-subtle--active:hsl(var(--color-destructive__h),var(--background-color-subtle__s),calc(var(--background-color-subtle__l) + (var(--delta-lightness-surface-base) * 6)));--background-color-error-subtle--hover:var(--background-color-destructive-subtle--hover);--background-color-error-subtle--active:var(--background-color-destructive-subtle--active);--border-color-interactive--hover:rgb(0 0 0 / 0.2);--border-color-interactive--active:rgb(0 0 0 / 0.3);--border-color-error--active:var(--border-color-base);--color-link-red--visited--hover:var(--color-destructive--visited--hover);--color-link-red--visited--active:var(--color-destructive--visited--active);--border-color-inverted-fixed:#fff;--border-color-emphasized:var(--color-base);--border-color-warning--hover:var(--border-color-base);--border-color-warning--active:var(--border-color-base);--color-link--focus:var(--color-progressive--focus);--color-link--visited:var(--color-visited);--color-link--visited--hover:var(--color-visited--hover);--color-link--visited--active:var(--color-visited--active);--color-neutral:var(--color-base);--color-icon-progressive:var(--color-progressive);--background-color-target-text:hsl(var(--color-warning__h),var(--background-color-subtle__s),calc(var(--background-color-subtle__l) + (var(--delta-lightness-surface-base) * 3)));--background-color-interactive-subtle--hover:var(--color-surface-1--hover);--background-color-interactive-subtle--active:var(--color-surface-1--active);--accent-color-base:var(--color-progressive);--box-shadow-color-alpha-base:oklch(var(--shadow-color-oklch__l) var(--shadow-color-oklch__c) var(--color-progressive-oklch__h) / var(--shadow-opacity));--font-size-x-small:0.75rem;--font-size-small:0.875rem;--font-size-medium:1rem;--font-size-large:1.125rem;--font-size-x-large:1.25rem;--font-size-xx-large:1.5rem;--font-size-xxx-large:1.75rem;--line-height-x-small:1.25rem;--line-height-small:1.375rem;--line-height-medium:1.625rem;--line-height-large:1.75rem;--line-height-x-large:1.875rem;--line-height-xx-large:2.125rem;--line-height-xxx-large:2.375rem;--line-height-content:1.625}@supports not (color:oklch(100% 0 0)){:root{--color-base:hsl(var(--color-progressive-hsl__h),var(--color-base-hsl__s),var(--color-base-hsl__l));--color-base--hover:hsl(var(--color-progressive-hsl__h),var(--color-base-hsl__s),calc(var(--color-base-hsl__l) + var(--delta-lightness-hover-state)));--color-emphasized:hsl(var(--color-progressive-hsl__h),var(--color-emphasized-hsl__s),var(--color-emphasized-hsl__l));--color-subtle:hsl(var(--color-progressive-hsl__h),var(--color-subtle-hsl__s),var(--color-subtle-hsl__l));--color-placeholder:hsl(var(--color-progressive-hsl__h),var(--color-placeholder-hsl__s),var(--color-placeholder-hsl__l));--color-disabled:hsl(var(--color-progressive-hsl__h),var(--color-disabled-hsl__s),var(--color-disabled-hsl__l));--color-progressive:hsl(var(--color-progressive-hsl__h),var(--color-progressive-hsl__s),var(--color-progressive-hsl__l));--color-progressive--hover:hsl(var(--color-progressive-hsl__h),var(--color-progressive-hsl__s),calc(var(--color-progressive-hsl__l) + var(--delta-lightness-hover-state)));--color-progressive--active:hsl(var(--color-progressive-hsl__h),var(--color-progressive-hsl__s),calc(var(--color-progressive-hsl__l) + var(--delta-lightness-active-state)));--background-color-backdrop-light:hsl(var(--color-progressive-hsl__h),var(--color-surface-0-hsl__s),var(--color-surface-0-hsl__l) / var(--backdrop-opacity));--box-shadow-color-alpha-base:hsl(var(--color-progressive-hsl__h) var(--shadow-color-hsl__s) var(--shadow-color-hsl__l) / var(--shadow-opacity))}}:root{--delta-lightness-state-base:4%;--delta-lightness-hover-state:calc(var(--delta-lightness-state-base) * 1);--delta-lightness-active-state:calc(var(--delta-lightness-state-base) * -1);--delta-lightness-surface-base:-2%;--color-progressive-oklch__l:53.25%;--color-progressive-oklch__c:0.1679;--color-progressive-oklch__h:262.29;--color-surface-0-oklch__l:96%;--color-surface-0-oklch__c:0.01;--color-surface-1-oklch__l:calc(var(--color-surface-0-oklch__l) + var(--delta-lightness-surface-base));--color-surface-1-oklch__c:0.015;--color-surface-2-oklch__l:calc(var(--color-surface-0-oklch__l) + (var(--delta-lightness-surface-base) * 2));--color-surface-2-oklch__c:0.02;--color-surface-3-oklch__l:calc(var(--color-surface-0-oklch__l) + (var(--delta-lightness-surface-base) * 3));--color-surface-3-oklch__c:0.03;--color-surface-4-oklch__l:calc(var(--color-surface-0-oklch__l) + (var(--delta-lightness-surface-base) * 4));--color-surface-4-oklch__c:0.04;--color-surface-0:oklch(var(--color-surface-0-oklch__l) var(--color-surface-0-oklch__c) var(--color-progressive-oklch__h));--color-surface-1:oklch(var(--color-surface-1-oklch__l) var(--color-surface-1-oklch__c) var(--color-progressive-oklch__h));--color-surface-1--hover:oklch(calc(var(--color-surface-1-oklch__l) + var(--delta-lightness-hover-state)) var(--color-surface-1-oklch__c) var(--color-progressive-oklch__h));--color-surface-1--active:oklch(calc(var(--color-surface-1-oklch__l) + var(--delta-lightness-active-state)) var(--color-surface-1-oklch__c) var(--color-progressive-oklch__h));--color-surface-2:oklch(var(--color-surface-2-oklch__l) var(--color-surface-2-oklch__c) var(--color-progressive-oklch__h));--color-surface-2--hover:oklch(calc(var(--color-surface-2-oklch__l) + var(--delta-lightness-hover-state)) var(--color-surface-2-oklch__c) var(--color-progressive-oklch__h));--color-surface-2--active:oklch(calc(var(--color-surface-2-oklch__l) + var(--delta-lightness-active-state)) var(--color-surface-2-oklch__c) var(--color-progressive-oklch__h));--color-surface-3:oklch(var(--color-surface-3-oklch__l) var(--color-surface-3-oklch__c) var(--color-progressive-oklch__h));--color-surface-4:oklch(var(--color-surface-4-oklch__l) var(--color-surface-4-oklch__c) var(--color-progressive-oklch__h));--color-emphasized-oklch__l:5%;--color-emphasized-oklch__c:0.07000000000000001;--color-base-oklch__l:20%;--color-base-oklch__c:0.09;--color-subtle-oklch__l:35%;--color-subtle-oklch__c:0.11;--color-placeholder-oklch__l:40%;--color-placeholder-oklch__c:0.07000000000000001;--color-disabled-oklch__l:60%;--color-disabled-oklch__c:0.05;--color-inverted-primary:#fff;--color-destructive__h:340;--color-destructive__l:40%;--color-success__h:170;--color-success__l:17%;--color-warning__h:48;--color-warning__l:40%;--background-color-subtle__s:95%;--background-color-subtle__l:95%;--background-color-icon:rgba(0,0,0,var(--opacity-icon-base));--background-color-icon--hover:rgba(0,0,0,var(--opacity-icon-base--hover));--background-color-icon--active:rgba(0,0,0,var(--opacity-icon-base--active));--color-link:var(--color-progressive);--color-link--hover:var(--color-progressive--hover);--color-link--active:var(--color-progressive--active);--color-syntax-red:#e53935;--color-syntax-orange:#f76d47;--color-syntax-yellow:#e2931d;--color-syntax-green:#91b859;--color-syntax-cyan:#39adb5;--color-syntax-blue:#6182b8;--color-syntax-paleblue:#8796b0;--color-syntax-purple:#9c3eda;--color-syntax-brown:#916b53;--color-syntax-pink:#ff5370;--color-syntax-violet:#945eb8;--color-syntax-gray:#90a4ae;--color-syntax-grey:var(--color-syntax-gray);--backdrop-filter-blur:blur(2px);--backdrop-filter-frosted-glass:blur(8px) saturate(140%);--backdrop-opacity:0.65;--filter-invert:none;--filter-invert-primary:invert(1) hue-rotate(180deg);--opacity-glass:0.9;--font-grade:25;--shadow-color-oklch__l:12%;--shadow-color-oklch__c:0.01;--shadow-color-hsl__s:10%;--shadow-color-hsl__l:20%;--shadow-opacity:0.03;color-scheme:light;--color-progressive-hsl__h:220;--color-progressive-hsl__s:60%;--color-progressive-hsl__l:50%;--color-surface-0-hsl__s:30%;--color-surface-0-hsl__l:96%;--color-surface-1-hsl__s:40%;--color-surface-1-hsl__l:calc(var(--color-surface-0-hsl__l) + var(--delta-lightness-surface-base));--color-surface-2-hsl__s:40%;--color-surface-2-hsl__l:calc(var(--color-surface-0-hsl__l) + (var(--delta-lightness-surface-base) * 2));--color-surface-3-hsl__s:43%;--color-surface-3-hsl__l:calc(var(--color-surface-0-hsl__l) + (var(--delta-lightness-surface-base) * 3));--color-surface-4-hsl__s:46%;--color-surface-4-hsl__l:calc(var(--color-surface-0-hsl__l) + (var(--delta-lightness-surface-base) * 4));--color-emphasized-hsl__s:85%;--color-emphasized-hsl__l:5%;--color-base-hsl__s:30%;--color-base-hsl__l:20%;--color-subtle-hsl__s:40%;--color-subtle-hsl__l:35%;--color-placeholder-hsl__s:85%;--color-placeholder-hsl__l:40%;--color-disabled-hsl__s:85%;--color-disabled-hsl__l:60%}@supports not (color:oklch(100% 0 0)){:root{--color-surface-0:hsl(var(--color-progressive-hsl__h),var(--color-surface-0-hsl__s),var(--color-surface-0-hsl__l));--color-surface-1:hsl(var(--color-progressive-hsl__h),var(--color-surface-1-hsl__s),var(--color-surface-1-hsl__l));--color-surface-1--hover:hsl(var(--color-progressive-hsl__h),var(--color-surface-1-hsl__s),calc(var(--color-surface-1-hsl__l) + var(--delta-lightness-hover-state)));--color-surface-1--active:hsl(var(--color-progressive-hsl__h),var(--color-surface-1-hsl__s),calc(var(--color-surface-1-hsl__l) + var(--delta-lightness-active-state)));--color-surface-2:hsl(var(--color-progressive-hsl__h),var(--color-surface-2-hsl__s),var(--color-surface-2-hsl__l));--color-surface-2--hover:hsl(var(--color-progressive-hsl__h),var(--color-surface-2-hsl__s),calc(var(--color-surface-2-hsl__l) + var(--delta-lightness-hover-state)));--color-surface-2--active:hsl(var(--color-progressive-hsl__h),var(--color-surface-2-hsl__s),calc(var(--color-surface-2-hsl__l) + var(--delta-lightness-active-state)));--color-surface-3:hsl(var(--color-progressive-hsl__h),var(--color-surface-3-hsl__s),var(--color-surface-3-hsl__l));--color-surface-4:hsl(var(--color-progressive-hsl__h),var(--color-surface-4-hsl__s),var(--color-surface-4-hsl__l))}}:root.skin-theme-clientpref-night{--delta-lightness-surface-base:2%;--color-progressive-oklch__l:60%;--color-progressive-hsl__l:60%;--color-surface-0-oklch__l:14%;--color-surface-0-hsl__l:4%;--color-emphasized-oklch__l:93%;--color-emphasized-oklch__c:0.03;--color-base-oklch__l:80%;--color-base-oklch__c:0.05;--color-subtle-oklch__l:70%;--color-subtle-oklch__c:0.07000000000000001;--color-placeholder-oklch__l:60%;--color-placeholder-oklch__c:0.03;--color-disabled-oklch__l:50%;--color-disabled-oklch__c:0.01;--color-emphasized-hsl__s:80%;--color-emphasized-hsl__l:95%;--color-base-hsl__s:45%;--color-base-hsl__l:85%;--color-subtle-hsl__s:35%;--color-subtle-hsl__l:70%;--color-placeholder-hsl__s:80%;--color-placeholder-hsl__l:60%;--color-disabled-hsl__s:80%;--color-disabled-hsl__l:50%;--color-destructive__l:50%;--color-success__l:35%;--color-warning__l:60%;--background-color-subtle__s:85%;--background-color-subtle__l:5%;--color-syntax-red:#f07178;--color-syntax-orange:#f78c6c;--color-syntax-yellow:#ffcb6b;--color-syntax-green:#c3e88d;--color-syntax-cyan:#89ddff;--color-syntax-blue:#82aaff;--color-syntax-paleblue:#b2ccd6;--color-syntax-purple:#c792ea;--color-syntax-brown:#916b53;--color-syntax-pink:#ff9cac;--color-syntax-violet:#bb80b3;--color-syntax-gray:#676E95;--background-color-button-quiet--hover:rgba(255,255,255,0.04);--background-color-button-quiet--active:rgba(255,255,255,0.08);--background-color-icon:rgba(255,255,255,var(--opacity-icon-base));--background-color-icon--hover:rgba(255,255,255,var(--opacity-icon-base--hover));--background-color-icon--active:rgba(255,255,255,var(--opacity-icon-base--active));--border-color-base:rgb(255 255 255 / 0.1);--border-color-subtle:rgb(255 255 255 / 0.05);--border-color-muted:rgb(255 255 255 / 0.03);--border-color-interactive:rgb(255 255 255 / 0.1);--border-color-interactive--hover:rgb(255 255 255 / 0.2);--border-color-interactive--active:rgb(255 255 255 / 0.3);--color-disabled-emphasized:var(--color-placeholder);--mix-blend-mode-blend:screen;--opacity-glass:0.8;--shadow-color-oklch__l:6%;--shadow-color-hsl__l:3%;--shadow-opacity:0.44;--filter-invert:invert(1) hue-rotate(180deg);--font-grade:0;color-scheme:dark}@media (prefers-color-scheme:dark){:root.skin-theme-clientpref-os{--delta-lightness-surface-base:2%;--color-progressive-oklch__l:60%;--color-progressive-hsl__l:60%;--color-surface-0-oklch__l:14%;--color-surface-0-hsl__l:4%;--color-emphasized-oklch__l:93%;--color-emphasized-oklch__c:0.03;--color-base-oklch__l:80%;--color-base-oklch__c:0.05;--color-subtle-oklch__l:70%;--color-subtle-oklch__c:0.07000000000000001;--color-placeholder-oklch__l:60%;--color-placeholder-oklch__c:0.03;--color-disabled-oklch__l:50%;--color-disabled-oklch__c:0.01;--color-emphasized-hsl__s:80%;--color-emphasized-hsl__l:95%;--color-base-hsl__s:45%;--color-base-hsl__l:85%;--color-subtle-hsl__s:35%;--color-subtle-hsl__l:70%;--color-placeholder-hsl__s:80%;--color-placeholder-hsl__l:60%;--color-disabled-hsl__s:80%;--color-disabled-hsl__l:50%;--color-destructive__l:50%;--color-success__l:35%;--color-warning__l:60%;--background-color-subtle__s:85%;--background-color-subtle__l:5%;--color-syntax-red:#f07178;--color-syntax-orange:#f78c6c;--color-syntax-yellow:#ffcb6b;--color-syntax-green:#c3e88d;--color-syntax-cyan:#89ddff;--color-syntax-blue:#82aaff;--color-syntax-paleblue:#b2ccd6;--color-syntax-purple:#c792ea;--color-syntax-brown:#916b53;--color-syntax-pink:#ff9cac;--color-syntax-violet:#bb80b3;--color-syntax-gray:#676E95;--background-color-button-quiet--hover:rgba(255,255,255,0.04);--background-color-button-quiet--active:rgba(255,255,255,0.08);--background-color-icon:rgba(255,255,255,var(--opacity-icon-base));--background-color-icon--hover:rgba(255,255,255,var(--opacity-icon-base--hover));--background-color-icon--active:rgba(255,255,255,var(--opacity-icon-base--active));--border-color-base:rgb(255 255 255 / 0.1);--border-color-subtle:rgb(255 255 255 / 0.05);--border-color-muted:rgb(255 255 255 / 0.03);--border-color-interactive:rgb(255 255 255 / 0.1);--border-color-interactive--hover:rgb(255 255 255 / 0.2);--border-color-interactive--active:rgb(255 255 255 / 0.3);--color-disabled-emphasized:var(--color-placeholder);--mix-blend-mode-blend:screen;--opacity-glass:0.8;--shadow-color-oklch__l:6%;--shadow-color-hsl__l:3%;--shadow-opacity:0.44;--filter-invert:invert(1) hue-rotate(180deg);--font-grade:0;color-scheme:dark}}:root.skin-theme-clientpref-black{--delta-lightness-surface-base:2%;--color-progressive-oklch__l:60%;--color-progressive-hsl__l:60%;--color-surface-0-oklch__l:14%;--color-surface-0-hsl__l:4%;--color-emphasized-oklch__l:93%;--color-emphasized-oklch__c:0.03;--color-base-oklch__l:80%;--color-base-oklch__c:0.05;--color-subtle-oklch__l:70%;--color-subtle-oklch__c:0.07000000000000001;--color-placeholder-oklch__l:60%;--color-placeholder-oklch__c:0.03;--color-disabled-oklch__l:50%;--color-disabled-oklch__c:0.01;--color-emphasized-hsl__s:80%;--color-emphasized-hsl__l:95%;--color-base-hsl__s:45%;--color-base-hsl__l:85%;--color-subtle-hsl__s:35%;--color-subtle-hsl__l:70%;--color-placeholder-hsl__s:80%;--color-placeholder-hsl__l:60%;--color-disabled-hsl__s:80%;--color-disabled-hsl__l:50%;--color-destructive__l:50%;--color-success__l:35%;--color-warning__l:60%;--background-color-subtle__s:85%;--background-color-subtle__l:5%;--color-syntax-red:#f07178;--color-syntax-orange:#f78c6c;--color-syntax-yellow:#ffcb6b;--color-syntax-green:#c3e88d;--color-syntax-cyan:#89ddff;--color-syntax-blue:#82aaff;--color-syntax-paleblue:#b2ccd6;--color-syntax-purple:#c792ea;--color-syntax-brown:#916b53;--color-syntax-pink:#ff9cac;--color-syntax-violet:#bb80b3;--color-syntax-gray:#676E95;--background-color-button-quiet--hover:rgba(255,255,255,0.04);--background-color-button-quiet--active:rgba(255,255,255,0.08);--background-color-icon:rgba(255,255,255,var(--opacity-icon-base));--background-color-icon--hover:rgba(255,255,255,var(--opacity-icon-base--hover));--background-color-icon--active:rgba(255,255,255,var(--opacity-icon-base--active));--border-color-base:rgb(255 255 255 / 0.1);--border-color-subtle:rgb(255 255 255 / 0.05);--border-color-muted:rgb(255 255 255 / 0.03);--border-color-interactive:rgb(255 255 255 / 0.1);--border-color-interactive--hover:rgb(255 255 255 / 0.2);--border-color-interactive--active:rgb(255 255 255 / 0.3);--color-disabled-emphasized:var(--color-placeholder);--mix-blend-mode-blend:screen;--opacity-glass:0.8;--shadow-color-oklch__l:6%;--shadow-color-hsl__l:3%;--shadow-opacity:0.44;--filter-invert:invert(1) hue-rotate(180deg);--font-grade:0;color-scheme:dark;--color-surface-0-oklch__l:0%;--color-surface-0-oklch__c:0;--color-surface-1-oklch__c:0;--color-surface-2-oklch__c:0;--color-surface-3-oklch__c:0;--color-surface-4-oklch__c:0;--color-surface-0-hsl__l:0%;--color-surface-0-hsl__s:0%;--color-surface-1-hsl__s:0%;--color-surface-2-hsl__s:0%;--color-surface-3-hsl__s:0%;--color-surface-4-hsl__s:0%;--color-emphasized-oklch__c:0;--color-base-oklch__c:0;--color-subtle-oklch__c:0;--color-placeholder-oklch__c:0;--color-emphasized-hsl__s:0%;--color-base-hsl__s:0%;--color-subtle-hsl__s:0%;--color-placeholder-hsl__s:0%;--border-color-base:rgba(255,255,255,0.1);--border-color-subtle:rgba(255,255,255,0.05);--border-color-interactive:rgba(255,255,255,0.15);--border-color-interactive--hover:rgba(255,255,255,0.25);--border-color-interactive--active:rgba(255,255,255,0.35);--color-neutral-50:oklch(98% 0 var(--color-primary-oklch__h));--color-neutral-100:oklch(94% 0 var(--color-primary-oklch__h));--color-neutral-200:oklch(90% 0 var(--color-primary-oklch__h));--color-neutral-300:oklch(84% 0 var(--color-primary-oklch__h));--color-neutral-400:oklch(73% 0 var(--color-primary-oklch__h));--color-neutral-500:oklch(51% 0 var(--color-primary-oklch__h));--color-neutral-600:oklch(39% 0 var(--color-primary-oklch__h));--color-neutral-700:oklch(30% 0 var(--color-primary-oklch__h));--color-neutral-800:oklch(22% 0 var(--color-primary-oklch__h));--color-neutral-900:oklch(17% 0 var(--color-primary-oklch__h));--color-neutral-1000:oklch(0% 0 var(--color-primary-oklch__h))}}

.vector-header-container,
.vector-sticky-header,
.vector-sticky-header-container,
.vector-main-menu-landmark,
.vector-appearance-landmark,
.vector-page-tools-landmark,
.vector-toc-landmark,
.vector-user-links,
#mw-panel,
.vector-page-titlebar,
.vector-page-title,
.vector-body-before-content,
.vector-page-toolbar,
.vector-page-toolbar-container,
.vector-page-tools-dropdown,
.vector-main-menu-dropdown,
.vector-user-menu,
.vector-menu-tabs,
.vector-sitenotice-container,
.vector-pinnable-element,
.vector-pinnable-header,
.vector-column-start,
.vector-column-end,
.vector-page-titlebar-toc,
.vector-collapsible,
.vector-button-flush-left,
.vector-button-flush-right,
body > #p-views,
body > #p-associated-pages,
body > #p-cactions,
body > #p-tb { display: none !important; }

@media screen {
	body.skin-citizen:not(:has(.citizen-page-container)) {
		display: flex;
		flex-direction: column;
		min-height: inherit;
	}
}
@media screen and (max-width: 1119.98px) {
	body.skin-citizen:not(:has(.citizen-page-container)) {
		padding-block-start: var(--header-size-block-start);
	}
}
@media screen and (min-width: 1120px) {
	body.skin-citizen:not(:has(.citizen-page-container)) {
		padding-block: var(--header-size-block-start) var(--header-size-block-end);
		padding-inline: var(--header-size-inline-start) var(--header-size-inline-end);
	}
}
body.skin-citizen .mw-page-container,
body.skin-citizen .mw-page-container-inner,
body.skin-citizen .mw-footer-container {
	display: contents !important;
}
body.cv-pre-wrap.skin-citizen > *:not(.citizen-header) {
	opacity: 0 !important;
}
body.cv-pre-wrap,
body.skin-citizen {
	background-color: var(--color-surface-0, #fff) !important;
}
html:has(body.cv-pre-wrap) {
	background-color: var(--color-surface-0, #fff) !important;
}
body.cv-fadein > .citizen-page-container > *:not(.citizen-header) {
	animation: cv-content-in 0.26s ease both !important;
}
@keyframes cv-content-in {
	from { opacity: 0; }
	to { opacity: 1; }
}
body.skin-citizen #mw-content-text img {
	background-color: var(--color-surface-1, #eaecf0);
	transition: background-color 0.4s ease, transform var(--transition-hover, 100ms cubic-bezier(0.2, 0, 0, 1));
}
body.skin-citizen #mw-content-text img.cv-img-in {
	background-color: transparent;
	animation: cv-img-in 0.4s ease both;
}
@keyframes cv-img-in {
	from { opacity: 0.35; }
	to { opacity: 1; }
}


html body .citizen-header {
	position: fixed !important;
}

html body main.mw-body {
	display: block !important;
	grid-template-columns: none !important;
	grid-template-areas: none !important;
}

html body .citizen-body-container {
	grid-template-columns: minmax(0, var(--width-layout, 1080px));
	grid-template-areas: "content" "footer";
	justify-content: center;
}
@media (min-width: 1120px) {
	html body .citizen-body-container:has(> .citizen-page-sidebar > *),
	html body.cv-sidebar-reserved .citizen-body-container {
		grid-template-columns: minmax(0, var(--width-layout, 1080px)) var(--width-toc, 240px);
		grid-template-areas: "content sidebar" "footer footer";
	}
	html body .citizen-body-container:has(> .citizen-page-sidebar > *) .citizen-page-sidebar { grid-area: sidebar; }
}
html body #bodyContent.citizen-body {
	grid-area: content;
	min-width: 0;
	position: relative;
}
html body .citizen-page-footer { grid-area: footer; }

@media (min-width: 1120px) {
html body .citizen-page-sidebar #citizen-toc {
	position: sticky;
	top: 53px;
	max-height: calc(100vh - 53px); 
	overflow-y: auto;
	overscroll-behavior: contain;
	scrollbar-width: none; 
	-ms-overflow-style: none; 
}
html body .citizen-page-sidebar #citizen-toc::-webkit-scrollbar {
	display: none; 
}
}

html body .citizen-menu__card-content {
	scrollbar-width: none; 
	-ms-overflow-style: none; 
}
html body .citizen-menu__card-content::-webkit-scrollbar {
	display: none; 
}

html.ve-activated #citizen-page-header-sticky-sentinel,
html.ve-active #citizen-page-header-sticky-sentinel,
html.ve-active-visual #citizen-page-header-sticky-sentinel,
body.action-edit #citizen-page-header-sticky-sentinel,
html.ve-activated #citizen-sticky-header,
html.ve-active #citizen-sticky-header,
html.ve-active-visual #citizen-sticky-header,
body.action-edit #citizen-sticky-header,
html.ve-activated .citizen-sticky-header-background,
html.ve-active .citizen-sticky-header-background,
html.ve-active-visual .citizen-sticky-header-background,
body.action-edit .citizen-sticky-header-background,
html.ve-activated .citizen-sticky-header-container,
html.ve-active .citizen-sticky-header-container,
html.ve-active-visual .citizen-sticky-header-container,
body.action-edit .citizen-sticky-header-container,
html.ve-activated body.citizen-sticky-header-visible .citizen-sticky-header-container,
html.ve-active body.citizen-sticky-header-visible .citizen-sticky-header-container,
html.ve-active-visual body.citizen-sticky-header-visible .citizen-sticky-header-container,
body.action-edit.citizen-sticky-header-visible .citizen-sticky-header-container {
	display: none !important;
}

html body .tdg-editscreen-main-helplink,
html body .tdg-editscreen-main > .oo-ui-buttonElement {
	display: none !important;
}
html body .tdg-editscreen-main:not(:has(.tdg-editscreen-edit-notice:not(.oo-ui-element-hidden))) {
	display: none !important;
}

html.ve-activated .citizen-dropdown-details,
html.ve-active .citizen-dropdown-details,
html.ve-active-visual .citizen-dropdown-details,
body.action-edit .citizen-dropdown-details,
html.ve-activated .citizen-menu__card,
html.ve-active .citizen-menu__card,
html.ve-active-visual .citizen-menu__card,
body.action-edit .citizen-menu__card,
html.ve-activated .citizen-menu__card-content,
html.ve-active .citizen-menu__card-content,
html.ve-active-visual .citizen-menu__card-content,
body.action-edit .citizen-menu__card-content {
	z-index: 11000 !important;
}
html.ve-activated .citizen-page-header:has(details[open]),
html.ve-active .citizen-page-header:has(details[open]),
html.ve-active-visual .citizen-page-header:has(details[open]),
body.action-edit .citizen-page-header:has(details[open]),
html.ve-activated .citizen-header:has(details[open]),
html.ve-active .citizen-header:has(details[open]),
html.ve-active-visual .citizen-header:has(details[open]),
body.action-edit .citizen-header:has(details[open]),
html.ve-activated .citizen-body-container:has(.citizen-menu__card details[open]),
html.ve-active .citizen-body-container:has(.citizen-menu__card details[open]),
html.ve-active-visual .citizen-body-container:has(.citizen-menu__card details[open]),
body.action-edit .citizen-body-container:has(.citizen-menu__card details[open]) {
	z-index: 11000 !important;
}

.ve-init-mw-desktopArticleTarget-originalContent #citizen-page-header,
.ve-init-mw-desktopArticleTarget-originalContent #citizen-page-header * {
	pointer-events: auto !important;
}

html.ve-activated .citizen-page-container:has(#citizen-page-header details[open]) > .citizen-header,
html.ve-active .citizen-page-container:has(#citizen-page-header details[open]) > .citizen-header,
html.ve-active-visual .citizen-page-container:has(#citizen-page-header details[open]) > .citizen-header,
body.action-edit .citizen-page-container:has(#citizen-page-header details[open]) > .citizen-header {
	z-index: 11001 !important;
}

@media (max-width: 1119.98px) {
	html.ve-activated body #bodyContent.citizen-body,
	html.ve-active body #bodyContent.citizen-body,
	html.ve-active-visual body #bodyContent.citizen-body,
	body.action-edit #bodyContent.citizen-body {
		z-index: 0 !important;
	}
}

html body .citizen-header__logo .mw-logo {
	position: relative !important;
	display: inline-flex !important;
	align-items: center !important;
	justify-content: center !important;
	width: 40px;
	height: 40px;
	padding: 0;
	margin: 0;
	border-radius: 4px !important;
	gap: 0 !important;
	color: var(--color-base, #202122) !important;
}
html body .citizen-header__logo .mw-logo .citizen-header-logo-svg {
	position: absolute !important;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	transform-origin: center center;
	width: var(--size-icon, 1.25rem);
	height: var(--size-icon, 1.25rem);
	min-width: 0;
	min-height: 0;
	margin: 0;
	padding: 0;
	color: currentColor;
	transition-timing-function: var(--transition-timing-function-ease, ease);
	transition-duration: var(--transition-duration-medium, 0.3s);
	transition-property: transform, opacity;
}
html body .citizen-header__logo .mw-logo .citizen-header-logo-svg.cv-wiki-w {
	width: 25px;
	height: 25px;
}
html body .citizen-header__logo .mw-logo .citizen-header-logo-svg.citizen-header-logo-char {
	z-index: 1;
	fill: currentColor;
	opacity: 1;
	pointer-events: none;
}
html body .citizen-header__logo .mw-logo > .citizen-header-logo-svg.cv-home-icon {
	z-index: 2;
	opacity: 0;
	pointer-events: none;
}
html body .citizen-header__logo .mw-logo .citizen-header-logo-svg.cv-home-icon::before {
	display: block;
	width: 100%;
	height: 100%;
	content: '';
	background-color: currentColor;
	-webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2220%22 height%3D%2220%22 viewBox%3D%220 0 20 20%22%3E%3Cg fill%3D%22%23000%22%3E%3Cpath d%3D%22M10 1 0 10h3v9h4v-4.6c0-1.47 1.31-2.66 3-2.66s3 1.19 3 2.66V19h4v-9h3z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
	mask-image: url("data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2220%22 height%3D%2220%22 viewBox%3D%220 0 20 20%22%3E%3Cg fill%3D%22%23000%22%3E%3Cpath d%3D%22M10 1 0 10h3v9h4v-4.6c0-1.47 1.31-2.66 3-2.66s3 1.19 3 2.66V19h4v-9h3z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
	-webkit-mask-repeat: no-repeat;
	mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-position: center;
	-webkit-mask-size: contain;
	mask-size: contain;
}
html body .citizen-header__logo .mw-logo .citizen-ui-icon::before { display: none !important; }
html body .citizen-header__logo .mw-logo:hover .citizen-header-logo-svg.citizen-header-logo-char {
	opacity: 0;
	transform: translate(-50%, -50%) rotate(360deg);
}
html body .citizen-header__logo .mw-logo:hover > .citizen-header-logo-svg.cv-home-icon {
	opacity: 1;
	transform: translate(-50%, -50%) rotate(360deg);
}
html body .citizen-header { align-items: normal !important; }
html body .citizen-header .cdx-button,
html body .citizen-header .citizen-dropdown-summary { gap: 6px; }

html body a.mw-logo.citizen-drawer__logo {
	display: block !important;
	width: 80px !important;
	height: 80px !important;
	max-width: 80px !important;
	min-width: 0 !important; 
	padding: 0;
	margin: 0;
}
html body a.mw-logo.citizen-drawer__logo img {
	width: 80px;
	height: 80px;
}

html .citizen-icon-search__close { opacity: 0; }
html .citizen-dropdown-details[open] .citizen-icon-search__close { opacity: 1; }
html .citizen-dropdown-details[open] .citizen-icon-search__handle { opacity: 0; }

html body .citizen-preferences-dropdown,
html body .citizen-userMenu,
html body .citizen-search,
html body .citizen-drawer { display: flex; }
html body .citizen-footer__sitetitle img { width: 48px !important; height: 48px !important; max-width: 48px !important; max-height: 48px !important; }
html body .citizen-footer__siteinfo { flex-grow: 1 !important; min-width: 0 !important; }
html body .citizen-footer #footer-places ul,
html body .citizen-footer #footer-places li,
html body .citizen-footer #footer-places a { font-size: 14px !important; }
#footer-icons li#footer-poweredbyico { gap: 7px; }
#footer-icons a.cv-badge {
	box-sizing: border-box;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 44px;
	min-height: 0;
	padding: 0;
	background-color: var(--background-color-interactive-subtle);
	border: 1px solid var(--border-color-base);
	border-radius: var(--border-radius-base);
	color: var(--color-base);
}
#footer-icons a.cv-badge:hover { background-color: var(--background-color-interactive-subtle--hover); }
#footer-icons a.cv-badge:active { background-color: var(--background-color-interactive-subtle--active); }
#footer-icons a.cv-badge svg { display: block; height: 44px; flex: none; }
#footer-icons a.cv-badge--wiki,
#footer-icons a.cv-badge--apache { width: 44px; }
#footer-icons a.cv-badge--cc,
#footer-icons a.cv-badge--mw { width: 98px; }
#footer-icons a.cv-badge--cc0 { width: auto; }

@media (max-width: 1119.98px) {
	#citizen-toc,
	.citizen-page-actions {
		transition: opacity 200ms ease;
	}
	body.cv-footer-float-hidden #citizen-toc,
	body.cv-footer-float-hidden .citizen-page-actions {
		opacity: 0;
		pointer-events: none;
	}
}

@media (max-width: 1119.98px) {
	html body input,
	html body textarea,
	html body select,
	html body .oo-ui-inputWidget-input,
	html body .mw-parser-output figure[typeof~='mw:File/Thumb'] > figcaption,
	html body .mw-parser-output figure[typeof~='mw:File/Frame'] > figcaption,
	html body .mw-parser-output .thumbcaption,
	html body figure.ve-ce-branchNode > figcaption.ve-ce-branchNode {
		font-size: 1rem !important;
	}
}

.wikitable {
	border: 0 !important;
}
.wikitable > * > tr > th,
.wikitable > * > tr > td {
	padding: var(--space-xs) var(--space-sm) !important;
	border: 0 !important;
}
.wikitable > tr > th,
.wikitable > * > tr > th {
	text-align: start !important;
}
.wikitable > * > tr > td {
	text-align: start !important;
}
.mw-parser-output .wikitable {
	background-color: transparent;
}
.mw-parser-output .wikitable > * > tr > th,
.mw-parser-output .wikitable > * > tr > td {
	background-color: transparent;
}
.mw-parser-output .wikitable > * > tr > th {
	color: var(--color-emphasized);
}

.wikitable > caption ~ :where(tbody, thead, tfoot) > tr:first-of-type > :is(th, td),
.wikitable > caption ~ tr:first-of-type > :is(th, td) {
	border-top-left-radius: 0 !important;
	border-top-right-radius: 0 !important;
}

html body .mw-parser-output .infobox:not(.wikitable) {
	box-sizing: border-box;
	float: right;
	clear: right;
	width: 298px !important;
	max-width: 100%;
	margin: 0.5em 0 1em 1.5em;
	padding: 0;
	border: 1px solid var(--border-color-base, #a2a9b1);
	border-radius: var(--border-radius-medium, 2px);
	border-collapse: separate !important;
	border-spacing: 0;
	table-layout: fixed;
	overflow: hidden;
	background: var(--background-color-base, #fff);
	color: var(--color-base, #202122);
	font-size: var(--text-sm, 0.875rem);
	line-height: 1.5;
	word-break: break-all;
}
html body .mw-parser-output .infobox:not(.wikitable) :is(div, span, p, b, i, u, small, big, ul, ol, li, dl, dt, dd, table, tbody, tr, th, td, caption, sup, sub, button):not(:where(.mw-tmh-player, .mw-tmh-player *, .legend-color, .legend, .mw-no-invert, .notheme)) {
	background-color: transparent !important;
	background-image: none !important;
	color: inherit !important;
}
html body .mw-parser-output .infobox:not(.wikitable) :is(a, .mw-collapsible-toggle, .mw-collapsible-text) {
	color: var(--color-link, #36c) !important;
}
html body .mw-parser-output .infobox > caption.infobox-title,
html body .mw-parser-output .infobox .infobox-above {
	padding: 0.75em !important;
	font-size: var(--text-base, 1rem);
	font-weight: 600;
	line-height: 1.5;
	text-align: center;
	background: transparent !important;
	color: var(--color-base, #202122) !important;
}
html body .mw-parser-output .infobox:not(.wikitable):has(> caption.infobox-title) {
	border-top: 0 !important;
	border-top-left-radius: 0 !important;
	border-top-right-radius: 0 !important;
	overflow: clip !important;
	overflow-clip-margin: 1px !important;
}
html body .mw-parser-output .infobox:not(.wikitable) > caption.infobox-title {
	border: 1px solid var(--border-color-base, #a2a9b1) !important;
	border-bottom: 0 !important;
	border-radius: var(--border-radius-medium, 2px) var(--border-radius-medium, 2px) 0 0 !important;
	background: var(--background-color-base, #fff) !important;
	box-sizing: border-box;
	transition: background 100ms ease;
}
html body .mw-parser-output .infobox:not(.wikitable) > tbody > tr + tr > th,
html body .mw-parser-output .infobox:not(.wikitable) > tbody > tr + tr > td {
	padding: 0.25em 0.5em !important;
	border: 0 !important;
	border-top: 2px solid var(--background-color-base, #fff) !important;
	vertical-align: top;
	transition: background 100ms ease;
}
html body .mw-parser-output .infobox:not(.wikitable) > tbody > tr:where(:first-child) > th,
html body .mw-parser-output .infobox:not(.wikitable) > tbody > tr:where(:first-child) > td {
	padding: 0.25em 0.5em !important;
	border: 0 !important;
	vertical-align: top;
	transition: background 100ms ease;
}
html body .mw-parser-output .infobox .infobox-header {
	text-align: center;
	font-weight: 600;
	background: var(--background-color-interactive, #eaecf0) !important;
	color: var(--color-base, #202122) !important;
}
html body .mw-parser-output .infobox .infobox-label {
	width: 100px;
	min-width: 4em;
	text-align: center;
	font-weight: 600;
	white-space: normal !important;
	word-break: keep-all;
	background: var(--background-color-interactive-subtle, #f8f9fa) !important;
	color: var(--color-base, #202122) !important;
}
html body .mw-parser-output .infobox .infobox-data,
html body .mw-parser-output .infobox .infobox-full-data {
	word-break: break-word;
}
html body .mw-parser-output .infobox .infobox-image {
	padding: 0 !important;
	text-align: center;
}
html body .mw-parser-output .infobox .infobox-image img {
	display: block;
	max-width: 100%;
	height: auto;
	margin: 0 auto;
}
html body .mw-parser-output .infobox .infobox-caption {
	padding: 0.25em 0.5em 0.5em !important;
	font-size: var(--text-xs, 0.75rem);
	line-height: 1.5;
	color: var(--color-subtle, #54595d) !important;
	text-align: center;
}
html body .mw-parser-output .infobox:not(.wikitable) :is(.collapsible-list, .mw-collapsible) > :is(.mw-collapsible-content, ul, ol) {
	margin-left: 0 !important;
	padding-left: 0 !important;
	list-style-position: inside !important;
}
html body .mw-parser-output .infobox .infobox-full-data div:has(> .collapsible-list) {
	border-top: 0 !important;
	font-size: 100% !important;
}
html body .mw-parser-output .infobox .infobox-full-data .collapsible-list > div:not(.mw-collapsible-content) {
	padding: 0.25em 0.5em !important;
	font-size: var(--text-sm, 0.875rem);
	line-height: 1.5;
	font-weight: 600 !important;
	text-align: center !important;
	background: var(--background-color-interactive, #eaecf0) !important;
	color: var(--color-base, #202122) !important;
	cursor: pointer;
}
html body .mw-parser-output .infobox .infobox-full-data > .collapsible-list > div:not(.mw-collapsible-content),
html body .mw-parser-output .infobox .infobox-full-data > div > .collapsible-list > div:not(.mw-collapsible-content) {
	margin-left: -0.5em !important;
	margin-right: -0.5em !important;
}
html body .mw-parser-output .infobox .infobox-full-data .collapsible-list > div:not(.mw-collapsible-content):hover {
	background: var(--background-color-button-quiet--hover, rgba(0, 24, 73, 0.027)) !important;
}
html body .mw-parser-output .infobox .infobox-full-data .collapsible-list > .mw-collapsible-toggle {
	float: right;
	width: 12px;
	height: 12px;
	margin: 8px 7px 0 0;
	padding: 0 !important;
	border: 0 !important;
	overflow: hidden;
	opacity: 0.5;
	cursor: pointer;
	font-size: 0 !important;
	background-color: transparent !important;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' aria-hidden='true'%3E%3Cg%3E%3Cpath d='m2.5 15.25 7.5-7.5 7.5 7.5 1.5-1.5-9-9-9 9z'/%3E%3C/g%3E%3C/svg%3E") !important;
	background-size: contain !important;
	background-repeat: no-repeat;
	background-position: center;
}
html body .mw-parser-output .infobox .infobox-full-data .collapsible-list > .mw-collapsible-toggle::before,
html body .mw-parser-output .infobox .infobox-full-data .collapsible-list > .mw-collapsible-toggle::after {
	content: none !important;
}
html body .mw-parser-output .infobox .infobox-full-data .collapsible-list > .mw-collapsible-toggle.mw-collapsible-toggle-collapsed {
	transform: rotate(180deg);
}
html body .mw-parser-output .infobox:not(.wikitable) hr {
	display: none !important;
}
html body .mw-parser-output .infobox:not(.wikitable) > tbody > tr:hover > :is(th, td) {
	background: var(--background-color-button-quiet--hover, rgba(0, 24, 73, 0.027)) !important;
}
html body .mw-parser-output .infobox:not(.wikitable) > caption.infobox-title:hover {
	background: var(--background-color-button-quiet--hover, rgba(0, 24, 73, 0.027)) !important;
}

html body .mw-parser-output table.sidebar {
	box-sizing: border-box;
	width: 298px !important;
	max-width: 100%;
	padding: 0 !important;
	border: 1px solid var(--border-color-base, #a2a9b1) !important;
	border-radius: var(--border-radius-medium, 2px);
	border-collapse: separate !important;
	border-spacing: 0;
	overflow: hidden;
	background: var(--background-color-base, #fff) !important;
	color: var(--color-base, #202122);
	font-size: var(--text-sm, 0.875rem);
	line-height: 1.5;
	word-break: break-all;
}
html body .mw-parser-output table.sidebar :is(div, span, p, b, i, u, small, big, ul, ol, li, dl, dt, dd, table, tbody, tr, th, td, caption, sup, sub, button):not(:where(.mw-tmh-player, .mw-tmh-player *, .legend-color, .legend, .mw-no-invert, .notheme)) {
	background-color: transparent !important;
	background-image: none !important;
	color: inherit !important;
}
html body .mw-parser-output table.sidebar :is(a, .mw-collapsible-toggle, .mw-collapsible-text) {
	color: var(--color-link, #36c) !important;
}
html body .mw-parser-output table.sidebar .sidebar-list-title {
	margin-left: -0.5em !important;
	margin-right: -0.5em !important;
	padding: 0.25em calc(0.5em + 19px) !important;
	border: 0 !important;
	text-align: center !important;
	font-size: var(--text-sm, 0.875rem) !important;
	font-weight: 600 !important;
	background: var(--background-color-interactive, #eaecf0) !important;
	color: var(--color-base, #202122) !important;
	cursor: pointer;
}
html body .mw-parser-output table.sidebar .sidebar-list-title:hover {
	background: var(--background-color-button-quiet--hover, rgba(0, 24, 73, 0.027)) !important;
}
html body .mw-parser-output table.sidebar .sidebar-heading {
	padding: 0.25em 0 !important;
}
html body .mw-parser-output table.sidebar .sidebar-list {
	position: relative;
}
html body .mw-parser-output table.sidebar .sidebar-list > .mw-collapsible-toggle {
	position: absolute !important;
	top: 8.7px;
	right: 7px;
	float: none !important;
	width: 12px;
	height: 12px;
	margin: 0 !important;
	padding: 0 !important;
	border: 0 !important;
	overflow: hidden;
	opacity: 0.5;
	cursor: pointer;
	font-size: 0 !important;
	background-color: transparent !important;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' aria-hidden='true'%3E%3Cg%3E%3Cpath d='m2.5 15.25 7.5-7.5 7.5 7.5 1.5-1.5-9-9-9 9z'/%3E%3C/g%3E%3C/svg%3E") !important;
	background-size: contain !important;
	background-repeat: no-repeat;
	background-position: center;
}
html body .mw-parser-output table.sidebar .sidebar-list > .mw-collapsible-toggle::before,
html body .mw-parser-output table.sidebar .sidebar-list > .mw-collapsible-toggle::after {
	content: none !important;
}
html body .mw-parser-output table.sidebar .sidebar-list > .mw-collapsible-toggle.mw-collapsible-toggle-collapsed {
	transform: rotate(180deg);
}
html body .mw-parser-output table.sidebar .sidebar-list-content :is(ul, ol) {
	margin-left: 0 !important;
	padding-left: 0 !important;
	list-style-position: inside !important;
}
html body .mw-parser-output table.sidebar hr {
	display: none !important;
}
html body .mw-parser-output table.sidebar td {
	border: 0 !important;
}
html body .mw-parser-output table.sidebar :is(.portal-bar, .portal-bar-content) {
	border: 0 !important;
}
html body .mw-parser-output table.sidebar td.sidebar-content {
	padding-bottom: 0 !important;
}

html body .mw-parser-output table.sidebar :is(.sidebar-above, .sidebar-below) {
	border: 0 !important;
}
html body .mw-parser-output table.sidebar .sidebar-navbar .hlist li::after {
	content: none !important;
}
html body .mw-parser-output table.sidebar .sidebar-navbar .hlist li + li {
	margin-left: 0.6em;
}

html body .mw-parser-output .navbox {
	box-sizing: border-box;
	max-width: 100%;
	padding: 0 !important;
	border: 1px solid var(--border-color-base, #a2a9b1) !important;
	border-radius: var(--border-radius-medium, 2px);
	overflow: hidden;
	background: var(--background-color-base, #fff) !important;
	color: var(--color-base, #202122);
	font-size: var(--text-sm, 0.875rem);
	line-height: 1.5;
}
html body .mw-parser-output .navbox + .navbox-styles + .navbox,
html body .mw-parser-output .navbox + .navbox {
	border-top-left-radius: 0 !important;
	border-top-right-radius: 0 !important;
}
html body .mw-parser-output .navbox:has(+ .navbox-styles + .navbox),
html body .mw-parser-output .navbox:has(+ .navbox) {
	border-bottom-left-radius: 0 !important;
	border-bottom-right-radius: 0 !important;
}
html body .mw-parser-output .navbox :is(div, span, p, b, i, u, small, big, ul, ol, li, dl, dt, dd, table, tbody, tr, th, td, caption, sup, sub, button, abbr):not(:where(.mw-tmh-player, .mw-tmh-player *, .legend-color, .legend, .mw-no-invert, .notheme)) {
	background-color: transparent !important;
	background-image: none !important;
	color: inherit !important;
}
html body .mw-parser-output .navbox :is(a, .mw-collapsible-toggle, .mw-collapsible-text) {
	color: var(--color-link, #36c) !important;
}
html body .mw-parser-output .navbox .navbox-title {
	padding: 0.25em 0.5em !important;
	border: 0 !important;
	text-align: center !important;
	font-size: var(--text-sm, 0.875rem) !important;
	font-weight: 600 !important;
	background: var(--background-color-interactive, #eaecf0) !important;
	color: var(--color-base, #202122) !important;
}
html body .mw-parser-output .navbox .navbox-title:hover {
	background: var(--background-color-button-quiet--hover, rgba(0, 24, 73, 0.027)) !important;
}
html body .mw-parser-output .navbox .navbox-group,
html body .mw-parser-output .navbox .navbox-abovebelow {
	padding: 0.25em 0.75em !important;
	border: 0 !important;
	background: var(--background-color-interactive-subtle, #f8f9fa) !important;
	color: var(--color-base, #202122) !important;
}
html body .mw-parser-output .navbox .navbox-group {
	font-weight: 600;
}
html body .mw-parser-output .navbox .navbar li::after {
	content: none !important;
}
html body .mw-parser-output .navbox .navbar li + li {
	margin-left: 0.6em;
}
html body .mw-parser-output .navbox .mw-collapsible-toggle {
	position: absolute !important;
	top: calc(50% - 7px) !important;
	right: 14px !important;
	margin: 0 !important;
	width: 12px;
	height: 12px;
	padding: 0 !important;
	border: 0 !important;
	overflow: hidden;
	opacity: 0.5;
	cursor: pointer;
	font-size: 0 !important;
	background-color: transparent !important;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' aria-hidden='true'%3E%3Cg%3E%3Cpath d='m2.5 15.25 7.5-7.5 7.5 7.5 1.5-1.5-9-9-9 9z'/%3E%3C/g%3E%3C/svg%3E") !important;
	background-size: contain !important;
	background-repeat: no-repeat;
	background-position: center;
}
html body .mw-parser-output .navbox .mw-collapsible-toggle::before,
html body .mw-parser-output .navbox .mw-collapsible-toggle::after {
	content: none !important;
}
html body .mw-parser-output .navbox .mw-collapsible-toggle.mw-collapsible-toggle-collapsed {
	transform: rotate(180deg);
}
html body .mw-parser-output .navbox tr:hover > :is(th, td) {
	background: var(--background-color-button-quiet--hover, rgba(0, 24, 73, 0.027)) !important;
}

html body .mw-parser-output .portal-bar {
	box-sizing: border-box;
	max-width: 100%;
	font-size: var(--text-sm, 0.875rem);
	line-height: 1.5;
	color: var(--color-base, #202122);
}
html body .mw-parser-output .portal-bar-bordered {
	border: 1px solid var(--border-color-base, #a2a9b1) !important;
	border-radius: var(--border-radius-medium, 2px);
	background: var(--background-color-base, #fff) !important;
}
html body .mw-parser-output .portal-bar :is(div, span, p, b, i, u, small, big, ul, ol, li, dl, dt, dd, table, tbody, tr, th, td, caption, sup, sub, button):not(:where(.mw-tmh-player, .mw-tmh-player *, .legend-color, .legend, .mw-no-invert, .notheme)) {
	background-color: transparent !important;
	background-image: none !important;
	color: inherit !important;
}
html body .mw-parser-output .portal-bar a {
	color: var(--color-link, #36c) !important;
}
html body .mw-parser-output :is(.navbox, .sister-bar) + .portal-bar,
html body .mw-parser-output :is(.navbox, .sister-bar) + :is(link, style) + .portal-bar {
	border-top-left-radius: 0 !important;
	border-top-right-radius: 0 !important;
}
html body .mw-parser-output .navbox:has(+ .portal-bar),
html body .mw-parser-output .navbox:has(+ :is(link, style) + .portal-bar),
html body .mw-parser-output .sister-bar:has(+ .portal-bar),
html body .mw-parser-output .sister-bar:has(+ :is(link, style) + .portal-bar) {
	border-bottom-left-radius: 0 !important;
	border-bottom-right-radius: 0 !important;
}

@media (min-width: 1120px) {
	html body.cv-sidebar-collapsed .citizen-body-container {
		grid-template-columns: minmax(0, calc(var(--width-layout, 1080px) + var(--width-toc, 240px) + var(--space-lg, 20px))) !important;
		grid-template-areas: "content" "footer" !important;
	}
	html body.cv-sidebar-collapsed .citizen-page-sidebar {
		display: none !important;
	}
	html body.cv-sidebar-collapsed #citizen-toc {
		position: relative !important; 
		top: auto !important;
		left: auto !important;
		bottom: auto !important;
		flex: none !important;
		width: auto !important;
		height: auto !important;
		max-height: none !important;
		margin: 0 !important;
		padding: 0 !important;
		overflow: visible !important;
		overscroll-behavior: auto !important;
		z-index: 1 !important;
	}
	html body.cv-sidebar-collapsed .citizen-sticky-header-start {
		overflow: visible !important;
	}
	html body.cv-sidebar-collapsed #citizen-toc .citizen-dropdown-summary {
		display: inline-flex !important;
	}
	html body.cv-sidebar-collapsed #citizen-toc .citizen-menu__card,
	html body.cv-sidebar-collapsed #citizen-toc .citizen-toc-card {
		position: absolute !important;
		top: calc(100% + var(--space-xs)) !important; 
		left: calc(var(--space-xs) * -1) !important;
		right: auto !important;
		bottom: auto !important;
		width: max-content !important;
		min-width: 16rem !important; 
		max-width: calc(100vw - var(--space-xs) * 2) !important;
		--cv-toc-card-max-h: 60vh; 
		max-height: var(--cv-toc-card-max-h) !important;
		margin: var(--space-xs) !important;
		padding: 0 var(--space-xs) !important; 
		contain: content !important;
		border: var(--border-width-base, 1px) solid var(--border-color-base) !important; 
		border-radius: var(--border-radius-medium, 8px) !important;
		color: var(--color-base) !important; 
		background-color: color-mix(in oklch, var(--color-surface-1) calc(var(--opacity-glass, 0.9) * 100%), transparent) !important; 
		backdrop-filter: var(--backdrop-filter-frosted-glass) !important;
		-webkit-backdrop-filter: var(--backdrop-filter-frosted-glass) !important;
		box-shadow: var(--box-shadow-large) !important;
		z-index: 350 !important;
	}
	html body.cv-sidebar-collapsed #citizen-toc .citizen-dropdown-details:not([open]) ~ .citizen-menu__card,
	html body.cv-sidebar-collapsed #citizen-toc .citizen-dropdown-details:not([open]) ~ .citizen-toc-card {
		content-visibility: hidden !important;
		clip-path: var(--citizen-clip-expand-down, inset(0 0 100% 0)) !important;
		transform: var(--citizen-translate-expand-down, translateY(-0.5rem)) !important;
		transition-property: clip-path, transform, content-visibility !important;
		transition-behavior: allow-discrete !important;
		transition-duration: var(--transition-duration-base, 100ms) !important;
		transition-timing-function: var(--transition-timing-function-ease-in, cubic-bezier(0.3, 0, 0.8, 0.15)) !important;
	}
	html body.cv-sidebar-collapsed #citizen-toc .citizen-dropdown-details[open] ~ .citizen-menu__card,
	html body.cv-sidebar-collapsed #citizen-toc .citizen-dropdown-details[open] ~ .citizen-toc-card {
		content-visibility: visible !important;
		clip-path: inset(0) !important;
		transform: none !important;
		transition-property: clip-path, transform, content-visibility !important;
		transition-behavior: allow-discrete !important;
		transition-duration: var(--transition-duration-medium, 250ms) !important;
		transition-timing-function: var(--transition-timing-function-ease-out, cubic-bezier(0.05, 0.7, 0.1, 1)) !important;
	}
	html body.cv-sidebar-collapsed #citizen-toc .citizen-menu__card-content {
		max-height: calc(var(--cv-toc-card-max-h) - 2px) !important;
		overflow: auto !important;
		opacity: 0 !important;
		transition-property: opacity !important;
		transition-duration: var(--transition-duration-base, 100ms) !important;
		transition-timing-function: var(--transition-timing-function-ease-in, cubic-bezier(0.3, 0, 0.8, 0.15)) !important;
	}
	html body.cv-sidebar-collapsed #citizen-toc .citizen-dropdown-details[open] ~ .citizen-menu__card .citizen-menu__card-content {
		opacity: 1 !important;
		transition-duration: var(--transition-duration-medium, 250ms) !important;
		transition-timing-function: var(--transition-timing-function-ease-out, cubic-bezier(0.05, 0.7, 0.1, 1)) !important;
	}
	html body #citizen-toc .cv-toc-card-air {
		display: none !important;
	}
	html body.cv-sidebar-collapsed #citizen-toc .cv-toc-card-air {
		display: block !important;
		flex: none !important;
		height: var(--space-xs, 0.5rem) !important;
	}
}

html body .citizen-page-header .firstHeading,
html body .citizen-page-header #firstHeading,
html body .citizen-page-header h1 {
	font-family: var(--font-family-base, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "PingFang SC", "Microsoft JhengHei", "Microsoft YaHei", system-ui, sans-serif) !important;
	font-size: 28px !important;
	line-height: 32px !important;
	font-weight: 600 !important;
	padding: 0 !important;
	margin: 0 !important;
	border: 0 !important;
}
/*CVNS2-B*/
html body #bodyContent .mw-body-content:not(.ve-ui-surface):not(.ve-ui-mwWikitextSurface):not(.ve-ce-surface) { padding: 0 !important; margin: 0 !important; margin-block-start: var(--space-md, 16px) !important; }
html body #bodyContent #contentSub { margin: 0 !important; }
/*CVNS2-E*/
html body .citizen-page-header { margin-top: var(--space-xl, 24px) !important; padding: 0 var(--padding-page, 32px) !important; }
html body .citizen-page-header-inner {
	margin-inline: auto;
	max-width: var(--width-layout, 1080px);
}
@media (min-width: 1120px) {
	html body:is(.citizen-toc-enabled, .cv-sidebar-reserved, :has(.citizen-body-container > .citizen-page-sidebar > *)) .citizen-page-header-inner {
		max-width: calc(var(--width-layout, 1080px) + var(--width-toc, 240px) + var(--space-lg, 20px));
	}
}
html body .citizen-page-heading #siteSub { display: block !important; font-size: var(--font-size-small, 0.875rem); line-height: var(--line-height-x-small, 1.25rem); color: oklch(40% 0.04 var(--color-primary-oklch__h)); margin: 0; }

html body.ns-talk #citizen-page-header #p-views li#ca-view.selected {
	display: none !important;
}

/*CVNS2-B*/
html body #bodyContent.citizen-body,
html body .mw-body-content.citizen-body {
	font-size: var(--font-size-medium, 1rem) !important;
	line-height: var(--line-height-content, 1.75) !important;
}
html body #bodyContent h1,
html body #bodyContent h2,
html body #bodyContent h3,
html body #bodyContent h4,
html body #bodyContent h5,
html body #bodyContent h6,
html body .mw-parser-output h1,
html body .mw-parser-output h2,
html body .mw-parser-output h3,
html body .mw-parser-output h4,
html body .mw-parser-output h5,
html body .mw-parser-output h6 {
	font-family: var(--font-family-base, Roboto, system-ui, -apple-system, sans-serif) !important;
	color: var(--color-emphasized, #202122) !important;
	font-weight: 600 !important; 
	border: 0 !important;
}
html body #bodyContent h1,
html body .mw-parser-output h1 { line-height: var(--line-height-xxx-large, 2.375rem) !important; }
html body #bodyContent h2,
html body .mw-parser-output h2 { line-height: var(--line-height-xx-large, 2.125rem) !important; }
html body #bodyContent h3,
html body .mw-parser-output h3 { line-height: var(--line-height-x-large, 1.875rem) !important; }
html body #bodyContent h4,
html body .mw-parser-output h4 { line-height: var(--line-height-large, 1.75rem) !important; }
html body #bodyContent h5,
html body #bodyContent h6,
html body .mw-parser-output h5,
html body .mw-parser-output h6 { line-height: var(--line-height-content, 1.75) !important; }
html body #bodyContent h1,
html body #bodyContent h2,
html body .mw-parser-output h1,
html body .mw-parser-output h2 {
	margin-block: 2em 0.25em !important;
}
html body #bodyContent h3,
html body #bodyContent h4,
html body .mw-parser-output h3,
html body .mw-parser-output h4 {
	margin-block: 1.5em 0.25em !important;
}
html body #bodyContent h5,
html body #bodyContent h6,
html body .mw-parser-output h5,
html body .mw-parser-output h6 {
	margin-block: 1.25em 0.25em !important;
}
html body #bodyContent h1,
html body .mw-parser-output h1 { font-size: var(--font-size-xxx-large, 1.75rem) !important; }
html body #bodyContent h2,
html body .mw-parser-output h2 { font-size: var(--font-size-xx-large, 1.5rem) !important; }
html body #bodyContent h3,
html body .mw-parser-output h3 { font-size: var(--font-size-x-large, 1.25rem) !important; }
html body #bodyContent h4,
html body .mw-parser-output h4 { font-size: var(--font-size-large, 1.125rem) !important; }
html body #bodyContent h5,
html body #bodyContent h6,
html body .mw-parser-output h5,
html body .mw-parser-output h6 { font-size: var(--font-size-medium, 1rem) !important; }
html body #bodyContent p:not(.ve-ce-paragraphNode),
html body .mw-parser-output p:not(.ve-ce-paragraphNode) {
	margin-block: var(--space-md, 16px) !important;
	overflow-wrap: break-word;
}
/*CVNS2-E*/


.mw-plusminus-pos {
	color: var(--color-success, oklch(0.56 0.11 146.07)) !important;
}
.mw-plusminus-neg {
	color: var(--color-destructive, oklch(0.56 0.19 25.26)) !important;
}
.mw-plusminus-null {
	color: var(--color-subtle) !important;
}

.mw-changeslist h4 {
	position: relative;
	z-index: 2;
	padding: var(--space-sm, 8px) 0;
	margin-bottom: 0;
	font-size: var(--font-size-x-small, 0.75rem);
	font-weight: var(--font-weight-normal, 400);
	color: var(--color-subtle);
	letter-spacing: 0.05em;
}

.mw-changeslist-line .mw-changeslist-line::before {
	content: none;
}
.mw-changeslist-line > td:first-child {
	position: relative;
}
.mw-changeslist-line > td:first-child::before {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 5px;
	width: 2px;
	content: '';
	background: var(--border-color-base, rgb(0 0 0 / 0.1));
}
.mw-changeslist-line-inner,
.mw-changeslist-separator {
	color: var(--color-subtle);
}

.mw-changeslist,
.mw-contributions-list {
	position: relative;
	font-size: var(--font-size-small, 0.875rem);
}
.mw-changeslist::before,
.mw-contributions-list::before {
	position: absolute;
	top: 0;
	bottom: 0;
	left: calc(var(--border-width-thick, 2px) + 1px);
	width: var(--border-width-thick, 2px);
	content: '';
	background: var(--border-color-base, rgb(0 0 0 / 0.1));
}
.mw-changeslist ul,
.mw-contributions-list {
	margin: 0 !important;
	list-style: none;
}

.mw-changeslist-line,
.mw-contributions-list li {
	padding: var(--space-sm, 8px) var(--space-xs, 4px) !important;
	margin: 0 0 0 16px !important;
	color: var(--color-subtle);
	border-radius: var(--border-radius-base, 4px);
}
.mw-changeslist-line:hover,
.mw-contributions-list li:hover {
	background-color: var(--background-color-button-quiet--hover, rgb(0 0 0 / 0.04));
}
.mw-changeslist-line:hover::before,
.mw-contributions-list li:hover::before {
	background-color: var(--color-emphasized);
}
.mw-changeslist-line::before,
.mw-contributions-list li::before {
	position: absolute;
	left: 0;
	display: block;
	width: 8px;
	height: 8px;
	margin-top: 7px;
	content: '';
	background-color: var(--color-subtle);
	border-radius: 100%;
	outline: 4px solid var(--color-surface-0, #fff);
}
.mw-changeslist-line .comment,
.mw-contributions-list li .comment {
	color: var(--color-base);
}

.mw-pager-navigation-bar {
	margin: var(--space-md, 16px) 0;
	color: var(--color-subtle);
}

.mw-changeslist-legend {
	position: relative;
	z-index: 2 !important;
	padding: var(--space-sm, 8px);
	font-size: var(--font-size-x-small, 0.75rem);
	background-color: var(--color-surface-2, rgb(0 0 0 / 0.04));
	border-color: var(--border-color-base, rgb(0 0 0 / 0.1));
	border-radius: var(--border-radius-base, 4px);
}
.mw-changeslist-legend strong {
	font-weight: var(--font-weight-normal, 400);
	color: var(--color-subtle);
	letter-spacing: 0.05em;
}
.mw-changeslist-legend dl,
.mw-changeslist-legend ul {
	margin-top: var(--space-xs, 4px);
}
.mw-changeslist-legend ul {
	margin-bottom: 0;
	margin-left: var(--space-sm, 8px);
}
@media (max-width: 639.98px) {
	.mw-changeslist-legend {
		margin: 0;
	}
}

#mw-history-compare {
	margin: var(--space-md, 16px) 0;
}
.mw-history-compareselectedversions {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	margin: var(--space-md, 16px) 0;
	font-size: var(--font-size-small, 0.875rem);
}
#pagehistory {
	margin: 0;
	list-style: none;
}
#pagehistory li.selected {
	color: var(--color-base--emphasized, var(--color-emphasized));
	outline-color: var(--border-color-base, rgb(0 0 0 / 0.1));
}
#pagehistory li.selected.before {
	background-color: var(--background-color-success-subtle, oklch(95% 0.03 146.07));
}
#pagehistory li.selected.after {
	background-color: var(--background-color-destructive-subtle, oklch(95% 0.05 25.26));
}

@media print {
	.mw-header,
	#mw-panel,
	.citizen-drawer__card,
	.citizen-menu__card,
	.citizen-search,
	.citizen-userMenu__card,
	.citizen-preferences__card,
	.citizen-sticky-header,
	.vector-pinnable-element { display: none !important; }
}
.citizen-command-palette{--citizen-command-palette-side-padding:var(--space-md);position:fixed;top:var(--space-xs);right:var(--space-xs);left:var(--space-xs);display:flex;flex-direction:column;max-width:56rem;max-height:calc(100vh - var(--space-xs) * 2);margin-inline:auto;overflow:hidden;border:var(--border-base);border-radius:var(--border-radius-medium);box-shadow:var(--box-shadow-drop-xx-large);transition-timing-function:var(--transition-timing-function-ease-out);transition-duration:var(--transition-duration-medium);transition-property:max-width;background-color:color-mix(in oklch,var(--color-surface-1) calc(var(--opacity-glass) * 100%),transparent);-webkit-backdrop-filter:var(--backdrop-filter-frosted-glass);backdrop-filter:var(--backdrop-filter-frosted-glass);font-size:var(--font-size-small);line-height:var(--line-height-small)}.citizen-command-palette[data-palette-layout='gallery']{max-width:60rem}@media (min-width:640px){.citizen-command-palette[data-palette-layout='gallery'] .citizen-command-palette__body-viewport--has-detail .citizen-command-palette__results{flex:3}.citizen-command-palette[data-palette-layout='gallery'] .citizen-command-palette__body-viewport--has-detail .citizen-command-palette__detail{flex:2}}@media (min-width:1119.98px){.citizen-command-palette{top:3rem;max-height:calc(100vh - 3rem * 2)}}.citizen-command-palette-backdrop{position:fixed;inset:0;background-color:var(--background-color-backdrop-light)}.citizen-command-palette__body{min-height:0;overflow:hidden;border-top:var(--border-subtle);transition-timing-function:var(--transition-timing-function-ease-out);transition-duration:var(--transition-duration-medium);transition-property:height}@media (min-width:640px){.citizen-command-palette__body-viewport--has-detail{display:flex}}.citizen-command-palette__body-viewport--uniform-type .citizen-command-palette-list-item__metadata__item--type{display:none}.citizen-command-palette__results{max-height:calc(100vh - 12rem);overflow-y:auto;overscroll-behavior:contain}@media (min-width:640px){.citizen-command-palette__body-viewport--has-detail .citizen-command-palette__results{flex:2;border-inline-end:var(--border-subtle)}.citizen-command-palette__body-viewport--has-detail .citizen-command-palette__results .citizen-command-palette-list-item__metadata,.citizen-command-palette__body-viewport--has-detail .citizen-command-palette__results .citizen-command-palette-list-item__text__description,.citizen-command-palette__body-viewport--has-detail .citizen-command-palette__results .citizen-command-palette-list-item__text-inline__description{display:none}}.citizen-command-palette__detail{display:none}@media (min-width:640px){.citizen-command-palette__detail{display:block;flex:3;max-height:calc(100vh - 12rem);overflow-y:auto;overscroll-behavior:contain}}.citizen-command-palette__no-results{padding:var(--space-md) var(--citizen-command-palette-side-padding);text-align:center}.citizen-command-palette-enter-active{transition-timing-function:var(--transition-timing-function-ease-out);transition-duration:var(--transition-duration-medium);transition-property:clip-path,transform,opacity}.citizen-command-palette-leave-active{transition-timing-function:var(--transition-timing-function-ease-in);transition-duration:var(--transition-duration-base);transition-property:clip-path,transform,opacity}.citizen-command-palette-enter-from,.citizen-command-palette-leave-to{opacity:0;clip-path:inset(0 0 100% 0);transform:translateY(calc(var(--space-xs) * -1))}.citizen-command-palette-enter-to,.citizen-command-palette-leave-from{opacity:1;clip-path:inset(0 0 0 0);transform:translateY(0)}.citizen-command-palette-backdrop-enter-active{transition-timing-function:var(--transition-timing-function-ease-out);transition-duration:var(--transition-duration-medium);transition-property:opacity}.citizen-command-palette-backdrop-leave-active{transition-timing-function:var(--transition-timing-function-ease-in);transition-duration:var(--transition-duration-base);transition-property:opacity}.citizen-command-palette-backdrop-enter-from,.citizen-command-palette-backdrop-leave-to{opacity:0}.citizen-command-palette-detail-enter-active,.citizen-command-palette-detail-leave-active{transition-timing-function:var(--transition-timing-function-ease-out);transition-duration:var(--transition-duration-medium);transition-property:flex,opacity}.citizen-command-palette-detail-enter-from,.citizen-command-palette-detail-leave-to{flex:0;opacity:0}.citizen-command-palette-empty-state{display:flex;flex-direction:column;gap:var(--space-sm);align-items:center;justify-content:center;padding:var(--space-xxl) var(--citizen-command-palette-side-padding);text-align:center}.citizen-command-palette-empty-state__icon{width:5rem;height:5rem;color:rgba(0, 18, 65, 1);accent-color:oklch(0.5325 0.1679 262.29)}.citizen-command-palette-empty-state__icon .cdx-icon{width:100%;height:100%;color:inherit}.citizen-command-palette-empty-state__content{display:flex;flex-direction:column}.citizen-command-palette-empty-state__title{font-size:var(--font-size-large);font-weight:var(--font-weight-semi-bold);line-height:var(--line-height-large);color:oklch(0.05 0.07 262.29)}.citizen-command-palette-empty-state__description{font-size:var(--font-size-medium);line-height:var(--line-height-medium);color:rgba(25, 55, 115, 1)}.citizen-command-palette__footer{display:flex;justify-content:flex-end;padding:var(--space-sm) var(--citizen-command-palette-side-padding);color:var(--color-subtle);border-top:var(--border-subtle)}.citizen-command-palette-header{--citizen-command-palette-back-button-size:24px;position:relative;padding:var(--space-sm) calc(var(--citizen-command-palette-side-padding) - 8px);transition-timing-function:var(--transition-timing-function-ease);transition-duration:var(--transition-duration-base);transition-property:padding-inline-start;font-size:var(--font-size-medium);line-height:var(--line-height-medium)}.citizen-command-palette-header--mode-active{padding-inline-start:calc(var(--citizen-command-palette-side-padding) - 8px + var(--citizen-command-palette-back-button-size))}.citizen-command-palette-header__back{position:absolute;inset-block:0;inset-inline-start:calc(var(--citizen-command-palette-side-padding) - 8px);min-width:var(--citizen-command-palette-back-button-size);margin-block:auto}.citizen-command-palette-header-back-enter-active,.citizen-command-palette-header-back-leave-active{transition-timing-function:var(--transition-timing-function-ease);transition-duration:var(--transition-duration-base);transition-property:opacity,transform}.citizen-command-palette-header-back-enter-from,.citizen-command-palette-header-back-leave-to{opacity:0;transform:translateX(-25%)}.citizen-command-palette-header__chip{flex-shrink:0;font-weight:var(--font-weight-medium);background-color:var(--background-color-interactive);border:var(--border-base);border-radius:var(--border-radius-base)}.citizen-command-palette-header__chip--outlined{background-color:transparent;border-style:dashed}.citizen-command-palette-header__chip--selected{background-color:transparent;border-color:var(--border-color-subtle)}.citizen-command-palette-header__input-area{display:flex;flex-grow:1;flex-wrap:nowrap;gap:4px;align-items:center}.citizen-command-palette-header__icon{flex-shrink:0;color:var(--color-placeholder,#72777d);transition-timing-function:var(--transition-timing-function-ease);transition-duration:var(--transition-duration-base);transition-property:opacity,transform}.citizen-command-palette-header__icon.cdx-icon{width:40px}.citizen-command-palette-header__input{flex-grow:1;min-width:0}.citizen-command-palette-header__input .cdx-text-input__input{padding-block:0;padding-inline-start:0;outline:0 !important;background-color:transparent !important;border:0 !important;box-shadow:none !important}.citizen-command-palette-header__progress-indicator{position:absolute;right:0;bottom:0;left:0}.citizen-command-palette-help__mode-summary{display:flex;gap:var(--space-sm);align-items:flex-start;padding-block-end:var(--space-md)}.citizen-command-palette-help__mode-thumbnail{flex-shrink:0}.citizen-command-palette-help__mode-text{flex:1;min-width:0}.citizen-command-palette-help__mode-label{font-size:var(--font-size-medium);line-height:var(--line-height-medium);font-weight:var(--font-weight-semi-bold);color:var(--color-emphasized)}.citizen-command-palette-help__mode-description{color:var(--color-subtle)}.citizen-command-palette-help__triggers{display:flex;flex-wrap:wrap;gap:var(--space-xs)}.citizen-command-palette-help__trigger-chip{padding:var(--space-xxs) var(--space-sm);font-family:var(--font-family-monospace);font-size:var(--font-size-medium);color:var(--color-base);background-color:var(--background-color-interactive);border:var(--border-subtle);border-radius:var(--border-radius-pill)}.citizen-command-palette-help__long-description code{padding:0 var(--space-xxs);background-color:var(--background-color-interactive);border-radius:var(--border-radius-base)}.citizen-command-palette__footer-hints{display:flex;flex-wrap:wrap;gap:var(--space-sm)}.citizen-command-palette-list{padding-block:var(--space-xs)}.citizen-command-palette-list__heading{padding-block:var(--space-xs) var(--space-xxs);padding-inline:var(--citizen-command-palette-side-padding);color:var(--color-subtle);font-family:var(--font-family-overline);font-size:var(--font-size-overline);font-weight:var(--font-weight-overline);line-height:var(--line-height-overline);text-transform:var(--text-transform-overline);letter-spacing:var(--letter-spacing-overline)}.citizen-command-palette-list-item{position:relative;outline:0;list-style:none}.citizen-command-palette-list-item--highlighted{cursor:pointer;background-color:var(--background-color-interactive-subtle--hover);--actions-fade-color:var(--background-color-interactive-subtle--hover)}.citizen-command-palette-list-item--active{background-color:var(--background-color-interactive-subtle--active);--actions-fade-color:var(--background-color-interactive-subtle--active)}.citizen-command-palette-gallery{padding-block:var(--space-md);padding-inline:var(--citizen-command-palette-side-padding)}.citizen-command-palette-gallery__heading{padding-block:var(--space-xs) var(--space-xxs);color:var(--color-subtle);font-family:var(--font-family-overline);font-size:var(--font-size-overline);font-weight:var(--font-weight-overline);line-height:var(--line-height-overline);text-transform:var(--text-transform-overline);letter-spacing:var(--letter-spacing-overline)}.citizen-command-palette-gallery__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:var(--space-sm)}.citizen-command-palette-detail-panel{padding:var(--space-md) var(--citizen-command-palette-side-padding);overflow-y:auto}.citizen-command-palette-detail-panel__media{margin-block-end:var(--space-md);border:1px solid var(--border-color-subtle);border-radius:var(--border-radius-medium)}.citizen-command-palette-detail-panel__header{display:flex;gap:var(--space-xs);align-items:flex-start;padding-block-end:var(--space-md)}.citizen-command-palette-detail-panel__header-text{flex:1;min-width:0}.citizen-command-palette-detail-panel__header-label{font-size:var(--font-size-medium);line-height:var(--line-height-medium);font-weight:var(--font-weight-semi-bold);color:var(--color-emphasized);overflow-wrap:break-word}.citizen-command-palette-detail-panel__header-description{color:var(--color-subtle)}.citizen-command-palette-detail-panel__header-copy{flex-shrink:0}.citizen-command-palette-detail-panel__header-copy--copied{color:var(--color-success) !important}.citizen-command-palette-detail-panel__pairs{display:flex;flex-direction:column;gap:var(--space-md);margin:0}.citizen-command-palette-detail-panel__pair{display:flex;flex-direction:column;gap:2px}.citizen-command-palette-detail-panel__label{color:var(--color-subtle);font-family:var(--font-family-overline);font-size:var(--font-size-overline);font-weight:var(--font-weight-overline);line-height:var(--line-height-overline);text-transform:var(--text-transform-overline);letter-spacing:var(--letter-spacing-overline)}.citizen-command-palette-detail-panel__value{margin:0;overflow-wrap:break-word}.citizen-command-palette-list-item__actions{position:absolute;inset-inline-end:var(--citizen-command-palette-side-padding);top:0;display:flex;gap:var(--space-xxs);align-items:center;height:100%;padding-left:var(--space-xl);pointer-events:none;background-image:linear-gradient(to right,transparent 0%,transparent 30%,var(--actions-fade-color,inherit) 70%);opacity:0;transform:translateX(16px);transition-timing-function:var(--transition-timing-function-ease-in);transition-duration:var(--transition-duration-base);transition-property:opacity,transform}.citizen-command-palette-list-item__actions--visible{pointer-events:auto;opacity:1;transform:none;transition-timing-function:var(--transition-timing-function-ease-out)}.citizen-command-palette-list-item__action{border-radius:var(--border-radius-base)}a.citizen-command-palette-list-item__action.cdx-button .cdx-icon{padding:0}.citizen-command-palette-list-item__content{display:flex;column-gap:var(--space-sm);align-items:center;padding:var(--space-sm) var(--citizen-command-palette-side-padding);text-decoration:none}button.citizen-command-palette-list-item__content{width:100%;font:inherit;color:inherit;text-align:inherit;cursor:pointer;background:none;border:0}.citizen-command-palette-list-item__content:hover{text-decoration:none}.citizen-command-palette-list-item__content--compact{padding-block:var(--space-xs)}.citizen-command-palette-list-item__icon{flex-shrink:0;color:var(--color-subtle)}.citizen-command-palette-list-item__text{flex:1;min-width:0;overflow:hidden;line-height:1.125rem}.citizen-command-palette-list-item__text__label{font-weight:var(--font-weight-semi-bold);color:var(--color-emphasized);font-size:var(--font-size-medium);line-height:var(--line-height-medium)}.citizen-command-palette-list-item__text__label .cdx-search-result-title{display:inline}.citizen-command-palette-list-item__text__description{color:var(--color-subtle)}.citizen-command-palette-list-item__text .cdx-search-result-title{font-weight:var(--font-weight-semi-bold);color:var(--color-emphasized)}.citizen-command-palette-list-item__text .cdx-search-result-title__match{color:var(--color-subtle)}.citizen-command-palette-list-item__text__label,.citizen-command-palette-list-item__text__description{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.citizen-command-palette-list-item__text-inline{display:flex;flex:1;column-gap:var(--space-xs);align-items:baseline;min-width:0;font-size:var(--font-size-medium);line-height:var(--line-height-medium)}.citizen-command-palette-list-item__text-inline .citizen-command-palette-list-item__text__label{flex-shrink:0;min-width:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;font-weight:var(--font-weight-semi-bold);color:var(--color-emphasized);white-space:nowrap}.citizen-command-palette-list-item__text-inline .citizen-command-palette-list-item__text__label .cdx-search-result-title{display:inline;font-weight:var(--font-weight-semi-bold);color:var(--color-emphasized)}.citizen-command-palette-list-item__text-inline .citizen-command-palette-list-item__text__label .cdx-search-result-title__match{color:var(--color-subtle)}.citizen-command-palette-list-item__text-inline__description{flex:1 1 0;min-width:0;overflow:hidden;text-overflow:ellipsis;color:var(--color-subtle);white-space:nowrap}.citizen-command-palette-list-item__metadata{display:flex;gap:var(--space-xxs);color:var(--color-subtle)}.citizen-command-palette-list-item__metadata__item{display:flex;column-gap:var(--space-xxs);align-items:center;padding:2px var(--space-xs);line-height:var(--line-height-small);background:var(--color-surface-2);border:var(--border-subtle);border-radius:var(--border-radius-base)}.citizen-command-palette-list-item__metadata__item .cdx-icon{color:var(--color-subtle)}.citizen-command-palette-list-item__metadata__item--status-success{color:var(--color-success);background-color:var(--background-color-success-subtle);border-color:var(--border-color-success)}.citizen-command-palette-list-item__metadata__item--status-error{color:var(--color-error);background-color:var(--background-color-error-subtle);border-color:var(--border-color-error)}.citizen-command-palette-gallery-item{display:block;padding:0;overflow:hidden;color:inherit;text-decoration:none;cursor:pointer;outline:0;background:none;border:0;border-radius:var(--border-radius-medium)}a.citizen-command-palette-gallery-item,button.citizen-command-palette-gallery-item{font:inherit;color:inherit;text-align:inherit}.citizen-command-palette-gallery-item:hover{text-decoration:none}.citizen-command-palette-gallery-item__thumbnail{border:1px solid var(--border-color-subtle);border-radius:var(--border-radius-medium)}.citizen-command-palette-gallery-item__thumbnail::after{position:absolute;inset:0;pointer-events:none;content:'';border-radius:inherit;box-shadow:inset 0 0 0 2px transparent}.citizen-command-palette-gallery-item--highlighted .citizen-command-palette-gallery-item__thumbnail{border-color:var(--border-color-progressive)}.citizen-command-palette-gallery-item--highlighted .citizen-command-palette-gallery-item__thumbnail::after{box-shadow:inset 0 0 0 2px var(--border-color-progressive)}.citizen-command-palette-gallery-item--active .citizen-command-palette-gallery-item__thumbnail{border-color:var(--border-color-progressive--active)}.citizen-command-palette-gallery-item--active .citizen-command-palette-gallery-item__thumbnail::after{box-shadow:inset 0 0 0 2px var(--border-color-progressive--active)}.citizen-command-palette-image{position:relative;display:block;overflow:hidden;background-color:var(--background-color-neutral-subtle)}.citizen-command-palette-image--ratio-1-1{aspect-ratio:1}.citizen-command-palette-image--ratio-4-3{aspect-ratio:1.33333333}.citizen-command-palette-image--ratio-3-2{aspect-ratio:1.5}.citizen-command-palette-image--ratio-16-9{aspect-ratio:1.77777778}.citizen-command-palette-image__image{display:block;width:100%;height:100%}.citizen-command-palette-image__image--fit-fill{object-fit:fill}.citizen-command-palette-image__image--fit-contain{object-fit:contain}.citizen-command-palette-image__image--fit-cover{object-fit:cover}.citizen-command-palette-image__image--fit-none{object-fit:none}.citizen-command-palette-image__image--fit-scale-down{object-fit:scale-down}.citizen-command-palette-image__placeholder{display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:var(--color-subtle)}.citizen-command-palette-image__placeholder-icon.cdx-icon--medium{width:25% !important;min-width:2rem !important;height:auto !important;min-height:0 !important;aspect-ratio:1}
.citizen-command-palette{--font-size-medium:1rem;--line-height-medium:1.625rem;}
.citizen-command-palette-list-item__thumbnail.cdx-thumbnail{display:flex;width:2.5rem;height:2.5rem;flex-shrink:0;padding:0;border:0;border-radius:0;background-color:transparent;color:var(--color-progressive,#36c);}
.citizen-command-palette-list-item__thumbnail .cdx-thumbnail__placeholder{display:flex;align-items:center;justify-content:center;width:100%;height:100%;background-color:var(--color-surface-1,#eaecf0);}
.citizen-command-palette-list-item__thumbnail .cdx-icon{width:1.25rem;height:1.25rem;}
.citizen-command-palette-list-item__thumbnail .cdx-icon svg{width:100%;height:100%;}
.citizen-command-palette .cdx-thumbnail__placeholder__icon--vue.cdx-icon{color:var(--color-placeholder,#72777d);}
.citizen-command-palette .cdx-thumbnail__placeholder__icon--vue.cdx-icon svg{color:inherit;}
.cdx-text-input{display:inline-flex;align-items:center;min-height:32px;background-color:transparent;border:0;border-radius:var(--border-radius-base,4px);}
.cdx-text-input--status-default{border-color:var(--border-color-base,#a2a9b1);}
.cdx-text-input__input{flex:1 1 auto;min-width:0;min-height:32px;height:32px;padding:0 8px;background:transparent;box-shadow:none;font-family:inherit;font-size:16px;line-height:22px;color:var(--color-base,#202122);appearance:none;}
.cdx-text-input__input:focus{outline:0;}

.citizen-command-palette-header__input.cdx-text-input{background-color:transparent;border:none;border-radius:0;min-height:0;flex-grow:1;min-width:0;}
.citizen-command-palette-header__input .cdx-text-input__input,
.citizen-command-palette-header__input .cdx-text-input__input:enabled{
	color:rgba(0, 18, 65, 1);
	accent-color:var(--color-progressive,#36c);
	appearance:none;
	background-color:rgba(0, 0, 0, 0);
	border-bottom-color:var(--color-base,#202122);
	border-bottom-width:0;
	border-bottom-style:none;
}
.citizen-command-palette-header__input .cdx-text-input__input::placeholder{color:var(--color-placeholder,#72777d);opacity:1;}

.citizen-command-palette-header__input .cdx-text-input__clear-icon{position:absolute;top:50%;right:9px;transform:translateY(-50%);flex-shrink:0;min-width:16px;min-height:16px;width:1rem;height:1rem;color:var(--color-base,#202122);cursor:pointer;display:none;border-radius:0;}
.citizen-command-palette-header__input.cdx-text-input--has-value .cdx-text-input__clear-icon{display:inline-flex;}
.citizen-command-palette-header__input .cdx-text-input__clear-icon:hover{background-color:var(--background-color-interactive-subtle,#f8f9fa);}

.citizen-notifications-button::after{display:none !important}


.cdx-label{display:flex;flex-direction:column;line-height:1.375}
.cdx-label__label__icon.cdx-icon{margin-right:4px}
.cdx-label__label__text{font-weight:700}
legend.cdx-label{padding:0}
fieldset label.cdx-label__label .cdx-label__label__text{font-weight:400}
.cdx-label:not(.cdx-label--disabled) .cdx-label__label__optional-flag,.cdx-label:not(.cdx-label--disabled) .cdx-label__description{color:var(--color-subtle,#54595d)}
.cdx-label--disabled,.cdx-label--disabled .cdx-label__label__icon{color:var(--color-disabled,#72777d)}
.cdx-label--visually-hidden{display:block;clip:rect(1px,1px,1px,1px);position:absolute!important;width:1px;height:1px;margin:-1px;border:0;padding:0;overflow:hidden}
.cdx-label:not(.cdx-label--visually-hidden){padding-bottom:8px}
.cdx-checkbox__label,.cdx-checkbox__label.cdx-label{display:inline-flex;position:relative;z-index:0;padding-left:calc(1.25rem + 8px);line-height:1.4285714}
.cdx-checkbox__label.cdx-label{padding-bottom:0}
.cdx-checkbox__label.cdx-label .cdx-label__label__text{font-weight:400}
.cdx-checkbox:hover>.cdx-checkbox__input:enabled,.cdx-checkbox:hover>.cdx-checkbox__input:enabled~.cdx-label .cdx-label__label,.cdx-checkbox:hover>.cdx-checkbox__input:enabled~.cdx-checkbox__label:not(.cdx-label){cursor:pointer}
.cdx-checkbox__input:disabled~.cdx-checkbox__label,.cdx-checkbox__input:disabled~.cdx-checkbox__label.cdx-label{color:var(--color-disabled,#72777d)}
.cdx-menu-item{list-style:none;position:relative;padding:8px 12px;line-height:1.6;transition-property:background-color,color,border-color,box-shadow;transition-duration:.1s}
.cdx-menu-item__content{display:flex;align-items:center;line-height:1.4285714;word-wrap:break-word;-webkit-hyphens:auto;-ms-hyphens:auto;hyphens:auto}
.cdx-menu-item__content,.cdx-menu-item__content:hover{text-decoration:none}
.cdx-menu-item--has-description .cdx-menu-item__content{align-items:flex-start}
.cdx-menu-item__text{max-width:100%}
.cdx-menu-item__text__description{display:block}
.cdx-menu-item__thumbnail.cdx-thumbnail,.cdx-menu-item__icon{margin-right:8px}
.cdx-menu-item__selected-icon{height:1.4285714em;margin-left:auto}
.cdx-menu-item__icon.cdx-icon,.cdx-menu-item__selected-icon.cdx-icon{color:inherit}
.cdx-menu-item--bold-label .cdx-menu-item__text__label{font-weight:700}
.cdx-menu-item--hide-description-overflow .cdx-menu-item__text{overflow:hidden}
.cdx-menu-item--hide-description-overflow .cdx-menu-item__text__description{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cdx-menu-item--enabled,.cdx-menu-item--enabled .cdx-menu-item__content{color:var(--color-base,#202122)}
.cdx-menu-item--enabled .cdx-menu-item__text__supporting-text,.cdx-menu-item--enabled .cdx-menu-item__text__description{color:var(--color-subtle,#54595d)}
.cdx-menu-item--enabled.cdx-menu-item--highlighted{background-color:var(--background-color-interactive-subtle,#f8f9fa);color:var(--color-base--hover,#404244);cursor:pointer}
.cdx-menu-item--enabled.cdx-menu-item--highlighted .cdx-menu-item__content,.cdx-menu-item--enabled.cdx-menu-item--highlighted .cdx-menu-item__text__description{color:var(--color-base--hover,#404244)}
.cdx-menu-item--enabled.cdx-menu-item--active{background-color:var(--background-color-interactive,#eaecf0);color:var(--color-emphasized,#101418)}
.cdx-menu-item--enabled.cdx-menu-item--active .cdx-menu-item__content,.cdx-menu-item--enabled.cdx-menu-item--active .cdx-menu-item__text__description{color:var(--color-emphasized,#101418)}
.cdx-menu-item--enabled.cdx-menu-item--selected{background-color:var(--background-color-progressive-subtle,#f1f4fd)}
.cdx-menu-item--enabled.cdx-menu-item--selected .cdx-menu-item__content{color:var(--color-progressive,#36c)}
.cdx-menu-item--enabled.cdx-menu-item--selected.cdx-menu-item--highlighted .cdx-menu-item__content{color:var(--color-progressive--hover,#4b77d6)}
.cdx-menu-item--enabled.cdx-menu-item--selected.cdx-menu-item--highlighted .cdx-menu-item__text__description{color:var(--color-subtle,#54595d)}
.cdx-menu-item--enabled.cdx-menu-item--selected.cdx-menu-item--active .cdx-menu-item__content{color:var(--color-progressive--active,#233566)}
.cdx-menu-item--enabled.cdx-menu-item--selected.cdx-menu-item--active .cdx-menu-item__text__description{color:var(--color-subtle,#54595d)}
.cdx-menu-item--disabled{color:var(--color-disabled,#72777d);cursor:default}
.cdx-menu-item--disabled .cdx-menu-item__text__description{color:var(--color-disabled,#72777d)}
.cdx-menu-item--destructive .cdx-menu-item__content{color:var(--color-destructive,#d73333)}
.cdx-menu-item--destructive.cdx-menu-item--highlighted .cdx-menu-item__content{color:var(--color-destructive--hover,#fc493b)}
.cdx-menu-item--destructive.cdx-menu-item--active .cdx-menu-item__content{color:var(--color-destructive--active,#9f3526)}
.cdx-menu-item--destructive.cdx-menu-item--selected.cdx-menu-item--highlighted .cdx-menu-item__content,.cdx-menu-item--destructive.cdx-menu-item--selected.cdx-menu-item--highlighted .cdx-menu-item__text__description{color:var(--color-destructive--hover,#fc493b)}
.cdx-menu{background-color:var(--background-color-base,#fff);display:flex;flex-direction:column;position:absolute;left:0;z-index:50;box-sizing:border-box;width:100%;border:1px solid var(--border-color-base,#a2a9b1);border-radius:2px;box-shadow:0 2px 2px rgba(0,0,0,.2)}
.cdx-menu__progress-bar.cdx-progress-bar{position:absolute;top:0}
.cdx-menu__listbox{margin:0;padding:0;overflow-y:auto}
.cdx-menu--has-footer .cdx-menu-item:last-of-type{position:absolute;bottom:0;box-sizing:border-box;width:100%}
.cdx-menu--has-footer .cdx-menu-item:last-of-type:not(:first-of-type){border-top:1px solid var(--border-color-subtle,#c8ccd1)}
.cdx-menu-button__menu-wrapper{position:relative}
.cdx-menu-button .cdx-menu{min-width:8rem;max-width:16rem}
.cdx-dialog .cdx-menu-button{position:static}
.cdx-radio__label,.cdx-radio__label.cdx-label{display:inline-flex;position:relative;z-index:0;padding-left:calc(1.25rem + 8px);line-height:1.4285714}
.cdx-radio__label.cdx-label{padding-bottom:0}
.cdx-radio__label.cdx-label .cdx-label__label__text{font-weight:400}
.cdx-radio:hover>.cdx-radio__input:enabled,.cdx-radio:hover>.cdx-radio__input:enabled~.cdx-label .cdx-label__label,.cdx-radio:hover>.cdx-radio__input:enabled~.cdx-radio__label:not(.cdx-label){cursor:pointer}
.cdx-radio__input:disabled~.cdx-radio__label,.cdx-radio__input:disabled~.cdx-radio__label.cdx-label{color:var(--color-disabled,#72777d)}
.cdx-select-vue{display:inline-block;position:relative}
.cdx-select-vue__handle{box-sizing:border-box;min-width:256px;min-height:32px;border-width:1px;border-style:solid;border-radius:2px;padding-top:4px;padding-bottom:4px;padding-left:12px;padding-right:calc(16px + 1.25rem);font-size:inherit;line-height:1.375;position:relative;width:100%}
.cdx-select-vue--has-start-icon .cdx-select-vue__handle{padding-left:calc(20px + 1.25rem)}
.cdx-select-vue__start-icon.cdx-icon{position:absolute;top:50%;min-width:20px;min-height:20px;width:1.25rem;height:1.25rem;transition-property:color;transition-duration:.1s;left:12px;transform:translateY(-50%)}
.cdx-select-vue__indicator.cdx-icon{color:var(--color-base,#202122);position:absolute;top:50%;min-width:12px;min-height:12px;width:.75rem;height:.75rem;transition-property:color;transition-duration:.1s;right:12px;transform:translateY(-50%)}
.cdx-select-vue--enabled .cdx-select-vue__handle{background-color:var(--background-color-interactive-subtle,#f8f9fa);color:var(--color-base,#202122);border-color:var(--border-color-base,#a2a9b1);transition-property:background-color,color,border-color,box-shadow;transition-duration:.1s}
.cdx-select-vue--enabled .cdx-select-vue__handle:hover{background-color:var(--background-color-base,#fff);color:var(--color-base--hover,#404244);border-color:var(--border-color-base,#a2a9b1);cursor:pointer}
.cdx-select-vue--enabled .cdx-select-vue__handle:focus{border-color:var(--border-color-progressive--focus,#36c);box-shadow:inset 0 0 0 1px var(--box-shadow-color-progressive--focus,#36c);outline:1px solid transparent}
.cdx-select-vue--enabled .cdx-select-vue__handle:active{color:var(--color-emphasized,#101418);border-color:var(--border-color-interactive,#72777d)}
.cdx-select-vue--enabled .cdx-select-vue__handle:hover .cdx-select-vue__indicator{color:var(--color-base--hover,#404244)}
.cdx-select-vue--enabled.cdx-select-vue--expanded .cdx-select-vue__handle{background-color:var(--background-color-base,#fff)}
.cdx-select-vue--enabled.cdx-select-vue--expanded .cdx-select-vue__handle .cdx-select-vue__indicator{color:var(--color-base,#202122)}
.cdx-select-vue--disabled .cdx-select-vue__handle{background-color:var(--background-color-disabled-subtle,#eaecf0);color:var(--color-disabled,#72777d);border-color:var(--border-color-disabled,#c8ccd1);cursor:default}
.cdx-select-vue--disabled .cdx-select-vue__indicator,.cdx-select-vue--disabled .cdx-select-vue__start-icon{color:var(--color-disabled,#72777d)}
.cdx-select-vue--status-error.cdx-select-vue--enabled .cdx-select-vue__handle{border-color:var(--border-color-error,#9f3526)}
.cdx-select-vue--status-error.cdx-select-vue--enabled .cdx-select-vue__handle:hover{border-color:var(--border-color-error--hover,#fc493b)}
.cdx-select-vue--status-error.cdx-select-vue--enabled .cdx-select-vue__handle:focus{border-color:var(--border-color-progressive--focus,#36c)}
.cdx-dialog .cdx-select-vue{position:static}
.cdx-table-pager__start .cdx-select,.cdx-table-pager__start .cdx-select-vue__handle{min-width:8rem}
.cdx-toggle-switch{display:inline-flex;align-items:center;justify-content:flex-start;position:relative;z-index:0;margin-bottom:12px}
.cdx-toggle-switch--align-switch{display:flex;justify-content:space-between}
.cdx-toggle-switch:last-child{margin-bottom:0}
.cdx-toggle-switch__label,.cdx-toggle-switch__label.cdx-label{order:-1}
.cdx-toggle-switch__label:not(:empty),.cdx-toggle-switch__label.cdx-label:not(:empty){padding-right:6px}
.cdx-toggle-switch .cdx-toggle-switch__label.cdx-label{padding-bottom:0}
.cdx-toggle-switch .cdx-toggle-switch__label.cdx-label .cdx-label__label__text{font-weight:400}
.cdx-toggle-switch__switch{transform:translateZ(0);background-color:var(--background-color-interactive-subtle,#f8f9fa);display:inline-block;flex-shrink:0;position:relative;box-sizing:border-box;min-width:48px;min-height:32px;width:3rem;height:2rem;border-width:1px;border-style:solid;border-color:var(--border-color-interactive,#72777d);border-radius:9999px;overflow:hidden;transition-property:background-color,color,border-color,box-shadow;transition-duration:.25s}
.cdx-toggle-switch__switch:before{content:"";display:block;position:absolute;top:1px;right:1px;bottom:1px;left:1px;z-index:1;border:1px solid var(--border-color-transparent,transparent);border-radius:9999px;transition-property:background-color,color,border-color,box-shadow;transition-duration:.25s}
.cdx-toggle-switch__switch__grip{position:absolute;top:50%;box-sizing:border-box;min-width:20px;min-height:20px;width:1.25rem;height:1.25rem;border:1px solid var(--border-color-interactive,#72777d);border-radius:50%;transform:translate(.3125rem) translateY(-50%);transition-property:background-color,border-color,transform;transition-duration:.25s,.1s,.1s}
.cdx-toggle-switch__input{opacity:0;position:absolute;right:0;z-index:2;min-width:48px;min-height:32px;width:3rem;height:2rem;margin:0;font-size:inherit}
.cdx-toggle-switch__input:checked~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip{background-color:var(--background-color-base,#fff);border-color:var(--border-color-inverted,#fff);transform:translate(calc(100% + .0625rem)) translateY(-50%)}
.cdx-toggle-switch__input:enabled:hover,.cdx-toggle-switch__input:enabled~.cdx-label .cdx-label__label:hover,.cdx-toggle-switch__input:enabled~.cdx-toggle-switch__label:not(.cdx-label):hover{cursor:pointer}
.cdx-toggle-switch__input:enabled~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip{background-color:var(--background-color-base-fixed,#fff)}
.cdx-toggle-switch__input:enabled:hover~.cdx-toggle-switch__switch{background-color:var(--background-color-base,#fff);border-color:var(--border-color-progressive--hover,#4b77d6)}
.cdx-toggle-switch__input:enabled:hover~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip{background-color:var(--background-color-base-fixed,#fff);border-color:var(--border-color-progressive--hover,#4b77d6)}
.cdx-toggle-switch__input:enabled:active~.cdx-toggle-switch__switch{background-color:var(--background-color-progressive--active,#233566);border-color:var(--border-color-progressive--active,#233566)}
.cdx-toggle-switch__input:enabled:active~.cdx-toggle-switch__switch:before{border-color:var(--border-color-progressive--active,#233566)}
.cdx-toggle-switch__input:enabled:active~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip{border-color:var(--border-color-inverted,#fff)}
.cdx-toggle-switch__input:enabled:focus:not(:active)~.cdx-toggle-switch__switch{border-color:var(--border-color-progressive,#36c);box-shadow:inset 0 0 0 1px var(--box-shadow-color-progressive--focus,#36c);outline:1px solid transparent}
.cdx-toggle-switch__input:enabled:focus:not(:active)~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip{border-color:var(--border-color-progressive,#36c)}
.cdx-toggle-switch__input:enabled:checked~.cdx-toggle-switch__switch{background-color:var(--background-color-input-binary--checked,#36c);border-color:var(--border-color-progressive,#36c)}
.cdx-toggle-switch__input:enabled:checked~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip{border-color:var(--background-color-base,#fff)}
.cdx-toggle-switch__input:enabled:checked:hover~.cdx-toggle-switch__switch{background-color:var(--background-color-progressive--hover,#4b77d6);border-color:var(--border-color-progressive--hover,#4b77d6)}
.cdx-toggle-switch__input:enabled:checked:active~.cdx-toggle-switch__switch{background-color:var(--background-color-progressive--active,#233566);border-color:var(--border-color-progressive--active,#233566);box-shadow:inset 0 0 0 1px var(--box-shadow-color-progressive--active,#233566)}
.cdx-toggle-switch__input:enabled:checked:active~.cdx-toggle-switch__switch:before{border-color:var(--border-color-progressive--active,#233566)}
.cdx-toggle-switch__input:enabled:checked:active~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip{background-color:var(--background-color-base-fixed,#fff);border-color:var(--border-color-inverted,#fff)}
.cdx-toggle-switch__input:enabled:checked:focus:not(:active)~.cdx-toggle-switch__switch{border-color:var(--border-color-progressive,#36c)}
.cdx-toggle-switch__input:enabled:checked:focus:not(:active)~.cdx-toggle-switch__switch:before,.cdx-toggle-switch__input:enabled:checked:focus:not(:active)~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip{border-color:var(--border-color-inverted,#fff)}
.cdx-toggle-switch__input:disabled{cursor:default}
.cdx-toggle-switch__input:disabled~.cdx-toggle-switch__switch{background-color:var(--background-color-disabled,#c8ccd1);border-color:var(--border-color-disabled,#c8ccd1)}
.cdx-toggle-switch__input:disabled~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip{border-color:var(--border-color-inverted,#fff);box-shadow:inset 0 0 0 1px var(--box-shadow-color-inverted,#fff)}
.cdx-toggle-switch__input:disabled:checked~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip{background-color:var(--background-color-base,#fff)}
.cdx-typeahead-search__menu.cdx-menu{border-top-left-radius:0;border-top-right-radius:0}
.cdx-typeahead-search .cdx-menu-item{padding:0}
.cdx-typeahead-search .cdx-menu-item__content{padding:8px 12px}
.cdx-typeahead-search__search-footer.cdx-menu-item{box-sizing:border-box;min-height:56px}
.cdx-typeahead-search__search-footer.cdx-menu-item:visited{color:var(--color-base,#202122)}
.cdx-typeahead-search__search-footer.cdx-menu-item:hover{text-decoration:none;cursor:pointer}
.cdx-typeahead-search__search-footer__active.cdx-menu-item .cdx-typeahead-search__search-footer__icon.cdx-icon,.cdx-typeahead-search__search-footer__active.cdx-menu-item .cdx-typeahead-search__search-footer__text{color:var(--color-progressive,#36c)}
.cdx-typeahead-search .cdx-menu-item:first-child .cdx-typeahead-search__search-footer{border-top:unset}


.citizen-notifications__footer{display:flex;justify-content:space-between;align-items:center;gap:var(--space-sm);flex-shrink:0;padding:var(--space-xs) var(--space-md);border-top:var(--border-subtle)}
.citizen-notifications__footer .citizen-notifications__see-all{display:flex;justify-content:center;align-items:center;gap:var(--space-xs);margin:0;padding:0 11px;font-size:1rem;text-align:center;border-top:0;color:var(--color-base);text-decoration:none}
.citizen-notifications__footer .citizen-notifications__see-all:hover{background-color:var(--background-color-interactive-subtle--hover)!important}
.citizen-notifications__footer .citizen-notifications__see-all>span{font-size:1rem}
.citizen-notifications__footer .citizen-notifications__prefs{display:flex;justify-content:center;align-items:center;margin:0;padding:0}
.citizen-notifications__footer .citizen-notifications__prefs>span{font-size:var(--font-size-small)}
@media (min-width:1120px){
body .citizen-notifications-dropdown #citizen-notifications-dropdown__card{
	transition-property: max-height, clip-path, transform, content-visibility;
}
body.citizen-sticky-header-visible .citizen-notifications-dropdown #citizen-notifications-dropdown__card,
body.citizen-sticky-header-visible .citizen-notifications-dropdown .citizen-notifications__panel,
body.citizen-sticky-header-visible .citizen-notifications-dropdown .citizen-notifications__skeleton,
body.citizen-sticky-header-visible .citizen-notifications-dropdown .citizen-notifications__placeholder{
	max-height:calc(var(--header-card-maxheight) - var(--height-sticky-header))!important;
}
}
.citizen-notifications .citizen-notifications__header .cdx-icon--medium,
.citizen-notifications .citizen-notifications__footer .cdx-icon--medium,
.citizen-userMenu .citizen-menu__content-list .cdx-icon--medium,
.citizen-userMenu .citizen-menu__content-list .cdx-icon--medium>svg{width:20px!important;height:20px!important;min-width:20px!important;min-height:20px!important;padding:0!important;margin:0!important}
.citizen-notifications .citizen-notifications__header .cdx-icon--medium>svg,
.citizen-notifications .citizen-notifications__footer .cdx-icon--medium>svg{width:20px!important;height:20px!important;min-width:20px!important;min-height:20px!important}
.citizen-userMenu .citizen-userInfo-stats-item-value{font-size:1rem!important;line-height:1.625rem!important}
.citizen-userMenu .citizen-userInfo-title a,
.citizen-userMenu .citizen-userInfo-title > div{
	font-size:1.125rem!important;font-weight:var(--font-weight-semi-bold)!important;
	line-height:1.625rem;color:var(--color-emphasized);padding-block:var(--space-xxs);
	padding-left:0!important;margin-left:0!important}
.citizen-userMenu .citizen-userInfo-title .citizen-keyboard-hint-key{display:none!important}
.citizen-userMenu #p-personal #pt-logout a{
	color:var(--color-inverted-fixed,#fff)!important;
	background-color:var(--background-color-destructive,#b32424)!important;
	border:var(--border-width-base,1px) solid var(--border-color-base)!important;
	border-radius:var(--border-radius-medium,4px)!important;
	margin:var(--space-xs)!important;
}
.citizen-userMenu #p-personal #pt-logout a span,
.citizen-userMenu #p-personal #pt-logout a .citizen-ui-icon{color:var(--color-inverted-fixed,#fff)!important}
.citizen-userMenu #p-personal #pt-logout a:hover{background-color:var(--background-color-destructive--hover,#8b1a1a)!important}
.citizen-userMenu #p-personal #pt-logout a:active{background-color:var(--background-color-destructive--active,#6b1414)!important}
.citizen-userMenu #p-personal #pt-logout .citizen-keyboard-hint-key,
.citizen-userMenu #p-personal #pt-logout .citizen-keyboard-hint-keys{display:none!important}
.citizen-notifications__panel a,
.citizen-notifications__footer a,
.citizen-notifications-dropdown__card a,
.citizen-notifications__panel a:hover,
.citizen-notifications__footer a:hover,
.citizen-notifications-dropdown__card a:hover{text-decoration:none}
.citizen-notifications .citizen-notifications__header .citizen-notifications__title{font-size:1rem;padding:0;border:0}
.citizen-notifications .citizen-notifications__header .citizen-notifications__mark-all{color:oklch(60% 0.05 var(--color-primary-oklch__h));padding:1px 0}
.citizen-notifications .cdx-tabs__header{border-bottom:1px solid var(--border-color-base);margin:0;background-color:transparent!important}
.citizen-notifications .cdx-tabs__list{position:relative;display:flex;flex:1;overflow-x:auto;scrollbar-width:none;background-color:transparent!important}
.citizen-notifications .cdx-tabs__list::-webkit-scrollbar{display:none}
.citizen-notifications .cdx-tabs__list__item,
.citizen-notifications .cdx-tabs__list__item:hover,
.citizen-notifications .cdx-tabs__list__item[aria-selected="true"],
.citizen-notifications .cdx-tabs__list__item[aria-selected="true"]:hover{background-color:transparent!important}
.citizen-notifications .cdx-tabs__list__item{position:relative;flex:1 1 0;padding:var(--space-xs) var(--space-sm);font-size:var(--font-size-small);font-weight:var(--font-weight-semi-bold);color:var(--color-base);border:0;cursor:pointer;white-space:nowrap;text-align:center;transition:color var(--transition-duration-base)}
.citizen-notifications .cdx-tabs__list__item[aria-selected="true"]{color:var(--color-progressive)}
.citizen-notifications .cdx-tabs__list__item:not([aria-selected="true"]):hover{color:var(--color-progressive--hover)}
.citizen-notifications .cdx-tabs__indicator{position:absolute;inset-block-end:-1px;inset-inline-start:0;height:2px;width:0;background-color:var(--color-progressive);border-radius:var(--border-radius-base);transition:left var(--transition-duration-medium) ease,width var(--transition-duration-medium) ease;pointer-events:none}
.citizen-notifications .cdx-tabs__content{position:relative;flex:1;min-height:0;overflow:hidden}
.citizen-notifications .cdx-tabs__track{display:flex;width:300%;height:auto;align-items:stretch;transition:transform var(--transition-duration-medium) ease,height var(--transition-duration-medium) ease;will-change:transform}
.citizen-notifications .cdx-tab{flex:0 0 33.3333%;width:33.3333%;min-width:33.3333%;display:flex;flex-direction:column;min-height:0;overflow:hidden}
.citizen-notifications .cdx-tab .citizen-notifications__list{display:flex;flex:1;flex-direction:column;min-height:0;overflow-y:auto;overscroll-behavior:contain}
.citizen-notifications .cdx-tabs__track .citizen-notifications__item{transition:opacity 240ms ease}
.citizen-notifications .cdx-tabs__track--switching .citizen-notifications__item{opacity:0}
.citizen-notifications__panel .citizen-notifications__item{flex-shrink:0;position:relative;display:grid;grid-template-columns:auto 1fr;column-gap:var(--space-sm);padding:var(--space-sm) var(--space-md);cursor:pointer;max-height:240px;overflow:hidden;transition:opacity 200ms ease,max-height 300ms ease,padding 300ms ease,margin 300ms ease,border-color 300ms ease,background-color var(--transition-duration-base)}
.citizen-notifications__panel .citizen-notifications__item+.citizen-notifications__item{border-top:var(--border-subtle)}
.citizen-notifications__panel .citizen-notifications__item--filtered-out{opacity:0;max-height:0;padding-block:0;margin-block:0;border-color:transparent;pointer-events:none}
.citizen-notifications__panel .citizen-notifications__item:hover{background-color:var(--color-surface-1--hover)}
.citizen-notifications__panel .citizen-notifications__item--read{background-color:var(--color-surface-1)}
.citizen-notifications__panel .citizen-notifications__item--read:hover{background-color:var(--color-surface-1--hover)}
.citizen-notifications__panel .citizen-notifications__item--read .citizen-notifications__item-header{color:var(--color-subtle)}
.citizen-notifications__panel .citizen-notifications__item-primary{position:absolute;inset:0}
.citizen-notifications__panel .citizen-notifications__item-primary::after{position:absolute;inset:0;z-index:1;content:""}
.citizen-notifications__panel .citizen-notifications__item-primary:focus-visible::after{outline:1px solid transparent;box-shadow:inset 0 0 0 2px var(--outline-color-progressive--focus)}
.citizen-notifications__panel .citizen-notifications__item-header a,
.citizen-notifications__panel .citizen-notifications__item-body a,
.citizen-notifications__panel .citizen-notifications__item-link{position:relative;z-index:2}
.citizen-notifications__panel .citizen-notifications__item-badge{display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;margin-block-start:0.125rem;background-color:var(--color-surface-3);border-radius:var(--border-radius-circle)}
.citizen-notifications__panel .citizen-notifications__item-icon{width:1rem;height:1rem;background-color:var(--color-base);-webkit-mask-image:var(--citizen-notification-icon);mask-image:var(--citizen-notification-icon);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;-webkit-mask-size:contain;mask-size:contain}
.citizen-notifications__panel .citizen-notifications__item-content{min-width:0}
.citizen-notifications__panel .citizen-notifications__item-meta{display:flex;gap:var(--space-xs);align-items:baseline;font-size:var(--font-size-x-small);color:var(--color-subtle)}
.citizen-notifications__panel .citizen-notifications__item-category{overflow:hidden;text-overflow:ellipsis;font-weight:var(--font-weight-medium);white-space:nowrap}
.citizen-notifications__panel .citizen-notifications__item-time{flex-shrink:0;margin-inline-start:auto}
.citizen-notifications__panel .citizen-notifications__item-header{margin-block-start:var(--space-xxs);color:var(--color-base)}
.citizen-notifications__panel .citizen-notifications__item-body{display:block;margin-block-start:var(--space-xxs);color:var(--color-subtle);-webkit-line-clamp:none}
.citizen-notifications__panel .citizen-notifications__item-actions{display:flex;flex-wrap:wrap;gap:var(--space-xs);margin-block-start:var(--space-xxs);margin-inline:-11px}
html body .mw-notification-area {
	padding: var(--space-xs);
	font-size: var(--font-size-small);
	line-height: var(--line-height-small);
}
html body .mw-notification-area .mw-notification {
	padding: var(--space-sm) var(--space-md);
	color: var(--color-emphasized);
	background-color: var(--color-surface-1);
	border: solid var(--border-width-base) var(--border-color-base);
	border-radius: var(--border-radius-medium);
	box-shadow: var(--box-shadow-large);
	transition-timing-function: var(--transition-timing-function-ease-in);
	transition-duration: var(--transition-duration-base);
	transition-property: transform, opacity;
}
html body .mw-notification-area .mw-notification.mw-notification-visible {
	transition-timing-function: var(--transition-timing-function-ease-out);
	transition-duration: var(--transition-duration-medium);
}
html body .mw-notification-area .mw-notification.mw-notification-type-warn {
	background-color: var(--background-color-warning-subtle);
	border-color: inherit;
}
html body .mw-notification-area .mw-notification.mw-notification-type-error {
	background-color: var(--background-color-destructive-subtle);
	border-color: inherit;
}
html body .mw-notification-area .mw-notification.mw-notification-type-success {
	background-color: var(--background-color-success-subtle);
	border-color: inherit;
}
@layer citizen-tokens{:where(.citizen-theme-preview){color-scheme:light;--color-white:#fff;--color-black:#000;--color-gray-50:#f8f9fa;--color-gray-100:#eaecf0;--color-gray-200:#dadde3;--color-gray-300:#c8ccd1;--color-gray-400:#a2a9b1;--color-gray-500:#72777d;--color-gray-600:#54595d;--color-gray-700:#404244;--color-gray-800:#27292d;--color-gray-900:#202122;--color-gray-1000:#101418;--color-red-50:oklch(95% 0.015 10);--color-red-100:oklch(92% 0.03 10);--color-red-200:oklch(88% 0.052 10);--color-red-300:oklch(81% 0.095 10);--color-red-400:oklch(73% 0.155 10);--color-red-500:oklch(65% 0.195 10);--color-red-600:oklch(59% 0.2 10);--color-red-700:oklch(54% 0.18 10);--color-red-800:oklch(48% 0.16 10);--color-red-900:oklch(35% 0.135 10);--color-red-950:oklch(25% 0.075 10);--color-red-1000:oklch(16% 0.05 10);--color-orange-50:#ffead4;--color-orange-100:#ffdcb8;--color-orange-200:#ffc894;--color-orange-300:#ffa758;--color-orange-400:#f97f26;--color-orange-500:#d46926;--color-orange-600:#bb5c26;--color-orange-700:#a95226;--color-orange-800:#8e4424;--color-orange-900:#572c19;--color-orange-1000:oklch(16% 0.043 42);--color-yellow-50:oklch(96% 0.021 95);--color-yellow-100:oklch(92% 0.058 92);--color-yellow-200:oklch(87% 0.115 88);--color-yellow-300:oklch(80% 0.153 82);--color-yellow-400:oklch(71% 0.164 75);--color-yellow-500:oklch(62% 0.165 67);--color-yellow-600:oklch(57% 0.157 60);--color-yellow-700:oklch(53% 0.146 54);--color-yellow-800:oklch(47% 0.125 50);--color-yellow-900:oklch(33% 0.105 47);--color-yellow-950:oklch(25% 0.06 46);--color-yellow-1000:oklch(16% 0.032 46);--color-lime-50:#e3f2e4;--color-lime-100:#d1e9d2;--color-lime-200:#b9debc;--color-lime-300:#94cb9a;--color-lime-400:#5db26c;--color-lime-500:#259948;--color-lime-600:#1f893f;--color-lime-700:#1f7a39;--color-lime-800:#1f6631;--color-lime-900:#183f20;--color-lime-1000:oklch(16% 0.041 148);--color-green-50:oklch(95% 0.021 165);--color-green-100:oklch(91% 0.051 165);--color-green-200:oklch(86% 0.089 165);--color-green-300:oklch(79% 0.13 165);--color-green-400:oklch(69% 0.153 165);--color-green-500:oklch(61% 0.149 165);--color-green-600:oklch(56% 0.127 165);--color-green-700:oklch(51% 0.105 165);--color-green-800:oklch(46% 0.08599999999999999 165);--color-green-900:oklch(33% 0.073 165);--color-green-950:oklch(25% 0.05 165);--color-green-1000:oklch(16% 0.03 165);--color-blue-50:#e8eeff;--color-blue-100:#d9e2ff;--color-blue-200:#b6d4fb;--color-blue-300:#a6bbf5;--color-blue-400:#88a3e8;--color-blue-500:#6485d1;--color-blue-600:#4b77d6;--color-blue-700:#36c;--color-blue-800:#3056a9;--color-blue-900:#233566;--color-blue-1000:oklch(16% 0.052 271);--color-purple-50:#f0ecf6;--color-purple-100:#e6e0f0;--color-purple-200:#d9d0e9;--color-purple-300:#c5b9dd;--color-purple-400:#a799cd;--color-purple-500:#8d7ebd;--color-purple-600:#7a6db7;--color-purple-700:#6a60b0;--color-purple-800:#534fa3;--color-purple-900:#353262;--color-purple-1000:oklch(16% 0.05 288);--color-pink-50:#f5ebf2;--color-pink-100:#eedeea;--color-pink-200:#e6cede;--color-pink-300:#d9b4cd;--color-pink-400:#c690b4;--color-pink-500:#b5739e;--color-pink-600:#ac5c90;--color-pink-700:#9b527f;--color-pink-800:#82456a;--color-pink-900:#4e2c40;--color-pink-1000:oklch(16% 0.034 347);--color-maroon-50:#f6ebeb;--color-maroon-100:#f0dedd;--color-maroon-200:#e8cecd;--color-maroon-300:#dcb5b3;--color-maroon-400:#c99391;--color-maroon-500:#b57775;--color-maroon-600:#ac6262;--color-maroon-700:#9f5555;--color-maroon-800:#854848;--color-maroon-900:#512e2e;--color-maroon-1000:oklch(16% 0.03 23);--color-primary-oklch__h:262.29;--color-neutral-oklch__h:var(--color-primary-oklch__h);--color-primary-50:oklch(95% 0.024 var(--color-primary-oklch__h));--color-primary-100:oklch(92% 0.04 var(--color-primary-oklch__h));--color-primary-200:oklch(86% 0.06 var(--color-primary-oklch__h));--color-primary-300:oklch(80% 0.08500000000000001 var(--color-primary-oklch__h));--color-primary-400:oklch(72% 0.108 var(--color-primary-oklch__h));--color-primary-500:oklch(62% 0.13 var(--color-primary-oklch__h));--color-primary-600:oklch(58% 0.152 var(--color-primary-oklch__h));--color-primary-700:oklch(53% 0.17 var(--color-primary-oklch__h));--color-primary-800:oklch(47% 0.15 var(--color-primary-oklch__h));--color-primary-900:oklch(34% 0.105 var(--color-primary-oklch__h));--color-primary-1000:oklch(16% 0.05 var(--color-primary-oklch__h));--color-neutral-50:oklch(98% 0.005 var(--color-neutral-oklch__h));--color-neutral-100:oklch(94% 0.012 var(--color-neutral-oklch__h));--color-neutral-200:oklch(90% 0.02 var(--color-neutral-oklch__h));--color-neutral-300:oklch(84% 0.028 var(--color-neutral-oklch__h));--color-neutral-400:oklch(73% 0.035 var(--color-neutral-oklch__h));--color-neutral-500:oklch(51% 0.04 var(--color-neutral-oklch__h));--color-neutral-600:oklch(39% 0.035 var(--color-neutral-oklch__h));--color-neutral-700:oklch(30% 0.028 var(--color-neutral-oklch__h));--color-neutral-800:oklch(22% 0.02 var(--color-neutral-oklch__h));--color-neutral-900:oklch(17% 0.012 var(--color-neutral-oklch__h));--color-neutral-1000:oklch(11% 0.01 var(--color-neutral-oklch__h));--background-color-base:light-dark(var(--color-white),var(--color-neutral-1000));--background-color-base-fixed:var(--color-white);--background-color-neutral:light-dark(var(--color-neutral-100),var(--color-neutral-800));--background-color-neutral-subtle:light-dark(var(--color-neutral-50),var(--color-neutral-900));--background-color-interactive:light-dark(var(--color-neutral-100),var(--color-neutral-800));--background-color-interactive--hover:light-dark(var(--color-neutral-200),var(--color-neutral-700));--background-color-interactive--active:light-dark(var(--color-neutral-300),var(--color-neutral-600));--background-color-interactive-subtle:light-dark(var(--color-neutral-50),var(--color-neutral-900));--background-color-interactive-subtle--hover:light-dark(var(--color-neutral-100),var(--color-neutral-800));--background-color-interactive-subtle--active:light-dark(var(--color-neutral-200),var(--color-neutral-700));--background-color-disabled:light-dark(var(--color-neutral-200),var(--color-neutral-700));--background-color-disabled-subtle:light-dark(var(--color-neutral-100),var(--color-neutral-800));--background-color-notice-subtle:light-dark(var(--color-neutral-100),var(--color-neutral-800));--background-color-inverted:light-dark(var(--color-neutral-1000),var(--color-neutral-50));--background-color-icon:light-dark(rgba(0,0,0,var(--opacity-icon-base)),rgba(255,255,255,var(--opacity-icon-base)));--background-color-icon--hover:light-dark(rgba(0,0,0,var(--opacity-icon-base--hover)),rgba(255,255,255,var(--opacity-icon-base--hover)));--background-color-icon--active:light-dark(rgba(0,0,0,var(--opacity-icon-base--active)),rgba(255,255,255,var(--opacity-icon-base--active)));--background-color-progressive:var(--color-primary-700);--background-color-progressive--hover:var(--color-primary-800);--background-color-progressive--active:var(--color-primary-900);--background-color-progressive--focus:light-dark(var(--color-primary-700),var(--color-primary-500));--background-color-destructive:var(--color-red-700);--background-color-destructive--hover:var(--color-red-800);--background-color-destructive--active:var(--color-red-900);--background-color-destructive--focus:light-dark(var(--color-primary-700),var(--color-primary-500));--background-color-error:var(--color-red-500);--background-color-error--hover:var(--color-red-600);--background-color-error--active:var(--color-red-700);--background-color-progressive-subtle:light-dark(var(--color-primary-50),var(--color-primary-1000));--background-color-progressive-subtle--hover:light-dark(var(--color-primary-100),var(--color-primary-900));--background-color-progressive-subtle--active:light-dark(var(--color-primary-200),var(--color-primary-800));--background-color-destructive-subtle:light-dark(var(--color-red-50),var(--color-red-1000));--background-color-destructive-subtle--hover:light-dark(var(--color-red-100),var(--color-red-900));--background-color-destructive-subtle--active:light-dark(var(--color-red-200),var(--color-red-800));--background-color-error-subtle:light-dark(var(--color-red-50),var(--color-red-1000));--background-color-error-subtle--hover:light-dark(var(--color-red-100),var(--color-red-900));--background-color-error-subtle--active:light-dark(var(--color-red-200),var(--color-red-800));--background-color-warning-subtle:light-dark(var(--color-yellow-50),var(--color-yellow-1000));--background-color-success-subtle:light-dark(var(--color-green-50),var(--color-green-1000));--background-color-content-added:var(--background-color-success-subtle);--background-color-content-removed:var(--background-color-destructive-subtle);--background-color-target-text:light-dark(var(--color-orange-50),var(--color-orange-900));--background-color-button-quiet--hover:light-dark(rgba(0,24,73,0.027),rgba(255,255,255,0.04));--background-color-button-quiet--active:light-dark(rgba(0,24,73,0.082),rgba(255,255,255,0.08));--background-color-backdrop-light:light-dark(color-mix(in oklch,var(--color-neutral-50) calc(var(--backdrop-opacity) * 100%),transparent),color-mix(in oklch,var(--color-neutral-1000) calc(var(--backdrop-opacity) * 100%),transparent));--background-color-backdrop-dark:rgba(0,0,0,var(--backdrop-opacity));--background-color-transparent:transparent;--background-color-input-binary--checked:var(--color-progressive);--background-color-tab-list-item-framed--hover:rgba(255,255,255,0.3);--background-color-tab-list-item-framed--active:rgba(255,255,255,0.65);--border-color-base:light-dark(var(--color-gray-200),var(--color-gray-800));--border-color-emphasized:light-dark(var(--color-gray-900),var(--color-gray-100));--border-color-subtle:light-dark(var(--color-gray-100),var(--color-gray-900));--border-color-muted:light-dark(var(--color-gray-50),var(--color-gray-1000));--border-color-interactive:light-dark(var(--color-gray-300),var(--color-gray-700));--border-color-interactive--hover:light-dark(var(--color-gray-400),var(--color-gray-600));--border-color-interactive--active:light-dark(var(--color-gray-500),var(--color-gray-500));--border-color-disabled:light-dark(var(--color-gray-100),var(--color-gray-900));--border-color-divider:light-dark(var(--color-gray-200),var(--color-gray-800));--border-color-inverted:light-dark(var(--color-white),var(--color-gray-1000));--border-color-inverted-fixed:var(--color-white);--border-color-progressive:light-dark(var(--color-primary-700),var(--color-primary-500));--border-color-progressive--hover:light-dark(var(--color-primary-800),var(--color-primary-400));--border-color-progressive--active:light-dark(var(--color-primary-900),var(--color-primary-300));--border-color-progressive--focus:light-dark(var(--color-primary-700),var(--color-primary-500));--border-color-error:light-dark(var(--color-red-100),var(--color-red-950));--border-color-error--hover:light-dark(var(--color-red-200),var(--color-red-900));--border-color-error--active:light-dark(var(--color-red-300),var(--color-red-800));--border-color-warning:light-dark(var(--color-yellow-100),var(--color-yellow-950));--border-color-warning--hover:light-dark(var(--color-yellow-200),var(--color-yellow-900));--border-color-warning--active:light-dark(var(--color-yellow-300),var(--color-yellow-800));--border-color-success:light-dark(var(--color-green-100),var(--color-green-950));--border-color-destructive:light-dark(var(--color-red-100),var(--color-red-950));--border-color-destructive--hover:light-dark(var(--color-red-200),var(--color-red-900));--border-color-destructive--active:light-dark(var(--color-red-300),var(--color-red-800));--border-color-destructive--focus:light-dark(var(--color-primary-700),var(--color-primary-500));--border-color-content-added:var(--color-green-500);--border-color-content-removed:var(--color-red-500);--border-color-notice:var(--color-neutral-500);--border-color-transparent:transparent;--border-color-input--hover:var(--border-color-interactive);--border-color-input-binary:var(--border-color-interactive);--border-color-input-binary--hover:var(--border-color-progressive--hover);--border-color-input-binary--active:var(--border-color-progressive--active);--border-color-input-binary--focus:var(--border-color-progressive--focus);--border-color-input-binary--checked:var(--border-color-progressive);--color-base:light-dark(var(--color-neutral-900),var(--color-neutral-300));--color-base--hover:light-dark(var(--color-neutral-700),var(--color-neutral-200));--color-base--subtle:light-dark(var(--color-neutral-600),var(--color-neutral-400));--color-base-fixed:var(--color-gray-900);--color-emphasized:light-dark(var(--color-neutral-1000),var(--color-neutral-50));--color-subtle:light-dark(var(--color-neutral-600),var(--color-neutral-400));--color-placeholder:light-dark(var(--color-neutral-500),var(--color-neutral-500));--color-disabled:light-dark(var(--color-neutral-400),var(--color-neutral-600));--color-disabled-emphasized:light-dark(var(--color-neutral-400),var(--color-neutral-500));--color-neutral:light-dark(var(--color-neutral-700),var(--color-neutral-300));--color-notice:light-dark(var(--color-neutral-700),var(--color-neutral-400));--color-inverted:light-dark(var(--color-white),var(--color-neutral-1000));--color-inverted-fixed:var(--color-white);--color-inverted-primary:var(--color-white);--color-progressive:light-dark(var(--color-primary-700),var(--color-primary-400));--color-progressive--hover:light-dark(var(--color-primary-800),var(--color-primary-300));--color-progressive--active:light-dark(var(--color-primary-900),var(--color-primary-200));--color-progressive--focus:var(--color-primary-700);--color-destructive:light-dark(var(--color-red-700),var(--color-red-400));--color-destructive--hover:light-dark(var(--color-red-800),var(--color-red-300));--color-destructive--active:light-dark(var(--color-red-900),var(--color-red-200));--color-destructive--focus:var(--color-progressive--focus);--color-error:var(--color-destructive);--color-error--hover:var(--color-destructive--hover);--color-error--active:var(--color-destructive--active);--color-warning:light-dark(var(--color-yellow-700),var(--color-yellow-400));--color-success:light-dark(var(--color-green-700),var(--color-green-400));--color-visited:var(--color-progressive);--color-visited--hover:var(--color-progressive--hover);--color-visited--active:var(--color-progressive--active);--color-destructive--visited:var(--color-destructive);--color-destructive--visited--hover:var(--color-destructive--hover);--color-destructive--visited--active:var(--color-destructive--active);--color-content-added:var(--color-success);--color-content-removed:var(--color-destructive);--color-link:var(--color-progressive);--color-link--hover:var(--color-progressive--hover);--color-link--active:var(--color-progressive--active);--color-link--focus:var(--color-progressive--focus);--color-link--visited:var(--color-visited);--color-link--visited--hover:var(--color-visited--hover);--color-link--visited--active:var(--color-visited--active);--color-link-red:var(--color-destructive);--color-link-red--hover:var(--color-destructive--hover);--color-link-red--active:var(--color-destructive--active);--color-link-red--focus:var(--color-destructive--focus);--color-link-red--visited:var(--color-destructive--visited);--color-link-red--visited--hover:var(--color-destructive--visited--hover);--color-link-red--visited--active:var(--color-destructive--visited--active);--color-icon-progressive:light-dark(var(--color-primary-700),var(--color-primary-500));--color-icon-error:var(--color-red-500);--color-icon-warning:var(--color-yellow-500);--color-icon-success:var(--color-green-500);--color-icon-notice:var(--color-neutral-500);--box-shadow-color-base:var(--box-shadow-color-alpha-base);--box-shadow-color-alpha-base:light-dark(oklch(12% 0.01 var(--color-primary-oklch__h) / var(--shadow-opacity)),oklch(6% 0.01 var(--color-primary-oklch__h) / var(--shadow-opacity)));--box-shadow-color-progressive--active:var(--color-progressive--active);--box-shadow-color-progressive--focus:var(--color-progressive);--box-shadow-color-progressive-selected:var(--color-progressive);--box-shadow-color-progressive-selected--hover:var(--color-progressive--hover);--box-shadow-color-progressive-selected--active:var(--color-progressive--active);--box-shadow-color-destructive--focus:var(--color-progressive);--box-shadow-color-inverted:var(--color-white);--box-shadow-color-transparent:transparent;--color-surface-0:light-dark(var(--color-white),var(--color-neutral-1000));--color-surface-1:light-dark(var(--color-neutral-50),var(--color-neutral-900));--color-surface-1--hover:light-dark(var(--color-neutral-100),var(--color-neutral-800));--color-surface-1--active:light-dark(var(--color-neutral-200),var(--color-neutral-700));--color-surface-2:light-dark(var(--color-neutral-100),var(--color-neutral-800));--color-surface-2--hover:light-dark(var(--color-neutral-200),var(--color-neutral-700));--color-surface-2--active:light-dark(var(--color-neutral-300),var(--color-neutral-600));--color-surface-3:light-dark(var(--color-neutral-200),var(--color-neutral-700));--color-surface-4:light-dark(var(--color-neutral-300),var(--color-neutral-600));--color-syntax-red:light-dark(#e53935,#f07178);--color-syntax-orange:light-dark(#f76d47,#f78c6c);--color-syntax-yellow:light-dark(#e2931d,#ffcb6b);--color-syntax-green:light-dark(#91b859,#c3e88d);--color-syntax-cyan:light-dark(#39adb5,#89ddff);--color-syntax-blue:light-dark(#6182b8,#82aaff);--color-syntax-paleblue:light-dark(#8796b0,#b2ccd6);--color-syntax-purple:light-dark(#9c3eda,#c792ea);--color-syntax-brown:light-dark(#916b53,#916b53);--color-syntax-pink:light-dark(#ff5370,#ff9cac);--color-syntax-violet:light-dark(#945eb8,#bb80b3);--color-syntax-gray:light-dark(#90a4ae,#676E95);--color-syntax-grey:var(--color-syntax-gray);--opacity-icon-base:0.6;--opacity-icon-base--hover:0.74;--opacity-icon-base--active:0.87;--opacity-icon-base--selected:1;--opacity-icon-base--disabled:0.51;--opacity-icon-placeholder:0.51;--opacity-icon-subtle:0.67;--opacity-glass:0.9;--backdrop-opacity:0.65;--shadow-opacity:0.03;--font-size-x-small:0.75rem;--font-size-small:0.875rem;--font-size-medium:1rem;--font-size-large:1.125rem;--font-size-x-large:1.25rem;--font-size-xx-large:1.5rem;--font-size-xxx-large:1.75rem;--line-height-x-small:1.25rem;--line-height-small:1.375rem;--line-height-medium:1.625rem;--line-height-large:1.75rem;--line-height-x-large:1.875rem;--line-height-xx-large:2.125rem;--line-height-xxx-large:2.375rem;--line-height-content:1.625;--font-grade:25;--outline-color-progressive--focus:light-dark(var(--color-primary-700),var(--color-primary-500));--mix-blend-mode-base:normal;--mix-blend-mode-blend:multiply;--accent-color-base:var(--color-progressive);--filter-invert-icon:0;--filter-invert-primary-button-icon:1;--filter-invert:none;--filter-invert-primary:invert(1) hue-rotate(180deg);--backdrop-filter-blur:blur(2px);--backdrop-filter-frosted-glass:blur(8px) saturate(140%);--color-progressive-oklch__h:var(--color-primary-oklch__h);--color-progressive-hsl__h:220;--color-progressive-hsl__s:60%;--color-progressive-hsl__l:50%;--color-primary-oklch__h:var(--citizen-preview-color-primary-oklch__h,262.29);--color-neutral-oklch__h:var(--citizen-preview-color-neutral-oklch__h,var(--color-primary-oklch__h));--color-progressive-oklch__h:var(--citizen-preview-color-progressive-oklch__h,var(--color-primary-oklch__h));--color-progressive-hsl__h:var(--citizen-preview-color-progressive-hsl__h,220);--color-progressive-hsl__s:var(--citizen-preview-color-progressive-hsl__s,60%);--color-progressive-hsl__l:var(--citizen-preview-color-progressive-hsl__l,50%)}}.citizen-preferences{display:flex;flex-direction:column;gap:var(--space-sm);min-width:20rem;padding-block:var(--space-md)}.citizen-preferences-section{margin-inline:var(--space-md)}.citizen-preferences-section__heading{margin-bottom:var(--space-sm);color:var(--color-subtle);font-family:var(--font-family-overline);font-size:var(--font-size-overline);font-weight:var(--font-weight-overline);line-height:var(--line-height-overline);text-transform:var(--text-transform-overline);letter-spacing:var(--letter-spacing-overline)}.citizen-preferences-section__content{display:flex;flex-direction:column;row-gap:var(--space-sm)}.citizen-preferences-section + .citizen-preferences-section{margin-top:var(--space-md)}.citizen-preferences-group{display:flex;margin-top:0}.citizen-preferences-group .cdx-label{padding-bottom:var(--space-xs)}.citizen-preferences-group .cdx-label__label__text{font-size:var(--font-size-small);font-weight:var(--font-weight-medium);color:var(--color-base)}.citizen-preferences-group .cdx-label__description{font-size:var(--font-size-small)}.citizen-preferences-group .cdx-field__control{width:100%}.citizen-preferences-radio{display:grid;grid-template-columns:repeat(var(--pref-columns,2),1fr);gap:var(--space-xxs)}.citizen-preferences-radio .cdx-radio,.citizen-preferences-radio .cdx-radio__wrapper,.citizen-preferences-radio .cdx-label,.citizen-preferences-radio .cdx-label__label{width:100%;min-width:0;height:100%}.citizen-preferences-radio .cdx-radio{margin-bottom:0}.citizen-preferences-radio .cdx-radio__icon{display:none}.citizen-preferences-radio .cdx-radio__wrapper{gap:0}.citizen-preferences-radio .cdx-label{padding:0}.citizen-preferences-card{display:flex;flex-direction:column;height:100%;overflow:hidden;cursor:pointer;border:var(--border-width-thick) solid var(--border-color-base);border-radius:var(--border-radius-medium);transition-duration:var(--transition-duration-base);transition-property:border-color,background-color}.cdx-radio:has(.cdx-radio__input:checked) .citizen-preferences-card{background-color:var(--background-color-progressive-subtle);border-color:var(--color-progressive)}.cdx-radio:has(.cdx-radio__input:focus-visible) .citizen-preferences-card{outline:2px solid var(--color-progressive);outline-offset:1px}.citizen-preferences-card__label{padding:var(--space-xxs) var(--space-xs);font-size:var(--font-size-small);color:var(--color-subtle);text-align:center}.cdx-radio:has(.cdx-radio__input:checked) .citizen-preferences-card__label{font-weight:var(--font-weight-semi-bold);color:var(--color-progressive)}.citizen-preferences-card__preview{display:flex;align-items:center;justify-content:center;width:100%;aspect-ratio:1.5;padding:var(--space-xs);color:var(--color-base);background-color:var(--color-surface-0);border-bottom:var(--border-subtle)}.citizen-preferences-card__preview .cdx-icon{width:2rem;height:2rem;color:inherit}@property --citizen-themepicker-ambient-border{syntax:'<color>';inherits:true;initial-value:transparent}@property --citizen-themepicker-ambient-border-hover{syntax:'<color>';inherits:true;initial-value:transparent}@property --citizen-themepicker-ambient-border-active{syntax:'<color>';inherits:true;initial-value:transparent}@property --citizen-themepicker-ambient-accent{syntax:'<color>';inherits:true;initial-value:transparent}.citizen-preferences-themepicker__grid{--citizen-themepicker-ambient-border:var(--border-color-interactive);--citizen-themepicker-ambient-border-hover:var(--border-color-interactive--hover);--citizen-themepicker-ambient-border-active:var(--border-color-interactive--active);--citizen-themepicker-ambient-accent:var(--color-progressive);display:flex;flex-wrap:wrap;gap:var(--space-sm)}.citizen-preferences-themepicker .cdx-radio__icon{display:none}.citizen-preferences-themepicker .cdx-radio,.citizen-preferences-themepicker .cdx-radio *{cursor:pointer}.citizen-preferences-themepicker .cdx-radio:has(.cdx-radio__input:checked),.citizen-preferences-themepicker .cdx-radio:has(.cdx-radio__input:checked) *{cursor:default}.citizen-preferences-themepicker .cdx-radio{margin-bottom:0}.citizen-preferences-themepicker .cdx-radio__wrapper{gap:0}.citizen-preferences-themepicker .cdx-label{padding:0}.citizen-preferences-themepicker__srlabel{position:absolute;width:1px;height:1px;overflow:hidden;white-space:nowrap;clip-path:inset(50%)}.citizen-preferences-themepicker__readout{min-height:1.25em;margin-top:var(--space-sm);font-size:var(--font-size-small);color:var(--color-subtle)}.citizen-preferences-themecircle{display:block;width:44px;height:44px;outline:2px solid transparent;outline-offset:2px;background:conic-gradient(from 0deg,var(--color-surface-0) 0 50%,var(--color-progressive) 50% 100%);border-radius:var(--border-radius-circle);box-shadow:inset 0 0 0 1px var(--citizen-themepicker-ambient-border);transition-duration:var(--transition-duration-base);transition-property:outline-color,border-radius}.citizen-preferences-themecircle--adaptive{background:conic-gradient(from -45deg,var(--color-white) 0 50%,var(--color-neutral-1000) 50% 100%)}.cdx-radio:hover .citizen-preferences-themecircle{outline-color:var(--citizen-themepicker-ambient-border-hover);border-radius:var(--border-radius-large)}.cdx-radio:active .citizen-preferences-themecircle{outline-color:var(--citizen-themepicker-ambient-border-active);border-radius:var(--border-radius-large)}.cdx-radio:has(.cdx-radio__input:checked) .citizen-preferences-themecircle,.cdx-radio:has(.cdx-radio__input:focus-visible) .citizen-preferences-themecircle{outline-color:var(--citizen-themepicker-ambient-accent);border-radius:var(--border-radius-large)}.citizen-command-palette-overlay{position:fixed;inset:0;z-index:999;display:block}.citizen-echo-notification-badge .citizen-ui-icon{display:block;width:1.25rem;height:1.25rem}.citizen-echo-notification-badge .citizen-ui-icon::before{display:block;width:100%;height:100%;content:"";background-color:currentcolor;mask-repeat:no-repeat;mask-position:center;mask-size:contain;background-image:none!important}.citizen-notifications-dropdown{display:inline-flex;align-items:center}.citizen-notifications-dropdown__card{min-width:320px;max-width:400px;max-height:60vh;overflow-y:auto}.citizen-notifications-all:hover{text-decoration:underline}.citizen-notifications-loading,.citizen-notifications-empty,.citizen-notifications-item:last-child{border-bottom:0}.citizen-notifications-item:hover{background-color:var(--background-color-interactive-subtle--hover)}.citizen-notifications-item-icon .citizen-ui-icon{width:1.25rem;height:1.25rem}.citizen-notifications-dropdown{display:inline-flex}.citizen-notifications{display:flex;flex-direction:column;height:auto;min-height:0;overflow:hidden;transition-timing-function:var(--transition-timing-function-ease-out);transition-duration:var(--transition-duration-medium);transition-property:height}
.mw-ui-icon-wikimedia-eye:before{-webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cg fill='%23000'%3E%3Cpath d='M10 14.5a4.5 4.5 0 1 1 4.5-4.5 4.5 4.5 0 0 1-4.5 4.5M10 3C3 3 0 10 0 10s3 7 10 7 10-7 10-7-3-7-10-7'/%3E%3Ccircle cx='10' cy='10' r='2.5'/%3E%3C/g%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cg fill='%23000'%3E%3Cpath d='M10 14.5a4.5 4.5 0 1 1 4.5-4.5 4.5 4.5 0 0 1-4.5 4.5M10 3C3 3 0 10 0 10s3 7 10 7 10-7 10-7-3-7-10-7'/%3E%3Ccircle cx='10' cy='10' r='2.5'/%3E%3C/g%3E%3C/svg%3E")}
.citizen-notifications__panel{display:flex;flex-direction:column;flex:1;min-height:0;height:auto;max-height:var(--header-card-maxheight,min(32rem,60vh))}.citizen-notifications__header{display:flex;flex-shrink:0;gap:var(--space-sm);align-items:center;justify-content:space-between;padding:var(--space-sm) var(--space-md)}.citizen-notifications__title{margin:0;font-size:var(--font-size-medium);font-weight:var(--font-weight-semi-bold)}.citizen-notifications__mark-all{color:var(--color-subtle)}.citizen-notifications__body{display:flex;flex:1;flex-direction:column;min-height:0}.citizen-notifications__list{display:flex;flex:1;flex-direction:column;margin:0;padding:0;list-style:none;overflow-y:auto;overscroll-behavior:contain}.citizen-notifications__item{display:list-item;padding:var(--space-sm) var(--space-md)}.citizen-notifications__item + .citizen-notifications__item{border-top:var(--border-subtle)}.citizen-notifications__item-content{display:flex;flex-direction:column;gap:var(--space-xs)}.citizen-notifications__item-meta{display:flex;gap:var(--space-xs);align-items:baseline;font-size:var(--font-size-small)}.citizen-notifications__item-category{color:var(--color-progressive);font-weight:var(--font-weight-medium)}.citizen-notifications__item-time{color:var(--color-subtle)}.citizen-notifications__item-header{margin-block-start:0.125rem;color:var(--color-emphasized);font-size:var(--font-size-small);line-height:var(--line-height-sm,1.5)}.citizen-notifications__item-body{margin-block-start:0.125rem;color:var(--color-subtle);font-size:var(--font-size-small);line-height:var(--line-height-sm,1.5);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.citizen-notifications__item-actions{margin-block-start:var(--space-xs);display:flex;flex-wrap:wrap;gap:var(--space-xs)}.citizen-notifications__item-link{justify-content:flex-start}.citizen-notifications__see-all{display:block;flex-shrink:0;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-small);text-align:center;border-top:var(--border-subtle);color:var(--color-progressive);text-decoration:none}.citizen-notifications__see-all:hover{text-decoration:underline;background-color:var(--background-color-interactive-subtle--hover)}.citizen-notifications__empty{padding:var(--space-lg) var(--space-md);text-align:center;color:var(--color-subtle);font-size:var(--font-size-small)}.citizen-notifications__error{padding:var(--space-md);text-align:center;color:var(--color-error);font-size:var(--font-size-small)}.citizen-notifications__error[hidden],.citizen-notifications__skeleton[hidden]{display:none}.citizen-notifications__retry{margin-block-start:var(--space-sm)}.citizen-notifications__skeleton{display:flex;flex-direction:column;height:min(20rem,60vh);max-height:var(--header-card-maxheight)}.citizen-notifications__skeleton-item{display:grid;grid-template-columns:auto 1fr;gap:var(--space-xs);column-gap:var(--space-sm);padding:var(--space-sm) var(--space-md)}.citizen-notifications__skeleton-item + .citizen-notifications__skeleton-item{border-top:var(--border-subtle)}.citizen-notifications__skeleton-line{height:var(--font-size-small);background-color:var(--background-color-neutral);background-image:linear-gradient(90deg,transparent 0%,var(--background-color-interactive--hover) 50%,transparent 100%);background-repeat:no-repeat;background-position:200% 0;background-size:200% 100%;border-radius:var(--border-radius-base);animation:citizen-notifications-placeholder-shimmer 1600ms linear infinite}.citizen-notifications__skeleton-line--title{width:70%}.citizen-notifications__skeleton-line--meta{width:40%;margin-block-start:var(--space-xs)}.cdx-tabs--quiet{display:flex;flex-direction:column;flex:1;min-height:0}.cdx-tabs__header{display:flex;flex-shrink:0;align-items:center;border-bottom:var(--border-subtle)}.cdx-tabs__list{display:flex;flex:1;overflow-x:auto;scrollbar-width:none}.cdx-tabs__list::-webkit-scrollbar{display:none}.cdx-tabs__list__item{position:relative;padding:var(--space-sm) var(--space-sm);font-size:var(--font-size-small);font-weight:var(--font-weight-semi-bold);color:var(--color-subtle);background-color:transparent;border:0;cursor:pointer;white-space:nowrap}.cdx-tabs__list__item:hover{color:var(--color-emphasized)}.cdx-tabs__list__item[aria-selected="true"]{color:var(--color-progressive)}.cdx-tabs__list__item[aria-selected="true"]::after{content:"";position:absolute;inset-inline:var(--space-xs);inset-block-end:-1px;height:2px;background-color:var(--color-progressive);border-radius:var(--border-radius-base)}.cdx-tabs__content{display:flex;flex:1;flex-direction:column;min-height:0;overflow:hidden}.cdx-tab{display:flex;flex:1;flex-direction:column;min-height:0}.cdx-tab[hidden]{display:none}
.mw-ui-icon-wikimedia-variants::before{-webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2295 206 414 348%22 fill=%22%23000%22%3E%3Cpath d=%22M478.6,456.6h-84c0.6-3,1.2-5.7,1.5-8.7h72.6v-31.5H397v-8.7h68.1v-63.6H397v-6.9h45.6v-35.4h30.3v-32.7 h-30.3v-14.4h-44.1v14.4h-30.6l-32.1,68.1h19.8v6.9h-23.1l-30,63.6h53.1v8.7h-57.2l-8.2,17.5v14h64.2c-0.6,3-1.2,6-2.1,8.7h-72.8 l-1,2.1v29.7h49.8c-12.3,8.4-30.3,15-55.5,19.2c8.7,8.1,20.1,24,24.9,33c44.4-10.8,70.5-29.1,84.9-52.2h13.8l-15.3,23.4 c24.9,7.2,60,19.8,77.1,28.5l19.8-32.1c-13.5-6-36.9-13.8-57.6-19.8h58.2L478.6,456.6L478.6,456.6z M355.6,380.4h-25.8v-9.3h25.8 V380.4z M423.7,371.1v9.3H397v-9.3H423.7z M355,310.5v-8.7h43.5v8.7H355z%22/%3E%3Cpath d=%22M264.3,266.1h80.2l20-42.4l-1.5-0.5l-6.9,1.8H216.6v41.1h31.2l-24.9,5.1c12.6,53.4,29.4,99.3,54,136.5 c-21.6,21.6-48.3,37.5-78.9,47.7c8.7,8.4,19.2,25.2,24.6,36.6c6.7-2.7,13.2-5.6,19.5-8.6l57.3-121.7 C283.6,333.5,272,301,264.3,266.1z%22/%3E%3Cpath d=%22M198,323.4c-13.5-9.9-41.1-22.8-59.7-30L117,326.7c19.2,8.7,45.9,23.1,58.2,33.6L198,323.4z%22/%3E%3Cpath d=%22M211.5,245.1c-12.6-10.8-38.4-24-56.7-31.5L132,245.7c18.9,9,43.8,24,54.9,34.8L211.5,245.1z%22/%3E%3Cpath d=%22M180,366.6c-18,35.1-40.2,71.4-55.8,93.6l35.1,29.7c18-30,35.4-62.4,51-93.9L180,366.6z%22/%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2295 206 414 348%22 fill=%22%23000%22%3E%3Cpath d=%22M478.6,456.6h-84c0.6-3,1.2-5.7,1.5-8.7h72.6v-31.5H397v-8.7h68.1v-63.6H397v-6.9h45.6v-35.4h30.3v-32.7 h-30.3v-14.4h-44.1v14.4h-30.6l-32.1,68.1h19.8v6.9h-23.1l-30,63.6h53.1v8.7h-57.2l-8.2,17.5v14h64.2c-0.6,3-1.2,6-2.1,8.7h-72.8 l-1,2.1v29.7h49.8c-12.3,8.4-30.3,15-55.5,19.2c8.7,8.1,20.1,24,24.9,33c44.4-10.8,70.5-29.1,84.9-52.2h13.8l-15.3,23.4 c24.9,7.2,60,19.8,77.1,28.5l19.8-32.1c-13.5-6-36.9-13.8-57.6-19.8h58.2L478.6,456.6L478.6,456.6z M355.6,380.4h-25.8v-9.3h25.8 V380.4z M423.7,371.1v9.3H397v-9.3H423.7z M355,310.5v-8.7h43.5v8.7H355z%22/%3E%3Cpath d=%22M264.3,266.1h80.2l20-42.4l-1.5-0.5l-6.9,1.8H216.6v41.1h31.2l-24.9,5.1c12.6,53.4,29.4,99.3,54,136.5 c-21.6,21.6-48.3,37.5-78.9,47.7c8.7,8.4,19.2,25.2,24.6,36.6c6.7-2.7,13.2-5.6,19.5-8.6l57.3-121.7 C283.6,333.5,272,301,264.3,266.1z%22/%3E%3Cpath d=%22M198,323.4c-13.5-9.9-41.1-22.8-59.7-30L117,326.7c19.2,8.7,45.9,23.1,58.2,33.6L198,323.4z%22/%3E%3Cpath d=%22M211.5,245.1c-12.6-10.8-38.4-24-56.7-31.5L132,245.7c18.9,9,43.8,24,54.9,34.8L211.5,245.1z%22/%3E%3Cpath d=%22M180,366.6c-18,35.1-40.2,71.4-55.8,93.6l35.1,29.7c18-30,35.4-62.4,51-93.9L180,366.6z%22/%3E%3C/svg%3E")}
html body .citizen-page-footer #catlinks,
html body #catlinks {
	border: 0 !important;
	background: transparent !important;
	padding: 0 !important;
	margin: 0 !important;
}
.citizen-page-footer{display:flex;flex-direction:column;gap:var(--space-xl);padding-top:var(--space-xl);margin-top:var(--space-xl)}
.page-info{display:flex;flex-wrap:wrap;gap:var(--space-xl)}
.page-info__item{display:flex;flex-direction:column;gap:var(--space-xxs)}
.page-info__label{color:var(--color-subtle);font-family:var(--font-family-overline);font-size:var(--font-size-overline);font-weight:var(--font-weight-overline);line-height:var(--line-height-overline);text-transform:var(--text-transform-overline);letter-spacing:var(--letter-spacing-overline)}
.page-info__text{color:var(--color-base);font-size:var(--font-size-small);line-height:var(--line-height-small)}
html body #catlinks .mw-normal-catlinks { border: 0 !important; background: transparent !important; }
html:not(.cv-gadget-hotcat-original) body #catlinks .hotcatlink,
html:not(.cv-gadget-hotcat-original) body #catlinks .mw-hcat,
html:not(.cv-gadget-hotcat-original) body #catlinks .catlinks-tools,
html:not(.cv-gadget-hotcat-original) body #catlinks div[id^="catlinks-tools"],
html:not(.cv-gadget-hotcat-original) body #catlinks div[id^="mw-hcat"],
html:not(.cv-gadget-hotcat-original) body #catlinks .mw-hcat-item { display: none !important; }
html:not(.cv-gadget-hotcat-original) body #catlinks .mw-normal-catlinks > span.noprint { display: none !important; }
html:not(.cv-gadget-hotcat-original) body #catlinks .cv-catlist > li:not(.cv-cat):not(.cv-tail-item):not(.cv-cat-draft) { display: none !important; }
.citizen-page-footer.ve-init-mw-desktopArticleTarget-uneditableContent,
.ve-init-mw-desktopArticleTarget-uneditableContent .citizen-page-footer {
	opacity: 1 !important;
}
.citizen-page-footer.ve-init-mw-desktopArticleTarget-uneditableContent #catlinks,
.citizen-page-footer.ve-init-mw-desktopArticleTarget-uneditableContent .catlinks,
.ve-init-mw-desktopArticleTarget-uneditableContent .citizen-page-footer #catlinks,
.ve-init-mw-desktopArticleTarget-uneditableContent .citizen-page-footer .catlinks {
	pointer-events: auto !important;
}
.citizen-page-footer.ve-init-mw-desktopArticleTarget-uneditableContent .page-info,
.ve-init-mw-desktopArticleTarget-uneditableContent .citizen-page-footer .page-info {
	opacity: 0.5 !important;
}
html body .ve-init-mw-desktopArticleTarget-categoryEdit { display: none !important; }
.ve-activated .ve-init-mw-desktopArticleTarget-originalContent #catlinks:hover {
	background-color: var(--background-color-button-quiet--hover);
}
html body #catlinks a { color: var(--color-link) !important; }
html body #catlinks a.new { color: var(--color-link-red) !important; }
html body .citizen-drawer__siteinfo .mw-logo-wordmark,
html body .citizen-footer__sitetitle .mw-logo-wordmark {
	margin-inline: 0 !important;
	align-self: flex-start !important;
	justify-self: flex-start !important;
	text-align: start !important;
}
html body .mw-logo-wordmark.cv-wordmark {
	display: block;
	height: 22px;
	width: auto;
	aspect-ratio: 105 / 22;
	background-color: light-dark(#000, #fff);
	-webkit-mask-image: url("https://zh.wikipedia.org/static/images/mobile/copyright/wikipedia-wordmark-zh.svg");
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	-webkit-mask-size: contain;
	mask-image: url("https://zh.wikipedia.org/static/images/mobile/copyright/wikipedia-wordmark-zh.svg");
	mask-repeat: no-repeat;
	mask-position: center;
	mask-size: contain;
	line-height: 0;
	flex: 0 0 auto;
}
html body .mw-logo-wordmark.cv-wordmark.cv-wordmark--text {
	height: auto;
	width: auto;
	aspect-ratio: auto;
	background-color: transparent;
	-webkit-mask-image: none;
	mask-image: none;
	font-size: 1.25rem;
	font-weight: var(--font-weight-semi-bold);
	line-height: 1.2;
	color: var(--color-base);
	white-space: nowrap;
}
html body .citizen-footer__sitetitle .mw-logo-wordmark.cv-wordmark.cv-wordmark--text {
	font-size: 2rem;
}
html body .citizen-header__logo .mw-logo .citizen-header-logo-svg.cv-site-icon {
	width: 32px;
	height: 32px;
	object-fit: contain;
}

html body #catlinks a:hover,
html body #catlinks a:hover:visited {
	color: var(--color-inverted-primary) !important;
}
html body #catlinks a.new:hover,
html body #catlinks a.new:hover:visited {
	color: var(--color-inverted-fixed) !important;
}


.mw-parser-output a.new:not(.ilh-all *),
#mw-content-text a.new:not(.ilh-all *),
.mw-parser-output a.new:visited:not(.ilh-all *),
.mw-parser-output a.new:visited:hover:not(.ilh-all *) {
	color: var(--color-link-red) !important;
}
.mw-parser-output a.new:hover:not(.ilh-all *),
#mw-content-text a.new:hover:not(.ilh-all *) {
	color: var(--color-link-red--hover) !important;
}
.mw-parser-output a.new:active:not(.ilh-all *),
#mw-content-text a.new:active:not(.ilh-all *) {
	color: var(--color-link-red--active) !important;
}

.mw-parser-output a:not(.new):not([role="button"]):not(.oo-ui-buttonElement-button):not(.cdx-button),
.mw-parser-output a:visited:not(.new):not([role="button"]):not(.oo-ui-buttonElement-button):not(.cdx-button),
#mw-content-text a:not(.new):not([role="button"]):not(.oo-ui-buttonElement-button):not(.cdx-button),
#mw-content-text a:visited:not(.new):not([role="button"]):not(.oo-ui-buttonElement-button):not(.cdx-button) {
	color: var(--color-link) !important;
}
.mw-parser-output a:hover:not(.new):not([role="button"]):not(.oo-ui-buttonElement-button):not(.cdx-button),
.mw-parser-output a:visited:hover:not(.new):not([role="button"]):not(.oo-ui-buttonElement-button):not(.cdx-button),
#mw-content-text a:hover:not(.new):not([role="button"]):not(.oo-ui-buttonElement-button):not(.cdx-button) {
	color: var(--color-link--hover) !important;
}

.mw-parser-output a:active:not(.new):not([role="button"]):not(.oo-ui-buttonElement-button):not(.cdx-button),
.mw-parser-output a:visited:active:not(.new):not([role="button"]):not(.oo-ui-buttonElement-button):not(.cdx-button),
#mw-content-text a:active:not(.new):not([role="button"]):not(.oo-ui-buttonElement-button):not(.cdx-button) {
	color: var(--color-link--active) !important;
}


body.citizen-is-mainpage.action-view .citizen-page-header {
	margin-top: calc( var( --space-xl, 24px ) * 2 );
}
body.citizen-is-mainpage.action-view .citizen-page-header-inner {
	justify-content: center;
}
@media screen and ( min-width: 1120px ) {
	body.citizen-is-mainpage.action-view .citizen-page-header-inner {
		border-top: var( --border-width-base, 1px ) solid var( --border-color-base, rgba( 0, 0, 0, 0.1 ) );
	}
}
body.citizen-is-mainpage.action-view .citizen-page-heading,
body.citizen-is-mainpage.action-view #contentSub {
	display: none;
}
body.citizen-is-mainpage.action-view .citizen-body-container {
	margin-top: var( --space-xl, 24px );
}
body.citizen-is-mainpage.action-view .citizen-page-actions {
	margin-inline-start: 0;
}

body.citizen-is-mainpage.action-view .citizen-body-container {
	grid-template-columns: minmax(0, var(--width-layout, 1080px)) !important;
	grid-template-areas: "content" "footer" !important;
}
body.citizen-is-mainpage.action-view .citizen-page-sidebar {
	display: none !important;
}
body.citizen-is-mainpage.action-view .citizen-page-header-inner {
	max-width: var(--width-layout, 1080px) !important;
}

body.citizen-is-mainpage.action-view .citizen-page-languages .citizen-menu__card {
	width: 16rem;
	max-width: calc(100vw - var(--space-xs, 4px) * 2);
	max-height: 24rem;
	white-space: normal;
}
body.citizen-is-mainpage.action-view #catlinks {
	display: none !important;
}

.mw-parser-output a.external,
html body.skin-vector-2022 .mw-parser-output a.external,
html body #mw-content-text a.external {
	background-image: none !important;
	background-position: initial !important;
	background-repeat: initial !important;
	background-size: initial !important;
	padding-right: 0 !important;
}

html:root {
	--color-primary-oklch__h: var(--cv-accent-h, 262.29);
	--color-progressive-oklch__h: var(--color-primary-oklch__h);
	--color-neutral-oklch__h: var(--color-primary-oklch__h);
	--color-surface-0: light-dark(oklch(100% 0.01 var(--color-primary-oklch__h)), oklch(11% 0.01 var(--color-primary-oklch__h)));
	--color-surface-1: light-dark(oklch(calc(100% + -2%) 0.015 var(--color-primary-oklch__h)), oklch(17% 0.012 var(--color-primary-oklch__h)));
	--color-surface-1--hover: light-dark(oklch(calc(calc(100% + -2%) + calc(4% * 1)) 0.015 var(--color-primary-oklch__h)), oklch(22% 0.02 var(--color-primary-oklch__h)));
	--color-surface-1--active: light-dark(oklch(calc(calc(100% + -2%) + calc(4% * -1)) 0.015 var(--color-primary-oklch__h)), oklch(30% 0.028 var(--color-primary-oklch__h)));
	--color-surface-2: light-dark(oklch(calc(100% + (-2% * 2)) 0.02 var(--color-primary-oklch__h)), oklch(22% 0.02 var(--color-primary-oklch__h)));
	--color-surface-2--hover: light-dark(oklch(calc(calc(100% + (-2% * 2)) + calc(4% * 1)) 0.02 var(--color-primary-oklch__h)), oklch(30% 0.028 var(--color-primary-oklch__h)));
	--color-surface-2--active: light-dark(oklch(calc(calc(100% + (-2% * 2)) + calc(4% * -1)) 0.02 var(--color-primary-oklch__h)), oklch(39% 0.035 var(--color-primary-oklch__h)));
	--color-surface-3: light-dark(oklch(calc(100% + (-2% * 3)) 0.03 var(--color-primary-oklch__h)), oklch(30% 0.028 var(--color-primary-oklch__h)));
	--color-surface-4: light-dark(oklch(calc(100% + (-2% * 4)) 0.04 var(--color-primary-oklch__h)), oklch(39% 0.035 var(--color-primary-oklch__h)));
	--background-color-base: light-dark(oklch(100% 0.01 var(--color-primary-oklch__h)), oklch(11% 0.01 var(--color-primary-oklch__h)));
	--background-color-neutral: light-dark(oklch(calc(100% + (-2% * 2)) 0.02 var(--color-primary-oklch__h)), oklch(22% 0.02 var(--color-primary-oklch__h)));
	--background-color-neutral-subtle: light-dark(oklch(calc(100% + -2%) 0.015 var(--color-primary-oklch__h)), oklch(17% 0.012 var(--color-primary-oklch__h)));
	--background-color-interactive: light-dark(oklch(calc(100% + (-2% * 2)) 0.02 var(--color-primary-oklch__h)), oklch(22% 0.02 var(--color-primary-oklch__h)));
	--background-color-interactive--hover: light-dark(oklch(calc(calc(100% + (-2% * 2)) + calc(4% * 1)) 0.02 var(--color-primary-oklch__h)), oklch(30% 0.028 var(--color-primary-oklch__h)));
	--background-color-interactive--active: light-dark(oklch(calc(calc(100% + (-2% * 2)) + calc(4% * -1)) 0.02 var(--color-primary-oklch__h)), oklch(39% 0.035 var(--color-primary-oklch__h)));
	--background-color-interactive-subtle: light-dark(oklch(calc(100% + -2%) 0.015 var(--color-primary-oklch__h)), oklch(17% 0.012 var(--color-primary-oklch__h)));
	--background-color-interactive-subtle--hover: light-dark(oklch(calc(calc(100% + -2%) + calc(4% * 1)) 0.015 var(--color-primary-oklch__h)), oklch(22% 0.02 var(--color-primary-oklch__h)));
	--background-color-interactive-subtle--active: light-dark(oklch(calc(calc(100% + -2%) + calc(4% * -1)) 0.015 var(--color-primary-oklch__h)), oklch(30% 0.028 var(--color-primary-oklch__h)));
	--background-color-progressive: light-dark(oklch(53.25% 0.1679 var(--color-primary-oklch__h)), oklch(53% 0.17 var(--color-primary-oklch__h)));
	--background-color-progressive--hover: light-dark(oklch(57.25% 0.1679 var(--color-primary-oklch__h)), oklch(47% 0.15 var(--color-primary-oklch__h)));
	--background-color-progressive--active: light-dark(oklch(49.25% 0.1679 var(--color-primary-oklch__h)), oklch(34% 0.105 var(--color-primary-oklch__h)));
	--background-color-progressive--focus: light-dark(oklch(53.25% 0.1679 var(--color-primary-oklch__h)), oklch(62% 0.13 var(--color-primary-oklch__h)));
	--background-color-progressive-subtle: light-dark(oklch(95% 0.024 var(--color-primary-oklch__h)), oklch(16% 0.05 var(--color-primary-oklch__h)));
	--background-color-progressive-subtle--hover: light-dark(oklch(92% 0.04 var(--color-primary-oklch__h)), oklch(34% 0.105 var(--color-primary-oklch__h)));
	--background-color-progressive-subtle--active: light-dark(oklch(86% 0.06 var(--color-primary-oklch__h)), oklch(47% 0.15 var(--color-primary-oklch__h)));
	--background-color-input-binary--checked: var(--color-progressive);
	--background-color-destructive: oklch(54% 0.18 10);
	--background-color-destructive--hover: oklch(48% 0.16 10);
	--background-color-destructive--active: oklch(35% 0.135 10);
	--background-color-disabled: light-dark(oklch(calc(100% + (-2% * 3)) 0.03 var(--color-primary-oklch__h)), oklch(30% 0.028 var(--color-primary-oklch__h)));
	--background-color-disabled-subtle: light-dark(oklch(calc(100% + -2%) 0.015 var(--color-primary-oklch__h)), oklch(22% 0.02 var(--color-primary-oklch__h)));
	--background-color-error: light-dark(hsl(340, 100%, 40%), hsl(340, 100%, 50%));
	--background-color-error-subtle: light-dark(hsl(340, 95%, 95%), hsl(340, 85%, 5%));
	--background-color-inverted: #101418;
	--border-color-base: light-dark(rgb(0 0 0 / 0.1), rgb(255 255 255 / 0.1));
	--border-color-emphasized: light-dark(oklch(20% 0.09 var(--color-primary-oklch__h)), oklch(93% 0.005 var(--color-primary-oklch__h)));
	--border-color-subtle: light-dark(rgb(0 0 0 / 0.05), rgb(255 255 255 / 0.05));
	--border-color-muted: light-dark(rgb(0 0 0 / 0.03), rgb(255 255 255 / 0.03));
	--border-color-interactive: light-dark(rgb(0 0 0 / 0.1), rgb(255 255 255 / 0.1));
	--border-color-interactive--hover: light-dark(rgb(0 0 0 / 0.2), rgb(255 255 255 / 0.2));
	--border-color-interactive--active: light-dark(rgb(0 0 0 / 0.3), rgb(255 255 255 / 0.3));
	--border-color-divider: light-dark(rgb(0 0 0 / 0.1), rgb(255 255 255 / 0.1));
	--border-color-progressive: light-dark(oklch(53.25% 0.1679 var(--color-primary-oklch__h)), oklch(62% 0.13 var(--color-primary-oklch__h)));
	--border-color-progressive--hover: light-dark(oklch(47% 0.15 var(--color-primary-oklch__h)), oklch(72% 0.108 var(--color-primary-oklch__h)));
	--border-color-progressive--active: light-dark(oklch(34% 0.105 var(--color-primary-oklch__h)), oklch(80% 0.085 var(--color-primary-oklch__h)));
	--border-color-progressive--focus: light-dark(oklch(53.25% 0.1679 var(--color-primary-oklch__h)), oklch(62% 0.13 var(--color-primary-oklch__h)));
	--border-color-input--hover: var(--border-color-interactive);
	--border-color-input-binary: var(--border-color-interactive);
	--border-color-input-binary--hover: var(--border-color-progressive--hover);
	--border-color-input-binary--active: var(--border-color-progressive--active);
	--border-color-input-binary--focus: var(--border-color-progressive--focus);
	--border-color-input-binary--checked: var(--border-color-progressive);
	--border-color-disabled: light-dark(rgb(0 0 0 / 0.05), rgb(255 255 255 / 0.05));
	--color-base: light-dark(oklch(20% 0.09 var(--color-primary-oklch__h)), oklch(84% 0.028 var(--color-primary-oklch__h)));
	--color-base--hover: light-dark(oklch(24% 0.09 var(--color-primary-oklch__h)), oklch(90% 0.02 var(--color-primary-oklch__h)));
	--color-base--subtle: light-dark(oklch(35% 0.11 var(--color-primary-oklch__h)), oklch(73% 0.035 var(--color-primary-oklch__h)));
	--color-emphasized: light-dark(oklch(5% 0.07 var(--color-primary-oklch__h)), oklch(98% 0.005 var(--color-primary-oklch__h)));
	--color-subtle: light-dark(oklch(35% 0.11 var(--color-primary-oklch__h)), oklch(73% 0.035 var(--color-primary-oklch__h)));
	--color-placeholder: light-dark(oklch(40% 0.07 var(--color-primary-oklch__h)), oklch(51% 0.04 var(--color-primary-oklch__h)));
	--color-destructive: light-dark(hsl(340, 100%, 40%), hsl(340, 100%, 50%));
	--color-error: light-dark(hsl(340, 100%, 40%), hsl(340, 100%, 50%));
	--color-success: light-dark(hsl(170, 100%, 17%), hsl(170, 100%, 35%));
	--color-warning: light-dark(hsl(48, 100%, 40%), hsl(48, 100%, 60%));
	--color-inverted: light-dark(#fff, #fff);
	--color-inverted-fixed: light-dark(#fff, #fff);
	--color-progressive: light-dark(oklch(53.25% 0.1679 var(--color-primary-oklch__h)), oklch(72% 0.108 var(--color-primary-oklch__h)));
	--color-progressive--hover: light-dark(oklch(57.25% 0.1679 var(--color-primary-oklch__h)), oklch(80% 0.085 var(--color-primary-oklch__h)));
	--color-progressive--active: light-dark(oklch(49.25% 0.1679 var(--color-primary-oklch__h)), oklch(86% 0.06 var(--color-primary-oklch__h)));
	--color-progressive--focus: light-dark(oklch(53.25% 0.1679 var(--color-primary-oklch__h)), oklch(53% 0.17 var(--color-primary-oklch__h)));
	--color-link: light-dark(oklch(53.25% 0.1679 var(--color-primary-oklch__h)), oklch(72% 0.108 var(--color-primary-oklch__h)));
	--color-link--hover: light-dark(oklch(57.25% 0.1679 var(--color-primary-oklch__h)), oklch(80% 0.085 var(--color-primary-oklch__h)));
	--color-link--active: light-dark(oklch(49.25% 0.1679 var(--color-primary-oklch__h)), oklch(86% 0.06 var(--color-primary-oklch__h)));
	--color-link--visited: light-dark(oklch(53.25% 0.1679 var(--color-primary-oklch__h)), oklch(72% 0.108 var(--color-primary-oklch__h)));
	--color-link--visited--hover: var(--color-link--hover);
	--color-link--visited--active: var(--color-link--active);
	--color-link--focus: var(--color-progressive--focus);
	--color-visited: var(--color-progressive);
	--color-visited--hover: var(--color-progressive--hover);
	--color-visited--active: var(--color-progressive--active);
	--color-icon-progressive: light-dark(oklch(53.25% 0.1679 var(--color-primary-oklch__h)), oklch(62% 0.13 var(--color-primary-oklch__h)));
	--outline-color-progressive--focus: light-dark(oklch(53.25% 0.1679 var(--color-primary-oklch__h)), oklch(62% 0.13 var(--color-primary-oklch__h)));
	--color-link-red: var(--color-destructive);
	--color-link-red--hover: light-dark(hsl(340, 100%, 44%), hsl(340, 100%, 54%));
	--color-link-red--active: light-dark(hsl(340, 100%, 36%), hsl(340, 100%, 46%));
	--color-link-red--visited: var(--color-destructive);
	--accent-color-base: light-dark(oklch(53.25% 0.1679 var(--color-primary-oklch__h)), oklch(72% 0.108 var(--color-primary-oklch__h)));
	--box-shadow-color-base: light-dark(oklch(12% 0.01 var(--color-primary-oklch__h) / 0.03), oklch(6% 0.01 var(--color-primary-oklch__h) / 0.44));
	--box-shadow-color-alpha-base: light-dark(oklch(12% 0.01 var(--color-primary-oklch__h) / 0.03), oklch(6% 0.01 var(--color-primary-oklch__h) / 0.44));
	--box-shadow-color-progressive--focus: var(--color-progressive);
	--box-shadow-color-progressive--active: var(--color-progressive--active);
	--box-shadow-color-progressive-selected: var(--color-progressive);
	--box-shadow-color-progressive-selected--hover: var(--color-progressive--hover);
	--box-shadow-color-progressive-selected--active: var(--color-progressive--active);
	--font-family-base: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Roboto, Roboto-fallback, system-ui, "Segoe UI", sans-serif;
	--font-size-medium: 1rem;
	--line-height-medium: 1.625rem;
}

html .notheme,
html .skin-invert {
	--color-progressive: light-dark(oklch(53.25% 0.1679 var(--color-primary-oklch__h)), oklch(72% 0.108 var(--color-primary-oklch__h)));
	--color-progressive--hover: light-dark(oklch(57.25% 0.1679 var(--color-primary-oklch__h)), oklch(80% 0.085 var(--color-primary-oklch__h)));
	--color-progressive--active: light-dark(oklch(49.25% 0.1679 var(--color-primary-oklch__h)), oklch(86% 0.06 var(--color-primary-oklch__h)));
	--color-progressive--focus: var(--color-progressive);
	--color-visited: var(--color-progressive);
	--color-visited--hover: var(--color-progressive--hover);
	--color-visited--active: var(--color-progressive--active);
	--color-icon-progressive: light-dark(oklch(53.25% 0.1679 var(--color-primary-oklch__h)), oklch(62% 0.13 var(--color-primary-oklch__h)));
	--outline-color-progressive--focus: var(--color-icon-progressive);
	--background-color-progressive: var(--color-progressive);
	--background-color-progressive--hover: light-dark(oklch(57.25% 0.1679 var(--color-primary-oklch__h)), oklch(47% 0.15 var(--color-primary-oklch__h)));
	--background-color-progressive--active: light-dark(oklch(49.25% 0.1679 var(--color-primary-oklch__h)), oklch(34% 0.105 var(--color-primary-oklch__h)));
	--background-color-progressive--focus: var(--color-progressive);
	--background-color-progressive-subtle: light-dark(oklch(95% 0.024 var(--color-primary-oklch__h)), oklch(16% 0.05 var(--color-primary-oklch__h)));
	--background-color-progressive-subtle--hover: light-dark(oklch(92% 0.04 var(--color-primary-oklch__h)), oklch(34% 0.105 var(--color-primary-oklch__h)));
	--background-color-progressive-subtle--active: light-dark(oklch(86% 0.06 var(--color-primary-oklch__h)), oklch(47% 0.15 var(--color-primary-oklch__h)));
	--border-color-progressive: var(--color-progressive);
	--border-color-progressive--hover: light-dark(oklch(47% 0.15 var(--color-primary-oklch__h)), oklch(72% 0.108 var(--color-primary-oklch__h)));
	--border-color-progressive--active: light-dark(oklch(34% 0.105 var(--color-primary-oklch__h)), oklch(80% 0.085 var(--color-primary-oklch__h)));
	--border-color-progressive--focus: var(--color-progressive);
}

#firstHeading .mw-editsection {
	display: none !important;
}
html body:is(.ns-1, .ns-3, .ns-5, .ns-7, .ns-9, .ns-11, .ns-13, .ns-15) #bodyContent .mw-editsection {
	display: none !important;
}
html body .mw-parser-output .navbox .mw-editsection,
html body .mw-parser-output .navbox .mw-editsection-bracket {
	display: none !important;
}
html body #mw-content-text .mw-parser-output .navbox .navbox-title a[href*="wikidata.org"] {
	position: absolute !important;
	left: 14px !important;
	top: 50% !important;
	transform: translateY(-50%) !important;
	margin: 0 !important;
	display: inline-flex !important;
	align-items: center !important;
	justify-content: center !important;
	width: 0.875rem !important;
	height: 0.875rem !important;
	overflow: hidden !important;
	font-size: 0 !important;
	color: var(--color-link, #36c) !important;
	background-color: currentcolor;
	-webkit-mask-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJZWRpdAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJtMTYuNzcgOCAxLjk0LTJhMSAxIDAgMCAwIDAtMS40MWwtMy4zNC0zLjNhMSAxIDAgMCAwLTEuNDEgMEwxMiAzLjIzek0xIDE0LjI1VjE5aDQuNzVsOS45Ni05Ljk2LTQuNzUtNC43NXoiLz48L2c+PC9zdmc+Cg==");
	mask-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJZWRpdAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJtMTYuNzcgOCAxLjk0LTJhMSAxIDAgMCAwIDAtMS40MWwtMy4zNC0zLjNhMSAxIDAgMCAwLTEuNDEgMEwxMiAzLjIzek0xIDE0LjI1VjE5aDQuNzVsOS45Ni05Ljk2LTQuNzUtNC43NXoiLz48L2c+PC9zdmc+Cg==");
	-webkit-mask-repeat: no-repeat;
	mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-position: center;
	-webkit-mask-size: contain;
	mask-size: contain;
	text-decoration: none !important;
	transition: var(--transition-hover, color 0.1s ease);
	transition-property: color;
}
html body #mw-content-text .mw-parser-output .navbox .navbox-title a[href*="wikidata.org"]:hover {
	color: var(--color-link--hover, #4b77d6) !important;
}
html body #mw-content-text .mw-parser-output .navbox .navbox-title a[href*="wikidata.org"]:active {
	color: var(--color-link--active, #233566) !important;
}
html body #mw-content-text .mw-parser-output .navbox .navbox-title a[href*="wikidata.org"] img {
	display: none !important;
}
/*CVNS2-B*/
.mw-parser-output .mw-heading,
.mw-parser-output .mw-heading h2,
.mw-parser-output .mw-heading h3,
.mw-parser-output .mw-heading h4,
.mw-parser-output .mw-heading h5,
.mw-parser-output .mw-heading h6 {
	border-bottom: 0 !important;
	text-decoration: none !important;
}
.mw-parser-output .mw-heading a { text-decoration: none !important; }

.mw-parser-output .mw-heading {
	display: flex !important;
	align-items: center;
	justify-content: flex-start !important;   
	flex-wrap: wrap;
	column-gap: 0;
}
.mw-parser-output .mw-heading h2,
.mw-parser-output .mw-heading h3,
.mw-parser-output .mw-heading h4,
.mw-parser-output .mw-heading h5,
.mw-parser-output .mw-heading h6 {
	display: inline-flex !important;      
	align-items: center;
	justify-content: flex-start !important; 
	flex-grow: 0 !important;              
	flex-basis: auto !important;
	margin: 0 !important;
	margin-block: 0 !important;
}
html body #bodyContent .mw-parser-output .mw-heading h2,
html body #bodyContent .mw-parser-output .mw-heading h3,
html body #bodyContent .mw-parser-output .mw-heading h4,
html body #bodyContent .mw-parser-output .mw-heading h5,
html body #bodyContent .mw-parser-output .mw-heading h6 {
	margin: 0 !important;
	margin-block: 0 !important;
}
.mw-parser-output .mw-heading > .mw-editsection,
.mw-parser-output .mw-heading.mw-heading2 > .mw-editsection {
	order: 0;
	flex-shrink: 0;
}
.mw-parser-output .mw-heading > .citizen-section-toggle { order: -2; }
.mw-parser-output .mw-heading { margin-block-start: 2em !important; }
.mw-parser-output .mw-heading.mw-heading3 { margin-block-start: 1.5em !important; }
.mw-parser-output .mw-heading.mw-heading4 { margin-block-start: 1.5em !important; }
.mw-parser-output .mw-heading.mw-heading5 { margin-block-start: 1.25em !important; }
.mw-parser-output .mw-heading.mw-heading6 { margin-block-start: 1.25em !important; }

.mw-parser-output .mw-heading .mw-editsection {
	display: inline-flex !important;
	align-items: center !important;
	justify-content: center !important;
	float: none !important;
	margin-inline-start: auto !important;  
	margin-inline-end: 0 !important;
	width: 1.25rem;
	height: 1.25rem;
	box-sizing: content-box;
	font-size: 0 !important;          
	line-height: 0 !important;
	color: var(--color-base, #202122) !important;
	vertical-align: middle;
	flex-shrink: 0;
	border-radius: var(--border-radius-base, 2px);
	transition: var(--transition-hover, opacity 0.1s ease);
	transition-property: opacity;
}
.mw-parser-output .mw-heading .mw-editsection .mw-editsection-bracket {
	display: none !important;
	font-size: 0 !important;
}
html body #bodyContent .mw-parser-output .mw-heading .mw-editsection a {
	display: inline-flex !important;
	align-items: center !important;
	justify-content: center !important;
	width: 1.25rem !important;
	height: 1.25rem !important;
	margin: 0 !important;
	text-indent: -9999px !important;   
	overflow: hidden !important;
	white-space: nowrap !important;
	color: var(--color-base, #202122) !important;
	background-color: currentcolor;
	-webkit-mask-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJZWRpdAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJtMTYuNzcgOCAxLjk0LTJhMSAxIDAgMCAwIDAtMS40MWwtMy4zNC0zLjNhMSAxIDAgMCAwLTEuNDEgMEwxMiAzLjIzek0xIDE0LjI1VjE5aDQuNzVsOS45Ni05Ljk2LTQuNzUtNC43NXoiLz48L2c+PC9zdmc+Cg==");
	mask-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48dGl0bGU+CgkJZWRpdAoJPC90aXRsZT48ZyBmaWxsPSIjMDAwIj48cGF0aCBkPSJtMTYuNzcgOCAxLjk0LTJhMSAxIDAgMCAwIDAtMS40MWwtMy4zNC0zLjNhMSAxIDAgMCAwLTEuNDEgMEwxMiAzLjIzek0xIDE0LjI1VjE5aDQuNzVsOS45Ni05Ljk2LTQuNzUtNC43NXoiLz48L2c+PC9zdmc+Cg==");
	-webkit-mask-repeat: no-repeat;
	mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-position: center;
	-webkit-mask-size: contain;
	mask-size: contain;
	text-decoration: none !important;
	opacity: var(--opacity-icon-base, 0.65);
	transition: var(--transition-hover, opacity 0.1s ease);
	transition-property: opacity;
}
html body #bodyContent .mw-parser-output .mw-heading .mw-editsection a:hover {
	opacity: var(--opacity-icon-base--hover, 0.74);
}
html body #bodyContent .mw-parser-output .mw-heading .mw-editsection a:active {
	opacity: var(--opacity-icon-base--selected, 1);
}

.mw-parser-output .mw-heading .citizen-section-toggle {
	-webkit-appearance: none;
	appearance: none;
	background: transparent;
	border: 0 !important;
	padding: 0 !important;
	margin-inline-start: 0 !important;
	margin-inline-end: var(--space-sm, 0.5rem) !important;
	cursor: pointer;
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	color: inherit; 
	box-sizing: content-box;
	border-radius: var(--border-radius-base, 2px);
	vertical-align: middle;
	line-height: 1;
	order: -2;
	transition: var(--transition-hover, opacity 0.1s ease);
	transition-property: opacity;
}
.mw-parser-output .mw-heading .citizen-section-toggle .citizen-ui-icon {
	--size-icon: 1.25rem;
}
.mw-parser-output .mw-heading .citizen-section-toggle::before,
.mw-parser-output .mw-heading .citizen-section-toggle::after {
	content: none !important;
	display: none !important;
	background: none !important;
	-webkit-mask: none !important;
	mask: none !important;
}
.mw-parser-output .mw-heading .citizen-section-toggle:hover {
	opacity: var(--opacity-icon-base--hover, 0.7);
}
.mw-parser-output .mw-heading .citizen-section-toggle:active {
	opacity: var(--opacity-icon-base--selected, 1);
}
.mw-parser-output .mw-heading.citizen-section--collapsed .citizen-section-toggle .citizen-ui-icon::before {
	transform: rotate3d(1, 0, 0, 180deg);
}
.mw-parser-output .mw-heading.citizen-section--collapsed h2,
.mw-parser-output .mw-heading.citizen-section--collapsed h3,
.mw-parser-output .mw-heading.citizen-section--collapsed h4 {
	color: var(--color-subtle, #72777d) !important;
}
.mw-parser-output .citizen-section-hidden { display: none !important; }
/*CVNS2-E*/

.mw-parser-output figure[typeof~='mw:File'],
.mw-parser-output figure[typeof~='mw:File/Frameless'],
.mw-parser-output figure[typeof~='mw:File/Thumb'],
.mw-parser-output figure[typeof~='mw:File/Frame'],
.mw-parser-output .thumb,
.mw-parser-output .thumbinner {
	background: transparent !important;
	border: 0 !important;
	padding: 0 !important;
}
.mw-parser-output .mw-file-element,
.mw-parser-output figure img,
.mw-parser-output .thumb img,
.mw-parser-output .thumbimage {
	background: transparent !important;
	border: 0 !important;
	padding: 0 !important;
}
.mw-parser-output figure[typeof~='mw:File/Thumb'] > .mw-file-description,
.mw-parser-output figure[typeof~='mw:File/Frame'] > .mw-file-description,
.mw-parser-output figure[typeof~='mw:File/Thumb'] > span:first-child,
.mw-parser-output figure[typeof~='mw:File/Frame'] > span:first-child {
	display: block;
	overflow: hidden;
	border-radius: var(--border-radius-base, 4px);
}
.mw-parser-output figure[typeof~='mw:File/Thumb'] > figcaption,
.mw-parser-output figure[typeof~='mw:File/Frame'] > figcaption,
.mw-parser-output .thumbcaption {
	padding: 0 var(--border-radius-base, 4px) !important;
	color: var(--color-subtle, #72777d) !important;
	font-size: var(--font-size-small, 0.875rem) !important;
	background: transparent !important;
	border: 0 !important;
}
.mw-parser-output figure[typeof~='mw:File/Thumb'] > figcaption:not(:empty),
.mw-parser-output figure[typeof~='mw:File/Frame'] > figcaption:not(:empty) {
	margin-top: var(--space-xs, 4px);
}

html body .mw-parser-output .mw-tmh-player.audio .mw-tmh-play .mw-tmh-play-icon {
	background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath fill='%23202122' d='M4.55 19A1 1 0 0 1 3 18.13V1.87A1 1 0 0 1 4.55 1l12.2 8.13a1 1 0 0 1 0 1.7z'/%3E%3C/svg%3E") 10px center no-repeat !important;
	background-color: transparent !important;
}
html body .mw-parser-output .mw-tmh-player.audio .mw-tmh-play:hover .mw-tmh-play-icon,
html body .mw-parser-output .mw-tmh-player.audio .mw-tmh-play:focus .mw-tmh-play-icon {
	background-color: var(--background-color-button-quiet--hover, rgba(0, 24, 73, 0.027)) !important;
}
html body .mw-parser-output .mw-tmh-player.audio .mw-tmh-play:active .mw-tmh-play-icon {
	background-color: var(--background-color-button-quiet--active, rgba(0, 24, 73, 0.082)) !important;
}
html body .mw-parser-output .mw-tmh-player.audio .mw-tmh-duration {
	background-color: transparent !important;
	color: var(--color-subtle, #54595d) !important;
}

.oo-ui-toolbar-bar {
	background-color: var(--color-surface-0, #fff) !important;
	border-block-end: 0 !important;
	border-radius: 0 !important;
	color: var(--color-base, #202122) !important;
	box-shadow: 0 1px 0 0 var(--border-color-base, rgb(0 0 0 / 0.1)) !important;
}
.ve-init-mw-desktopArticleTarget-toolbar,
.ve-init-mw-desktopArticleTarget-toolbarPlaceholder,
.ve-ui-overlay-local,
.ve-ui-overlay-global,
.ve-ui-sidebarDialogWindowManager {
	font-size: 0.875rem;
}
.ve-init-mw-desktopArticleTarget-toolbar {
	z-index: 100;
}
.ve-init-mw-desktopArticleTarget-toolbar > .oo-ui-toolbar-bar {
	border-bottom: 0 !important;
	box-shadow: 0 1px 0 0 var(--border-color-base, rgb(0 0 0 / 0.1)) !important;
}
.ve-init-mw-desktopArticleTarget .ve-init-mw-target-surface {
	margin-inline: 0 !important;
}
.ve-init-mw-progressBarWidget {
	background-color: var(--color-surface-0, #fff) !important;
	border-color: var(--border-color-progressive, #36c) !important;
}
.ve-init-mw-progressBarWidget-bar {
	background-color: var(--background-color-progressive, #36c) !important;
}
.ve-init-mw-desktopArticleTarget-toolbarPlaceholder-bar {
	border-bottom-color: var(--border-color-base, rgb(0 0 0 / 0.1)) !important;
}
@media (min-width: 1120px) {
	.ve-ui-toolbar-floating.ve-init-mw-desktopArticleTarget-toolbar > .oo-ui-toolbar-bar {
		top: var(--header-size-block-start, 0px);
	}
}

.ve-ce-surface .mw-parser-output .mw-file-element,
.ve-ce-surface .mw-parser-output figure img,
.ve-ce-surface .mw-parser-output .thumb img,
.ve-ce-surface .mw-parser-output .thumbimage {
	contain: none !important;
	transition: all 0s !important;
}
.ve-ce-surface .mw-parser-output figure[typeof~='mw:File/Thumb'] > .mw-file-description,
.ve-ce-surface .mw-parser-output figure[typeof~='mw:File/Frame'] > .mw-file-description,
.ve-ce-surface .mw-parser-output figure[typeof~='mw:File/Thumb'] > span:first-child,
.ve-ce-surface .mw-parser-output figure[typeof~='mw:File/Frame'] > span:first-child {
	overflow: visible !important;
}
.ve-ce-surface .mw-parser-output .wikitable {
	display: table !important;
	max-width: none !important;
	overflow: visible !important;
}
.ve-ce-surface .mw-parser-output .mw-heading {
	display: flow-root !important;
}
.ve-ce-surface .mw-parser-output .infobox:not(.wikitable),
.ve-ce-surface .mw-parser-output .navbox,
.ve-ce-surface .mw-parser-output table.sidebar {
	overflow: visible !important;
}

.ve-init-mw-desktopArticleTarget-toolbar > .oo-ui-toolbar-bar > .oo-ui-toolbar-tools {
	position: relative;
	background-color: var(--color-surface-0, #fff) !important;
}
.ve-init-mw-desktopArticleTarget-toolbar > .oo-ui-toolbar-bar > .oo-ui-toolbar-tools:first-child {
	display: inline-block;
	max-width: calc(100% - 250px);
	white-space: nowrap;
}
.ve-init-mw-desktopArticleTarget-toolbar > .oo-ui-toolbar-bar > .oo-ui-toolbar-actions {
	border-left: var(--border-width-base, 1px) solid var(--border-color-base, rgb(0 0 0 / 0.1));
}
.oo-ui-toolbar .oo-ui-tool-link,
.oo-ui-toolbar .oo-ui-popupToolGroup-handle {
	border-radius: 0 !important;
}
.oo-ui-toolbar .oo-ui-tool,
.oo-ui-toolbar .oo-ui-toolGroup,
.oo-ui-toolbar .ve-ui-toolbar-group-format,
.oo-ui-toolbar .ve-ui-toolbar-group-style,
.oo-ui-toolbar .ve-ui-toolbar-group-cite,
.oo-ui-toolbar .ve-ui-toolbar-group-structure,
.oo-ui-toolbar .ve-ui-toolbar-group-insert,
.oo-ui-toolbar .ve-ui-toolbar-group-help,
.oo-ui-toolbar .ve-ui-toolbar-group-pageMenu,
.oo-ui-toolbar .ve-ui-toolbar-group-editMode {
	color: var(--color-base, #202122) !important;
}
.oo-ui-toolbar .oo-ui-tool-group .oo-ui-tool,
.oo-ui-toolbar .oo-ui-toolGroup .oo-ui-popupToolGroup-handle {
	color: var(--color-base, #202122) !important;
	transition: var(--transition-hover, opacity 0.1s ease);
	transition-property: background-color, color, opacity;
}
.oo-ui-toolbar .oo-ui-toolGroup .oo-ui-popupToolGroup-handle:hover,
.oo-ui-toolbar .oo-ui-toolGroup .oo-ui-popupToolGroup-handle:focus {
	background-color: var(--background-color-button-quiet--hover, rgba(0, 0, 0, 0.027)) !important;
	color: var(--color-emphasized, #202122) !important;
}
.oo-ui-toolbar .oo-ui-toolGroup .oo-ui-popupToolGroup-handle:active {
	background-color: var(--background-color-button-quiet--active, rgba(0, 0, 0, 0.082)) !important;
}
.oo-ui-toolbar .oo-ui-tool.oo-ui-widget-disabled {
	color: var(--color-base--subtle, #72777d) !important;
	opacity: 0.5 !important;
}
.oo-ui-widget.oo-ui-widget-enabled.oo-ui-selectWidget.oo-ui-selectWidget-unpressed.oo-ui-clippableElement-clippable.oo-ui-floatableElement-floatable.oo-ui-menuSelectWidget {
}
.oo-ui-toolbar .oo-ui-popupWidget,
.oo-ui-popupToolGroup .oo-ui-popupWidget {
	filter: drop-shadow(0 2px 1px rgb(0 0 0 / 0.3));
	transform: translateZ(0);
}
.oo-ui-toolbar .oo-ui-popupWidget .oo-ui-popupWidget-popup,
.oo-ui-toolbar .oo-ui-popupTool-popup .oo-ui-popupWidget-popup,
.oo-ui-popupToolGroup .oo-ui-popupWidget .oo-ui-popupWidget-popup,
.ve-ui-desktopContext .oo-ui-popupWidget-popup {
	background-color: var(--color-surface-1, #f8f9fa) !important;
	border: 1px solid var(--border-color-base, rgb(0 0 0 / 0.1)) !important;
	border-radius: var(--border-radius-base, 4px) !important;
	box-shadow: none !important;
	color: var(--color-base, #202122) !important;
}
.ve-ui-mwTransclusionOutlineTemplateWidget-sticky {
	background-color: var(--color-surface-1, #f8f9fa) !important;
}
.ve-ui-desktopContext-menu {
	width: 400px;
}
.ve-ui-desktopContext .ve-ui-linkContextItem .ve-ui-linkContextItem-label {
	width: calc(100% + 1em * 2);
	border-top-color: var(--border-color-base, rgb(0 0 0 / 0.1));
}
.ve-ui-desktopContext .ve-ui-linkContextItem .ve-ui-linkContextItem-label .ve-ui-linkContextItem-label-preview {
	color: var(--color-subtle, #54595d);
}
.oo-ui-window-content,
.oo-ui-dialog-content,
.oo-ui-processDialog-content,
.ve-ui-nodeDialog,
.ve-ui-mwTemplateDialog,
.ve-ui-mwTransclusionDialog-expanded,
.oo-ui-window-content-setup,
.oo-ui-window-content-ready {
	background-color: var(--color-surface-0, #fff) !important;
	color: var(--color-base, #202122) !important;
}
.oo-ui-processDialog-title,
.oo-ui-window-head,
.oo-ui-dialog-panel .oo-ui-horizontalLayout .oo-ui-labelElement-label {
	color: var(--color-base, #202122) !important;
}
.oo-ui-processDialog-actions,
.oo-ui-dialog .oo-ui-window-footer,
.oo-ui-window-footer {
	background-color: var(--color-surface-1, #f8f9fa) !important;
	border-block-start: 1px solid var(--border-color-subtle, rgb(0 0 0 / 0.05)) !important;
}
.oo-ui-inputWidget-input,
.oo-ui-textInputWidget input,
.oo-ui-textInputWidget textarea {
	background-color: var(--color-surface-0, #fff) !important;
	color: var(--color-base, #202122) !important;
	border: 1px solid var(--border-color-base, rgb(0 0 0 / 0.1)) !important;
	border-radius: var(--border-radius-base, 2px) !important;
}
.oo-ui-inputWidget-input:focus,
.oo-ui-textInputWidget input:focus {
	border-color: var(--color-progressive, #36c) !important;
	box-shadow: inset 0 0 0 1px var(--color-progressive, #36c) !important;
}
.oo-ui-buttonElement-framed.oo-ui-flaggedElement-progressive .oo-ui-buttonElement-button {
	background-color: var(--color-surface-0, #fff) !important;
	color: var(--color-progressive, #36c) !important;
	border: 1px solid var(--border-color-base, rgb(0 0 0 / 0.1)) !important;
	border-radius: var(--border-radius-base, 2px) !important;
}
.oo-ui-buttonElement-framed.oo-ui-flaggedElement-progressive .oo-ui-buttonElement-button:hover {
	background-color: var(--color-surface-2--hover, #eaecf0) !important;
	border-color: var(--color-progressive--hover, #4b77d6) !important;
}
.oo-ui-buttonElement-framed.oo-ui-flaggedElement-primary.oo-ui-flaggedElement-progressive .oo-ui-buttonElement-button {
	background-color: var(--color-progressive, #36c) !important;
	color: #fff !important;
	border: 1px solid var(--color-progressive, #36c) !important;
	border-radius: var(--border-radius-base, 2px) !important;
}
.oo-ui-buttonElement-framed.oo-ui-flaggedElement-primary.oo-ui-flaggedElement-progressive .oo-ui-buttonElement-button:hover {
	background-color: var(--color-progressive--hover, #4b77d6) !important;
	border-color: var(--color-progressive--hover, #4b77d6) !important;
}
.ve-ui-mwFloatingHelpElement-toggle.oo-ui-buttonElement-framed.oo-ui-flaggedElement-progressive > .oo-ui-buttonElement-button {
	border-radius: 50% !important;
}
.oo-ui-window-frame .oo-ui-buttonElement-framed.oo-ui-flaggedElement-safe .oo-ui-buttonElement-button,
.oo-ui-window-frame .oo-ui-buttonElement-frameless .oo-ui-buttonElement-button {
	border-radius: var(--border-radius-base, 4px) !important;
	transition-property: background-color, border-color, color;
	transition-duration: var(--transition-duration-base, 100ms);
}
.oo-ui-window-frame .oo-ui-buttonElement-framed.oo-ui-flaggedElement-safe .oo-ui-buttonElement-button {
	background-color: transparent !important;
	color: var(--color-base, #202122) !important;
}
.oo-ui-window-frame .oo-ui-buttonElement-framed.oo-ui-flaggedElement-safe .oo-ui-buttonElement-button:hover,
.oo-ui-window-frame .oo-ui-buttonElement-frameless.oo-ui-widget-enabled .oo-ui-buttonElement-button:hover {
	background-color: var(--background-color-interactive-subtle--hover, #eaecf0) !important;
}
.oo-ui-window-frame .oo-ui-buttonElement-framed.oo-ui-flaggedElement-safe .oo-ui-buttonElement-button:active,
.oo-ui-window-frame .oo-ui-buttonElement-frameless.oo-ui-widget-enabled .oo-ui-buttonElement-button:active {
	background-color: var(--background-color-interactive, #eaecf0) !important;
}
.oo-ui-buttonElement-framed.oo-ui-flaggedElement-destructive .oo-ui-buttonElement-button,
.oo-ui-buttonElement-framed.oo-ui-flaggedElement-secondary .oo-ui-buttonElement-button {
	background-color: transparent !important;
	color: var(--color-base, #202122) !important;
	border: 1px solid var(--border-color-base, rgb(0 0 0 / 0.1)) !important;
	border-radius: var(--border-radius-base, 4px) !important;
}
.mw-editform:has(.ext-WikiEditor-ResizingDragBar) .editOptions {
	border-top-left-radius: 0;
	border-top-right-radius: 0;
}
.wikiEditor-ui .wikiEditor-ui-view {
	border: 0 !important;
}
.wikiEditor-ui .wikiEditor-ui-top {
	position: sticky !important;
	top: var(--header-offset-block-start, 0px) !important;
	border-bottom: 0 !important;
	box-shadow: 0 1px 0 0 var(--border-color-base, rgb(0 0 0 / 0.1)) !important;
	z-index: 100;
	transition-timing-function: var(--transition-timing-function-ease, ease);
	transition-duration: var(--transition-duration-medium, 250ms);
	transition-property: top;
}
.wikiEditor-ui .wikiEditor-ui-top::before {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	z-index: -100;
	display: block;
	height: 100%;
	content: "";
	background-color: var(--color-surface-0, #fff);
	filter: opacity(0.9);
	-webkit-backdrop-filter: var(--backdrop-filter-frosted-glass, none);
	backdrop-filter: var(--backdrop-filter-frosted-glass, none);
}
.wikiEditor-ui-toolbar {
	background-color: var(--color-surface-0, #fff) !important;
	box-shadow: none !important;
}
.wikiEditor-ui textarea {
	width: 100%;
	border: 0;
}
.wikiEditor-ui textarea:focus {
	outline: 0;
}
.wikiEditor-ui .wikiEditor-ui-left {
	float: left;
	width: 100%;
}
.wikiEditor-ui .wikiEditor-ui-right {
	float: right;
	background: var(--background-color-neutral-subtle, #f8f9fa);
	overflow: hidden;
}
.wikiEditor-ui-toolbar .group,
.wikiEditor-ui-toolbar .section-secondary .group {
	border-color: var(--border-color-muted, rgb(0 0 0 / 0.03)) !important;
}
.wikiEditor-ui-toolbar .tabs,
.wikiEditor-ui-toolbar .section-main,
.wikiEditor-ui-toolbar .section-secondary {
	min-height: 42px;
	position: relative;
	float: left;
	height: 100%;
}
.wikiEditor-ui-toolbar .section-secondary {
	float: right;
}
.wikiEditor-ui-toolbar .section-secondary .group {
	padding-right: 0;
	border-left: 1px solid var(--border-color-muted, rgb(0 0 0 / 0.03));
	border-right: 0;
}
.wikiEditor-ui-toolbar .sections {
	float: left;
	width: 100%;
	clear: both;
}
.wikiEditor-ui-toolbar .sections .section {
	float: left;
	width: 100%;
	border-top: 1px solid var(--border-color-subtle, rgb(0 0 0 / 0.05));
}
.wikiEditor-ui-toolbar .sections .section-hidden {
	display: none;
}
.wikiEditor-ui-toolbar .sections .section-advanced:not(.section-hidden) {
	display: flex;
	overflow: auto;
}
.wikiEditor-ui-toolbar .group {
	min-height: 32px;
	margin: 0;
	padding-right: 0;
}
.wikiEditor-ui-toolbar .section-secondary .group {
	border-left: 1px solid var(--border-color-muted, rgb(0 0 0 / 0.03));
}
.wikiEditor-ui-toolbar .group-search {
	float: right;
	border-right: 0;
}
.wikiEditor-ui-toolbar .tabs span.tab a,
.wikiEditor-ui-toolbar .group .tool-select .label {
	display: flex !important;
	column-gap: var(--space-xxs, 4px);
	align-items: center;
	height: 42px !important;
	padding-inline: var(--space-xs, 8px);
	font-weight: var(--font-weight-medium, 500);
	color: var(--color-emphasized, #000) !important;
	text-decoration: none;
	filter: none;
}
.wikiEditor-ui-toolbar .tabs span.tab a::before,
.wikiEditor-ui-toolbar .group .tool-select .label::before,
.wikiEditor-ui-toolbar .tabs span.tab a::after,
.wikiEditor-ui-toolbar .group .tool-select .label::after {
	position: relative;
	inset: unset;
	opacity: var(--opacity-icon-base, 0.87);
	filter: var(--filter-invert, none);
}
.wikiEditor-ui-toolbar .tabs span.tab a:hover,
.wikiEditor-ui-toolbar .group .tool-select .label:hover {
	color: var(--color-emphasized, #000) !important;
	background-color: var(--background-color-button-quiet--hover, rgba(0, 0, 0, 0.027)) !important;
}
.wikiEditor-ui-toolbar .tabs span.tab a:active,
.wikiEditor-ui-toolbar .group .tool-select .label:active {
	color: var(--color-emphasized, #000) !important;
	background-color: var(--background-color-button-quiet--active, rgba(0, 0, 0, 0.082)) !important;
}
.wikiEditor-ui-toolbar .tabs {
	display: flex !important;
	max-width: 100%;
	margin-inline: 0;
	overflow: auto;
	white-space: nowrap;
	list-style: none;
}
.wikiEditor-ui-toolbar .tabs span.tab {
	position: relative;
	float: left;
	line-height: 42px;
}
.wikiEditor-ui-toolbar .tabs span.tab a:visited {
	color: var(--color-emphasized, #000) !important;
}
.wikiEditor-ui-toolbar .tabs span.tab a.current,
.wikiEditor-ui-toolbar .tabs span.tab a.current:visited {
	color: var(--color-progressive, #36c) !important;
	box-shadow: inset 0 -2px 0 0 var(--color-progressive, #36c);
}
.wikiEditor-ui-toolbar .group .label {
	float: left;
	border: 0;
	height: 38px !important;
	margin: 0 0 0 16px;
	font-size: var(--font-size-small, 0.875rem);
	font-weight: var(--font-weight-medium, 500);
	line-height: 38px;
	color: var(--color-subtle, #54595d) !important;
	cursor: default;
}
.wikiEditor-ui-toolbar .group .tool-select {
	float: left;
	background-color: transparent !important;
	height: 42px !important;
	margin: 0 !important;
	border: 0 !important;
	padding: 0;
	cursor: pointer;
}
.wikiEditor-ui-toolbar .group .tool-select .label {
	position: relative;
	font-size: inherit;
	line-height: 42px;
	letter-spacing: inherit;
	height: 42px !important;
	padding: 0 26px 0 8px;
	margin: 0;
	cursor: pointer;
}
.wikiEditor-ui-toolbar .group .tool-select .label::after {
	height: 42px;
}
.wikiEditor-ui-toolbar .group .tool-select .options {
	background-color: var(--background-color-base, #fff);
	border: 1px solid var(--border-color-subtle, rgb(0 0 0 / 0.05));
}
.wikiEditor-ui-toolbar .group .tool-select .menu .options {
	margin-top: 42px;
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
}
.wikiEditor-ui-toolbar .group .tool-select .options .option {
	color: var(--color-emphasized, #000) !important;
}
.wikiEditor-ui-toolbar .group .tool-select .options .option:hover {
	background-color: var(--background-color-progressive-subtle, #f1f4fd) !important;
}
.wikiEditor-ui-toolbar .group .tool-select .menu .options .option:hover {
	background-color: var(--background-color-button-quiet--hover, rgba(0, 0, 0, 0.027)) !important;
}
.wikiEditor-ui-toolbar .group .tool-select .options .option[rel="heading-2"] {
	font-size: var(--font-size-xx-large, 1.5rem);
	font-weight: var(--font-weight-semi-bold, 600);
	line-height: var(--line-height-xx-large, 2rem);
}
.wikiEditor-ui-toolbar .group .tool-select .options .option[rel="heading-3"] {
	font-size: var(--font-size-x-large, 1.25rem);
	font-weight: var(--font-weight-semi-bold, 600);
	line-height: var(--line-height-x-large, 1.75rem);
}
.wikiEditor-ui-toolbar .group .tool-select .options .option[rel="heading-4"] {
	font-size: var(--font-size-large, 1.125rem);
	font-weight: var(--font-weight-semi-bold, 600);
	line-height: var(--line-height-large, 1.5rem);
}
.wikiEditor-ui-toolbar .group .tool-select .options .option[rel="heading-5"] {
	font-size: var(--font-size-medium, 1rem);
	font-weight: var(--font-weight-semi-bold, 600);
}
.wikiEditor-ui-toolbar .tool.oo-ui-buttonElement-frameless.oo-ui-iconElement > .oo-ui-buttonElement-button {
	min-width: 42px;
	min-height: 42px;
	border-radius: var(--border-radius-base, 4px);
}
.wikiEditor-ui-toolbar .tool.oo-ui-buttonElement-frameless.oo-ui-iconElement > .oo-ui-buttonElement-button > .oo-ui-iconElement-icon {
	left: 0.78571429em;
	opacity: var(--opacity-icon-base, 0.87);
}
.wikiEditor-ui-toolbar .tool.oo-ui-buttonElement-frameless.oo-ui-iconElement > .oo-ui-buttonElement-button:hover {
	background-color: var(--background-color-button-quiet--hover, rgba(0, 0, 0, 0.027));
}
.wikiEditor-ui-toolbar .tool.oo-ui-buttonElement-frameless.oo-ui-iconElement > .oo-ui-buttonElement-button:hover > .oo-ui-iconElement-icon {
	opacity: var(--opacity-icon-base--hover, 1);
}
.wikiEditor-ui-toolbar .tool.oo-ui-buttonElement-frameless.oo-ui-iconElement > .oo-ui-buttonElement-button:active {
	background-color: var(--background-color-button-quiet--active, rgba(0, 0, 0, 0.082));
}
.wikiEditor-ui-toolbar .tool.oo-ui-buttonElement-frameless.oo-ui-iconElement > .oo-ui-buttonElement-button:active > .oo-ui-iconElement-icon {
	opacity: var(--opacity-icon-base--selected, 1);
}
.wikiEditor-ui-toolbar .tool.oo-ui-buttonElement-frameless.oo-ui-iconElement.tool-active > .oo-ui-buttonElement-button {
	background-color: var(--background-color-progressive-subtle, #f1f4fd);
}
.wikiEditor-ui-toolbar .ve-init-mw-editSwitch .oo-ui-popupToolGroup.oo-ui-iconElement {
	height: 42px;
}
.wikiEditor-ui-toolbar .ve-init-mw-editSwitch .oo-ui-popupToolGroup.oo-ui-iconElement .oo-ui-popupToolGroup-handle {
	padding-top: 42px;
	border-radius: var(--border-radius-base, 4px);
}
.wikiEditor-ui-toolbar .booklet > .index {
	float: left;
	width: 20%;
	height: 125px;
	overflow: hidden auto;
	resize: horizontal;
	min-width: 6em;
	max-width: 50%;
}
.wikiEditor-ui-toolbar .booklet > .index > div {
	padding: 4px 4px 4px 6px;
	cursor: pointer;
}
.wikiEditor-ui-toolbar .booklet > .index > :hover {
	background-color: var(--background-color-interactive, #eaecf0);
}
.wikiEditor-ui-toolbar .booklet > .index > .current {
	background-color: var(--background-color-progressive-subtle, #f1f4fd);
	color: var(--color-progressive, #36c);
}
.wikiEditor-ui-toolbar .booklet .pages {
	height: 125px;
	overflow: auto;
}
.wikiEditor-ui-toolbar .page-characters {
	padding-bottom: 5px;
}
.wikiEditor-ui-toolbar .page-characters div {
	display: flex;
	flex-wrap: wrap;
	gap: var(--space-xxs, 4px);
	padding: var(--space-xxs, 4px);
}
.wikiEditor-ui-toolbar .page-characters div span {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2rem;
	height: 2rem;
	padding: 0;
	margin: 0;
	font-family: var(--font-family-monospace, monospace);
	font-size: 1.25em;
	line-height: 1;
	border: 0 !important;
	border-radius: var(--border-radius-base, 4px);
	color: var(--color-base, #202122);
	text-decoration: none;
	cursor: pointer;
}
.wikiEditor-ui-toolbar .page-characters div span:hover {
	background-color: var(--background-color-button-quiet--hover, rgba(0, 0, 0, 0.027)) !important;
	text-decoration: none;
}
.wikiEditor-ui-toolbar .page-characters div span:active {
	background-color: var(--background-color-button-quiet--active, rgba(0, 0, 0, 0.082)) !important;
}
.wikiEditor-ui-toolbar .page-characters div .wikiEditor-character-highlighted {
	background-color: #7db1c5;
	color: var(--color-base, #202122);
}
.wikiEditor-ui-toolbar .booklet > .index .wikiEditor-character-highlighted {
	background-color: rgba(41, 98, 204, 0.1);
	color: var(--color-base, #202122);
}
.wikiEditor-ui-toolbar .page-table {
	padding-left: 5px;
	padding-right: 5px;
}
.wikiEditor-ui-toolbar .page-table table {
	background: none;
	border-collapse: collapse;
	width: 100%;
}
.wikiEditor-ui-toolbar .page-table th {
	color: var(--color-subtle, #54595d);
}
.wikiEditor-ui-toolbar .page-table td {
	color: var(--color-base, #202122);
	border-top: 1px solid var(--border-color-subtle, rgb(0 0 0 / 0.05));
}
.wikiEditor-ui-toolbar .page-table th,
.wikiEditor-ui-toolbar .page-table td {
	margin: 0;
	padding: 5px;
	text-align: left;
}
.wikiEditor-ui-toolbar .section-help .page-table .cell {
	vertical-align: top;
}
.wikiEditor-ui-toolbar .section-help .page-table .cell-syntax {
	font-family: monospace, "Courier";
}
.wikiEditor-ui-toolbar .section-help .page-table .cell-syntax,
.wikiEditor-ui-toolbar .section-help .page-table .cell-result {
	width: 40%;
}
.wikiEditor-ui-toolbar .section-help .page-table .cell-description {
	width: 20%;
}
.wikiEditor-toolbar-dialog .ui-dialog-content {
	padding: var(--space-md, 16px) !important;
}
.wikiEditor-toolbar-dialog .ui-dialog-content fieldset {
	border: 0 !important;
	margin: 0 !important;
	padding: 0 !important;
}
.wikiEditor-toolbar-dialog .ui-dialog-content input[type="text"] {
	box-sizing: border-box;
}
.wikiEditor-toolbar-dialog .ui-dialog-content input[type="radio"],
.wikiEditor-toolbar-dialog .ui-dialog-content input[type="checkbox"] {
	margin-left: 0;
}
.wikiEditor-toolbar-dialog .ui-dialog-titlebar-close {
	padding: 0;
}
body .wikiEditor-toolbar-dialog .ui-dialog-titlebar-close {
	right: 0.9em;
}
.wikiEditor-toolbar-dialog .ui-dialog-buttonpane {
	border-top-color: var(--border-color-base, rgb(0 0 0 / 0.1)) !important;
}
.wikiEditor-toolbar-dialog .wikieditor-toolbar-field-wrapper > label {
	color: var(--color-subtle, #54595d);
	font-family: var(--font-family-overline, sans-serif);
	font-size: var(--font-size-overline, 0.75rem);
	font-weight: var(--font-weight-overline, 600);
	line-height: var(--line-height-overline, 1rem);
	text-transform: var(--text-transform-overline, uppercase);
	letter-spacing: var(--letter-spacing-overline, 0.05em);
}
.wikiEditor-toolbar-dialog .wikieditor-toolbar-field-wrapper > label ~ input,
.wikiEditor-toolbar-dialog .wikieditor-toolbar-field-wrapper > label ~ select {
	margin-top: var(--space-xxs, 4px);
}
.wikiEditor-toolbar-dialog .wikieditor-toolbar-field-wrapper > input + label {
	margin-left: var(--space-xs, 8px);
	font-size: inherit;
	color: var(--color-base, #202122);
	letter-spacing: inherit;
}
.wikieditor-toolbar-field-wrapper {
	padding: 0 0 25px 0;
}
.wikieditor-toolbar-floated-field-wrapper {
	float: left;
	margin-right: 2em;
}
#wikieditor-toolbar-replace-search,
#wikieditor-toolbar-replace-replace {
	width: 100%;
}
#wikieditor-toolbar-table-dialog fieldset {
	width: 218px;
	padding: 0;
	float: left;
}
#wikieditor-toolbar-table-dialog .wikieditor-toolbar-table-preview-wrapper {
	width: 330px;
	padding: 0;
	float: right;
}
.wikieditor-toolbar-table-preview-content * {
	cursor: default;
}
.wikiEditor-toolbar-dialog .wikieditor-toolbar-table-preview-wrapper table {
	width: 100% !important;
}
.wikiEditor-toolbar-dialog .wikieditor-toolbar-table-preview-content table td {
	padding: 10px 4px !important;
	height: auto !important;
}
.wikiEditor-toolbar-dialog .wikieditor-toolbar-table-preview-content table th {
	padding: 7px 3px !important;
}
.wikieditor-toolbar-table-dimension-fields .wikieditor-toolbar-field-wrapper {
	float: left;
	margin-right: 20px;
	vertical-align: bottom;
}
.wikieditor-toolbar-dialog-wrapper {
	width: 100%;
}
#wikieditor-toolbar-file-target,
#wikieditor-toolbar-file-caption,
#wikieditor-toolbar-file-alt {
	width: 100%;
}
.wikieditor-toolbar-file-alt-help {
	float: right;
}
.wikieditor-toolbar-file-options .wikieditor-toolbar-field-wrapper {
	float: left;
	margin: 0 20px 0 0;
}
#wikieditor-toolbar-file-dialog + .ui-dialog-buttonpane .ui-dialog-buttonset {
	width: 100%;
	text-align: right;
}
#wikieditor-toolbar-file-dialog + .ui-dialog-buttonpane .ui-dialog-buttonset .ui-button:last-child {
	float: left;
}
body.rtl .wikiEditor-toolbar-dialog .ui-dialog-buttonpane button {
	float: left;
	margin: 0.5em 0.4em 0.5em 0 !important;
}
.wikiEditor-ui .CodeMirror {
	line-height: 1.5em;
	padding: 0.1em;
	clear: both;
	box-sizing: border-box;
}
.wikiEditor-ui .CodeMirror pre,
.wikiEditor-ui .CodeMirror .CodeMirror-lines {
	padding: 0;
}
.mw-wikiEditor-InsertLink-TitleInputField .oo-ui-messageWidget {
	color: var(--color-subtle, #54595d);
	font-weight: 400;
}
.mw-wikiEditor-InsertLink-LinkTypeField .oo-ui-radioOptionWidget {
	display: inline-block;
	margin-left: 1em;
}
.mw-wikiEditor-InsertLink-LinkTypeField .oo-ui-radioOptionWidget:first-child {
	margin-left: 0;
}
.mw-editform #wpTextbox1 {
	padding: 0;
	padding-bottom: var(--space-lg, 1.25rem);
	background-color: transparent;
	border: 0;
}
.mw-editform #wpTextbox1:focus {
	outline: 0;
}
.mw-editform .editOptions {
	padding: var(--space-lg, 1.25rem);
	font-size: var(--font-size-small, 0.875rem);
	color: var(--color-base);
	background-color: var(--color-surface-2);
	border: 0;
	border-radius: var(--border-radius-large, 12px);
}
.mw-editform #editpage-copywarn {
	margin-top: var(--space-sm, 0.75rem);
	margin-bottom: var(--space-sm, 0.75rem);
	color: var(--color-subtle);
	font-size: var(--font-size-small, 0.875rem);
	line-height: var(--line-height-small, 1.375rem);
}
.mw-editform .editButtons {
	margin-top: var(--space-md, 1rem);
}

.oo-ui-buttonElement-button:not(.oo-ui-window-frame),
.oo-ui-dropdownWidget-handle,
.oo-ui-checkboxInputWidget-checkIcon,
.oo-ui-inputWidget-input,
.oo-ui-textInputWidget input,
.oo-ui-textInputWidget textarea,
.oo-ui-popupWidget,
.mw-ui-button,
.cdx-checkbox__icon,
.cdx-dialog:not(.mw-mmv-dialog):not(.oo-ui-dialog),
.cdx-select,
.cdx-select-vue__handle,
select,
textarea,
:where(input:not([type="checkbox"]):not([type="radio"]):not([type="range"])),
button:not([class]),
input[type="submit"]:not([class]),
input[type="button"]:not([class]),
input[type="reset"]:not([class]) {
	border-radius: var(--border-radius-base, 4px) !important;
}

.cdx-button {
	border-radius: var(--border-radius-base, 4px) !important;
}

.citizen-cdx-button--size-large.cdx-button:not(.cdx-button--icon-only) {
	border-radius: var(--border-radius-medium, 8px) !important;
}

.oo-ui-panelLayout,
.mw-htmlform-ooui-wrapper {
	border: 0 !important;
	border-radius: 0 !important;
}

.citizen-page-actions .mw-portlet li.mw-list-item > a,
.citizen-menu__card-content .mw-list-item > a,
.vector-menu-content-list .mw-list-item > a {
	border-radius: var(--border-radius-base, 4px) !important;
}

.citizen-page-actions .mw-portlet li.mw-list-item > a.citizen-cdx-button--size-large:not(.cdx-button--icon-only) {
	border-radius: var(--border-radius-medium, 8px) !important;
}

button:not([class]),
input[type="submit"]:not([class]),
input[type="button"]:not([class]),
input[type="reset"]:not([class]) {
	min-height: 32px;
	padding: 0 12px;
	font-family: inherit;
	font-size: inherit;
	border: 1px solid var(--border-color-base, #a2a9b1);
	background-color: var(--background-color-interactive-subtle, #f8f9fa);
	color: var(--color-base, #202122);
	cursor: pointer;
}

input:not([type]):not([class]),
input[type="text"]:not([class]),
input[type="search"]:not([class]),
input[type="email"]:not([class]),
input[type="url"]:not([class]),
input[type="tel"]:not([class]),
input[type="password"]:not([class]),
input[type="number"]:not([class]),
select:not([class]) {
	height: 32px;
	padding: 0 8px;
	font-family: inherit;
	font-size: inherit;
	line-height: 30px;
	border: 1px solid var(--border-color-base, #a2a9b1);
	background-color: var(--background-color-base, #fff);
	color: var(--color-base, #202122);
}
textarea:not([class]) {
	padding: 5px 8px;
	font-family: inherit;
	font-size: inherit;
	border: 1px solid var(--border-color-base, #a2a9b1);
	background-color: var(--background-color-base, #fff);
	color: var(--color-base, #202122);
}

.mw-ui-button {
	min-height: 32px;
	font-family: inherit;
	font-size: inherit;
}
.cdx-button {
	min-height: 32px;
	font-family: inherit;
}


.oo-ui-buttonElement.oo-ui-labelElement > .oo-ui-buttonElement-button,
.oo-ui-buttonElement.oo-ui-labelElement > .oo-ui-buttonElement-button > .oo-ui-labelElement-label,
.oo-ui-dropdownWidget-handle .oo-ui-labelElement-label {
	line-height: 20px !important;
}
.oo-ui-processDialog .oo-ui-actionWidget > .oo-ui-buttonElement-button,
.oo-ui-processDialog .oo-ui-actionWidget > .oo-ui-buttonElement-button > .oo-ui-labelElement-label {
	line-height: 1.42857143em !important;
}

.oo-ui-textInputWidget input {
	height: 32px;
	padding-block: 0;
	line-height: 30px;
}
.oo-ui-tagMultiselectWidget .oo-ui-inputWidget-input,
.oo-ui-tagMultiselectWidget-handle .oo-ui-inputWidget-input,
.oo-ui-tokensWidget .oo-ui-inputWidget-input {
	background-color: transparent !important;
	border: 0 !important;
	border-radius: 0 !important;
	box-shadow: none !important;
}
.oo-ui-tagMultiselectWidget-handle {
	border-radius: var(--border-radius-base, 4px) !important;
}
.oo-ui-tagMultiselectWidget.oo-ui-tagMultiselectWidget-outlined .oo-ui-tagMultiselectWidget-handle {
	border-bottom-right-radius: 0 !important;
	border-bottom-left-radius: 0 !important;
}
.oo-ui-actionFieldLayout .oo-ui-actionFieldLayout-input > .oo-ui-widget .oo-ui-tagMultiselectWidget-handle {
	border-radius: var(--border-radius-base, 4px) 0 0 var(--border-radius-base, 4px) !important;
}
.oo-ui-comboBoxInputWidget .oo-ui-inputWidget-input {
	border-top-right-radius: 0 !important;
	border-bottom-right-radius: 0 !important;
}
.oo-ui-comboBoxInputWidget.oo-ui-comboBoxInputWidget-empty .oo-ui-inputWidget-input,
.oo-ui-comboBoxInputWidget-php .oo-ui-inputWidget-input {
	border-top-right-radius: var(--border-radius-base, 4px) !important;
	border-bottom-right-radius: var(--border-radius-base, 4px) !important;
}
.oo-ui-comboBoxInputWidget-dropdownButton.oo-ui-indicatorElement .oo-ui-buttonElement-button,
.oo-ui-comboBoxInputWidget-dropdownButton.oo-ui-indicatorElement .oo-ui-buttonElement-button:focus {
	border-top-left-radius: 0 !important;
	border-bottom-left-radius: 0 !important;
}
.oo-ui-numberInputWidget-buttoned .oo-ui-inputWidget-input {
	border-radius: 0 !important;
}
.oo-ui-numberInputWidget-minusButton > .oo-ui-buttonElement-button {
	border-top-right-radius: 0 !important;
	border-bottom-right-radius: 0 !important;
}
.oo-ui-numberInputWidget-plusButton > .oo-ui-buttonElement-button {
	border-top-left-radius: 0 !important;
	border-bottom-left-radius: 0 !important;
}
.oo-ui-selectFileInputWidget-dropTarget {
	border-radius: var(--border-radius-base, 4px) !important;
}
.oo-ui-actionFieldLayout .oo-ui-actionFieldLayout-input > .oo-ui-widget.oo-ui-textInputWidget > .oo-ui-inputWidget-input,
.oo-ui-actionFieldLayout .oo-ui-actionFieldLayout-input > .oo-ui-widget .oo-ui-dropdownWidget-handle {
	border-radius: var(--border-radius-base, 4px) 0 0 var(--border-radius-base, 4px) !important;
}
.oo-ui-actionFieldLayout .oo-ui-actionFieldLayout-button .oo-ui-buttonElement-framed > .oo-ui-buttonElement-button {
	border-radius: 0 var(--border-radius-base, 4px) var(--border-radius-base, 4px) 0 !important;
}

.oo-ui-checkboxInputWidget [type="checkbox"],
.oo-ui-checkboxInputWidget [type="checkbox"] + span,
.oo-ui-radioInputWidget [type="radio"],
.oo-ui-radioInputWidget [type="radio"] + span {
	width: 20px !important;
	height: 20px !important;
}
.oo-ui-radioInputWidget [type="radio"] + span {
	background-color: var(--background-color-base, #fff) !important;
}

.oo-ui-buttonGroupWidget,
.oo-ui-buttonSelectWidget {
	border-radius: var(--border-radius-base, 4px) !important;
}
.oo-ui-buttonGroupWidget .oo-ui-buttonElement-framed .oo-ui-buttonElement-button,
.oo-ui-buttonSelectWidget .oo-ui-buttonOptionWidget .oo-ui-buttonElement-button {
	border-radius: 0 !important;
}
.oo-ui-buttonGroupWidget .oo-ui-buttonElement-framed:first-child .oo-ui-buttonElement-button,
.oo-ui-buttonSelectWidget .oo-ui-buttonOptionWidget:first-child .oo-ui-buttonElement-button {
	border-top-left-radius: var(--border-radius-base, 4px) !important;
	border-bottom-left-radius: var(--border-radius-base, 4px) !important;
}
.oo-ui-buttonGroupWidget .oo-ui-buttonElement-framed:last-child .oo-ui-buttonElement-button,
.oo-ui-buttonSelectWidget .oo-ui-buttonOptionWidget:last-child .oo-ui-buttonElement-button {
	border-top-right-radius: var(--border-radius-base, 4px) !important;
	border-bottom-right-radius: var(--border-radius-base, 4px) !important;
}
.oo-ui-tabOptionWidget {
	font-weight: var(--font-weight-medium, 500);
}
.oo-ui-tabSelectWidget-framed .oo-ui-tabOptionWidget {
	border-top-left-radius: var(--border-radius-base, 4px);
	border-top-right-radius: var(--border-radius-base, 4px);
}
.oo-ui-tabSelectWidget-framed .oo-ui-tabOptionWidget.oo-ui-widget-enabled:hover {
	background-color: var(--background-color-button-quiet--hover, rgba(0, 0, 0, 0.027));
}
.oo-ui-tabSelectWidget-framed .oo-ui-tabOptionWidget.oo-ui-widget-enabled:active {
	background-color: var(--background-color-button-quiet--active, rgba(0, 0, 0, 0.082));
}
.oo-ui-tabSelectWidget-frameless.oo-ui-widget-enabled:focus .oo-ui-tabOptionWidget.oo-ui-optionWidget-selected {
	border-radius: var(--border-radius-base, 4px);
}

.oo-ui-buttonElement > .oo-ui-buttonElement-button,
.mw-ui-button,
.cdx-button,
button:not([class]),
input[type="submit"]:not([class]),
input[type="button"]:not([class]),
input[type="reset"]:not([class]) {
	font-weight: var(--font-weight-medium, 500);
}

body > .oo-ui-windowManager,
#mw-teleport-target > .oo-ui-windowManager {
	font-size: 1rem !important;
}
body > .oo-ui-windowManager.cv-prefs-windowmanager {
	font-size: 0.875rem !important;
}
.oo-ui-windowManager-modal > .oo-ui-dialog > .oo-ui-window-frame {
	background-color: var(--color-surface-1, #f8f9fa) !important;
}
.oo-ui-windowManager-modal .oo-ui-window-content {
	background-color: transparent !important;
}
.oo-ui-windowManager-modal:not(.oo-ui-windowManager-size-full) > .oo-ui-dialog > .oo-ui-window-frame {
	border-radius: var(--border-radius-medium, 8px) !important;
	box-shadow: var(--box-shadow-large) !important;
}
.oo-ui-processDialog .oo-ui-processDialog-navigation .oo-ui-actionWidget > .oo-ui-buttonElement-button,
.oo-ui-processDialog .oo-ui-processDialog-actions-other .oo-ui-actionWidget > .oo-ui-buttonElement-button {
	border-radius: 0 !important;
}
.oo-ui-processDialog .oo-ui-processDialog-navigation .oo-ui-processDialog-actions-primary .oo-ui-actionWidget > .oo-ui-buttonElement-button {
	border-top-right-radius: var(--border-radius-medium, 8px) !important;
}
.oo-ui-processDialog .oo-ui-processDialog-navigation .oo-ui-processDialog-actions-safe .oo-ui-actionWidget > .oo-ui-buttonElement-button {
	border-top-left-radius: var(--border-radius-medium, 8px) !important;
}
.oo-ui-processDialog-title {
	font-weight: var(--font-weight-semi-bold, 600);
}
.oo-ui-messageDialog-actions .oo-ui-actionWidget .oo-ui-buttonElement-button {
	border: 0 !important;
	border-radius: 0 !important;
}
.oo-ui-messageDialog-actions-horizontal .oo-ui-actionWidget:first-child > .oo-ui-buttonElement-button {
	border-radius: 0 0 0 var(--border-radius-medium, 8px) !important;
}
.oo-ui-messageDialog-actions-horizontal .oo-ui-actionWidget:last-child > .oo-ui-buttonElement-button {
	border-radius: 0 0 var(--border-radius-medium, 8px) 0 !important;
}
.oo-ui-messageDialog-actions-horizontal .oo-ui-actionWidget:only-child > .oo-ui-buttonElement-button {
	border-radius: 0 0 var(--border-radius-medium, 8px) var(--border-radius-medium, 8px) !important;
}
.oo-ui-messageDialog-actions-vertical .oo-ui-actionWidget:last-child > .oo-ui-buttonElement-button {
	border-radius: 0 0 var(--border-radius-medium, 8px) var(--border-radius-medium, 8px) !important;
}
.oo-ui-messageDialog-actions .oo-ui-actionWidget > .oo-ui-buttonElement-button,
.oo-ui-messageDialog-actions .oo-ui-actionWidget > .oo-ui-buttonElement-button > .oo-ui-labelElement-label {
	line-height: 2.85714286em !important;
}

.mw-prefs-search.oo-ui-fieldLayout {
	width: auto;
	padding-block: var(--space-xs);
	margin: 0;
	position: sticky;
	transition-timing-function: var(--transition-timing-function-ease);
	transition-duration: var(--transition-duration-medium);
	transition-property: top;
	box-shadow: 0 1px 0 0 var(--border-color-base);
	z-index: 100;
	top: var(--header-offset-block-start) !important;
}
.citizen-sticky-header-visible .mw-prefs-search.oo-ui-fieldLayout {
	--header-offset-block-start: calc(var(--header-size-block-start) + var(--height-sticky-header));
}
.citizen-feature-autohide-navigation-clientpref-1 .citizen-scroll--down .mw-prefs-search.oo-ui-fieldLayout {
	--header-offset-block-start: 0px;
}
.mw-prefs-search.oo-ui-fieldLayout::before {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	z-index: -100;
	display: block;
	height: 100%;
	content: "";
	background-color: var(--color-surface-0);
	filter: opacity(0.9);
	backdrop-filter: var(--backdrop-filter-frosted-glass);
}
.mw-prefs-search.oo-ui-fieldLayout .oo-ui-textInputWidget {
	max-width: none;
}
#preferences .mw-htmlform-submit-buttons {
	position: sticky;
	bottom: var(--header-size-block-end, 3.5rem);
	background-color: var(--background-color-base, #fff);
	padding: 16px 0;
	margin-inline: 0;
}
.mw-prefs-tabs-wrapper .oo-ui-tabSelectWidget-framed {
	display: flex;
}

.oo-ui-iconElement-icon.oo-ui-image-progressive,
.oo-ui-indicatorElement-indicator.oo-ui-indicator-progressive {
	filter: hue-rotate(calc((var(--color-primary-oklch__h, 262.29) - 262.29) * 0.74deg));
}

html body .citizen-body-container {
	padding: 0 32px;
}
#preferences .mw-body-content {
	max-width: 1080px;
}

@media (max-width: 1119.98px) {
	html body .citizen-body-container {
		padding: 0 var(--padding-page, 16px);
	}
	html body .citizen-footer {
		padding-left: var(--padding-page, 16px) !important;
		padding-right: var(--padding-page, 16px) !important;
		margin-bottom: var(--header-size-block-end, 3.5rem);
	}
	html body .citizen-header__logo {
		display: flex;
	}
	html body .citizen-sticky-header-start {
		margin-inline-start: 0 !important;
	}
}

@media (max-width: 687.98px) {
	html body .mw-parser-output .infobox:not(.wikitable) {
		float: none !important;
		clear: none !important;
		width: 100% !important;
		max-width: 100% !important;
		margin-inline: 0 !important;
	}
}

@media (max-width: 639.98px) {
	html body .mw-parser-output .navbox table {
		display: table !important;
		width: 100% !important;
		max-width: none !important;
		overflow: visible !important;
	}
	html body .mw-parser-output .navbox {
		overflow-x: auto !important;
		overflow-y: hidden !important;
	}
}

@media (max-width: 639.98px) {
	html body .mw-parser-output .infobox:not(.wikitable) {
		display: table !important;
	}
}

@media (max-width: 687.98px) {
	html body .mw-parser-output .infobox.cv-factbox-collapsed > tbody > tr:not(.cv-factbox-head),
	html body .mw-parser-output .infobox.cv-factbox-collapsed > tr:not(.cv-factbox-head),
	html body .mw-parser-output .infobox.cv-factbox-collapsed > caption {
		display: none !important;
	}
	html body .mw-parser-output .infobox.cv-factbox-collapsed:has(> caption.infobox-title) {
		border-top: 1px solid var(--border-color-base, #a2a9b1) !important;
		border-top-left-radius: var(--border-radius-medium, 2px) !important;
		border-top-right-radius: var(--border-radius-medium, 2px) !important;
	}
	html body .mw-parser-output .infobox:not(.wikitable) > thead > tr.cv-factbox-head > th {
		box-sizing: border-box;
		padding: var(--space-sm, 12px) var(--space-md, 16px) !important;
		border: 0 !important;
		font-size: var(--font-size-small, 0.875rem);
		font-weight: 400;
		line-height: 1.375;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition: background var(--transition-duration-base, 100ms) ease;
	}
	.cv-factbox-head__inner {
		display: flex;
		align-items: center;
		gap: var(--space-xs, 8px);
		white-space: nowrap;
	}
	.cv-factbox-head__label {
		font-weight: 500;
	}
	html body .mw-parser-output .infobox:not(.wikitable) > thead > tr.cv-factbox-head .cv-factbox-head__desc {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		font-weight: 400;
		color: var(--color-subtle, #54595d) !important;
	}
	html body .mw-parser-output .infobox.cv-factbox-collapsed {
		display: block !important;
	}
	html body .mw-parser-output .infobox.cv-factbox-collapsed > thead,
	html body .mw-parser-output .infobox.cv-factbox-collapsed > thead > tr,
	html body .mw-parser-output .infobox.cv-factbox-collapsed > thead > tr.cv-factbox-head > th {
		display: block !important;
		width: 100% !important;
	}
	html body .mw-parser-output .infobox:not(.wikitable) > thead tr.cv-factbox-head .cv-factbox-head__arrow {
		flex: 0 0 auto;
		order: -1;
		width: var(--font-size-small, 0.875rem);
		height: var(--font-size-small, 0.875rem);
		background-color: currentColor !important;
		opacity: 0.6;
		-webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M10 14.5 3 7.5l1.4-1.4L10 11.7l5.6-5.6L17 7.5z'/%3E%3C/svg%3E") center / contain no-repeat;
		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M10 14.5 3 7.5l1.4-1.4L10 11.7l5.6-5.6L17 7.5z'/%3E%3C/svg%3E") center / contain no-repeat;
		transition: transform var(--transition-duration-base, 100ms) ease;
	}
	html body .mw-parser-output .infobox:not(.wikitable) > thead > tr.cv-factbox-head > th[aria-expanded="true"] .cv-factbox-head__arrow {
		transform: rotate(180deg);
	}
	@media (hover: hover) {
		html body .mw-parser-output .infobox:not(.wikitable) > thead > tr.cv-factbox-head > th:hover {
			background: var(--background-color-button-quiet--hover, rgba(0, 24, 73, 0.027)) !important;
		}
	}
	html body .mw-parser-output .infobox:not(.wikitable) > thead > tr.cv-factbox-head > th:focus-visible {
		outline: 2px solid var(--color-progressive, #36c);
		outline-offset: -2px;
	}
}

.mw-prefs-search.oo-ui-fieldLayout {
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.mw-prefs-search .oo-ui-textInputWidget input,
.mw-prefs-search input.oo-ui-inputWidget-input {
	background-color: var(--background-color-base, #fff);
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 4px;
	height: 36.57px;
	font-size: 16px;
	box-shadow: none;
}

#citizen-languages__card .citizen-menu__content-list,
#citizen-variants__card .citizen-menu__content-list,
#citizen-sticky-header-languages .citizen-menu__content-list,
#citizen-sticky-header-variants .citizen-menu__content-list {
	list-style: none;
	margin: 0;
	padding: 4px 0;
	text-align: start;
	font-size: 0.875rem;
	line-height: 1.5;
	color: var(--color-base, #202122);
}
#citizen-languages__card .citizen-menu__content-list > li,
#citizen-variants__card .citizen-menu__content-list > li,
#citizen-sticky-header-languages .citizen-menu__content-list > li,
#citizen-sticky-header-variants .citizen-menu__content-list > li {
	display: block;
	margin: 0;
	padding: 0;
}
#citizen-languages__card .citizen-menu__content-list > li > a,
#citizen-variants__card .citizen-menu__content-list > li > a,
#citizen-sticky-header-languages .citizen-menu__content-list > li > a,
#citizen-sticky-header-variants .citizen-menu__content-list > li > a {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 6px 16px;
	text-decoration: none;
	text-align: start;
	color: var(--color-base, #202122);
	font-size: 0.875rem;
}
#citizen-languages__card .citizen-menu__content-list > li > a:hover,
#citizen-variants__card .citizen-menu__content-list > li > a:hover,
#citizen-sticky-header-languages .citizen-menu__content-list > li > a:hover,
#citizen-sticky-header-variants .citizen-menu__content-list > li > a:hover {
	background-color: var(--background-color-interactive-subtle, #f8f9fa);
}
#citizen-languages__card .citizen-menu__heading,
#citizen-variants__card .citizen-menu__heading,
#citizen-sticky-header-languages .citizen-menu__heading,
#citizen-sticky-header-variants .citizen-menu__heading {
	text-align: start;
	font-size: 0.875rem;
	margin: 0;
	padding: 8px 16px 4px;
	color: var(--color-subtle, #54595d);
	font-weight: 600;
}

html body .citizen-page-heading.citizen-userinfo-host .firstHeading-container {
	position: relative;
}
html body .citizen-page-heading.citizen-userinfo-host .firstHeading-container .citizen-page-userinfo {
	display: block;
	position: static;
}
html body .citizen-page-heading.citizen-userinfo-host .firstHeading-container #citizen-userinfo__card {
	position: absolute;
	top: 100%;
	inset-inline-start: 0;
	inset-inline-end: auto;
	margin-top: 8px;
	margin-inline-start: 0;
	min-width: 0;
	max-width: min(90vw, 24rem);
	--citizen-clip-closed: var(--citizen-clip-expand-down);
	--citizen-translate-closed: var(--citizen-translate-expand-down);
}
html body .citizen-page-userinfo .citizen-userinfo-trigger {
	display: none;
}
html body .citizen-userinfo-title-trigger {
	position: absolute;
	inset: 0;
	z-index: 350;
	cursor: pointer;
}
html body .citizen-page-heading.citizen-userinfo-host .firstHeading-container #firstHeading {
	transition: opacity .1s ease;
}
html body .citizen-page-heading.citizen-userinfo-host .firstHeading-container:has(.citizen-userinfo-title-trigger:active) #firstHeading {
	opacity: .55;
}
html body .citizen-page-userinfo #citizen-userinfo-details {
	display: none;
}
html body .citizen-page-userinfo .citizen-menu__card-content {
	max-width: none;
	max-height: none;
	overflow: visible;
	padding: 0;
}
html body .citizen-page-userinfo .ext-checkuser-userinfocard-popover .cdx-popover {
	position: static !important;
	transform: none !important;
	max-width: none !important;
	max-height: none !important;
	background: none !important;
	border: 0 !important;
	border-radius: 0 !important;
	box-shadow: none !important;
	padding: 0 !important;
}
html body .citizen-page-userinfo .cdx-popover__backdrop {
	position: static !important;
	inset: auto !important;
	background: none !important;
}
html body .citizen-page-userinfo .cdx-popover__arrow {
	display: none !important;
}
html body:has(.citizen-page-userinfo) #ext-checkuser-userinfocard-popover {
	visibility: hidden !important;
}
html body .citizen-page-userinfo .citizen-menu__card-content #ext-checkuser-userinfocard-popover {
	visibility: visible !important;
}
html body .citizen-page-userinfo .ext-checkuser-userinfocard-header,
html body .citizen-page-userinfo .ext-checkuser-userinfocard-view {
	display: none !important;
}
html body .citizen-page-userinfo .citizen-userInfo {
	padding: var(--space-sm) var(--space-md) var(--space-md);
	margin: 0;
	border-bottom: 0;
}

html body .growthexperiments-homepage-module,
html body .se-card-image {
	border-radius: var(--border-radius-medium);
}
html body .ext-growthExperiments-ScoreCards > .ext-growthExperiments-ScoreCard {
	border-radius: 0;
}
html body .growthexperiments-homepage-module .suggested-edits-module-wrapper .suggested-edits-card-wrapper .suggested-edits-task-card-wrapper {
	box-sizing: content-box;
	border-radius: var(--border-radius-medium);
}

.citizen-preferences-radio {
	display: grid;
	grid-template-columns: repeat(var(--pref-columns, 2), 1fr);
	gap: var(--space-xxs);
}
.citizen-preferences-radio .cdx-radio,
.citizen-preferences-radio .cdx-radio__wrapper,
.citizen-preferences-radio .cdx-label,
.citizen-preferences-radio .cdx-label__label {
	width: 100%;
	min-width: 0;
	height: 100%;
}
.citizen-preferences-radio .cdx-radio { margin-bottom: 0; }
.citizen-preferences-radio .cdx-radio__icon { display: none; }
.citizen-preferences-radio .cdx-radio__wrapper { gap: 0; }
.citizen-preferences-radio .cdx-label.cdx-label { padding: 0; }
.citizen-preferences-card {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
	cursor: pointer;
	border: var(--border-width-thick) solid var(--border-color-base);
	border-radius: var(--border-radius-medium);
	transition-duration: var(--transition-duration-base);
	transition-property: border-color, background-color;
}
.cdx-radio:has(.cdx-radio__input:checked) .citizen-preferences-card {
	background-color: var(--background-color-progressive-subtle);
	border-color: var(--color-progressive);
}
.cdx-radio:has(.cdx-radio__input:focus-visible) .citizen-preferences-card {
	outline: 2px solid var(--color-progressive);
	outline-offset: 1px;
}
.citizen-preferences-card__label {
	padding: var(--space-xxs) var(--space-xs);
	font-size: var(--font-size-small);
	color: var(--color-subtle);
	text-align: center;
}
.cdx-radio:has(.cdx-radio__input:checked) .citizen-preferences-card__label {
	font-weight: var(--font-weight-semi-bold);
	color: var(--color-progressive);
}
.citizen-preferences-card__preview {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	aspect-ratio: 1.5;
	padding: var(--space-xs);
	color: var(--color-base);
	background-color: var(--color-surface-0);
	border-bottom: var(--border-subtle);
}
.citizen-preferences-card__preview .cdx-icon {
	width: 2rem;
	height: 2rem;
	color: inherit;
}

.cdx-field {
	margin: 16px 0 0;
	border: 0;
	padding: 0;
}
.cdx-field:first-child { margin-top: 0; }
.cdx-field__help-text {
	font-size: var(--font-size-medium, 1rem);
	line-height: var(--line-height-small, 1.375rem);
}
.cdx-field__help-text,
.cdx-field__validation-message { margin-top: 4px; }
.cdx-field:not(.cdx-field--disabled) .cdx-field__help-text { color: var(--color-subtle, #54595d); }
.citizen-preferences-group {
	display: flex;
	margin-top: 0;
}
.citizen-preferences-group .cdx-label { padding-bottom: var(--space-xs); }
.citizen-preferences-group .cdx-label__label__text {
	font-size: var(--font-size-small);
	font-weight: var(--font-weight-medium);
	color: var(--color-base);
}
.citizen-preferences-group .cdx-label__description { font-size: var(--font-size-small); }
.citizen-preferences-group .cdx-field__control { width: 100%; }

.citizen-preferences-group__labelrow { display: flex; gap: var(--space-xs, 8px); align-items: baseline; justify-content: space-between; width: 100%; }
.citizen-preferences-group .cdx-label:has(.citizen-preferences-group__labelrow) { width: 100%; }
.citizen-preferences-group .cdx-label:has(.citizen-preferences-group__labelrow) .cdx-label__label,
.citizen-preferences-group .cdx-label:has(.citizen-preferences-group__labelrow) .cdx-label__label__text { display: block; width: 100%; }
.citizen-preferences-group__readout { overflow: hidden; text-overflow: ellipsis; font-size: var(--font-size-small, 0.875rem); font-weight: var(--font-weight-normal, 400); color: var(--color-subtle, #54595d); white-space: nowrap; }
.citizen-preferences-segmented { box-sizing: border-box; display: grid; grid-auto-columns: 1fr; grid-auto-flow: column; height: 44px; padding: var(--space-xxs, 4px); border: var(--border-subtle, 1px solid var(--border-color-base, #c8ccd1)); border-radius: var(--border-radius-medium, 4px); }
.citizen-preferences-segmented .cdx-radio { position: relative; margin-bottom: 0px; border: var(--border-width-base, 1px) solid transparent; border-radius: var(--border-radius-base, 2px); transition-duration: var(--transition-duration-base, 100ms); transition-property: background-color, color; }
.citizen-preferences-segmented .cdx-radio__icon { display: none; }
.citizen-preferences-segmented .cdx-radio__wrapper,
.citizen-preferences-segmented .cdx-label,
.citizen-preferences-segmented .cdx-label__label { width: 100%; min-width: 0px; height: 100%; }
.citizen-preferences-segmented .cdx-radio__wrapper { gap: 0px; }
.citizen-preferences-segmented .cdx-label { padding: 0px; }
.citizen-preferences-segmented .cdx-label__label { display: flex; align-items: center; justify-content: center; padding-inline: var(--space-xxs, 4px); overflow: hidden; text-overflow: ellipsis; font-size: var(--font-size-small, 0.875rem); color: var(--color-subtle, #54595d); white-space: nowrap; }
.citizen-preferences-segmented .cdx-radio,
.citizen-preferences-segmented .cdx-radio * { cursor: pointer; }
.citizen-preferences-segmented .cdx-radio:has(.cdx-radio__input:checked),
.citizen-preferences-segmented .cdx-radio:has(.cdx-radio__input:checked) * { cursor: default; }
.citizen-preferences-segmented .cdx-radio + .cdx-radio::before { position: absolute; inset-block: var(--space-xxs, 4px); inset-inline-start: 0px; width: 1px; content: ""; background-color: var(--border-color-base, #c8ccd1); }
.citizen-preferences-segmented .cdx-radio:hover:not(:has(.cdx-radio__input:checked)),
.citizen-preferences-segmented .cdx-radio:active:not(:has(.cdx-radio__input:checked)) { background-color: var(--background-color-interactive, #eaecf0); border-color: var(--border-color-interactive, #a2a9b1); }
.citizen-preferences-segmented .cdx-radio:hover:not(:has(.cdx-radio__input:checked)) .cdx-label__label,
.citizen-preferences-segmented .cdx-radio:active:not(:has(.cdx-radio__input:checked)) .cdx-label__label { color: var(--color-emphasized, #202122); }
.citizen-preferences-segmented .cdx-radio:hover:not(:has(.cdx-radio__input:checked))::before,
.citizen-preferences-segmented .cdx-radio:active:not(:has(.cdx-radio__input:checked))::before,
.citizen-preferences-segmented .cdx-radio:hover:not(:has(.cdx-radio__input:checked)) + .cdx-radio::before,
.citizen-preferences-segmented .cdx-radio:active:not(:has(.cdx-radio__input:checked)) + .cdx-radio::before { opacity: 0; }
.citizen-preferences-segmented .cdx-radio:active:not(:has(.cdx-radio__input:checked)) { border-color: var(--color-progressive, #36c); }
.citizen-preferences-segmented .cdx-radio:has(.cdx-radio__input:checked) { background-color: var(--background-color-interactive, #eaecf0); border-color: var(--color-progressive, #36c); box-shadow: inset 0 0 0 var(--border-width-base, 1px) var(--color-progressive, #36c); }
.citizen-preferences-segmented .cdx-radio:has(.cdx-radio__input:checked) .cdx-label__label { color: var(--color-emphasized, #202122); }
.citizen-preferences-segmented .cdx-radio:has(.cdx-radio__input:checked)::before,
.citizen-preferences-segmented .cdx-radio:has(.cdx-radio__input:checked) + .cdx-radio::before { opacity: 0; }
.citizen-preferences-segmented .cdx-radio:has(.cdx-radio__input:focus-visible) { outline: 2px solid var(--color-progressive, #36c); outline-offset: 1px; }
.citizen-preferences-segmented__sample,
.citizen-preferences-segmented__text { display: block; font-weight: var(--font-weight-medium, 500); line-height: 1; }
.citizen-preferences-segmented__page { display: block; }
.citizen-preferences-segmented__page-frame { opacity: 0.45; fill: none; stroke: currentcolor; stroke-width: 1.5; }
.citizen-preferences-segmented__page-column { opacity: 0.75; fill: currentcolor; }
.citizen-preferences-segmented__srlabel { position: absolute; width: 1px; height: 1px; overflow: hidden; white-space: nowrap; clip-path: inset(50%); }

html:not(.cv-gadget-popups-original) .mwe-popups,
html:not(.cv-gadget-popups-original) .mwe-popups-container {
	border-radius: 8px;
	overflow: hidden;
}

html:not(.cv-gadget-popups-original) .mwe-popups {
	background: var(--color-surface-1) !important;
}

html:not(.cv-gadget-popups-original) .mwe-popups .mwe-popups-container {
	background: var(--color-surface-1) !important;
}

html:not(.cv-gadget-popups-original) .mwe-popups .mwe-popups-container footer {
	display: none !important;
}

html:not(.cv-gadget-popups-original) .mwe-popups .mwe-popups-extract {
	margin: var(--space-md) !important;
}

html:not(.cv-gadget-popups-original) .mwe-popups .mwe-popups-extract[dir="ltr"]::after {
	background-image: linear-gradient(to right, rgba(255, 255, 255, 0), var(--color-surface-1) 50%) !important;
}

html:not(.cv-gadget-popups-original) .mwe-popups .mwe-popups-extract[dir="rtl"]::after {
	background-image: linear-gradient(to left, rgba(255, 255, 255, 0), var(--color-surface-1) 50%) !important;
}

html:not(.cv-gadget-popups-original) .mwe-popups.mwe-popups-type-reference .mwe-popups-container .mwe-popups-extract .mwe-popups-fade {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), var(--color-surface-1) 50%) !important;
}

html:not(.cv-gadget-popups-original) .mwe-popups.mwe-popups-no-image-pointer::before {
	border-top-color: var(--border-color-base) !important;
}

html:not(.cv-gadget-popups-original) .mwe-popups.mwe-popups-no-image-pointer::after {
	border-top-color: var(--color-surface-1) !important;
}

html:not(.cv-gadget-popups-original) .mwe-popups.mwe-popups-image-pointer::after {
	border-top-color: var(--color-surface-1) !important;
}

html:not(.cv-gadget-popups-original) .mwe-popups.mwe-popups-image-pointer.flipped-x::after {
	border-top-color: var(--color-surface-1) !important;
}

html:not(.cv-gadget-popups-original) .mwe-popups.flipped-x-y::after {
	border-bottom-color: var(--color-surface-1) !important;
}

html:not(.cv-gadget-popups-original) .mwe-popups.flipped-x-y.mwe-popups-is-tall::after {
	border-bottom-color: var(--color-surface-1) !important;
}

html:not(.cv-gadget-popups-original) .mwe-popups.flipped-y::after {
	border-bottom-color: var(--color-surface-1) !important;
}

html:not(.cv-gadget-popups-original) .rt-tooltip,
html:not(.cv-gadget-popups-original) [id^="ilhpp-"] {
	border-radius: 8px;
	overflow: hidden;
}


.mw-mmv-post-image {
	right: 0 !important;
	left: 0 !important;
	width: auto !important;
	padding-block: var(--space-xs) var(--space-md) !important;
	padding-inline: var(--space-md) !important;
	border-top: var(--border-base) !important;
	border-top-left-radius: var(--border-radius-medium) !important;
	border-top-right-radius: var(--border-radius-medium) !important;
	transform: translateY(calc(var(--space-xs) * -1)) !important;
	transition-timing-function: var(--transition-timing-function-ease) !important;
	transition-duration: var(--transition-duration-medium) !important;
	transition-property: background-color, border-color, color !important;
	background-color: color-mix(in oklch, var(--color-surface-1) calc(var(--opacity-glass, 0.9) * 100%), transparent) !important;
	-webkit-backdrop-filter: var(--backdrop-filter-frosted-glass) !important;
	backdrop-filter: var(--backdrop-filter-frosted-glass) !important;
	box-shadow: none !important;
}
.mw-mmv-above-fold {
	display: flex !important;
	gap: var(--space-md) !important;
	align-items: center !important;
	height: auto !important;
	padding-bottom: 0 !important;
	transition-timing-function: var(--transition-timing-function-ease) !important;
	transition-duration: var(--transition-duration-medium) !important;
	transition-property: margin, padding, border !important;
}
.mw-mmv-progress {
	top: -2px !important;
	right: calc(var(--space-md) * -1) !important;
	left: calc(var(--space-md) * -1) !important;
	width: auto !important;
	height: 2px !important;
	background-color: transparent !important;
}
.mw-mmv-progress-percent {
	height: 2px !important;
	background: var(--color-progressive) !important;
}
.mw-mmv-title-contain {
	padding-block: var(--space-xs) !important;
}
.mw-mmv-title-para {
	display: flex !important;
	flex-grow: 1 !important;
	order: -1 !important;
	height: auto !important;
	padding: var(--space-xs) 0 !important;
	margin: 0 !important;
	font-size: var(--font-size-medium) !important;
	line-height: var(--line-height-small) !important;
}
.mw-mmv-title-para .mw-mmv-ttf-ellipsis {
	display: none !important;
}
.mw-mmv-title {
	font-weight: var(--font-weight-semi-bold) !important;
	color: var(--color-emphasized) !important;
}
.mw-mmv-stripe-button.mw-mmv-description-page-button {
	margin: 0 !important;
}
.mw-mmv-stripe-button.mw-mmv-description-page-button.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive {
	min-height: 32px !important;
	padding-inline: 11px !important;
}
@media (max-width: 719.98px) {
	.mw-mmv-stripe-button.mw-mmv-description-page-button {
		gap: 0 !important;
		font-size: 0 !important;
	}
}
.mw-mmv-image-metadata {
	display: flex !important;
	gap: var(--space-md) !important;
	justify-content: space-between !important;
	padding-top: 0 !important;
	margin-top: 0 !important;
	font-size: var(--font-size-small) !important;
	line-height: 2 !important;
	background-color: transparent !important;
	border-top: 0 !important;
	transform: translateY(calc(var(--space-xxs) * -1)) !important;
}
.mw-mmv-image-metadata-desc-column,
.mw-mmv-image-metadata-links-column {
	width: auto !important;
}
.mw-mmv-image-metadata-column {
	float: none !important;
}
.mw-mmv-image-metadata-desc-column {
	flex-grow: 1 !important;
	max-width: none !important;
}
.mw-mmv-image-metadata-links-column {
	flex-grow: 1 !important;
	max-width: none !important;
	width: auto !important;
	text-align: start !important;
	transition: none !important;
}
.mw-mmv-credit {
	padding: 0 !important;
	font-size: inherit !important;
}
.mw-mmv-source-author {
	line-height: inherit !important;
}
.mw-mmv-image-links {
	margin: 0 !important;
	line-height: inherit !important;
	color: var(--color-subtle) !important;
}
.mw-mmv-image-links li {
	font-size: inherit !important;
}
.mw-mmv-author::before,
.mw-mmv-image-links li::before {
	background-color: currentcolor !important;
}
.mw-mmv-image-desc {
	padding: 0 !important;
	font-size: var(--font-size-small) !important;
}
.mw-mmv-image-desc-div {
	margin-bottom: 0 !important;
}
.mw-mmv-image-desc-div,
.mw-mmv-image-links-div {
	display: block !important;
}
.mw-mmv-permission-box {
	margin: var(--space-md) 0 !important;
}
.mw-mmv-image img {
	pointer-events: auto;
}
@media (pointer: coarse) {
	.mw-mmv-image img {
		pointer-events: none !important;
	}
}
.mw-mmv-image.error {
	display: grid !important;
	place-content: center !important;
	background-color: inherit !important;
}
.mw-mmv-image .error-box {
	--mmv-error-icon-size: 80px;
	position: relative !important;
	inset: unset !important;
	padding: calc(var(--mmv-error-icon-size) + var(--space-xxl)) 0 0 0 !important;
	margin: var(--space-md) 4.5rem !important;
	line-height: var(--line-height-small) !important;
	overflow-wrap: break-word !important;
	background-size: var(--mmv-error-icon-size) !important;
}
.mw-mmv-image .error-box .mw-mmv-error-text {
	font-size: var(--font-size-xxx-large) !important;
	font-weight: var(--font-weight-semi-bold) !important;
	color: hsl(var(--color-progressive-hsl__h, 220), 35%, 65%) !important;
}
.mw-mmv-image .error-box .mw-mmv-error-description {
	margin-top: var(--space-md) !important;
	font-size: var(--font-size-small) !important;
	color: hsl(var(--color-progressive-hsl__h, 220), 35%, 65%) !important;
}
.mw-mmv-dialog {
	max-width: calc(100vw - 66px - var(--padding-page, 1rem));
	background-color: var(--color-surface-1) !important;
	border: var(--border-base) !important;
	border-radius: var(--border-radius-base) !important;
}
.mw-mmv-post-image:not(.mw-mmv-untruncated) {
	color: hsl(var(--color-progressive-hsl__h, 220), 45%, 80%) !important;
	background-color: transparent !important;
	border-color: transparent !important;
	-webkit-backdrop-filter: none !important;
	backdrop-filter: none !important;
}
.mw-mmv-post-image:not(.mw-mmv-untruncated) .mw-mmv-title-para {
	max-height: 3rem !important;
	padding-block: 0 !important;
}
.mw-mmv-post-image:not(.mw-mmv-untruncated) .mw-mmv-title {
	overflow: hidden !important;
	color: hsl(var(--color-progressive-hsl__h, 220), 80%, 95%) !important;
}
.mw-mmv-post-image:not(.mw-mmv-untruncated) .mw-mmv-stripe-button.mw-mmv-description-page-button.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive {
	background-color: transparent !important;
	border-color: rgba(255, 255, 255, 0.11) !important;
}
.mw-mmv-post-image:not(.mw-mmv-untruncated) .mw-mmv-stripe-button.mw-mmv-description-page-button.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive:hover {
	background-color: var(--background-color-button-quiet--hover) !important;
}
.mw-mmv-post-image:not(.mw-mmv-untruncated) .mw-mmv-stripe-button.mw-mmv-description-page-button.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive:active {
	background-color: var(--background-color-button-quiet--active) !important;
}
.mw-mmv-post-image:not(.mw-mmv-untruncated) .mw-mmv-credit,
.mw-mmv-post-image:not(.mw-mmv-untruncated) .mw-mmv-image-desc,
.mw-mmv-post-image:not(.mw-mmv-untruncated) .mw-mmv-image-links {
	color: hsl(var(--color-progressive-hsl__h, 220), 35%, 65%) !important;
}
.mw-mmv-post-image:not(.mw-mmv-untruncated) .mw-mmv-image-metadata a,
.mw-mmv-post-image:not(.mw-mmv-untruncated) .mw-mmv-permission-link,
.mw-mmv-post-image:not(.mw-mmv-untruncated) .mw-mmv-label {
	color: hsl(var(--color-progressive-hsl__h, 220), 45%, 75%) !important;
}
.mw-mmv-post-image:not(.mw-mmv-untruncated) .mw-mmv-image-links li.mw-mmv-license-li {
	line-height: inherit !important;
}
.mw-mmv-untruncated .mw-mmv-above-fold {
	padding-bottom: var(--space-xs) !important;
	margin-bottom: var(--space-md) !important;
	border-bottom: 1px solid var(--border-color-base) !important;
}
.mw-mmv-untruncated .mw-mmv-image-metadata {
	line-height: var(--line-height-medium) !important;
}
.mw-mmv-untruncated .mw-mmv-image-metadata-desc-column {
	max-width: var(--width-layout, 1080px) !important;
	transform: none !important;
}
@media (max-width: 719.98px) {
	.mw-mmv-untruncated .mw-mmv-image-metadata {
		flex-direction: column !important;
	}
	.mw-mmv-untruncated .mw-mmv-image-metadata-links-column {
		max-width: none !important;
	}
}

html:where(.client-lightmode, .skin-theme-clientpref-day) .mw-highlight {
	.c, .ch, .cm, .cpf, .c1, .cs { color: #5b727d !important; }
	.cp { color: #8c6750 !important; }
	.k, .kd, .kn, .kr, .kp, .na, .nd { color: #9c3eda !important; }
	.kc { color: #cf3409 !important; }
	.kt, .nc, .nt { color: #986313 !important; }
	.o, .ow, .p, .ss { color: #3374a2 !important; }
	.s, .sa, .sb, .sc, .dl, .sd, .s2, .sh, .s1, .nl { color: #15A900 !important; }
	.sx { color: #cf3409 !important; }
	.m, .mb, .mf, .mh, .mi, .mo, .il, .bp { color: #cf3409 !important; }
	.nb, .no, .nf, .fm, .gt { color: #4c6fa9 !important; }
	.nn, .gd { color: #d9201c !important; }
	.gi { color: #15A900 !important; }
	.gr, .ne { color: #d9201c !important; }
	.gh, .gp { color: #5e708f !important; }
	.gu { color: #8e56b4 !important; }
	.n, .nx, .nv, .vc, .vg, .vi, .vm, .si, .sr { color: #202122 !important; }
	.ni, .se { color: #202122 !important; }
	.go, .w { color: #5b727d !important; }
	.linenos { color: #5b727d !important; }
	a:hover .linenos,
	.hll a .linenos { color: #202122 !important; }
	.k, .kc, .kd, .kn, .kr, .nc, .se, .si { font-weight: normal !important; }
}
@media (prefers-color-scheme: light) {
	html.skin-theme-clientpref-os .mw-highlight {
		.c, .ch, .cm, .cpf, .c1, .cs { color: #5b727d !important; }
		.cp { color: #8c6750 !important; }
		.k, .kd, .kn, .kr, .kp, .na, .nd { color: #9c3eda !important; }
		.kc { color: #cf3409 !important; }
		.kt, .nc, .nt { color: #986313 !important; }
		.o, .ow, .p, .ss { color: #3374a2 !important; }
		.s, .sa, .sb, .sc, .dl, .sd, .s2, .sh, .s1, .nl { color: #15A900 !important; }
		.sx { color: #cf3409 !important; }
		.m, .mb, .mf, .mh, .mi, .mo, .il, .bp { color: #cf3409 !important; }
		.nb, .no, .nf, .fm, .gt { color: #4c6fa9 !important; }
		.nn, .gd { color: #d9201c !important; }
		.gi { color: #15A900 !important; }
		.gr, .ne { color: #d9201c !important; }
		.gh, .gp { color: #5e708f !important; }
		.gu { color: #8e56b4 !important; }
		.n, .nx, .nv, .vc, .vg, .vi, .vm, .si, .sr { color: #202122 !important; }
		.ni, .se { color: #202122 !important; }
		.go, .w { color: #5b727d !important; }
		.linenos { color: #5b727d !important; }
		a:hover .linenos,
		.hll a .linenos { color: #202122 !important; }
		.k, .kc, .kd, .kn, .kr, .nc, .se, .si { font-weight: normal !important; }
	}
}

.cv-home,
.cv-home-active > #mp-2012 {
	--cvh-card: light-dark(#fff, oklch(18.5% 0.02 var(--color-primary-oklch__h)));
	--cvh-surface: light-dark(oklch(97% 0.008 var(--color-primary-oklch__h)), oklch(16.5% 0.015 var(--color-primary-oklch__h)));
	--cvh-surface-2: light-dark(oklch(94.5% 0.012 var(--color-primary-oklch__h)), oklch(22% 0.02 var(--color-primary-oklch__h)));
	--cvh-border: light-dark(rgb(0 0 0 / 0.1), rgb(255 255 255 / 0.1));
	--cvh-border-subtle: light-dark(rgb(0 0 0 / 0.06), rgb(255 255 255 / 0.06));
	--cvh-accent: var(--color-progressive, #36c);
	--cvh-accent-subtle: var(--background-color-progressive-subtle, hsl(220 60% 95%));
	--cvh-shadow-sm: 0 1px 2px var(--box-shadow-color-base, rgba(0, 0, 0, 0.06));
	--cvh-shadow-md: 0 2px 8px var(--box-shadow-color-base, rgba(0, 0, 0, 0.1)), 0 1px 3px var(--box-shadow-color-base, rgba(0, 0, 0, 0.06));
	--cvh-radius: var(--border-radius-base, 4px);
	--cvh-radius-md: var(--border-radius-medium, 8px);
	--cvh-radius-lg: var(--border-radius-large, 12px);
	--cvh-t-fast: 80ms cubic-bezier(0.2, 0, 0, 1);
	--cvh-t-base: 250ms cubic-bezier(0.2, 0, 0, 1);
	--cvh-pad: 1.25rem;
	font-family: var(--font-family-base, sans-serif);
	font-size: var(--font-size-medium, 1rem);
	line-height: 1.6;
	color: var(--color-base, #202122);
}
.cv-home *, .cv-home *::before, .cv-home *::after { box-sizing: border-box; }
.cv-home ul, .cv-home ol { list-style: none; margin: 0; padding: 0; }
.cv-home li { margin: 0; }
.cv-home p { margin: 0; }
.cv-home figure { margin: 0; float: none; }
.cv-home img { max-width: 100%; }
.cv-home-active > #mp-2012 {
	margin-top: 0.75rem;
	padding: 0;
	background: none;
	border: 0;
	border-radius: 0;
}
.cv-home-active > #mp-2012 > #mp-2012-banner { display: none !important; }
.cv-home-active > #mp-2012 > #mp-2012-body {
	min-width: 0;
	clear: none;
}

.cv-home-active > #mp-2012 #mp-2012-body > .cvb-masonry {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	align-items: stretch;
	gap: 0 1.5rem;
	width: 100%;
}
.cv-home-active .cvb-masonry > .cvb-col {
	display: flex;
	flex-direction: column;
	min-width: 0;
}
@media (max-width: 900px) {
	.cv-home-active > #mp-2012 #mp-2012-body > .cvb-masonry {
		grid-template-columns: minmax(0, 1fr);
		gap: 1.5rem;
	}
}
.cv-home-active .cvb-masonry .cvb-card {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	row-gap: 0.875rem;
	width: 100%;
	margin: 0 0 1.5rem;
	padding: 1.25rem var(--cvh-pad, 1.25rem);
	background: #fff;
	border: 1px solid var(--border-color-base, rgb(0 0 0 / 0.1));
	border-radius: var(--border-radius-medium, 8px);
}
.cv-home-active .cvb-masonry > .cvb-col > .cvb-card:last-child {
	margin-bottom: 0;
	flex: 1 1 auto;
}

.cv-home-active .cvb-card__title {
	margin: 0;
	padding: 0;
	border: 0;
	font-family: "Songti SC", "SimSun", "Noto Serif CJK SC", "Source Han Serif SC", serif;
	font-size: 1.25rem;
	font-weight: 600;
	line-height: 1.4;
	letter-spacing: -0.01em;
	color: var(--color-emphasized, #101418);
}

.cv-home-active .cvb-card__body {
	font-size: 0.9375rem;
	line-height: 1.7;
	color: var(--color-base, #202122);
}
.cv-home-active .cvb-card__body p {
	margin: 0 0 0.75em;
	text-align: left;
}
.cv-home-active .cvb-card__body > :last-child { margin-bottom: 0; }
.cv-home-active .cvb-card__body ul,
.cv-home-active .cvb-card__body ol {
	margin: 0;
	padding: 0;
	list-style: none;
}
.cv-home-active .cvb-card__body li { margin: 0 0 0.5em; }
.cv-home-active .cvb-card__body--list ul { padding-left: 1.25em; list-style: disc; }
.cv-home-active .cvb-card__body--list li:last-child { margin-bottom: 0; }

.cv-home-active .cvb-card__body figure {
	max-width: 42%;
	margin: 0.25rem 0 0.75rem 1rem;
}
.cv-home-active .cvb-card__body figure.cvb-fig--left {
	float: left;
	margin: 0.25rem 1rem 0.75rem 0;
}
.cv-home-active .cvb-card__body figure.cvb-fig--right { float: right; }
.cv-home-active .cvb-card__body figure img,
.cv-home-active .cvb-card__body figure video {
	max-width: 100%;
	height: auto;
	border-radius: var(--cvh-radius);
}
.cv-home-active .cvb-card__body figcaption {
	margin-top: 0.35rem;
	font-size: 0.8125rem;
	line-height: 1.5;
	color: var(--color-subtle, #54595d);
}

.cv-home-active .cvb-masonry .cvb-card--pic {
	display: flex;
	flex-direction: column;
	padding: 0;
	overflow: clip; 
}
.cv-home-active .cvb-masonry .cvb-card--pic > .cvb-feat { flex: 1 1 auto; }
.cv-home-active .cvb-feat {
	position: relative;
	z-index: 0; 
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	aspect-ratio: 4 / 3;
	min-block-size: 13rem;
	overflow: clip; 
}
.cv-home-active .cvb-feat::after {
	content: "";
	position: absolute;
	inset: 0;
	z-index: -1;
	background-image: linear-gradient(
		to top,
		rgb(8 11 14 / 0.92) 0%,
		rgb(8 11 14 / 0.55) 42%,
		rgb(8 11 14 / 0.12) 100%
	);
	transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.32s cubic-bezier(0.32, 0.72, 0, 1);
}
.cv-home-active .cvb-feat__media {
	position: absolute;
	inset: 0;
	z-index: -1;
	display: block;
}
.cv-home-active .cvb-feat__link { display: block; width: 100%; height: 100%; }
.cv-home-active .cvb-feat__media img {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 0;
	transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);
}
.cv-home-active .cvb-feat__body {
	padding: 0.75rem;
	transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.32s cubic-bezier(0.32, 0.72, 0, 1);
}
.cv-home-active .cvb-feat__title {
	margin: 0;
	font-size: 1.875rem;
	font-weight: 500;
	line-height: 1.15;
	letter-spacing: -0.02em;
	color: #f4f8fb;
	pointer-events: none;
}
.cv-home-active .cvb-feat__tag {
	margin-top: 0.125rem;
	font-size: 0.875rem;
	line-height: 1.6;
	color: rgb(203 215 226);
}
.cv-home-active .cvb-feat:hover .cvb-feat__media img { transform: scale(1.03); }
.cv-home-active .cvb-feat:hover::after,
.cv-home-active .cvb-feat:hover .cvb-feat__body {
	transform: translateY(100%);
	opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
	.cv-home-active .cvb-feat:hover .cvb-feat__media img { transform: none; }
	.cv-home-active .cvb-feat:hover::after,
	.cv-home-active .cvb-feat:hover .cvb-feat__body { transform: none; }
}
.cv-home-active .cvb-year { font-weight: 600; }
.cv-home-active .cvb-card--events .cvb-card__body > dl { margin: 0; }
.cv-home-active .cvb-card--events .cvb-card__body > dl > :last-child { margin-bottom: 0; }
.cv-home-active .cvb-event { margin: 0 0 0.6em; }
.cv-home-active .cvb-event dt {
	float: left;
	width: 4.5em;
	font-weight: 600;
	color: var(--color-subtle, #54595d);
	font-variant-numeric: tabular-nums;
}
.cv-home-active .cvb-event dd { margin: 0 0 0 5em; }

.cv-home-active .cvb-card__body--tags ul {
	display: flex;
	flex-wrap: wrap;
	gap: var(--space-xs, 8px);
	margin: 0;
}
.cv-home-active .cvb-card__body--tags li { display: block; margin: 0; }
.cv-home-active .cvb-card__body--tags li > a {
	display: block;
	padding: var(--space-xxs, 4px) var(--space-sm, 12px);
	border: var(--border-width-base, 1px) solid var(--border-color-interactive, #72777d);
	border-radius: var(--border-radius-pill, 9999px);
	font-size: var(--font-size-small, 0.875rem);
	line-height: 1.25; 
	text-decoration: none;
	transition-property: transform;
	transition-duration: var(--transition-duration-base, 100ms);
	transition-timing-function: var(--transition-timing-function-ease, ease);
}
html body #mp-2012 #mp-2012-body .cvb-card__body--tags li > a,
html body #mp-2012 #mp-2012-body .cvb-card__body--tags li > a:visited {
	color: var(--color-base, #202122) !important;
}
html body #mp-2012 #mp-2012-body .cvb-card__body--tags li > a:hover,
html body #mp-2012 #mp-2012-body .cvb-card__body--tags li > a:hover:visited {
	color: var(--color-inverted-primary, #fff) !important;
	background-color: var(--background-color-progressive, #36c) !important;
}
.cv-home-active .cvb-card__body--tags li > a:hover,
.cv-home-active .cvb-card__body--tags li > a:hover:visited {
	border-radius: var(--border-radius-medium, 8px);
	transform: scale(1.05);
	text-decoration: none;
}

.cv-home-active .cvb-tips-header a { font-weight: 600; }

.cv-home-active .cvb-card__cta { margin-top: 1em; text-align: center; }

.cv-home-active .cvb-card__more {
	margin: 0;
	padding-top: 0.75rem;
	border-top: 1px solid var(--cvh-border-subtle);
	font-size: 0.875rem;
	line-height: 1.7;
	color: var(--color-subtle, #54595d);
}
.cv-home-active .cvb-card__more ul {
	margin: 0;
	padding: 0;
	list-style: none;
}
.cv-home-active .cvb-card__more li { margin: 0 0 0.35em; }
.cv-home-active .cvb-card__more li:last-child { margin-bottom: 0; }
.cv-home-active .cvb-card__more .cvb-more-header a {
	font-weight: 600;
	color: var(--color-emphasized, #101418);
}

.cv-home-active > #mp-2012 #mp-2012-links { display: none !important; }

.cv-home-active > #mp-2012 #mp-2012-sisters {
	margin: 1.5rem 0 0;
	padding: 1.25rem var(--cvh-pad, 1.25rem);
	background: #fff;
	border: 1px solid var(--border-color-base, rgb(0 0 0 / 0.1));
	border-radius: var(--border-radius-medium, 8px);
	color: var(--color-base, #202122);
	line-height: 1.7;
}
.cv-home-active > #mp-2012 #mp-2012-sisters > div:not(.cvb-sisters__grid) {
	width: auto;
	margin: 0 auto 0.75rem;
	padding: 0;
	background: none;
	text-align: center;
}
.cv-home-active > #mp-2012 #mp-2012-sisters > div:not(.home-hero__tabs) img {
	width: 40px;
	height: 40px;
}
.cv-home-active > #mp-2012 #mp-2012-sisters > p {
	margin: 0 0 1rem !important;
	text-align: center;
	font-size: 0.875rem;
	color: var(--color-subtle, #54595d);
}

.cv-home-active > #mp-2012 #mp-2012-sisters .cvb-sisters__grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 0.25rem 0.75rem;
	margin: 0;
}
.cv-home-active > #mp-2012 #mp-2012-sisters .cvb-sisters__grid > a {
	display: flex;
	align-items: center;
	gap: var(--space-sm, 12px);
	padding: var(--space-xs, 0.5rem);
	border-radius: var(--border-radius-base, 4px);
	text-decoration: none;
}
.cv-home-active > #mp-2012 #mp-2012-sisters .cvb-sisters__grid > a:hover {
	background-color: var(--background-color-button-quiet--hover, rgba(0, 24, 73, 0.027));
	text-decoration: none;
}
.cv-home-active > #mp-2012 #mp-2012-sisters .cvb-sisters__grid > a:active {
	background-color: var(--background-color-button-quiet--active, rgba(0, 24, 73, 0.082));
}
.cv-home-active > #mp-2012 #mp-2012-sisters .cvb-sisters__grid > a > img {
	flex: none;
	width: 42.2px;
	height: 42.2px;
}
.cv-home-active > #mp-2012 #mp-2012-sisters .cvb-sisters__label {
	display: flex;
	flex-direction: column;
	text-align: left;
}
.cv-home-active > #mp-2012 #mp-2012-sisters .cvb-sisters__name {
	font-size: 1rem;
	line-height: 1.5;
	font-weight: 600;
}
.cv-home-active > #mp-2012 #mp-2012-sisters .cvb-sisters__desc {
	font-size: 0.8125rem;
	line-height: 1.4;
	color: var(--color-subtle, #54595d);
}
html body #mp-2012 #mp-2012-sisters .cvb-sisters__grid a,
html body #mp-2012 #mp-2012-sisters .cvb-sisters__grid a:visited,
html body #mp-2012 #mp-2012-sisters .cvb-sisters__grid a:hover,
html body #mp-2012 #mp-2012-sisters .cvb-sisters__grid a:active {
	color: var(--color-link, #3366cc) !important;
}
html body #mp-2012 #mp-2012-sisters .cvb-sisters__grid .cvb-sisters__desc {
	color: var(--color-subtle, #54595d) !important;
}
@media (max-width: 880px) {
	.cv-home-active > #mp-2012 #mp-2012-sisters .cvb-sisters__grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}
@media (max-width: 640px) {
	.cv-home-active > #mp-2012 #mp-2012-sisters .cvb-sisters__grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

.cv-home .home-band { position: relative; padding: 0.75rem 0; }
.cv-home .home-band__inner { width: 100%; margin-inline: auto; }
.cv-home .home-section-heading {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin: 0 0 0.75rem;
	padding: 0;
	border: 0;
	font-size: 1.125rem;
	font-weight: 600;
	letter-spacing: -0.01em;
	color: var(--color-emphasized, #101418);
}
.cv-home .home-section-heading::before {
	content: "";
	display: inline-block;
	width: 4px;
	height: 1em;
	background: var(--cvh-accent);
	border-radius: 2px;
}

.cv-home .home-hero {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	margin-top: 0.75rem;
	padding: 1.25rem var(--cvh-pad);
	background: #fff;
	border: 1px solid var(--border-color-base, rgb(0 0 0 / 0.1));
	border-radius: var(--border-radius-medium, 8px);
	overflow: hidden;
}
.cv-home .home-hero__content { position: relative; z-index: 1; width: 100%; }
.cv-home .home-hero__wordmark {
	display: block;
	height: 26.83px;
	width: auto;
	margin-inline: auto;
}
.cv-home .home-hero__title {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 2rem;
	font-weight: 500;
	letter-spacing: -0.025em;
	line-height: 1.05;
	color: var(--color-emphasized, #101418);
}
.cv-home .home-hero__title-dim { display: block; margin-bottom: 0.25em; font-size: 1.25rem; font-weight: 400; letter-spacing: 0; color: var(--color-subtle, #54595d); }
.cv-home .home-hero__lead {
	font-family: "Songti SC", "SimSun", "Noto Serif CJK SC", "Source Han Serif SC", serif;
	font-size: 1.125rem;
	letter-spacing: 0.08em;
	color: var(--color-base, #202122);
}
.cv-home .home-hero__tabs {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin-top: 0.75rem;
}
.cv-home .home-hero__tabs a {
	display: block;
	padding: var(--space-xs, 0.5rem) var(--space-md, 1rem);
	border-radius: var(--border-radius-base, 4px);
	font-size: 14px;
	line-height: 22px;
	font-weight: var(--font-weight-medium, 500);
	text-decoration: none;
}
.cv-home .home-hero__tabs a:hover {
	background-color: var(--background-color-button-quiet--hover, rgba(0, 24, 73, 0.027));
	text-decoration: none;
}
.cv-home .home-hero__tabs a:active {
	background-color: var(--background-color-button-quiet--active, rgba(0, 24, 73, 0.082));
}
html body #mw-content-text .mw-parser-output .cv-home .home-band .home-hero .home-hero__tabs a,
html body #mw-content-text .mw-parser-output .cv-home .home-band .home-hero .home-hero__tabs a:visited,
html body #mw-content-text .mw-parser-output .cv-home .home-band .home-hero .home-hero__tabs a:hover,
html body #mw-content-text .mw-parser-output .cv-home .home-band .home-hero .home-hero__tabs a:active {
	color: var(--color-emphasized, #101418) !important;
}

.cv-home .home-grid {
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	gap: 1rem;
	align-items: stretch;
}
.cv-home .home-grid--two { grid-template-columns: repeat(12, 1fr); }
.cv-home .home-card--read { grid-column: span 8; }
.cv-home .home-card--aside { grid-column: span 4; }
.cv-home .home-card--tall { grid-column: span 8; grid-row: span 2; }

.cv-home .t-card {
	position: relative;
	display: flex;
	flex-direction: column;
	background: var(--cvh-card);
	border: 1px solid var(--cvh-border);
	border-radius: var(--cvh-radius-md);
	overflow: hidden;
	transition: border-color var(--cvh-t-base), box-shadow var(--cvh-t-base);
}
.cv-home .t-card--link:hover { border-color: var(--cvh-accent); box-shadow: var(--cvh-shadow-md); }
.cv-home .t-card__kicker {
	padding: 0.5rem 1rem;
	font-size: 0.875rem;
	font-weight: 600;
	letter-spacing: 0.12em;
	text-align: center;
	color: var(--color-inverted, #fff);
	background: var(--cvh-accent);
	border-bottom: 1px solid color-mix(in srgb, var(--color-inverted, #fff) 18%, transparent);
}
.cv-home .t-card__kicker::before,
.cv-home .t-card__kicker::after {
	font-weight: 400;
	opacity: 0.72;
}
.cv-home .t-card__kicker::before { content: "[ "; }
.cv-home .t-card__kicker::after { content: " ]"; }
.cv-home .t-card__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	border-bottom: 1px solid var(--cvh-border-subtle);
}
.cv-home .t-card__title { font-weight: 600; color: var(--color-emphasized, #101418); }
.cv-home .t-card__description { color: var(--color-subtle, #54595d); font-size: 0.875rem; }
.cv-home .t-card__content {
	padding: 1rem;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}
.cv-home .t-card__body { color: var(--color-base, #202122); font-size: 0.875rem; line-height: 1.7; }
.cv-home .t-card__body ul { list-style: none; margin: 0; padding: 0; }
.cv-home .t-card__body li { position: relative; padding-left: 1rem; margin: 0; }
.cv-home .t-card__body li + li { margin-top: 2px; }
.cv-home .t-card__body li::before {
	content: "";
	position: absolute;
	left: 0.25rem;
	top: 0.7em;
	width: 4px;
	height: 4px;
	border-radius: 50%;
	background: var(--cvh-accent);
}
.cv-home .t-card__foot {
	margin-top: auto;
	padding-top: 0.5rem;
	border-top: 1px solid var(--cvh-border-subtle);
	display: flex;
	gap: 1rem;
}
.cv-home .t-card__readout { display: flex; flex-direction: column; font-family: var(--font-family-monospace, monospace); }
.cv-home .t-card__readout-label { font-size: 0.75rem; color: var(--color-subtle, #54595d); text-transform: uppercase; letter-spacing: 0.1em; }
.cv-home .t-card__readout-value { font-size: 1.125rem; font-weight: 500; color: var(--color-emphasized, #101418); }

.cv-home .t-card__media-layout { display: flex; flex-grow: 1; min-width: 0; }
.cv-home .t-card__media-layout--split { flex-direction: row; align-items: stretch; }
.cv-home .t-card__media { flex: none; overflow: hidden; background: var(--cvh-surface-2); }
.cv-home .t-card__media-layout--split > .t-card__media { width: 18rem; align-self: stretch; }
.cv-home .t-card__media img {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 250ms ease;
}
.cv-home .t-card--link:hover .t-card__media img { transform: scale(1.05); }
.cv-home .t-card__media-body {
	flex-grow: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	padding: 1rem;
}
.cv-home .t-card__caption { color: var(--color-subtle, #54595d); font-size: 0.875rem; line-height: 1.6; }
.cv-home .featured-article .t-card__media-layout--split > .t-card__media { width: 22rem; }
.cv-home .featured-image .t-card__media--banner { aspect-ratio: 16 / 9; width: 100%; }
.cv-home .featured-image__media img { display: block; width: 100%; height: auto; border-radius: var(--cvh-radius); }
.cv-home .featured-image__media .t-card__caption { margin-top: 0.5rem; }
.cv-home .featured-good .t-card__body ul { margin-top: 0; }

.cv-home .dyk-list,
.cv-home .news-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.cv-home .dyk-list li {
	position: relative;
	padding-left: 1rem;
	color: var(--color-base, #202122);
	font-size: 0.875rem;
	line-height: 1.7;
}
.cv-home .dyk-list li::before {
	content: "…";
	position: absolute;
	left: 0;
	color: var(--cvh-accent);
	font-weight: 600;
}
.cv-home .news-list li {
	display: grid;
	grid-template-columns: 3rem 1fr;
	gap: 0.5rem;
	padding: 0.25rem 0;
	font-size: 0.875rem;
	border-bottom: 1px solid var(--cvh-border-subtle);
}
.cv-home .news-list li:last-child { border-bottom: 0; }
.cv-home .news-date {
	font-family: var(--font-family-monospace, monospace);
	color: var(--color-subtle, #54595d);
	font-size: 0.75rem;
}
.cv-home .otd-year {
	display: inline-block;
	min-width: 4rem;
	padding-right: 0.5rem;
	font-family: var(--font-family-monospace, monospace);
	font-weight: 600;
	color: var(--cvh-accent);
	text-align: right;
}

.cv-home .trending-tabs {
	display: inline-flex;
	background: var(--cvh-surface-2);
	border-radius: var(--cvh-radius);
	padding: 2px;
}
.cv-home .trending-tab {
	padding: 4px 10px;
	font-size: 0.75rem;
	color: var(--color-subtle, #54595d);
	background: transparent;
	border: 0;
	border-radius: var(--cvh-radius);
	cursor: pointer;
}
.cv-home .trending-tab:hover { color: var(--color-emphasized, #101418); }
.cv-home .trending-tab.is-active {
	background: var(--cvh-card);
	color: var(--color-emphasized, #101418);
	box-shadow: var(--cvh-shadow-sm);
}
.cv-home .trending-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.cv-home .trending-list li {
	display: grid;
	grid-template-columns: 1.75rem 1fr auto;
	gap: 0.5rem;
	align-items: baseline;
	padding: 0.25rem 0;
	font-size: 0.875rem;
	border-bottom: 1px solid var(--cvh-border-subtle);
}
.cv-home .trending-list li:last-child { border-bottom: 0; }
.cv-home .trending-rank {
	font-family: var(--font-family-monospace, monospace);
	font-weight: 600;
	color: var(--color-subtle, #54595d);
	text-align: center;
}
.cv-home .trending-list li:nth-child(1) .trending-rank { color: hsl(0 70% 50%); }
.cv-home .trending-list li:nth-child(2) .trending-rank { color: hsl(40 70% 45%); }
.cv-home .trending-list li:nth-child(3) .trending-rank { color: hsl(220 60% 50%); }
.cv-home .trending-views {
	font-family: var(--font-family-monospace, monospace);
	font-size: 0.75rem;
	color: var(--color-subtle, #54595d);
}

.cv-home .participate-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 1rem;
}
.cv-home .participate-card {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	padding: 1rem;
	background: var(--cvh-card);
	border: 1px solid var(--cvh-border);
	border-radius: var(--cvh-radius-md);
	color: inherit;
	text-decoration: none;
	transition: var(--cvh-t-base);
}
.cv-home .participate-card:hover {
	border-color: var(--cvh-accent);
	transform: translateY(-2px);
	box-shadow: var(--cvh-shadow-md);
	text-decoration: none;
}
.cv-home .participate-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2.5rem;
	height: 2.5rem;
	background: color-mix(in srgb, var(--cvh-accent) 10%, transparent);
	border-radius: var(--cvh-radius);
	color: var(--cvh-accent);
	font-size: 1.25rem;
	margin-bottom: 0.25rem;
}
.cv-home .participate-icon .citizen-ui-icon { width: 1.25rem; height: 1.25rem; }
.cv-home .participate-title { font-weight: 600; color: var(--color-emphasized, #101418); }
.cv-home .participate-desc { font-size: 0.875rem; color: var(--color-subtle, #54595d); }

.cv-home .home-dir {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 1.5rem 2rem;
}
.cv-home .home-dir__group { min-width: 0; }
.cv-home .home-dir__label {
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--color-subtle, #54595d);
	text-transform: uppercase;
	letter-spacing: 0.08em;
	margin-bottom: 0.5rem;
}
.cv-home .home-dir ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.cv-home .home-dir li a { font-size: 0.875rem; }

.cv-home .reminder-card {
	background: color-mix(in srgb, hsl(40 80% 50%) 8%, var(--cvh-card));
	border-color: color-mix(in srgb, hsl(40 80% 50%) 30%, var(--cvh-border));
}
.cv-home .home-foot__meta { margin-top: 1rem; text-align: center; color: var(--color-subtle, #54595d); font-size: 0.75rem; }

@media (max-width: 900px) {
	.cv-home .home-grid { grid-template-columns: 1fr; }
	.cv-home .home-card--read,
	.cv-home .home-card--aside,
	.cv-home .home-card--tall { grid-column: auto; grid-row: auto; }
	.cv-home .t-card__media-layout--split { flex-direction: column; }
	.cv-home .t-card__media-layout--split > .t-card__media { width: auto; aspect-ratio: 16 / 8; }
	.cv-home .home-hero__title { font-size: 1.75rem; }
}
@media (max-width: 640px) {
	.cv-home .home-hero { padding-block: 1rem; }
	.cv-home .home-hero__title { font-size: 1.5rem; }
	.cv-home .participate-grid { grid-template-columns: repeat(2, 1fr); }
	.cv-home .home-dir { grid-template-columns: repeat(2, 1fr); }
	.cv-home .news-list li { grid-template-columns: 2.5rem 1fr; }
	.cv-home .trending-list li { grid-template-columns: 1.25rem 1fr; }
	.cv-home .trending-views { display: none; }
}
@media print {
	.cv-home .home-hero__tabs { display: none !important; }
	.cv-home .home-band { break-inside: avoid; }
}

.cv-home .news-list--plain li { grid-template-columns: 1fr; }
.cv-home .t-card__foot { flex-wrap: wrap; align-items: center; }
.cv-home .t-card__foot a { font-size: 0.8125rem; }
.cv-home .participate-full .t-card__content > figure { max-width: 4.5rem; }
.cv-home .participate-full .t-card__content > p { font-size: 0.9375rem; }
.cv-home .participate-full .mw-ui-button { align-self: flex-start; margin-top: 0.5rem; }

html body #bodyContent .cv-home p,
html body .mw-parser-output .cv-home p { margin: 0 !important; }
html body #bodyContent .cv-home p.home-hero__lead,
html body .mw-parser-output .cv-home p.home-hero__lead { margin: 0.5rem 0 0 !important; }
html body #bodyContent .cv-home .t-card__body p + p,
html body .mw-parser-output .cv-home .t-card__body p + p { margin-top: 0.5rem !important; }
html body #bodyContent .cv-home h2.home-hero__title,
html body .mw-parser-output .cv-home h2.home-hero__title {
	margin: 0 !important;
	font-size: 2rem !important;
	line-height: 1.05 !important;
	font-weight: 500 !important;
	border: 0 !important;
	color: var(--color-emphasized, #101418) !important;
}
html body #bodyContent .cv-home h2.home-section-heading,
html body .mw-parser-output .cv-home h2.home-section-heading {
	margin: 0 0 0.75rem !important;
	font-size: 1.125rem !important;
	line-height: 1.4 !important;
	border: 0 !important;
	color: var(--color-emphasized, #101418) !important;
}
html body #bodyContent .cv-home h3,
html body .mw-parser-output .cv-home h3 {
	margin: 0 0 0.5rem !important;
	font-size: 1rem !important;
	line-height: 1.4 !important;
}
html body #bodyContent .cv-home-active h2.cvb-card__title,
html body .mw-parser-output .cv-home-active h2.cvb-card__title {
	margin: 0 !important;
	font-family: "Songti SC", "SimSun", "Noto Serif CJK SC", "Source Han Serif SC", serif !important;
	font-size: 1.25rem !important;
	line-height: 1.4 !important;
	letter-spacing: -0.01em !important;
	border: 0 !important;
	color: var(--color-emphasized, #101418) !important;
}
html body #bodyContent .cv-home-active .cvb-card__body p,
html body .mw-parser-output .cv-home-active .cvb-card__body p {
	margin: 0 0 0.75em !important;
}
html body #bodyContent .cv-home-active h2.cvb-feat__title,
html body .mw-parser-output .cv-home-active h2.cvb-feat__title {
	margin: 0 !important;
	font-family: var(--font-family-base, sans-serif) !important;
	font-size: 1.875rem !important;
	font-weight: 500 !important;
	line-height: 1.15 !important;
	letter-spacing: -0.02em !important;
	border: 0 !important;
	color: #f4f8fb !important;
}
.cv-home .t-card__foot ul { display: flex; flex-wrap: wrap; gap: 0.25rem 1rem; }
.cv-home .t-card__foot .hlist li::after { content: none; }
.cv-home .t-card__foot a { color: var(--cvh-accent); text-decoration: none; }
.cv-home .t-card__foot a:hover { text-decoration: underline; }
.cv-home .t-card__body .mp-2012-block-nav-footer { display: none; }
.cv-home .t-card__body img { border-radius: var(--cvh-radius); }
.cv-home .t-card__body figure { float: none; margin: 0 0 0.5rem; }
.cv-home .t-card__caption b { font-weight: 600; }

html body #catlinks .cv-catlist {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--space-xs, 8px);
	margin: var(--space-xs, 8px) 0 0;
	padding: 0;
	list-style: none;
}
html body #catlinks .cv-catlist > li.cv-cat {
	cursor: grab;
	user-select: none;
	-webkit-user-select: none;
	touch-action: none;
	border-left: 0;
	padding: 0;
	margin: 0;
	transition:
		transform 300ms cubic-bezier(0.32, 0.72, 0, 1),
		opacity 200ms var(--transition-timing-function-ease, ease);
}
html body #catlinks .cv-catlist > li.cv-cat > a { -webkit-user-drag: none; }
html body #catlinks .cv-catlist > li.cv-cat:focus-within {
	outline: 2px solid var(--color-progressive, #36c);
	outline-offset: 1px;
}
html body.cv-dragging #catlinks .cv-catlist > li.cv-cat:focus-within { outline: 0; }
html body #catlinks .cv-catlist > li.cv-cat--dragging {
	position: fixed;
	margin: 0;
	z-index: 60;
	opacity: 1;
	cursor: grabbing;
	pointer-events: none;
	transform: scale(1.05);
	transition: opacity 140ms linear;
}
html body #catlinks .cv-catlist > li.cv-cat--dragging > a,
html body #catlinks .cv-catlist > li.cv-cat--dragging > a:hover,
html body #catlinks .cv-catlist > li.cv-cat--dragging > a:hover:visited {
	color: var(--color-inverted-primary, #fff) !important;
	background-color: var(--background-color-progressive, #36c) !important;
	border-color: var(--background-color-progressive, #36c) !important;
	border-radius: var(--border-radius-medium, 8px) !important;
	box-shadow: none;
	outline: 0;
	transform: none;
}
html body #catlinks .cv-catlist > li.cv-cat--placeholder {
	box-sizing: border-box;
	padding: 0;
	background-color: transparent;
	border: var(--border-width-base, 1px) dashed var(--border-color-subtle, #dcdfe3);
	border-radius: var(--border-radius-pill, 9999px);
	cursor: default;
}
html body.cv-dragging,
html body.cv-dragging * { cursor: grabbing !important; user-select: none !important; }
html body #catlinks .cv-catlist--dragging > li.cv-cat:not(.cv-cat--dragging) > a,
html body #catlinks .cv-catlist--dragging > li.cv-cat:not(.cv-cat--dragging) > a:hover,
html body #catlinks .cv-catlist--dragging > li.cv-cat:not(.cv-cat--dragging) > a:hover:visited {
	color: var(--color-base, #202122) !important;
	background-color: transparent !important;
	border-radius: var(--border-radius-pill, 9999px);
	transform: none;
}
html body #catlinks .cv-catlist--dragging > li.cv-cat:not(.cv-cat--dragging) > a.new,
html body #catlinks .cv-catlist--dragging > li.cv-cat:not(.cv-cat--dragging) > a.new:hover {
	color: var(--color-link-red, #d73333) !important;
}
html body #catlinks .cv-catlist > li.cv-cat--fixed { cursor: pointer; }
html body #catlinks .cv-catlist > li.cv-tail-item {
	display: flex;
	align-self: stretch;
	flex: 0 0 auto;
	width: max-content;
	margin: 0;
	padding: 0;
	background: transparent;
	border: 0;
	opacity: 0;
	pointer-events: none;
	transition: opacity var(--transition-duration-base, 200ms) var(--transition-timing-function-ease, ease);
}
html body #catlinks:hover .cv-catlist > li.cv-tail-item,
html body #catlinks .cv-catlist:hover > li.cv-tail-item,
html body #catlinks .cv-catlist:focus-within > li.cv-tail-item,
html body #catlinks .cv-catlist--dragging > li.cv-tail-item {
	opacity: 1;
	pointer-events: auto;
}
html body #catlinks .cv-catlist .cv-tail {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	gap: var(--space-xxs, 6px);
	height: 100%;
	padding: var(--space-xxs, 6px) var(--space-sm, 12px);
	white-space: nowrap;
	font-family: inherit;
	font-size: var(--font-size-small, 0.875rem);
	color: var(--color-progressive, #36c);
	background-color: transparent;
	border: var(--border-width-base, 1px) dashed var(--color-progressive, #36c);
	cursor: pointer;
}
html body #catlinks .cv-catlist:not(.cv-catlist--dragging) .cv-tail:hover {
	color: var(--color-inverted-primary, #fff) !important;
	border-style: solid;
	border-color: var(--background-color-progressive, #36c);
	background-color: var(--background-color-progressive, #36c);
	transform: scale(1.05);
}
html body #catlinks .cv-catlist .cv-tail:focus-visible {
	outline: 2px solid var(--color-progressive, #36c);
	outline-offset: 1px;
}
html body #catlinks .cv-tail__icon { display: block; flex: 0 0 16px; width: 16px; height: 16px; }
html body #catlinks .cv-tail__add,
html body #catlinks .cv-tail__del { align-items: center; gap: var(--space-xxs, 6px); }
html body #catlinks .cv-tail__add { display: inline-flex; }
html body #catlinks .cv-tail__del { display: none; }
html body #catlinks .cv-catlist--dragging .cv-tail {
	color: var(--color-destructive, #d73333) !important;
	border-color: var(--color-destructive, #d73333);
	background-color: transparent;
}
html body #catlinks .cv-catlist--dragging .cv-tail__add { display: none; }
html body #catlinks .cv-catlist--dragging .cv-tail__del { display: inline-flex; }
html body #catlinks .cv-catlist--dragging .cv-tail--armed {
	color: var(--color-inverted-fixed, #fff) !important;
	border-style: solid;
	border-color: var(--background-color-destructive, #d73333);
	background-color: var(--background-color-destructive, #d73333);
}
html body #catlinks .cv-catlist--dragging .cv-tail--armed .cv-tail__icon { transform: scale(1.15); }
html body #catlinks .cv-catlist--adding > li.cv-cat { opacity: 0.4; }
html body #catlinks .cv-catlist--adding > li.cv-tail-item { display: none; }
html body #catlinks .cv-catlist > li.cv-cat-draft {
	position: relative;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	border-left: 0;
	padding: 0;
	margin: 0;
}
html body #catlinks .cv-cat-draft__chip {
	display: inline-flex;
	align-items: center;
	box-sizing: border-box;
	height: 100%;
	padding: var(--space-xxs, 6px) var(--space-sm, 12px);
	color: var(--color-inverted-primary, #fff);
	background-color: var(--background-color-progressive, #36c);
	border: var(--border-width-base, 1px) solid var(--background-color-progressive, #36c);
	border-radius: var(--border-radius-medium);
	transform: scale(1.05);
}
html body #catlinks .cv-cat-draft__input {
	width: 9em;
	padding: 0;
	font-family: inherit;
	font-size: inherit;
	line-height: inherit;
	color: inherit;
	background-color: transparent;
	border: 0;
	outline: 0;
}
html body #catlinks .cv-cat-draft__input::placeholder {
	color: rgba(255, 255, 255, 0.72);
	opacity: 1;
}
html body #catlinks .cv-catstatus {
	margin: var(--space-xs, 8px) 0 0;
	font-size: var(--font-size-small, 0.875rem);
	color: var(--color-subtle, #54595d);
}
html body #catlinks .cv-catstatus:empty { display: none; }
html body #catlinks .cv-catstatus--busy { color: var(--color-progressive, #36c); }
html body #catlinks .cv-catstatus--error { color: var(--color-destructive, #d73333); }

html body .oo-ui-window-frame .citizen-preferences-card__preview {
	max-height: 3.75rem;
}
html body .oo-ui-window-frame .citizen-preferences-group { flex-wrap: wrap; }
html body .oo-ui-window-frame .citizen-preferences-group > .cdx-label {
	padding-bottom: var(--space-md);
}
html body .oo-ui-window-frame .citizen-preferences-group .cdx-field__help-text {
	width: 100%; margin-top: var(--space-sm);
	font-size: var(--font-size-small);
}
html body .oo-ui-window-frame .cv-accent-custom {
	margin-top: var(--space-md);
}
html body .oo-ui-window-frame .cv-accent-custom .cdx-text-input {
	width: 100%;
	min-width: 0;
}
html body .oo-ui-window-frame .cv-accent-custom__hint {
	display: block;
	margin-top: var(--space-xs);
	font-size: var(--font-size-small);
	color: var(--color-subtle);
}
html body .oo-ui-window-frame .cv-accent-custom__hint:empty {
	display: none;
}
html body .oo-ui-window-frame .cv-gadgets {
	display: flex;
	flex-direction: column;
	gap: var(--space-md);
}
html body .oo-ui-window-frame .cv-gadgets__note {
	font-size: var(--font-size-small);
	color: var(--color-subtle);
}
html body .oo-ui-window-frame .cv-about {
	display: flex;
	flex-direction: column;
	min-height: 100%;
}
html body .oo-ui-window-frame .cv-about__head {
	display: grid;
	grid-template-columns: 1fr auto;
	align-items: center;
	column-gap: var(--space-sm);
	row-gap: 4px;
}
html body .oo-ui-window-frame .cv-about__brand {
	grid-column: 1;
	grid-row: 1;
	display: flex;
	align-items: center;
	gap: 5px;
	color: var(--color-base);
	text-decoration: none;
}
html body .oo-ui-window-frame .cv-about__logo {
	display: block;
	width: 1.3125rem;
	height: 1.3125rem;
}
html body .oo-ui-window-frame .cv-about__logo svg {
	display: block;
	width: 100%;
	height: 100%;
}
html body .oo-ui-window-frame .cv-about__name {
	font-size: var(--font-size-large);
	font-weight: var(--font-weight-bold);
	color: var(--color-base);
}
html body .oo-ui-window-frame .cv-about__version {
	grid-column: 1;
	grid-row: 2;
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: var(--font-size-x-small);
	font-weight: var(--font-weight-bold);
	color: var(--color-subtle);
}
html body .oo-ui-window-frame .cv-about__version-name {
	color: inherit;
	text-decoration: none;
}
html body .oo-ui-window-frame .cv-about__version-delta {
	display: flex;
	align-items: center;
	gap: 4px;
}
html body .oo-ui-window-frame .cv-about__version-new {
	color: var(--color-base);
}
html body .oo-ui-window-frame .cv-about__version svg {
	display: block;
	width: 0.875rem;
	height: 0.875rem;
}
html body .oo-ui-window-frame .cv-about__update {
	grid-column: 2;
	grid-row: 1 / span 2;
}
html body .oo-ui-window-frame .cv-about__foot {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: var(--space-md);
	margin-top: auto;
}
html body .oo-ui-window-frame .cv-about__note {
	margin: 0;
	font-size: var(--font-size-x-small);
	font-weight: var(--font-weight-bold);
	color: var(--color-subtle);
}
html body .oo-ui-window-frame .cv-about__note a {
	color: inherit;
	text-decoration: none;
}
html body .oo-ui-window-frame .cv-about__license > .oo-ui-buttonElement-button {
	box-sizing: border-box;
	width: auto;
	height: auto;
	min-height: 0;
	padding: 10px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}
html body .oo-ui-window-frame .cv-about__license svg {
	display: block;
	width: 88px;
	height: 22px;
}
`);

	(document.head || document.documentElement).appendChild(s);
}

var CV_SCRIPT_VERSION = '3.00';
var CV_CHROME_CACHE_PREFIX = 'citizen-vector-chrome-cache';

function cvChromeCacheKey() {
	var lang = '';
	try {
		lang = (window.mw && mw.config && mw.config.get('wgUserLanguage')) ||
			document.documentElement.getAttribute('lang') || '';
	} catch (e) {}
	return CV_CHROME_CACHE_PREFIX + ':' + CV_SCRIPT_VERSION + ':' + lang;
}

function cvChromeCacheRead() {
	try {
		var html = sessionStorage.getItem(cvChromeCacheKey());
		if (!html || html.indexOf('citizen-header') === -1) return null;
		return html;
	} catch (e) { return null; }
}

function cvChromeCacheWrite(headerEl) {
	try {
		if (!headerEl) return;
		sessionStorage.setItem(cvChromeCacheKey(), headerEl.outerHTML);
	} catch (e) {}
}

window.__cvClearChromeCache = function () {
	try {
		Object.keys(sessionStorage).forEach(function (k) {
			if (k.indexOf(CV_CHROME_CACHE_PREFIX) === 0) sessionStorage.removeItem(k);
		});
	} catch (e) {}
};

function cvChromeCacheInject() {
	if (document.querySelector('.citizen-header[data-cv-cached]')) return;
	if (document.querySelector('.mw-header.citizen-header:not([data-cv-cached])')) return;
	var html = cvChromeCacheRead();
	if (!html) return;
	var holder = document.createElement('div');
	holder.innerHTML = html;
	var cached = holder.firstElementChild;
	if (!cached) return;
	cached.querySelectorAll('.citizen-menu__card').forEach(n => n.remove());
	cached.querySelectorAll('details[open]').forEach(n => n.removeAttribute('open'));
	if (cached.matches && cached.matches('details[open]')) cached.removeAttribute('open');
	cached.setAttribute('data-cv-cached', '1');
	cached.style.setProperty('visibility', 'visible', 'important');
	var native = document.querySelector('.vector-header-container');
	if (native && native.parentNode) native.parentNode.insertBefore(cached, native);
	else if (document.body) document.body.insertBefore(cached, document.body.firstChild);
}

function cvCurtainClear() {
	var de = document.documentElement;
	if (de) {
		try { de.style.removeProperty('visibility'); } catch (e) {}
	}
	var sb = document.getElementById('citizen-vector-curtain-bg');
	if (sb && sb.parentNode) sb.parentNode.removeChild(sb);
	if (document.getElementById('citizen-vector-curtain')) return;
	var s = document.createElement('style');
	s.id = 'citizen-vector-curtain';
	s.textContent =
		'body.skin-vector-2022 .vector-header-container,' +
		'body.skin-vector-2022 .vector-sticky-header,' +
		'body.skin-vector-2022 .vector-page-titlebar,' +
		'body.skin-vector-2022 .vector-page-toolbar-container,' +
		'body.skin-vector-2022 .vector-page-tools-landmark,' +
		'body.skin-vector-2022 .vector-main-menu-landmark,' +
		'body.skin-vector-2022 .vector-user-menu-landmark,' +
		'body.skin-vector-2022 .mw-page-container,' +
		'body.skin-vector-2022 .mw-page-container-inner,' +
		'body.skin-vector-2022 .mw-footer-container,' +
		'body.skin-vector-2022 .vector-toc,' +
		'body.skin-vector-2022 .vector-dropdown,' +
		'body.skin-vector-2022 .vector-menu-dropdown{' +
		'display:none!important}';
	(document.head || document.documentElement || document).appendChild(s);
}

function cvEarlyBoot() {
	try { if (localStorage.getItem('cv-skin') === 'vector-2022') return; } catch (e) {}

	var skinGuard = null;
	function applyEarlySkin() {
		if (!document.documentElement) return;
		try {
			document.documentElement.classList.add('citizen-header-position-left',
				'citizen-feature-autohide-navigation-clientpref-1',
				'citizen-feature-image-dimming-clientpref-0');
		} catch (e) {}
		try {
			var themeVal = localStorage.getItem('cv-pref-theme');
			var themeCls = 'skin-theme-clientpref';
			if (themeVal && !document.documentElement.classList.contains(themeCls + '-' + themeVal)) {
				[...document.documentElement.classList].forEach(function (c) {
					if (c === themeCls || c.indexOf(themeCls + '-') === 0) document.documentElement.classList.remove(c);
				});
				document.documentElement.classList.add(themeCls + '-' + themeVal);
			}
		} catch (e) {}
		try { cvInjectCSS(); } catch (e) {}
	}
	function armSkinGuard() {
		if (skinGuard || !document.documentElement) return;
		var html = document.documentElement;
		try {
			skinGuard = new MutationObserver(function () {
				if (!html.classList.contains('citizen-header-position-left') ||
					!document.querySelector('style[data-citizen-vector]')) {
					applyEarlySkin();
				}
			});
			skinGuard.observe(html, { attributes: true, attributeFilter: ['class'] });
		} catch (e) {}
	}
	applyEarlySkin();
	armSkinGuard();

	var started = false;
	var deadline = Date.now() + 8000;
	var mo = null;

	function stop() {
		if (mo) { mo.disconnect(); mo = null; }
	}
	function tick() {
		applyEarlySkin();
		armSkinGuard();
		if (started) { stop(); return; }
		var body = document.body;
		if (!body) {
			if (Date.now() > deadline) stop();
			return;
		}
		if (!body.classList.contains('skin-vector-2022')) {
			if (Date.now() > deadline) stop();
			return;
		}
		started = true;
		try {
			body.classList.add('skin-citizen');
			body.classList.add('citizen-sections-enabled');
			body.classList.add('cv-pre-wrap');
		} catch (e) {}
		cvChromeCacheInject();
		stop();
	}
	try {
		mo = new MutationObserver(tick);
		mo.observe(document, { childList: true, subtree: true });
	} catch (e) {}
	tick();
	setTimeout(stop, 60000);
	function finishGuard() {
		if (skinGuard) { skinGuard.disconnect(); skinGuard = null; }
	}
	if (document.readyState === 'complete') {
		setTimeout(finishGuard, 2000);
	} else {
		window.addEventListener('load', function () { setTimeout(finishGuard, 2000); });
	}
	window.addEventListener('load', function () {
		setTimeout(function () {
			if (!document.body) return;
			document.body.classList.remove('cv-pre-wrap');
			document.body.classList.remove('cv-fadein');
			cvCurtainClear();
			try { document.documentElement.setAttribute('data-cv-ready', '1'); } catch (e) {}
		}, 1500);
	});
}


function cvRun() {
	'use strict';

	console.log('[citizen-vector] script loaded');

	if (typeof mw === 'undefined' || typeof mw.config === 'undefined') {
		console.log('[citizen-vector] skipped: mw not ready yet');
		return;
	}
	const skin = mw.config.get('skin');
	if (skin !== 'vector-2022') {
		if (!document.querySelector('.vector-header-container, .vector-page-titlebar')) {
			console.log('[citizen-vector] skipped: skin=' + skin + ' and no Vector DOM');
			return;
		}
		console.log('[citizen-vector] skin=' + skin + ' but Vector DOM present, proceed');
	}
	console.log('[citizen-vector] script ready, skin=' + skin);

	var cvSkin = null;
	try { cvSkin = localStorage.getItem('cv-skin'); } catch (e) {}
	if (cvSkin === 'vector-2022') {
		console.log('[citizen-vector] skipped: cv-skin=vector-2022 (native Vector)');
		bootPreferencesInjection();   
		return;
	}

function fixVeTargetContainer() {
	var el = document.querySelector('[data-mw-ve-target-container]');
	if (el) el.removeAttribute('data-mw-ve-target-container');
}
fixVeTargetContainer();

function cvTrimInfoboxTail() {
	function rowIsEmpty(row) {
		if (row.textContent && row.textContent.trim() !== '') return false;
		if (row.querySelector('img, video, audio, canvas, svg, iframe, map, figure, .mw-tmh-player, .legend-color, .notheme, .mw-no-invert')) return false;
		return true;
	}
	function trimSection(section) {
		if (!section || !section.rows) return;
		var rows = section.rows;
		while (rows.length > 1) {
			var row = rows[rows.length - 1];
			if (!rowIsEmpty(row)) break;
			row.parentNode.removeChild(row);
		}
	}
	var tables = document.querySelectorAll('.mw-parser-output .infobox');
	for (var t = 0; t < tables.length; t++) {
		var kids = tables[t].children;
		for (var k = 0; k < kids.length; k++) {
			var tag = kids[k].tagName;
			if (tag === 'TBODY' || tag === 'THEAD' || tag === 'TFOOT') trimSection(kids[k]);
		}
	}
}
cvTrimInfoboxTail();

	function fixResponsiveViewport() {
		var vp = document.querySelector('meta[name="viewport"]');
		if (!vp) return;
		var target = 'width=device-width, initial-scale=1.0, user-scalable=yes, minimum-scale=0.25, maximum-scale=5.0';
		if (vp.getAttribute('content') === target) return;
		vp.setAttribute('content', target);
	}
	fixResponsiveViewport();
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', fixResponsiveViewport);
	}

	function wikiUrl(page, opts) {
		try {
			if (mw.util && typeof mw.util.getUrl === 'function') return mw.util.getUrl(page, opts);
		} catch (e) {  }
		var t = String(page).replace(/ /g, '_');
		var ap = mw.config.get('wgArticlePath') || '/wiki/$1';
		var url = ap.replace('$1', t);
		if (opts) {
			var qs = Object.keys(opts).map(function (k) {
				return encodeURIComponent(k) + '=' + encodeURIComponent(opts[k]);
			}).join('&');
			if (qs) url += (url.indexOf('?') === -1 ? '?' : '&') + qs;
		}
		return url;
	}

	function wikiApi() {
		try {
			if (mw.util && typeof mw.util.wikiScript === 'function') return mw.util.wikiScript('api');
		} catch (e) {  }
		return (mw.config.get('wgScriptPath') || '/w') + '/api.php';
	}

	function escapeId(id) {
		try {
			if (mw.util && typeof mw.util.escapeIdForAttribute === 'function') return mw.util.escapeIdForAttribute(id);
		} catch (e) {  }
		return String(id).replace(/[^a-zA-Z0-9_\u00C0-\uFFFF-]/g, '_');
	}

	function isSpecialPage() {
		try {
			if (mw.config.get('wgCanonicalSpecialPageName')) return true;
			if (mw.config.get('wgNamespaceNumber') === -1) return true;
		} catch (e) {  }
		return false;
	}

	function isShareable() {
		try {
			return mw.config.get('wgNamespaceNumber') >= 0 && mw.config.get('wgArticleId') > 0;
		} catch (e) {  }
		return false;
	}

	function isHomePage() {
		try {
			const pn = mw.config.get('wgPageName') || '';
			return pn === 'Wikipedia:首页' || pn === '首页';
		} catch (e) {  }
		return false;
	}

	function isTalkNamespace() {
		try {
			const ns = mw.config.get('wgNamespaceNumber');
			if (typeof ns === 'number' && ns >= 0 && ns % 2 === 1) return true;
		} catch (e) {  }
		return false;
	}

	function isUserPage() {
		try {
			return mw.config.get('wgNamespaceNumber') === 2;
		} catch (e) {  }
		return false;
	}

	function isEditorPage() {
		try {
			const action = mw.config.get('wgAction');
			if (action === 'edit' || action === 'submit') return true;
		} catch (e) {  }
		try {
			const veaction = new URLSearchParams(location.search).get('veaction');
			if (veaction === 'edit' || veaction === 'editsource') return true;
		} catch (e) {  }
		return !!document.querySelector('.ve-ui-toolbar, .oo-ui-toolbar-bar, #wpTextbox1, .ve-ce-documentNode');
	}

	function isDiffPage() {
		try {
			if (mw.config.get('wgDiffOldId') || mw.config.get('wgDiffNewId')) return true;
			const sp = mw.config.get('wgCanonicalSpecialPageName');
			if (sp === 'Diff' || sp === 'MobileDiff' || sp === 'ComparePages') return true;
			if (new URLSearchParams(location.search).has('diff')) return true;
		} catch (e) {  }
		return !!document.querySelector('#mw-content-text table.diff');
	}

	function injectSkinOption() {
		const field = document.querySelector('#mw-htmlform-skin #mw-input-wpskin')
			|| document.querySelector('#mw-htmlform-skin .oo-ui-radioSelectWidget')
			|| document.querySelector('#mw-htmlform-skin .oo-ui-radioSelectInputWidget');
		if (!field) return;
		if (document.querySelector('#mw-htmlform-skin .citizen-vector-skin-option')) return;  

		let cur = null;
		try { cur = localStorage.getItem('cv-skin'); } catch (e) {}
		const on = cur !== 'vector-2022';         

		const userName = mw.config.get('wgUserName') || '';
		const preview = wikiUrl(mw.config.get('wgPageName') || mw.config.get('wgTitle'), { useskin: 'Citizen' });
		const talk = 'https://github.com/Chatsven/citizen-userscript-wikimedia/issues';
		const css = userName ? wikiUrl('User:' + userName + '/Citizen.css') : '#';
		const js = userName ? wikiUrl('User:' + userName + '/Citizen.js') : '#';

		const label = document.createElement('label');
		label.className = 'oo-ui-widget oo-ui-widget-enabled oo-ui-labelElement oo-ui-optionWidget oo-ui-radioOptionWidget citizen-vector-skin-option';
		label.setAttribute('role', 'radio');
		label.setAttribute('tabindex', '-1');

		const radioWrap = document.createElement('span');
		radioWrap.className = 'oo-ui-widget oo-ui-widget-enabled oo-ui-inputWidget oo-ui-radioInputWidget';
		const input = document.createElement('input');
		input.type = 'radio';
		input.className = 'oo-ui-inputWidget-input';
		input.value = 'Citizen';
		input.setAttribute('name', 'cv-skin-option');   
		input.setAttribute('tabindex', '-1');
		input.setAttribute('role', 'presentation');
		if (on) input.checked = true;
		radioWrap.appendChild(input);
		radioWrap.appendChild(document.createElement('span'));  

		const labelEl = document.createElement('span');
		labelEl.className = 'oo-ui-labelElement-label';
		labelEl.innerHTML = '公民（Citizen） （<a href="' + talk + '">讨论</a> | ' +
			'<a href="' + preview + '">预览</a> | <a href="' + css + '">自定义CSS</a> | <a href="' + js + '">自定义JavaScript</a> | ' +
			'<a href="#" class="cv-prefs-open">偏好设定</a>）';

		label.appendChild(radioWrap);
		label.appendChild(labelEl);
		if (on) {
			label.classList.add('oo-ui-optionWidget-selected');
			label.setAttribute('aria-checked', 'true');
		}

		input.addEventListener('change', function () {
			if (!input.checked) return;
			try { localStorage.setItem('cv-skin', 'citizen-vector'); } catch (e2) {}
			location.reload();
		});

		field.prepend(label);

		const prefsLink = label.querySelector('.cv-prefs-open');
		if (prefsLink) prefsLink.addEventListener('click', function (ev) {
			ev.preventDefault();
			openPrefsDialog();
		});

		if (on) {
			field.querySelectorAll('.oo-ui-optionWidget-selected').forEach(function (el) {
				if (el === label) return;
				el.classList.remove('oo-ui-optionWidget-selected');
				el.removeAttribute('aria-checked');
				const w = el.querySelector('input');
				if (w) w.checked = false;   
			});
		}

		if (field.__cvChangeHooked) return;
		field.__cvChangeHooked = true;
		field.addEventListener('change', function (ev) {
			const v = ev.target && ev.target.value;
			if (!v || v === 'Citizen') return;
			const own = document.querySelector('#mw-htmlform-skin .citizen-vector-skin-option');
			if (!own) return;
			if (own.classList.contains('oo-ui-optionWidget-selected')) {
				own.classList.remove('oo-ui-optionWidget-selected');
				own.removeAttribute('aria-checked');
				const w = own.querySelector('input');
				if (w) w.checked = false;
			}
			try { localStorage.setItem('cv-skin', 'vector-2022'); } catch (e2) {}
		});
	}

	const CV_PREFS_SECTIONS = [
		{ id: 'appearance', label: '外观', icon: 'palette' },
		{ id: 'gadgets', label: '小工具', icon: 'labFlask' },
		{ id: 'about', label: '关于', icon: 'infoFilled' }
	];

	const CV_GADGETS = [
		{ id: 'hotcat', label: '分类', desc: '把 HotCat 的分类栏换成可拖拽排序的胶囊行' },
		{ id: 'popups', label: '页面预览', desc: '悬停链接时的浮窗改用 Citizen 的浮层外观' },
		{ id: 'factbox', label: '事实速览', desc: '移动端视图下将 Infobox 转换为「事实速览」' }
	];
	const CV_GADGET_MODES = [
		{ value: 'adapted', label: '适配模式', text: true },
		{ value: 'original', label: '原始', text: true }
	];
	function cvGadgetPref(id) {
		try { return localStorage.getItem('cv-pref-gadget-' + id) === 'original' ? 'original' : 'adapted'; }
		catch (e) { return 'adapted'; }
	}
	function cvGadgetModeLabel(value) {
		const mode = CV_GADGET_MODES.filter(function (m) { return m.value === value; })[0];
		return mode ? mode.label : CV_GADGET_MODES[0].label;
	}
	function cvApplyGadgetPref(id, mode) {
		const original = mode === 'original';
		if (document.documentElement) {
			document.documentElement.classList.toggle('cv-gadget-' + id + '-original', original);
		}
		try { localStorage.setItem('cv-pref-gadget-' + id, original ? 'original' : 'adapted'); } catch (e) {}
	}

	const CV_HREF_SKIN_SITE = 'https://mwcitizen.skin/';
	const CV_HREF_SKIN_REPO = 'https://github.com/StarCitizenTools/mediawiki-skins-Citizen';
	const CV_HREF_SCRIPT_REPO = 'https://github.com/Chatsven/citizen-userscript-wikimedia';
	const CV_HREF_WMF = 'https://wikimediafoundation.org/';
	const CV_HREF_WIKIMEDIA = 'https://www.wikimedia.org/';
	const CV_HREF_MEDIAWIKI = 'https://www.mediawiki.org/';
	const CV_HREF_CC_BY_SA = 'https://creativecommons.org/licenses/by-sa/4.0/';
	const CV_HREF_CC0 = 'https://creativecommons.org/publicdomain/zero/1.0/';
	const CV_HREF_APACHE = 'https://www.apache.org/licenses/LICENSE-2.0';
	const CV_ABOUT = {
		name: 'Citizen',
		version: 'Citizen-Userscript-Wikimedia v3.00',
		note: 'Not a FORK of <a href="' + CV_HREF_SKIN_REPO + '" target="_blank" rel="noopener noreferrer">Citizen</a>,' +
			'<br>Not affiliated with the <a href="' + CV_HREF_WMF + '" target="_blank" rel="noopener noreferrer">Wikimedia Foundation</a>',
		licenseHref: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
		licenseLabel: '署名—非商业性使用—相同方式共享 4.0'
	};
	const CV_UPDATE_URL = 'http://localhost:8099/citizen-vector.user.js';
	const CV_CITIZEN_LOGO_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"21.1509\" height=\"21.1509\" viewBox=\"0 0 21.1509 21.1509\">\n\t<path d=\"M8.4604 12.6902V1.05719H1.05761V20.093H20.0934V12.6902H8.4604Z\" fill=\"currentColor\"/>\n\t<path d=\"M11.6329 1.05719V9.51753H20.0932V1.05719H11.6329ZM17.9781 7.40245H13.7479V3.17228H17.9781V7.40245Z\" fill=\"currentColor\"/>\n</svg>";
	const CV_ARROW_NEXT_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 20 20\"><path d=\"M10.62 9Q14.17 9 11.66 6.49L9.23 4.06Q8.59 3.42 9.22 2.78L9.37 2.64Q10 2 10.64 2.64L16.87 8.87Q18 10 16.87 11.13L10.63 17.37Q10 18 9.37 17.37L9.22 17.22Q8.59 16.59 9.22 15.95L11.66 13.52Q14.17 11 10.62 11L2.9 11Q2 11 2 10.1L2 9.9Q2 9 2.9 9Z\" fill=\"currentColor\"/></svg>";
	const CV_CCBYNCSA_SVG = "<svg width=\"88\" height=\"22\" viewBox=\"0 0 88 22\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M32.8486 0C35.8267 0 38.3389 1.02218 40.3839 3.0672C42.4408 5.12481 43.4703 7.63669 43.4703 10.6028C43.4703 13.5819 42.4601 16.062 40.4402 18.0434C38.2945 20.1517 35.764 21.2057 32.8486 21.2057C29.9828 21.2057 27.4965 20.1639 25.3888 18.0811C23.3064 15.9983 22.2646 13.506 22.2646 10.6028C22.2646 7.69997 23.3064 5.1881 25.3888 3.06753C27.4339 1.02218 29.9199 0 32.8486 0ZM32.8864 1.91248C30.4755 1.91248 28.4371 2.75839 26.7708 4.44954C25.0413 6.2169 24.1768 8.26822 24.1768 10.6032C24.1768 12.951 25.035 14.9834 26.7513 16.6991C28.468 18.4161 30.5127 19.2739 32.8857 19.2739C35.2458 19.2739 37.3038 18.4102 39.0582 16.6802C40.7245 15.0772 41.5575 13.0514 41.5575 10.6025C41.5575 8.19168 40.7116 6.14102 39.0208 4.44921C37.3296 2.75806 35.2846 1.91248 32.8864 1.91248ZM35.7266 7.97101V12.3066H34.5152V17.4562H31.2204V12.3069H30.009V7.97101C30.009 7.78148 30.0753 7.62078 30.2075 7.48825C30.3404 7.35604 30.5014 7.28944 30.6903 7.28944H35.0454C35.222 7.28944 35.38 7.35571 35.5185 7.48825C35.6567 7.62078 35.7266 7.78181 35.7266 7.97101ZM31.3904 5.24475C31.3904 4.24809 31.8824 3.74909 32.8675 3.74909C33.8525 3.74909 34.3442 4.24743 34.3442 5.24475C34.3442 6.22916 33.8519 6.72153 32.8675 6.72153C31.8831 6.72153 31.3904 6.22916 31.3904 5.24475Z\" fill=\"currentColor\"/>\n<path d=\"M10.5833 0C13.5491 0 16.0742 1.03543 18.1567 3.1053C19.1533 4.1023 19.9111 5.24177 20.4287 6.52273C20.9459 7.80401 21.2053 9.16382 21.2053 10.6028C21.2053 12.0544 20.9492 13.4146 20.4386 14.6826C19.9274 15.951 19.1729 17.0715 18.1762 18.0434C17.1415 19.0655 15.9675 19.8485 14.6544 20.3912C13.342 20.934 11.9848 21.2053 10.5839 21.2053C9.18304 21.2053 7.84178 20.9376 6.5605 20.4005C5.27954 19.8644 4.1308 19.0881 3.11458 18.0722C2.09837 17.0563 1.32535 15.9105 0.795212 14.6355C0.265071 13.3606 0 12.0166 0 10.6028C0 9.2016 0.268053 7.85438 0.804489 6.5605C1.34093 5.26662 2.12057 4.1086 3.14274 3.08609C5.16225 1.02914 7.64232 0 10.5833 0ZM10.6217 1.91249C8.1983 1.91249 6.15958 2.75839 4.50587 4.44954C3.67255 5.29545 3.03208 6.24506 2.58411 7.29905C2.13548 8.35304 1.91182 9.45441 1.91182 10.6032C1.91182 11.7393 2.13548 12.8344 2.58411 13.8877C3.03241 14.9424 3.67255 15.8827 4.50587 16.7094C5.33886 17.5364 6.27886 18.167 7.32722 18.603C8.37458 19.0384 9.47296 19.2561 10.6217 19.2561C11.7575 19.2561 12.8582 19.0357 13.9262 18.5937C14.9927 18.1514 15.9543 17.5145 16.8131 16.6816C18.4665 15.066 19.2928 13.0402 19.2928 10.6035C19.2928 9.42956 19.0781 8.31891 18.649 7.27122C18.2206 6.22353 17.5954 5.28982 16.7757 4.46876C15.0706 2.76469 13.0199 1.91249 10.6217 1.91249ZM10.4888 8.84243L9.0684 9.58098C8.91665 9.26588 8.73077 9.04454 8.51009 8.9183C8.28909 8.79239 8.08399 8.72911 7.89447 8.72911C6.94817 8.72911 6.47435 9.35368 6.47435 10.6035C6.47435 11.1714 6.5943 11.6253 6.83385 11.9663C7.07374 12.3072 7.42728 12.4779 7.89447 12.4779C8.51308 12.4779 8.94845 12.1747 9.20127 11.569L10.5074 12.2317C10.2297 12.7496 9.84473 13.1565 9.35236 13.453C8.86065 13.7499 8.31759 13.898 7.72416 13.898C6.77753 13.898 6.01346 13.6081 5.43295 13.0269C4.85245 12.4464 4.5622 11.6386 4.5622 10.6038C4.5622 9.5939 4.85576 8.79273 5.44256 8.1993C6.02936 7.6062 6.7709 7.30932 7.6675 7.30932C8.98059 7.30866 9.9206 7.81992 10.4888 8.84243ZM16.6044 8.84243L15.2031 9.58098C15.0517 9.26588 14.8652 9.04454 14.6445 8.9183C14.4232 8.79239 14.2114 8.72911 14.0103 8.72911C13.0637 8.72911 12.5899 9.35368 12.5899 10.6035C12.5899 11.1714 12.7101 11.6253 12.9497 11.9663C13.1893 12.3072 13.5425 12.4779 14.0103 12.4779C14.6283 12.4779 15.064 12.1747 15.3161 11.569L16.6415 12.2317C16.3515 12.7496 15.9599 13.1565 15.4682 13.453C14.9758 13.7499 14.4394 13.898 13.8589 13.898C12.8993 13.898 12.1329 13.6081 11.5591 13.0269C10.9839 12.4464 10.6969 11.6386 10.6969 10.6038C10.6969 9.5939 10.9902 8.79273 11.5776 8.1993C12.1641 7.6062 12.9056 7.30932 13.8019 7.30932C15.1147 7.30866 16.0494 7.81992 16.6044 8.84243Z\" fill=\"currentColor\"/>\n<path d=\"M55.1131 0C58.0919 0 60.6038 1.02218 62.6488 3.06687C64.7057 5.11189 65.7352 7.62376 65.7352 10.6028C65.7352 13.5822 64.7253 16.062 62.7051 18.044C60.5597 20.152 58.0286 21.2057 55.1131 21.2057C52.2351 21.2057 49.7488 20.158 47.6537 18.0629C45.5713 15.9798 44.5295 13.4938 44.5295 10.6028C44.5295 7.69964 45.5713 5.18776 47.6537 3.0672C49.6984 1.02251 52.1848 0 55.1131 0ZM46.9152 7.74404C46.5997 8.6148 46.4417 9.56806 46.4417 10.6032C46.4417 12.951 47.2999 14.9835 49.0162 16.6998C50.7454 18.4042 52.7905 19.2561 55.1506 19.2561C57.5366 19.2561 59.5935 18.3919 61.3234 16.662C61.942 16.0689 62.4274 15.4503 62.7806 14.8059L58.786 13.0262C58.6465 13.6955 58.3092 14.2413 57.7731 14.6637C57.2357 15.0865 56.6019 15.33 55.8699 15.3927V17.0212H54.6393V15.3927C53.4654 15.3807 52.3922 14.9579 51.4207 14.1246L52.8786 12.6478C53.5724 13.2913 54.3617 13.613 55.2454 13.613C55.6112 13.613 55.9239 13.5315 56.183 13.3669C56.4415 13.2032 56.5714 12.9321 56.5714 12.5528C56.5714 12.2873 56.4763 12.073 56.2871 11.909L55.2649 11.4733L54.0154 10.905L52.3302 10.1665L46.9152 7.74404ZM55.1513 1.89327C52.7404 1.89327 50.702 2.74514 49.0357 4.44921C48.6189 4.86603 48.2276 5.33919 47.8618 5.86966L51.9137 7.68705C52.0903 7.13173 52.4247 6.68674 52.9174 6.35242C53.4091 6.0181 53.9836 5.83189 54.6403 5.79378V4.16525H55.8713V5.79378C56.8434 5.84448 57.7267 6.1725 58.522 6.77819L57.1396 8.1983C56.5455 7.78181 55.9405 7.57373 55.3219 7.57373C54.9935 7.57373 54.7003 7.63702 54.4419 7.76293C54.1831 7.88917 54.0535 8.10387 54.0535 8.40672C54.0535 8.49518 54.085 8.58332 54.148 8.67179L55.4922 9.27814L56.4199 9.69463L58.1244 10.4517L63.5573 12.8751C63.7346 12.1303 63.8227 11.3732 63.8227 10.6032C63.8227 8.16683 62.9771 6.11584 61.286 4.44921C59.6071 2.74514 57.5614 1.89327 55.1513 1.89327Z\" fill=\"currentColor\"/>\n<path d=\"M77.3784 0C80.3442 0 82.8557 1.02881 84.9137 3.08642C86.9706 5.13144 88.0001 7.63669 88.0001 10.6028C88.0001 13.5696 86.9898 16.0557 84.97 18.0626C82.8372 20.158 80.3061 21.2057 77.3784 21.2057C74.5126 21.2057 72.0263 20.1643 69.9186 18.0815C67.8362 15.999 66.7944 13.5067 66.7944 10.6032C66.7944 7.71289 67.8362 5.20731 69.9186 3.08675C71.9759 1.02881 74.4626 0 77.3784 0ZM77.4161 1.91248C75.0053 1.91248 72.9669 2.76469 71.3006 4.46876C69.571 6.22353 68.7066 8.26822 68.7066 10.6028C68.7066 12.9636 69.5648 14.9954 71.2811 16.6995C72.9977 18.4164 75.0424 19.2743 77.4155 19.2743C79.7756 19.2743 81.8335 18.4098 83.588 16.6806C85.2543 15.065 86.0873 13.0392 86.0873 10.6028C86.0873 8.17975 85.2414 6.13473 83.5505 4.46876C81.8717 2.76402 79.8266 1.91248 77.4161 1.91248ZM72.6826 9.10683C72.8844 7.80666 73.4079 6.80006 74.2539 6.08702C75.0994 5.37398 76.1279 5.01746 77.3399 5.01746C79.0056 5.01746 80.3316 5.55422 81.316 6.62644C82.3004 7.69931 82.7928 9.07536 82.7928 10.7539C82.7928 12.3824 82.2815 13.736 81.2597 14.8148C80.2365 15.8936 78.9118 16.4337 77.2829 16.4337C76.0838 16.4337 75.0487 16.0742 74.178 15.3545C73.3069 14.6349 72.7834 13.6127 72.6064 12.2873H75.2767C75.3396 13.5749 76.116 14.2187 77.6057 14.2187C78.3499 14.2187 78.9499 13.8967 79.4042 13.2532C79.8591 12.6097 80.0864 11.7509 80.0864 10.6784C80.0864 9.5548 79.878 8.69995 79.4618 8.11282C79.045 7.52602 78.4459 7.23245 77.6627 7.23245C76.2485 7.23245 75.4536 7.85703 75.277 9.1065H76.0534L73.952 11.2082L71.8503 9.1065L72.6826 9.10683Z\" fill=\"currentColor\"/>\n</svg>";
	const CV_BADGE_W_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" width=\"44\" height=\"44\" viewBox=\"0 0 44 44\">\n<mask id=\"cvBadgeWMask\" maskUnits=\"userSpaceOnUse\" x=\"9.852\" y=\"9.887\" width=\"24.15\" height=\"25.178\">\n<path transform=\"translate(9.852 9.887)\" d=\"M13.0326 11.1174V19.675H11.1081V11.1174L0 0V25.1777H24.15V0L13.0326 11.1174Z\" fill=\"#fff\"/>\n</mask>\n<g mask=\"url(#cvBadgeWMask)\">\n<g transform=\"translate(11.111 11.875)\">\n<path d=\"M10.8843 17.6667C12.6806 17.6667 14.4034 16.9531 15.6737 15.6829C16.9439 14.4127 17.6575 12.6899 17.6575 10.8935C17.6575 9.09713 16.9439 7.37434 15.6737 6.10411C14.4034 4.83389 12.6806 4.12029 10.8843 4.12029C9.08791 4.12029 7.36512 4.83389 6.09489 6.10411C4.82467 7.37434 4.11107 9.09713 4.11107 10.8935C4.11107 12.6899 4.82467 14.4127 6.09489 15.6829C7.36512 16.9531 9.08791 17.6667 10.8843 17.6667Z\" fill=\"currentColor\"/>\n<path d=\"M10.8842 20.5628C16.228 20.5628 20.6003 16.2279 20.5629 10.8934C20.5629 5.5496 16.228 1.17738 10.8842 1.21475C5.54039 1.21475 1.16817 5.5496 1.21488 10.8934C1.21488 16.2373 5.54973 20.6095 10.8936 20.5628H10.8842Z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.42901\"/>\n</g>\n</g>\n<path transform=\"translate(18.388 11.405)\" d=\"M3.53194 7.43185C4.03528 7.4571 4.53851 7.37977 5.01104 7.20454C5.48358 7.02932 5.91556 6.75986 6.28074 6.41254C6.64593 6.06521 6.9367 5.64728 7.13538 5.18412C7.33406 4.72095 7.43652 4.22224 7.43652 3.71826C7.43652 3.21428 7.33406 2.71556 7.13538 2.2524C6.9367 1.78924 6.64593 1.37131 6.28074 1.02398C5.91556 0.676661 5.48358 0.407203 5.01104 0.231977C4.53851 0.0567519 4.03528 -0.0205828 3.53194 0.00467139C2.57925 0.0524704 1.68137 0.464581 1.02398 1.15577C0.366599 1.84697 0 2.76437 0 3.71826C0 4.67215 0.366599 5.58955 1.02398 6.28074C1.68137 6.97194 2.57925 7.38405 3.53194 7.43185Z\" fill=\"currentColor\"/>\n</svg>";
	const CV_BADGE_CC_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" width=\"98\" height=\"44\" viewBox=\"0 0 98 44\">\n<g transform=\"translate(14.004 11)\"><path d=\"M11.2699 0C14.4281 0 17.1171 1.10261 19.3346 3.30677C20.396 4.36845 21.2029 5.58185 21.754 6.9459C22.3048 8.31032 22.5811 9.75835 22.5811 11.2907C22.5811 12.8365 22.3083 14.2849 21.7646 15.6352C21.2202 16.9858 20.4168 18.1791 19.3555 19.214C18.2536 20.3025 17.0035 21.1362 15.6052 21.7142C14.2076 22.2921 12.7624 22.5811 11.2706 22.5811C9.77881 22.5811 8.35054 22.296 6.98613 21.724C5.62207 21.1531 4.39879 20.3265 3.31665 19.2447C2.2345 18.1629 1.41134 16.9428 0.846803 15.5851C0.282268 14.2274 0 12.7963 0 11.2907C0 9.79857 0.285443 8.36395 0.856683 6.98613C1.42792 5.60831 2.25814 4.37515 3.34664 3.2863C5.49716 1.0959 8.13813 0 11.2699 0ZM11.3108 2.03656C8.73019 2.03656 6.5592 2.93735 4.7982 4.73822C3.91082 5.639 3.22879 6.65023 2.75176 7.7726C2.27402 8.89496 2.03586 10.0678 2.03586 11.2911C2.03586 12.5009 2.27402 13.6671 2.75176 14.7887C3.22914 15.9118 3.91082 16.9131 4.7982 17.7935C5.68523 18.6741 6.68622 19.3456 7.80259 19.8099C8.9179 20.2735 10.0875 20.5053 11.3108 20.5053C12.5203 20.5053 13.6925 20.2707 14.8296 19.8C15.9654 19.329 16.9893 18.6508 17.9039 17.7638C19.6645 16.0434 20.5445 13.8862 20.5445 11.2914C20.5445 10.0413 20.3159 8.85862 19.859 7.74296C19.4027 6.62729 18.7369 5.63301 17.864 4.75868C16.0483 2.94405 13.8646 2.03656 11.3108 2.03656ZM11.1693 9.4161L9.65673 10.2026C9.49514 9.86702 9.2972 9.63133 9.06221 9.4969C8.82687 9.36282 8.60846 9.29543 8.40664 9.29543C7.39894 9.29543 6.89439 9.96052 6.89439 11.2914C6.89439 11.8962 7.02212 12.3796 7.27722 12.7426C7.53267 13.1057 7.90914 13.2874 8.40664 13.2874C9.06538 13.2874 9.52901 12.9646 9.79822 12.3196L11.1891 13.0252C10.8934 13.5767 10.4834 14.01 9.95911 14.3258C9.43551 14.6419 8.85721 14.7997 8.22528 14.7997C7.21723 14.7997 6.4036 14.4909 5.78543 13.8721C5.16726 13.2539 4.85818 12.3937 4.85818 11.2918C4.85818 10.2163 5.17079 9.36318 5.79566 8.73125C6.42053 8.09967 7.21018 7.78353 8.16495 7.78353C9.56323 7.78283 10.5642 8.32725 11.1693 9.4161ZM17.6816 9.4161L16.1895 10.2026C16.0282 9.86702 15.8296 9.63133 15.5946 9.4969C15.3589 9.36282 15.1334 9.29543 14.9193 9.29543C13.9112 9.29543 13.4067 9.96052 13.4067 11.2914C13.4067 11.8962 13.5347 12.3796 13.7898 12.7426C14.0449 13.1057 14.4211 13.2874 14.9193 13.2874C15.5773 13.2874 16.0413 12.9646 16.3098 12.3196L17.7211 13.0252C17.4124 13.5767 16.9953 14.01 16.4717 14.3258C15.9474 14.6419 15.3762 14.7997 14.758 14.7997C13.7362 14.7997 12.9201 14.4909 12.309 13.8721C11.6965 13.2539 11.3909 12.3937 11.3909 11.2918C11.3909 10.2163 11.7032 9.36318 12.3288 8.73125C12.9533 8.09967 13.7429 7.78353 14.6973 7.78353C16.0953 7.78283 17.0906 8.32725 17.6816 9.4161Z\" fill=\"currentColor\"/></g>\n<g transform=\"translate(37.710 11)\"><path d=\"M11.2708 2.65534e-05C14.442 2.65534e-05 17.1172 1.08852 19.2949 3.26622C21.4853 5.45732 22.5816 8.13216 22.5816 11.2907C22.5816 14.4631 21.5058 17.104 19.3549 19.214C17.07 21.4591 14.3754 22.5814 11.2708 22.5814C8.2191 22.5814 5.57143 21.4721 3.32705 19.2542C1.10948 17.0363 0.000171098 14.3823 0.000171098 11.2907C0.000171098 8.19955 1.10948 5.52471 3.32705 3.26657C5.50475 1.08852 8.15207 2.65534e-05 11.2708 2.65534e-05ZM11.311 2.03659C8.74377 2.03659 6.57313 2.93738 4.79872 4.73824C2.95693 6.62026 2.03638 8.80466 2.03638 11.2911C2.03638 13.7913 2.95022 15.9556 4.77791 17.7825C6.60594 19.6109 8.78329 20.5244 11.3103 20.5244C13.8235 20.5244 16.015 19.6046 17.8832 17.7624C19.6577 16.0554 20.5447 13.8982 20.5447 11.2904C20.5447 8.72316 19.6439 6.53947 17.8434 4.73789C16.0425 2.93702 13.8648 2.03659 11.311 2.03659ZM14.3355 8.48817V13.105H13.0455V18.5888H9.53694V13.1054H8.24698V8.48817C8.24698 8.28635 8.31754 8.11523 8.45833 7.97409C8.59981 7.83331 8.77129 7.76239 8.97241 7.76239H13.6101C13.7981 7.76239 13.9664 7.83296 14.1139 7.97409C14.261 8.11523 14.3355 8.2867 14.3355 8.48817ZM9.71795 5.58505C9.71795 4.52372 10.2419 3.99235 11.2909 3.99235C12.3399 3.99235 12.8635 4.52302 12.8635 5.58505C12.8635 6.63332 12.3392 7.15763 11.2909 7.15763C10.2426 7.15763 9.71795 6.63332 9.71795 5.58505Z\" fill=\"currentColor\"/></g>\n<g transform=\"translate(61.417 11)\"><path d=\"M11.2708 2.65534e-05C14.4291 2.65534e-05 17.1036 1.09558 19.295 3.28668C21.4854 5.46438 22.5817 8.13216 22.5817 11.2907C22.5817 14.45 21.5059 17.0973 19.355 19.2345C17.0838 21.4658 14.3885 22.5814 11.2708 22.5814C8.21917 22.5814 5.5715 21.4725 3.32712 19.2546C1.10955 17.037 0.000242034 14.383 0.000242034 11.2911C0.000242034 8.21331 1.10955 5.54518 3.32712 3.28703C5.51787 1.09558 8.1659 2.65534e-05 11.2708 2.65534e-05ZM11.3111 2.03659C8.74384 2.03659 6.5732 2.94408 4.79879 4.75871C2.957 6.62732 2.03645 8.80466 2.03645 11.2907C2.03645 13.8047 2.95029 15.9683 4.77798 17.7829C6.60601 19.6113 8.78336 20.5248 11.3104 20.5248C13.8236 20.5248 16.0151 19.6042 17.8833 17.7628C19.6577 16.0424 20.5448 13.8851 20.5448 11.2907C20.5448 8.71046 19.644 6.53276 17.8434 4.75871C16.0556 2.94337 13.8779 2.03659 11.3111 2.03659ZM6.27047 9.69769C6.48534 8.31317 7.04282 7.24125 7.94361 6.48195C8.84404 5.72265 9.93924 5.343 11.2299 5.343C13.0036 5.343 14.4157 5.9146 15.4639 7.05637C16.5122 8.19885 17.0365 9.66417 17.0365 11.4516C17.0365 13.1858 16.4921 14.6271 15.4039 15.776C14.3144 16.9248 12.9038 17.4999 11.1692 17.4999C9.89232 17.4999 8.79006 17.1171 7.86281 16.3507C6.93521 15.5844 6.37773 14.4959 6.18932 13.0845H9.03281C9.09985 14.4557 9.92654 15.1412 11.5129 15.1412C12.3054 15.1412 12.9443 14.7983 13.4281 14.1131C13.9125 13.4279 14.1546 12.5133 14.1546 11.3712C14.1546 10.1747 13.9326 9.26441 13.4895 8.63919C13.0456 8.01431 12.4077 7.7017 11.5736 7.7017C10.0677 7.7017 9.22122 8.3668 9.03316 9.69734H9.85986L7.62218 11.9354L5.38415 9.69734L6.27047 9.69769Z\" fill=\"currentColor\"/></g>\n</svg>";
	const CV_BADGE_CC0_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" width=\"74.289\" height=\"44\" viewBox=\"0 0 74.289 44\">\n<g transform=\"translate(14 11)\"><path d=\"M11.2699 0C14.4281 0 17.1171 1.10261 19.3346 3.30677C20.396 4.36845 21.2029 5.58185 21.754 6.9459C22.3048 8.31032 22.5811 9.75835 22.5811 11.2907C22.5811 12.8365 22.3083 14.2849 21.7646 15.6352C21.2202 16.9858 20.4168 18.1791 19.3555 19.214C18.2536 20.3025 17.0035 21.1362 15.6052 21.7142C14.2076 22.2921 12.7624 22.5811 11.2706 22.5811C9.77881 22.5811 8.35054 22.296 6.98613 21.724C5.62207 21.1531 4.39879 20.3265 3.31665 19.2447C2.2345 18.1629 1.41134 16.9428 0.846803 15.5851C0.282268 14.2274 0 12.7963 0 11.2907C0 9.79857 0.285443 8.36395 0.856683 6.98613C1.42792 5.60831 2.25814 4.37515 3.34664 3.2863C5.49716 1.0959 8.13813 0 11.2699 0ZM11.3108 2.03656C8.73019 2.03656 6.5592 2.93735 4.7982 4.73822C3.91082 5.639 3.22879 6.65023 2.75176 7.7726C2.27402 8.89496 2.03586 10.0678 2.03586 11.2911C2.03586 12.5009 2.27402 13.6671 2.75176 14.7887C3.22914 15.9118 3.91082 16.9131 4.7982 17.7935C5.68523 18.6741 6.68622 19.3456 7.80259 19.8099C8.9179 20.2735 10.0875 20.5053 11.3108 20.5053C12.5203 20.5053 13.6925 20.2707 14.8296 19.8C15.9654 19.329 16.9893 18.6508 17.9039 17.7638C19.6645 16.0434 20.5445 13.8862 20.5445 11.2914C20.5445 10.0413 20.3159 8.85862 19.859 7.74296C19.4027 6.62729 18.7369 5.63301 17.864 4.75868C16.0483 2.94405 13.8646 2.03656 11.3108 2.03656ZM11.1693 9.4161L9.65673 10.2026C9.49514 9.86702 9.2972 9.63133 9.06221 9.4969C8.82687 9.36282 8.60846 9.29543 8.40664 9.29543C7.39894 9.29543 6.89439 9.96052 6.89439 11.2914C6.89439 11.8962 7.02212 12.3796 7.27722 12.7426C7.53267 13.1057 7.90914 13.2874 8.40664 13.2874C9.06538 13.2874 9.52901 12.9646 9.79822 12.3196L11.1891 13.0252C10.8934 13.5767 10.4834 14.01 9.95911 14.3258C9.43551 14.6419 8.85721 14.7997 8.22528 14.7997C7.21723 14.7997 6.4036 14.4909 5.78543 13.8721C5.16726 13.2539 4.85818 12.3937 4.85818 11.2918C4.85818 10.2163 5.17079 9.36318 5.79566 8.73125C6.42053 8.09967 7.21018 7.78353 8.16495 7.78353C9.56323 7.78283 10.5642 8.32725 11.1693 9.4161ZM17.6816 9.4161L16.1895 10.2026C16.0282 9.86702 15.8296 9.63133 15.5946 9.4969C15.3589 9.36282 15.1334 9.29543 14.9193 9.29543C13.9112 9.29543 13.4067 9.96052 13.4067 11.2914C13.4067 11.8962 13.5347 12.3796 13.7898 12.7426C14.0449 13.1057 14.4211 13.2874 14.9193 13.2874C15.5773 13.2874 16.0413 12.9646 16.3098 12.3196L17.7211 13.0252C17.4124 13.5767 16.9953 14.01 16.4717 14.3258C15.9474 14.6419 15.3762 14.7997 14.758 14.7997C13.7362 14.7997 12.9201 14.4909 12.309 13.8721C11.6965 13.2539 11.3909 12.3937 11.3909 11.2918C11.3909 10.2163 11.7032 9.36318 12.3288 8.73125C12.9533 8.09967 13.7429 7.78353 14.6973 7.78353C16.0953 7.78283 17.0906 8.32725 17.6816 9.4161Z\" fill=\"currentColor\"/><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M27.0532 3.28163C29.2035 1.08911 31.8431 0 34.9765 0C38.1346 0 40.8299 1.1004 43.0488 3.30421C44.0951 4.34173 44.9183 5.58217 45.4678 6.94937C46.0173 8.30718 46.289 9.75757 46.289 11.29C46.289 12.8367 46.018 14.2886 45.4663 15.6464C44.9289 16.9899 44.1258 18.1769 43.0631 19.2118C41.9895 20.2817 40.7166 21.1307 39.3163 21.7107C37.9412 22.2846 36.4658 22.5801 34.9757 22.58C33.4832 22.58 32.0531 22.2985 30.6818 21.7332C29.324 21.156 28.1016 20.3265 27.0133 19.251C25.9385 18.1626 25.1196 16.941 24.5551 15.5832C23.9901 14.2227 23.7025 12.7631 23.7091 11.29C23.7091 9.79821 23.9906 8.36815 24.5551 6.99679C25.1355 5.60586 25.9847 4.34312 27.0539 3.28087L27.0532 3.28163ZM41.5698 4.75083C39.7551 2.93766 37.5762 2.0322 35.0216 2.0322C32.4407 2.0322 30.2678 2.9354 28.5073 4.73503C27.6369 5.6114 26.9396 6.64403 26.4518 7.77881C25.9809 8.88941 25.7392 10.0837 25.7413 11.29C25.7413 12.4995 25.9821 13.6639 26.4526 14.7922C26.9404 15.9151 27.6378 16.9349 28.5073 17.7968C29.3709 18.6552 30.3912 19.3399 31.5127 19.814C32.6282 20.2708 33.7993 20.5011 35.0224 20.5011C36.2327 20.5011 37.3963 20.2678 38.5253 19.7974C39.6743 19.3213 40.7212 18.6288 41.6089 17.7577C43.3687 16.0371 44.2568 13.8844 44.2568 11.29C44.2568 10.0406 44.0265 8.85588 43.5689 7.74042C43.1086 6.62075 42.4286 5.6047 41.569 4.75234L41.5698 4.75083ZM30.334 11.29C30.334 8.30869 31.2719 4.79148 34.999 4.79148C38.7262 4.79148 39.6633 8.30869 39.6633 11.29C39.6633 14.2721 38.7262 17.7885 34.999 17.7885C31.2711 17.7885 30.334 14.2721 30.334 11.29ZM35.4183 7.2971C35.2813 7.26166 35.1405 7.24321 34.999 7.24216C33.082 7.24216 32.9909 9.9766 32.9909 11.2892C32.9909 11.7122 33.0015 12.2775 33.0782 12.8548L35.5605 8.29363C35.8179 7.84806 35.687 7.52892 35.4175 7.2971H35.4183ZM37.0071 11.29C37.0071 10.7759 36.9883 10.0451 36.8566 9.34511L34.0823 14.1366C33.6954 14.7176 33.9641 15.0466 34.3909 15.228C34.4285 15.243 34.4699 15.2558 34.5091 15.2671L34.5806 15.2904C34.71 15.3228 34.8485 15.3386 34.9998 15.3386C36.9161 15.3386 37.0071 12.6034 37.0071 11.29Z\" fill=\"currentColor\"/></g>\n</svg>";
	const CV_BADGE_APACHE_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" width=\"44\" height=\"44\" viewBox=\"0 0 44 44\">\n<g transform=\"translate(14.2 10) scale(0.024)\">\n<path d=\"M276.709 398.152C302.237 335.028 330.72 272.027 361.282 216.188C315.661 182.303 271.854 109.235 253.856 76.8613C247.392 84.2053 243.195 92.6636 241.293 99.5449C224.337 160.766 284.695 234.695 236.079 207.684C195.574 185.177 104.364 135.887 69.5728 184.877C108.537 234.942 210.451 360.904 276.709 398.152Z\" fill=\"currentColor\" fill-opacity=\"0.8\"/>\n<path d=\"M361.282 216.188C390.896 162.082 422.455 114.695 455.174 80.5556C455.174 80.5556 422.54 127.793 375.928 222.222C404.157 229.996 484.553 245.948 596.537 217.022C599.29 196.671 585.609 174.287 517.431 166.793C472.921 161.906 570.856 60.5112 499.909 12.5571C497.618 11.0062 495.367 9.63772 493.161 8.41264C490.783 7.55899 488.27 6.77703 485.589 6.07977C402.73 -15.5416 391.245 124.958 358.181 94.7548C304.749 45.947 271.024 57.3507 253.856 76.8608C271.855 109.234 315.661 182.302 361.282 216.188Z\" fill=\"currentColor\" fill-opacity=\"0.7\"/>\n<path d=\"M210.066 580.024C228.771 523.99 251.272 461.035 276.709 398.152C210.451 360.904 108.538 234.942 69.5728 184.877C62.6165 194.665 57.8628 208.316 56.2793 226.986C47.782 327.267 151.236 401.508 130.612 415.068C103.331 433.008 49.0331 371.975 27.6333 410.754C58.6513 450.602 121.834 522.602 210.066 580.024Z\" fill=\"currentColor\" fill-opacity=\"0.9\"/>\n<path d=\"M496.715 363.752C444.333 345.069 551.453 294.965 586.237 241.811C590.688 235.014 595.289 226.23 596.537 217.022C484.553 245.949 404.157 229.997 375.928 222.223C351.797 271.115 323.933 332.727 294.874 407.014C325.139 419.956 448.716 467.76 623.264 468.008C652.61 391.57 546.429 381.477 496.715 363.752Z\" fill=\"currentColor\" fill-opacity=\"0.8\"/>\n<path d=\"M230.306 590.111C261.086 599.703 363.074 628.356 471.39 624.042C485.941 584.644 431.539 580.799 427.108 549.201C423.677 524.752 570.276 569.747 617.445 480.844C619.83 476.348 621.69 472.106 623.264 468.007C448.716 467.759 325.139 419.955 294.874 407.014C273.637 461.302 251.791 522.23 230.306 590.111Z\" fill=\"currentColor\" fill-opacity=\"0.9\"/>\n<path d=\"M230.306 590.111C216.475 633.804 202.83 680.481 189.585 729.81C184.887 747.3 180.244 765.115 175.666 783.322C278.472 817.26 373.139 783.4 376.348 741.435C376.374 741.103 376.312 740.855 376.332 740.536C378.779 696.087 312.158 720.726 313.735 694.002C315.319 667.083 430.043 693.846 465.521 636.13C468.242 631.705 470.015 627.776 471.389 624.042C363.074 628.356 261.086 599.703 230.306 590.111Z\" fill=\"currentColor\"/>\n<path d=\"M27.6335 410.754C26.1347 413.471 24.7825 416.612 23.6291 420.366C3.70528 485.119 144.59 572.106 125.422 591.069C108.143 608.155 85.626 569.109 57.8597 585.237C54.8166 587.009 51.7278 589.244 48.5576 592.496C17.1551 624.667 48.0656 717.35 137.161 766.822C116.37 836.632 95.6711 914.627 75.4084 996.193C82.7588 993.619 91.556 991.038 93.7455 984.105C97.033 970.59 117.351 888.353 150.34 776.786C150.34 776.786 156.361 753.933 167.384 716.281C177.576 681.464 192.058 633.979 210.066 580.024C121.834 522.601 58.6515 450.602 27.6335 410.754Z\" fill=\"currentColor\"/>\n</g>\n</svg>";
	const CV_BADGE_MW_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" width=\"98\" height=\"44\" viewBox=\"0 0 98 44\">\n<g transform=\"translate(14 10)\">\n<path d=\"M32.9677 19.1988L32.9598 12.7919H32.0766L29.8232 17.0343L27.5289 12.7919H26.6441V19.1988H27.6666V15.0067L29.5652 18.4666H30.0458L31.9452 14.9509L31.9531 19.1941H32.9677V19.1988ZM38.4096 16.7826C38.4197 16.3254 38.3219 15.8721 38.1241 15.4597C37.9504 15.0931 37.6745 14.7843 37.3296 14.5706C36.9847 14.3569 36.5855 14.2472 36.1798 14.2548C35.7677 14.2477 35.3621 14.358 35.0105 14.5729C34.6588 14.7878 34.3755 15.0984 34.1939 15.4684C33.9937 15.8668 33.8933 16.3078 33.9013 16.7535C33.8934 17.2019 33.998 17.6423 34.2025 18.045C34.3952 18.4186 34.6917 18.7285 35.0567 18.9377C35.4083 19.1269 35.7976 19.2358 36.1964 19.2563C36.5952 19.2768 36.9935 19.2086 37.3627 19.0565C37.6601 18.9262 37.9188 18.7214 38.1139 18.4619L37.5609 17.7571C37.4132 17.9291 37.2289 18.066 37.0215 18.1579C36.8142 18.2497 36.589 18.2942 36.3623 18.288C36.0169 18.3005 35.6785 18.1889 35.4083 17.9734C35.1485 17.7573 34.979 17.4517 34.9332 17.1169H38.3915C38.4025 16.9701 38.408 16.8574 38.408 16.7787L38.4096 16.7826ZM36.179 15.1711C36.3342 15.1671 36.4886 15.1942 36.6331 15.2508C36.7776 15.3074 36.9094 15.3924 37.0206 15.5006C37.2526 15.7319 37.3958 16.0355 37.4265 16.3611H34.9238C34.9576 16.0331 35.1054 15.7271 35.3406 15.4959C35.5664 15.281 35.8674 15.1642 36.179 15.1711ZM42.5199 12.4041V14.9123C42.3569 14.6993 42.1444 14.5293 41.9009 14.4168C41.6493 14.3042 41.376 14.2481 41.1003 14.2524C40.6976 14.2458 40.3014 14.3543 39.9583 14.5651C39.6151 14.7759 39.3392 15.0803 39.1631 15.4424C38.973 15.8534 38.8745 16.3008 38.8745 16.7535C38.8745 17.2063 38.973 17.6537 39.1631 18.0647C39.3372 18.4291 39.6124 18.7357 39.9558 18.9482C40.2992 19.1607 40.6965 19.2701 41.1003 19.2633C41.3866 19.2665 41.6697 19.2075 41.9308 19.0895C42.1826 18.9724 42.4001 18.7926 42.5624 18.5673V19.1988H43.5534V12.4112H42.516L42.5199 12.4041ZM41.2253 18.2833C40.9894 18.2873 40.7574 18.2228 40.5568 18.0985C40.3528 17.9675 40.1896 17.7819 40.0857 17.5629C39.9718 17.3095 39.913 17.0349 39.913 16.7571C39.913 16.4793 39.9718 16.2047 40.0857 15.9513C40.1895 15.7326 40.3531 15.547 40.556 15.4157C40.7573 15.2927 40.9886 15.2276 41.2245 15.2276C41.4605 15.2276 41.6918 15.2927 41.8931 15.4157C42.0976 15.547 42.2604 15.7326 42.3642 15.9513C42.478 16.2047 42.5369 16.4793 42.5369 16.7571C42.5369 17.0349 42.478 17.3095 42.3642 17.5629C42.2601 17.7816 42.0973 17.967 41.8939 18.0985C41.6934 18.2231 41.4613 18.2873 41.2253 18.2833ZM44.7418 19.198H45.7722V14.3098H44.7411L44.7418 19.198ZM48.6453 14.2556C48.2951 14.2537 47.9467 14.3062 47.6126 14.4113C47.3095 14.5053 47.0276 14.6576 46.7829 14.8596L47.1879 15.6894C47.3637 15.53 47.5704 15.4084 47.7951 15.3323C48.0287 15.2474 48.2757 15.2041 48.525 15.2041C48.6735 15.1931 48.8228 15.212 48.9639 15.2595C49.1051 15.307 49.2353 15.3823 49.3469 15.481C49.4438 15.5867 49.5183 15.711 49.5659 15.8463C49.6135 15.9816 49.6332 16.1251 49.6238 16.2683V16.3414H48.4802C47.9833 16.3003 47.4885 16.4421 47.0888 16.7402C46.9424 16.8734 46.827 17.0371 46.7508 17.2197C46.6746 17.4024 46.6393 17.5995 46.6476 17.7973C46.6411 18.062 46.7107 18.3231 46.8482 18.5495C46.9856 18.7759 47.1852 18.9582 47.4231 19.0746C47.6936 19.2035 47.9909 19.2665 48.2898 19.2586C48.5808 19.2665 48.8703 19.2083 49.1353 19.0887C49.3609 18.9839 49.5495 18.8133 49.6765 18.5995V19.1988H50.6517V16.3328C50.6737 16.0514 50.6394 15.7685 50.5508 15.5006C50.4622 15.2327 50.3211 14.9851 50.1358 14.7723C49.9352 14.5898 49.6998 14.4498 49.4436 14.3608C49.1874 14.2719 48.9158 14.2366 48.6453 14.2556ZM48.5045 18.4288C48.2833 18.442 48.0644 18.3768 47.8863 18.2448C47.8131 18.1853 47.7547 18.1095 47.7159 18.0235C47.6772 17.9375 47.659 17.8436 47.663 17.7493C47.663 17.3193 47.9603 17.1043 48.5549 17.1043H49.6182V17.6667C49.5461 17.8979 49.396 18.097 49.1935 18.2298C48.9881 18.3622 48.7481 18.4306 48.5038 18.4265L48.5045 18.4288ZM59.327 12.7895L57.8515 17.6871L56.3909 12.7895H55.3984L53.904 17.6596L52.4678 12.7895H51.3533L53.2685 19.1973H54.4144L55.8671 14.4553L57.2954 19.1973H58.4359L60.3511 12.7895H59.327ZM61.0031 19.1973H62.035V14.3091H61.0023L61.0031 19.1973ZM66.5512 19.1973H67.8057L65.7898 16.3595L67.635 14.3091H66.3931L64.2538 16.5066V12.4112H63.2234V19.1996H64.2538V17.9082L65.0222 17.1028L66.5512 19.1973ZM68.2681 19.1973H69.3V14.3091H68.2673L68.2681 19.1973ZM45.2609 13.6633C45.3485 13.6664 45.4358 13.6516 45.5175 13.6198C45.5992 13.5881 45.6735 13.54 45.736 13.4785C45.7965 13.4182 45.844 13.3463 45.8758 13.267C45.9076 13.1878 45.9229 13.1029 45.9208 13.0176C45.9226 12.9365 45.9065 12.8561 45.8736 12.782C45.8407 12.7079 45.7918 12.642 45.7305 12.5889C45.6013 12.474 45.433 12.413 45.2602 12.4183C45.086 12.4134 44.9169 12.4776 44.7898 12.5968C44.699 12.6833 44.6369 12.7956 44.6119 12.9185C44.5868 13.0414 44.6001 13.1691 44.6498 13.2842C44.6827 13.3604 44.7302 13.4294 44.7898 13.4871C44.9169 13.6064 45.086 13.6705 45.2602 13.6657L45.2609 13.6633ZM61.523 13.6633C61.6106 13.6664 61.6979 13.6516 61.7795 13.6198C61.8612 13.5881 61.9356 13.54 61.998 13.4785C62.0585 13.4182 62.1061 13.3463 62.1378 13.267C62.1696 13.1878 62.1849 13.1029 62.1829 13.0176C62.1846 12.9365 62.1685 12.8561 62.1356 12.782C62.1027 12.7079 62.0539 12.642 61.9925 12.5889C61.8633 12.474 61.695 12.413 61.5222 12.4183C61.348 12.4134 61.1789 12.4776 61.0518 12.5968C60.9914 12.6541 60.9433 12.7232 60.9104 12.7997C60.8775 12.8762 60.8605 12.9587 60.8605 13.042C60.8605 13.1253 60.8775 13.2077 60.9104 13.2843C60.9433 13.3608 60.9914 13.4298 61.0518 13.4871C61.1789 13.6064 61.348 13.6705 61.5222 13.6657L61.523 13.6633ZM68.7872 13.6633C68.8748 13.6664 68.9621 13.6516 69.0438 13.6198C69.1255 13.5881 69.1998 13.54 69.2623 13.4785C69.3226 13.4182 69.37 13.3462 69.4017 13.267C69.4333 13.1877 69.4485 13.1029 69.4463 13.0176C69.4482 12.9366 69.4322 12.8562 69.3995 12.7821C69.3667 12.708 69.318 12.642 69.2568 12.5889C69.1276 12.474 68.9593 12.413 68.7865 12.4183C68.6123 12.4134 68.4432 12.4776 68.3161 12.5968C68.2557 12.6541 68.2075 12.7232 68.1746 12.7997C68.1417 12.8762 68.1248 12.9587 68.1248 13.042C68.1248 13.1253 68.1417 13.2077 68.1746 13.2843C68.2075 13.3608 68.2557 13.4298 68.3161 13.4871C68.4432 13.6064 68.6123 13.6705 68.7865 13.6657L68.7872 13.6633ZM28.4216 7.79905C28.7488 7.80456 29.0744 7.75737 29.3867 7.65984C29.6442 7.57867 29.8822 7.44534 30.0859 7.26816C30.271 7.10241 30.4171 6.89774 30.5138 6.66883C30.6126 6.42569 30.6618 6.16522 30.6585 5.90276C30.6627 5.64279 30.6173 5.38439 30.5248 5.14141C30.4367 4.91549 30.295 4.71438 30.1118 4.55546C29.9087 4.38257 29.6712 4.2547 29.415 4.18029C29.0939 4.08585 28.7602 4.04076 28.4256 4.04658H26.6331V10.0037H27.488V7.79905H28.4216ZM27.488 4.72063H28.4224C28.6277 4.71669 28.833 4.74422 29.0304 4.80164C29.1893 4.84804 29.3363 4.92748 29.4622 5.03602C29.5762 5.13669 29.6643 5.26332 29.7194 5.4049C29.7784 5.56377 29.8075 5.73209 29.8043 5.9004C29.8051 6.07029 29.7736 6.23782 29.7123 6.39591C29.6548 6.5422 29.5644 6.67327 29.448 6.77894C29.3222 6.89063 29.1743 6.97557 29.0147 7.02827C28.8227 7.09119 28.6214 7.12265 28.4193 7.12029H27.488V4.72063ZM32.2016 5.87681C31.9594 5.97119 31.7407 6.12063 31.5622 6.30939C31.3813 6.50602 31.2429 6.73883 31.1571 6.99209C30.9691 7.57721 30.9691 8.20652 31.1571 8.79164C31.2436 9.04568 31.3805 9.27849 31.5622 9.47591C31.7407 9.66625 31.9586 9.81411 32.2016 9.90928C32.7428 10.1114 33.3388 10.1114 33.88 9.90928C34.1207 9.81332 34.3378 9.66546 34.5148 9.47669C34.6942 9.27813 34.8313 9.04502 34.9175 8.79164C35.1055 8.20652 35.1055 7.57721 34.9175 6.99209C34.831 6.73955 34.6939 6.50726 34.5148 6.30939C34.3383 6.11946 34.1214 5.97163 33.88 5.87681C33.3388 5.6747 32.7428 5.6747 32.2016 5.87681ZM32.1269 9.04096C31.9061 8.70121 31.8005 8.29942 31.8257 7.89501C31.8023 7.49102 31.9078 7.09005 32.1269 6.74984C32.2338 6.61136 32.3732 6.50142 32.5327 6.42979C32.6923 6.35817 32.8671 6.32707 33.0416 6.33928C33.2146 6.32739 33.3878 6.35869 33.5457 6.43035C33.7036 6.50202 33.8412 6.61181 33.9461 6.74984C34.164 7.0904 34.2686 7.49153 34.245 7.89501C34.2692 8.299 34.1646 8.70026 33.9461 9.04096C33.8403 9.17775 33.7024 9.28639 33.5447 9.35731C33.3869 9.42822 33.2142 9.45923 33.0416 9.44759C32.8675 9.46025 32.6929 9.42977 32.5333 9.35884C32.3738 9.28791 32.2342 9.17873 32.1269 9.04096ZM36.8185 10.0037H37.4123C37.4548 10.0032 37.4959 9.98805 37.5285 9.96083C37.5612 9.93361 37.5835 9.89596 37.5916 9.85422L38.5079 7.07703C38.5294 7.01149 38.5472 6.9449 38.5614 6.87726L38.6031 6.67591C38.6172 6.7425 38.6327 6.80883 38.6495 6.8749C38.6747 6.974 38.6849 7.00703 38.7061 7.0731L39.6075 9.85422C39.6112 9.89393 39.6292 9.93093 39.6581 9.95839C39.6871 9.98586 39.7249 10.0019 39.7648 10.0037H40.3877L41.7492 5.79108H41.1553C41.1056 5.78989 41.0567 5.80447 41.0158 5.83272C40.9748 5.86098 40.9438 5.90146 40.9272 5.94838L40.1384 8.57535C40.0869 8.77161 40.0438 8.96999 40.0094 9.16995C39.9639 8.97078 39.9125 8.77301 39.8552 8.57692L39.0113 5.93265C38.9978 5.88835 38.9702 5.84968 38.9326 5.82254C38.8907 5.79281 38.8401 5.77762 38.7887 5.77928H38.4505C38.4025 5.77722 38.3553 5.79117 38.3161 5.81893C38.2769 5.8467 38.2481 5.88671 38.2342 5.93265L37.3793 8.57535L37.2912 8.87894C37.2639 8.97594 37.2377 9.07295 37.2125 9.16995C37.1783 8.97113 37.1381 8.77337 37.0922 8.57692L36.3167 5.94917C36.3014 5.9047 36.2732 5.86581 36.2357 5.83748C36.1901 5.80505 36.135 5.78872 36.0792 5.79108H35.4578L36.8185 10.0037ZM43.2994 5.88625C43.0634 5.98849 42.8511 6.13872 42.6772 6.32827C42.5042 6.52054 42.3709 6.74505 42.2848 6.98894C42.191 7.25188 42.1447 7.52936 42.1479 7.80849C42.1416 8.13804 42.1927 8.46602 42.2989 8.77748C42.3886 9.03939 42.5325 9.28085 42.7205 9.48377C42.9014 9.67254 43.1216 9.82119 43.3654 9.91478C43.623 10.0143 43.8971 10.0644 44.1732 10.0626C44.3273 10.0626 44.481 10.0503 44.6341 10.0257C44.7898 10.0016 44.9414 9.96224 45.0887 9.90771C45.2327 9.85511 45.3707 9.78708 45.5 9.70478C45.6275 9.62351 45.7394 9.52441 45.8359 9.40748L45.6117 9.12197C45.5967 9.0975 45.5753 9.0776 45.5498 9.06443C45.5243 9.05126 45.4957 9.04532 45.467 9.04726C45.4042 9.05194 45.3438 9.0737 45.2924 9.11018C45.2133 9.15864 45.1325 9.20429 45.0502 9.24703C44.94 9.30261 44.8265 9.34849 44.7096 9.38467C44.5566 9.42912 44.3978 9.45007 44.2385 9.44681C44.0585 9.44965 43.8797 9.41815 43.7115 9.354C43.5552 9.29472 43.4159 9.19804 43.3057 9.07242C43.1857 8.93391 43.0955 8.77221 43.0406 8.59737C42.9716 8.37972 42.9345 8.1532 42.9305 7.9249H45.7116C45.7395 7.92861 45.7678 7.9248 45.7936 7.91388C45.8195 7.90295 45.842 7.8853 45.8587 7.86276C45.8918 7.78544 45.9053 7.70116 45.898 7.61737C45.9025 7.34393 45.8577 7.07193 45.7659 6.81433C45.689 6.59699 45.5661 6.39878 45.4057 6.23319C45.2453 6.06761 45.051 5.93854 44.8362 5.85478C44.6109 5.76944 44.3717 5.72625 44.1307 5.72737C43.8456 5.72177 43.5624 5.77589 43.2994 5.88625ZM44.5845 6.38647C44.7112 6.44033 44.8247 6.52103 44.9172 6.62301C45.0097 6.72498 45.0789 6.84581 45.1202 6.97714C45.1694 7.12711 45.193 7.281 45.1909 7.43883H42.9525C42.9822 7.12916 43.112 6.8376 43.3222 6.60827C43.4926 6.46009 43.7001 6.36115 43.9226 6.32207C44.145 6.28299 44.3738 6.30525 44.5845 6.38647ZM47.5686 10.0037V7.36018C47.6163 7.23276 47.674 7.10954 47.7416 6.99051C47.7993 6.88827 47.8711 6.79677 47.9571 6.71602C48.0368 6.64209 48.1275 6.58572 48.2293 6.54692C48.3402 6.50602 48.4581 6.48636 48.5761 6.48872C48.6605 6.48819 48.7442 6.49632 48.827 6.5131C48.8836 6.52726 48.9413 6.53565 49 6.53827C49.0322 6.54007 49.0638 6.52951 49.0884 6.50873C49.1129 6.48796 49.1286 6.45856 49.1322 6.42658L49.1872 5.83669C49.122 5.79316 49.0492 5.76222 48.9725 5.74546C48.8875 5.72523 48.8004 5.7152 48.713 5.71557C48.4594 5.70999 48.2122 5.79536 48.0161 5.95624C47.8066 6.13763 47.6396 6.36292 47.5269 6.61613L47.4766 6.00186C47.4735 5.94105 47.4509 5.88285 47.4121 5.83591C47.361 5.79938 47.2984 5.78262 47.2359 5.78872H46.7844V10.0037H47.5725H47.5686ZM50.5558 5.88625C50.3198 5.98849 50.1075 6.13872 49.9329 6.32827C49.7601 6.5206 49.627 6.74511 49.5412 6.98894C49.4472 7.25183 49.4006 7.52932 49.4035 7.80849C49.3971 8.13781 49.4482 8.46573 49.5545 8.77748C49.6442 9.03939 49.7881 9.28085 49.9761 9.48377C50.157 9.67254 50.3772 9.82119 50.6218 9.91478C50.8792 10.0142 51.1529 10.0643 51.4288 10.0626C51.583 10.0626 51.7366 10.0503 51.8897 10.0257C52.0449 10.0016 52.1965 9.96224 52.3443 9.90771C52.4884 9.85511 52.6263 9.78708 52.7557 9.70478C52.8819 9.62314 52.9952 9.52291 53.0915 9.40748L52.8674 9.12197C52.8523 9.0975 52.8309 9.0776 52.8054 9.06443C52.7799 9.05126 52.7513 9.04532 52.7226 9.04726C52.6601 9.05208 52.6 9.07383 52.5488 9.11018C52.4694 9.15866 52.3884 9.2043 52.3058 9.24703C52.1957 9.30261 52.0824 9.34849 51.966 9.38467C51.8128 9.4292 51.6536 9.45015 51.4941 9.44681C51.3141 9.44965 51.1353 9.41815 50.9671 9.354C50.8112 9.29461 50.6721 9.19793 50.5621 9.07242C50.4418 8.93398 50.3513 8.77228 50.2962 8.59737C50.2272 8.37972 50.1901 8.1532 50.1861 7.9249H52.9672C52.9952 7.92876 53.0237 7.92502 53.0497 7.91409C53.0757 7.90316 53.0983 7.88543 53.1151 7.86276C53.1466 7.78411 53.1591 7.69917 53.1497 7.61501C53.154 7.34126 53.109 7.06898 53.0168 6.81119C52.9372 6.59032 52.8115 6.38895 52.6479 6.22051C52.4898 6.05836 52.2985 5.93226 52.0871 5.85085C51.8617 5.76604 51.6225 5.72339 51.3816 5.72501C51.0973 5.7206 50.8153 5.77551 50.5534 5.88625H50.5558ZM51.8402 6.38647C51.9671 6.43987 52.0809 6.52043 52.1734 6.62247C52.2659 6.72451 52.335 6.84557 52.3758 6.97714C52.4251 7.12711 52.4487 7.281 52.4466 7.43883H50.2074C50.237 7.12916 50.3668 6.8376 50.577 6.60827C50.7473 6.46023 50.9548 6.36138 51.177 6.3223C51.3993 6.28322 51.628 6.30541 51.8386 6.38647H51.8402ZM57.5495 10.0037V3.8822H56.7606V6.19771C56.6186 6.03811 56.4429 5.91211 56.2462 5.82886C56.0495 5.7456 55.8367 5.70717 55.6233 5.71636C55.3605 5.71127 55.1003 5.76898 54.8643 5.88467C54.6425 5.99478 54.4475 6.15209 54.2917 6.34557C54.1293 6.55294 54.0069 6.78871 53.9307 7.04085C53.8455 7.32285 53.8036 7.61616 53.8065 7.91074C53.8017 8.2222 53.8395 8.53209 53.9181 8.83332C53.9811 9.07636 54.0912 9.30523 54.2406 9.50737C54.3712 9.68355 54.5434 9.82512 54.7416 9.92029C54.9461 10.0155 55.1695 10.0626 55.396 10.0595C55.5376 10.0621 55.677 10.0464 55.8144 10.0123C55.9429 9.98085 56.0661 9.9334 56.1841 9.86995C56.3005 9.80703 56.4093 9.73231 56.5105 9.6458C56.6143 9.55666 56.71 9.45913 56.7976 9.35321L56.8684 9.84793C56.8772 9.89515 56.9032 9.9374 56.9415 9.96648C56.9797 9.99555 57.0274 10.0094 57.0752 10.0052H57.5495V10.0037ZM55.2167 9.34141C55.0863 9.28232 54.9745 9.18877 54.8934 9.07085C54.7954 8.9285 54.726 8.76851 54.6889 8.59973C54.6382 8.37367 54.6148 8.14237 54.6189 7.91074C54.5916 7.49497 54.6991 7.08147 54.9257 6.73175C55.0267 6.59647 55.1597 6.48831 55.3127 6.41695C55.4657 6.34558 55.634 6.31322 55.8026 6.32276C55.9826 6.3206 56.161 6.35708 56.3257 6.42973C56.5003 6.51389 56.6505 6.64051 56.7614 6.7986V8.81366C56.6294 8.99553 56.4632 9.14994 56.2722 9.26827C56.0845 9.37744 55.8703 9.43269 55.6532 9.42793C55.5032 9.43025 55.3544 9.40076 55.2167 9.34141ZM61.3098 10.0037C61.3582 10.0078 61.4062 9.99271 61.4435 9.96163C61.4807 9.93055 61.5042 9.88601 61.5088 9.83771L61.5466 9.47591C61.6803 9.6513 61.8462 9.79838 62.0381 9.90613C62.2529 10.0162 62.492 10.0705 62.7334 10.0619C62.9875 10.0687 63.2397 10.0157 63.4695 9.90707C63.6993 9.79845 63.9003 9.63728 64.0563 9.43658C64.2207 9.22186 64.3434 8.97883 64.4181 8.71849C64.5047 8.41647 64.5479 8.10344 64.544 7.78883C64.5473 7.49804 64.5102 7.2082 64.4339 6.92759C64.3705 6.6943 64.2629 6.47535 64.1169 6.28265C63.9828 6.10911 63.8102 5.9691 63.6127 5.87366C63.4047 5.77528 63.1767 5.72629 62.9466 5.73051C62.6818 5.72499 62.4199 5.7864 62.1852 5.90905C61.9589 6.03203 61.7569 6.19513 61.589 6.3904V3.88141H60.7994V10.0037H61.3098ZM63.457 6.70658C63.6639 7.03692 63.7598 7.42467 63.7299 7.81321C63.7614 8.24501 63.6536 8.67838 63.4232 9.04175C63.3197 9.1762 63.1851 9.28347 63.031 9.3543C62.8768 9.42514 62.7078 9.45743 62.5384 9.44838C62.3611 9.44967 62.1855 9.41349 62.0232 9.3422C61.8492 9.25788 61.6993 9.131 61.5875 8.97332V6.96928C61.7179 6.78688 61.8811 6.63032 62.0688 6.50759C62.2536 6.39827 62.466 6.34242 62.6815 6.34872C62.8302 6.34112 62.9785 6.36971 63.1137 6.43204C63.2489 6.49437 63.3662 6.58858 63.457 6.70658ZM69.0216 5.79108H68.3956C68.3458 5.78989 68.297 5.80447 68.256 5.83272C68.215 5.86098 68.184 5.90146 68.1675 5.94838L67.1135 8.514C67.0884 8.57535 67.0648 8.63958 67.0427 8.70669L66.9806 8.89939C66.9513 8.77134 66.914 8.64525 66.8689 8.52186L65.778 5.94838C65.761 5.89999 65.7287 5.85846 65.686 5.83008C65.6433 5.8017 65.5925 5.788 65.5413 5.79108H64.8547L66.5889 9.74647L65.8166 11.4186H66.4041C66.4676 11.4239 66.531 11.4069 66.5834 11.3706C66.625 11.3324 66.6566 11.2846 66.6754 11.2314L69.0216 5.79108Z\" fill=\"currentColor\"/>\n<path d=\"M6.51543 4.81038C6.53318 5.73326 6.90684 6.61358 7.55835 7.26746C8.05545 7.72447 8.70318 7.98284 9.37835 7.99341C9.59778 7.98572 9.80551 7.89258 9.95723 7.73386C10.2856 7.38559 10.5178 6.95792 10.631 6.49282C10.7442 6.02772 10.7346 5.54117 10.603 5.08094C10.113 3.38206 8.75464 2.44611 7.09745 1.63285C6.67155 2.63563 6.47253 3.72014 6.51464 4.80881L6.51543 4.81038Z\" fill=\"currentColor\" opacity=\"0.65\"/>\n<path d=\"M4.05452 7.27506C4.42169 8.12208 5.10527 8.79211 5.95947 9.14225C6.5934 9.3727 7.28868 9.36248 7.91632 9.11315C8.1161 9.02113 8.27183 8.85596 8.35284 8.65225C8.52422 8.20568 8.57663 7.72224 8.50494 7.24932C8.43324 6.77639 8.23989 6.33021 7.94385 5.9545C6.83486 4.5781 5.23037 4.23203 3.38598 4.11798C3.37375 5.20647 3.60203 6.28422 4.05452 7.27427\" fill=\"currentColor\" opacity=\"0.65\"/>\n<path d=\"M2.72526 10.4961C3.38764 11.1377 4.27514 11.494 5.19728 11.4887C5.87182 11.4584 6.51171 11.1813 6.99526 10.71C7.14355 10.5478 7.22454 10.3352 7.22178 10.1154C7.20868 9.63735 7.07197 9.17084 6.82496 8.76132C6.57796 8.35181 6.22909 8.01326 5.81234 7.77867C4.27076 6.92923 2.65054 7.22418 0.902113 7.83373C1.30649 8.84431 1.92903 9.75313 2.72526 10.4953\" fill=\"currentColor\" opacity=\"0.65\"/>\n<path d=\"M2.72283 13.9849C3.58013 14.3223 4.53181 14.3105 5.38361 13.9526C5.99511 13.6648 6.4802 13.1632 6.74743 12.5424C6.82344 12.3358 6.81781 12.108 6.7317 11.9053C6.53849 11.4687 6.23475 11.0901 5.85047 10.8068C5.46619 10.5235 5.01466 10.3453 4.54047 10.2898C2.78575 10.1042 1.40934 10.9953 0.0203542 12.2262C0.780821 13.0041 1.70359 13.6046 2.72283 13.9849Z\" fill=\"currentColor\" opacity=\"0.65\"/>\n<path d=\"M4.04893 17.2064C4.97019 17.1874 5.84772 16.8099 6.495 16.154C6.95088 15.6536 7.20821 15.0038 7.2186 14.327C7.2097 14.1072 7.11746 13.8991 6.96062 13.7449C6.61542 13.4157 6.19019 13.1824 5.72705 13.0682C5.26392 12.954 4.77897 12.9628 4.32028 13.0937C2.62927 13.5916 1.69332 14.9499 0.887136 16.6204C1.88456 17.0479 2.96458 17.248 4.04893 17.2064Z\" fill=\"currentColor\" opacity=\"0.65\"/>\n<path d=\"M6.50221 19.6777C7.34863 19.3059 8.01597 18.6177 8.36153 17.7602C8.59119 17.1231 8.58176 16.4231 8.33322 15.7939C8.24226 15.5934 8.07702 15.4361 7.87232 15.355C7.427 15.1846 6.94498 15.1332 6.47373 15.2057C6.00247 15.2783 5.55824 15.4723 5.18479 15.7687C3.81625 16.8777 3.47018 18.4901 3.35614 20.3471C4.4415 20.3601 5.51617 20.1315 6.50221 19.6777Z\" fill=\"currentColor\" opacity=\"0.65\"/>\n<path d=\"M9.7096 21.0158C10.348 20.3474 10.7016 19.457 10.6959 18.5327C10.666 17.8563 10.3899 17.214 9.9196 16.7269C9.75926 16.5774 9.54733 16.4957 9.32813 16.4988C8.8515 16.5128 8.38672 16.6507 7.9796 16.8989C7.57247 17.1472 7.23704 17.4972 7.00634 17.9145C6.16476 19.464 6.45813 21.0921 7.06139 22.846C8.06908 22.4401 8.97372 21.8149 9.7096 21.0158Z\" fill=\"currentColor\" opacity=\"0.65\"/>\n<path d=\"M13.1851 21.0188C13.5209 20.1537 13.5092 19.1941 13.1529 18.3447C12.8679 17.7316 12.3686 17.244 11.7489 16.9738C11.5435 16.897 11.3164 16.9026 11.115 16.9895C10.6793 17.1861 10.3049 17.4921 10.0202 17.8783C9.73544 18.2644 9.56084 18.7198 9.50578 19.1918C9.32174 20.9535 10.2097 22.3378 11.4367 23.7276C12.2127 22.9651 12.8098 22.04 13.1851 21.0188Z\" fill=\"currentColor\" opacity=\"0.65\"/>\n<path d=\"M16.391 19.6872C16.3737 18.7591 15.9977 17.8782 15.3434 17.2293C14.8464 16.772 14.1986 16.5133 13.5234 16.5026C13.3039 16.5102 13.0962 16.6034 12.9445 16.7621C12.6162 17.1103 12.3841 17.5378 12.2709 18.0028C12.1577 18.4677 12.1673 18.9541 12.2988 19.4142C12.7943 21.1131 14.1471 22.0491 15.8098 22.8623C16.235 21.8597 16.4335 20.7754 16.391 19.6872Z\" fill=\"currentColor\" opacity=\"0.65\"/>\n<path d=\"M18.8496 17.2224C18.4828 16.3752 17.7995 15.7049 16.9455 15.3544C16.3114 15.1239 15.6148 15.1343 14.9878 15.3835C14.7882 15.475 14.6318 15.6401 14.5513 15.8444C14.3802 16.2915 14.3283 16.7755 14.4007 17.2487C14.473 17.722 14.6673 18.1682 14.9642 18.5437C16.0732 19.9201 17.6777 20.2662 19.5221 20.3803C19.5333 19.291 19.3037 18.2126 18.8496 17.2224Z\" fill=\"currentColor\" opacity=\"0.65\"/>\n<path d=\"M20.1812 14.0008C19.5191 13.3591 18.6319 13.0025 17.71 13.0074C17.0359 13.0389 16.3965 13.315 15.9128 13.7861C15.7642 13.9482 15.6829 14.1608 15.6855 14.3807C15.6987 14.8586 15.8355 15.325 16.0825 15.7343C16.3295 16.1437 16.6783 16.4821 17.0949 16.7167C18.6365 17.5661 20.2567 17.2704 22.0059 16.6616C21.601 15.6512 20.9779 14.7426 20.1812 14.0008Z\" fill=\"currentColor\" opacity=\"0.65\"/>\n<path d=\"M20.1843 10.5117C19.3263 10.1734 18.3699 10.185 17.5204 10.544C16.9089 10.8318 16.4238 11.3334 16.1565 11.9542C16.0795 12.161 16.0858 12.3891 16.1731 12.5913C16.3661 13.0281 16.6697 13.4071 17.054 13.6907C17.4383 13.9743 17.8899 14.1527 18.3643 14.2083C20.1182 14.3924 21.4946 13.5005 22.8836 12.2711C22.1258 11.4913 21.2037 10.8903 20.1843 10.5117Z\" fill=\"currentColor\" opacity=\"0.65\"/>\n<path d=\"M18.8583 7.28786C17.9373 7.30706 17.0601 7.68458 16.413 8.34022C15.9568 8.84107 15.6994 9.49145 15.6894 10.1689C15.6981 10.3891 15.7909 10.5975 15.949 10.7509C16.2942 11.0801 16.7194 11.3134 17.1826 11.4276C17.6457 11.5419 18.1306 11.5331 18.5893 11.4021C20.2803 10.9043 21.2163 9.54595 22.0217 7.8746C21.0238 7.44667 19.9432 7.24624 18.8583 7.28786Z\" fill=\"currentColor\" opacity=\"0.65\"/>\n<path d=\"M16.4051 4.81894C15.5606 5.19103 14.8938 5.87698 14.5458 6.73175C14.3161 7.36883 14.3264 8.06883 14.5741 8.69805C14.6653 8.89939 14.8305 9.0567 15.0358 9.13771C15.4812 9.308 15.9632 9.35933 16.4345 9.28665C16.9057 9.21397 17.3499 9.01978 17.7233 8.72321C19.0919 7.61422 19.4379 6.00187 19.5512 4.14569C18.4655 4.13383 17.3908 4.36382 16.4051 4.81894Z\" fill=\"currentColor\" opacity=\"0.65\"/>\n<path d=\"M13.1977 3.48116C12.5599 4.15011 12.2056 5.0399 12.2091 5.9642C12.239 6.6406 12.5143 7.28554 12.9838 7.77004C13.1443 7.91948 13.3566 8.00206 13.5761 7.99813C14.0534 7.98482 14.519 7.84723 14.9268 7.59895C15.3347 7.35067 15.6707 7.00028 15.9018 6.5824C16.7434 5.03296 16.4492 3.40487 15.8467 1.64936C14.8386 2.05557 13.9337 2.68134 13.1977 3.48116Z\" fill=\"currentColor\" opacity=\"0.65\"/>\n<path d=\"M9.72451 3.47792C9.38906 4.34021 9.40061 5.29891 9.75675 6.15287C10.0408 6.76618 10.5405 7.25358 11.1607 7.52219C11.3652 7.59927 11.5933 7.59298 11.7938 7.50646C12.2293 7.30918 12.6066 7.0031 12.8895 6.6177C13.1726 6.23231 13.3488 5.77613 13.4038 5.30422C13.5887 3.54242 12.6999 2.15815 11.4729 0.768374C10.6968 1.53108 10.0997 2.45651 9.72451 3.47792Z\" fill=\"currentColor\" opacity=\"0.65\"/>\n</g>\n</svg>";
	const CV_BADGE_W = { cls: 'cv-badge--wiki', svg: CV_BADGE_W_SVG, href: CV_HREF_WIKIMEDIA, label: '维基媒体项目' };
	const CV_BADGE_MW = { cls: 'cv-badge--mw', svg: CV_BADGE_MW_SVG, href: CV_HREF_MEDIAWIKI, label: 'MediaWiki' };
	const CV_LICENSE_BADGES = [
		{ key: 'by-sa', re: /licenses\/by-sa\/4\.0/i, cls: 'cv-badge--cc', svg: CV_BADGE_CC_SVG, href: CV_HREF_CC_BY_SA, label: '署名—相同方式共享 4.0' },
		{ key: 'cc0', re: /publicdomain\/zero\/1\.0/i, cls: 'cv-badge--cc0', svg: CV_BADGE_CC0_SVG, href: CV_HREF_CC0, label: 'CC0 1.0 公有领域贡献' },
		{ key: 'apache', re: /apache\.org\/licenses\/LICENSE-2\.0/i, cls: 'cv-badge--apache', svg: CV_BADGE_APACHE_SVG, href: CV_HREF_APACHE, label: 'Apache 许可 2.0' }
	];

	function cvLicenseBadges(data) {
		const html = data.footerCopyright || '';
		const found = CV_LICENSE_BADGES
			.map(function (b) { return { b: b, at: html.search(b.re) }; })
			.filter(function (x) { return x.at >= 0; })
			.sort(function (x, y) { return x.at - y.at; })
			.map(function (x) { return x.b; });
		const apacheAt = found.findIndex(function (b) { return b.key === 'apache'; });
		const cc0At = found.findIndex(function (b) { return b.key === 'cc0'; });
		if (apacheAt >= 0 && cc0At >= 0 && apacheAt > cc0At) {
			const apache = found.splice(apacheAt, 1)[0];
			found.splice(found.findIndex(function (b) { return b.key === 'cc0'; }), 0, apache);
		}
		return found.length ? found : [CV_LICENSE_BADGES[0]];
	}

	const CV_ACCENTS = [
		{ id: 'citizen', label: '默认', h: '262.29' },
		{ id: 'vocawiki', label: 'Vocawiki', h: '215' },
		{ id: 'starcitizen', label: '公民', h: '230' },
		{ id: 'custom', label: '自定义', h: null }
	];

	function cvIsPresetHue(h) {
		return CV_ACCENTS.some(function (a) { return a.h !== null && a.h === h; });
	}

	const CV_CUSTOM_COLOR_KEY = 'cv-pref-accent-custom';
	const CV_CUSTOM_HINT = '认不出这个色值，写成 #3366cc 这样再试试';
	function cvReadCustomHex() {
		try { return localStorage.getItem(CV_CUSTOM_COLOR_KEY) || ''; } catch (e) { return ''; }
	}

	function cvParseHex(hex) {
		const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex).trim());
		if (!m) return null;
		let s = m[1];
		if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
		const lin = function (i) {
			const c = parseInt(s.slice(i, i + 2), 16) / 255;
			return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
		};
		const r = lin(0), g = lin(2), b = lin(4);
		const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
		const m2 = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
		const s2 = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
		const oa = 1.9779984951 * l - 2.4285922050 * m2 + 0.4505937099 * s2;
		const ob = 0.0259040371 * l + 0.7827717662 * m2 - 0.8086757660 * s2;
		const deg = Math.atan2(ob, oa) * 180 / Math.PI;
		return {
			hex: '#' + s.toLowerCase(),
			hue: Math.round((deg < 0 ? deg + 360 : deg) * 100) / 100
		};
	}

	function cvPaintCustomPreview(preview, color) {
		preview.style.color = !color ? 'oklch(53.25% 0 0)' :
			'light-dark(' + color + ', color-mix(in oklch, ' + color + ', white 35%))';
	}

	function accentCard(accent) {
		const chosen = readPref('accent', CV_ACCENTS[0].h);
		if (accent.id === 'custom') {
			return prefCard('cv-accent-custom', 'cv-accent', 'custom', accent.label, '',
				'color: oklch(53.25% 0 0);', cvIsPresetHue(chosen) ? '' : ' checked');
		}
		return prefCard('cv-accent-' + accent.id, 'cv-accent', accent.h, accent.label, '',
			'color: light-dark(oklch(53.25% 0.1679 ' + accent.h + '), oklch(60% 0.1679 ' + accent.h + '));',
			chosen === accent.h ? ' checked' : '');
	}

	function cvAccentField() {
		const fieldset = document.createElement('fieldset');
		fieldset.className = 'cdx-field cdx-field--is-fieldset citizen-preferences-group';
		fieldset.innerHTML =
			'<legend class="cdx-label">' +
				'<span class="cdx-label__label"><span class="cdx-label__label__text">配色</span></span>' +
				'<span class="cdx-label__description">切换链接、按钮与焦点环的色相</span>' +
			'</legend>' +
			'<div class="cdx-field__control">' +
				'<div class="citizen-preferences-radio" style="--pref-columns: 4;">' +
					CV_ACCENTS.map(accentCard).join('') +
				'</div>' +
				'<div class="cv-accent-custom" hidden>' +
					'<div class="cdx-text-input cdx-text-input--status-default">' +
						'<input id="cv-accent-custom-hex" class="cdx-text-input__input cv-accent-custom__input"' +
							' type="text" autocomplete="off" spellcheck="false" maxlength="7"' +
							' placeholder="输入Hex色号" aria-label="自定义强调色，十六进制色值">' +
					'</div>' +
					'<span class="cv-accent-custom__hint"></span>' +
				'</div>' +
			'</div>' +
			'<div class="cdx-field__help-text">与 starcitizen.tools及 voca.wiki 无隶属或授权关系</div>';

		const customRow = fieldset.querySelector('.cv-accent-custom');
		const customRadio = fieldset.querySelector('input[name="cv-accent"][value="custom"]');
		const customInput = fieldset.querySelector('.cv-accent-custom__input');
		const customHint = fieldset.querySelector('.cv-accent-custom__hint');
		const customPreview = customRadio.closest('.cdx-radio').querySelector('.citizen-preferences-card__preview');

		function syncCustom() {
			const hex = cvReadCustomHex();
			const parsed = cvParseHex(hex);
			if (customInput.value !== hex) customInput.value = hex;
			cvPaintCustomPreview(customPreview, parsed ? parsed.hex : '');
			customRow.hidden = !customRadio.checked;
			customHint.textContent = hex && !parsed ? CV_CUSTOM_HINT : '';
		}

		function cvIsHexPrefix(v) {
			return /^#?[0-9a-f]{0,6}$/i.test(v);
		}

		customInput.addEventListener('input', function () {
			const hex = customInput.value.trim();
			try { localStorage.setItem(CV_CUSTOM_COLOR_KEY, hex); } catch (e) {}
			customHint.textContent = cvIsHexPrefix(hex) ? '' : CV_CUSTOM_HINT;
			const parsed = hex.replace(/^#/, '').length === 6 ? cvParseHex(hex) : null;
			if (parsed) {
				cvPaintCustomPreview(customPreview, parsed.hex);
				applyAccent(String(parsed.hue));
			}
		});

		customInput.addEventListener('change', function () {
			const hex = customInput.value.trim();
			const parsed = cvParseHex(hex);
			customHint.textContent = hex && !parsed ? CV_CUSTOM_HINT : '';
			if (parsed) {
				cvPaintCustomPreview(customPreview, parsed.hex);
				applyAccent(String(parsed.hue));
			}
		});

		fieldset.addEventListener('change', function (e) {
			if (e.target.name !== 'cv-accent') return;
			if (e.target.value === 'custom') {
				const parsed = cvParseHex(cvReadCustomHex());
				if (parsed) applyAccent(String(parsed.hue));
			} else {
				applyAccent(e.target.value);
			}
			syncCustom();
		});

		fieldset.__cvSyncAccent = function () {
			const chosen = readPref('accent', CV_ACCENTS[0].h);
			const isCustom = !cvIsPresetHue(chosen);
			fieldset.querySelectorAll('input[name="cv-accent"]').forEach(function (input) {
				input.checked = isCustom ? input.value === 'custom' : input.value === chosen;
			});
			syncCustom();
		};
		syncCustom();
		return $(fieldset);
	}

	function applyAccent(h) {
		if (document.documentElement) document.documentElement.style.setProperty('--cv-accent-h', h);
		try { localStorage.setItem('cv-pref-accent', h); } catch (e) {}
	}

	function cvGadgetsField() {
		const field = document.createElement('div');
		field.className = 'cv-gadgets';
		field.innerHTML = CV_GADGETS.map(function (gadget) {
			const name = 'cv-gadget-' + gadget.id;
			return segField(name, name, gadget.label, CV_GADGET_MODES,
				cvGadgetModeLabel(cvGadgetPref(gadget.id)), gadget.desc);
		}).join('') +
			'<div class="cv-gadgets__note">使用此功能，即代表您同意对自己使用小工具作出的操作负有全部责任。</div>';
		field.addEventListener('change', function (e) {
			const input = e.target;
			const name = (input && input.getAttribute('name')) || '';
			if (name.indexOf('cv-gadget-') !== 0) return;
			const id = name.slice('cv-gadget-'.length);
			cvApplyGadgetPref(id, input.value);
			const readout = field.querySelector('[data-readout="' + name + '"]');
			if (readout) readout.textContent = cvGadgetModeLabel(input.value);
			if (id === 'hotcat') field.__cvGadgetNeedsReload = true;
			if (id === 'factbox' && window.__cvFactboxApply) window.__cvFactboxApply();
		});
		return $(field);
	}

	function cvVersionNewer(remote, mine) {
		const a = String(remote).split('.'), b = String(mine).split('.');
		for (let i = 0; i < Math.max(a.length, b.length); i++) {
			const na = parseInt(a[i], 10) || 0, nb = parseInt(b[i], 10) || 0;
			if (na !== nb) return na > nb;
		}
		return false;
	}

	function cvAboutField() {
		const field = document.createElement('div');
		field.className = 'cv-about';
		const split = /^(.*?)(v\d+(?:\.\d+)*)$/.exec(CV_ABOUT.version);
		field.innerHTML = `
			<div class="cv-about__head">
				<a class="cv-about__brand" href="${CV_HREF_SKIN_SITE}" target="_blank" rel="noopener noreferrer">
					<span class="cv-about__logo">${CV_CITIZEN_LOGO_SVG}</span>
					<span class="cv-about__name">${CV_ABOUT.name}</span>
				</a>
				<span class="cv-about__version">
					<a class="cv-about__version-name" href="${CV_HREF_SCRIPT_REPO}" target="_blank" rel="noopener noreferrer">${(split ? split[1] : CV_ABOUT.version).trim()}</a>
					${split ? split[2] : ''}
					<span class="cv-about__version-delta"></span>
				</span>
			</div>
			<div class="cv-about__foot">
				<p class="cv-about__note">${CV_ABOUT.note}</p>
			</div>`;
		const mine = (/v(\d+(?:\.\d+)*)/.exec(CV_ABOUT.version) || [])[1];
		const versionDelta = field.querySelector('.cv-about__version-delta');
		const updateButton = new OO.ui.ButtonWidget({
			label: '检查更新',
			framed: true,
			classes: ['cv-about__update']
		});
		updateButton.on('click', function () {
			const btn = updateButton.$element[0];
			if (btn.dataset.cvState === 'newer') {
				window.open(CV_UPDATE_URL, '_blank', 'noopener');
				return;
			}
			updateButton.setDisabled(true);
			updateButton.setLabel('检查中…');
			fetch(CV_UPDATE_URL, { cache: 'no-store' })
				.then(function (res) {
					if (!res.ok) throw new Error('HTTP ' + res.status);
					return res.text();
				})
				.then(function (text) {
					const found = /^\s*\/\/\s*@version\s+(\S+)/m.exec(text || '');
					if (!found) throw new Error('远端没读到 @version');
					if (mine && cvVersionNewer(found[1], mine)) {
						versionDelta.innerHTML = CV_ARROW_NEXT_SVG +
							'<span class="cv-about__version-new">v' + found[1] + '</span>';
						btn.dataset.cvState = 'newer';
						updateButton.setLabel('立即更新').setTitle('按一下打开更新地址');
					} else {
						btn.dataset.cvState = 'latest';
						updateButton.setLabel('已是最新').setTitle('远端为 v' + found[1]);
					}
				})
				.catch(function (err) {
					btn.dataset.cvState = 'error';
					updateButton.setLabel('检查失败').setTitle(String(err && err.message || err));
				})
				.then(function () { updateButton.setDisabled(false); });
		});
		const artHolder = document.createElement('div');
		artHolder.innerHTML = CV_CCBYNCSA_SVG;
		const licenseButton = new OO.ui.ButtonWidget({
			framed: true,
			classes: ['cv-about__license'],
			href: CV_ABOUT.licenseHref,
			target: 'blank',
			rel: 'noopener noreferrer',
			label: $(artHolder.firstElementChild)
		});
		licenseButton.setTitle(CV_ABOUT.licenseLabel);
		licenseButton.$element[0].querySelector('.oo-ui-buttonElement-button')
			.setAttribute('aria-label', CV_ABOUT.licenseLabel);
		field.querySelector('.cv-about__head').appendChild(updateButton.$element[0]);
		field.querySelector('.cv-about__foot').appendChild(licenseButton.$element[0]);
		return $(field);
	}

	let cvPrefsClassesReady = false;
	let CVPrefsPage;
	let CVPrefsDialog;
	function buildPrefsClasses() {
		CVPrefsPage = function (section) {
			this.section = section;
			CVPrefsPage.super.call(this, section.id, { expanded: true, scrollable: true });
			this.$element.append(section.id === 'appearance' ? cvAccentField()
				: section.id === 'gadgets' ? cvGadgetsField()
					: cvAboutField());
		};
		OO.inheritClass(CVPrefsPage, OO.ui.PageLayout);
		CVPrefsPage.prototype.setupOutlineItem = function () {
			this.outlineItem.setLabel(this.section.label).setIcon(this.section.icon);
		};

		CVPrefsDialog = function (config) {
			CVPrefsDialog.super.call(this, config);
		};
		OO.inheritClass(CVPrefsDialog, OO.ui.ProcessDialog);
		CVPrefsDialog.static.name = 'cv-prefs';
		CVPrefsDialog.static.title = '偏好设定';
		CVPrefsDialog.static.size = 'large';
		CVPrefsDialog.static.actions = [
			{ action: 'apply', label: '应用更改', flags: ['primary', 'progressive'] },
			{ label: '取消', flags: 'safe', icon: 'close', invisibleLabel: true }
		];
		CVPrefsDialog.prototype.initialize = function () {
			CVPrefsDialog.super.prototype.initialize.call(this);
			this.booklet = new OO.ui.BookletLayout({
				outlined: true,
				menuPosition: 'before',
				expanded: true
			});
			this.booklet.addPages(CV_PREFS_SECTIONS.map(function (section) {
				return new CVPrefsPage(section);
			}));
			this.booklet.selectFirstSelectablePage();
			this.$body.append(this.booklet.$element);
		};
		CVPrefsDialog.prototype.getBodyHeight = function () {
			return 400;
		};
		CVPrefsDialog.prototype.getActionProcess = function (action) {
			if (action === 'apply') {
				return new OO.ui.Process(function () {
					const gadgets = this.$element[0].querySelector('.cv-gadgets');
					if (gadgets && gadgets.__cvGadgetNeedsReload) {
						location.reload();
						return;
					}
					this.close({ action: action });
				}, this);
			}
			return CVPrefsDialog.super.prototype.getActionProcess.call(this, action);
		};

		cvPrefsClassesReady = true;
	}

	let cvPrefsWindows = null;
	let cvPrefsDialogInstance = null;
	let cvPrefsLoading = false;

	function openPrefsDialog() {
		if (cvPrefsLoading) return;
		cvPrefsLoading = true;
		mw.loader.using('oojs-ui-windows').then(function () {
			cvPrefsLoading = false;
			if (!cvPrefsClassesReady) buildPrefsClasses();
			if (!cvPrefsWindows) {
				cvPrefsWindows = new OO.ui.WindowManager({ modal: true, floating: true });
				cvPrefsWindows.$element[0].classList.add('cv-prefs-windowmanager');
				document.body.appendChild(cvPrefsWindows.$element[0]);
				cvPrefsDialogInstance = new CVPrefsDialog();
				cvPrefsWindows.addWindows([cvPrefsDialogInstance]);
			}
			const accentField = cvPrefsDialogInstance.$element[0].querySelector('.citizen-preferences-group');
			if (accentField && accentField.__cvSyncAccent) accentField.__cvSyncAccent();
			cvPrefsWindows.openWindow(cvPrefsDialogInstance);
		}, function () {
			cvPrefsLoading = false;
		});
	}

	function cvWatchSkinField() {
		const section = document.getElementById('mw-htmlform-skin');
		if (!section || section.__cvSkinObserver) return;
		let queued = false;
		section.__cvSkinObserver = new MutationObserver(function () {
			if (queued) return;
			queued = true;
			requestAnimationFrame(function () {
				queued = false;
				injectSkinOption();
			});
		});
		section.__cvSkinObserver.observe(section, { childList: true, subtree: true });
	}

	function bootPreferencesInjection() {
		const run = function () { cvWatchSkinField(); injectSkinOption(); };
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', run);
		} else {
			run();
		}
	}

	var _vpGuard = null;
	function armViewportGuard() {
		if (_vpGuard) return;
		var vp = document.querySelector('meta[name="viewport"]');
		if (!vp) return;
		var target = 'width=device-width, initial-scale=1.0, user-scalable=yes, minimum-scale=0.25, maximum-scale=5.0';
		_vpGuard = new MutationObserver(function () {
			if (vp.getAttribute('content') !== target) vp.setAttribute('content', target);
		});
		_vpGuard.observe(vp, { attributes: true, attributeFilter: ['content'] });
	}
	armViewportGuard();
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', armViewportGuard);
	}

	if (!document.querySelector('.citizen-page-container')) {
		['.mw-page-container-inner', '.mw-page-container'].forEach(sel => {
			document.body.querySelectorAll(sel).forEach(n => {
				while (n.firstChild) n.parentNode.insertBefore(n.firstChild, n);
				n.remove();
			});
		});
		document.body.querySelectorAll('.mw-footer-container').forEach(n => {
			while (n.firstChild) n.parentNode.insertBefore(n.firstChild, n);
			n.remove();
		});

		const wrap = document.createElement('div');
		wrap.className = 'citizen-page-container';
		while (document.body.firstChild) wrap.appendChild(document.body.firstChild);
		document.body.appendChild(wrap);

		const html = document.documentElement;
		['citizen-header-position-left',
		 'citizen-feature-autohide-navigation-clientpref-1',
		 'citizen-feature-image-dimming-clientpref-0',
		 'citizen-animations-ready'
		].forEach(c => html.classList.add(c));
		if (!document.body.classList.contains('citizen-sections-enabled')) document.body.classList.add('citizen-sections-enabled');
		if (!document.body.classList.contains('skin-citizen')) document.body.classList.add('skin-citizen');
	}


	const CV_WIKI_W_SVG = '<svg class="citizen-header-logo-svg citizen-header-logo-char cv-wiki-w" width="32" height="32" viewBox="0 0 27 18" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M26.822 0.293009C26.8217 0.390107 26.7878 0.484105 26.726 0.559009C26.67 0.639009 26.606 0.679009 26.534 0.679009C25.9447 0.736342 25.4627 0.928343 25.088 1.25501C24.716 1.57301 24.328 2.19201 23.931 3.10001L17.844 16.873C17.8033 17.0023 17.6927 17.0667 17.512 17.066C17.4441 17.0675 17.3772 17.0503 17.3184 17.0162C17.2597 16.9822 17.2115 16.9326 17.179 16.873L13.763 9.70301L9.835 16.873C9.80262 16.9325 9.75454 16.9819 9.696 17.016C9.63746 17.05 9.5707 17.0673 9.503 17.066C9.32633 17.066 9.21133 17.0017 9.158 16.873L3.176 3.10001C2.804 2.24301 2.406 1.65001 1.994 1.31501C1.582 0.972342 1.00533 0.760676 0.264 0.680009C0.2 0.680009 0.14 0.647676 0.084 0.583009C0.0304353 0.514003 0.000932985 0.42936 0 0.342009C0 0.118009 0.064 0.00667574 0.192 0.00800908C0.725333 0.00800908 1.282 0.0320091 1.862 0.0800091C2.402 0.128676 2.912 0.153009 3.392 0.153009C4.112 0.153009 4.452 0.129009 5.11 0.0800091C5.803 0.0320091 6.42 0.00800908 6.948 0.00800908C7.076 0.00867574 7.14 0.120009 7.14 0.342009C7.14 0.562009 7.1 0.676009 7.02 0.676009C6.488 0.716676 6.06633 0.852009 5.755 1.08201C5.61081 1.18576 5.49417 1.32318 5.41522 1.4823C5.33626 1.64143 5.2974 1.81743 5.302 1.99501C5.302 2.18801 5.366 2.42501 5.494 2.71501L10.436 13.921L13.243 8.59701L10.628 3.09701C10.159 2.11501 9.771 1.48701 9.471 1.20201C9.167 0.912009 8.71 0.740009 8.097 0.675009C8.041 0.675009 7.985 0.643009 7.929 0.579009C7.88132 0.507365 7.85624 0.423063 7.857 0.337009C7.857 0.113009 7.913 0.00200907 8.025 0.00400907C8.558 0.00400907 9.045 0.0280091 9.495 0.0760091C9.923 0.124009 10.384 0.148009 10.868 0.148009C11.352 0.148009 11.849 0.124009 12.386 0.0760091C12.9353 0.0280091 13.476 0.00400907 14.008 0.00400907C14.136 0.0053424 14.2 0.116342 14.2 0.337009C14.2 0.559009 14.16 0.670342 14.08 0.671009C13.01 0.744009 12.48 1.04501 12.482 1.58401C12.482 1.82401 12.605 2.19534 12.851 2.69801L14.581 6.22001L16.298 2.99501C16.538 2.54101 16.654 2.15501 16.655 1.84501C16.655 1.10768 16.1223 0.716342 15.057 0.671009C14.961 0.670342 14.913 0.559009 14.913 0.337009C14.913 0.257009 14.937 0.180676 14.985 0.108009C15.033 0.0353424 15.081 -0.000657576 15.129 9.09091e-06C15.509 9.09091e-06 15.982 0.0240091 16.539 0.0720091C17.071 0.120009 17.5087 0.144009 17.852 0.144009C18.1 0.144009 18.4617 0.124009 18.937 0.0840091C19.5417 0.0280091 20.0477 9.09091e-06 20.455 9.09091e-06C20.551 9.09091e-06 20.599 0.0966758 20.599 0.290009C20.599 0.544676 20.511 0.671676 20.335 0.671009C19.714 0.736009 19.215 0.908009 18.829 1.18601C18.457 1.46801 17.984 2.10301 17.419 3.09201L15.129 7.34701L18.232 13.7L22.817 2.99601C22.977 2.60601 23.057 2.24401 23.057 1.91901C23.0583 1.13434 22.526 0.718676 21.46 0.672009C21.364 0.671342 21.316 0.560009 21.316 0.338009C21.316 0.118009 21.388 0.00400909 21.532 0.00500909C21.92 0.00500909 22.385 0.0290091 22.917 0.0770091C23.41 0.125009 23.827 0.149009 24.159 0.149009C24.491 0.149009 24.916 0.125009 25.376 0.0770091C25.853 0.0290091 26.286 0.00500909 26.666 0.00500909C26.778 0.00500909 26.834 0.101676 26.834 0.295009H26.822V0.293009Z"/></svg>';
	const CV_WIKI_CLASSICAL_SVG = '<svg class="citizen-header-logo-svg citizen-header-logo-char" width="20" height="20" viewBox="0 0 24 23" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M20.8 19.3C20.8 19.2 20.7 19.2 20.7 19.2C20.6 19.2 20.5 19.1 20.5 19.1H20.1L20 19L19.9 19.1L19.8 19H19.6L19.4 18.8C19.3 18.9 19.3 18.7 19.2 18.7H19C18.9 18.8 18.8 18.7 18.7 18.6C18.7 18.7 18.6 18.7 18.5 18.6V18.7L18.4 18.6H18.3C18.2 18.6 18.2 18.5 18.2 18.4C18.2 18.4 18.2 18.5 18.1 18.5H18V18.6H17.9V18.5H17.7C17.6 18.4 17.6 18.5 17.5 18.5L17.4 18.4C17.3 18.4 17.2 18.4 17.1 18.5C17 18.5 16.9 18.5 16.9 18.4C16.9 18.4 16.9 18.5 16.8 18.5H16.7C16.6 18.5 16.6 18.6 16.5 18.6V18.5H16.4C16.3 18.5 16.2 18.6 16.1 18.6H15.9V18.5C15.9 18.5 15.9 18.6 15.8 18.6V18.5C15.7 18.5 15.7 18.6 15.6 18.6H15.2C15.1 18.6 15 18.7 14.9 18.7C14.7 18.7 14.5 18.7 14.3 18.8C14.2 18.8 14 18.9 13.9 18.9C13.8 18.9 13.7 18.9 13.6 19V19.8C13.7 19.9 13.7 20.1 13.6 20.2V20.3C13.7 20.4 13.6 20.5 13.6 20.6V21.6C13.6 21.8 13.6 21.9 13.5 22.1C13.5 22.2 13.5 22.3 13.3 22.3C13.3 22.4 13.2 22.5 13.2 22.6V22.5C13.1 22.5 13.1 22.5 13 22.6C12.9 22.6 12.9 22.7 12.8 22.7C12.8 22.7 12.7 22.7 12.7 22.8C12.6 22.7 12.6 22.8 12.6 22.9V22.8C12.5 22.8 12.5 22.9 12.5 22.9C12.4 22.9 12.5 22.8 12.4 22.8C12.3 22.8 12.2 22.7 12.2 22.6V22.5C12.1 22.4 12.1 22.4 12.1 22.3V17.4C12.1 17.3 12.1 17.1 12.2 17V16.8C12.2 16.6 12.2 16.4 12.3 16.2V14.3H12.2C12.2 14.3 12.2 14.2 12.3 14.2V6.8C12.4 6.8 12.3 6.7 12.3 6.6V6.3C12.2 6.4 12.2 6.5 12.2 6.5H12.1V6.8H12C11.9 6.7 11.9 6.8 11.8 6.8H11.7C11.6 6.8 11.5 6.9 11.5 6.9H11C11 6.9 10.9 6.9 10.9 7V6.9C10.8 6.9 10.8 6.9 10.7 6.8C10.7 6.8 10.6 6.8 10.6 6.9C10.4 6.9 10.4 6.8 10.3 6.7C10.3 6.7 10.2 6.7 10.2 6.6C10 6.5 9.9 6.3 9.8 6.1C9.8 5.9 9.7 5.7 9.7 5.5V5.6C9.7 5.5 9.7 5.4 9.8 5.4V5.2C9.8 5.1 9.8 5.1 10 5.1C10 5 10.1 5 10.2 5H10.6C10.7 5 10.8 5 10.9 4.9C11 4.8 11.1 4.8 11.2 4.7C11.3 4.6 11.4 4.6 11.4 4.5L12.2 3.7C12.3 3.6 12.4 3.4 12.6 3.3C12.7 3.2 12.7 3.1 12.8 3C12.9 2.9 12.9 2.8 13 2.7C13.1 2.5 13.3 2.3 13.4 2.1V2C13.3 1.9 13.4 1.8 13.4 1.7V1.4C13.4 1.3 13.5 1.2 13.5 1C13.5 0.9 13.5 0.8 13.6 0.7C13.6 0.6 13.7 0.4 13.8 0.3C13.9 0.2 13.9 0.1 14 0.1C14.1 0.1 14.1 0.1 14.2 0C14.3 0 14.4 0 14.4 0.1H14.5C14.6 0.2 14.6 0.2 14.8 0.3L14.9 0.4C14.9 0.4 14.9 0.5 15 0.5C15.1 0.6 15.1 0.7 15.2 0.8C15.2 0.9 15.2 0.9 15.3 1C15.4 1.2 15.4 1.4 15.4 1.6V2.6C15.4 2.8 15.3 2.9 15.2 3C15.1 3.1 15 3.3 14.9 3.4C14.9 3.5 14.8 3.6 14.7 3.7V3.8C14.7 3.8 14.7 3.9 14.6 3.9V4.1C14.6 4.2 14.5 4.2 14.5 4.3L14.3 4.5C14.3 4.6 14.2 4.7 14.2 4.7V4.8H14.3V4.9C14.3 4.9 14.4 4.9 14.4 4.8H16.3C16.3 4.7 16.3 4.7 16.4 4.6C16.5 4.5 16.4 4.4 16.4 4.3V3.8C16.3 3.7 16.4 3.5 16.4 3.4V2.6C16.4 2.5 16.4 2.4 16.5 2.3V1.9C16.5 1.8 16.6 1.7 16.6 1.6V1C16.7 1 16.7 1 16.7 0.9L16.8 0.8C16.9 0.8 17 0.7 17.1 0.7C17.2 0.7 17.2 0.8 17.2 0.8H17.3C17.4 0.8 17.4 0.8 17.4 0.9C17.5 1 17.7 1.1 17.7 1.2V2.2C17.7 2.4 17.7 2.5 17.6 2.7V3.1C17.6 3.2 17.6 3.3 17.5 3.4C17.4 3.5 17.4 3.6 17.4 3.7C17.4 3.7 17.4 3.8 17.3 3.8C17.2 3.9 17.2 4 17.2 4.1C17.3 4.2 17.2 4.4 17.1 4.5C17 4.6 17 4.7 16.9 4.8H17.1C17.2 4.8 17.3 4.7 17.4 4.7C17.5 4.7 17.7 4.6 17.8 4.6C17.9 4.6 18 4.5 18 4.5H18.8C18.9 4.4 19.1 4.5 19.2 4.4H19.3L19.5 4.6C19.6 4.8 19.7 4.9 19.7 5.1C20 4.9 20 5.1 20 5.3C20 5.4 19.9 5.5 19.9 5.6H19.7C19.6 5.6 19.5 5.7 19.3 5.6H19.1C19 5.7 19 5.6 18.9 5.6H18C17.9 5.6 17.7 5.7 17.6 5.7H16.8C16.8 5.9 16.9 6.2 16.9 6.4V7.3C16.9 7.5 16.8 7.7 16.9 7.9V8.2C17 8.2 17 8.2 17.1 8.1C17.2 8.2 17.4 8.1 17.4 8C17.4 8.1 17.4 8.1 17.5 8.1C17.6 8 17.8 8.1 18 8.1H18.4C18.5 8.1 18.5 8.2 18.6 8.3C18.7 8.4 18.7 8.5 18.8 8.7C18.8 8.8 18.8 9 18.9 9.1V9.2C18.8 9.2 18.8 9.2 18.8 9.3H18.7C18.6 9.4 18.5 9.4 18.4 9.5C18.4 9.6 18.4 9.6 18.3 9.6C18.1 9.7 17.9 9.6 17.7 9.6H17.5C17.3 9.6 17.1 9.6 16.9 9.7C16.9 10.1 16.7 10.4 16.9 10.8V10.7C16.9 10.8 17 10.9 16.9 10.9V10.8V11.1C17 11.2 16.9 11.2 16.9 11.3V11.5L17 11.4C17 11.5 17 11.7 16.9 11.8H17.9C18 11.8 18.1 11.8 18.2 11.9H18.3C18.5 11.9 18.6 12 18.6 12.2C18.6 12.4 18.7 12.7 18.7 13C18.7 13.2 18.7 13.3 18.6 13.5C18.6 13.6 18.5 13.6 18.5 13.6H18.1C18 13.6 17.9 13.5 17.9 13.5H17.8C17.7 13.6 17.6 13.5 17.6 13.5H17.4C17.2 13.5 17.1 13.6 17 13.7C17 13.8 16.9 13.8 16.9 13.9V14.7L16.8 14.8C16.7 14.9 16.8 15 16.8 15.1V15C16.8 15.1 16.9 15.3 16.9 15.5V15.4C16.8 15.5 16.8 15.6 16.9 15.7V16V15.8V15.9H17V17L17.1 17.1V17C17.2 17.2 17.4 17.1 17.5 17.2C17.6 17.1 17.8 17.2 17.8 17.4C17.9 17.4 17.9 17.3 18 17.3H17.9V17.2H18.6C18.7 17.2 18.8 17.3 18.8 17.2H19.7C19.9 17.3 20.1 17.2 20.3 17.2C20.4 17.3 20.6 17.3 20.7 17.2C20.8 17.3 20.8 17.3 20.9 17.2H21.4C21.5 17.2 21.5 17.2 21.6 17.1V17.2L21.7 17.1L21.8 17.2H21.9C22 17.1 22 17.1 22.1 17.1H22.5C22.6 17.2 22.8 17.2 23 17.2H23.3V17.3C23.4 17.3 23.4 17.2 23.5 17.2H23.7H23.6C23.8 17.1 23.8 17.1 23.9 17.3V17.2C24 17.3 23.9 17.4 23.9 17.5C23.9 17.6 23.8 17.8 23.7 17.9C23.6 18 23.6 18.1 23.6 18.2C23.6 18.3 23.4 18.4 23.3 18.5H23.2C23 18.5 22.9 18.6 22.9 18.8C22.9 18.9 22.8 18.9 22.8 19C22.8 19.1 22.7 19.2 22.6 19.3L22.5 19.4C22.4 19.4 22.3 19.5 22.1 19.5C22 19.6 22 19.5 21.9 19.5C21.8 19.5 21.6 19.4 21.5 19.4C21.4 19.4 21.3 19.3 21.2 19.3C21.1 19.3 21.1 19.2 21 19.2C20.9 19.3 20.9 19.3 20.8 19.3ZM13.9 17.2H14C14.1 17.3 14.3 17.3 14.5 17.3H15.6V17.2C15.6 17.1 15.6 17 15.7 16.9V13.9C15.6 13.9 15.4 14 15.3 14H15.2C15.1 14.1 15 14 15 14.1H14.9C14.8 14 14.7 14.1 14.6 14.1H14.1V14.5C14.2 14.5 14.1 14.6 14.1 14.6V16.9C13.9 17.1 13.9 17.1 13.9 17.2ZM15.5 8.5C15.7 8.5 15.8 8.5 15.8 8.3V6.1C15.8 6 15.7 6 15.7 6C15.6 6 15.5 6 15.4 6.1C15.3 6.1 15.3 6.1 15.2 6.2C15.1 6.2 15 6.3 14.9 6.3C14.9 6.3 14.8 6.3 14.8 6.4H14.7C14.5 6.5 14.3 6.6 14.2 6.7V8.5L14.3 8.6H14.4L14.5 8.5H15.5ZM14.8 10.3H14.7C14.6 10.3 14.5 10.4 14.5 10.3H14.4C14.3 10.4 14.3 10.4 14.2 10.3C14.1 10.3 14.1 10.3 14.1 10.4V12.2H14.2C14.2 12.1 14.3 12.2 14.3 12.2C14.3 12.2 14.4 12.3 14.4 12.2H15.2C15.3 12.2 15.3 12.1 15.4 12.1H15.6C15.7 12.1 15.7 12.1 15.7 12V10.1C15.5 10.2 15.3 10.2 15.2 10.3V10.4L15.1 10.3C15.1 10.3 15.1 10.4 15 10.4H14.9C14.9 10.5 14.8 10.4 14.8 10.4V10.3ZM18.2 17.5C18.3 17.4 18.3 17.4 18.2 17.4V17.5ZM1.9 14.9C1.8 15 1.8 15 1.7 15H0.699997C0.599997 14.9 0.500002 14.9 0.400002 14.8C0.300002 14.7 0.199997 14.7 0.199997 14.5L0.0999985 14.4C0.0999985 14.2 0 14.1 0 13.9V13.4C0 13.3 -1.52737e-06 13.2 0.0999985 13.1C0.0999985 13 0.0999969 13 0.199997 12.9C0.199997 12.8 0.300003 12.8 0.300003 12.7V12.8H0.5C0.6 12.9 0.700003 12.8 0.800003 12.7V12.6C0.900003 12.6 0.999998 12.7 1.1 12.5H1.4C1.4 12.5 1.5 12.4 1.6 12.4C1.6 12.5 1.6 12.5 1.7 12.5C1.7 12.4 1.7 12.4 1.8 12.3C1.8 12.3 1.9 12.3 1.9 12.4H2.3C2.4 12.4 2.4 12.5 2.4 12.5H2.6C2.8 12.5 3 12.5 3.1 12.4H3.5V12.3H3.7L4 12V11.9C4.1 11.9 4.2 11.9 4.2 11.8C4.3 11.8 4.3 11.8 4.3 11.7L4.6 11.4C4.7 11.3 4.8 11.1 4.9 11L5.1 10.8C5.3 10.6 5.4 10.4 5.6 10.3L5.8 10.1C5.9 10 6 9.9 6.1 9.7C6.2 9.6 6.2 9.5 6.2 9.4C6.2 9.3 6.1 9.3 6.1 9.2C6 9.1 5.9 9.1 5.8 9C5.7 8.9 5.6 8.9 5.5 8.8C5.1 8.9 5 8.9 5 8.8C4.9 8.8 4.9 8.7 4.8 8.7H4.6C4.6 8.7 4.5 8.6 4.4 8.6C4.3 8.7 4.3 8.7 4.2 8.7C4.1 8.7 4 8.6 3.9 8.5C3.8 8.5 3.8 8.6 3.7 8.6C3.7 8.6 3.6 8.6 3.6 8.7H3.5V8.6C3.4 8.6 3.4 8.6 3.3 8.7C3.3 8.7 3.3 8.6 3.2 8.6H3.1C3 8.6 3 8.5 2.9 8.5C2.8 8.5 2.7 8.4 2.7 8.4L2.6 8.3C2.5 8.2 2.4 8.1 2.4 8V7.9C2.5 7.8 2.4 7.7 2.3 7.6C2.2 7.4 2.2 7.2 2.2 7.1C2.2 7 2.2 6.9 2.3 6.8C2.4 6.7 2.4 6.6 2.5 6.5C2.7 6.4 2.7 6.2 2.9 6.1C3 5.9 3.1 5.7 3.3 5.7C3.4 5.7 3.4 5.6 3.5 5.5C3.5 5.5 3.6 5.5 3.6 5.4C3.8 5.3 3.9 5.1 4.1 5L5.7 3.4C5.8 3.3 5.9 3.2 5.9 3.1C6 2.9 6.1 2.9 6.1 2.8C6.1 2.7 6.2 2.7 6.2 2.6C6.3 2.5 6.4 2.4 6.4 2.3C6.5 2.2 6.5 2.1 6.5 2V1.9C6.5 1.8 6.6 1.7 6.6 1.6C6.6 1.5 6.6 1.5 6.7 1.4C6.7 1.3 6.8 1.3 6.8 1.3L6.9 1.2C6.9 1.1 7 1.1 7 1.1C7.1 1 7.2 0.9 7.4 0.9C7.5 0.9 7.6 1 7.6 1C7.7 1.1 7.7 1.2 7.8 1.3V1.4C7.8 1.5 7.8 1.5 7.9 1.5C8 1.6 8 1.8 8.1 1.9C8.1 2 8.2 2.1 8.2 2.2C8.3 2.4 8.4 2.6 8.3 2.8V3.1C8.3 3.2 8.3 3.4 8.2 3.5C8.2 3.6 8.1 3.6 8.1 3.7C8.1 3.7 8.1 3.8 8 3.8C8 3.9 7.9 4 7.8 4.1C7.6 4.3 7.4 4.4 7.2 4.6L7.1 4.7C7.2 4.9 7.1 5 7 5C6.9 5.1 6.9 5.2 6.8 5.3C6.8 5.4 6.7 5.4 6.6 5.5C6.6 5.5 6.5 5.5 6.5 5.6L6.2 5.9C6.1 6 6.1 6.1 6.1 6.2C6.1 6.3 6 6.3 6 6.4L5.9 6.3C5.9 6.4 5.8 6.4 5.8 6.5L5.7 6.6C5.6 6.6 5.5 6.8 5.5 6.8C5.5 6.9 5.4 6.9 5.3 6.9C5.3 6.9 5.2 6.9 5.2 7L4.9 7.3C4.8 7.4 4.8 7.5 4.9 7.5L5.1 7.7C5.2 7.8 5.3 7.8 5.3 7.8C5.4 7.9 5.5 7.9 5.6 8C5.7 8.1 5.9 8.2 6 8.2C6.1 8.3 6.2 8.3 6.2 8.4C6.3 8.5 6.4 8.5 6.4 8.6H6.6L7 8.2C7.1 8.1 7.2 7.9 7.3 7.8C7.4 7.7 7.4 7.6 7.5 7.5V7.2C7.5 7.2 7.5 7.1 7.6 7.1C7.6 7.1 7.6 7 7.7 7C7.7 7 7.8 6.9 7.8 6.8C7.8 6.8 7.8 6.7 7.9 6.7C8 6.7 8 6.7 8 6.6C8 6.6 8 6.5 8.1 6.5C8.1 6.4 8.1 6.3 8.2 6.2C8.2 6.1 8.3 6.1 8.4 6C8.5 6 8.5 5.9 8.6 5.9C8.7 5.9 8.8 5.8 8.8 5.8C8.9 5.8 8.9 5.8 9 5.9C9.1 6 9.2 6.1 9.2 6.2L9.3 6.3C9.3 6.4 9.3 6.4 9.4 6.5V6.6C9.6 6.7 9.5 6.9 9.6 7C9.6 7.1 9.7 7.2 9.7 7.3V7.6C9.6 7.8 9.6 8 9.5 8.2C9.4 8.3 9.3 8.5 9.3 8.6C9.3 8.6 9.2 8.7 9.2 8.6C9.1 8.6 9.1 8.7 9.1 8.7C9 8.9 8.9 9.2 8.8 9.4C8.8 9.5 8.7 9.5 8.7 9.6L8.6 9.7C8.5 9.8 8.4 10 8.4 10.1C8.3 10.3 8.2 10.5 8 10.6C7.9 10.7 7.8 10.9 7.6 11L7.5 11.1C7.5 11.2 7.4 11.3 7.3 11.4C7.2 11.5 7.1 11.6 7.1 11.7H6.9C7 11.7 7 11.8 6.9 11.8H7.2C7.4 11.8 7.5 11.8 7.7 11.9H7.8C8 12 8.2 12 8.5 12.1C8.6 12 8.6 11.8 8.5 11.6V11.3C8.5 11.2 8.6 11.1 8.5 11.1V11C8.6 10.9 8.6 10.8 8.5 10.6V10.3C8.5 10.2 8.6 10.2 8.6 10.1C8.6 10.1 8.7 10 8.7 10.1C8.8 10 8.9 9.9 9 9.9H9.1C9.2 9.9 9.4 10 9.4 10.1C9.6 10.4 9.6 10.8 9.7 11.1C9.7 11.2 9.8 11.4 9.8 11.5V11.9C9.7 12 9.7 12.1 9.8 12.3V13.1C9.8 13.2 9.7 13.4 9.7 13.5C9.7 13.6 9.7 13.6 9.6 13.7C9.6 13.8 9.5 13.8 9.4 13.9C9.3 14 9.2 14 9.1 14.1C9.2 13.9 9 13.9 9 13.8L8.9 13.7V13.5C8.9 13.4 8.8 13.4 8.8 13.4C8.7 13.4 8.6 13.4 8.6 13.5C8.6 13.6 8.4 13.7 8.3 13.8C8.2 13.9 8.1 13.9 8 13.9H7.6C7.5 13.9 7.3 13.9 7.2 14H7C6.9 14 6.9 14.1 6.8 14.1C6.7 14.1 6.7 14.2 6.6 14.2C6.6 14.2 6.6 14.3 6.5 14.3V14.4C6.6 14.5 6.5 14.6 6.5 14.7V17C6.5 17.1 6.5 17.2 6.6 17.3V20.3C6.6 20.6 6.6 20.9 6.5 21.2V21.3L6.4 21.2L6.3 21.3C6.3 21.4 6.2 21.6 6.2 21.7C6.2 21.8 6.1 21.9 6.1 22V22.2C6 22.3 6 22.4 5.9 22.5C5.9 22.6 5.8 22.6 5.7 22.7C5.6 22.8 5.5 22.8 5.4 22.9C5.4 22.8 5.4 22.7 5.5 22.6C5.5 22.5 5.6 22.5 5.4 22.5C5.4 22.5 5.3 22.4 5.3 22.3C5.3 22.2 5.3 22 5.2 21.9C5.2 21.6 5.1 21.4 5.1 21.1V17.4C5.1 17.3 5.1 17.2 5 17.2V15.1C5 15 4.9 14.8 4.9 14.7V14.5C4.9 14.4 4.8 14.4 4.8 14.3C4.7 14.3 4.6 14.4 4.5 14.4C4.4 14.4 4.3 14.5 4.2 14.4H4.1C4 14.5 3.9 14.4 3.8 14.4H3.7C3.7 14.4 3.6 14.3 3.6 14.4C3.5 14.4 3.5 14.5 3.4 14.5C3.4 14.5 3.3 14.4 3.3 14.5V14.4L3.2 14.5H3.1C3 14.5 3 14.6 2.9 14.6C2.8 14.6 2.7 14.7 2.6 14.7H2.5C2.4 14.7 2.3 14.7 2.3 14.8C2.3 14.8 2.2 14.8 2.2 14.9L2.1 15H2C1.9 14.9 1.9 14.9 1.8 15L1.7 14.9C2 14.8 2 14.9 1.9 14.9ZM8.6 12.9C8.5 13 8.5 13 8.6 13.1C8.8 13 8.7 13 8.6 12.9Z"/><path fill="currentColor" d="M7.5001 19.4C7.4001 19.3 7.3001 19.3 7.2001 19.2V17.8C7.2001 17.6 7.3001 17.4 7.2001 17.3V15.2C7.1001 15.2 7.1001 15.1 7.1001 15V14.9C7.0001 14.8 7.1001 14.7 7.2001 14.6C7.3001 14.5 7.4001 14.5 7.5001 14.4C7.6001 14.3 7.6001 14.4 7.7001 14.4H7.8001C8.0001 14.4 8.1001 14.5 8.1001 14.6C8.1001 14.8 8.2001 14.9 8.3001 15.1C8.3001 15.2 8.3001 15.4 8.4001 15.5V18.4C8.4001 18.5 8.4001 18.6 8.3001 18.7C8.0001 18.9 8.0001 19 7.9001 19.1C7.8001 19.2 7.8001 19.3 7.7001 19.3C7.7001 19.3 7.6001 19.3 7.5001 19.4ZM2.6001 19.9V19.6C2.6001 19.5 2.6001 19.3 2.7001 19.2V19C2.7001 18.8 2.7001 18.7 2.8001 18.5V18C2.8001 17.7 2.8001 17.5 2.9001 17.2V17.1C2.9001 17 2.9001 16.8 3.0001 16.7V16.3C3.0001 16.1 3.1001 15.9 3.1001 15.8C3.1001 15.7 3.2001 15.6 3.3001 15.4H3.6001C3.7001 15.4 3.7001 15.5 3.8001 15.5C3.8001 15.6 3.9001 15.6 3.9001 15.7C3.9001 15.8 4.0001 16 4.0001 16.1C4.0001 16.2 4.1001 16.4 4.1001 16.5V17C4.0001 17.2 4.0001 17.4 4.0001 17.6C4.0001 17.8 3.9001 18 3.9001 18.2V19.1C3.9001 19.2 3.8001 19.3 3.7001 19.4C3.6001 19.5 3.5001 19.5 3.5001 19.6C3.4001 19.6 3.4001 19.7 3.3001 19.7C3.2001 19.8 3.2001 19.8 3.1001 19.7H3.0001C2.8001 19.9 2.7001 19.9 2.6001 19.9ZM14.8001 4.2C14.7001 4.1 14.7001 4.1 14.8001 4Z"/></svg>';
	const CV_WIKI_CLASSICAL_LANGS = ['zh-classical', 'lzh'];
	const CV_WIKI_SINITIC_LANGS = ['zh', 'zh-yue', 'yue', 'zh-min-nan', 'nan', 'wuu', 'gan', 'hak', 'cdo', 'czh', 'cjy', 'cpx', 'mnp'];

	const CITIZEN_HEADER_HTML = [
		'<div class="citizen-header__logo">',
		'  <a href="https://zh.wikipedia.org/wiki/Wikipedia:%E9%A6%96%E9%A1%B5" class="mw-logo citizen-cdx-button--size-large cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--icon-only cdx-button--weight-quiet" title="访问首页">',
		'    <span class="citizen-header-logo-svg cv-icon-fallback cv-icon-fallback-cv-home cv-home-icon" title="主页" aria-hidden="true"></span>',
		'    <svg class="citizen-header-logo-svg citizen-header-logo-char" width="20" height="20" viewBox="0 0 23 22" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
		'      <path fill="currentColor" d="M2.9 5C3.9 4 5.2 2.8 6.1 1.5C6.6 1.5 6.9 1.3 7 1L3.8 0C3.4 1.6 2.8 3.3 2.3 4.6C1.8 4.3 1.1 4.1 0.3 3.9L0.2 4.1C1.1 4.9 1.9 6.2 2.1 7.4C3.6 8.4 4.9 6.4 2.9 5ZM4.4 21.9C5.4 21.9 6.2 21.4 6.2 21.3V11L7.2 10.7C7.4 11.3 7.5 11.8 7.5 12.4C8.9 13.7 10.5 11.7 8.6 9.8C9.3 9.2 9.9 8.4 10.5 7.7V22H10.9C12 22 12.8 21.4 12.8 21.2V20.1H22.2C22.5 20.1 22.7 20 22.8 19.8C21.3 18.5 20.5 17.9 20.5 17.9L19.2 19.7H17.8V15.1H21.5C21.8 15.1 22 15 22.1 14.8L20 13L18.9 14.7H17.9V10.3H21.6C21.9 10.3 22.1 10.2 22.2 10C20.7 8.8 20 8.2 20 8.2L18.8 9.8H17.8V5.6H21.9C22.2 5.6 22.4 5.5 22.5 5.3C21 4 20.2 3.4 20.2 3.4L18.9 5.2H16.3C17.1 4.2 18.2 2.7 18.8 1.7C19.3 1.7 19.7 1.5 19.8 1.2L16.4 0.5C16.2 1.9 15.9 4 15.5 5.3H13L12.3 5.1C12.9 4.1 13.6 2.8 14.1 1.7C14.7 1.7 14.9 1.5 15 1.2L11.7 0.2C11 3.6 9.7 7.1 8.2 9.4C7.8 8.8 7.2 8.4 6.4 8.1L6.3 8.3C6.6 8.8 6.8 9.5 7.1 10.1C5.9 10.2 4.6 10.2 3.6 10.3C5.4 8.4 7.3 5.9 8.5 4.3C9 4.3 9.3 4.2 9.5 3.9L6.5 2.8C5.6 5 4.2 8 2.8 10.3C1.7 10.3 0.8 10.4 0.2 10.4L1 12.7C1.2 12.7 1.5 12.5 1.6 12.2C2.4 12 3.2 11.8 3.9 11.6V14.2L1.3 13.6C1.1 15.9 0.7 18.2 0 20L0.3 20.2C1.5 18.8 2.5 16.9 3.1 14.8C3.4 14.8 3.7 14.7 3.8 14.5V22L4.4 21.9ZM15.5 9.7H12.8V5.6H15.5V9.7ZM15.5 14.6H12.8V10.2H15.5V14.6ZM6.9 13.4L6.7 13.5C7.2 14.7 7.7 16.4 7.7 17.8C9.3 19.5 11.4 16.1 6.9 13.4ZM15.5 19.6H12.8V15H15.5V19.6Z"/>',
		'    </svg>',
		'  </a>',
		'</div>',

		'<div class="citizen-search citizen-header__item citizen-dropdown">',
		'  <details id="citizen-search-details" class="citizen-dropdown-details">',
		'    <summary id="citizen-search-summary" class="citizen-dropdown-summary citizen-cdx-button--size-large cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--icon-only cdx-button--weight-quiet" title="打开/关闭搜索 [/]" aria-details="citizen-search-details">',
		'      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">',
		'        <circle cx="8" cy="8" r="6" fill="none" stroke="currentcolor" stroke-width="2"></circle>',
		'        <line class="citizen-icon-search__handle" x1="12.5" y1="12.5" x2="18" y2="18" stroke="currentcolor" stroke-width="2" stroke-linecap="round"></line>',
		'        <line class="citizen-icon-search__close" x1="3.6" y1="3.6" x2="16.4" y2="16.4" stroke="currentcolor" stroke-width="2" stroke-linecap="round"></line>',
		'        <line class="citizen-icon-search__close" x1="16.4" y1="3.6" x2="3.6" y2="16.4" stroke="currentcolor" stroke-width="2" stroke-linecap="round"></line>',
		'      </svg>',
		'    </summary>',
		'  </details>',
		'</div>',

		'<div class="citizen-drawer citizen-header__item citizen-dropdown">',
		'  <details class="citizen-dropdown-details">',
		'    <summary class="citizen-dropdown-summary citizen-cdx-button--size-large cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--icon-only cdx-button--weight-quiet" title="打开/关闭菜单" aria-details="citizen-drawer__card">',
		'      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">',
		'        <rect x="1" y="3" width="18" height="2" fill="currentcolor" rx="1"></rect>',
		'        <rect x="1" y="9" width="18" height="2" fill="currentcolor" rx="1"></rect>',
		'        <rect x="1" y="15" width="18" height="2" fill="currentcolor" rx="1"></rect>',
		'      </svg>',
		'    </summary>',
		'  </details>',
		'  <div id="citizen-drawer__card" class="citizen-drawer__card citizen-menu__card">',
		'    <div class="citizen-menu__card-content">',
		'      <div class="citizen-drawer__header">',
		'        <a href="/wiki/Main_Page" class="mw-logo citizen-drawer__logo" title="访问首页">',
		'          <img class="mw-logo-icon" src="https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg" alt="" aria-hidden="true" height="80" width="80" loading="lazy">',
		'        </a>',
		'        <div class="citizen-drawer__siteinfo">',
		'          <div class="citizen-siteStats">',
		'            <div class="citizen-siteStats__item" id="citizen-siteStats__item--articles" title="条目"><span class="citizen-ui-icon mw-ui-icon-article mw-ui-icon-wikimedia-article"></span><span id="citizen-siteStats__count-articles"></span></div>',
		'            <div class="citizen-siteStats__item" id="citizen-siteStats__item--images" title="文件"><span class="citizen-ui-icon mw-ui-icon-image mw-ui-icon-wikimedia-image"></span><span id="citizen-siteStats__count-images"></span></div>',
		'            <div class="citizen-siteStats__item" id="citizen-siteStats__item--users" title="用户"><span class="citizen-ui-icon mw-ui-icon-userAvatar mw-ui-icon-wikimedia-userAvatar"></span><span id="citizen-siteStats__count-users"></span></div>',
		'            <div class="citizen-siteStats__item" id="citizen-siteStats__item--edits" title="编辑"><span class="citizen-ui-icon mw-ui-icon-edit mw-ui-icon-wikimedia-edit"></span><span id="citizen-siteStats__count-edits"></span></div>',
		'          </div>',
		'          <div class="mw-logo-wordmark cv-wordmark" id="cv-site-wordmark"></div>',
		'        </div>',
		'      </div>',
		'      <section id="citizen-main-menu" class="citizen-main-menu citizen-drawer__menu">',
		'        <!-- 三列菜单（导航 / 协作 / 说明）由运行时用 data.drawerMenu 生成 -->',
		'      </section>',
		'    </div>',
		'  </div>',
		'</div>',

		'<div class="citizen-header__inner">',
		'  <div class="citizen-header__start"></div>',
		'  <div class="citizen-header__end">',

		'    <div class="citizen-notifications-dropdown citizen-header__item citizen-dropdown">',
		'      <details id="citizen-notifications-details" class="citizen-dropdown-details">',
		'        <summary class="citizen-dropdown-summary citizen-notifications-button citizen-cdx-button--size-large cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--weight-quiet cdx-button--icon-only" title="通知" data-counter-text="0" aria-details="citizen-notifications-dropdown__card">',
		'          <span class="citizen-ui-icon mw-ui-icon-wikimedia-bell"></span>',
		'          <span>通知</span>',
		'        </summary>',
		'      </details>',
		'      <div id="citizen-notifications-dropdown__card" class="citizen-menu__card">',
		'        <div class="citizen-menu__card-content">',
		'          <div id="citizen-notifications-content" class="citizen-notifications">',
		'            <div class="citizen-notifications__skeleton" role="status" aria-busy="true" aria-live="polite">',
		'              <div class="citizen-notifications__skeleton-item"><span class="citizen-notifications__skeleton-line citizen-notifications__skeleton-line--title"></span><span class="citizen-notifications__skeleton-line citizen-notifications__skeleton-line--meta"></span></div>',
		'              <div class="citizen-notifications__skeleton-item"><span class="citizen-notifications__skeleton-line citizen-notifications__skeleton-line--title"></span><span class="citizen-notifications__skeleton-line citizen-notifications__skeleton-line--meta"></span></div>',
		'              <div class="citizen-notifications__skeleton-item"><span class="citizen-notifications__skeleton-line citizen-notifications__skeleton-line--title"></span><span class="citizen-notifications__skeleton-line citizen-notifications__skeleton-line--meta"></span></div>',
		'              <div class="citizen-notifications__skeleton-item"><span class="citizen-notifications__skeleton-line citizen-notifications__skeleton-line--title"></span><span class="citizen-notifications__skeleton-line citizen-notifications__skeleton-line--meta"></span></div>',
		'              <div class="citizen-notifications__skeleton-item"><span class="citizen-notifications__skeleton-line citizen-notifications__skeleton-line--title"></span><span class="citizen-notifications__skeleton-line citizen-notifications__skeleton-line--meta"></span></div>',
		'            </div>',
		'            <div class="citizen-notifications__error" role="alert" hidden>',
		'              <p>无法加载通知。请检查您的网络连接并重试。</p>',
		'              <button class="cdx-button citizen-notifications__retry" type="button">重试</button>',
		'            </div>',
		'            <a class="citizen-notifications__see-all" href="/wiki/Special:Notifications">查看全部</a>',
		'          </div>',
		'        </div>',
		'      </div>',
		'    </div>',

		'    <div class="citizen-preferences-dropdown citizen-header__item citizen-dropdown">',
		'      <details id="citizen-preferences-details" class="citizen-dropdown-details">',
		'        <summary class="citizen-dropdown-summary citizen-cdx-button--size-large cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--icon-only cdx-button--weight-quiet" title="打开/关闭外观设置菜单" aria-details="citizen-preferences-dropdown__card">',
		'          <span class="citizen-ui-icon mw-ui-icon-wikimedia-configure"></span>',
		'        </summary>',
		'      </details>',
		'      <div id="citizen-preferences-dropdown__card" class="citizen-menu__card">',
		'        <div class="citizen-menu__card-content">',
		'          <div id="citizen-preferences-content" class="citizen-preferences">',
		'            <div class="citizen-preferences-skeleton" role="status" aria-busy="true" aria-live="polite">',
		'              <div class="citizen-preferences-skeleton__heading"></div>',
		'              <div class="citizen-preferences-skeleton__row"><div class="citizen-preferences-skeleton__label"></div><div class="citizen-preferences-skeleton__description"></div></div>',
		'              <div class="citizen-preferences-skeleton__row"><div class="citizen-preferences-skeleton__label"></div><div class="citizen-preferences-skeleton__description"></div></div>',
		'              <div class="citizen-preferences-skeleton__row"><div class="citizen-preferences-skeleton__label"></div><div class="citizen-preferences-skeleton__description"></div></div>',
		'              <div class="citizen-preferences-skeleton__heading"></div>',
		'              <div class="citizen-preferences-skeleton__row"><div class="citizen-preferences-skeleton__label"></div><div class="citizen-preferences-skeleton__description"></div></div>',
		'              <div class="citizen-preferences-skeleton__row"><div class="citizen-preferences-skeleton__label"></div><div class="citizen-preferences-skeleton__description"></div></div>',
		'            </div>',
		'            <div class="citizen-preferences-error" role="alert" hidden>',
		'              <p class="citizen-preferences-error__message">无法加载偏好设置。请检查您的网络连接并重试。</p>',
		'              <button class="cdx-button citizen-preferences-error__retry" type="button">重试</button>',
		'            </div>',
		'          </div>',
		'        </div>',
		'      </div>',
		'    </div>',

		'    <div class="citizen-userMenu citizen-header__item citizen-dropdown">',
		'      <details class="citizen-dropdown-details">',
		'        <summary class="citizen-dropdown-summary citizen-cdx-button--size-large cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--icon-only cdx-button--weight-quiet" title="打开/关闭个人菜单" aria-details="citizen-userMenu__card">',
		'          <span class="citizen-ui-icon mw-ui-icon-wikimedia-userAvatar"></span>',
		'        </summary>',
		'      </details>',
		'      <div id="citizen-userMenu__card" class="citizen-menu__card">',
		'        <div class="citizen-menu__card-content">',
		'          <div class="citizen-userInfo">',
		'            <div class="citizen-userInfo-title"><nav id="citizen-user-menu-userpage" class="citizen-menu"><div class="citizen-menu__content"><ul class="citizen-menu__content-list" id="cv-userpage-list"></ul></div></nav></div>',
		'            <div class="citizen-userInfo-text"><ul class="citizen-userInfo-usergroups" id="cv-usergroups"></ul></div>',
		'            <div class="citizen-userInfo-stats">',
		'              <div class="citizen-userInfo-stats-item"><div class="citizen-userInfo-stats-item-label">编辑数</div><div class="citizen-userInfo-stats-item-value" id="cv-user-editcount">0</div></div>',
		'              <div class="citizen-userInfo-stats-item"><div class="citizen-userInfo-stats-item-label">加入时间</div><div class="citizen-userInfo-stats-item-value" id="cv-user-regdate"></div></div>',
		'            </div>',
		'          </div>',
		'          <nav id="p-user-interface-preferences" class="citizen-menu mw-portlet mw-portlet-user-interface-preferences emptyPortlet" aria-label="user-interface-preferences"><div class="citizen-menu__heading">user-interface-preferences</div><div class="citizen-menu__content"><ul class="citizen-menu__content-list"></ul></div></nav>',
		'          <nav id="p-personal" class="citizen-menu mw-portlet mw-portlet-personal" aria-label="个人工具" title="用户菜单">',
		'            <div class="citizen-menu__heading">个人工具</div>',
		'            <div class="citizen-menu__content"><ul class="citizen-menu__content-list" id="cv-personal-list"></ul></div>',
		'          </nav>',
		'        </div>',
		'      </div>',
		'    </div>',

		'  </div>',
		'</div>',
	].join('\n');


	function cvAbsUrl(url) {
		if (!url) return '';
		try { return new URL(url, location.href).href; } catch (e) { return url; }
	}

	function cvApplyWordmark(el, data) {
		if (!el || data.isWikipedia || !data.siteWordmark) return;
		el.classList.add('cv-wordmark--text');
		el.textContent = data.siteWordmark;
	}

	function cvApplyWikiLogo(newHeader, data) {
		if (!data.isWikipedia) return;
		const lang = location.hostname.toLowerCase().split('.')[0];
		if (CV_WIKI_SINITIC_LANGS.indexOf(lang) >= 0) return;
		const charSvg = newHeader.querySelector('.citizen-header-logo-char');
		if (!charSvg) return;
		charSvg.outerHTML = CV_WIKI_CLASSICAL_LANGS.indexOf(lang) >= 0 ? CV_WIKI_CLASSICAL_SVG : CV_WIKI_W_SVG;
	}

	function cvApplySiteIdentity(newHeader, data) {
		if (!newHeader) return;
		const home = data.siteHome || '';
		const headerLogo = newHeader.querySelector('.citizen-header__logo a.mw-logo');
		if (headerLogo && home) headerLogo.setAttribute('href', home);
		const drawerLogo = newHeader.querySelector('.citizen-drawer__logo');
		if (drawerLogo && home) drawerLogo.setAttribute('href', home);
		const drawerIcon = newHeader.querySelector('.citizen-drawer__logo img.mw-logo-icon');
		if (drawerIcon && data.siteIcon) drawerIcon.setAttribute('src', cvAbsUrl(data.siteIcon));
		if (!data.isWikipedia && data.siteIcon) {
			const charSvg = newHeader.querySelector('.citizen-header-logo-char');
			if (charSvg) {
				const img = document.createElement('img');
				img.className = 'citizen-header-logo-svg citizen-header-logo-char cv-site-icon';
				img.src = cvAbsUrl(data.siteIcon);
				img.alt = '';
				img.setAttribute('aria-hidden', 'true');
				charSvg.replaceWith(img);
			}
		}
		cvApplyWikiLogo(newHeader, data);
		cvApplyWordmark(newHeader.querySelector('#cv-site-wordmark'), data);
	}

	function cvPlainText(html) {
		if (!html) return '';
		const d = document.createElement('div');
		d.innerHTML = html;
		return (d.textContent || '').replace(/\s+/g, ' ').trim();
	}

	function cvFooterStatement(data) {
		const fallback = {
			copyright: CITIZEN_COPYRIGHT_TEXT,
			tagline: CITIZEN_FOOTER_TAGLINE,
		};
		if (data.isWikipedia || !data.footerCopyright) return fallback;
		const holder = document.createElement('div');
		holder.innerHTML = data.footerCopyright;
		const parts = [];
		Array.prototype.forEach.call(holder.childNodes, function (node) {
			if (node.nodeType === 1 && node.tagName === 'BR') { parts.push(''); return; }
			if (node.nodeType === 3) {
				const t = (node.textContent || '').replace(/\s+/g, ' ').trim();
				if (t) {
					if (!parts.length) parts.push('');
					parts[parts.length - 1] += t;
				}
				return;
			}
			if (node.nodeType === 1) {
				if (!parts.length) parts.push('');
				parts[parts.length - 1] += node.outerHTML;
			}
		});
		const sentences = parts.map(function (s) { return s.trim(); }).filter(Boolean);
		return {
			copyright: sentences[0] || fallback.copyright,
			tagline: cvPlainText(sentences[1]),
		};
	}

	const CV_PROJECT_DESC = {
		wikipedia: '维基百科，自由的百科全书',
		wiktionary: '维基词典，自由的多语言词典',
		wikisource: '维基文库，自由的图书馆',
		wikiquote: '维基语录，自由的名人名言录',
		wikibooks: '维基教科书，自由的教学读本',
		wikispecies: '维基物种，自由的物种目录',
		wikivoyage: '维基导游，自由的旅行指南',
		wikiversity: '维基学院，自由的研习社群',
		wikifunctions: '维基函数，自由的函数图书馆',
		commons: '共享的多媒体资料库',
		wikidata: '自由的知识库',
		mediawiki: ' ',
		meta: ' ',
	};

	const CV_PROJECT_NAME = {
		wikipedia: '维基百科',
		wiktionary: '维基词典',
		wikisource: '维基文库',
		wikiquote: '维基语录',
		wikibooks: '维基教科书',
		wikispecies: '维基物种',
		wikivoyage: '维基导游',
		wikiversity: '维基学院',
		wikifunctions: '维基函数',
		commons: '维基共享资源',
		wikidata: '维基数据',
		mediawiki: 'MediaWiki',
		meta: '元维基',
		incubator: '维基孵育场',
	};

	const CV_FOOTER_PLACES_LABELS = {
		'footer-places-privacy': '隐私政策',
		'footer-places-disclaimers': '免责声明',
		'footer-places-contact': '联系我们',
		'footer-places-wm-codeofconduct': '行为准则',
		'footer-places-developers': '开发者',
		'footer-places-cookiestatement': 'Cookie声明',
		'footer-places-data-access': '数据访问',
	};

	function cvProjectKey(host) {
		const h = String(host || '').toLowerCase();
		const label = h.split('.')[0];
		if (/\.wikipedia\.org$/.test(h)) return 'wikipedia';
		if (/\.wiktionary\.org$/.test(h)) return 'wiktionary';
		if (/\.wikisource\.org$/.test(h)) return 'wikisource';
		if (/\.wikiquote\.org$/.test(h)) return 'wikiquote';
		if (/\.wikibooks\.org$/.test(h)) return 'wikibooks';
		if (/\.wikivoyage\.org$/.test(h)) return 'wikivoyage';
		if (/\.wikiversity\.org$/.test(h)) return 'wikiversity';
		if (/\.wikifunctions\.org$/.test(h)) return 'wikifunctions';
		if (/\.wikidata\.org$/.test(h)) return 'wikidata';
		if (/\.mediawiki\.org$/.test(h)) return 'mediawiki';
		if (/\.wikimedia\.org$/.test(h)) {
			if (label === 'commons') return 'commons';
			if (label === 'species') return 'wikispecies';
			if (label === 'meta') return 'meta';
			if (label === 'incubator') return 'incubator';
		}
		return '';
	}


	let cvUserInfoGateArmed = 0;
	let cvUserInfoGateBudget = 0;
	function cvCheckUserPending() {
		let ns; try { ns = mw.config.get('wgNamespaceNumber'); } catch (e) { ns = null; }
		if (ns !== 2 && ns !== 3) { cvUserInfoGateArmed = 0; return false; }
		if (document.querySelector('#p-views li#ca-checkuser-userinfocard')) { cvUserInfoGateArmed = 0; return false; }
		let st; try { st = mw.loader.getState('ext.checkUser.userInfoCard'); } catch (e) { st = 'missing'; }
		if (st !== 'loading' && st !== 'registered' && st !== 'ready') { cvUserInfoGateArmed = 0; return false; }
		if (!cvUserInfoGateArmed) {
			cvUserInfoGateArmed = Date.now();
			cvUserInfoGateBudget = (st === 'ready') ? 300 : 1500;
		}
		if (Date.now() - cvUserInfoGateArmed > cvUserInfoGateBudget) { cvUserInfoGateArmed = 0; return false; }
		return true;
	}

	function init() {
		const gateHeader = document.querySelector('.vector-header-container');
		if (!gateHeader) return false;
		const data = extractVectorData();

		if (!isSpecialPage()) {
			const variantsContainer = document.querySelector('#p-variants');
			if (variantsContainer && !data.variants) {
				diag('variants-pending');
				return false;
			}
		}

		if (cvCheckUserPending()) {
			diag('userinfocard-pending');
			return false;
		}

		const VECTOR_TO_REMOVE = [
			'.vector-sticky-header',                    
			'.vector-sticky-header-container',
			'.vector-main-menu-landmark',               
			'.vector-appearance-landmark',              
			'.vector-page-tools-landmark',              
			'.vector-toc-landmark',                     
			'.vector-user-links',                       
			'#mw-panel',                                
			'#mw-panel-toc',                            
			'.vector-page-titlebar',                    
			'.vector-page-title',

			'.vector-page-toolbar',                     
			'.vector-page-toolbar-container',
			'.vector-page-tools-dropdown',
			'.vector-main-menu-dropdown',
			'.vector-user-menu',
			'.vector-menu-tabs',                        
			'.vector-sitenotice-container',             
			'.vector-pinnable-element',                 
			'.vector-pinnable-header',
			'.vector-column-start',                     
			'.vector-column-end',                       
			'.vector-page-titlebar-toc',                
			'.vector-collapsible',                      
			'.vector-button-flush-left',
			'.vector-button-flush-right',
			'.mw-portlet-views',
			'.mw-portlet-associated-pages',
			'.mw-portlet-variants',
			'#p-lang-btn',
			'#p-lang',
			'.mw-portlet-lang',
			'.mw-portlet-lang-label',
			'.mw-portlet-lang-heading',
		];
		VECTOR_TO_REMOVE.forEach(sel => {
			if (data.toc && (sel === '.vector-column-start' || sel === '.vector-toc-landmark' ||
				sel === '#mw-panel-toc' || sel === '.vector-pinnable-element' || sel === '.vector-pinnable-header' ||
				sel === '.vector-page-titlebar' || sel === '.vector-page-titlebar-toc' || sel === '.vector-button-flush-left')) return;
			document.querySelectorAll(sel).forEach(el => el.remove());
		});

		const oldHeader = document.querySelector('.vector-header-container');
		if (!oldHeader) return false;

		const newHeader = document.createElement('header');
		newHeader.className = 'mw-header citizen-header';
		newHeader.innerHTML = CITIZEN_HEADER_HTML;
		const menuNav = newHeader.querySelector('#citizen-main-menu');
		if (menuNav && data.drawerMenu) {
			menuNav.innerHTML = '';
			const escAttr = v => String(v == null ? '' : v)
				.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
			data.drawerMenu.forEach(col => {
				const lis = col.items.map(it =>
					`<li id="${escAttr(it.id)}" class="mw-list-item"><a href="${escAttr(it.href)}"${it.title ? ` title="${escAttr(it.title)}"` : ''}${it.accesskey ? ` accesskey="${escAttr(it.accesskey)}"` : ''}><span>${escAttr(it.label)}</span></a></li>`
				).join('');
				menuNav.appendChild(makePortlet(col.id, col.heading, col.heading, lis, false, false));
			});
		}
		oldHeader.replaceWith(newHeader);
		cvApplySiteIdentity(newHeader, data);
		document.querySelectorAll('.citizen-header[data-cv-cached]').forEach(n => n.remove());

		fillUserMenu(data.personal);

		setupPreferencesPanel();

		setupNotificationsDropdown(data.notifications, data.notificationsCount);

		fetchSiteStats();

		setupDropdownDismiss();

		setupCommandPalette();

		buildPageHeader(data);
		try { initMainPageHomepage(); } catch (e) { console.error('[citizen-vector] homepage error:', e); }
		buildStickyHeader(data);
		buildPageSidebar(data);
		buildFooter(data);
		setupFooterFloatFade();
		setupTocCollapse();

		cleanupVectorScaffolding();

		renderRelativeTimes();

		setupSectionHeadings();

		setupInfoboxCollapseRows();

		cvInitFactbox();


		wrapWikitablesInOverflow();

		initMainPageLayout();

		cvInitTemplateDataEntry();

		cvInitCategoryPills();

		window.__cvInited = true;   
		cvChromeCacheWrite(newHeader);
		cvCurtainClear();
		if (document.body) {
			document.body.classList.remove('cv-pre-wrap');
			document.body.classList.add('cv-fadein');
			setTimeout(function () {
				if (document.body) document.body.classList.remove('cv-fadein');
			}, 420);
		}
		try { document.documentElement.setAttribute('data-cv-ready', '1'); } catch (e) {}
		return true;   
	}

	function extractVectorData() {
		const data = {
			firstHeading: '',
			siteSub: '',
			views: '',           
			associatedPages: '', 
			tb: '',              
			cactions: '',        
			variants: '',        
			toc: '',             
			lastmod: '',         
			footerPlaces: '',    
			footerIcons: '',     
			footerDesc: '',      
			notifications: false,        
			notificationsCount: 0,       
			drawerMenu: null,        
			addTopic: null,              
			isWikipedia: /(?:^|\.)wikipedia\.org$/i.test(location.hostname),
			siteHome: '',
			siteIcon: '',
			siteWordmark: '',
			siteTagline: '',
			footerCopyright: '',
		};

		const _origHeader = document.querySelector('.vector-header-container') || document;
		const _logoA = _origHeader.querySelector('a.mw-logo');
		if (_logoA) data.siteHome = _logoA.getAttribute('href') || '';
		const _logoIcon = _origHeader.querySelector('.mw-logo-icon');
		if (_logoIcon) data.siteIcon = _logoIcon.getAttribute('src') || '';
		const _logoWm = _origHeader.querySelector('.mw-logo-wordmark');
		if (_logoWm) data.siteWordmark = (_logoWm.getAttribute('alt') || _logoWm.textContent || '').trim();
		const _ss = document.querySelector('#siteSub');
		if (_ss) data.siteTagline = (_ss.textContent || '').trim();
		const _fc = document.querySelector('#footer-info-copyright');
		if (_fc) data.footerCopyright = _fc.innerHTML;

		const titlebar = document.querySelector('header.vector-page-titlebar, .mw-body-header');
		if (titlebar) {
			const fh = titlebar.querySelector('#firstHeading');
			if (fh) data.firstHeading = fh.outerHTML;
		}

		const _at = document.querySelector('#ca-addsection');
		if (_at && _at.tagName === 'A' && !_at.closest('#p-views')) data.addTopic = _at;
		const ss = document.querySelector('#siteSub');
		if (ss) {
			ss.remove();
			data.siteSub = '';
		}

		const grabList = (sel) => {
			const ul = document.querySelector(sel);
			if (!ul) return '';
			return ul.innerHTML;
		};
		const viewsRaw = grabList('#p-views ul') || grabList('#p-views .vector-menu-content-list');
		data.watch = (viewsRaw.match(/<li[^>]*id="ca-watch"[^>]*>[\s\S]*?<\/li>/i) ||
			viewsRaw.match(/<li[^>]*id="ca-unwatch"[^>]*>[\s\S]*?<\/li>/i)) || [''];
		data.watch = data.watch[0] || '';
		data.views = viewsRaw.replace(/<li[^>]*id="(?:ca-watch|ca-unwatch)"[^>]*>[\s\S]*?<\/li>/gi, '')
			.replace(/<li[^>]*id="(?:ca-bookmark|ca-save)"[^>]*>[\s\S]*?<\/li>/gi, '')
			.replace(/<li[^>]*class="[^"]*reading-lists-bookmark[^"]*"[^>]*>[\s\S]*?<\/li>/gi, '');
		const navItem = (id, label, title, fallbackHref) => {
			const a = document.querySelector('#' + id + ' a');
			return {
				id: id,
				label: label,
				title: (a && a.getAttribute('title')) || title,
				href: (a && a.getAttribute('href')) || fallbackHref,
				accesskey: (a && a.getAttribute('accesskey')) || '',
			};
		};
		data.drawerMenu = [
			{ id: 'p-navigation', heading: '导航', items: [
				navItem('n-mainpage-description', '首页', '访问首页', '/wiki/Wikipedia:%E9%A6%96%E9%A1%B5'),
				navItem('n-indexpage', '分类索引', '浏览分类索引', '/wiki/Wikipedia:%E5%88%86%E7%B1%BB%E7%B4%A2%E5%BC%95'),
				navItem('n-randompage', '随机条目', '随机进入一个条目', '/wiki/Special:Random'),
			] },
			{ id: 'p-collaboration', heading: '协作', items: [
				navItem('n-Featured_content', '特色内容', '特色内容', '/wiki/Portal:%E7%89%B9%E8%89%B2%E5%85%A7%E5%AE%B9'),
				navItem('n-currentevents', '新闻动态', '新闻动态', '/wiki/Portal:%E6%96%B0%E8%81%9E%E5%8B%95%E6%85%8B'),
				navItem('n-villagepump', '互助客栈', '参与维基百科社群的讨论', '/wiki/Wikipedia:%E4%BA%92%E5%8A%A9%E5%AE%A2%E6%A0%88'),
			] },
			{ id: 'p-drawer-about', heading: '说明', items: [
				navItem('n-about', '关于', '关于维基百科', '/wiki/Wikipedia:%E5%85%B3%E4%BA%8E'),
				navItem('n-contact', '联络我们', '联络我们', '/wiki/Wikipedia:%E8%81%94%E7%B3%BB%E6%88%91%E4%BB%AC'),
				navItem('n-sitesupport', '资助', '资助维基百科',
					'https://donate.wikimedia.org/?wmf_source=donate&wmf_medium=sidebar&wmf_campaign=zh.wikipedia.org&uselang=zh'),
			] },
		];
		data.associatedPages = grabList('#p-associated-pages ul') || grabList('#p-associated-pages .vector-menu-content-list');
		data.tb = (grabList('#p-tb ul') || grabList('#p-tb .vector-menu-content-list'))
			.replace(/<li[^>]*id="t-specialpages"[^>]*>[\s\S]*?<\/li>/gi, '')
			.replace(/<li[^>]*id="t-cite"[^>]*>[\s\S]*?<\/li>/gi, '');
		data.cactions = (grabList('#p-cactions ul') || grabList('#p-cactions .vector-menu-content-list'))
			.replace(/<li[^>]*id="(?:ca-more-[^"]*|ca-[a-z0-9]+(?:-[a-z0-9]+)*-more)"[^>]*>[\s\S]*?<\/li>/gi, '') + data.watch;
		data.languages = grabList('#p-lang ul') || grabList('#p-lang .vector-menu-content-list') ||
			grabList('#p-lang-btn ul') || grabList('#p-lang-btn .vector-menu-content-list');
		data.variants = grabList('#p-variants ul') || grabList('#p-variants .vector-menu-content-list');

		const splitLis = (html, keepFn) => {
			if (!html || !html.trim()) return { kept: '', demoted: '' };
			const t = document.createElement('template');
			t.innerHTML = html;
			const kept = [], demoted = [];
			Array.from(t.content.children).forEach(li => {
				if (li.tagName !== 'LI') { kept.push(li.outerHTML); return; }
				const id = li.id || (li.firstElementChild && li.firstElementChild.id) || '';
				(keepFn(id, li) ? kept : demoted).push(li.outerHTML);
			});
			return { kept: kept.join(''), demoted: demoted.join('') };
		};
		const VIEW_KEEP = ['ca-view', 'ca-edit', 'ca-ve-edit', 'ca-viewsource', 'ca-history', 'ca-addsection'];
		const ASSOC_KEEP = /^(?:ca-nstab-|ca-user$|ca-talk$)/;
		const _v = splitLis(data.views, id => VIEW_KEEP.indexOf(id) !== -1);
		const _a = splitLis(data.associatedPages, id => ASSOC_KEEP.test(id));
		data.views = _v.kept;
		data.associatedPages = _a.kept;
		data.cactions = (data.cactions || '') + _v.demoted + _a.demoted;

		if (cvHasCheckUserUserInfo()) {
			data.cactions = data.cactions.replace(/<li[^>]*id="ca-checkuser-userinfocard"[^>]*>[\s\S]*?<\/li>/gi, '');
			data.checkUserLi = document.querySelector('#p-views li#ca-checkuser-userinfocard');
		}


		if (isSpecialPage()) {
			data.watch = '';
			data.views = '';
			data.associatedPages = '';
			data.variants = '';
			data.languages = '';
		}

		const tocNode = document.querySelector('#mw-panel-toc') || document.querySelector('#toc');
		if (tocNode) data.toc = tocNode.outerHTML;
		const _nsNum = mw.config.get('wgNamespaceNumber');
		const NS_TOC_ALLOWED = [0, 4, 118];
		const _isTalkNs = typeof _nsNum === 'number' && _nsNum >= 1 && _nsNum % 2 === 1;
		if (NS_TOC_ALLOWED.indexOf(_nsNum) === -1 && !_isTalkNs) data.toc = '';
		if (isDiffPage()) data.toc = '';

		const lastmodNode = document.querySelector('#footer-info-lastmod, .last-modified-bar, #lastmod');
		if (lastmodNode) data.lastmod = lastmodNode.outerHTML;
		const footerInfoNode = document.querySelector('#footer-info');
		if (footerInfoNode) data.footerInfo = footerInfoNode.innerHTML;

		const fp = document.querySelector('#footer-places');
		if (fp) data.footerPlaces = fp.innerHTML;
		const fi = document.querySelector('#footer-icons');
		if (fi) data.footerIcons = fi.innerHTML;
		const fd = document.querySelector('#footer-desc');
		if (fd) data.footerDesc = fd.textContent.replace(/\s+/g, ' ').trim();

		let personalList = document.querySelector('.vector-user-links-legacy > ul');
		if (!personalList) {
			const mytalk = document.getElementById('pt-mytalk');
			if (mytalk) personalList = mytalk.closest('ul');
		}
		if (!personalList) {
			const ptParent = document.querySelector('[id^="pt-"]');
			if (ptParent) personalList = ptParent.parentElement;
		}
		if (personalList) data.personal = personalList.outerHTML;

		data.notifications = true;
		const vectorCounter = document.querySelector('.vector-menu-tabs-added [data-counter-num]');
		if (vectorCounter) data.notificationsCount = parseInt(vectorCounter.getAttribute('data-counter-num') || '0', 10);

		return data;
	}

	const CITIZEN_ACTION_ICONS = {
		'ca-view': 'mw-ui-icon-eye mw-ui-icon-wikimedia-eye',
		'ca-edit': 'mw-ui-icon-edit mw-ui-icon-wikimedia-edit',
		'ca-ve-edit': 'mw-ui-icon-edit mw-ui-icon-wikimedia-edit',
		'ca-history': 'mw-ui-icon-history mw-ui-icon-wikimedia-history',
		'ca-addsection': 'mw-ui-icon-speechBubbleAdd mw-ui-icon-wikimedia-speechBubbleAdd',
		'ca-viewsource': 'mw-ui-icon-editLock mw-ui-icon-wikimedia-editLock',
		'ca-talk': 'mw-ui-icon-speechBubbles mw-ui-icon-wikimedia-speechBubbles',
		'ca-nstab-main': 'mw-ui-icon-arrowPrevious mw-ui-icon-wikimedia-arrowPrevious',
		'ca-nstab-project': 'mw-ui-icon-arrowPrevious mw-ui-icon-wikimedia-arrowPrevious',
		'ca-nstab-template': 'mw-ui-icon-arrowPrevious mw-ui-icon-wikimedia-arrowPrevious',
		'ca-nstab-category': 'mw-ui-icon-arrowPrevious mw-ui-icon-wikimedia-arrowPrevious',
		'ca-nstab-user': 'mw-ui-icon-userAvatar mw-ui-icon-wikimedia-userAvatar',
		'ca-nstab-image': 'mw-ui-icon-image mw-ui-icon-wikimedia-image',
		'ca-nstab-file': 'mw-ui-icon-image mw-ui-icon-wikimedia-image',
		'ca-nstab-help': 'mw-ui-icon-help mw-ui-icon-wikimedia-help',
		'ca-nstab-portal': 'mw-ui-icon-arrowPrevious mw-ui-icon-wikimedia-arrowPrevious',
		'ca-watch': 'mw-ui-icon-star mw-ui-icon-wikimedia-star',
		'ca-unwatch': 'mw-ui-icon-unStar mw-ui-icon-wikimedia-unStar',
		'ca-delete': 'mw-ui-icon-trash mw-ui-icon-wikimedia-trash',
		'ca-move': 'mw-ui-icon-move mw-ui-icon-wikimedia-move',
		'ca-protect': 'mw-ui-icon-lock mw-ui-icon-wikimedia-lock',
		'ca-wikilove': 'mw-ui-icon-heart mw-ui-icon-wikimedia-heart',
		'ca-checkuser-userinfocard': 'mw-ui-icon-userAvatar mw-ui-icon-wikimedia-userAvatar',
		'ca-homepage': 'mw-ui-icon-home mw-ui-icon-wikimedia-home',
		't-whatlinkshere': 'mw-ui-icon-articleRedirect mw-ui-icon-wikimedia-articleRedirect',
		't-recentchangeslinked': 'mw-ui-icon-recentChanges mw-ui-icon-wikimedia-recentChanges',
		't-specialpages': 'mw-ui-icon-specialPages mw-ui-icon-wikimedia-specialPages',
		't-print': 'mw-ui-icon-printer mw-ui-icon-wikimedia-printer',
		't-permalink': 'mw-ui-icon-link mw-ui-icon-wikimedia-link',
		't-info': 'mw-ui-icon-infoFilled mw-ui-icon-wikimedia-infoFilled',
		't-cite': 'mw-ui-icon-reference mw-ui-icon-wikimedia-reference',
		't-upload': 'mw-ui-icon-upload mw-ui-icon-wikimedia-upload',
		't-urlshortener': 'mw-ui-icon-qrCode mw-ui-icon-wikimedia-qrCode',
		'wbc-editpage': 'mw-ui-icon-linkExternal mw-ui-icon-wikimedia-linkExternal',
		'ca-view-more': 'mw-ui-icon-eye mw-ui-icon-wikimedia-eye',
		'ca-viewsource-more': 'mw-ui-icon-editLock mw-ui-icon-wikimedia-editLock',
		'ca-history-more': 'mw-ui-icon-history mw-ui-icon-wikimedia-history',
		'n-mainpage-description': 'mw-ui-icon-home mw-ui-icon-wikimedia-home',
		'n-indexpage': 'mw-ui-icon-listBullet mw-ui-icon-wikimedia-listBullet',
		'n-randompage': 'mw-ui-icon-die mw-ui-icon-wikimedia-die',
		'n-Featured_content': 'mw-ui-icon-specialPages mw-ui-icon-wikimedia-specialPages',
		'n-currentevents': 'mw-ui-icon-recentChanges mw-ui-icon-wikimedia-recentChanges',
		'n-villagepump': 'mw-ui-icon-userTalk mw-ui-icon-wikimedia-userTalk',
		'n-about': 'mw-ui-icon-infoFilled mw-ui-icon-wikimedia-infoFilled',
		'n-contact': 'mw-ui-icon-message mw-ui-icon-wikimedia-message',
		'n-sitesupport': 'mw-ui-icon-star mw-ui-icon-wikimedia-star',
	};
	function makeLinkPortlet(id, heading, ariaLabel, rawHtml) {
		const nav = document.createElement('nav');
		nav.id = id;
		nav.className = 'citizen-menu mw-portlet mw-portlet-' + id.replace(/^p-/, '');
		nav.setAttribute('aria-label', ariaLabel);
		nav.innerHTML = `<div class="citizen-menu__heading">${heading}</div><div class="citizen-menu__content"><ul class="citizen-menu__content-list"></ul></div>`;
		const ul = nav.querySelector('.citizen-menu__content-list');

		const t = document.createElement('template');
		t.innerHTML = rawHtml;
		const seen = new Set();
		t.content.querySelectorAll('li a').forEach(a => {
			const href = a.getAttribute('href') || '';
			const text = (a.textContent || '').trim();
			if (!href || !text) return;
			const key = href || text;
			if (seen.has(key)) return;
			seen.add(key);
			const li = document.createElement('li');
			li.className = 'mw-list-item';
			const na = document.createElement('a');
			na.href = href;
			const span = document.createElement('span');
			span.textContent = text;
			na.appendChild(span);
			li.appendChild(na);
			ul.appendChild(li);
		});
		return nav;
	}

	function parseLangItems(rawHtml) {
		const out = [];
		if (!rawHtml || !rawHtml.trim()) return out;
		const t = document.createElement('template');
		t.innerHTML = rawHtml;
		const seen = new Set();
		t.content.querySelectorAll('li a').forEach(a => {
			const href = a.getAttribute('href') || '';
			const text = (a.textContent || '').trim();
			if (!href || !text) return;
			if (seen.has(href)) return;
			seen.add(href);
			const code = (a.getAttribute('hreflang') || a.getAttribute('lang') || '').toLowerCase();
			out.push({ href, code, text });
		});
		return out;
	}

	function buildStaticLangMenu(actions, rawHtml) {
		const items = parseLangItems(rawHtml).map(i => ({ href: i.href, code: i.code, name: i.text }));
		const langs = items;
		actions.insertAdjacentHTML('beforeend', `
			<div id="citizen-page-languages-dropdown" class="citizen-page-languages citizen-page-actions__item citizen-dropdown">
				<details class="citizen-dropdown-details">
					<summary class="citizen-dropdown-summary citizen-cdx-button--size-large cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--weight-quiet cdx-button--icon-only" title="更多语言" aria-details="citizen-languages__card" data-counter-text="${langs.length}">
						<span class="citizen-ui-icon mw-ui-icon-wikimedia-language"></span><span>更多语言</span>
					</summary>
				</details>
				<div id="citizen-languages__card" class="citizen-menu__card"><div class="citizen-menu__card-content"></div></div>
			</div>`);
		const card = actions.querySelector('#citizen-languages__card .citizen-menu__card-content');
		if (!card) return;
		const nav = document.createElement('nav');
		nav.id = 'p-langs';
		nav.className = 'citizen-menu mw-portlet mw-portlet-langs';
		nav.setAttribute('aria-label', '其他语言');
		nav.innerHTML = `<div class="citizen-menu__heading">其他语言</div><div class="citizen-menu__content"><ul class="citizen-menu__content-list"></ul></div>`;
		const ul = nav.querySelector('.citizen-menu__content-list');
		langs.forEach(l => {
			const li = document.createElement('li');
			li.className = 'mw-list-item';
			const a = document.createElement('a');
			if (l.href && l.href !== '#') {
				a.href = l.href;
			} else {
				a.href = '#';
				a.addEventListener('click', e => e.preventDefault());
			}
			if (l.code) { a.className = 'lang-' + l.code; a.setAttribute('data-lang', l.code); }
			const span = document.createElement('span');
			span.textContent = l.name;
			a.appendChild(span);
			li.appendChild(a);
			ul.appendChild(li);
		});
		card.appendChild(nav);
	}

	function makePortlet(id, heading, ariaLabel, rawLis, isButton, mergeVE, defaultIcon) {
		rawLis = rawLis.replace(/<li[^>]*id="(?:ca-bookmark|ca-save)"[^>]*>[\s\S]*?<\/li>/gi, '')
			.replace(/<li[^>]*class="[^"]*reading-lists-bookmark[^"]*"[^>]*>[\s\S]*?<\/li>/gi, '');
		const nav = document.createElement('nav');
		nav.id = id;
		nav.className = 'citizen-menu mw-portlet mw-portlet-' + id.replace(/^p-/, '');
		nav.setAttribute('aria-label', ariaLabel);
		nav.innerHTML = `<div class="citizen-menu__heading">${heading}</div><div class="citizen-menu__content"><ul class="citizen-menu__content-list"></ul></div>`;
		const ul = nav.querySelector('.citizen-menu__content-list');

		const t = document.createElement('template');
		t.innerHTML = rawLis;
		const lis = Array.from(t.content.querySelectorAll('li'));
		const hasEdit = lis.some(li => li.id === 'ca-edit');

		lis.forEach(li => {
			const idAttr = li.id || '';
			const a = li.querySelector('a');
			const href = a ? (a.getAttribute('href') || '') : '';
			const rawLabel = a ? (a.textContent || '').trim() : '';
			const isNew = li.classList.contains('new');
			const isSelected = li.classList.contains('selected');
			const aTitle = a ? (a.getAttribute('title') || '') : '';
			const aAccessKey = a ? (a.getAttribute('accesskey') || '') : '';

			if (mergeVE && idAttr === 'ca-ve-edit' && hasEdit) return;
			if (!a || !href) return; 

			const isEdit = idAttr === 'ca-edit' || idAttr === 'ca-ve-edit';
			const displayLabel = isEdit ? '编辑' : rawLabel;

			const newLi = document.createElement('li');
			newLi.className = 'mw-list-item';
			if (/^ca-/.test(idAttr)) newLi.setAttribute('id', idAttr);
			if (isSelected) newLi.classList.add('selected');

			const newA = document.createElement('a');
			newA.href = href;
			if (aTitle) newA.setAttribute('title', aTitle);
			if (aAccessKey) newA.setAttribute('accesskey', aAccessKey);
			if (isNew) newA.classList.add('new');

			let iconCls = isTalkNamespace() && (/^ca-nstab-/.test(idAttr) || idAttr === 'ca-user')
				? 'mw-ui-icon-arrowPrevious mw-ui-icon-wikimedia-arrowPrevious'
				: CITIZEN_ACTION_ICONS[idAttr];
			if (!iconCls && defaultIcon) iconCls = 'mw-ui-icon-' + defaultIcon + ' mw-ui-icon-wikimedia-' + defaultIcon;
			if (!iconCls && isButton) iconCls = 'mw-ui-icon-article mw-ui-icon-wikimedia-article';
			if (iconCls) newA.insertAdjacentHTML('afterbegin', `<span class="citizen-ui-icon ${iconCls}"></span>`);

			const textSpan = document.createElement('span');
			textSpan.textContent = displayLabel;
			newA.appendChild(textSpan);

			if (isButton) {
				newA.classList.add('citizen-cdx-button--size-large', 'cdx-button', 'cdx-button--fake-button', 'cdx-button--fake-button--enabled');
				newA.classList.add(isEdit ? 'cdx-button--weight-primary' : 'cdx-button--weight-quiet');
				if (isEdit) newA.classList.add('cdx-button--action-progressive');
			}

			newLi.appendChild(newA);
			ul.appendChild(newLi);
		});
		return nav;
	}
	function emptyPortlet(id, heading, ariaLabel, title) {
		const nav = document.createElement('nav');
		nav.id = id;
		nav.className = 'citizen-menu mw-portlet mw-portlet-' + id.replace(/^p-/, '') + ' emptyPortlet';
		nav.setAttribute('aria-label', ariaLabel);
		if (title) nav.setAttribute('title', title);
		nav.innerHTML = `<div class="citizen-menu__heading">${heading}</div><div class="citizen-menu__content"><ul class="citizen-menu__content-list"></ul></div>`;
		return nav;
	}
	function buildMoreCardContent(data) {
		const frag = document.createDocumentFragment();
		const hasCactions = !!(data.cactions && data.cactions.trim());
		const hasTb = !!(data.tb && data.tb.trim());
		frag.appendChild(hasCactions
			? makePortlet('p-cactions', '更多', '更多', data.cactions, false, false)
			: emptyPortlet('p-cactions', '更多', '更多', '更多选项'));
		frag.appendChild(hasTb
			? makePortlet('p-tb', '工具', '工具', data.tb, false, false)
			: emptyPortlet('p-tb', '工具', '工具', '工具'));
		return frag;
	}

	function cvInitTemplateDataEntry() {
		if (!isEditorPage()) return;
		const tryAttach = (n) => {
			const srcBtn = document.querySelector('.tdg-editscreen-main > .oo-ui-buttonElement .oo-ui-buttonElement-button');
			if (!srcBtn) {
				if (n < 60) setTimeout(() => tryAttach(n + 1), 250);
				return;
			}
			const tb = document.querySelector('#citizen-page-actions-more__card .citizen-menu__card-content #p-tb');
			if (!tb || tb.querySelector('#ca-templatedata')) return;
			const ul = tb.querySelector('.citizen-menu__content-list');
			if (!ul) return;
			tb.classList.remove('emptyPortlet');
			tb.removeAttribute('title');
			const li = document.createElement('li');
			li.className = 'mw-list-item';
			li.id = 'ca-templatedata';
			const a = document.createElement('a');
			a.href = '#';
			a.setAttribute('role', 'button');
			a.setAttribute('title', '编辑模板数据');
			a.insertAdjacentHTML('afterbegin', '<span class="citizen-ui-icon mw-ui-icon-edit mw-ui-icon-wikimedia-edit"></span>');
			const label = document.createElement('span');
			label.textContent = '编辑模板数据';
			a.appendChild(label);
			a.addEventListener('click', (e) => {
				e.preventDefault();
				document.querySelectorAll('.citizen-dropdown-details[open]').forEach(d => { d.open = false; });
				srcBtn.click();
			});
			li.appendChild(a);
			ul.appendChild(li);
		};
		tryAttach(0);
	}

	function makeAddTopicItem(a) {
		const li = document.createElement('li');
		li.className = 'mw-list-item';
		a.classList.remove('cdx-button--action-progressive');
		a.classList.add('citizen-cdx-button--size-large', 'cdx-button', 'cdx-button--fake-button',
			'cdx-button--fake-button--enabled', 'cdx-button--weight-quiet', 'cdx-button--action-default');
		const aTitle = a.getAttribute('title') || '';
		if (!aTitle || aTitle.indexOf('undefined') === 0) a.setAttribute('title', '新增話題');
		if (!a.getAttribute('aria-label')) a.setAttribute('aria-label', '新增話題');
		a.textContent = '';
		a.insertAdjacentHTML('afterbegin', '<span class="citizen-ui-icon mw-ui-icon-speechBubbleAdd mw-ui-icon-wikimedia-speechBubbleAdd"></span>');
		const label = document.createElement('span');
		label.textContent = '新增話題';
		a.appendChild(label);
		li.appendChild(a);
		return li;
	}

	function cvHasCheckUserUserInfo() {
		const ns = mw.config.get('wgNamespaceNumber');
		return (ns === 2 || ns === 3) && !!document.querySelector('#p-views li#ca-checkuser-userinfocard');
	}
	function cvInitUserInfoCard(headerWrapper, srcLi) {
		if (!srcLi) return;
		const heading = headerWrapper.querySelector('.citizen-page-heading');
		const fhc = heading && heading.querySelector('.firstHeading-container');
		const firstHeading = fhc && fhc.querySelector('#firstHeading');
		if (!heading || !fhc || !firstHeading) return;

		heading.classList.add('citizen-userinfo-host');

		const wrapHtml = `
			<div class="citizen-page-userinfo citizen-userMenu citizen-dropdown">
				<div class="citizen-userinfo-trigger"></div>
				<details class="citizen-dropdown-details" id="citizen-userinfo-details"></details>
				<div id="citizen-userinfo__card" class="citizen-menu__card"><div class="citizen-menu__card-content"></div></div>
			</div>`;
		fhc.insertAdjacentHTML('beforeend', wrapHtml);
		fhc.insertAdjacentHTML('beforeend', '<div class="citizen-userinfo-title-trigger"></div>');
		const wrap = fhc.querySelector('.citizen-page-userinfo');
		const details = wrap.querySelector('#citizen-userinfo-details');
		const content = wrap.querySelector('#citizen-userinfo__card .citizen-menu__card-content');
		wrap.querySelector('.citizen-userinfo-trigger').appendChild(srcLi);

		const titleTrigger = fhc.querySelector('.citizen-userinfo-title-trigger');
		titleTrigger.addEventListener('click', (e) => {
			e.stopPropagation();
			if (details.open) { details.open = false; return; }
			document.querySelectorAll('.citizen-dropdown-details[open]').forEach(d => { if (d !== details) d.open = false; });
			details.open = true;
			load();
		});

		const blockPopoverOutsideClose = (el) => {
			['mousedown', 'focusin'].forEach(type => {
				el.addEventListener(type, (e) => e.stopPropagation(), true);
			});
		};
		blockPopoverOutsideClose(wrap);
		blockPopoverOutsideClose(titleTrigger);

		content.addEventListener('click', (e) => {
			e.stopPropagation();
			const a = e.target.closest && e.target.closest('.citizen-userInfo-title a');
			if (!a || !content.contains(a)) return;
			e.preventDefault();
			const name = a.textContent.trim();
			if (name && navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(name).catch(() => {});
			}
		});

		const popover = () => document.getElementById('ext-checkuser-userinfocard-popover');
		const hasView = () => {
			const p = popover();
			return !!(p && p.querySelector('.ext-checkuser-userinfocard-view'));
		};

		const GROUP_CODE_LOCAL = {
			'行政员': 'bureaucrat', '界面管理员': 'interface-admin', '管理员': 'sysop',
			'查核员': 'checkuser', '监督员': 'oversight', '监管员': 'steward',
			'延伸确认用户': 'extendedconfirmed', '编辑': 'editor', '巡查员': 'patroller',
			'巡查豁免者': 'autoreviewer', '回退员': 'rollbacker', '文件移动员': 'filemover',
			'模板编辑员': 'templateeditor', '跨维基导入者': 'transwiki', '导入者': 'import',
			'IP封禁豁免': 'ipblock-exempt', 'IP封禁豁免者': 'ipblock-exempt',
			'账号创建员': 'accountcreator', '机器人': 'bot'
		};
		const GROUP_CODE_GLOBAL = {
			'全域IP封禁豁免': 'global-ipblock-exempt', '全域回退员': 'global-rollbacker',
			'全域管理员': 'global-sysop', '全域界面管理员': 'global-interface-admin',
			'创办人': 'founder', '申诉专员': 'ombudsman', 'VRT权限': 'vrt-permissions'
		};
		const cvGroupLi = (label, isGlobal) => {
			const code = (isGlobal ? GROUP_CODE_GLOBAL : GROUP_CODE_LOCAL)[label];
			if (!code) return '<li class="citizen-userInfo-usergroup"><span>' + escapeHtml(label) + '</span></li>';
			const href = wikiUrl(isGlobal ? 'Special:GlobalUsers' : 'Special:ListUsers') +
				'?group=' + encodeURIComponent(code);
			return '<li id="group-' + encodeURIComponent(code) + '-member" class="citizen-userInfo-usergroup"><a href="' +
				href + '"><span>' + escapeHtml(label) + '</span></a></li>';
		};
		const cvStatItem = (label, value) =>
			'<div class="citizen-userInfo-stats-item"><div class="citizen-userInfo-stats-item-label">' +
			escapeHtml(label) + '</div><div class="citizen-userInfo-stats-item-value">' +
			escapeHtml(value) + '</div></div>';
		const cvBuildUserInfo = () => {
			const p = popover();
			const view = p && p.querySelector('.ext-checkuser-userinfocard-view');
			const pick = (sel) => (view ? view.querySelector(sel) : null);
			const text = (el) => (el && el.textContent ? el.textContent.trim() : '');
			const val = (id) => (view ? text(view.querySelector('#' + id)) : '');
			const stripLabel = (s) => String(s || '').replace(/^[^:：]*[:：]\s*/, '').trim();
			const splitGroups = (el) => stripLabel(text(el))
				.split(/[、,]/).map(s => s.replace(/[\u200B-\u200D\uFEFF]/g, '').trim()).filter(Boolean);

			const unameA = p ? p.querySelector('.ext-checkuser-userinfocard-header-username a') : null;
			const userName = text(unameA) ||
				String(mw.config.get('wgPageName') || '').replace(/^[^:]+:/, '').replace(/_/g, ' ');
			const userHref = (unameA && unameA.getAttribute('href')) || wikiUrl('User:' + userName);

			const joined = stripLabel(text(pick('.ext-checkuser-userinfocard-joined')))
				.replace(/\s*[（(][^（()）]*[前后][)）]\s*$/, '');
			const localGroups = splitGroups(pick('.ext-checkuser-userinfocard-groups'));
			const globalGroups = splitGroups(pick('.ext-checkuser-userinfocard-global-groups'));
			const localEdits = val('info-row-local_edits');
			const thanksReceived = val('info-row-thanks_received');

			let html = '<div class="citizen-userInfo">';
			html += '<div class="citizen-userInfo-title"><nav class="citizen-menu"><div class="citizen-menu__content">' +
				'<ul class="citizen-menu__content-list"><li class="mw-list-item"><a href="' + escapeHtml(userHref) +
				'" title="用户页"><span>' + escapeHtml(userName) + '</span></a></li></ul></div></nav></div>';

			const groupLis = localGroups.map(l => cvGroupLi(l, false))
				.concat(globalGroups.map(l => cvGroupLi(l, true))).join('');
			if (groupLis) html += '<div class="citizen-userInfo-text"><ul class="citizen-userInfo-usergroups">' +
				groupLis + '</ul></div>';

			const stats = [];
			if (localEdits) stats.push(cvStatItem('编辑数', localEdits));
			if (joined) stats.push(cvStatItem('加入时间', joined));
			if (thanksReceived) stats.push(cvStatItem('收到感谢数', thanksReceived));
			if (stats.length) html += '<div class="citizen-userInfo-stats">' + stats.join('') + '</div>';

			html += '</div>';

			const old = content.querySelector(':scope > .citizen-userInfo');
			if (old) old.parentNode.removeChild(old);
			content.insertAdjacentHTML('afterbegin', html);
		};

		const moveIn = () => {
			const p = popover();
			if (!p || !hasView()) return false;
			content.appendChild(p);
			cvBuildUserInfo();
			return true;
		};

		let loading = false;
		let mountTries = 0;

		let watched = false;
		const watch = () => {
			const p = popover();
			if (!p || watched) return;
			watched = true;
			let hadView = hasView();
			new MutationObserver(() => {
				if (hasView()) { hadView = true; return; }
				if (details.open && hadView) { hadView = false; close(); }
			}).observe(p, { childList: true, subtree: true });
		};

		const load = () => {
			watch();
			if (moveIn()) return;
			if (loading) return;
			if (!popover() && !document.body.classList.contains('ext-checkuser-userinfocard-enabled')) {
				if (mountTries++ < 150) setTimeout(load, 100);
				return;
			}
			loading = true;
			let tries = 0;
			const attempt = () => {
				const el = srcLi.querySelector('a');
				if (!el) { loading = false; return; }
				el.dispatchEvent(new MouseEvent('click', { bubbles: false, cancelable: true, view: window }));
				let waited = 0;
				const poll = () => {
					if (moveIn()) {
						loading = false;
						const ae = document.activeElement;
						if (ae && content.contains(ae) && ae.blur) ae.blur();
						return;
					}
					if (waited >= 20) {
						const p = popover();
						const opened = !!(p && p.querySelector('.cdx-popover'));
						if (!opened && tries++ < 5) { attempt(); return; }
					}
					if (waited++ > 150) { loading = false; return; }
					setTimeout(poll, 100);
				};
				poll();
			};
			attempt();
		};
		const close = () => { if (details.open) details.open = false; };

		details.addEventListener('toggle', () => { if (details.open) load(); });

		cvBuildUserInfo();
		load();
	}

	function buildPageHeader(data) {
		if (!data.firstHeading) return;

		const wrapper = document.createElement('header');
		wrapper.className = 'mw-body-header citizen-page-header';
		wrapper.id = 'citizen-page-header';
		wrapper.innerHTML = `
			<div class="citizen-page-header-inner">
				<div class="citizen-page-heading">
					<div class="firstHeading-container">
						${data.firstHeading}
						<div class="mw-indicators"></div>
					</div>
					${data.siteSub || ''}
				</div>
				<div class="citizen-page-actions"></div>
			</div>
		`;
		const actions = wrapper.querySelector('.citizen-page-actions');


		if (isShareable()) {
			actions.insertAdjacentHTML('beforeend', `
				<div class="citizen-share-trigger citizen-header__item">
					<button type="button" id="citizen-share" class="citizen-share citizen-cdx-button--size-large cdx-button cdx-button--weight-quiet cdx-button--icon-only" title="分享此页面" aria-label="分享此页面" aria-haspopup="dialog">
						<span class="citizen-ui-icon mw-ui-icon-wikimedia-share"></span><span>分享此页面</span>
					</button>
				</div>`);
		}

		if (!isSpecialPage()) buildStaticLangMenu(actions, data.languages);
		const variantNeeded = !!(data.variants && data.variants.trim());
		if (variantNeeded) {
			actions.insertAdjacentHTML('beforeend', `
				<div id="citizen-page-variants" class="citizen-page-variants citizen-page-actions__item citizen-dropdown">
					<details class="citizen-dropdown-details">
						<summary class="citizen-dropdown-summary citizen-cdx-button--size-large cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--weight-quiet cdx-button--icon-only" title="语言变体" aria-details="citizen-variants__card" data-counter-text="0">
							<span class="citizen-ui-icon mw-ui-icon-wikimedia-conversion"></span><span>语言变体</span>
						</summary>
					</details>
					<div id="citizen-variants__card" class="citizen-menu__card"><div class="citizen-menu__card-content"></div></div>
				</div>`);
			const varCard = actions.querySelector('#citizen-variants__card .citizen-menu__card-content');
			if (varCard) {
				varCard.appendChild(makeLinkPortlet('p-variants', '语言变体', '语言变体', data.variants));
				const varCnt = varCard.querySelectorAll('li.mw-list-item').length;
				const varWrap = varCard.closest('.citizen-page-variants');
				const varSum = varWrap ? varWrap.querySelector('summary[data-counter-text]') : null;
				if (varSum && varCnt > 0) varSum.setAttribute('data-counter-text', String(varCnt));
			}
		}

		if (data.views) {
			const pv = makePortlet('p-views', '查看', '查看', data.views, true, true);
			if (data.addTopic) {
				const list = pv.querySelector('.citizen-menu__content-list');
				if (list) list.insertBefore(makeAddTopicItem(data.addTopic), list.firstChild);
			}
			actions.appendChild(pv);
		}

		if (data.associatedPages) actions.appendChild(makePortlet('p-associated-pages', '关联页面', '关联页面', data.associatedPages, true, false));

		actions.insertAdjacentHTML('beforeend', `
			<div id="citizen-page-more-dropdown" class="citizen-page-actions-more citizen-page-actions__item citizen-dropdown">
				<details class="citizen-dropdown-details">
					<summary class="citizen-dropdown-summary citizen-cdx-button--size-large cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--weight-quiet cdx-button--icon-only" title="更多操作" aria-details="citizen-page-actions-more__card">
						<span class="citizen-ui-icon mw-ui-icon-wikimedia-ellipsis"></span><span>更多操作</span>
					</summary>
				</details>
				<div id="citizen-page-actions-more__card" class="citizen-menu__card"><div class="citizen-menu__card-content"></div></div>
			</div>`);
		const moreCard = actions.querySelector('#citizen-page-actions-more__card .citizen-menu__card-content');
		moreCard.appendChild(buildMoreCardContent(data));

		if (data.checkUserLi) cvInitUserInfoCard(wrapper, data.checkUserLi);

		const oldTitlebar = document.querySelector('header.vector-page-titlebar, header.mw-body-header');
		if (oldTitlebar && oldTitlebar.id !== 'citizen-page-header') {
			if (data.toc) {
				const tocDropdown = oldTitlebar.querySelector('.vector-page-titlebar-toc, .vector-toc');
				if (tocDropdown) document.body.appendChild(tocDropdown);
			}
			oldTitlebar.replaceWith(wrapper);
		} else {
			const main = document.querySelector('main');
			if (main) main.prepend(wrapper);
		}
	}

	function buildStickyHeader(data) {
		if (document.getElementById('citizen-sticky-header')) return;
		if (isEditorPage()) return;
		if (mw.config.get('wgIsMainPage') === true && mw.config.get('wgAction') === 'view') return;
		if (mw.config.get('wgNamespaceNumber') === -1) return;

		const title = (data.firstHeading.replace(/<[^>]*>/g, '').trim()) || mw.config.get('wgTitle', '');
		const tagline = data.siteSub ? data.siteSub.replace(/<[^>]*>/g, '').trim() : '';

		const caMap = {}; 
		const collect = (html) => {
			if (!html) return;
			const t = document.createElement('template');
			t.innerHTML = html;
			t.content.querySelectorAll('a').forEach(a => {
				const li = a.closest('li[id]');
				if (!li) return;
				const m = li.id.match(/^ca-(\S+)$/);
				if (!m) return;
				caMap[m[1]] = { text: a.textContent.trim(), href: a.getAttribute('href') };
				if (/^nstab-/.test(m[1]) && !li.classList.contains('selected')) caMap.subject = caMap[m[1]];
			});
		};
		collect(data.views);
		collect(data.associatedPages);
		collect(data.cactions);
		collect(data.tb);

		const btn = (idSuffix, icon, label, targetSel) => {
			const sel = String(targetSel).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
			return `<button class="cdx-button cdx-button--weight-quiet cdx-button--action-default cdx-button--size-large cdx-button--icon-only" id="${idSuffix}-sticky-header" tabindex="-1" data-mw-citizen-click-target="${sel}" title="${label}"><span class="citizen-ui-icon ${icon}"></span><span></span></button>`;
		};

		const actionButtons = [
			isShareable() ? btn('citizen-share', 'mw-ui-icon-wikimedia-share', '分享此页面', '#citizen-share') : '',
			data.addTopic        ? btn('ca-addsection',  'mw-ui-icon-wikimedia-speechBubbleAdd',    '新增話題', '#ca-addsection') : '',
			caMap['subject']     ? btn('ca-subject',     'mw-ui-icon-arrowPrevious mw-ui-icon-wikimedia-arrowPrevious', '条目页', '[id^="ca-nstab-"]:not(.selected) > a') : '',
			caMap['history']     ? btn('ca-history',     'mw-ui-icon-wikimedia-history',            '历史',   '#ca-history > a') : '',
			caMap['edit']        ? btn('ca-edit',        'mw-ui-icon-wikimedia-wikiText',           '编辑',   '#ca-edit > a') : '',
			(!caMap['edit'] && caMap['ve-edit']) ? btn('ca-ve-edit', 'mw-ui-icon-wikimedia-edit', '可视化编辑', '#ca-ve-edit > a') : '',
			caMap['viewsource']  ? btn('ca-viewsource',  'mw-ui-icon-wikimedia-editLock',           '查看源代码', '#ca-viewsource > a') : '',
			caMap['talk']        ? btn('ca-talk',        'mw-ui-icon-wikimedia-speechBubbles',                '讨论页', '#ca-talk > a') : '',
		].filter(Boolean).join('');

		const sticky = document.createElement('div');
		sticky.id = 'citizen-sticky-header';
		sticky.className = 'citizen-sticky-header';
		sticky.innerHTML = `
			<div class="citizen-sticky-header-background"></div>
			<div class="citizen-sticky-header-inner">
				<div class="citizen-sticky-header-start">
					<a href="#top" title="返回顶部" class="citizen-sticky-header-backtotop cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--size-large cdx-button--weight-quiet" tabindex="-1" aria-hidden="true">
						<div class="citizen-ui-icon mw-ui-icon-wikimedia-arrowUp"></div>
						<div class="citizen-sticky-header-page-info">
							<div class="citizen-sticky-header-page-title"><span class="mw-page-title-main">${escapeHtml(title)}</span></div>
							<div class="citizen-sticky-header-page-tagline">${escapeHtml(tagline)}</div>
						</div>
					</a>
				</div>
				<div class="citizen-sticky-header-end" aria-hidden="true">
					${actionButtons}
					<div id="citizen-sticky-header-languages" class="citizen-sticky-header-dropdown-container">
						<div class="citizen-page-languages citizen-page-actions__item citizen-dropdown">
							<details class="citizen-dropdown-details">
								<summary class="citizen-dropdown-summary cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--weight-quiet cdx-button--icon-only cdx-button--size-large" title="更多语言" data-counter-text="0" tabindex="-1">
									<span class="citizen-ui-icon mw-ui-icon-wikimedia-language"></span><span>更多语言</span>
								</summary>
							</details>
							<div class="citizen-menu__card"><div class="citizen-menu__card-content"></div></div>
						</div>
					</div>
					<div id="citizen-sticky-header-variants" class="citizen-sticky-header-dropdown-container">
						<div class="citizen-page-variants citizen-page-actions__item citizen-dropdown">
							<details class="citizen-dropdown-details">
								<summary class="citizen-dropdown-summary cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--weight-quiet cdx-button--icon-only cdx-button--size-large" title="语言变体" data-counter-text="0" tabindex="-1">
									<span class="citizen-ui-icon mw-ui-icon-wikimedia-conversion"></span><span>语言变体</span>
								</summary>
							</details>
							<div class="citizen-menu__card"><div class="citizen-menu__card-content"></div></div>
						</div>
					</div>
					<div id="citizen-sticky-header-more" class="citizen-sticky-header-dropdown-container">
						<div class="citizen-page-actions-more citizen-page-actions__item citizen-dropdown">
							<details class="citizen-dropdown-details">
								<summary class="citizen-dropdown-summary cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--weight-quiet cdx-button--icon-only cdx-button--size-large" title="更多操作" tabindex="-1">
									<span class="citizen-ui-icon mw-ui-icon-wikimedia-ellipsis"></span><span>更多操作</span>
								</summary>
							</details>
							<div class="citizen-menu__card"><div class="citizen-menu__card-content"></div></div>
						</div>
					</div>
				</div>
			</div>
		`;

		const container = document.createElement('div');
		container.className = 'citizen-sticky-header-container';
		container.appendChild(sticky);

		document.body.appendChild(container);

		sticky.addEventListener('click', (e) => {
			const b = e.target.closest('[data-mw-citizen-click-target]');
			if (!b) return;
			const sel = b.getAttribute('data-mw-citizen-click-target');
			const target = document.querySelector(sel);
			if (!target) return;
			e.preventDefault();
			if (typeof target.click === 'function') target.click();
			else if (target.href) location.href = target.href;
		});

		document.addEventListener('click', (e) => {
			const s = e.target.closest('#citizen-share');
			if (!s) return;
			e.preventDefault();
			if (navigator.share) navigator.share({ title: document.title, url: location.href }).catch(() => {});
			else if (navigator.clipboard) navigator.clipboard.writeText(location.href);
		});

		const langCard = sticky.querySelector('#citizen-sticky-header-languages .citizen-menu__card-content');
		if (langCard && data.languages) {
			langCard.appendChild(makeLinkPortlet('p-langs', '其他语言', '其他语言', data.languages));
			const langCnt = langCard.querySelectorAll('li.mw-list-item').length;
			const langWrap = sticky.querySelector('#citizen-sticky-header-languages');
			const langSum = langWrap ? langWrap.querySelector('summary[data-counter-text]') : null;
			if (langSum && langCnt > 0) langSum.setAttribute('data-counter-text', String(langCnt));
		}
		const varCard = sticky.querySelector('#citizen-sticky-header-variants .citizen-menu__card-content');
		if (varCard && data.variants) {
			varCard.appendChild(makeLinkPortlet('p-variants', '语言变体', '语言变体', data.variants));
			const varCnt = varCard.querySelectorAll('li.mw-list-item').length;
			const varWrap = sticky.querySelector('#citizen-sticky-header-variants');
			const varSum = varWrap ? varWrap.querySelector('summary[data-counter-text]') : null;
			if (varSum && varCnt > 0) varSum.setAttribute('data-counter-text', String(varCnt));
		}
		const moreCard = sticky.querySelector('#citizen-sticky-header-more .citizen-menu__card-content');
		if (moreCard) moreCard.appendChild(buildMoreCardContent(data));

		if (!document.getElementById('citizen-page-header-sticky-sentinel')) {
			const ph = document.getElementById('citizen-page-header');
			const sentinel = document.createElement('div');
			sentinel.id = 'citizen-page-header-sticky-sentinel';
			if (ph && ph.parentNode) ph.insertAdjacentElement('afterend', sentinel);
			else document.body.prepend(sentinel);
		}

		const BODY_VISIBLE = 'citizen-sticky-header-visible';
		const setVisible = (v) => {
			document.body.classList.toggle(BODY_VISIBLE, v);
			if (!v && document.body.classList.contains('cv-sidebar-collapsed')) {
				const det = document.querySelector('#citizen-toc .citizen-dropdown-details');
				if (det && det.open) det.open = false;
			}
			const h = sticky.getBoundingClientRect().height;
			if (h) document.documentElement.style.setProperty('--height-sticky-header', h + 'px');
		};
		let lastY = 0;
		let ticking = false;
		const onScroll = () => {
			const y = window.scrollY || document.documentElement.scrollTop;
			if (y > 80 && y > lastY) {
				setVisible(true);
			} else if (y < 40) {
				setVisible(false);
			}
			lastY = y;
			ticking = false;
		};
		window.addEventListener('scroll', () => {
			if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
		}, { passive: true });

		const cvAutoHideMQ = window.matchMedia('(max-width: 1119.98px)');
		const DIR_DOWN = 'citizen-scroll--down';
		const DIR_UP = 'citizen-scroll--up';
		let dirAnchorY = 0;
		let dirTicking = false;
		const onScrollDir = () => {
			const y = window.scrollY || document.documentElement.scrollTop;
			if (cvAutoHideMQ.matches) {
				const d = y - dirAnchorY;
				if (d > 8) {
					document.body.classList.add(DIR_DOWN);
					document.body.classList.remove(DIR_UP);
					dirAnchorY = y;
				} else if (d < -8 || y <= 0) {
					document.body.classList.remove(DIR_DOWN);
					document.body.classList.add(DIR_UP);
					dirAnchorY = y;
				}
			} else if (document.body.classList.contains(DIR_DOWN) || document.body.classList.contains(DIR_UP)) {
				document.body.classList.remove(DIR_DOWN, DIR_UP);
				dirAnchorY = y;
			}
			dirTicking = false;
		};
		window.addEventListener('scroll', () => {
			if (!dirTicking) { requestAnimationFrame(onScrollDir); dirTicking = true; }
		}, { passive: true });
	}


	function fillTocAsync(contents) {
		if (!contents) return;
		let tries = 0;
		const tryFill = () => {
			const src = document.querySelector('#vector-toc #mw-panel-toc-list, #mw-panel-toc-list.vector-toc-contents');
			if (src && src.querySelector('.vector-toc-list-item')) {
				const clone = src.cloneNode(true);
				contents.appendChild(clone);
				convertTocToCitizen(clone);
				contents.addEventListener('click', (e) => {
					const btn = e.target.closest('.citizen-toc-toggle');
					if (!btn) return;
					const li = btn.closest('.citizen-toc-list-item');
					if (!li) return;
					const expanded = li.classList.toggle('citizen-toc-list-item--expanded');
					btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
				});
				setupTocScrollSpy(contents);
				document.body.classList.add('citizen-toc-enabled');
				cleanupVectorToc();
				return;
			}
			if (++tries <= 60) setTimeout(tryFill, 100); 
			else cleanupVectorToc(); 
		};
		tryFill();
	}

	function cleanupVectorToc() {
		document.querySelectorAll('.vector-toc-landmark, .mw-table-of-contents-container, .vector-column-start, .vector-toc, .vector-page-titlebar, .vector-page-titlebar-toc, .vector-unpinned-container').forEach(el => el.remove());
	}

	function cvhEl(tag, cls, html) {
		var el = document.createElement(tag);
		if (cls) el.className = cls;
		if (html != null) el.innerHTML = html;
		return el;
	}

	function cvhSanitize(node) {
		if (node.nodeType === 1) node.removeAttribute('id');
		node.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
		node.querySelectorAll('.mw-editsection, .editsection, style, .mw-empty-elt').forEach(function (el) { el.remove(); });
		node.querySelectorAll('.nomobile, .mobileonly').forEach(function (el) {
			el.classList.remove('nomobile');
			el.classList.remove('mobileonly');
		});
		return node;
	}

	function cvhHeading(block) {
		var h = block.querySelector('h2, h3');
		if (!h) return '';
		var t = h.cloneNode(true);
		t.querySelectorAll('.mw-editsection, .editsection').forEach(function (el) { el.remove(); });
		return (t.textContent || '').replace(/\s+/g, ' ').trim();
	}

	function cvhBodyHtml(block) {
		var c = cvhSanitize(block.cloneNode(true));
		var h = c.querySelector('h2, h3');
		if (h) h.remove();
		c.querySelectorAll('.mp-2012-block-nav-footer').forEach(function (el) { el.remove(); });
		return c.innerHTML.trim();
	}

	function cvhImageBody(block) {
		var box = cvhEl('div', 'featured-image__media');
		var img = block.querySelector('ul.gallery img, .thumb img, img');
		if (img) {
			var im = img.cloneNode(true);
			im.removeAttribute('style');
			im.removeAttribute('width');
			im.removeAttribute('height');
			box.appendChild(im);
		}
		var text = block.querySelector('.gallerytext');
		if (text) {
			var cap = cvhEl('p', 't-card__caption');
			cap.innerHTML = text.innerHTML;
			cvhSanitize(cap);
			box.appendChild(cap);
		}
		return box;
	}

	function cvhFoot(block) {
		var f = block.querySelector('.mp-2012-block-nav-footer');
		if (!f) return null;
		var ul = f.querySelector('ul');
		if (!ul) return null;
		var foot = cvhEl('div', 't-card__foot');
		foot.appendChild(cvhSanitize(ul.cloneNode(true)));
		return foot;
	}

	function cvhCard(opts) {
		var card = cvhEl(opts.tag || 'article',
			't-card' + (opts.cls ? ' ' + opts.cls : '') + (opts.link ? ' t-card--link' : ''));
		if (opts.kicker) card.appendChild(cvhEl('div', 't-card__kicker', escapeHtml(opts.kicker)));
		var content = cvhEl('div', 't-card__content');
		if (opts.body || opts.bodyNode) {
			var body = cvhEl('div', 't-card__body');
			if (opts.bodyNode) body.appendChild(opts.bodyNode);
			else body.innerHTML = opts.body;
			content.appendChild(body);
		}
		if (opts.foot) content.appendChild(opts.foot);
		card.appendChild(content);
		return card;
	}

	function cvhTrendingList(block) {
		var list = cvhEl('ul', 'trending-list');
		block.querySelectorAll('ul > li').forEach(function (li, i) {
			var row = cvhEl('li');
			row.appendChild(cvhEl('span', 'trending-rank', String(i + 1)));
			var a = li.querySelector('a');
			row.appendChild(a ? a.cloneNode(true) : cvhEl('span', null, (li.textContent || '').trim()));
			list.appendChild(row);
		});
		return list;
	}

	function cvhCountUp(el, target) {
		var start = 0;
		function frame(now) {
			if (!frame.t0) frame.t0 = now;
			var t = Math.min(1, (now - frame.t0) / 900);
			var eased = 1 - Math.pow(1 - t, 3);
			el.textContent = Math.round(target * eased).toLocaleString('zh-Hans-CN');
			if (t < 1) requestAnimationFrame(frame);
		}
		requestAnimationFrame(frame);
	}

	function cvhFillHeroStats() {
		var vals = document.querySelectorAll('.cv-home [data-cvh-stat]');
		if (!vals.length) return;
		fetch(wikiApi() + '?action=query&meta=siteinfo&siprop=statistics&format=json')
			.then(function (r) { return r.json(); })
			.then(function (j) {
				var st = j && j.query && j.query.statistics;
				if (!st) return;
				vals.forEach(function (el) {
					var v = st[el.getAttribute('data-cvh-stat')];
					if (v != null) cvhCountUp(el, Number(v));
				});
			})
			.catch(function () {  });
	}

	function initMainPageHomepage() {
		if (!isHomePage()) return;
		var src = document.getElementById('mp-2012');
		if (!src || !src.parentNode) return;
		var host = src.parentNode;
		if (host.querySelector('.cv-home')) return;   

		var get = function (sel) { return src.querySelector(sel); };
		var wrap = cvhEl('div', 'cv-home');

		var hero = cvhEl('div', 'home-hero');
		var heroContent = cvhEl('div', 'home-hero__content');

		var heroTitle = cvhEl('h2', 'home-hero__title');
		var wordmark = cvhEl('img', 'home-hero__wordmark');
		wordmark.src = 'https://zh.wikipedia.org/static/images/mobile/copyright/wikipedia-wordmark-zh.svg';
		wordmark.alt = '维基百科';
		heroTitle.appendChild(wordmark);
		heroContent.appendChild(heroTitle);

		var sloganEl = get('#mp-2012-banner-title p');
		var slogan = '';
		if (sloganEl) {
			Array.prototype.some.call(sloganEl.childNodes, function (n) {
				if (n.nodeType === 1 && n.tagName === 'BR') return true;
				slogan += n.textContent || '';
				return false;
			});
		}
		var lead = cvhEl('p', 'home-hero__lead');
		lead.textContent = (slogan.replace(/\s+/g, ' ').trim()) || '海納百川，有容乃大';
		heroContent.appendChild(lead);
		hero.appendChild(heroContent);

		var introTable = get('#mp-2012-banner-intro table');
		if (introTable) {
			var tabs = cvhEl('div', 'home-hero__tabs');
			introTable.querySelectorAll('a').forEach(function (a) {
				tabs.appendChild(cvhSanitize(a.cloneNode(true)));
			});
			if (tabs.children.length) hero.appendChild(tabs);
		}

		var heroBand = cvhEl('section', 'home-band');
		heroBand.appendChild(hero);
		wrap.appendChild(heroBand);


		host.classList.add('cv-home-active');
		host.insertBefore(wrap, src);

		cvhFillHeroStats();

		try { initMainPageBlocks(); } catch (e) { console.error('[citizen-vector] homepage blocks error:', e); }
	}

	var CVB_DROP_CLASS = ('mw-halign-left mw-halign-right mw-halign-none mw-image-border ' +
		'mw-file-description mw-file-element knoblock mp-2012-text hlist plainlinks ' +
		'nomobile mobileonly center noviewer gallery mw-gallery-packed-hover mw-gallery-packed ' +
		'gallerybox gallerytext gallerytextwrapper thumb thumbinner notheme ' +
		'mw-ui-button mw-ui-progressive').split(' ');
	var CVB_RENAME_CLASS = {
		'mw-halign-left': 'cvb-fig--left',
		'mw-halign-right': 'cvb-fig--right',
		'otd-year': 'cvb-year',
		'event': 'cvb-event',
		'column-feature-more-header': 'cvb-more-header'
	};

	function cvbClean(node) {
		var tipsHeader = node.querySelector('#mp-2012-column-tips-header');
		if (tipsHeader) { tipsHeader.removeAttribute('id'); tipsHeader.classList.add('cvb-tips-header'); }

		node.querySelectorAll('script, .mw-editsection, .editsection, .mw-empty-elt').forEach(function (el) { el.remove(); });
		if (node.id && /^(mp-2012|column-)/.test(node.id)) node.removeAttribute('id');
		node.querySelectorAll('[id]').forEach(function (el) {
			if (/^(mp-2012|column-)/.test(el.id)) el.removeAttribute('id');
		});
		node.querySelectorAll('figcaption').forEach(function (cap) {
			if (!cap.children.length && !(cap.textContent || '').trim()) cap.remove();
		});

		var all = [node].concat(Array.prototype.slice.call(node.querySelectorAll('*')));
		all.forEach(function (el) {
			var has = typeof el.className === 'string' ? el.className.split(/\s+/) : [];
			var keep = [];
			has.forEach(function (c) {
				if (!c) return;
				if (CVB_RENAME_CLASS[c]) { keep.push(CVB_RENAME_CLASS[c]); return; }
				if (CVB_DROP_CLASS.indexOf(c) >= 0) return;
				keep.push(c);
			});
			if (keep.length) el.className = keep.join(' ');
			else el.removeAttribute('class');
		});

		node.querySelectorAll('span').forEach(function (sp) {
			if (!sp.parentNode || sp.attributes.length) return;
			while (sp.firstChild) sp.parentNode.insertBefore(sp.firstChild, sp);
			sp.remove();
		});
		return node;
	}

	function cvbFeaturedCard(block) {
		var card = cvhEl('article', 'cvb-card cvb-card--pic');
		var feat = cvhEl('div', 'cvb-feat');

		var img = block.querySelector('img');
		if (img) {
			var link = block.querySelector('a.mw-file-description') || block.querySelector('a');
			var a = cvhEl('a', 'cvb-feat__link');
			if (link && link.getAttribute('href')) a.setAttribute('href', link.getAttribute('href'));
			a.appendChild(img);
			var media = cvhEl('div', 'cvb-feat__media');
			media.appendChild(a);
			feat.appendChild(cvbClean(media));
		}

		var body = cvhEl('div', 'cvb-feat__body');
		var h = block.querySelector('h2');
		if (h) {
			var t = h.cloneNode(true);
			t.querySelectorAll('.mw-editsection, .editsection, .mw-empty-elt').forEach(function (el) { el.remove(); });
			var title = cvhEl('h2', 'cvb-feat__title');
			title.textContent = (t.textContent || '').replace(/\s+/g, ' ').trim();
			body.appendChild(title);
		}
		var cap = block.querySelector('.gallerytext') || block.querySelector('.gallerytextwrapper');
		if (cap) {
			var tag = cvhEl('div', 'cvb-feat__tag');
			while (cap.firstChild) tag.appendChild(cap.firstChild);
			tag.querySelectorAll('a').forEach(function (a) {
				while (a.firstChild) a.parentNode.insertBefore(a.firstChild, a);
				a.parentNode.removeChild(a);
			});
			body.appendChild(cvbClean(tag));
		}
		feat.appendChild(body);
		card.appendChild(feat);
		return card;
	}

	function cvbJoinCard(block, tipsBlock) {
		var card = cvhEl('article', 'cvb-card cvb-card--join');

		var h = block.querySelector('h2');
		if (h) {
			var t = h.cloneNode(true);
			t.querySelectorAll('.mw-editsection, .editsection, .mw-empty-elt').forEach(function (el) { el.remove(); });
			var title = cvhEl('h2', 'cvb-card__title');
			title.textContent = (t.textContent || '').replace(/\s+/g, ' ').trim();
			card.appendChild(title);
		}

		block.querySelectorAll('.mp-2012-block-nav-footer').forEach(function (el) { el.remove(); });

		var bodyBox = cvhEl('div', 'cvb-card__body cvb-card__body--feature');
		Array.prototype.forEach.call(block.children, function (el) {
			if (el.tagName === 'H2') return;
			cvbButtons(el);
			var node = cvbClean(el);
			if (node.tagName === 'DIV' && !node.className) {
				while (node.firstChild) bodyBox.appendChild(node.firstChild);
			} else {
				bodyBox.appendChild(node);
			}
		});
		bodyBox.querySelectorAll('figure').forEach(function (f) { f.remove(); });

		var tip = tipsBlock && tipsBlock.querySelector('p');
		if (tip) {
			var tipP = cvbClean(tip);
			var lead = tipP.querySelector('.cvb-tips-header');
			if (lead) {
				var after = lead.nextSibling;
				lead.remove();
				if (after && after.nodeType === 3) after.textContent = after.textContent.replace(/^\s*[：:]\s*/, '');
			}
			if ((tipP.textContent || '').trim()) {
				var cta = bodyBox.querySelector('.cvb-card__cta');
				bodyBox.insertBefore(tipP, cta ? cta.parentNode : null);
			}
		}

		card.appendChild(bodyBox);
		return card;
	}

	function cvbButtons(root) {
		var btn = root.querySelector('span.mw-ui-button');
		if (!btn) return;
		var a = btn.closest('a');
		var wrap = (a && a.closest('.plainlinks')) || a || btn;
		if (!wrap.parentNode) return;
		var cta = cvhEl('div', 'cvb-card__cta');
		var link = cvhEl('a', 'cdx-button cdx-button--fake-button cdx-button--fake-button--enabled ' +
			'cdx-button--action-progressive cdx-button--weight-primary cdx-button--size-large');
		link.textContent = (btn.textContent || '').trim();
		var href = a && a.getAttribute('href');
		if (href) link.setAttribute('href', href);
		cta.appendChild(link);
		wrap.parentNode.replaceChild(cta, wrap);
	}

	var SISTERS_ICONS = {
		'zh.wiktionary.org': 'https://zh.wiktionary.org/static/images/icons/wiktionary.svg',
		'zh.wikisource.org': 'https://zh.wikisource.org/static/images/icons/wikisource.svg',
		'zh.wikiquote.org': 'https://zh.wikiquote.org/static/images/icons/wikiquote.svg',
		'zh.wikibooks.org': 'https://zh.wikibooks.org/static/images/icons/wikibooks.svg',
		'species.wikimedia.org': 'https://species.wikimedia.org/static/images/icons/specieswiki.svg',
		'zh.wikivoyage.org': 'https://zh.wikivoyage.org/static/images/icons/wikivoyage.svg',
		'zh.wikiversity.org': 'https://zh.wikiversity.org/static/images/icons/wikiversity.svg',
		'www.wikifunctions.org': 'https://www.wikifunctions.org/static/images/icons/wikifunctionswiki.svg',
		'commons.wikimedia.org': 'https://commons.wikimedia.org/static/images/icons/commonswiki.svg',
		'www.wikidata.org': 'https://www.wikidata.org/static/images/icons/wikidatawiki.svg',
		'www.mediawiki.org': 'https://www.mediawiki.org/static/images/icons/mediawikiwiki.svg',
		'meta.wikimedia.org': 'https://meta.wikimedia.org/static/images/icons/metawiki.svg'
	};

	function cvbNormalizeIcon(img, url) {
		fetch(url, { credentials: 'omit' }).then(function (res) {
			return res.ok ? res.text() : Promise.reject(new Error('HTTP ' + res.status));
		}).then(function (svg) {
			if (!/<svg[^>]*\sviewBox\s*=/i.test(svg)) {
				var w = svg.match(/<svg[^>]*\swidth\s*=\s*["']([\d.]+)/i);
				var h = svg.match(/<svg[^>]*\sheight\s*=\s*["']([\d.]+)/i);
				if (!w || !h) return;
				svg = svg.replace(/<svg/i, '<svg viewBox="0 0 ' + w[1] + ' ' + h[1] + '"');
			}
			img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
		}).catch(function () {  });
	}

	function cvbSistersBlock(block) {
		var table = block.querySelector('table');
		if (!table) return;

		var grid = cvhEl('div', 'cvb-sisters__grid');
		Array.prototype.forEach.call(table.querySelectorAll('tr'), function (tr) {
			var cells = tr.children;
			for (var i = 0; i + 1 < cells.length; i += 2) {
				var nameLink = cells[i + 1].querySelector('a[href]');
				if (!nameLink) continue;
				var href = nameLink.getAttribute('href');

				var item = cvhEl('a', 'cvb-sisters__item');
				item.setAttribute('href', href);

				var icon = cells[i].querySelector('img');
				if (icon) {
					var img = cvhEl('img', 'cvb-sisters__icon');
					var host = '';
					try { host = new URL(href, location.href).hostname; } catch (e) { host = ''; }
					var iconUrl = SISTERS_ICONS[host];
					if (iconUrl) {
						img.setAttribute('src', iconUrl);
						cvbNormalizeIcon(img, iconUrl);
					} else {
						img.setAttribute('src', icon.getAttribute('src') || icon.src);
					}
					img.setAttribute('alt', icon.getAttribute('alt') || '');
					img.setAttribute('decoding', 'async');
					item.appendChild(img);
				}

				var label = cvhEl('span', 'cvb-sisters__label');
				var name = cvhEl('span', 'cvb-sisters__name');
				name.textContent = (nameLink.textContent || '').trim();
				label.appendChild(name);

				var desc = cells[i + 1].querySelector('span');
				if (desc && (desc.textContent || '').trim()) {
					var small = cvhEl('span', 'cvb-sisters__desc');
					small.textContent = (desc.textContent || '').trim();
					label.appendChild(small);
				}
				item.appendChild(label);
				grid.appendChild(item);
			}
		});

		if (!grid.children.length) return;
		table.remove();
		block.appendChild(grid);
	}

	function initMainPageBlocks() {
		var src = document.getElementById('mp-2012');
		if (!src || !src.parentNode) return;
		var bodyEl = src.querySelector('#mp-2012-body');
		if (!bodyEl || !bodyEl.parentNode) return;

		src.parentNode.querySelectorAll('style').forEach(function (s) {
			if (!/mp-2012|column-(feature|dyk|good|itn|otd|uptrends|participate|tips)/.test(s.textContent || '')) return;
			var p = s.parentNode;
			s.remove();
			if (p && !p.children.length && !(p.textContent || '').trim()) p.remove();
		});

		var MASONRY = [
			['mp-2012-column-feature-block', 'feature'],
			['mp-2012-column-dyk-block', 'list'],
			['mp-2012-column-good-block', 'feature'],
			['mp-2012-column-featurepic-block', 'pic'],
			['mp-2012-column-itn-block', 'list'],
			['mp-2012-column-otd-block', 'events'],
			['mp-2012-column-uptrends-block', 'tags'],
			['mp-2012-column-participate-block', 'join']
		];

		var masonry = cvhEl('div', 'cv-home cvb-masonry');
		var cols = [cvhEl('div', 'cvb-col'), cvhEl('div', 'cvb-col')];

		MASONRY.forEach(function (spec, i) {
			var block = src.querySelector('#' + spec[0]);
			if (!block) return;
			var kind = spec[1];
			var col = cols[i < 4 ? 0 : 1];

			if (kind === 'pic') { col.appendChild(cvbFeaturedCard(block)); return; }

			if (kind === 'join') {
				col.appendChild(cvbJoinCard(block, src.querySelector('#mp-2012-column-tips-block')));
				return;
			}

			var card = cvhEl('article', 'cvb-card cvb-card--' + kind);

			var h = block.querySelector('h2');
			if (h) {
				var t = h.cloneNode(true);
				t.querySelectorAll('.mw-editsection, .editsection, .mw-empty-elt').forEach(function (el) { el.remove(); });
				var title = cvhEl('h2', 'cvb-card__title');
				title.textContent = (t.textContent || '').replace(/\s+/g, ' ').trim();
				card.appendChild(title);
			}

			block.querySelectorAll('.mp-2012-block-nav-footer').forEach(function (el) { el.remove(); });

			var parts = [], more = [];
			Array.prototype.forEach.call(block.children, function (ch) {
				if (ch.tagName === 'H2') return;
				if (ch.id === 'column-feature-more') { more.push(ch); return; }
				parts.push(ch);
			});

			var bodyBox = cvhEl('div', 'cvb-card__body cvb-card__body--' + kind);
			parts.forEach(function (el) {
				cvbButtons(el);
				var node = cvbClean(el);
				if (node.tagName === 'DIV' && !node.className) {
					while (node.firstChild) bodyBox.appendChild(node.firstChild);
				} else {
					bodyBox.appendChild(node);
				}
			});
			card.appendChild(bodyBox);

			more.forEach(function (m) {
				var ul = m.querySelector('ul');
				if (!ul) return;
				var box = cvhEl('div', 'cvb-card__more');
				box.appendChild(cvbClean(ul));
				card.appendChild(box);
			});

			col.appendChild(card);
		});

		masonry.appendChild(cols[0]);
		masonry.appendChild(cols[1]);

		var leftCol = bodyEl.querySelector('#mp-2012-column-left');
		var rightCol = bodyEl.querySelector('#mp-2012-column-right');
		bodyEl.insertBefore(masonry, leftCol || rightCol || bodyEl.firstChild);
		if (leftCol) leftCol.remove();
		if (rightCol) rightCol.remove();

		var sisters = src.querySelector('#mp-2012-sisters');
		if (sisters) cvbSistersBlock(sisters);
	}

	function cleanupVectorScaffolding() {
		document.querySelectorAll('.mw-content-container').forEach(mwc => {
			while (mwc.firstChild) mwc.parentNode.insertBefore(mwc.firstChild, mwc);
			mwc.remove();
		});
		document.querySelectorAll('.vector-body-before-content').forEach(vbb => {
			const ss = vbb.querySelector('#siteSub');
			if (ss) vbb.parentNode.insertBefore(ss, vbb);
			const cs = vbb.querySelector('#contentSub');
			if (cs) vbb.parentNode.insertBefore(cs, vbb);
			vbb.remove();
		});
		document.querySelectorAll('.vector-settings, #p-dock-bottom').forEach(el => el.remove());
		const jump = document.querySelector('.mw-jump-link');
		if (jump && jump.parentElement !== document.body) document.body.appendChild(jump);
		document.querySelectorAll('#mw-teleport-target').forEach(tt => {
			tt.classList.remove('vector-body');
			if (tt.parentElement !== document.body) document.body.appendChild(tt);
		});
	}

	function convertTocToCitizen(ul) {
		const prelude = ul.querySelector('#toc-mw-content-text');
		if (prelude) prelude.remove();

		ul.classList.remove('vector-toc-contents');
		ul.classList.add('citizen-toc-list');
		ul.removeAttribute('id'); 

		ul.querySelectorAll('li.vector-toc-list-item').forEach(li => {
			li.classList.remove('vector-toc-list-item');
			li.classList.add('citizen-toc-list-item');
			Array.from(li.classList).forEach(c => {
				if (c.startsWith('vector-toc-level-')) {
					li.classList.remove(c);
					li.classList.add('citizen-toc-level-' + c.slice('vector-toc-level-'.length));
				} else if (c === 'vector-toc-list-item-expanded') {
					li.classList.remove(c);
					li.classList.add('citizen-toc-list-item--expanded');
				}
			});

			const a = li.querySelector(':scope > a.vector-toc-link');
			if (a) {
				a.classList.remove('vector-toc-link');
				a.classList.add('citizen-toc-link', 'cdx-button', 'cdx-button--fake-button', 'cdx-button--fake-button--enabled', 'cdx-button--weight-quiet');
				a.setAttribute('role', 'button');
				const text = a.querySelector(':scope > .vector-toc-text');
				if (text) {
					text.classList.remove('vector-toc-text');
					text.classList.add('citizen-toc-text');
					const numb = text.querySelector(':scope > .vector-toc-numb');
					if (numb) {
						numb.classList.remove('vector-toc-numb');
						numb.classList.add('citizen-toc-numb');
					}
					text.querySelectorAll(':scope > span:not(.citizen-toc-numb)').forEach(s => s.classList.add('citizen-toc-heading'));
				}
			}

			const btn = li.querySelector(':scope > button.vector-toc-toggle');
			if (btn) {
				btn.classList.remove('vector-toc-toggle');
				btn.classList.add('citizen-toc-toggle', 'cdx-button', 'cdx-button--weight-quiet', 'cdx-button--icon-only', 'cdx-button--size-medium');
				btn.setAttribute('aria-expanded', 'false');
				const icon = btn.querySelector('.vector-icon');
				if (icon) {
					icon.classList.remove('vector-icon', 'vector-icon--x-small', 'mw-ui-icon-wikimedia-expand');
					icon.classList.add('citizen-ui-icon', 'mw-ui-icon-wikimedia-collapse');
				} else {
					btn.insertAdjacentHTML('afterbegin', '<span class="citizen-ui-icon mw-ui-icon-wikimedia-collapse"></span>');
				}
			}

			const sl = li.querySelector(':scope > ul.vector-toc-list');
			if (sl) {
				sl.classList.remove('vector-toc-list');
				sl.classList.add('citizen-toc-list');
				li.classList.add('citizen-toc-list-item--expanded');
				const btn2 = li.querySelector(':scope > .citizen-toc-toggle');
				if (btn2) btn2.setAttribute('aria-expanded', 'true');
			}
		});

		const contents = ul.closest('.citizen-toc-contents');
		if (contents && !contents.querySelector('.citizen-toc-indicator')) {
			contents.insertAdjacentHTML('afterbegin', '<div class="citizen-toc-indicator"></div>');
		}
	}

	function setupSectionHeadings() {
		const output = document.querySelector('.mw-parser-output');
		if (!output) return;

		const headings = Array.from(output.children)
			.filter(el => el.classList && el.classList.contains('mw-heading'));

		const levelOf = (el) => {
			const m = (el.className.match(/(?:^|\s)mw-heading(\d)(?:\s|$)/) || []);
			return m[1] ? parseInt(m[1], 10) : 2;
		};

		headings.forEach((heading) => {
			if (heading.querySelector(':scope > .citizen-section-toggle')) return;

			const level = levelOf(heading);
			const toggle = document.createElement('button');
			toggle.className = 'citizen-section-toggle';
			toggle.type = 'button';
			toggle.setAttribute('aria-expanded', 'true');
			toggle.setAttribute('aria-label', '折叠本节');
			toggle.innerHTML = '<span class="citizen-ui-icon mw-ui-icon-wikimedia-collapse"></span>';
			heading.appendChild(toggle);

			const contentSiblings = [];
			let sib = heading.nextElementSibling;
			while (sib) {
				if (sib.classList && sib.classList.contains('mw-heading')) {
					if (levelOf(sib) <= level) break; 
				}
				contentSiblings.push(sib);
				sib = sib.nextElementSibling;
			}

			toggle.addEventListener('click', () => {
				const collapsed = heading.classList.toggle('citizen-section--collapsed');
				toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
				contentSiblings.forEach(el => {
					el.classList.toggle('citizen-section-hidden', collapsed);
				});
			});
		});
	}

	function setupTocScrollSpy(contents) {
		if (!contents) return;
		const body = document.getElementById('bodyContent');
		const indicator = contents.querySelector('.citizen-toc-indicator');
		if (!body || !indicator) return;

		const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
		const headingSelector = ['.mw-heading', ...HEADING_TAGS.map(t => `${t}:not([id])`)]
			.map(sel => `.mw-parser-output ${sel}`).join(', ');
		const headlineSelector = ['.mw-headline', ...HEADING_TAGS.map(t => `${t}[id]`)]
			.map(sel => `.mw-parser-output ${sel}`).join(', ');

		const TOP_MARGIN = 75; 
		let sections = [];
		let activeIds = [];
		let indicatorUnitHeight = 0;
		let throttleId = null;

		const collect = () => {
			sections = Array.from(body.querySelectorAll(headingSelector)).map(h => {
				const headline = h.querySelector(headlineSelector);
				return { el: h, id: headline ? headline.id : '' };
			}).filter(s => s.id && document.getElementById('toc-' + s.id));
		};

		const getActiveLinks = (ids) => {
			let first = null, last = null;
			for (const id of ids) {
				const el = document.getElementById('toc-' + id);
				if (!el) continue;
				const link = el.querySelector('.citizen-toc-link');
				if (link && link.offsetParent !== null) {
					if (!first) first = link;
					last = link;
				}
			}
			return { first, last };
		};

		const applyIndicator = (top, height) => {
			if (top === null || top === undefined) {
				indicator.style.setProperty('--indicator-scale', '0');
				return;
			}
			if (!indicatorUnitHeight) {
				const firstLink = getActiveLinks(activeIds).first;
				indicatorUnitHeight = firstLink ? firstLink.getBoundingClientRect().height : 32;
				if (indicatorUnitHeight <= 0) indicatorUnitHeight = 32;
				indicator.style.setProperty('--indicator-unit-height', indicatorUnitHeight + 'px');
			}
			const scale = indicatorUnitHeight > 0 ? height / indicatorUnitHeight : 0;
			indicator.style.setProperty('--indicator-top', top + 'px');
			indicator.style.setProperty('--indicator-scale', String(scale));
		};

		const measureAndApply = () => {
			if (activeIds.length === 0) { applyIndicator(null, 0); return; }
			const { first, last } = getActiveLinks(activeIds);
			if (!first || !last) { applyIndicator(null, 0); return; }
			const positioningParent = indicator.offsetParent || contents;
			const containerRect = positioningParent.getBoundingClientRect();
			const firstRect = first.getBoundingClientRect();
			const lastRect = last.getBoundingClientRect();
			applyIndicator(
				firstRect.top - containerRect.top + positioningParent.scrollTop,
				lastRect.bottom - firstRect.top
			);
		};

		const changeActiveSections = (ids) => {
			const newKey = ids.slice().sort().join(',');
			const oldKey = activeIds.slice().sort().join(',');
			if (newKey === oldKey) return;
			contents.querySelectorAll('.citizen-toc-list-item--active').forEach(li => li.classList.remove('citizen-toc-list-item--active'));
			contents.querySelectorAll('.citizen-toc-level-1--active').forEach(li => li.classList.remove('citizen-toc-level-1--active'));
			activeIds = [];
			for (const id of ids) {
				const el = document.getElementById('toc-' + id);
				if (!el) continue;
				el.classList.add('citizen-toc-list-item--active');
				activeIds.push(id);
				const topSection = el.closest('.citizen-toc-level-1');
				if (topSection) {
					topSection.classList.add('citizen-toc-level-1--active', 'citizen-toc-list-item--expanded');
					const toggle = topSection.querySelector('.citizen-toc-toggle');
					if (toggle) toggle.setAttribute('aria-expanded', 'true');
				}
			}
			requestAnimationFrame(measureAndApply);
			requestAnimationFrame(scrollActiveIntoView);
		};

		const scrollActiveIntoView = () => {
			if (activeIds.length === 0) return;
			const { first } = getActiveLinks(activeIds);
			if (!first) return;
			const box = first.closest('#citizen-toc') || first.closest('.citizen-menu__card-content');
			if (!box) return;
			const boxRect = box.getBoundingClientRect();
			const itemRect = first.getBoundingClientRect();
			const pad = 8;
			const itemTop = itemRect.top - boxRect.top + box.scrollTop;
			const itemBottom = itemRect.bottom - boxRect.top + box.scrollTop;
			const viewTop = box.scrollTop;
			const viewBottom = viewTop + box.clientHeight;
			if (itemTop >= viewTop + pad && itemBottom <= viewBottom - pad) return;
			if (itemTop < viewTop + pad) {
				box.scrollTop += itemTop - (viewTop + pad);
			} else if (itemBottom > viewBottom - pad) {
				box.scrollTop += itemBottom - (viewBottom - pad);
			}
		};

		const calc = () => {
			collect();
			if (sections.length === 0) { changeActiveSections([]); return; }
			const sorted = sections.map(s => ({
				el: s.el,
				id: s.id,
				top: s.el.getBoundingClientRect().top - TOP_MARGIN
			})).sort((a, b) => a.top - b.top);

			const above = sorted.filter(s => s.top <= 0);
			const below = sorted.filter(s => s.top > 0);
			let startIdx;
			if (above.length > 0) startIdx = sorted.indexOf(above[above.length - 1]);
			else startIdx = sorted.indexOf(below[0]);

			let endIdx = startIdx;
			const innerHeight = window.innerHeight;
			for (let i = startIdx; i < sorted.length; i++) {
				if (sorted[i].top + TOP_MARGIN < innerHeight) endIdx = i;
			}
			changeActiveSections(sorted.slice(startIdx, endIdx + 1).map(s => s.id));
		};

		const handleScroll = () => {
			if (!throttleId) {
				throttleId = setTimeout(() => { throttleId = null; calc(); }, 200);
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		const handleResize = () => { indicatorUnitHeight = 0; calc(); };
		window.addEventListener('resize', handleResize);
		requestAnimationFrame(() => requestAnimationFrame(calc));
	}

	function buildPageSidebar(data) {
		const main = document.querySelector('main');
		if (!main) return;

		let container = main.querySelector(':scope > .citizen-body-container');
		if (!container) {
			container = document.createElement('div');
			container.className = 'citizen-body-container';
			Array.from(main.children)
				.filter(k => !k.classList.contains('citizen-page-header'))
				.forEach(k => container.appendChild(k));
			main.appendChild(container);
		}
		container.querySelectorAll(':scope .mw-page-container').forEach(mwpc => {
			while (mwpc.firstChild) mwpc.parentNode.insertBefore(mwpc.firstChild, mwpc);
			mwpc.remove();
		});

		let bodyContent = container.querySelector('#bodyContent');
		if (!bodyContent) {
			bodyContent = document.createElement('div');
			bodyContent.id = 'bodyContent';
			bodyContent.className = 'citizen-body';
			container.insertBefore(bodyContent, container.firstChild);
		}
		bodyContent.classList.add('citizen-body');
		bodyContent.classList.remove('vector-body', 'citizen-body-container');
		Array.from(container.children).forEach(k => {
			if (k === bodyContent) return;
			if (k.contains(bodyContent)) return;
			if (k.classList.contains('citizen-page-sidebar')) return;
			if (k.classList.contains('citizen-page-footer')) return;
			if (k.classList.contains('citizen-body-container')) return; 
			bodyContent.appendChild(k);
		});
		if (!bodyContent.querySelector(':scope > #contentSub')) {
			let cs = bodyContent.querySelector('#contentSub');
			const sub = bodyContent.querySelector(':scope > #mw-content-text');
			if (!cs) {
				cs = document.createElement('div');
				cs.id = 'contentSub';
			}
			if (sub) bodyContent.insertBefore(cs, sub);
			else bodyContent.appendChild(cs);
		}
		if (!bodyContent.querySelector('#mw-content-text')) {
			const mc = document.createElement('div');
			mc.id = 'mw-content-text';
			mc.className = 'mw-body-content';
			bodyContent.appendChild(mc);
		}

		const hasSidebarContent = !!(data.lastmod || data.toc) && !isEditorPage() && !isDiffPage() && !isUserPage() && !isTalkNamespace();

		if (mw.config.get('wgArticleId') === 0
			&& mw.config.get('wgAction') === 'view'
			&& !isSpecialPage() && !isEditorPage() && !isDiffPage() && !isUserPage() && !isTalkNamespace()) {
			document.body.classList.add('cv-sidebar-reserved');
		}

		let sidebar = container.querySelector(':scope > .citizen-page-sidebar');
		if (!hasSidebarContent) {
			if (sidebar) sidebar.remove();
		} else {
			if (!sidebar) {
				sidebar = document.createElement('div');
				sidebar.className = 'citizen-page-sidebar';
				container.appendChild(sidebar);
			}
			sidebar.innerHTML = '';
		}
		if (sidebar && data.lastmod && !isHomePage()) {
			const titleText = data.lastmod.replace(/<[^>]*>/g, '').trim();
			const m = titleText.match(/(\d{4})年(\d{1,2})月(\d{1,2})日\s*[^\d]*(\d{1,2}):(\d{2})/);
			let tsUnix = '';
			if (m) {
				const [, y, mo, d, hh, mm] = m;
				tsUnix = Math.floor(new Date(+y, +mo - 1, +d, +hh, +mm).getTime() / 1000);
			}
			sidebar.insertAdjacentHTML('beforeend', `
				<nav id="citizen-sidebar-lastmod" class="citizen-menu" aria-label="最后修改时间">
					<div class="citizen-menu__heading">最后修改时间</div>
					<div class="citizen-menu__content">
						<ul class="citizen-menu__content-list">
							<li id="lm-time" class="mw-list-item"><a data-mw="interface" id="citizen-lastmod-relative" href="/index.php?title=${encodeURIComponent(mw.config.get('wgPageName', ''))}&diff=" title="${escapeHtml(titleText)}" data-timestamp="${tsUnix}"><span class="citizen-ui-icon mw-ui-icon-history mw-ui-icon-wikimedia-history"></span><span data-relative-time="${tsUnix}"></span></a></li>
						</ul>
					</div>
				</nav>`);
		}
		if (sidebar && data.toc) {
			sidebar.insertAdjacentHTML('beforeend', `
				<div id="citizen-toc" class="citizen-toc citizen-dropdown citizen-toc--collapse-enabled">
					<details class="citizen-dropdown-details">
						<summary class="citizen-dropdown-summary" title="目录" aria-details="mw-panel-toc">
							<span class="citizen-ui-icon mw-ui-icon-wikimedia-listBullet"></span>
							<span>目录</span>
						</summary>
					</details>
					<nav id="mw-panel-toc" class="citizen-toc-card citizen-menu__card" aria-labelledby="mw-panel-toc-label">
						<div class="citizen-menu__card-content">
							<a class="citizen-toc-top citizen-toc-link cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--weight-quiet" title="返回顶部" href="#top" role="button">
								<div class="citizen-ui-icon mw-ui-icon-wikimedia-arrowUp"></div>
								<div class="citizen-toc-text">返回顶部</div>
							</a>
							<div id="mw-panel-toc-label" class="citizen-menu__heading">目录</div>
							<div class="citizen-toc-contents" id="mw-panel-toc-list"></div>
						</div>
					</nav>
				</div>`);
			fillTocAsync(sidebar.querySelector('.citizen-toc-contents'));
		}

		if (!container.querySelector(':scope > .citizen-page-footer')) {
			const pageFooter = document.createElement('footer');
			pageFooter.className = 'citizen-page-footer';
			const origCatlinks = document.querySelector('#catlinks');
			if (origCatlinks) pageFooter.appendChild(origCatlinks);
			const pageInfo = buildPageInfo(data.footerInfo, data.lastmod, cvFooterStatement(data).copyright);
			if (pageInfo) pageFooter.appendChild(pageInfo);
			container.appendChild(pageFooter);
		}
	}

	const CITIZEN_PAGE_INFO_LABELS = { lastmod: '最后修改时间', copyright: '著作权', credits: '作者' };
	const CITIZEN_COPYRIGHT_TEXT = '本站的全部文字在知识共享 署名-相同方式共享 4.0协议之条款下提供，附加条款亦可能应用。（请参阅使用条款）';
	function buildPageInfo(rawFooterInfo, rawLastmod, copyrightText) {
		let items = [];
		if (rawFooterInfo) {
			const t = document.createElement('template');
			t.innerHTML = '<ul>' + rawFooterInfo + '</ul>';
			items = Array.from(t.content.querySelectorAll('li'));
		} else if (rawLastmod) {
			const t2 = document.createElement('template');
			t2.innerHTML = rawLastmod;
			items = Array.from(t2.content.querySelectorAll('li'));
		}
		if (!items.length) return null;
		const wrap = document.createElement('div');
		wrap.className = 'page-info';
		const makeItem = (id, label, html) => {
			const section = document.createElement('section');
			section.id = id;
			section.className = 'page-info__item';
			const labelDiv = document.createElement('div');
			labelDiv.className = 'page-info__label';
			labelDiv.textContent = label;
			const textDiv = document.createElement('div');
			textDiv.className = 'page-info__text';
			textDiv.innerHTML = html;
			section.appendChild(labelDiv);
			section.appendChild(textDiv);
			return section;
		};
		items.forEach(li => {
			const name = (li.id || '').replace(/^footer-info-/, '');
			const label = CITIZEN_PAGE_INFO_LABELS[name];
			if (!label) return;
			if (name === 'lastmod' && isHomePage()) return;
			if (name === 'copyright') return;
			wrap.appendChild(makeItem(li.id, label, li.innerHTML.trim()));
			if (name === 'lastmod') {
				wrap.appendChild(makeItem('footer-info-copyright', CITIZEN_PAGE_INFO_LABELS.copyright, copyrightText || CITIZEN_COPYRIGHT_TEXT));
			}
		});
		return wrap.children.length ? wrap : null;
	}

	const CITIZEN_FOOTER_TAGLINE = 'Wikipedia®和维基百科标志是维基媒体基金会的注册商标；维基™是维基媒体基金会的商标。';
	const CV_FOOTER_PLACES_DROP = [
		'footer-places-legal-safety-contacts',
		'footer-places-statslink',
		'footer-places-mobileview'
	];
	function buildFooter(data) {
		const pageContainer = document.querySelector('.citizen-page-container');
		if (!pageContainer) return;
		pageContainer.querySelectorAll('.mw-footer-container').forEach(fc => {
			while (fc.firstChild) fc.parentNode.insertBefore(fc.firstChild, fc);
			fc.remove();
		});
		const oldFooter = pageContainer.querySelector('footer#footer') || pageContainer.querySelector('footer.mw-footer');

		const filteredIcons = data.footerIcons
			? data.footerIcons.replace(/<li[^>]*id="footer-copyrightico"[^>]*>.*?<\/li>/gi, '')
			: '';

		let filteredPlaces = data.footerPlaces || '';
		CV_FOOTER_PLACES_DROP.forEach(function (id) {
			filteredPlaces = filteredPlaces.replace(
				new RegExp('<li[^>]*id="' + id + '"[^>]*>[\\s\\S]*?</li>', 'gi'), '');
		});

		const stmt = cvFooterStatement(data);
		const footerIcon = data.siteIcon ? cvAbsUrl(data.siteIcon)
			: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg';
		const footerDesc = CV_PROJECT_DESC[cvProjectKey(location.hostname)] || data.siteTagline || '维基百科，自由的百科全书';

		const footer = document.createElement('footer');
		footer.className = 'mw-footer citizen-footer';
		footer.innerHTML = `
			<div class="citizen-footer__container">
				<section class="citizen-footer__content">
					<div class="citizen-footer__siteinfo">
						<div id="footer-sitetitle" class="citizen-footer__sitetitle mw-wiki-title">
							<img class="mw-logo-icon" src="${footerIcon}" alt="" aria-hidden="true" loading="lazy" height="48" width="48">
							<div class="mw-logo-wordmark cv-wordmark"></div>
						</div>
						<p id="footer-desc" class="citizen-footer__desc"></p>
					</div>
					<nav id="footer-places"><ul>${filteredPlaces}</ul></nav>
				</section>
				<section class="citizen-footer__bottom">
					<div id="footer-tagline"></div>
					<nav id="footer-icons" class="noprint"><ul>${filteredIcons || ''}</ul></nav>
				</section>
			</div>
		`;

		if (oldFooter) oldFooter.replaceWith(footer);
		else pageContainer.appendChild(footer);
		footer.querySelector('#footer-desc').textContent = footerDesc;
		const taglineEl = footer.querySelector('#footer-tagline');
		if (taglineEl) taglineEl.textContent = stmt.tagline;
		cvApplyWordmark(footer.querySelector('#footer-sitetitle .cv-wordmark'), data);
		buildFooterBadges(footer, data);
		cvLocalizeFooterPlaces(footer);
	}

	function cvLocalizeFooterPlaces(footer) {
		const nav = footer.querySelector('#footer-places');
		if (!nav) return;
		const CJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]/;
		const projName = CV_PROJECT_NAME[cvProjectKey(location.hostname)] || '';
		nav.querySelectorAll('li[id^="footer-places-"]').forEach(function (li) {
			const a = li.querySelector('a');
			if (!a) return;
			if (CJK.test(a.textContent)) return;
			if (li.id === 'footer-places-about') {
				if (projName) a.textContent = '关于' + projName;
			} else if (CV_FOOTER_PLACES_LABELS[li.id]) {
				a.textContent = CV_FOOTER_PLACES_LABELS[li.id];
			}
		});
	}

	function buildFooterBadges(footer, data) {
		const powered = footer.querySelector('#footer-poweredbyico');
		if (!powered) return;
		while (powered.firstChild) powered.firstChild.remove();
		const badges = [CV_BADGE_W].concat(cvLicenseBadges(data)).concat([CV_BADGE_MW]);
		badges.forEach(function (badge) {
			const a = document.createElement('a');
			a.className = 'cv-badge ' + badge.cls;
			a.href = badge.href;
			a.target = '_blank';
			a.rel = 'noopener noreferrer';
			a.title = badge.label;
			a.setAttribute('aria-label', badge.label);
			a.innerHTML = badge.svg;
			powered.appendChild(a);
		});
	}

	function wrapWikitablesInOverflow() {
		const tables = document.querySelectorAll('.mw-parser-output table.wikitable:not(.infobox)');
		tables.forEach(t => {
			if (t.parentElement && t.parentElement.classList.contains('citizen-overflow-content')) return;
			const content = document.createElement('div');
			content.className = 'citizen-overflow-content';
			const wrapper = document.createElement('div');
			wrapper.className = 'citizen-overflow-wrapper';
			t.parentNode.insertBefore(wrapper, t);
			wrapper.appendChild(content);
			content.appendChild(t);
			t.style.setProperty('margin-top', '0', 'important');
			t.style.setProperty('margin-bottom', '0', 'important');
		});
	}

	function setupFooterFloatFade() {
		const mq = window.matchMedia('(max-width: 1119.98px)');

		const floats = () => {
			if (!mq.matches) {
				document.body.classList.remove('cv-footer-float-hidden');
				return;
			}
			const toc = document.querySelector('#citizen-toc');
			const pageActions = document.querySelector('.citizen-page-actions');
			const footer = document.querySelector('.mw-footer.citizen-footer') ||
				document.querySelector('.citizen-footer') ||
				document.querySelector('.mw-footer');
			if (!footer) {
				document.body.classList.remove('cv-footer-float-hidden');
				return;
			}
			const f = footer.getBoundingClientRect();
			const overlaps = (el) => {
				if (!el) return false;
				const r = el.getBoundingClientRect();
				if (r.width < 1 || r.height < 1) return false;
				return r.bottom > f.top && r.top < f.bottom && r.right > f.left && r.left < f.right;
			};
			const hit = overlaps(toc) || overlaps(pageActions);
			document.body.classList.toggle('cv-footer-float-hidden', hit);
		};

		const onScroll = () => floats();

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		if (mq.addEventListener) mq.addEventListener('change', onScroll);   
		setInterval(floats, 250);
		floats();
	}

	function setupTocCollapse() {
		const getSidebar = () => document.querySelector('.citizen-page-sidebar');
		const getToc = () => document.querySelector('#citizen-toc');
		const STORAGE_KEY = 'cv-toc-collapsed';
		const isDesktop = () => window.matchMedia('(min-width: 1120px)').matches;
		const readPref = () => { try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { return false; } };
		const writePref = (on) => { try { localStorage.setItem(STORAGE_KEY, on ? '1' : '0'); } catch (e) {  } };

		const resetDetails = (toc) => {
			const det = toc.querySelector('.citizen-dropdown-details');
			if (det) det.open = false;                 
		};
		const ensureAir = (toc) => {
			const content = toc.querySelector('.citizen-menu__card-content');
			if (!content) return;
			const mk = () => {
				const air = document.createElement('div');
				air.className = 'cv-toc-card-air';
				air.setAttribute('aria-hidden', 'true');
				return air;
			};
			if (!content.firstElementChild || !content.firstElementChild.classList.contains('cv-toc-card-air')) {
				content.prepend(mk());
			}
			if (!content.lastElementChild || !content.lastElementChild.classList.contains('cv-toc-card-air')) {
				content.append(mk());
			}
		};
		const CDX_SUMMARY_CLASSES = ['cdx-button', 'cdx-button--fake-button',
			'cdx-button--fake-button--enabled', 'cdx-button--weight-quiet',
			'cdx-button--icon-only', 'cdx-button--size-large'];
		const dressSummary = (toc, on) => {
			const sum = toc.querySelector('.citizen-dropdown-summary');
			if (!sum) return;
			CDX_SUMMARY_CLASSES.forEach((c) => sum.classList.toggle(c, on));
		};
		const applyLayout = (on) => {
			const toc = getToc();
			const sidebar = getSidebar();
			if (!toc || !sidebar) return;
			if (on) {
				ensureAir(toc);                           
				dressSummary(toc, true);
				const start = document.querySelector('.citizen-sticky-header-start');
				if (start) start.prepend(toc);
				else document.body.appendChild(toc);
				document.body.classList.add('cv-sidebar-collapsed');
			} else {
				sidebar.appendChild(toc);                 
				dressSummary(toc, false);
				document.body.classList.remove('cv-sidebar-collapsed');
			}
			resetDetails(toc);
		};
		const collapse = () => {
			if (!isDesktop()) return;
			applyLayout(true);
			writePref(true);
		};
		const expand = () => {
			applyLayout(false);
			writePref(false);
		};

		document.addEventListener('click', (e) => {
			if (!isDesktop()) return;
			const collapsed = document.body.classList.contains('cv-sidebar-collapsed');

			const heading = e.target.closest('#citizen-toc .citizen-menu__heading');
			if (heading && heading.textContent.trim().startsWith('目录')) {
				if (collapsed) expand();
				else collapse();
				return;
			}

			if (e.target.closest('#citizen-sidebar-lastmod .citizen-menu__heading')) {
				if (!collapsed) collapse();
				return;
			}

			const summary = e.target.closest('#citizen-toc .citizen-dropdown-summary');
			if (summary) {
				if (!collapsed) collapse();
				return;
			}
		});

		window.matchMedia('(min-width: 1120px)').addEventListener('change', (e) => {
			if (e.matches) {
				if (readPref()) applyLayout(true);
			} else if (document.body.classList.contains('cv-sidebar-collapsed')) {
				applyLayout(false);
			}
		});

		if (readPref() && isDesktop()) collapse();
	}

	const PERSONAL_ICONS = {
		userTalk: 'userTalk',
		settings: 'settings',
		watchlist: 'watchlist',
		userContributions: 'userContributions',
		logOut: 'logOut'
	};

	function personalMenuHtml(userName) {
		const icon = (name) => '<span class="citizen-ui-icon mw-ui-icon-' + name + ' mw-ui-icon-wikimedia-' + name + '"></span>';
		const getUrl = (page) => wikiUrl(page);
		const items = [
			{ id: 'pt-mytalk', cls: 'new mw-list-item', icon: 'userTalk', text: '讨论',
				href: getUrl('User_talk:' + userName), title: '您的讨论页（页面不存在）[ctrl-option-n]', kbd: '⌃ ⌥ n', accesskey: 'n' },
			{ id: 'pt-preferences', cls: 'mw-list-item', icon: 'settings', text: '参数设置',
				href: getUrl('Special:Preferences'), title: '您的参数设置', kbd: '' },
			{ id: 'pt-watchlist', cls: 'mw-list-item', icon: 'watchlist', text: '监视列表',
				href: getUrl('Special:Watchlist'), title: '您正在监视更改的页面列表[ctrl-option-l]', kbd: '⌃ ⌥ l', accesskey: 'l' },
			{ id: 'pt-mycontris', cls: 'mw-list-item', icon: 'userContributions', text: '贡献',
				href: getUrl('Special:Contributions/' + userName), title: '您的贡献列表[ctrl-option-y]', kbd: '⌃ ⌥ y', accesskey: 'y' },
			{ id: 'pt-logout', cls: 'mw-list-item', icon: 'logOut', text: '退出',
				href: getUrl('Special:UserLogout'), title: '退出', kbd: '' }
		];
		return items.map(it =>
			'<li id="' + it.id + '" class="' + it.cls + '"><a href="' + it.href + '" title="' + it.title + '"' +
			(it.accesskey ? ' accesskey="' + it.accesskey + '"' : '') + '>' +
			icon(it.icon) + ' <span>' + it.text + '</span>' +
			(it.kbd ? '<kbd class="citizen-keyboard-hint-key">' + it.kbd + '</kbd>' : '') +
			'</a></li>'
		).join('');
	}

	function formatRegistrationDate(iso) {
		if (!iso) return '未知';
		const d = new Date(iso);
		if (isNaN(d.getTime())) return '未知';
		const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getUTCDay()];
		return d.getUTCFullYear() + '年' + (d.getUTCMonth() + 1) + '月' + d.getUTCDate() + '日 (' + week + ')';
	}

	function fetchUserProfile() {
		const userName = mw.config.get('wgUserName');
		if (!userName) return;
		const api = wikiApi();
		const usergroupsEl = document.getElementById('cv-usergroups');
		const regdateEl = document.getElementById('cv-user-regdate');
		fetch(api + '?action=query&list=users&ususers=' +
			encodeURIComponent(userName) + '&usprop=groups%7Cregistration&format=json',
			{ credentials: 'same-origin' })
			.then(r => { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
			.then(d => {
				const u = d.query && d.query.users && d.query.users[0];
				if (!u) return;
				const implicit = ['*', 'user', 'autoconfirmed'];
				const labels = {
					bureaucrat: '行政员', 'interface-admin': '界面管理员', sysop: '管理员',
					checkuser: '查核员', oversight: '监督员', steward: '监管员',
					'extendedconfirmed': '延伸确认用户', editor: '编辑', patroller: '巡查员',
					autoreviewer: '巡查豁免者',
					rollbacker: '回退员', 'filemover': '文件移动员', 'templateeditor': '模板编辑员',
					transwiki: '跨维基导入者', import: '导入者', 'ipblock-exempt': 'IP封禁豁免',
					'accountcreator': '账号创建员', bot: '机器人'
				};
				const shown = (u.groups || []).filter(g => g && implicit.indexOf(g) === -1);
				console.log('[citizen-vector] 用户组诊断 raw=', JSON.stringify(u.groups || []), 'shown=', JSON.stringify(shown));
				if (usergroupsEl) usergroupsEl.innerHTML = shown.map(g =>
					'<li id="group-' + encodeURIComponent(g) + '-member" class="citizen-userInfo-usergroup"><a href="' +
					wikiUrl('Special:ListUsers') + '?group=' + encodeURIComponent(g) +
					'"><span>' + escapeHtml(labels[g] || g) + '</span></a></li>').join('');
				if (regdateEl && u.registration) regdateEl.textContent = formatRegistrationDate(u.registration);
			})
			.catch(e => console.warn('[citizen-vector] fetchUserProfile 失败：', e));
	}

	function fillUserMenu(personalHtml) {
		const userName = mw.config.get('wgUserName');
		const isAnon = !userName;

		const userpageList = document.getElementById('cv-userpage-list');
		if (userpageList) {
			if (isAnon) {
				userpageList.innerHTML = '<li id="pt-anonuserpage" class="mw-list-item"><a href="/wiki/Special:我的用户页面"><span>' + mw.config.get('wgUserName', '未登录') + '</span></a></li>';
			} else {
				userpageList.innerHTML = '<li id="pt-userpage" class="mw-list-item"><a href="/wiki/User:' + encodeURIComponent(userName) + '" title="您的用户页[ctrl-option-.]" accesskey="."><span>' + escapeHtml(userName) + '</span><kbd class="citizen-keyboard-hint-key">⌃ ⌥ .</kbd></a></li>';
			}
		}

		const usergroupsEl = document.getElementById('cv-usergroups');
		if (usergroupsEl && !isAnon) usergroupsEl.innerHTML = '';

		const editCountEl = document.getElementById('cv-user-editcount');
		if (editCountEl) editCountEl.textContent = isAnon ? '—' : (mw.config.get('wgUserEditCount', 0));

		const listEl = document.getElementById('cv-personal-list');
		if (listEl) listEl.innerHTML = isAnon ? '' : personalMenuHtml(userName);

		if (!isAnon) fetchUserProfile();
	}

	function setupNotificationsDropdown(enabled, initialCount) {
		const wrap = document.querySelector('.citizen-notifications-dropdown');
		if (!wrap) return;
		if (!enabled) { wrap.style.display = 'none'; return; }

		const summary = wrap.querySelector('.citizen-notifications-button');
		const content = document.getElementById('citizen-notifications-content');
		const skeleton = content && content.querySelector('.citizen-notifications__skeleton');
		const errorBox = content && content.querySelector('.citizen-notifications__error');
		const seeAll = content && content.querySelector('.citizen-notifications__see-all');
		let activeIndex = 0;

		function setCount(n) {
			const num = Math.max(0, n || 0);
			if (summary) summary.setAttribute('data-counter-text', String(num));
		}
		setCount(initialCount || 0);

		let loaded = false;
		let abort = null;

		const MOCK_NOTIFICATIONS = [
			{ type: 'alert', category: 'system', timestamp: { utcunix: String(Math.floor(Date.now()/1000) - 300) }, '*': { header: '系统维护通知', body: '本周五 22:00–次日 02:00 进行例行维护，期间可能短暂不可访问。', links: { primary: { url: 'https://zh.wikipedia.org/wiki/Wikipedia:%E9%A6%96%E9%A1%B5' } } } },
			{ type: 'alert', category: 'mention', timestamp: { utcunix: String(Math.floor(Date.now()/1000) - 1800) }, '*': { header: '张三 在 Talk:首页 提到了你', body: '你好 @Admin ，能否帮忙审核一下首页的新文案？', links: { primary: { url: 'https://zh.wikipedia.org/wiki/Talk:%E9%A6%96%E9%A1%B5' } } } },
			{ type: 'notice', category: 'thank-you-edit', timestamp: { utcunix: String(Math.floor(Date.now()/1000) - 7200) }, '*': { header: '感谢你的 500 次编辑！', body: '继续加油，你已经是社区的核心贡献者之一了。', links: { primary: { url: 'https://zh.wikipedia.org/wiki/Special:Preferences' } } } },
			{ type: 'notice', category: 'welcome', timestamp: { utcunix: String(Math.floor(Date.now()/1000) - 86400) }, '*': { header: '欢迎加入本站', body: '这里有新手指引，祝你编辑愉快！', links: { primary: { url: 'https://zh.wikipedia.org/wiki/Help:%E7%9B%AE%E5%BD%95' } } } },
			{ type: 'alert', category: 'edit-user-talk', timestamp: { utcunix: String(Math.floor(Date.now()/1000) - 172800) }, '*': { header: '李四 在你的讨论页留言', body: '关于上次的合并请求……', links: { primary: { url: 'https://zh.wikipedia.org/wiki/User_talk:Admin' } } } }
		];

		const CATEGORY_TITLE_PREFIX = 'echo-category-title-';

		function fetchNotifications() {
			const api = (mw.config.get('wgScriptPath') || '') + '/api.php';
			const url = api + '?' + [
				'action=query',
				'meta=notifications|allmessages',
				'notformat=model',
				'notlimit=25',
				'notprop=list|count',
				'notsections=alert|message',
				'amprefix=' + CATEGORY_TITLE_PREFIX,
				'amenableparser=1',
				'amlang=' + encodeURIComponent(mw.config.get('wgUserLanguage') || 'en'),
				'format=json'
			].join('&');
			if (abort) abort.abort();
			abort = new AbortController();
			return fetch(url, { credentials: 'same-origin', signal: abort.signal })
				.then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
				.then(function (j) {
					const q = (j && j.query) || {};
					const notif = q.notifications;
					const labels = {};
					(q.allmessages || []).forEach(function (m) {
						labels[m.name.replace(CATEGORY_TITLE_PREFIX, '')] = (m['*'] || '').trim();
					});
					if (!notif) {
						if (j && j.error && j.error.code === 'login-required') {
							setCount(MOCK_NOTIFICATIONS.filter(function (n) { return n.type === 'alert'; }).length);
							return renderPanel(MOCK_NOTIFICATIONS, { rawcount: MOCK_NOTIFICATIONS.length, list: MOCK_NOTIFICATIONS }, {
								system: '系统', mention: '提及', 'thank-you-edit': '感谢', welcome: '欢迎', 'edit-user-talk': '留言'
							});
						}
						setCount(0); return renderEmpty();
					}
					const list2 = notif.list || [];
					const count = (typeof notif.rawcount === 'number') ? notif.rawcount : list2.length;
					setCount(count);
					if (!list2.length) return renderEmpty();
					renderPanel(list2.slice().reverse(), notif, labels);
				})
				.catch(function (e) {
					if (e && e.name === 'AbortError') return;
					renderError();
				});
		}

		function markAllRead() {
			const api = (mw.config.get('wgScriptPath') || '') + '/api.php';
			return mw.loader.using('mediawiki.user')
				.then(function () {
					const body = new URLSearchParams({
						action: 'echomarkread', format: 'json', formatversion: '2',
						all: '1', token: mw.user.tokens.get('csrfToken')
					});
					return fetch(api, {
						method: 'POST',
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
						body, credentials: 'same-origin'
					});
				})
				.then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
				.then(function () { setCount(0); return fetchNotifications(); })
				.catch(function () {});
		}

		function pinContentHeight() {
			const h = content.getBoundingClientRect().height;
			content.style.transition = 'none';
			content.style.height = h + 'px';
			void content.offsetHeight; 
		}
		function animateContentHeight(targetH) {
			const end = (targetH != null) ? targetH : content.scrollHeight;
			content.style.transition = '';
			void content.offsetHeight;
			content.style.height = end + 'px';
			const finish = () => {
				content.removeEventListener('transitionend', finish);
				content.style.height = '';
			};
			content.addEventListener('transitionend', finish);
			setTimeout(finish, 450);
		}

		function setupTabs() {
			const track = content.querySelector('.cdx-tabs__track');
			const indicator = content.querySelector('.cdx-tabs__indicator');
			const tabs = content.querySelectorAll('.cdx-tabs__list__item');
			if (!track || !indicator || !tabs.length) return;
			function place(i) {
				const btn = tabs[i];
				indicator.style.left = btn.offsetLeft + 'px';
				indicator.style.width = btn.offsetWidth + 'px';
			}
			let cur = 0;
			function switchTo(i) {
				if (i === cur) { place(i); return; }
				cur = i;
				activeIndex = i;
				tabs.forEach((b, j) => {
					const sel = j === i;
					b.setAttribute('aria-selected', String(sel));
					b.tabIndex = sel ? 0 : -1;
				});
				place(i);
				const panels = track.querySelectorAll('.cdx-tab');
				if (panels[i]) track.style.height = clampPanelHeight(panels[i]) + 'px';
				track.classList.add('cdx-tabs__track--switching');
				requestAnimationFrame(() => {
					track.style.transform = 'translateX(-' + (i * 33.3333) + '%)';
				});
				const done = () => {
					track.classList.remove('cdx-tabs__track--switching');
					track.removeEventListener('transitionend', onEnd);
				};
				const onEnd = (e) => { if (e.propertyName === 'transform') done(); };
				track.addEventListener('transitionend', onEnd);
				setTimeout(done, 500);
			}
			tabs.forEach((b, i) => b.addEventListener('click', () => switchTo(i)));
			function contentAvailable() {
				const card = content.closest('.citizen-menu__card');
				const cap = card ? parseFloat(card.style.maxHeight || '') : NaN;
				if (!(cap > 0)) {
					const c = content.querySelector('.cdx-tabs__content');
					return (c && c.clientHeight > 0) ? c.clientHeight : Infinity;
				}
				const panel = content.querySelector('.citizen-notifications__panel');
				let chrome = 0;
				if (panel) {
					[ '.citizen-notifications__header', '.cdx-tabs__header', '.citizen-notifications__footer' ].forEach(function (sel) {
						const el = panel.querySelector(sel);
						if (el) chrome += el.offsetHeight;
					});
				}
				return Math.max(0, cap - chrome);
			}
			function panelNatural(panel) {
				const list = panel.querySelector('.citizen-notifications__list');
				if (list) return list.scrollHeight;
				const empty = panel.querySelector('.citizen-notifications__empty');
				return (empty ? empty.offsetHeight : panel.offsetHeight);
			}
			function clampPanelHeight(panel) {
				return Math.min(panelNatural(panel), contentAvailable());
			}
			requestAnimationFrame(() => {
				place(0);
				const panels = track.querySelectorAll('.cdx-tab');
				if (panels[0]) track.style.height = clampPanelHeight(panels[0]) + 'px';
				track.style.transform = 'translateX(0%)';
			});
		}

		function renderPanel(items, notif, labels) {
			if (!content) return;
			pinContentHeight();
			labels = labels || {};

			const isAlert = (n) => (n.section === 'alert') || (n.type === 'alert');
			const isNotice = (n) => (n.section === 'message') || (n.type === 'notice');
			const alerts = items.filter(isAlert);
			const notices = items.filter(isNotice);
			const tabDefs = [
				{ key: 'all', label: '全部', items: items },
				{ key: 'alert', label: '重要通知', items: alerts },
				{ key: 'notice', label: '常规通知', items: notices }
			];
			const mkPanel = (def) =>
				'<section class="cdx-tab" role="tabpanel" tabindex="-1">' +
					(def.items.length
						? '<ul class="citizen-notifications__list">' + def.items.map((n) => renderItem(n, labels)).join('') + '</ul>'
						: '<div class="citizen-notifications__empty">没有通知。</div>') +
				'</section>';

			content.innerHTML =
				'<div class="citizen-notifications__panel">' +
					'<header class="citizen-notifications__header">' +
						'<h2 class="citizen-notifications__title">通知</h2>' +
						'<button class="cdx-button cdx-button--action-default cdx-button--weight-quiet cdx-button--size-medium cdx-button--icon-only citizen-notifications__mark-all" aria-label="标记所有为已读" title="标记所有为已读">' + checkAllSvg() + '</button>' +
					'</header>' +
					'<div class="citizen-notifications__body">' +
						'<div class="cdx-tabs cdx-tabs--quiet">' +
							'<div class="cdx-tabs__header"><div class="cdx-tabs__list" role="tablist">' +
								tabDefs.map((d, i) => '<button class="cdx-tabs__list__item" role="tab" aria-selected="' + (i === 0 ? 'true' : 'false') + '" tabindex="' + (i === 0 ? '0' : '-1') + '"><span>' + d.label + '</span></button>').join('') +
								'<div class="cdx-tabs__indicator"></div>' +
							'</div></div>' +
							'<div class="cdx-tabs__content">' +
								'<div class="cdx-tabs__track">' + tabDefs.map(mkPanel).join('') + '</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<footer class="citizen-notifications__footer">' +
						'<a class="citizen-notifications__see-all cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--weight-quiet" href="/wiki/Special:Notifications">查看全部</a>' +
						'<a class="citizen-notifications__prefs cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--weight-quiet cdx-button--icon-only" href="/wiki/Special:Preferences#mw-prefsection-echo" aria-label="通知设置" title="通知设置">' + prefsSvg() + '</a>' +
					'</footer>' +
				'</div>';

			const markAll = content.querySelector('.citizen-notifications__mark-all');
			if (markAll) markAll.addEventListener('click', markAllRead);

			setupTabs();
			animateContentHeight();
		}

		const NOTIF_ICON_URL_PATTERN = /^(?:https?:\/\/|\/\/|\/)[^"'\\\s]*$/;
		const NOTIF_ACTION_BUTTON_CLASS = 'cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--weight-quiet cdx-button--action-progressive';

		const REAL_WIKI_ORIGIN = location.origin;
		function toRealWikiUrl(u) {
			if (!u) return u;
			try {
				const url = new URL(u, location.origin);
				if (url.hostname === location.hostname) return u;
				url.searchParams.delete('markasread');
				let path = url.pathname;
				if (path === '/index.php' || path.indexOf('/index.php/') === 0) {
					const m = path.match(/^\/index\.php\/(.+)$/);
					const title = m ? decodeURIComponent(m[1]) : url.searchParams.get('title');
					if (!m) url.searchParams.delete('title');
					if (title) path = '/wiki/' + encodeURIComponent(title.replace(/ /g, '_'));
				}
				const qs = url.searchParams.toString();
				const hash = url.hash === '#' ? '' : url.hash;
				return REAL_WIKI_ORIGIN + path + (qs ? '?' + qs : '') + hash;
			} catch (e) { return u; }
		}

		function renderItem(n, labels) {
			labels = labels || {};
			const star = (n['*'] && typeof n['*'] === 'object') ? n['*'] : {};
			const links = star.links || {};
			const primaryUrl = toRealWikiUrl((links.primary && links.primary.url) || '');
			const iconUrl = star.iconUrl || '';
			const header = star.header || '';
			const body = star.body || '';
			const categoryLabel = labels[n.category] || n.category || '';
			const unix = n.timestamp && n.timestamp.utcunix;
			const timeStr = unix ? renderRelativeTimeStr(Number(unix)) : '';
			const isRead = !!n.read;

			const plainHeader = escapeHtml(header.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim());
			const primaryLink = primaryUrl
				? '<a class="citizen-notifications__item-primary" href="' + escapeHtml(primaryUrl) + '" aria-label="' + plainHeader + '"></a>'
				: '';
			const icon = (iconUrl && NOTIF_ICON_URL_PATTERN.test(iconUrl))
				? '<span class="citizen-notifications__item-icon" style="--citizen-notification-icon:url(&quot;' + iconUrl + '&quot;)"></span>'
				: '';
			const badge = '<span class="citizen-notifications__item-badge" aria-hidden="true">' + icon + '</span>';
			const secondary = (links.secondary || []).filter((l) => l && l.url && l.label);
			const actions = secondary.length
				? '<div class="citizen-notifications__item-actions">' + secondary.map((l) =>
					'<a class="citizen-notifications__item-link ' + NOTIF_ACTION_BUTTON_CLASS + '" href="' + escapeHtml(toRealWikiUrl(l.url)) + '">' + escapeHtml(l.label) + '</a>').join('') + '</div>'
				: '';

			return '<li class="citizen-notifications__item' + (isRead ? ' citizen-notifications__item--read' : '') + '">' +
				primaryLink +
				badge +
				'<div class="citizen-notifications__item-content">' +
					'<div class="citizen-notifications__item-meta">' +
						(categoryLabel ? '<span class="citizen-notifications__item-category">' + escapeHtml(categoryLabel) + '</span>' : '') +
						(timeStr ? '<span class="citizen-notifications__item-time">' + timeStr + '</span>' : '') +
					'</div>' +
					(header ? '<div class="citizen-notifications__item-header">' + header + '</div>' : '') +
					(body ? '<div class="citizen-notifications__item-body">' + body + '</div>' : '') +
					actions +
				'</div>' +
			'</li>';
		}

		function renderEmpty() {
			if (!content) return;
			pinContentHeight();
			const tabDefs = [
				{ key: 'all', label: '全部' },
				{ key: 'alert', label: '重要通知' },
				{ key: 'notice', label: '常规通知' }
			];
			content.innerHTML =
				'<div class="citizen-notifications__panel">' +
					'<header class="citizen-notifications__header">' +
						'<h2 class="citizen-notifications__title">通知</h2>' +
						'<button class="cdx-button cdx-button--action-default cdx-button--weight-quiet cdx-button--size-medium cdx-button--icon-only citizen-notifications__mark-all" aria-label="标记所有为已读" title="标记所有为已读">' + checkAllSvg() + '</button>' +
					'</header>' +
					'<div class="citizen-notifications__body">' +
						'<div class="cdx-tabs cdx-tabs--quiet">' +
							'<div class="cdx-tabs__header"><div class="cdx-tabs__list" role="tablist">' +
								tabDefs.map((d, i) => '<button class="cdx-tabs__list__item" role="tab" aria-selected="' + (i === 0 ? 'true' : 'false') + '" tabindex="' + (i === 0 ? '0' : '-1') + '"><span>' + d.label + '</span></button>').join('') +
								'<div class="cdx-tabs__indicator"></div>' +
							'</div></div>' +
							'<div class="cdx-tabs__content">' +
								'<div class="cdx-tabs__track">' +
									tabDefs.map(() => '<section class="cdx-tab" role="tabpanel" tabindex="-1"><div class="citizen-notifications__empty">没有通知。</div></section>').join('') +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<footer class="citizen-notifications__footer">' +
						'<a class="citizen-notifications__see-all cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--weight-quiet" href="/wiki/Special:Notifications">查看全部</a>' +
						'<a class="citizen-notifications__prefs cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--weight-quiet cdx-button--icon-only" href="/wiki/Special:Preferences#mw-prefsection-echo" aria-label="通知设置" title="通知设置">' + prefsSvg() + '</a>' +
					'</footer>' +
				'</div>';
			setupTabs();
			animateContentHeight();
		}

		function renderError() {
			if (!content) return;
			if (skeleton) skeleton.hidden = true;
			if (errorBox) errorBox.hidden = false;
		}

		function checkAllSvg() {
			return '<span class="cdx-icon cdx-icon--medium"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><g><path d="m.29 12.71 1.42-1.42 2.22 2.22 8.3-10.14 1.54 1.26-9.7 11.86zM12 10h5v2h-5zm-3 4h5v2H9zm6-8h5v2h-5z"></path></g></svg></span>';
		}

		function prefsSvg() {
			return '<span class="cdx-icon cdx-icon--medium"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><g><g transform="translate(10 10)"><path id="cdx-icon-settings-a" d="M1.5-10h-3l-1 6.5h5m0 7h-5l1 6.5h3"></path><use xlink:href="#cdx-icon-settings-a" transform="rotate(45)"></use><use xlink:href="#cdx-icon-settings-a" transform="rotate(90)"></use><use xlink:href="#cdx-icon-settings-a" transform="rotate(135)"></use></g><path d="M10 2.5a7.5 7.5 0 000 15 7.5 7.5 0 000-15v4a3.5 3.5 0 010 7 3.5 3.5 0 010-7"></path></g></svg></span>';
		}

		function renderRelativeTimeStr(ts) {
			const now = (Date.now() / 1000) | 0;
			const diff = now - ts;
			if (diff < 60) return '刚刚';
			if (diff < 3600) return Math.floor(diff / 60) + ' 分钟前';
			if (diff < 86400) return Math.floor(diff / 3600) + ' 小时前';
			if (diff < 30 * 86400) return Math.floor(diff / 86400) + ' 天前';
			return Math.floor(diff / (30 * 86400)) + ' 个月前';
		}

		if (errorBox) {
			const retry = errorBox.querySelector('.citizen-notifications__retry');
			if (retry) retry.addEventListener('click', () => { errorBox.hidden = true; skeleton.hidden = false; fetchNotifications(); });
		}

		function positionNotificationsCard() {
			if (!summary || !wrap) return;
			const card = wrap.querySelector('.citizen-menu__card');
			if (!card) return;
			wrap.style.position = 'static';
			card.style.position = 'absolute';
			card.style.zIndex = '1000';
			card.style.margin = '8px';
			if (window.matchMedia('(min-width: 1120px)').matches) {
				card.style.left = '100%';
				card.style.right = 'auto';
				card.style.top = 'auto';
				card.style.bottom = '0px';
			} else {
				card.style.removeProperty('left');
				card.style.removeProperty('right');
				card.style.removeProperty('bottom');
				card.style.removeProperty('top');
			}
			card.style.maxHeight = (window.innerHeight - 16) + 'px';
			if (!window.matchMedia('(min-width: 1120px)').matches) {
				const hdr = document.querySelector('.citizen-header');
				const hdrH = (hdr && hdr.offsetHeight) || 0;
				card.style.maxHeight = Math.max(160, window.innerHeight - hdrH - 16) + 'px';
			}
			const notif = card.querySelector('.citizen-notifications');
			if (notif) {
				notif.style.removeProperty('display');
				notif.style.removeProperty('flex-direction');
				notif.style.removeProperty('flex');
				notif.style.removeProperty('min-height');
			}
			const panel = card.querySelector('.citizen-notifications__panel');
			if (panel) {
				panel.style.height = 'auto';
				panel.style.maxHeight = (window.innerHeight - 16) + 'px';
			}
		}

		const details = document.getElementById('citizen-notifications-details');
		if (details) {
			details.addEventListener('toggle', () => {
				if (details.open) {
					positionNotificationsCard();
					if (!loaded) { loaded = true; fetchNotifications(); }
				}
			});
		}
	}

	function fetchSiteStats() {
		const api = wikiApi();
		fetch(`${api}?action=query&meta=siteinfo&siprop=statistics&format=json`)
			.then(r => r.json())
			.then(d => {
				const s = d.query && d.query.statistics;
				if (!s) return;
				const map = { articles: 'articles', images: 'images', users: 'users', edits: 'edits' };
				for (const k in map) {
					const el2 = document.getElementById('citizen-siteStats__count-' + map[k]);
					if (el2 && typeof s[k] !== 'undefined') el2.textContent = s[k].toLocaleString();
				}
			})
			.catch(() => {});
	}

	function renderRelativeTimes() {
		const now = Math.floor(Date.now() / 1000);
		document.querySelectorAll('[data-relative-time]').forEach(el => {
			const ts = parseInt(el.getAttribute('data-relative-time'), 10);
			if (!ts || isNaN(ts)) return;
			const diff = now - ts;
			let txt;
			if (diff < 60) txt = '刚刚';
			else if (diff < 3600) txt = Math.floor(diff / 60) + '分钟前';
			else if (diff < 86400) txt = Math.floor(diff / 3600) + '小时前';
			else if (diff < 30 * 86400) txt = Math.floor(diff / 86400) + '天前';
			else if (diff < 365 * 86400) txt = Math.floor(diff / (30 * 86400)) + '个月前';
			else txt = Math.floor(diff / (365 * 86400)) + '年前';
			el.textContent = txt;
		});
	}

	function cvInitFactbox() {
		if (window.__cvFactboxUnbind) {
			try { window.__cvFactboxUnbind(); } catch (e) {}
			window.__cvFactboxUnbind = null;
		}

		const mq = window.matchMedia('(max-width: 687.98px)');

		function readOn() {
			try { return localStorage.getItem('cv-pref-gadget-factbox') !== 'original'; }
			catch (e) { return true; }
		}

		const records = [];
		const wrapped = new Set();

		function firstParagraph() {
			const out = document.querySelector('.mw-parser-output');
			if (!out) return null;
			const ps = out.querySelectorAll(':scope > p');
			for (let i = 0; i < ps.length; i++) {
				if (ps[i].textContent.trim()) return ps[i];
			}
			return ps[0] || null;
		}

		function columnCount(ib) {
			let max = 1;
			ib.querySelectorAll(':scope > tbody > tr, :scope > tr').forEach(function (tr) {
				let n = 0;
				for (let i = 0; i < tr.cells.length; i++) n += tr.cells[i].colSpan || 1;
				if (n > max) max = n;
			});
			return max;
		}

		function setOpen(rec, open) {
			rec.ib.classList.toggle('cv-factbox-collapsed', !open);
			rec.th.setAttribute('aria-expanded', open ? 'true' : 'false');
		}

		function wrap(ib) {
			if (wrapped.has(ib)) return;
			const marker = document.createComment('cv-factbox-home');
			ib.parentNode.insertBefore(marker, ib);

			const thead = document.createElement('thead');
			const tr = document.createElement('tr');
			tr.className = 'cv-factbox-head';
			const th = document.createElement('th');
			th.className = 'cv-factbox-head__cell infobox-above';
			th.colSpan = columnCount(ib);
			th.setAttribute('role', 'button');
			th.setAttribute('tabindex', '0');
			th.setAttribute('aria-expanded', 'false');
			const inner = document.createElement('div');
			inner.className = 'cv-factbox-head__inner';
			const label = document.createElement('span');
			label.className = 'cv-factbox-head__label';
			label.textContent = '事实速览 ';
			const desc = document.createElement('span');
			desc.className = 'cv-factbox-head__desc';
			desc.textContent = (window.mw && mw.config.get('wgTitle')) || '';
			const arrow = document.createElement('span');
			arrow.className = 'cv-factbox-head__arrow';
			inner.appendChild(label);
			inner.appendChild(desc);
			inner.appendChild(arrow);
			th.appendChild(inner);
			tr.appendChild(th);
			thead.appendChild(tr);
			const cap = ib.querySelector(':scope > caption');
			ib.insertBefore(thead, cap ? cap.nextSibling : ib.firstChild);

			const rec = { ib: ib, marker: marker, thead: thead, th: th };
			th.addEventListener('click', function () {
				setOpen(rec, rec.ib.classList.contains('cv-factbox-collapsed'));
			});
			th.addEventListener('keydown', function (e) {
				if (e.key !== 'Enter' && e.key !== ' ') return;
				e.preventDefault();
				setOpen(rec, rec.ib.classList.contains('cv-factbox-collapsed'));
			});

			ib.classList.add('cv-factbox-on', 'cv-factbox-collapsed'); 
			records.push(rec);
			wrapped.add(ib);
		}

		function unwrap(rec) {
			rec.marker.parentNode.insertBefore(rec.ib, rec.marker);
			rec.ib.classList.remove('cv-factbox-on', 'cv-factbox-collapsed');
			if (rec.thead.parentNode) rec.thead.parentNode.removeChild(rec.thead);
			rec.marker.parentNode.removeChild(rec.marker);
		}

		function apply() {
			if (!mq.matches || !readOn()) {
				records.slice().forEach(unwrap);
				records.length = 0;
				wrapped.clear();
				return;
			}
			const out = document.querySelector('.mw-parser-output');
			const p = firstParagraph();
			if (!out || !p || !p.parentNode) return;
			const boxes = [];
			out.querySelectorAll('.infobox:not(.wikitable)').forEach(function (ib) {
				if (ib.parentElement && ib.parentElement.closest('.infobox')) return;
				if (wrapped.has(ib)) return;
				boxes.push(ib);
			});
			if (!boxes.length) return;
			const leadBefore = !!(p.compareDocumentPosition(boxes[0]) & Node.DOCUMENT_POSITION_PRECEDING);
			boxes.forEach(wrap);
			if (!leadBefore) return;
			let cursor = p;
			records.forEach(function (rec) {
				if (rec.ib.previousElementSibling === cursor) {
					cursor = rec.ib;
					return;
				}
				cursor.parentNode.insertBefore(rec.ib, cursor.nextSibling);
				cursor = rec.ib;
			});
		}

		window.__cvFactboxApply = apply;
		mq.addEventListener('change', apply);
		window.__cvFactboxUnbind = function () { mq.removeEventListener('change', apply); };
		apply();
	}

	function setupInfoboxCollapseRows() {
		if (window.__cvInfoboxCollapseBound) return;
		window.__cvInfoboxCollapseBound = true;
		document.addEventListener('click', e => {
			const t = e.target;
			if (!t || !t.closest) return;
			if (t.closest('.mw-collapsible-toggle') || t.closest('a')) return;
			const title = t.closest('.mw-parser-output .infobox .infobox-full-data .collapsible-list > div:not(.mw-collapsible-content)');
			if (title) {
				const btn = title.parentElement &&
					title.parentElement.querySelector(':scope > .mw-collapsible-toggle');
				if (btn) {
					e.preventDefault();
					btn.click();
				}
				return;
			}
			const sTitle = t.closest('.mw-parser-output table.sidebar .sidebar-list-title');
			if (sTitle) {
				const list = sTitle.closest('.sidebar-list');
				const btn = list && list.querySelector(':scope > .mw-collapsible-toggle');
				if (btn) {
					e.preventDefault();
					btn.click();
				}
			}
		});
	}

	function setupDropdownDismiss() {
		document.addEventListener('click', e => {
			const panel = e.target.closest('.citizen-menu__card');
			const summary = e.target.closest('summary');
			if (panel || summary) {
				const wrap = (panel || summary).closest('.citizen-dropdown');
				const own = wrap
					? wrap.querySelector('.citizen-dropdown-details')
					: summary && summary.closest('.citizen-dropdown-details');
				document.querySelectorAll('.citizen-dropdown-details[open]').forEach(d => {
					if (d !== own) d.open = false;
				});
				return;
			}
			if (e.target.closest('#citizen-command-palette-overlay')) return;
			document.querySelectorAll('.citizen-dropdown-details[open]').forEach(d => d.open = false);
			if (window.__cvClosePalette) window.__cvClosePalette();
		});
		document.addEventListener('keydown', e => {
			if (e.key === 'Escape') {
				document.querySelectorAll('.citizen-dropdown-details[open]').forEach(d => d.open = false);
				if (window.__cvClosePalette) window.__cvClosePalette();
			}
		});
	}

	function setupPreferencesPanel() {
		const content = document.getElementById('citizen-preferences-content');
		if (!content) return;

		['theme', 'font', 'width', 'autoHide', 'perf'].forEach(function (k) {
			const stored = readPref(k, null);
			if (stored !== null) applyPref(k, stored);
		});

		content.innerHTML = buildPrefsHtml();
		bindPrefs(content);
	}

	const PREF_CLASS = {
		theme: 'skin-theme-clientpref',
		font: 'citizen-feature-custom-font-size-clientpref',
		width: 'citizen-feature-custom-width-clientpref',
		autoHide: 'citizen-feature-autohide-navigation-clientpref',
		perf: 'citizen-feature-performance-mode-clientpref'
	};

	function applyPref(key, value) {
		const cls = PREF_CLASS[key];
		const html = document.documentElement;
		[...html.classList].forEach(function (c) {
			if (c === cls || c.indexOf(cls + '-') === 0) html.classList.remove(c);
		});
		html.classList.add(cls + '-' + value);
		try { localStorage.setItem('cv-pref-' + key, value); } catch (e) {}
	}

	function readPref(key, fallback) {
		try {
			const v = localStorage.getItem('cv-pref-' + key);
			return v === null ? fallback : v;
		} catch (e) { return fallback; }
	}

	function fontLabel(v) { return ({ small: '小', standard: '标准', large: '大', 'x-large': '特大' })[v] || '标准'; }
	function widthLabel(v) { return ({ standard: '标准', wide: '宽', full: '全宽' })[v] || '标准'; }

	function prefSvg(path) {
		return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><g><path d="' + path + '"></path></g></svg>';
	}
	const THEME_ICON = 'M1 7h7v2H1zm0 4h7v2H1zm0 4h18v2H1zM1 3h18v2H1z';

	function prefCard(id, name, value, label, previewClass, previewStyle, checked) {
		return '<div class="cdx-radio cdx-radio--status-default"><div class="cdx-radio__wrapper">' +
			'<input id="' + id + '" class="cdx-radio__input" type="radio" name="' + name + '" value="' + value + '"' + (checked || '') + '>' +
			'<span class="cdx-radio__icon"></span>' +
			'<div class="cdx-label cdx-radio__label"><label class="cdx-label__label" for="' + id + '">' +
				'<span class="cdx-label__label__text">' +
					'<span class="citizen-preferences-card">' +
						'<span class="citizen-preferences-card__preview' + previewClass + '" style="' + previewStyle + '">' +
							'<span class="cdx-icon cdx-icon--medium">' + prefSvg(THEME_ICON) + '</span>' +
						'</span>' +
						'<span class="citizen-preferences-card__label">' + label + '</span>' +
					'</span>' +
				'</span>' +
			'</label></div>' +
		'</div></div>';
	}

	function themeCard(id, val, label, scheme) {
		return prefCard(id, 'skin-theme', val, label,
			' citizen-preferences-card__preview--theme', 'color-scheme: ' + scheme + ';', '');
	}

	function widthSvg(colX, colW) {
		return '<svg class="citizen-preferences-segmented__page" width="38" height="24" viewBox="0 0 38 24" aria-hidden="true">' +
			'<rect class="citizen-preferences-segmented__page-frame" x="0.75" y="0.75" width="36.5" height="22.5" rx="2.5"></rect>' +
			'<rect class="citizen-preferences-segmented__page-column" x="' + colX + '" y="4.5" width="' + colW + '" height="15" rx="1"></rect>' +
		'</svg>';
	}

	function segField(id, name, label, opts, currentLabel, desc) {
		const items = opts.map(function (o) {
			let inner;
			if (o.fontSize) {
				inner = '<span class="citizen-preferences-segmented__sample" style="font-size: ' + o.fontSize + ';" aria-hidden="true">文</span>' +
					' <span class="citizen-preferences-segmented__srlabel">' + o.label + '</span>';
			} else if (o.text) {
				inner = '<span class="citizen-preferences-segmented__text">' + o.label + '</span>';
			} else {
				inner = widthSvg(o.svg[0], o.svg[1]) +
					' <span class="citizen-preferences-segmented__srlabel">' + o.label + '</span>';
			}
			return '<div class="cdx-radio cdx-radio--status-default"><div class="cdx-radio__wrapper">' +
				'<input id="' + name + '-' + o.value + '" class="cdx-radio__input" type="radio" name="' + name + '" value="' + o.value + '"' + (o.label === currentLabel ? ' checked' : '') + '>' +
				'<span class="cdx-radio__icon"></span>' +
				'<div class="cdx-label cdx-radio__label"><label class="cdx-label__label" for="' + name + '-' + o.value + '">' +
					'<span class="cdx-label__label__text">' +
						inner +
					'</span>' +
				'</label></div>' +
			'</div></div>';
		}).join('');
		return '<fieldset class="cdx-field cdx-field--is-fieldset citizen-preferences-group">' +
			'<legend class="cdx-label"><span class="cdx-label__label"><span class="cdx-label__label__text">' +
				'<span class="citizen-preferences-group__labelrow"><span>' + label + '</span> <span class="citizen-preferences-group__readout" aria-hidden="true" data-readout="' + name + '">' + currentLabel + '</span></span>' +
			'</span></span>' +
			(desc ? '<span class="cdx-label__description">' + desc + '</span>' : '') +
			'</legend>' +
			'<div class="cdx-field__control">' +
				'<div class="citizen-preferences-segmented">' + items + '</div>' +
			'</div>' +
		'</fieldset>';
	}

	function toggleField(id, pref, label, desc, isOn, hide) {
		return '<span class="cdx-toggle-switch cdx-toggle-switch--align-switch citizen-preferences-group"' + (hide ? ' style="display: none;"' : '') + '>' +
			'<input id="' + id + '" class="cdx-toggle-switch__input" type="checkbox" role="switch" data-pref="' + pref + '"' + (isOn ? ' checked' : '') + '>' +
			'<span class="cdx-toggle-switch__switch"><span class="cdx-toggle-switch__switch__grip"></span></span>' +
			'<div class="cdx-label cdx-toggle-switch__label">' +
				'<label class="cdx-label__label" for="' + id + '"><span class="cdx-label__label__text">' + label + ' </span></label>' +
				'<span class="cdx-label__description">' + desc + '</span>' +
			'</div>' +
		'</span>';
	}

	function buildPrefsHtml() {
		const font     = fontLabel(readPref('font', 'standard'));
		const width    = widthLabel(readPref('width', 'standard'));
		const autoHide = readPref('autoHide', '0');
		const perf     = readPref('perf', '0');

		return '<section class="citizen-preferences-section">' +
			'<div class="citizen-preferences-section__heading">外观</div>' +
			'<div class="citizen-preferences-section__content">' +
				'<fieldset class="cdx-field cdx-field--is-fieldset citizen-preferences-group" id="skin-client-prefs-skin-theme">' +
					'<legend class="cdx-label"><span class="cdx-label__label"><span class="cdx-label__label__text">颜色</span></span>' +
					'<span class="cdx-label__description">切换浅色和深色模式</span></legend>' +
					'<div class="cdx-field__control"><div class="citizen-preferences-radio" style="--pref-columns: 3;">' +
						themeCard('cv-theme-os', 'os', '自动', 'light dark') +
						themeCard('cv-theme-day', 'day', '浅色', 'light') +
						themeCard('cv-theme-night', 'night', '深色', 'dark') +
					'</div></div>' +
				'</fieldset>' +
				segField('cv-font', 'font', '字体', [
					{ 'label': '小', 'value': 'small', 'fontSize': '0.875rem' },
					{ 'label': '标准', 'value': 'standard', 'fontSize': '1rem' },
					{ 'label': '大', 'value': 'large', 'fontSize': '1.125rem' },
					{ 'label': '特大', 'value': 'x-large', 'fontSize': '1.25rem' }
				], font) +
				segField('cv-width', 'width', '宽度', [
					{ 'label': '标准', 'value': 'standard', 'svg': [9.2, 19.6] },
					{ 'label': '宽', 'value': 'wide', 'svg': [5.35, 27.3] },
					{ 'label': '全宽', 'value': 'full', 'svg': [1.5, 35] }
				], width) +
			'</div>' +
		'</section>' +
		'<section class="citizen-preferences-section">' +
			'<div class="citizen-preferences-section__heading">行为</div>' +
			'<div class="citizen-preferences-section__content">' +
				toggleField('cv-autohide', 'autoHide', '自动隐藏导航', '向下滚动时隐藏导航栏', autoHide === '1', true) +
				toggleField('cv-perf', 'perf', '性能模式', '减少动画和视觉效果', perf === '1') +
			'</div>' +
		'</section>';
	}

	function bindPrefs(root) {
		root.querySelectorAll('input[name="skin-theme"]').forEach(function (r) {
			if (r.value === readPref('theme', 'os')) r.checked = true;
			r.addEventListener('change', function () { applyPref('theme', r.value); });
		});
		root.querySelectorAll('.citizen-preferences-segmented input[type="radio"]').forEach(function (r) {
			r.addEventListener('change', function () {
				const name = r.getAttribute('name');
				applyPref(name, r.value);
				const ro = root.querySelector('[data-readout="' + name + '"]');
				if (ro) ro.textContent = (name === 'width' ? widthLabel : fontLabel)(r.value);
			});
		});
		root.querySelectorAll('.cdx-toggle-switch__input').forEach(function (inp) {
			inp.addEventListener('change', function () { applyPref(inp.getAttribute('data-pref'), inp.checked ? '1' : '0'); });
		});
	}

	function isMacPlatform(nav) {
		if (!nav) return false;
		const platform = (nav.userAgentData && nav.userAgentData.platform) || nav.platform || '';
		return /mac|iphone|ipad/i.test(platform);
	}
	function isLetterPressed(event, letter) {
		if (/^[a-z]$/i.test(event.key)) return event.key.toLowerCase() === letter;
		return event.code === 'Key' + letter.toUpperCase();
	}
	function isAltGraphChar(event, isMac) {
		if (event.metaKey || !event.altKey || (event.key || '').length !== 1 || event.key === ' ') return false;
		if (typeof event.getModifierState === 'function' && event.getModifierState('AltGraph')) return true;
		return event.ctrlKey || isMac;
	}
	function isAccessKeyChord(event, isMac) {
		if (event.metaKey) return false;
		if (event.altKey && event.shiftKey && !event.ctrlKey) return true;
		return isMac && event.ctrlKey && event.altKey && !event.shiftKey;
	}
	function isFormField(element) {
		if (!(element instanceof HTMLElement)) return false;
		const name = element.nodeName.toLowerCase();
		const type = (element.getAttribute('type') || '').toLowerCase();
		return name === 'select' || name === 'textarea' ||
			(name === 'input' && type !== 'submit' && type !== 'reset' && type !== 'checkbox' && type !== 'radio') ||
			element.isContentEditable;
	}
	const OPEN_SHORTCUTS = [
		(event, isMac) => event.key === '/' &&
			!event.metaKey &&
			(!event.ctrlKey || isAltGraphChar(event, isMac)),
		(event) => (event.ctrlKey || event.metaKey) &&
			!event.altKey &&
			!event.shiftKey &&
			isLetterPressed(event, 'k'),
		(event, isMac) => isAccessKeyChord(event, isMac) && isLetterPressed(event, 'f')
	];

	let CV_NS_INDEX = null;
	function cvNormalizeNamespaceName(name) {
		return String(name).replace(/ /g, '_').toLowerCase();
	}
	function cvNamespaceIndex() {
		if (!CV_NS_INDEX) {
			CV_NS_INDEX = new Map();
			const formatted = mw.config.get('wgFormattedNamespaces') || {};
			Object.keys(formatted).forEach(id => {
				if (id !== '0' && formatted[id]) {
					CV_NS_INDEX.set(cvNormalizeNamespaceName(formatted[id]), String(id));
				}
			});
			const ids = mw.config.get('wgNamespaceIds') || {};
			Object.keys(ids).forEach(name => {
				CV_NS_INDEX.set(cvNormalizeNamespaceName(name), String(ids[name]));
			});
		}
		return CV_NS_INDEX;
	}
	function cvMatchNamespacePrefix(text) {
		const colon = text.indexOf(':');
		if (colon < 1) return null;   
		const id = cvNamespaceIndex().get(cvNormalizeNamespaceName(text.slice(0, colon)));
		if (id === undefined || id === '0') return null;
		const raw = text.slice(0, colon + 1);
		const name = (mw.config.get('wgFormattedNamespaces') || {})[id];
		return { label: name ? name + ':' : raw, raw: raw };
	}

	function setupCommandPalette() {
		const summary = document.querySelector('#citizen-search-summary');
		if (!summary) return;

		let overlay = null;
		let listbox = null;
		let input = null;
		let clearBtn = null;
		let footerHints = null;
		let viewport = null;
		let resultsContainer = null;
		let items = [];
		let activeIdx = -1;
		let timer = null;
		let paletteOpen = false;
		let paletteGen = 0;
		let searchGen = 0;
		let appliedQuery = null;
		const commandPaletteSiteName = mw.config.get('wgSiteName') || '';
		let tokens = [];
		let selectedToken = -1;
		let restoredRaw = null;
		let inputArea = null;

		function searchUrl(query) {
			const api = (mw.config.get('wgScriptPath') || '') + '/api.php';
			return api + '?action=query&list=search&format=json&srlimit=8&srwhat=text&srsearch=' + encodeURIComponent(query);
		}

		function currentQuery() {
			return tokens.map(function (t) { return t.raw; }).join('') + input.value;
		}

		function detectNamespaceTokens(text) {
			let rest = text;
			let guard = 0;
			let hit;
			while ((hit = cvMatchNamespacePrefix(rest)) && guard++ < 8) {
				tokens.push(hit);
				rest = rest.slice(hit.raw.length);
			}
			return rest;
		}

		function renderTokens() {
			if (!inputArea) return;
			inputArea.querySelectorAll('.citizen-command-palette-header__chip').forEach(function (c) { c.remove(); });
			const field = input.closest('.cdx-text-input');
			tokens.forEach(function (token, i) {
				const chip = document.createElement('div');
				chip.className = 'cdx-info-chip cdx-info-chip--notice citizen-command-palette-header__chip' +
					(i === selectedToken ? ' citizen-command-palette-header__chip--selected' : '');
				chip.innerHTML = '<span class="cdx-info-chip__text">' + escapeHtml(token.label) + '</span>';
				chip.addEventListener('click', function () {
					selectedToken = selectedToken === i ? -1 : i;
					renderTokens();
					input.focus();
				});
				inputArea.insertBefore(chip, field);
			});
		}

		function resetTokens() {
			tokens = [];
			selectedToken = -1;
			restoredRaw = null;
			renderTokens();
		}

		function tokenizeInput() {
			const rest = detectNamespaceTokens(input.value);
			if (rest === input.value) return;
			input.value = rest;
			selectedToken = -1;
			renderTokens();
		}

		function searchPageUrl(query) {
			const script = (mw.config.get('wgScript') || '/index.php');
			return script + '?search=' + encodeURIComponent(query) + '&fulltext=1';
		}

		function searchIconSvg() {
			return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">' +
				'<g><path d="M12.2 13.6a7 7 0 111.4-1.4l5.4 5.4-1.4 1.4zM3 8a5 5 0 1010 0A5 5 0 003 8"></path></g></svg>';
		}

		const RECENT_ITEMS_KEY = 'skin-citizen-command-palette-recent-items';
		const MAX_RECENT_ITEMS = 5;

		function getRecentItems() {
			return (mw.storage.getObject(RECENT_ITEMS_KEY) || []).slice();
		}

		function saveRecentItem(item) {
			const items = mw.storage.getObject(RECENT_ITEMS_KEY) || [];
			const existingIndex = items.findIndex(i => i.id === item.id);
			if (existingIndex !== -1) items.splice(existingIndex, 1);
			items.unshift(item);
			if (items.length > MAX_RECENT_ITEMS) items.pop();
			mw.storage.setObject(RECENT_ITEMS_KEY, items);
		}

		function saveSearchQuery(query) {
			saveRecentItem({
				type: 'fulltext-search',
				id: 'citizen-command-palette-result-search-' + escapeId(query),
				label: query,
				url: searchPageUrl(query)
			});
		}

		function articlesSearchIconSvg() {
			return '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20" aria-hidden="true">' +
				'<g>' +
					'<path d="M7 0a2 2 0 00-2 2h9a2 2 0 012 2v12a2 2 0 002-2V2a2 2 0 00-2-2z"></path>' +
					'<path d="M10.8 15.6a4.6 4.7 0 01-2.3.6 4.6 4.7 0 113.7-1.9l2.8 3V4.9A1.9 1.9 0 0013.1 3H4a1.9 1.9 0 00-2 1.9V18a1.9 1.9 0 001.9 2H13a1.9 1.9 0 001.4-.6z"></path>' +
					'<circle cx="8.5" cy="11.5" r="3"></circle>' +
				'</g>' +
			'</svg>';
		}

		function clearIconSvg() {
			return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">' +
				'<g><path d="M10 0a10 10 0 1010 10A10 10 0 0010 0m5.66 14.24-1.41 1.41L10 11.41l-4.24 4.25-1.42-1.42L8.59 10 4.34 5.76l1.42-1.42L10 8.59l4.24-4.24 1.41 1.41L11.41 10z"></path></g>' +
			'</svg>';
		}

		function fulltextActionIconSvg() {
			return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">' +
				'<g>' +
					'<path d="M12.43 14.34A5 5 0 0110 15a5 5 0 113.95-2L17 16.09V3a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 001.45-.63z"></path>' +
					'<circle cx="10" cy="10" r="3"></circle>' +
				'</g>' +
			'</svg>';
		}

		function editActionIconSvg() {
			return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">' +
				'<g><path d="m16.77 8 1.94-2a1 1 0 000-1.41l-3.34-3.3a1 1 0 00-1.41 0L12 3.23zM1 14.25V19h4.75l9.96-9.96-4.75-4.75z"></path></g>' +
			'</svg>';
		}

		function documentIconSvg() {
			return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">' +
				'<g><path d="M16 1H4a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V3a2 2 0 00-2-2zM8 4h4v1H8zM13 4h1v1h-1zM5 4h2v1H5zm8 7H7v-1h6zm0 3H7v-1h6z"></path></g>' +
			'</svg>';
		}

		function actionThumbnail(iconSvg) {
			return '<span class="cdx-thumbnail citizen-command-palette-list-item__thumbnail">' +
				'<span class="cdx-thumbnail__placeholder">' +
					'<span class="cdx-icon cdx-icon--medium cdx-thumbnail__placeholder__icon--vue">' + iconSvg + '</span>' +
				'</span>' +
			'</span>';
		}

		function buildActionItems(query) {
			const isPageEditable = !!mw.config.get('wgRelevantPageIsProbablyEditable');
			const actionItems = [];

			const fulltext = document.createElement('li');
			fulltext.id = 'citizen-command-palette-item-fulltext-search';
			fulltext.setAttribute('role', 'option');
			fulltext.className = 'citizen-command-palette-list-item';
			fulltext.setAttribute('data-type', 'action');
			fulltext.innerHTML =
				'<a href="' + searchPageUrl(query) + '" class="citizen-command-palette-list-item__content">' +
					actionThumbnail(fulltextActionIconSvg()) +
					'<div class="citizen-command-palette-list-item__text">' +
						'<div class="citizen-command-palette-list-item__text__label">' + escapeHtml(query) + '</div>' +
						'<div class="citizen-command-palette-list-item__text__description"><bdi>在所有页面全文搜索</bdi></div>' +
					'</div>' +
					'<div class="citizen-command-palette-list-item__metadata">' +
						'<div class="citizen-command-palette-list-item__metadata__item citizen-command-palette-list-item__metadata__item--type">操作</div>' +
					'</div>' +
				'</a>';
			fulltext.querySelector('a').addEventListener('click', () => saveSearchQuery(query));
			actionItems.push(fulltext);

			if (isPageEditable) {
				const edit = document.createElement('li');
				edit.id = 'citizen-command-palette-item-page-edit';
				edit.setAttribute('role', 'option');
				edit.className = 'citizen-command-palette-list-item';
				edit.setAttribute('data-type', 'action');
				edit.innerHTML =
					'<a href="' + wikiUrl(query, { action: 'edit' }) + '" class="citizen-command-palette-list-item__content">' +
						actionThumbnail(editActionIconSvg()) +
						'<div class="citizen-command-palette-list-item__text">' +
							'<div class="citizen-command-palette-list-item__text__label">' + escapeHtml(query) + '</div>' +
							'<div class="citizen-command-palette-list-item__text__description"><bdi>创建或编辑页面</bdi></div>' +
						'</div>' +
						'<div class="citizen-command-palette-list-item__metadata">' +
							'<div class="citizen-command-palette-list-item__metadata__item citizen-command-palette-list-item__metadata__item--type">操作</div>' +
						'</div>' +
					'</a>';
				actionItems.push(edit);
			}
			return actionItems;
		}

		function buildOverlay() {
			const siteName = mw.config.get('wgSiteName') || ''; 
			const lang = (mw.config.get('wgContentLanguage') || 'zh');
			overlay = document.createElement('div');
			overlay.id = 'citizen-command-palette-overlay';
			overlay.className = 'citizen-command-palette-overlay';
			overlay.setAttribute('data-v-app', '');
			overlay.innerHTML =
				'<div class="citizen-command-palette-backdrop"></div>' +
				'<div class="citizen-command-palette" role="search" aria-label="Command palette" data-palette-layout="list">' +
					'<div class="citizen-command-palette-header">' +
						'<div class="citizen-command-palette-header__input-area">' +
						'<span class="cdx-icon cdx-icon--medium citizen-command-palette-header__icon">' + searchIconSvg() + '</span>' +
						'<div class="cdx-text-input cdx-text-input--clearable cdx-text-input--status-default citizen-command-palette-header__input">' +
							'<input class="cdx-text-input__input" role="combobox" aria-autocomplete="list" aria-label="搜索' + escapeHtml(siteName) + '内容" aria-controls="citizen-command-palette-listbox" aria-expanded="true" placeholder="搜索' + escapeHtml(siteName) + '内容" type="search" size="1">' +
							'<span class="cdx-icon cdx-icon--medium cdx-text-input__icon-vue cdx-text-input__clear-icon">' + clearIconSvg() + '</span>' +
						'</div>' +
					'</div>' +
					'</div>' +
					'<div class="citizen-command-palette__body">' +
							'<div class="citizen-command-palette__body-viewport">' +
								'<div class="citizen-command-palette__results">' +
								'<div id="citizen-command-palette-listbox" class="citizen-command-palette-list" role="listbox" aria-label="Results" tabindex="-1"></div>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="citizen-command-palette__footer">' +
						'<div id="citizen-command-palette-footer-hints" class="citizen-command-palette__footer-hints"></div>' +
					'</div>' +
				'</div>';

			const existing = document.querySelector('#citizen-command-palette-overlay');
			if (existing) existing.remove();
			document.body.appendChild(overlay);

			listbox = overlay.querySelector('#citizen-command-palette-listbox');
			resultsContainer = overlay.querySelector('.citizen-command-palette__results');
			input = overlay.querySelector('.cdx-text-input__input');
			inputArea = overlay.querySelector('.citizen-command-palette-header__input-area');
			clearBtn = overlay.querySelector('.cdx-text-input__clear-icon');
			footerHints = overlay.querySelector('#citizen-command-palette-footer-hints');
			viewport = overlay.querySelector('.citizen-command-palette__body-viewport');
			overlay.style.display = 'none';

			overlay.querySelector('.citizen-command-palette-backdrop').addEventListener('click', closePalette);
			input.addEventListener('keydown', e => {
				if (e.key === 'Escape') { e.preventDefault(); closePalette(); return; }
				if (e.key === 'Backspace' && !input.value && tokens.length) {
					e.preventDefault();
					if (selectedToken === -1) {
						selectedToken = tokens.length - 1;
						renderTokens();
						return;
					}
					restoredRaw = tokens[selectedToken].raw;
					tokens.splice(selectedToken, 1);
					selectedToken = -1;
					input.value = restoredRaw;
					renderTokens();
					updateInputState();
					const caret = restoredRaw.length;
					requestAnimationFrame(() => input.setSelectionRange(caret, caret));
					clearTimeout(timer);
					timer = setTimeout(() => runSearch(currentQuery()), 220);
				}
			});
			input.addEventListener('input', () => {
				if (restoredRaw !== null) {
					const untouched = input.value === restoredRaw;
					restoredRaw = null;
					if (!untouched) tokenizeInput();
				} else {
					tokenizeInput();
				}
				updateInputState();
				clearTimeout(timer);
				timer = setTimeout(() => runSearch(currentQuery()), 220);
			});
			if (clearBtn) {
				clearBtn.addEventListener('click', () => {
					input.value = '';
					restoredRaw = null;
					selectedToken = -1;
					updateInputState();
					renderTokens();
					if (currentQuery()) runSearch(currentQuery());
					else renderDefault();
					input.focus();
				});
			}
			resultsContainer.addEventListener('mouseover', e => {
				if (!items.length) return;
				const li = e.target.closest('.citizen-command-palette-list-item');
				if (!li) return;
				const idx = items.indexOf(li);
				if (idx !== -1 && idx !== activeIdx) { activeIdx = idx; highlight(); }
			});
		}

		function updateInputState() {
			const hasValue = input.value.length > 0;
			input.classList.toggle('cdx-text-input__input--has-value', hasValue);
			const wrapper = input.closest('.cdx-text-input');
			if (wrapper) {
				wrapper.classList.toggle('cdx-text-input--has-value', hasValue);
				wrapper.classList.toggle('cdx-text-input--clearable', true);
			}
		}

		function renderFooterHints(hasQuery) {
			if (!footerHints) return;
			const hints = hasQuery
				? [['选择', '↵'], ['导航', '↑↓'], ['清空', 'Esc']]
				: [['搜索', '↵'], ['帮助', '?'], ['关闭', 'Esc']];
			footerHints.innerHTML = hints.map(([label, key]) =>
				'<div class="citizen-keyboard-hint"><span class="citizen-keyboard-hint-label">' + label + '</span><kbd class="citizen-keyboard-hint-key">' + key + '</kbd></div>'
			).join('');
		}

		function ensureListbox() {
			Array.from(resultsContainer.children).forEach(child => {
				if (!child.classList.contains('citizen-command-palette-list')) child.remove();
			});
			let lb = resultsContainer.querySelector('.citizen-command-palette-list');
			if (!lb) {
				lb = document.createElement('div');
				lb.id = 'citizen-command-palette-listbox';
				lb.className = 'citizen-command-palette-list';
				lb.setAttribute('role', 'listbox');
				lb.setAttribute('aria-label', 'Results');
				lb.setAttribute('tabindex', '-1');
				resultsContainer.appendChild(lb);
			}
			listbox = lb;
			return lb;
		}

		function getPaletteBody() { return overlay ? overlay.querySelector('.citizen-command-palette__body') : null; }
		function pinBodyHeight() {
			const b = getPaletteBody();
			if (!b) return;
			const h = b.getBoundingClientRect().height;
			b.style.transition = 'none';
			b.style.height = h + 'px';
			void b.offsetHeight; 
		}
		function animateBodyHeight() {
			const b = getPaletteBody();
			if (!b) return;
			const end = b.scrollHeight;
			b.style.transition = '';
			void b.offsetHeight;
			b.style.height = end + 'px';
			const finish = () => {
				b.removeEventListener('transitionend', finish);
				b.style.height = '';
			};
			b.addEventListener('transitionend', finish);
			setTimeout(finish, 450);
		}

		function renderDefault() {
			pinBodyHeight();
			appliedQuery = '';
			const recent = getRecentItems();
			if (!recent.length) {
				renderEmptyState();
				return;
			}
			ensureListbox();
			listbox.innerHTML = '';
			items = [];
			recent.forEach(item => {
				const li = document.createElement('li');
				li.setAttribute('role', 'option');
				li.className = 'citizen-command-palette-list-item';
				li.id = item.id || (item.url ? 'citizen-command-palette-recent-' + item.url : '');
				const desc = item.type === 'fulltext-search' ? '全文搜索' :
					(item.description || '上次访问');
				const thumbIcon = item.type === 'fulltext-search' ? fulltextActionIconSvg() : documentIconSvg();
				li.innerHTML =
					'<a href="' + item.url + '" class="citizen-command-palette-list-item__content">' +
						actionThumbnail(thumbIcon) +
						'<div class="citizen-command-palette-list-item__text">' +
							'<div class="citizen-command-palette-list-item__text__label">' + escapeHtml(item.label || '') + '</div>' +
							'<div class="citizen-command-palette-list-item__text__description"><bdi>' + escapeHtml(desc) + '</bdi></div>' +
						'</div>' +
					'</a>';
				listbox.appendChild(li);
				items.push(li);
			});
			activeIdx = 0;
			renderFooterHints(true);
			highlight();
			animateBodyHeight();
		}

		function renderNoResults(q) {
			pinBodyHeight();
			appliedQuery = q == null ? '' : q;
			ensureListbox();
			listbox.innerHTML = '';
			items = buildActionItems(q);
			items.forEach(li => listbox.appendChild(li));
			activeIdx = 0;
			renderFooterHints(true);
			highlight();
			animateBodyHeight();
		}

		function renderEmptyState() {
			pinBodyHeight();
			appliedQuery = '';
			const empty = document.createElement('div');
			empty.className = 'citizen-command-palette-empty-state';
			empty.setAttribute('role', 'status');
			empty.innerHTML =
				'<div class="citizen-command-palette-empty-state__icon"><span class="cdx-icon cdx-icon--medium">' + articlesSearchIconSvg() + '</span></div>' +
				'<div class="citizen-command-palette-empty-state__content">' +
					'<div class="citizen-command-palette-empty-state__title">搜索' + escapeHtml(commandPaletteSiteName) + '内容</div>' +
					'<div class="citizen-command-palette-empty-state__description">请输入要搜索的内容</div>' +
				'</div>';
			resultsContainer.innerHTML = '';
			resultsContainer.appendChild(empty);
			listbox = null;
			items = [];
			activeIdx = -1;
			renderFooterHints(false);
			animateBodyHeight();
		}

		function renderResults(res, q) {
			pinBodyHeight();
			appliedQuery = q == null ? '' : q;
			if (!res || !res.query || !res.query.search || !res.query.search.length) {
				renderNoResults(q);
				return;
			}
			ensureListbox();
			listbox.innerHTML = '';
			items = [];
			res.query.search.forEach(r => {
				const li = document.createElement('li');
				li.setAttribute('role', 'option');
				li.className = 'citizen-command-palette-list-item';
				li.setAttribute('data-type', 'page');
				const snippet = (r.snippet || '').replace(/<[^>]+>/g, ' ');
				const href = wikiUrl(r.title);
				li.innerHTML =
					'<a href="' + href + '" class="citizen-command-palette-list-item__content">' +
						actionThumbnail(documentIconSvg()) +
						'<div class="citizen-command-palette-list-item__text">' +
							'<div class="citizen-command-palette-list-item__text__label">' + escapeHtml(r.title) + '</div>' +
							'<div class="citizen-command-palette-list-item__text__description"><bdi>' + escapeHtml(snippet) + '</bdi></div>' +
						'</div>' +
					'</a>';
				li.querySelector('a').addEventListener('click', () => {
					saveRecentItem({
						type: 'page',
						id: 'citizen-command-palette-result-page-' + escapeId(r.title),
						label: r.title,
						url: href,
						description: ''
					});
				});
				listbox.appendChild(li);
				items.push(li);
			});
			buildActionItems(q).forEach(li => {
				listbox.appendChild(li);
				items.push(li);
			});
			activeIdx = 0;
			renderFooterHints(true);
			highlight();
			animateBodyHeight();
		}

		function applyUniformType() {
			if (!viewport) return;
			const types = items.map(li => li.getAttribute('data-type')).filter(Boolean);
			const uniform = types.length > 0 && types.every(t => t === types[0]);
			viewport.classList.toggle('citizen-command-palette__body-viewport--uniform-type', uniform);
		}

		function highlight() {
			applyUniformType();
			items.forEach((li, i) => li.classList.toggle('citizen-command-palette-list-item--highlighted', i === activeIdx));
			if (items[activeIdx]) {
				items[activeIdx].scrollIntoView({ block: 'nearest' });
				input.setAttribute('aria-activedescendant', items[activeIdx].id || '');
			}
		}

		function runSearch(q) {
			if (!q) { searchGen++; renderDefault(); return; }
			const gen = ++searchGen;
			fetch(searchUrl(q)).then(r => r.json()).then(res => {
				if (gen !== searchGen) return;
				renderResults(res, q);
			}).catch(() => {});
		}

		function clearTransitionClasses(el) {
			const base = el.classList.contains('citizen-command-palette-backdrop') ? 'citizen-command-palette-backdrop' : 'citizen-command-palette';
			el.classList.remove(
				base + '-enter-active', base + '-enter-from', base + '-enter-to',
				base + '-leave-active', base + '-leave-from', base + '-leave-to'
			);
		}

		function playTransition(el, kind, gen, done) {
			const base = el.classList.contains('citizen-command-palette-backdrop') ? 'citizen-command-palette-backdrop' : 'citizen-command-palette';
			clearTransitionClasses(el);
			const active = base + '-' + kind + '-active';
			const from = base + '-' + kind + '-from';
			const to = base + '-' + kind + '-to';
			el.classList.add(active, from);
			void el.offsetWidth;
			el.classList.remove(from);
			el.classList.add(to);
			let called = false;
			const finish = () => {
				if (called) return;
				called = true;
				if (gen === paletteGen) {
					el.classList.remove(active, to, from);
					if (done) done();
				}
			};
			el.addEventListener('transitionend', function h(e) {
				if (e.target !== el) return;
				el.removeEventListener('transitionend', h);
				finish();
			});
			setTimeout(finish, 600);
		}

		function openPalette() {
			if (!overlay) buildOverlay();
			const gen = ++paletteGen;
			paletteOpen = true;
			document.querySelectorAll('.citizen-dropdown-details[open]').forEach(d => d.open = false);
			overlay.style.display = '';
			document.body.classList.add('citizen-command-palette-open');
			resetTokens();
			input.value = '';
			renderDefault();
			const card = overlay.querySelector('.citizen-command-palette');
			const backdrop = overlay.querySelector('.citizen-command-palette-backdrop');
			playTransition(card, 'enter', gen);
			playTransition(backdrop, 'enter', gen);
			requestAnimationFrame(() => input.focus());
		}

		function closePalette() {
			if (!overlay || !paletteOpen) return;
			paletteOpen = false;
			const gen = ++paletteGen;
			if (summary) summary.focus();
			document.body.classList.remove('citizen-command-palette-open');
			const card = overlay.querySelector('.citizen-command-palette');
			const backdrop = overlay.querySelector('.citizen-command-palette-backdrop');
			playTransition(card, 'leave', gen);
			playTransition(backdrop, 'leave', gen, () => { overlay.style.display = 'none'; });
		}

		function togglePalette() {
			if (paletteOpen) closePalette();
			else openPalette();
		}

		summary.addEventListener('click', e => {
			e.preventDefault();
			togglePalette();
		});

		window.addEventListener('keydown', e => {
			const isMac = isMacPlatform(window.navigator);
			if (OPEN_SHORTCUTS.some(matches => matches(e, isMac)) && !isFormField(e.target)) {
				e.preventDefault();
				openPalette();
				return;
			}
			if (!paletteOpen) return;
			if (e.key === 'ArrowDown') { e.preventDefault(); if (items.length) { activeIdx = Math.min(activeIdx + 1, items.length - 1); highlight(); } }
			else if (e.key === 'ArrowUp') { e.preventDefault(); if (items.length) { activeIdx = Math.max(activeIdx - 1, 0); highlight(); } }
			else if (e.key === 'Enter') {
				e.preventDefault();
				const q = currentQuery();
				if (appliedQuery !== q) {
					saveSearchQuery(q);
					window.location.href = searchPageUrl(q);
					return;
				}
				const li = items[activeIdx];
				const a = li && li.querySelector('a');
				if (a) window.location.href = a.href;
			}
		}, true);
		window.__cvClosePalette = closePalette;
	}

	function escapeHtml(s) {
		const d = document.createElement('div');
		d.textContent = s == null ? '' : String(s);
		return d.innerHTML;
	}

	function diag(tag) {
		var header = document.querySelector('.vector-header-container');
		var drawer = document.querySelector('#citizen-drawer');
		var nav = document.querySelector('#citizen-main-menu nav#p-navigation, nav#p-navigation');
		var style = document.querySelector('style[data-citizen-vector]');
		var navCount = nav ? nav.querySelectorAll('a').length : 0;
		console.log('[citizen-vector][' + tag + ']',
			'header=' + (header ? 'OK' : 'NO'),
			'nav=' + (nav ? 'OK' : (drawer ? 'drawer-only' : 'NO')),
			'navLinks=' + navCount,
			'hasStyle=' + (style ? 'YES' : 'NO'),
			'inited=' + (window.__cvInited ? 'YES' : 'NO'));
	}
	function scheduleInit(retries, onDone) {
		diag('try-' + retries);
		if (window.__cvInited) { diag('already'); if (onDone) try { onDone(); } catch (e) {} return; }   
		try {
			if (init() === true) { diag('done'); if (onDone) try { onDone(); } catch (e) {} return; }     
		} catch (e) {
			console.error('[citizen-vector] init error:', e);  
		}
		if (retries <= 0) { diag('giveup'); if (onDone) try { onDone(); } catch (e) {} return; }          
		setTimeout(function() { scheduleInit(retries - 1, onDone); }, 100);
	}

	window.__cvReboot = function (cfg, onDone) {
		try {
			if (cfg && typeof mw !== 'undefined' && mw.config && mw.config.set) mw.config.set(cfg);
		} catch (e) {
			console.error('[citizen-vector] __cvReboot 写入 mw.config 失败:', e);
		}
		window.__cvInited = false;
		scheduleInit(60, onDone);
		return true;
	};


	function initMainPageLayout() {
		if (!(mw.config.get('wgIsMainPage') === true && mw.config.get('wgAction') === 'view')) return;
		document.body.classList.add('citizen-is-mainpage');
		var main = document.querySelector('main#content');
		var header = document.querySelector('header#citizen-page-header');
		if (main && header) main.appendChild(header);
	}
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initMainPageLayout);
	} else {
		initMainPageLayout();
	}

	function cvFixSaveDialogHeight() {
		if (!isEditorPage()) return;
		var tries = 0;
		(function waitForVe() {
			if (window.ve && ve.ui && ve.ui.MWSaveDialog && ve.ui.MWSaveDialog.prototype.setDimensions) {
				var proto = ve.ui.MWSaveDialog.prototype;
				if (proto.__cvHeightFixed) return;
				proto.__cvHeightFixed = true;
				var origSetDimensions = proto.setDimensions;
				proto.setDimensions = function () {
					var res = origSetDimensions.apply(this, arguments);
					var content = this.$content && this.$content[0];
					if (content && content.classList.contains('oo-ui-window-content-setup')
						&& !content.classList.contains('oo-ui-window-content-ready')) {
						this.__cvResizeTries = (this.__cvResizeTries || 0) + 1;
						if (this.__cvResizeTries <= 6 && !this.__cvResizeQueued) {
							this.__cvResizeQueued = true;
							var self = this;
							setTimeout(function () {
								self.__cvResizeQueued = false;
								try { self.updateSize(); } catch (e) {  }
							}, 300);
						}
					} else {
						this.__cvResizeTries = 0;
					}
					return res;
				};
				return;
			}
			if (++tries < 300) setTimeout(waitForVe, 100);
		})();
	}
	cvFixSaveDialogHeight();

	var CV_TAIL_ADD_PATH = 'M11 5h-2v4H5v2h4v4h2v-4h4V9h-4V5z';
	var CV_TAIL_DEL_PATH = 'M10 0a1.5 1.5 0 0 1 1.5 1.5V2H16v2H4V2h4.5v-.5A1.5 1.5 0 0 1 10 0zM5 5h10v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5zm2 2v10h1V7H7zm3 0v10h1V7h-1z';
	var CV_CAT_THRESHOLD = 6;
	var CV_CAT_DWELL = 350;

	var cvCatUndo = [];          
	var cvCatKeysBound = false;
	var cvCatDraft = null;       
	var cvCatDraftInput = null;

	var cvCatList = null;        
	var cvCatTailItem = null;    
	var cvCatStatus = null;      
	var cvCatStatusTimer = null;
	var cvCatChain = null;       
	var cvCatDocUrl = '';

	var cvCatTail = null;        
	var cvCatDrag = null;        
	var cvCatBase = null;        
	var cvCatHidden = {};        
	var cvCatFixed = {};         
	var cvCatSwallowClick = false;
	var cvCatSweep = null;       
	var cvCatSweepRaf = 0;

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function() { scheduleInit(40); });
	} else {
		scheduleInit(40);
	}

	function cvCatNamespace() {
		try {
			var ns = mw.config.get('wgFormattedNamespaces');
			if (ns && ns[14]) return ns[14];
		} catch (e) {  }
		return 'Category';
	}
	function cvCatKey(title) {
		return String(title).replace(/_/g, ' ').replace(/^\s+|\s+$/g, '')
			.replace(/^./, function (c) { return c.toUpperCase(); });
	}
	var cvCatNsNames = null;
	function cvCatNsKey(name) {
		return String(name).replace(/_/g, ' ').replace(/\s+/g, ' ')
			.replace(/^\s+|\s+$/g, '').toLowerCase();
	}
	function cvCatIsNsName(prefix) {
		if (!cvCatNsNames) {
			var out = {};
			var add = function (name, id) {
				if (String(id) === '14') out[cvCatNsKey(name)] = true;
			};
			add(cvCatNamespace(), 14);
			['wgNamespaceIds', 'wgNamespaceAliases'].forEach(function (cfg) {
				var map;
				try { map = mw.config.get(cfg) || {}; } catch (e) { return; }
				Object.keys(map).forEach(function (name) { add(name, map[name]); });
			});
			cvCatNsNames = out;
		}
		return !!cvCatNsNames[cvCatNsKey(prefix)];
	}
	function cvCatStripNs(title) {
		var s = String(title).replace(/_/g, ' ');
		var m = s.match(/^\s*([^:\]]+)\s*:\s*(.+?)\s*$/);
		return m && cvCatIsNsName(m[1]) ? m[2] : s;
	}
	function cvCatCleanName(raw) {
		return cvCatStripNs(String(raw).replace(/^\s+|\s+$/g, ''));
	}
	function cvCatTargetOf(a) {
		var href = a.getAttribute('href') || '';
		var path = mw.config.get('wgArticlePath') || '/wiki/$1';
		var star = path.indexOf('$1');
		if (star > 0 && href.indexOf(path.slice(0, star)) === 0) {
			return decodeURIComponent(href.slice(star).split(/[?#]/)[0]);
		}
		var q = href.match(/[?&]title=([^&#]+)/);
		return q ? decodeURIComponent(q[1]) : '';
	}

	function cvCatLines(wikitext) {
		var lines = String(wikitext).split('\n');
		var hits = [];
		lines.forEach(function (line, i) {
			if (line.indexOf('[[') === -1) return;
			var m = line.match(/^[ \t]*\[\[[ \t]*([^:\]|]+?)[ \t]*:[ \t]*([^\]|]+?)[ \t]*(\|[^\]]*?)?[ \t]*\]\][ \t]*$/);
			if (!m || !cvCatIsNsName(m[1])) return;
			hits.push({ i: i, name: m[2], key: m[3] || '' });
		});
		return { lines: lines, hits: hits };
	}

	function cvCatRewrite(wikitext, order) {
		var parsed = cvCatLines(wikitext);
		var named = {};
		if (cvCatBase && cvCatBase.keys) {
			Object.keys(cvCatBase.keys).forEach(function (k) {
				named[k] = { name: k, key: cvCatBase.keys[k] };
			});
		}
		parsed.hits.forEach(function (h) {
			var k = cvCatKey(h.name);
			var prev = named[k];
			named[k] = { name: h.name, key: h.key || (prev ? prev.key : '') };
		});

		var managed = {}, anchor = -1;
		parsed.hits.forEach(function (h) {
			if (cvCatHidden[cvCatKey(h.name)]) return;
			managed[h.i] = true;
			if (anchor === -1) anchor = h.i;
		});

		var block = order.map(function (name) {
			var src = named[cvCatKey(name)];
			return '[[' + cvCatNamespace() + ':' + (src ? src.name : name) +
				((src && src.key) || '') + ']]';
		});

		var out = [];
		parsed.lines.forEach(function (line, i) {
			if (managed[i]) {
				if (i === anchor) out.push.apply(out, block);
				return;
			}
			out.push(line);
		});
		if (anchor === -1) out.push.apply(out, block);
		return out.join('\n');
	}

	function cvCatPills() {
		if (!cvCatList) return [];
		return Array.prototype.slice.call(cvCatList.querySelectorAll(
			'li.cv-cat:not(.cv-cat--placeholder):not(.cv-cat--dragging)'));
	}
	function cvCatManagedPills() {
		return cvCatPills().filter(function (li) {
			return !cvCatFixed[cvCatKey(cvCatNameOf(li))];
		});
	}
	function cvCatNameOf(li) {
		var a = li.querySelector('a');
		if (a) {
			var target = cvCatTargetOf(a);
			return cvCatCleanName(target || a.textContent || '');
		}
		return cvCatCleanName(li.textContent || '');
	}
	function cvCatOrder() {
		return cvCatManagedPills().map(cvCatNameOf).filter(function (n) { return !!n; });
	}
	function cvCatHref(title) {
		try {
			if (mw.util && typeof mw.util.getUrl === 'function') return mw.util.getUrl(title);
		} catch (e) {  }
		var path = mw.config.get('wgArticlePath') || '/wiki/$1';
		var slug = encodeURIComponent(String(title).replace(/ /g, '_'))
			.replace(/%2F/gi, '/').replace(/%3A/gi, ':');
		if (path.indexOf('$1') >= 0) return path.replace('$1', slug);
		return (mw.config.get('wgScriptPath') || '') + '/index.php?title=' + slug;
	}
	function cvCatPill(name, linkClass) {
		var li = document.createElement('li');
		li.className = 'cv-cat';
		var a = document.createElement('a');
		a.setAttribute('href', cvCatHref(cvCatNamespace() + ':' + name));
		a.setAttribute('draggable', 'false');
		if (linkClass) a.className = linkClass;
		a.textContent = name;
		li.appendChild(a);
		return li;
	}
	function cvCatRender(order) {
		if (!cvCatList || !cvCatTailItem) return;
		var managed = cvCatManagedPills();
		if (!managed.length) return;
		var linkClass = {};
		managed.forEach(function (li) {
			var a = li.querySelector('a');
			if (a && a.className) linkClass[cvCatKey(cvCatNameOf(li))] = a.className;
		});
		var mark = document.createComment('cv-cat');
		cvCatList.insertBefore(mark, managed[0]);
		managed.forEach(function (li) { li.remove(); });
		order.forEach(function (name) {
			cvCatList.insertBefore(cvCatPill(name, linkClass[cvCatKey(name)]), mark);
		});
		mark.remove();
	}
	function cvCatPushUndo(order) {
		cvCatUndo.push(order);
		while (cvCatUndo.length > 50) cvCatUndo.shift();
	}

	function cvCatSetStatus(msg, kind) {
		if (!cvCatStatus) return;
		if (cvCatStatusTimer) { clearTimeout(cvCatStatusTimer); cvCatStatusTimer = null; }
		cvCatStatus.textContent = msg || '';
		cvCatStatus.className = 'cv-catstatus' + (kind ? ' cv-catstatus--' + kind : '');
		if (!msg || kind === 'busy') return;
		cvCatStatusTimer = setTimeout(function () {
			cvCatStatusTimer = null;
			cvCatStatus.textContent = '';
			cvCatStatus.className = 'cv-catstatus';
		}, kind === 'error' ? 6000 : 2500);
	}

	function cvCatToken() {
		return mw.loader.using('mediawiki.user').then(function () {
			return mw.user.tokens.get('csrfToken');
		});
	}
	function cvCatLoadBase() {
		var params = new URLSearchParams({
			action: 'query', format: 'json', formatversion: '2',
			prop: 'revisions', rvprop: 'content|ids|timestamp', rvslots: 'main',
			rvlimit: '1', curtimestamp: '1', titles: mw.config.get('wgPageName')
		});
		return fetch(wikiApi() + '?' + params.toString(), { credentials: 'same-origin' })
			.then(function (r) { return r.json(); })
			.then(function (d) {
				var page = d && d.query && d.query.pages && d.query.pages[0];
				var rev = page && page.revisions && page.revisions[0];
				if (!rev) throw new Error('无法读取页面源码');
				var text = (rev.slots && rev.slots.main && rev.slots.main.content) || '';
				var keys = {};
				cvCatLines(text).hits.forEach(function (h) {
					keys[cvCatKey(h.name)] = h.key;
				});
				cvCatBase = {
					text: text, revid: rev.revid,
					startts: (d.query && d.query.curtimestamp) || '',
					keys: keys
				};
				return cvCatBase;
			});
	}
	function cvCatQueue(fn) {
		var next = (cvCatChain || Promise.resolve()).then(fn, fn);
		cvCatChain = next.catch(function () {  });
		return next;
	}
	var CV_CAT_WORDS = {
		prefix: '使用[[WP:HOTCAT|HotCat]]', using: '', separator: '; ',
		cat_added: '已添加[[Category:$1]]',
		cat_removed: '已移除[[Category:$1]]'
	};
	var CV_CAT_REORDERED = '已调整[[Category:$1]]的顺序';
	function cvCatWords() {
		var live = (window.HotCat && window.HotCat.messages) || {};
		var words = {};
		Object.keys(CV_CAT_WORDS).forEach(function (k) {
			words[k] = live[k] || CV_CAT_WORDS[k];
		});
		return words;
	}
	function cvCatRowOf(wikitext) {
		return cvCatLines(wikitext).hits.filter(function (h) {
			return !cvCatHidden[cvCatKey(h.name)];
		});
	}
	function cvCatMoved(oldRow, newRow) {
		var at = {};
		oldRow.forEach(function (h, i) { at[cvCatKey(h.name)] = i; });
		var seats = newRow.map(function (h) { return at[cvCatKey(h.name)]; });
		var tails = [], from = [], ends = [];
		seats.forEach(function (v, i) {
			var lo = 0, hi = tails.length;
			while (lo < hi) {
				var mid = (lo + hi) >> 1;
				if (tails[mid] < v) lo = mid + 1; else hi = mid;
			}
			tails[lo] = v;
			from[i] = lo ? ends[lo - 1] : -1;
			ends[lo] = i;
		});
		var kept = {};
		for (var i = ends[tails.length - 1]; i >= 0; i = from[i]) kept[i] = true;
		return newRow.filter(function (h, i) { return !kept[i]; })
			.map(function (h) { return h.name; });
	}
	function cvCatDiff(before, after) {
		var oldRow = cvCatRowOf(before), newRow = cvCatRowOf(after);
		var oldAt = {}, newAt = {};
		oldRow.forEach(function (h) { oldAt[cvCatKey(h.name)] = h; });
		newRow.forEach(function (h) { newAt[cvCatKey(h.name)] = h; });
		var added = [], removed = [];
		oldRow.forEach(function (h) {
			if (!newAt[cvCatKey(h.name)]) removed.push(h.name);
		});
		newRow.forEach(function (h) {
			if (!oldAt[cvCatKey(h.name)]) added.push(h.name);
		});
		return {
			added: added,
			removed: removed,
			moved: (added.length || removed.length) ? [] : cvCatMoved(oldRow, newRow)
		};
	}
	function cvCatSummary(before, after) {
		var words = cvCatWords(), diff = cvCatDiff(before, after), parts = [];
		diff.removed.forEach(function (n) {
			parts.push(words.cat_removed.replace(/\$1/g, n));
		});
		diff.added.forEach(function (n) {
			parts.push(words.cat_added.replace(/\$1/g, n));
		});
		diff.moved.forEach(function (n) {
			parts.push(CV_CAT_REORDERED.replace(/\$1/g, n));
		});
		return parts.length
			? words.prefix + parts.join(words.separator) + words.using
			: '';
	}

	function cvCatSave() {
		return cvCatQueue(function () {
			if (location.href !== cvCatDocUrl) return null;
			return (cvCatBase ? Promise.resolve() : cvCatLoadBase()).then(function () {
				var text = cvCatRewrite(cvCatBase.text, cvCatOrder());
				if (text === cvCatBase.text) { cvCatSetStatus(''); return null; }
				cvCatSetStatus('正在保存…', 'busy');
				return cvCatToken().then(function (token) {
					var HC = window.HotCat || {};
					var body = new URLSearchParams({
						action: 'edit', format: 'json', formatversion: '2',
						title: mw.config.get('wgPageName'),
						text: text,
						summary: cvCatSummary(cvCatBase.text, text),
						token: token,
						baserevid: String(cvCatBase.revid),
						starttimestamp: cvCatBase.startts,
						watchlist: HC.dont_add_to_watchlist ? 'nochange' : 'preferences',
						minor: (HC.single_minor === undefined ? true : !!HC.single_minor) ? '1' : '0'
					});
					return fetch(wikiApi(), {
						method: 'POST',
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
						body: body, credentials: 'same-origin'
					});
				}).then(function (r) { return r.json(); }).then(function (d) {
					if (d && d.edit && d.edit.result === 'Success') {
						cvCatBase.text = text;
						cvCatBase.revid = d.edit.newrevid || cvCatBase.revid;
						cvCatLines(text).hits.forEach(function (h) {
							cvCatBase.keys[cvCatKey(h.name)] = h.key;
						});
						cvCatSetStatus('');
						return;
					}
					cvCatBase = null;
					cvCatSetStatus((d && d.error && d.error.info) || '保存失败，请重试', 'error');
				});
			}).catch(function (e) {
				cvCatBase = null;
				cvCatSetStatus((e && e.message) || '保存失败，请重试', 'error');
			});
		});
	}

	function cvCatFixedHint(li, e) {
		var sx = e.clientX, sy = e.clientY, done = false;
		function off() {
			if (done) return;
			done = true;
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', off);
			window.removeEventListener('pointercancel', off);
		}
		function onMove(ev) {
			if (ev.pointerId !== e.pointerId) return;
			if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < CV_CAT_THRESHOLD) return;
			off();
			cvCatSetStatus('「' + cvCatNameOf(li) +
				'」由模板加入，不在本页源码里，无法在这里移动或删除', 'error');
		}
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', off);
		window.addEventListener('pointercancel', off);
	}
	function cvCatDragStart(e) {
		if (e.button !== 0 || cvCatDrag) return;
		if (e.target.closest('.cv-tail')) return;
		var li = e.target.closest('li.cv-cat');
		if (!li || li.classList.contains('cv-cat--placeholder')) return;
		if (cvCatFixed[cvCatKey(cvCatNameOf(li))]) {   
			cvCatFixedHint(li, e);
			return;
		}
		if (e.pointerType === 'mouse') e.preventDefault();
		var r = li.getBoundingClientRect();
		cvCatDrag = {
			li: li, pointerId: e.pointerId,
			sx: e.clientX, sy: e.clientY,
			ox: e.clientX - r.left, oy: e.clientY - r.top,
			w: r.width, h: r.height,
			before: cvCatOrder(),
			moved: false, armed: false, ph: null,
			dwellRef: null, dwellTimer: 0
		};
		window.addEventListener('pointermove', cvCatDragMove);
		window.addEventListener('pointerup', cvCatDragEnd);
		window.addEventListener('pointercancel', cvCatDragCancel);
	}
	function cvCatDragBegin() {
		var d = cvCatDrag, li = d.li;
		d.moved = true;
		var ph = document.createElement('li');
		ph.className = 'cv-cat cv-cat--placeholder';
		ph.style.width = d.w + 'px';
		ph.style.height = d.h + 'px';
		li.parentNode.insertBefore(ph, li);
		d.ph = ph;
		li.classList.add('cv-cat--dragging');
		li.style.width = d.w + 'px';
		li.style.height = d.h + 'px';
		li.style.left = (d.sx - d.ox) + 'px';
		li.style.top = (d.sy - d.oy) + 'px';
		document.body.classList.add('cv-dragging');
		cvCatList.classList.add('cv-catlist--dragging');
	}
	function cvCatFlipReset(el) {
		if (el.__cvFlipRaf) { cancelAnimationFrame(el.__cvFlipRaf); el.__cvFlipRaf = 0; }
		el.style.transform = '';
		el.style.transition = '';
	}
	function cvCatFlipCapture() {
		var items = cvCatManagedPills(), out = [], i, el;
		for (i = 0; i < items.length; i++) {
			el = items[i];
			cvCatFlipReset(el);
			out.push([el, el.getBoundingClientRect()]);
		}
		if (cvCatDrag && cvCatDrag.ph && cvCatDrag.ph.offsetParent) {
			out.push([cvCatDrag.ph, cvCatDrag.ph.getBoundingClientRect()]);
		}
		return out;
	}
	function cvCatFlipPlay(prev) {
		var i, el, before, now, dx, dy;
		for (i = 0; i < prev.length; i++) {
			el = prev[i][0];
			before = prev[i][1];
			if (!el.offsetParent || el.classList.contains('cv-cat--dragging')) continue;
			cvCatFlipReset(el);
			now = el.getBoundingClientRect();
			dx = before.left - now.left;
			dy = before.top - now.top;
			if (!dx && !dy) continue;
			el.style.transition = 'none';
			el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
			(function (node) {
				node.__cvFlipRaf = requestAnimationFrame(function () {
					node.__cvFlipRaf = 0;
					node.style.transition = '';
					node.style.transform = '';
				});
			})(el);
		}
	}
	function cvCatDropRef(x, y) {
		var others = cvCatManagedPills(), i, c, r;
		for (i = 0; i < others.length; i++) {
			c = others[i];
			r = c.getBoundingClientRect();
			if (y < r.top) break;
			if (y <= r.bottom && x < r.left + r.width / 2) break;
		}
		return i < others.length ? others[i] : cvCatTailItem;
	}
	function cvCatDwellArm(d, ref) {
		if (d.dwellRef === ref) return;
		d.dwellRef = ref;
		if (d.dwellTimer) { clearTimeout(d.dwellTimer); d.dwellTimer = 0; }
		if (ref === d.ph.nextElementSibling) return;   
		d.dwellTimer = setTimeout(function () {
			d.dwellTimer = 0;
			if (cvCatDrag !== d) return;
			var prev = cvCatFlipCapture();
			cvCatList.insertBefore(d.ph, d.dwellRef);
			cvCatFlipPlay(prev);
		}, CV_CAT_DWELL);
	}
	function cvCatDwellClear(d) {
		d.dwellRef = null;
		if (d.dwellTimer) { clearTimeout(d.dwellTimer); d.dwellTimer = 0; }
	}
	function cvCatDragMove(e) {
		var d = cvCatDrag;
		if (!d || e.pointerId !== d.pointerId) return;
		if (!d.moved) {
			if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < CV_CAT_THRESHOLD) return;
			cvCatDragBegin();
		}
		e.preventDefault();
		d.li.style.left = (e.clientX - d.ox) + 'px';
		d.li.style.top = (e.clientY - d.oy) + 'px';
		var under = document.elementFromPoint(e.clientX, e.clientY);
		var overTail = !!(under && under.closest('.cv-tail'));
		if (overTail !== d.armed) {
			d.armed = overTail;
			if (cvCatTail) cvCatTail.classList.toggle('cv-tail--armed', overTail);
		}
		if (overTail) cvCatDwellClear(d);
		else cvCatDwellArm(d, cvCatDropRef(e.clientX, e.clientY));
	}
	function cvCatDragCancel(e) {
		var d = cvCatDrag;
		if (!d || e.pointerId !== d.pointerId) return;
		d.armed = false;
		cvCatDragEnd(e);
	}
	function cvCatDragEnd(e) {
		var d = cvCatDrag;
		if (!d || e.pointerId !== d.pointerId) return;
		window.removeEventListener('pointermove', cvCatDragMove);
		window.removeEventListener('pointerup', cvCatDragEnd);
		window.removeEventListener('pointercancel', cvCatDragCancel);
		cvCatDwellClear(d);
		cvCatDrag = null;
		document.body.classList.remove('cv-dragging');
		if (cvCatList) cvCatList.classList.remove('cv-catlist--dragging');
		if (cvCatTail) cvCatTail.classList.remove('cv-tail--armed');
		if (!d.moved) return;
		var prev = cvCatFlipCapture();
		if (d.armed) {
			d.li.remove();
			if (d.ph.parentNode) d.ph.remove();
			cvCatFlipPlay(prev);
			cvCatSwallowClick = true;
			setTimeout(function () { cvCatSwallowClick = false; }, 0);
		} else {
			var from = d.li.getBoundingClientRect();
			cvCatList.insertBefore(d.ph, cvCatDropRef(e.clientX, e.clientY));
			d.li.classList.remove('cv-cat--dragging');
			d.li.removeAttribute('style');
			d.ph.parentNode.replaceChild(d.li, d.ph);
			prev.push([d.li, from]);
			cvCatFlipPlay(prev);
		}
		var after = cvCatOrder();
		if (d.before.join('\u0000') === after.join('\u0000')) return;
		cvCatPushUndo(d.before);
		cvCatSave();
	}

	function cvCatEndDraft() {
		if (!cvCatDraft) return;
		var node = cvCatDraft;
		cvCatDraft = null;
		cvCatDraftInput = null;
		if (node.parentNode) node.parentNode.removeChild(node);
		if (!cvCatList) return;
		cvCatList.classList.remove('cv-catlist--adding');
	}
	function cvCatBeginDraft() {
		if (cvCatDraft) { cvCatDraftInput.focus(); return; }
		if (!cvCatList || !cvCatTailItem) return;
		var draft = document.createElement('li');
		draft.className = 'cv-cat-draft';
		draft.innerHTML =
			'<span class="cv-cat-draft__chip">' +
				'<input class="cv-cat-draft__input" type="text" autocomplete="off" ' +
					'spellcheck="false" placeholder="请输入分类" aria-label="添加分类">' +
			'</span>';
		cvCatDraft = draft;
		cvCatDraftInput = draft.querySelector('.cv-cat-draft__input');
		var pills = cvCatPills();
		var last = pills[pills.length - 1];
		if (last && last.offsetHeight) draft.style.height = last.offsetHeight + 'px';
		cvCatList.insertBefore(draft, cvCatTailItem);
		cvCatList.classList.add('cv-catlist--adding');
		cvCatDraftInput.addEventListener('keydown', function (ev) {
			if (ev.key === 'Enter') { ev.preventDefault(); cvCatDraftCommit(); }
			else if (ev.key === 'Escape') { ev.preventDefault(); cvCatEndDraft(); }
		});
		cvCatDraftInput.addEventListener('blur', cvCatEndDraft);
		cvCatDraftInput.focus();
	}
	function cvCatAdd(raw) {
		var name = cvCatCleanName(raw);
		if (!name) return false;
		var k = cvCatKey(name);
		var dup = cvCatHidden[k] ||
			cvCatPills().some(function (li) { return cvCatKey(cvCatNameOf(li)) === k; });
		if (dup) return false;
		cvCatPushUndo(cvCatOrder());
		var pill = cvCatPill(name);
		cvCatList.insertBefore(pill, cvCatTailItem);
		cvCatSave();
		return pill;
	}
	function cvCatDraftCommit() {
		var typed = cvCatDraftInput.value.trim();
		if (!typed) return;
		if (!cvCatAdd(typed)) { cvCatSetStatus('该分类已在列表中', 'error'); return; }
		cvCatEndDraft();
	}

	function cvCatUndoStep() {
		var prev = cvCatUndo.pop();
		if (!prev) return false;
		cvCatRender(prev);
		cvCatSave();
		return true;
	}
	function cvCatBindKeys() {
		if (cvCatKeysBound) return;
		cvCatKeysBound = true;
		document.addEventListener('keydown', function (e) {
			if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return;
			if ((e.key || '').toLowerCase() !== 'z') return;
			if (isFormField(e.target)) return;                            
			if (location.href !== cvCatDocUrl) { cvCatUndo.length = 0; return; }
			if (!cvCatUndo.length) return;
			e.preventDefault();
			cvCatUndoStep();
		}, true);
	}

	function cvCatStripHotcat() {
		var normal = document.querySelector('#catlinks .mw-normal-catlinks');
		if (!normal) return;
		Array.prototype.slice.call(
			document.querySelectorAll(
				'#catlinks .hotcatlink, #catlinks .mw-hcat, #catlinks .mw-hcat-item,' +
				'#catlinks .catlinks-tools, #catlinks div[id^="catlinks-tools"],' +
				'#catlinks div[id^="mw-hcat"]'
			)
		).forEach(function (n) { n.parentNode.removeChild(n); });
		Array.prototype.slice.call(normal.children).forEach(function (n) {
			if (n === cvCatList || n.classList.contains('cv-catstatus')) return;
			if (n.querySelector && n.querySelector(
				'a[title*="修改多个分类"], a[title*="增加一个新分类"]'
			)) { n.parentNode.removeChild(n); }
		});
		if (cvCatList && cvCatTailItem && cvCatTailItem.parentNode === cvCatList) {
			Array.prototype.slice.call(cvCatList.children).forEach(function (li) {
				if (!li.classList.contains('cv-cat') && !li.classList.contains('cv-tail-item') &&
					!li.classList.contains('cv-cat-draft')) {
					li.parentNode.removeChild(li);
				}
			});
		}
	}
	function cvCatWatchHotcat() {
		var host = document.getElementById('catlinks');
		if (!host || cvCatSweep) return;
		cvCatSweep = new MutationObserver(function () {
			if (cvCatSweepRaf) return;
			cvCatSweepRaf = requestAnimationFrame(function () {
				cvCatSweepRaf = 0;
				cvCatStripHotcat();
			});
		});
		cvCatSweep.observe(host, { childList: true, subtree: true });
	}

	function cvInitCategoryPills() {
		if (cvCatList) return;
		if (mw.config.get('wgNamespaceNumber') === -1) return;
		if (cvGadgetPref('hotcat') === 'original') return;
		var host = document.getElementById('catlinks');
		if (!host) return;
		var normal = host.querySelector('.mw-normal-catlinks');
		if (!normal) {
			host.classList.remove('catlinks-allhidden');
			normal = document.createElement('div');
			normal.id = 'mw-normal-catlinks';
			normal.className = 'mw-normal-catlinks';
			var label = document.createElement('a');
			label.setAttribute('href', cvCatHref('Special:Categories'));
			label.setAttribute('title', 'Special:Categories');
			label.textContent = '分类';
			normal.appendChild(label);
			normal.appendChild(document.createTextNode('：'));
			normal.appendChild(document.createElement('ul'));
			host.appendChild(normal);
		}
		var ul = normal.querySelector('ul');
		if (!ul) { ul = document.createElement('ul'); normal.appendChild(ul); }

		cvCatDocUrl = location.href;
		cvCatList = ul;
		ul.classList.add('cv-catlist');

		cvCatHidden = {};
		Array.prototype.slice.call(
			document.querySelectorAll('#catlinks .mw-hidden-catlinks a')
		).forEach(function (a) {
			var n = cvCatCleanName(cvCatTargetOf(a) || a.textContent || '');
			if (n) cvCatHidden[cvCatKey(n)] = true;
		});

		cvCatStripHotcat();
		var nsPrefix = (cvCatNamespace() + ':').toLowerCase();
		Array.prototype.slice.call(ul.children).forEach(function (li) {
			var a = li.tagName === 'LI' ? li.querySelector('a') : null;
			var href = a ? (a.getAttribute('href') || '') : '';
			var target = a ? cvCatTargetOf(a) : '';
			var isCat = !!a && href.charAt(0) !== '#' &&
				(!target || target.replace(/_/g, ' ').toLowerCase().indexOf(nsPrefix) === 0);
			if (!isCat) { li.parentNode.removeChild(li); return; }
			a.setAttribute('draggable', 'false');
			li.classList.add('cv-cat');
		});

		cvCatTailItem = document.createElement('li');
		cvCatTailItem.className = 'cv-tail-item';
		cvCatTail = document.createElement('a');
		cvCatTail.className = 'cv-tail';
		cvCatTail.setAttribute('href', '#catlinks');
		cvCatTail.setAttribute('draggable', 'false');
		cvCatTail.setAttribute('aria-label', '添加分类');
		cvCatTail.innerHTML =
			'<span class="cv-tail__add">' +
				'<svg class="cv-tail__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">' +
					'<path d="' + CV_TAIL_ADD_PATH + '"/></svg>添加分类' +
			'</span>' +
			'<span class="cv-tail__del">' +
				'<svg class="cv-tail__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">' +
					'<path d="' + CV_TAIL_DEL_PATH + '"/></svg>删除分类' +
			'</span>';
		cvCatTailItem.appendChild(cvCatTail);
		ul.appendChild(cvCatTailItem);

		cvCatStatus = document.createElement('div');
		cvCatStatus.className = 'cv-catstatus';
		normal.appendChild(cvCatStatus);

		var catArea = normal.closest('#catlinks') || document.querySelector('#catlinks') || ul;
		catArea.addEventListener('pointerdown', cvCatDragStart);
		catArea.addEventListener('dragstart', function (e) {
			if (e.target && e.target.closest('li.cv-cat')) e.preventDefault();
		});
		cvCatTail.addEventListener('click', function (e) {
			e.preventDefault();
			if (cvCatSwallowClick) return;
			if (cvCatList.classList.contains('cv-catlist--dragging')) return;
			cvCatBeginDraft();
		});

		cvCatBindKeys();
		cvCatWatchHotcat();
		cvCatLoadBase().then(cvCatMarkFixed).catch(function () {  });
	}

	function cvCatMarkFixed() {
		if (!cvCatList || !cvCatBase) return;
		var keys = cvCatBase.keys;
		cvCatFixed = {};
		cvCatPills().forEach(function (li) {
			var k = cvCatKey(cvCatNameOf(li));
			var fixed = !(k in keys);
			if (fixed) cvCatFixed[k] = true;
			li.classList.toggle('cv-cat--fixed', fixed);
		});
	}

	bootPreferencesInjection();
}

function cvBoot() {
	cvInjectCSS();
	cvRun();
}

(function cvImageFade() {
	document.addEventListener('load', function (e) {
		var t = e.target;
		if (t && t.tagName === 'IMG' && t.closest && t.closest('#mw-content-text')) {
			t.classList.add('cv-img-in');
		}
	}, true);
	document.addEventListener('DOMContentLoaded', function () {
		document.querySelectorAll('#mw-content-text img').forEach(function (img) {
			if (img.complete) img.classList.add('cv-img-in');
		});
	});
})();

cvEarlyBoot();

(function cvWaitReady(tries) {
	var domReady = document.readyState !== 'loading';
	var mwReady = typeof mw !== 'undefined' && !!mw.config && typeof mw.config.get === 'function';
	if ((domReady && mwReady) || tries <= 0) { cvBoot(); return; }
	setTimeout(function () { cvWaitReady(tries - 1); }, 50);
}(100));
