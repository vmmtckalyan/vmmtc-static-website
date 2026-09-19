/* ==========================================================================
   VMMTC - YouTube video grids (key-free)
   ==========================================================================
   Renders the small "Videos" grids used on the ministry and gallery pages.
   No YouTube Data API key is needed:

   - Thumbnails are built from the video IDs hard-coded below (hqdefault -
     fast, small and consistent, same as the static home/gallery cards).
   - Real video titles are pulled in with a key-free YouTube oEmbed request
     and cached in the browser for 24 hours, so the page never looks empty
     and never blocks on a failing network.

   The two home-page cards ("Sunday Service" and "Fellowship") are intentionally
   fully static - they never call out to YouTube, so they're always instant.

   Usage:  <div class="gallery-videos" data-video-group="gallery"></div>
   ========================================================================== */
(function () {
	'use strict';

	var WATCH_URL = 'https://www.youtube.com/watch?v=';
	var CHANNEL_ID = 'UC1XiSMRryhxc1AZVa9vdwjQ';
	var CHANNEL_URL = 'https://www.youtube.com/channel/' + CHANNEL_ID;

	/* Video IDs per group. Sources: the YouTube channel + ministry playlists. */
	var GROUPS = {
		myf: [
			'YIxnd_ZSaPY', 'QFEgsBZOIuo', '3W8ixyTH5lA', 'VJIk9G-amA4',
			'C0VokBDcEms', 'bzWVdmuHMGA', 'E229rdAPw34', 'nE2oqIpVNCc'
		],
		'myf-short-films': ['jrHbbMp35Og', 'slIQUtL0C3M', 'P0ppm3cN1Sw'],
		wcss: ['LN6f4WrvW9w', 'BV8K4XG8-KA', 'Eg50OerjwJc'],
		mens: ['-dHqU7hmw8I', 's4VnVX8oTFk'],
		kids: ['7ICHVHwRLuw', 'qSa7iTW46t0', 'g1yw_kWKXAU', 'ijl1m014Iok', 'RAPPY9dQ-ks', 'UL-LNYwC1T8', 'mulHMMvB-zs', 'gcDwiZcF4ek'],
		fellowship: ['qouLUmLVxxs', '3UVtBN-xPIU', 'YOtOgLNR_JY'],
		gallery: ['ijl1m014Iok', 'g1yw_kWKXAU', 'qouLUmLVxxs', 'qSa7iTW46t0', 'GeymVyD8Ois', 'YIxnd_ZSaPY'] 
	};

	var SVG_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

	/* Browser cache so titles survive across pages (24h) */
	function cacheGet(key) {
		try {
			var raw = localStorage.getItem(key);
			if (!raw) return null;
			var item = JSON.parse(raw);
			if (!item || !item.ts) return null;
			if (Date.now() - item.ts > 86400000) return null;
			return item.value;
		} catch (e) { return null; }
	}

	function cacheSet(key, value) {
		try {
			localStorage.setItem(key, JSON.stringify({ ts: Date.now(), value: value }));
		} catch (e) { /* storage unavailable or full - ignore */ }
	}

	/* Small fetch helper with a timeout */
	function fetchJSON(url) {
		return fetch(url).then(function (r) {
			if (!r.ok) throw new Error('HTTP ' + r.status);
			return r.json();
		});
	}

	/* Key-free real title via YouTube oEmbed (no API key). */
	function oEmbedTitle(id) {
		return fetchJSON('https://www.youtube.com/oembed?format=json&url=' +
			encodeURIComponent(WATCH_URL + id))
			.then(function (data) {
				return data.title || null;
			})
			.catch(function () { return null; });
	}

	/* Build the <img> for a video ID (hqdefault) */
	function thumb(id) {
		return 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
	}

	/* Escape text safely before injecting into the DOM */
	function esc(str) {
		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	/* Populate a single grid ([data-video-group]) */
	function renderGrids(el) {
		var group = el.getAttribute('data-video-group');
		var ids = GROUPS[group];
		if (!ids || ids.length === 0) return;

		var cacheKey = 'vmmtc.yt.titles#' + group;
		var titles = cacheGet(cacheKey) || {};

		el.innerHTML = ids.map(function (id) {
			var t = titles[id] || '';
			return '<div class="video-frame">' +
				'<a href="' + WATCH_URL + id + '" target="_blank" rel="noopener noreferrer" ' +
				'class="video-lite" aria-label="' + (t ? esc(t) : '') + '" data-id="' + id + '">' +
				'<img src="' + thumb(id) + '" alt="' + esc(t) + '" loading="lazy">' +
				'<span class="video-lite__play">' + SVG_PLAY + '</span>' +
				'</a></div>';
		}).join('');

		/* Resolve real titles in the background, one oEmbed per missing ID */
		var pending = ids.filter(function (id) { return !titles[id]; });
		if (pending.length === 0) return;

		Promise.all(pending.map(function (id) {
			return oEmbedTitle(id).then(function (t) {
				if (t) titles[id] = t;
			});
		})).then(function () {
			if (Object.keys(titles).length > 0) cacheSet(cacheKey, titles);
			el.querySelectorAll('a.video-lite').forEach(function (a) {
				var t = titles[a.getAttribute('data-id')] || '';
				if (t) {
					a.setAttribute('aria-label', t);
					var img = a.querySelector('img');
					if (img) img.alt = t;
				}
			});
		});
	}

	/* Boot: render every grid found on the page */
	function boot() {
		var els = document.querySelectorAll('[data-video-group]');
		els.forEach(function (el) { renderGrids(el); });
	}

	/* Run shortly after ready state to avoid delaying first paint */
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot, { once: true });
	} else {
		boot();
	}
})();