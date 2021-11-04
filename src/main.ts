const canv = document.querySelector('canvas')!;
canv.width = window.innerWidth;
canv.height = window.innerHeight;
window.onresize = () => {
	canv.width = window.innerWidth;
	canv.height = window.innerHeight;
};

window.onkeydown = (event: KeyboardEvent) => {
	onKeyPress(event.key);
};
canv.addEventListener('click', (event) => onClick(event));
canv.addEventListener('drag', (event) => onDrag(event));
