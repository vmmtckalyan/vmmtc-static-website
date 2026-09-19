/* ==========================================================================
   VMMTC Gallery — masonry load-more + lightbox
   ========================================================================== */
(function () {
	'use strict';

	var IMAGES = [
		'assets/gallery/women.webp',
		'assets/gallery/pastorNic.webp',
		'assets/gallery/worship1.webp',
		'assets/gallery/kids.webp',
		'assets/gallery/worship.webp',
		'assets/gallery/event.webp',
		'assets/gallery/kid.webp',
		'assets/gallery/youth.webp',
	];

	var CAPTIONS = [
		'Women of the church in fellowship',
		'Pastor Nic teaching during a gathering',
		'Congregation singing during worship',
		'A children\u2019s ministry moment',
		'Worship service at Vernon Memorial',
		'A church community event',
		'A child taking part in church activities',
		'A youth fellowship gathering',
	];

	var INITIAL_COUNT = 4;
	var loadedCount = INITIAL_COUNT;
	var currentIndex = 0;

	var masonry = document.getElementById('masonry');
	var loader = document.getElementById('galleryLoader');
	if (!masonry) return;

	var countLabel = document.getElementById('galleryCount');

	function i18nTa() {
		return !!(window.I18N && window.I18N.lang() === 'ta');
	}

	function countText() {
		if (i18nTa()) {
			return window.I18N.get('gallery_showing', { shown: loadedCount, total: IMAGES.length });
		}
		return 'Showing ' + loadedCount + ' of ' + IMAGES.length + ' images';
	}

	function viewText() {
		if (i18nTa()) return window.I18N.get('View');
		return 'View';
	}

	function render() {
		masonry.innerHTML = IMAGES.slice(0, loadedCount)
			.map(function (img, i) {
				return (
					'<button type="button" class="masonry__item" data-index="' +
					i +
					'" aria-label="' +
					CAPTIONS[i].replace(/"/g, '&quot;') +
					'">' +
					'<img src="' + img + '" alt="' + CAPTIONS[i].replace(/"/g, '&quot;') + '" loading="lazy">' +
					'<span class="masonry__hover"><span>' + viewText() + '</span></span>' +
					'</button>'
				);
			})
			.join('');

		if (countLabel) {
			countLabel.textContent = countText();
		}

		updateButtons();
		bindOpen();
	}

	function updateButtons() {
		var resetBtn = document.getElementById('galleryReset');
		var moreBtn = document.getElementById('galleryMore');
		if (resetBtn) resetBtn.disabled = loadedCount === INITIAL_COUNT;
		if (moreBtn) moreBtn.disabled = loadedCount >= IMAGES.length;
	}

	function bindOpen() {
		masonry.querySelectorAll('.masonry__item').forEach(function (item) {
			item.addEventListener('click', function () {
				currentIndex = parseInt(item.getAttribute('data-index'), 10);
				openLightbox(currentIndex);
			});
		});
	}

	// --- Lightbox ---
	var lightbox = document.getElementById('lightbox');
	var lightboxImg = document.getElementById('lightboxImg');
	var lightboxPrev = document.getElementById('lightboxPrev');
	var lightboxNext = document.getElementById('lightboxNext');
	var lightboxClose = document.getElementById('lightboxClose');
	var lastFocused = null;

	function openLightbox(index) {
		if (!lightbox) return;
		lastFocused = document.activeElement;
		currentIndex = index;
		lightboxImg.src = IMAGES[currentIndex];
		lightboxImg.alt = CAPTIONS[currentIndex];
		lightbox.style.display = 'flex';
		document.body.classList.add('nav-open');
		updateArrows();
		if (lightboxClose) lightboxClose.focus();
	}

	function closeLightbox() {
		if (!lightbox) return;
		lightbox.style.display = 'none';
		document.body.classList.remove('nav-open');
		if (lastFocused && lastFocused.focus) lastFocused.focus();
	}

	function focusableEls() {
		if (!lightbox) return [];
		return Array.prototype.filter.call(lightbox.querySelectorAll('button, a[href], [tabindex]'), function (el) {
			return !el.disabled && el.offsetParent !== null;
		});
	}

	function trapFocus(e) {
		if (!lightbox || lightbox.style.display !== 'flex') return;
		if (e.key !== 'Tab') return;
		var items = focusableEls();
		if (items.length === 0) return;
		var first = items[0];
		var last = items[items.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}

	function updateArrows() {
		if (lightboxPrev) lightboxPrev.disabled = currentIndex === 0;
		if (lightboxNext) lightboxNext.disabled = currentIndex === IMAGES.length - 1;
	}

function step(dir) {
		var next = currentIndex + dir;
		if (next < 0 || next >= IMAGES.length) return;
		currentIndex = next;
		if (lightbox && lightboxImg) {
			lightboxImg.src = IMAGES[currentIndex];
			lightboxImg.alt = CAPTIONS[currentIndex];
			updateArrows();
		}
	}

	if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
	if (lightboxPrev) lightboxPrev.addEventListener('click', function () { step(-1); });
	if (lightboxNext) lightboxNext.addEventListener('click', function () { step(1); });
	document.addEventListener('keydown', trapFocus);
	if (lightbox) {
		lightbox.addEventListener('click', function (e) {
			if (e.target === lightbox) closeLightbox();
		});
	}
	document.addEventListener('keydown', function (e) {
		if (!lightbox || lightbox.style.display !== 'flex') return;
		if (e.key === 'Escape') closeLightbox();
		if (e.key === 'ArrowLeft') step(-1);
		if (e.key === 'ArrowRight') step(1);
	});

	// --- Load more / reset ---
	var moreBtn = document.getElementById('galleryMore');
	var resetBtn = document.getElementById('galleryReset');

	if (moreBtn) {
		moreBtn.addEventListener('click', function () {
			loadedCount = Math.min(loadedCount * 2, IMAGES.length);
			render();
		});
	}
	if (resetBtn) {
		resetBtn.addEventListener('click', function () {
			loadedCount = INITIAL_COUNT;
			render();
		});
	}

	document.addEventListener('i18n:change', function () {
		if (countLabel) countLabel.textContent = countText();
		masonry.querySelectorAll('.masonry__hover span').forEach(function (s) {
			s.textContent = viewText();
		});
	});

	render();
})();