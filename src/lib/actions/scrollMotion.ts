import type { Action } from 'svelte/action';

type MotionOptions = {
	/**
	 * Use hysteresis (separate enter/exit thresholds). Default: false.
	 */
	hysteresis?: boolean;
	/**
	 * Minimum intersection ratio to trigger entrance animation
	 * - for basic mode, acts as the only threshold (default 0.05)
	 * - for hysteresis mode, default 0.35
	 */
	enterThreshold?: number;
	/**
	 * Maximum intersection ratio to trigger exit (used only with hysteresis).
	 * Default 0.12
	 */
	exitThreshold?: number;
	/**
	 * Root margin for IO
	 */
	rootMargin?: string;
	/**
	 * How far (px) the element starts translating from
	 */
	offset?: number;
	/**
	 * Show only once, and keep visible after first reveal (basic mode). Default: true
	 */
	once?: boolean;
	/**
	 * When once=false in basic mode, hide when leaving the viewport. Default: false
	 */
	hideOnExit?: boolean;
};

let lastScrollY = 0;

const getScrollDirection = () => {
	if (typeof window === 'undefined') return 'down';
	const current = window.scrollY;
	const direction = current >= lastScrollY ? 'down' : 'up';
	lastScrollY = current;
	return direction as 'down' | 'up';
};

export const scrollMotion: Action<HTMLElement, MotionOptions | undefined> = (node, options) => {
	if (typeof IntersectionObserver === 'undefined') {
		return;
	}

	const useHysteresis = options?.hysteresis ?? false;
	const enterThreshold = options?.enterThreshold ?? (useHysteresis ? 0.35 : 0.05);
	const exitThreshold = options?.exitThreshold ?? 0.12;
	const rootMargin = options?.rootMargin ?? (useHysteresis ? '0px 0px -10% 0px' : '0px');
	const baseOffset = options?.offset ?? 48;
	const once = options?.once ?? true;
	const hideOnExit = options?.hideOnExit ?? false;

	node.classList.add('scroll-motion');
	node.style.setProperty('--motion-offset', `${baseOffset}px`);

	let visible = false;

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			const ratio = entry.intersectionRatio ?? 0;

			if (useHysteresis) {
				// Enter with higher threshold, exit with lower threshold
				if (!visible && ratio >= enterThreshold) {
					const direction = getScrollDirection();
					node.style.setProperty('--motion-offset', direction === 'down' ? `${baseOffset}px` : `-${baseOffset}px`);
					requestAnimationFrame(() => {
						node.classList.add('is-visible');
						visible = true;
					});
					return;
				}
				if (visible && ratio <= exitThreshold) {
					node.classList.remove('is-visible');
					visible = false;
				}
				return;
			}

			// Basic mode
			if (!visible && ratio >= enterThreshold) {
				const direction = getScrollDirection();
				node.style.setProperty('--motion-offset', direction === 'down' ? `${baseOffset}px` : `-${baseOffset}px`);
				requestAnimationFrame(() => {
					node.classList.add('is-visible');
					visible = true;
					if (once) observer.unobserve(node);
				});
				return;
			}

			if (!once && hideOnExit && visible && ratio < enterThreshold) {
				node.classList.remove('is-visible');
				visible = false;
			}
		});
	}, { threshold: useHysteresis ? [exitThreshold, enterThreshold] : [enterThreshold], rootMargin });

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
			node.classList.remove('scroll-motion', 'is-visible');
			node.style.removeProperty('--motion-offset');
		}
	};
};

