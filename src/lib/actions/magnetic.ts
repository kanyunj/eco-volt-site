import type { Action } from 'svelte/action';

type MagneticOptions = {
	strength?: number;
	scale?: number;
	hoverLift?: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const magnetic: Action<HTMLElement, MagneticOptions | undefined> = (node, options) => {
	const opts = {
		strength: options?.strength ?? 6,
		scale: options?.scale ?? 1.04,
		hoverLift: options?.hoverLift ?? 10
	};

	let frame: number | null = null;

	const animate = (x: number, y: number, scale = opts.scale) => {
		if (frame) cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			node.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
		});
	};

	const handlePointerMove = (event: PointerEvent) => {
		const rect = node.getBoundingClientRect();
		const offsetX = event.clientX - (rect.left + rect.width / 2);
		const offsetY = event.clientY - (rect.top + rect.height / 2);

		const translateX = clamp(offsetX / opts.strength, -opts.hoverLift, opts.hoverLift);
		const translateY = clamp(offsetY / opts.strength, -opts.hoverLift, opts.hoverLift);
		animate(translateX, translateY);
	};

	const reset = () => {
		if (frame) cancelAnimationFrame(frame);
		node.style.transform = 'translate(0, 0) scale(1)';
	};

	const handlePointerLeave = () => {
		reset();
	};

	const handlePointerDown = () => {
		animate(0, 2, 0.98);
	};

	const handlePointerUp = () => {
		reset();
	};

	node.style.willChange = 'transform';
	node.addEventListener('pointermove', handlePointerMove);
	node.addEventListener('pointerleave', handlePointerLeave);
	node.addEventListener('pointerdown', handlePointerDown);
	node.addEventListener('pointerup', handlePointerUp);

	return {
		destroy() {
			if (frame) cancelAnimationFrame(frame);
			node.removeEventListener('pointermove', handlePointerMove);
			node.removeEventListener('pointerleave', handlePointerLeave);
			node.removeEventListener('pointerdown', handlePointerDown);
			node.removeEventListener('pointerup', handlePointerUp);
			node.style.removeProperty('will-change');
			node.style.removeProperty('transform');
		}
	};
};


