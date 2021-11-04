const canv = document.querySelector('canvas')!;
canv.width = window.innerWidth;
canv.height = window.innerHeight;
window.onresize = () => {
	canv.width = window.innerWidth;
	canv.height = window.innerHeight;
};

const audio = document.querySelector('audio')!;
function playSound(src: string, volume: number = 1) {
	audio.src = src;
	audio.volume = volume;
	audio.play();
}

window.onkeydown = (event: KeyboardEvent) => {
	onKeyPress(event.key);
};
canv.addEventListener('click', (event) => onClick(event));
