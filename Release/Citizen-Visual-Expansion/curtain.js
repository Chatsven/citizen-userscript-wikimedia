(function () {
	try { if (localStorage.getItem('cv-skin') === 'vector-2022') return; } catch (e) {}
	var KEY = 'cv-chrome-cache';
	var doc = document;
	var lastDocUrl = location.href.split('#')[0];
	try {
		var html = sessionStorage.getItem(KEY);
		if (html && html.indexOf('citizen-header') !== -1) {
			var t = doc.createElement('template');
			t.innerHTML = html;
			var node = t.content.querySelector('.citizen-header') || t.content.firstElementChild;
			if (node) {
				node.setAttribute('data-cv-cached', '1');
				var old = doc.getElementById(node.id);
				if (old && old.parentNode) old.parentNode.removeChild(old);
				var attach = doc.body || doc.documentElement;
				if (attach.childNodes[0]) attach.insertBefore(node, attach.childNodes[0]);
				else attach.appendChild(node);
				try { doc.documentElement.setAttribute('data-cv-cached-page', '1'); } catch (e) {}
			}
		}
	} catch (e) {}
	function armReadyFallback() {
		try {
			if (doc.documentElement.hasAttribute('data-cv-ready')) return;
			doc.documentElement.setAttribute('data-cv-ready', '1');
		} catch (e) {}
	}
	if (doc.readyState === 'complete') setTimeout(armReadyFallback, 2500);
	else window.addEventListener('load', function () { setTimeout(armReadyFallback, 2500); });
	function snap() {
		try {
			var b = doc.body;
			if (!b) return;
			var h = b.querySelector('.citizen-header');
			if (!h || !h.outerHTML) return;
			var clone = h.cloneNode(true);
			var cards = clone.querySelectorAll('.citizen-menu__card');
			for (var i = 0; i < cards.length; i++) {
				if (cards[i].parentNode) cards[i].parentNode.removeChild(cards[i]);
			}
			var opens = clone.querySelectorAll('details[open]');
			for (var j = 0; j < opens.length; j++) opens[j].removeAttribute('open');
			if (clone.matches && clone.matches('details[open]')) clone.removeAttribute('open');
			sessionStorage.setItem(KEY, clone.outerHTML);
		} catch (e) {}
	}
	if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', snap);
	else snap();
	window.addEventListener('load', snap);

	var TX_MAX_MS = 3000;
	var TX_MAX_BYTES = 8 * 1024 * 1024; 
	var TX_FADE_MS = 160; 
	var txSeq = 0;

	function txSetLoading(on) {
		try { doc.documentElement.classList[on ? 'add' : 'remove']('cv-loading'); } catch (e) {}
	}
	function txSetLeaving(on) {
		try { doc.documentElement.classList[on ? 'add' : 'remove']('cv-tx-leaving'); } catch (e) {}
	}

	var SITE_ORIGIN = location.origin;

	function txResolveUrl(raw) {
		try {
			if (!raw || raw.charAt(0) === '#') return null;
			var u = new URL(raw, location.href);
			if (u.origin !== SITE_ORIGIN) return null;
			if (u.pathname.indexOf('/wiki/') !== 0) return null;
			if (u.pathname.indexOf('/wiki/Special:') === 0) return null;
			if (u.pathname.indexOf('/w/index.php') === 0) return null;
			var q = u.searchParams;
			if (q.get('action') || q.get('veaction') || q.get('diff') ||
				q.get('oldid') || q.get('curid')) return null;
			return u.href;
		} catch (e) { return null; }
	}

	function txIsInternal(a) {
		try {
			if (!a) return null;
			if (a.hasAttribute('download')) return null;
			var href = a.getAttribute('href');
			if (!href || href.charAt(0) === '#') return null;
			var abs = txResolveUrl(a.href);
			if (!abs) return null;
			var u = new URL(abs);
			if (u.pathname === location.pathname && u.search === location.search) return null;
			return abs;
		} catch (e) { return null; }
	}

	function txBalanced(html, start) {
		var depth = 0, inStr = false, esc = false, quote = '', end = -1;
		for (var p = start; p < html.length; p++) {
			var c = html.charAt(p);
			if (inStr) {
				if (esc) esc = false;
				else if (c === '\\') esc = true;
				else if (c === quote) inStr = false;
				continue;
			}
			if (c === '"' || c === "'") { inStr = true; quote = c; continue; }
			if (c === '{') depth++;
			else if (c === '}') { depth--; if (depth === 0) { end = p; break; } }
		}
		return end < 0 ? null : html.slice(start, end + 1);
	}

	function txParseCfg(lit) {
		if (!lit) return null;
		var cfg = null;
		try { cfg = JSON.parse(lit); }
		catch (e) {
			try { cfg = (new Function('return (' + lit + ')'))(); } catch (e2) { cfg = null; }
		}
		if (!cfg || typeof cfg !== 'object') return null;
		if (!('wgPageName' in cfg) && !('wgArticleId' in cfg)) return null;
		if (!('wgIsMainPage' in cfg)) cfg.wgIsMainPage = false;
		return cfg;
	}

	function txGrabConfig(html) {
		try {
			var r = html.indexOf('RLCONF=');
			if (r >= 0) {
				var rs = html.indexOf('{', r);
				if (rs >= 0) {
					var cfg = txParseCfg(txBalanced(html, rs));
					if (cfg) return cfg;
				}
			}
			var idx = -1;
			while ((idx = html.indexOf('mw.config.set(', idx + 1)) >= 0) {
				var s = html.indexOf('{', idx);
				if (s < 0) continue;
				var c = txParseCfg(txBalanced(html, s));
				if (c) return c;
			}
			return null;
		} catch (e) { return null; }
	}

	function txWrap() {
		var body = doc.body;
		if (!body) return;
		if (body.querySelector(':scope > .citizen-page-container')) return;
		['.mw-page-container-inner', '.mw-page-container'].forEach(function (sel) {
			body.querySelectorAll(sel).forEach(function (n) {
				while (n.firstChild) n.parentNode.insertBefore(n.firstChild, n);
				n.remove();
			});
		});
		body.querySelectorAll('.mw-footer-container').forEach(function (n) {
			while (n.firstChild) n.parentNode.insertBefore(n.firstChild, n);
			n.remove();
		});
		var wrap = doc.createElement('div');
		wrap.className = 'citizen-page-container';
		while (body.firstChild) wrap.appendChild(body.firstChild);
		body.appendChild(wrap);
		var html = doc.documentElement;
		['citizen-header-position-left',
		 'citizen-feature-autohide-navigation-clientpref-1',
		 'citizen-feature-image-dimming-clientpref-0',
		 'citizen-animations-ready'
		].forEach(function (c) { html.classList.add(c); });
		if (!body.classList.contains('citizen-sections-enabled')) body.classList.add('citizen-sections-enabled');
		if (!body.classList.contains('skin-citizen')) body.classList.add('skin-citizen');
	}

	var UIC_POPOVER_ID = 'ext-checkuser-userinfocard-popover';
	var UIC_MODULE = 'ext.checkUser.userInfoCard';

	function txDetachUserInfoCard() {
		try {
			var p = doc.getElementById(UIC_POPOVER_ID);
			if (!p) return null;
			var closeBtn = p.querySelector('.ext-checkuser-userinfocard-header-close-button');
			if (closeBtn) { try { closeBtn.click(); } catch (e) {} }
			if (p.parentNode) p.parentNode.removeChild(p);
			return p;
		} catch (e) { return null; }
	}

	function txReattachUserInfoCard(node) {
		if (!node || !doc.body) return;
		try { doc.body.appendChild(node); } catch (e) {}
	}

	function txRebindUserInfoCard(cfg) {
		try {
			var trigger = doc.querySelector('#p-views .ext-checkuser-userinfocard-navigation-item a') ||
				doc.querySelector('#p-views #ca-checkuser-userinfocard a');
			if (!trigger) return;
			if (!window.mw || !mw.loader) return;
			var m = null;
			try { m = mw.loader.require && mw.loader.require(UIC_MODULE); } catch (e) { m = null; }
			if (m && typeof m.attachInfoCardButtonHandler === 'function') {
				var uname = (cfg && cfg.wgRelevantUserName) ||
					(mw.config && mw.config.get('wgRelevantUserName')) || '';
				if (!uname && cfg && cfg.wgPageName) {
					uname = String(cfg.wgPageName).replace(/^[^:]+:/, '').split('/')[0].replace(/_/g, ' ');
				}
				if (uname) m.attachInfoCardButtonHandler(trigger, uname);
			} else {
				try {
					mw.loader.using(UIC_MODULE).then(function () {
						try {
							var t2 = doc.querySelector('.ext-checkuser-userinfocard-navigation-item a') ||
								doc.querySelector('#ca-checkuser-userinfocard a');
							if (!t2) return;
							var m2 = mw.loader.require(UIC_MODULE);
							var u2 = (cfg && cfg.wgRelevantUserName) ||
								(mw.config && mw.config.get('wgRelevantUserName')) || '';
							if (typeof m2.attachInfoCardButtonHandler === 'function') {
								m2.attachInfoCardButtonHandler(t2, u2);
							}
							if (!doc.querySelector('.citizen-page-userinfo')) {
								t2.dispatchEvent(new MouseEvent('click', { bubbles: false, cancelable: true }));
							}
						} catch (e3) {}
					});
				} catch (e2) {}
			}
		} catch (e) {}
	}

	function txFallback(href) {
		txSetLoading(false);
		txSetLeaving(false);
		try { doc.documentElement.removeAttribute('data-cv-swapping'); } catch (e) {}
		try { location.assign(href); } catch (e) { location.href = href; }
	}

	function txSwap(url, html, replace) {
		if (typeof window.__cvReboot !== 'function') return false;
		var parsed;
		try { parsed = new DOMParser().parseFromString(html, 'text/html'); } catch (e) { return false; }
		var nb = parsed && parsed.body;
		if (!nb) return false;
		if (!parsed.querySelector('#mw-content-text') || !parsed.querySelector('.vector-header-container')) return false;

		var cfg = txGrabConfig(html);
		var body = doc.body;
		if (!body) return false;
		var uic = txDetachUserInfoCard();

		txSetLeaving(true);
		setTimeout(function () {
			txSetLeaving(false);
			try { doc.documentElement.setAttribute('data-cv-swapping', '1'); } catch (e) {}
			body.className = nb.className;
			body.innerHTML = nb.innerHTML;
			txWrap();
			txReattachUserInfoCard(uic);
			try { if (parsed.title) doc.title = parsed.title; } catch (e) {}
			try {
				if (replace) history.replaceState(null, '', url);
				else history.pushState(null, '', url);
			} catch (e) {}
			lastDocUrl = location.href.split('#')[0];

			txRebindUserInfoCard(cfg);

			var settled = false;
			var timer = setTimeout(function () {
				if (settled) return; settled = true;
				txFallback(url);
			}, TX_MAX_MS);
			window.__cvReboot(cfg, function () {
				if (settled) return; settled = true;
				clearTimeout(timer);
				if (window.__cvInited) {
					try { doc.documentElement.removeAttribute('data-cv-swapping'); } catch (e) {}
					txSetLoading(false);
					try { window.scrollTo(0, 0); } catch (e) {}
				} else {
					txFallback(url);
				}
			});
		}, TX_FADE_MS);
		return true;
	}

	function txNav(href, replace) {
		var seq = ++txSeq;
		txSetLoading(true);
		var ctrl = null, to = 0;
		try { ctrl = new AbortController(); } catch (e) {}
		if (ctrl) to = setTimeout(function () { try { ctrl.abort(); } catch (e) {} }, TX_MAX_MS);
		fetch(href, { credentials: 'same-origin', signal: ctrl ? ctrl.signal : undefined })
			.then(function (r) {
				if (!r.ok) throw new Error('bad status ' + r.status);
				var len = parseInt(r.headers.get('content-length') || '0', 10);
				if (len && len > TX_MAX_BYTES) throw new Error('too large');
				var finalUrl = r.url || href;
				return r.text().then(function (t) {
					if (t.length > TX_MAX_BYTES) throw new Error('too large');
					return { url: finalUrl, html: t };
				});
			})
			.then(function (res) {
				clearTimeout(to);
				if (seq !== txSeq) return; 
				if (!txSwap(res.url, res.html, replace)) txFallback(href);
			})
			.catch(function () {
				clearTimeout(to);
				if (seq !== txSeq) return;
				txFallback(href);
			});
	}

	function txOnClick(e) {
		if (e.defaultPrevented) return;
		if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		if (typeof window.__cvReboot !== 'function') return;
		var t = e.target;
		var a = (t && t.closest) ? t.closest('a') : null;
		if (!a) return;
		if (a.target && a.target !== '_self') return;
		var href = txIsInternal(a);
		if (!href) return;
		e.preventDefault();
		txNav(href);
	}
	doc.addEventListener('click', txOnClick, true);

	window.addEventListener('popstate', function () {
		var base = location.href.split('#')[0];
		var sameDoc = (base === lastDocUrl);
		lastDocUrl = base;
		if (sameDoc) return;
		var href = txResolveUrl(location.href);
		if (href) { txNav(href, true); return; }
		try { doc.documentElement.removeAttribute('data-cv-swapping'); } catch (e) {}
		if (location.origin === SITE_ORIGIN) location.reload();
	});
})();
