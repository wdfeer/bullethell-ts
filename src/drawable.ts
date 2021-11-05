type draw = (ctx: CanvasRenderingContext2D) => void;
class drawable {
	isDrawn: boolean = true;
	draw: draw;
	Draw(ctx: CanvasRenderingContext2D) {
		if (this.isDrawn) this.draw(ctx);
	}
	zIndex: number;
	id: string;
	delete() {
		delete drawables[drawables.indexOf(this)];
	}
	constructor(draw: draw = () => {}, zIndex: number = 0, id: string = '') {
		this.draw = draw;
		this.zIndex = zIndex;
		this.id = id;
		drawables.push(this);
	}
}

var drawables: drawable[] = [];
function getCircles(): stationaryCircle[] {
	return drawables.filter(
		(x) => x instanceof stationaryCircle
	) as stationaryCircle[];
}
function getBodies(): body[] {
	return drawables.filter((x) => x instanceof body) as body[];
}
function getPlayer(): player {
	return drawables.filter((x) => x instanceof player)[0] as player;
}
