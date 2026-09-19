/* ==========================================================================
   VMMTC — global interactions (nav, mobile menu, reveal on scroll)
   ========================================================================== */
(function () {
	'use strict';

	document.documentElement.classList.add('js');

	document.addEventListener('DOMContentLoaded', function () {
		var navbar = document.getElementById('navbar');
		var toggle = document.getElementById('navToggle');
		var menu = document.getElementById('mobileMenu');

		// Navbar solid state on scroll (home page only — inner pages use .solid-always)
		var onScroll = function () {
			if (navbar && !navbar.classList.contains('solid-always')) {
				navbar.classList.toggle('solid', window.scrollY > 24);
			}
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });

		// Mobile menu toggle + body scroll lock
		if (toggle && menu) {
			toggle.setAttribute('aria-expanded', 'false');
			toggle.addEventListener('click', function () {
				var open = menu.classList.toggle('open');
				document.body.classList.toggle('nav-open', open);
				toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
				var icon = toggle.querySelector('.icon-open');
				var close = toggle.querySelector('.icon-close');
				if (icon && close) {
					icon.style.display = open ? 'none' : '';
					close.style.display = open ? '' : 'none';
				}
			});
		}

		// Close mobile menu when a link inside it is clicked
		if (menu) {
			menu.querySelectorAll('a, button').forEach(function (el) {
				el.addEventListener('click', function () {
					if (el.closest('.lang-switch')) return;
					menu.classList.remove('open');
					document.body.classList.remove('nav-open');
					if (toggle) toggle.setAttribute('aria-expanded', 'false');
				});
			});
		}

		// Footer copyright year
		var yearEl = document.getElementById('year');
		if (yearEl) {
			yearEl.textContent = String(new Date().getFullYear());
		}

		// Reveal-on-scroll (replaces framer-motion fade-up)
		var reveals = document.querySelectorAll('.reveal, .reveal-fade');
		if ('IntersectionObserver' in window) {
			var observer = new IntersectionObserver(
				function (entries) {
					entries.forEach(function (entry) {
						if (entry.isIntersecting) {
							entry.target.classList.add('in-view');
							observer.unobserve(entry.target);
						}
					});
				},
				{ rootMargin: '-80px', threshold: 0 }
			);
			reveals.forEach(function (el) {
				observer.observe(el);
			});
		} else {
			reveals.forEach(function (el) {
				el.classList.add('in-view');
			});
		}
	});

	// Pause autoplay videos for users who prefer reduced motion
	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		document.querySelectorAll('video[autoplay]').forEach(function (v) {
			try { v.pause(); } catch (e) {}
		});
	}
})();