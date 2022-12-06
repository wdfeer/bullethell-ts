const canvas = document.querySelector('canvas')!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function isOffscreenX(x: number) {
	return x > window.innerWidth || x < 0;
}
function isOffscreenY(y: number) {
	return y > window.innerHeight || y < 0;
}
window.onresize = () => {
	getCircles().forEach((renderObject) => {
		if (isOffscreenX(renderObject.center.x))
			renderObject.center.x =
				(window.innerWidth * renderObject.center.x) / canvas.width;
		if (isOffscreenY(renderObject.center.y))
			renderObject.center.y =
				(window.innerHeight * renderObject.center.y) / canvas.height;
	});
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	distScale = (canvas.width + canvas.height) / 2600;
};

const audio = document.querySelector('audio')!;
function playSound(src: string, volume: number = 1) {
	audio.src = src;
	audio.volume = volume;
	audio.play();
}

var cursorPos = new Vector2(0, 0);
document.onmousemove = (event: MouseEvent) => {
	cursorPos = getCursorPos(event);
}
window.onkeydown = (event: KeyboardEvent) => {
	onKeyDown(event.code);
};
canvas.addEventListener('click', (event) => onClick(event));