function setDrawableWithIdOrPush(drawable: drawable, id: string): void {
	if (!setDrawableWithId(drawable, id)) drawables.push(drawable);
}
function setDrawableWithId(drawable: drawable, id: string): boolean {
	for (let i = 0; i < drawables.length; i++) {
		if (drawables[i].id != id) continue;
		drawables[i] = drawable;
		return true;
	}
	return false;
}

function render(): void {
	let context = canv.getContext('2d')!;
	context.clearRect(0, 0, canv.width, canv.height);

	let getZ = (d?: drawable) => {
		if (d) return d.zIndex;
		return 0;
	};
	for (let i = drawables.min(getZ); i <= drawables.max(getZ); i++) {
		drawables.forEach((d) => {
			if (d.zIndex == i) {
				d.Draw(context);
			}
		});
	}
}

function drawCircle(
	ctx: CanvasRenderingContext2D,
	radius: number,
	center: Vector2,
	color: string = 'black',
	alpha: number = 1
): void {
	ctx.beginPath();
	ctx.globalAlpha = alpha;
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.strokeStyle = color;
	ctx.stroke();
}

function fillCircle(
	ctx: CanvasRenderingContext2D,
	radius: number,
	center: Vector2,
	color: string = 'black',
	alpha: number = 1
): void {
	ctx.beginPath();
	ctx.globalAlpha = alpha;
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}

function drawCenteredText(
	ctx: CanvasRenderingContext2D,
	text: string,
	color: string = 'black',
	alpha: number = 1,
	fontStyle: string = '96px Bahnschrift'
) {
	ctx.globalAlpha = alpha;
	ctx.fillStyle = color;
	ctx.font = fontStyle;
	ctx.textAlign = 'center';
	ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height / 2);
}
