export class Food {
	constructor(game) {
		this.game = game;
		this.placeFood();
	}

	setFoodPlace() {
		let coordinates = {};
		let snakeParts = this.game.snake.parts;
		coordinates.x = Math.floor(Math.random() * this.game.gameCellCount);
		coordinates.y = Math.floor(Math.random() * this.game.gameCellCount);

		let foodNotInSnake = snakeParts.every((snakePart) => {
			return !(snakePart.x === coordinates.x && snakePart.y === coordinates.y);
		});

		this.x = coordinates.x;
		this.y = coordinates.y;

		if (foodNotInSnake) {
			this.x = coordinates.x;
			this.y = coordinates.y;
		} else {
			this.setFoodPlace();
		}
	}

	placeFood() {
		this.setFoodPlace();
	}

	renderFood() {
		this.game.grid.fillCell(this.x, this.y, "food-cell");
	}
}
