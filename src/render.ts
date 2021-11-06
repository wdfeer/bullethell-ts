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
				d.render(context);
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
	offset: Vector2 = Vector2.Zero,
	color: string = 'black',
	alpha: number = 1,
	fontSize: number = 80
) {
	ctx.globalAlpha = alpha;
	ctx.fillStyle = color;
	ctx.font = `${Math.floor(80 * sizeMult())}px Bahnschrift`;
	ctx.textAlign = 'center';
	let pos: Vector2 = new Vector2(ctx.canvas.width / 2, ctx.canvas.height / 2);
	pos.add(offset);
	ctx.fillText(text, pos.x, pos.y);
}
