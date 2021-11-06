type draw = (ctx: CanvasRenderingContext2D) => void;
class drawable {
	isDrawn: boolean = true;
	draw: draw;
	render(ctx: CanvasRenderingContext2D) {
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
function getDrawableWithId(id: string): drawable | null {
	for (let i = 0; i < drawables.length; i++) {
		if (drawables[i] && drawables[i].id == id) return drawables[i];
	}
	return null;
}
function getDrawablesOfType<Type extends drawable>(c: {
	new (arg1: any, arg2: any, arg3: any): Type;
}): Type[] {
	return drawables.filter((x) => x instanceof c) as Type[];
}
function getCircles(): stationaryCircle[] {
	return getDrawablesOfType(stationaryCircle);
}
function getBodies(): body[] {
	return getDrawablesOfType(body);
}
function getPlayer(): player {
	return getDrawablesOfType(player)[0];
}
function getCoins(): coin[] {
	return getDrawablesOfType(coin);
}
