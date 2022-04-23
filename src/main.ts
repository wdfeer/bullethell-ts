const canv = document.querySelector('canvas')!;
canv.width = window.innerWidth;
canv.height = window.innerHeight;

function isOffscreenX(x: number) {
	return x > window.innerWidth;
}
function isOffscreenY(y: number) {
	return y > window.innerHeight;
}
window.onresize = () => {
	getCircles().forEach((renderObject) => {
		if (isOffscreenX(renderObject.center.x))
			renderObject.center.x =
				(window.innerWidth * renderObject.center.x) / canv.width;
		if (isOffscreenY(renderObject.center.y))
			renderObject.center.y =
				(window.innerHeight * renderObject.center.y) / canv.height;
	});
	canv.width = window.innerWidth;
	canv.height = window.innerHeight;
	sizeMult = (canv.width + canv.height) / 2600;
};

const audio = document.querySelector('audio')!;
function playSound(src: string, volume: number = 1) {
	audio.src = src;
	audio.volume = volume;
	audio.play();
}

window.onkeydown = (event: KeyboardEvent) => {
	onKeyPress(event.code);
};
canv.addEventListener('click', (event) => onClick(event));