class SnakePart {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Snake {
	constructor(game, x, y, initialPartsAmount) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.isAlive = true;

		this.upButton = document.getElementById("game-up-button");
		this.downButton = document.getElementById("game-down-button");
		this.leftButton = document.getElementById("game-left-button");
		this.rightButton = document.getElementById("game-right-button");

		this.xSpeed = 1;
		this.ySpeed = 0;
		this.canChangeDirection = true;

		this.parts = [];
		for (let i = 0; i < initialPartsAmount; i++) {
			this.parts.push(new SnakePart(x - i, y));
		}

		document.onkeydown = (e) => {
			this.controller(e.key);
		};
	}

	activateControllerButton(btn) {
		btn.classList.add("active");
		setTimeout(() => {
			btn.classList.remove("active");
		}, 100);
	}

	controller(key) {
		if (key === "Enter") {
			this.game.gamePauseUnpause();
			this.game.toggleGameStatusClass();
		}

		if (key === "=" || key === "+") {
			this.game.setGameSpeed(this.game.gameSpeed + 1);
		}

		if (key === "-" || key === "_") {
			this.game.setGameSpeed(this.game.gameSpeed - 1);
		}

		if (key === "Escape") {
			this.game.gameSettingsForm.classList.remove("active");
		}

		if (this.game.isPaused) {
			return;
		}

		if (key === "ArrowLeft") {
			this.activateControllerButton(this.leftButton);
			if (this.ySpeed !== 0 && this.canChangeDirection) {
				this.canChangeDirection = false;
				this.xSpeed = -1;
				this.ySpeed = 0;
			}
		}

		if (key === "ArrowRight") {
			this.activateControllerButton(this.rightButton);
			if (this.ySpeed !== 0 && this.canChangeDirection) {
				this.canChangeDirection = false;
				this.xSpeed = 1;
				this.ySpeed = 0;
			}
		}

		if (key === "ArrowUp") {
			this.activateControllerButton(this.upButton);
			if (this.xSpeed !== 0 && this.canChangeDirection) {
				this.canChangeDirection = false;
				this.xSpeed = 0;
				this.ySpeed = -1;
			}
		}

		if (key === "ArrowDown") {
			this.activateControllerButton(this.downButton);
			if (this.xSpeed !== 0 && this.canChangeDirection) {
				this.canChangeDirection = false;
				this.xSpeed = 0;
				this.ySpeed = 1;
			}
		}
	}

	addPart() {
		let lastPart = this.parts[this.parts.length - 1];
		this.parts.push(new SnakePart(lastPart.x, lastPart.y));
	}

	//Update the snake in the canvas.
	update() {
		this.x += this.xSpeed;
		this.y += this.ySpeed;

		if (this.game.hardMode === true) {
			if (
				this.x > this.game.gameCellCount - 1 ||
				this.x < 0 ||
				this.y > this.game.gameCellCount - 1 ||
				this.y < 0
			) {
				this.die();
				return;
			}
		}

		if (this.x > this.game.gameCellCount - 1) {
			this.x = 0;
		}

		if (this.x < 0) {
			this.x = this.game.gameCellCount - 1;
		}

		if (this.y > this.game.gameCellCount - 1) {
			this.y = 0;
		}

		if (this.y < 0) {
			this.y = this.game.gameCellCount - 1;
		}

		//Renders each part in the canvas starting by the last part.
		for (let i = this.parts.length - 1; i >= 0; i--) {
			let part = this.parts[i];

			if (i != 0) {
				part.x = this.parts[i - 1].x;
				part.y = this.parts[i - 1].y;

				if (this.x == part.x && this.y == part.y) {
					this.die();
				}
			} else {
				part.x = this.x;
				part.y = this.y;
			}

			this.game.grid.fillCell(part.x, part.y, "snake-cell");
		}

		this.canChangeDirection = true;
	}

	die() {
		this.isAlive = false;
	}
}

class Food {
	constructor(game) {
		this.game = game;
		this.placeFood();
	}

	setFoodPlace() {
		let coordinates = {};
		let foodInSnake = 0;
		let snakeParts = this.game.snake.parts;

		coordinates.x = Math.floor(Math.random() * this.game.gameCellCount);
		coordinates.y = Math.floor(Math.random() * this.game.gameCellCount);

		snakeParts.forEach((snakePart) => {
			foodInSnake +=
				snakePart.x === coordinates.x && snakePart.y === coordinates.y ? 1 : 0;
		});

		if (foodInSnake > 0) {
			this.setFoodPlace();
		} else {
			this.x = coordinates.x;
			this.y = coordinates.y;
		}
	}

	placeFood() {
		this.game.scoreFace.classList.add("bi-emoji-kiss");
		setTimeout(() => {
			this.game.scoreFace.classList.remove("bi-emoji-kiss");
		}, 500);

		this.setFoodPlace();
	}

	renderFood() {
		this.game.grid.fillCell(this.x, this.y, "food-cell");
	}
}

class RenderGrid {
	constructor(game) {
		this.game = game;
		this.grid = [];
		this.buildGrid();
	}

	buildGrid() {
		let divStageWidthHeight = 0;
		this.game.divStage.innerHTML = "";

		for (let x = 0; x < this.game.gameCellCount; x++) {
			this.grid[x] = [];
			divStageWidthHeight += this.game.gameCellSize;

			for (let y = 0; y < this.game.gameCellCount; y++) {
				//Create a tile to add to the grid.
				let gridCell = document.createElement("div");
				gridCell.style.width = gridCell.style.height =
					this.game.gameCellSize + "px";

				gridCell.style.left = x * this.game.gameCellSize + "px";
				gridCell.style.top = y * this.game.gameCellSize + "px";

				//Add the tile to the front end grid.
				this.game.divStage.appendChild(gridCell);

				this.grid[x][y] = {
					div: gridCell,
					isFilled: false,
					color: "white",
					className: "empty-cell",
				};
			}
		}

		this.game.divStage.style.width = `${divStageWidthHeight}px`;
		this.game.divStage.style.height = `${divStageWidthHeight}px`;
	}

	//Mark a tile as filled with some color.
	fillCell(x, y, className) {
		if (this.grid[x]) {
			if (this.grid[x][y]) {
				let cell = this.grid[x][y];
				cell.isFilled = true;
				cell.className = className;
			}
		}
	}

	update() {
		for (let x = 0; x < this.game.gameCellCount; x++) {
			for (let y = 0; y < this.game.gameCellCount; y++) {
				let cell = this.grid[x][y];
				cell.div.classList.value = cell.className;

				/*Очищаем для следующего апдейта */
				cell.isFilled = false;
				cell.className = "empty-cell";
			}
		}
	}
}

class Game {
	constructor(
		gameCellCount,
		gameCellSize,
		gameSpeed,
		divStageId,
		spanScoreId,
		spanDeathsId,
		spanMaxScoreId,
		gameStatusBtnId
	) {
		this.gameCellSize = gameCellSize;
		this.width = gameCellSize;
		this.height = gameCellSize;
		this.gameCellCount = gameCellCount;
		this.gameActiveColor = "#99c803";
		this.initialSnakeWidth = 2;
		this.initialSnakeSpeed = gameSpeed;
		this.gameUpdateInterval = 0;
		this.hardMode = false;

		this.divStage = document.getElementById(divStageId);
		this.spanScore = document.getElementById(spanScoreId);
		this.scoreFace = this.spanScore.parentNode.getElementsByTagName("i")[0];
		this.spanDeaths = document.getElementById(spanDeathsId);
		this.spanMaxScore = document.getElementById(spanMaxScoreId);
		this.gameStatusBtn = document.getElementById(gameStatusBtnId);
		this.gameSettingsForm = document.getElementById("game-settings");
		this.gameSpeedInput = document.getElementById("game-speed");

		this.deaths = 0;
		this.maxScore = parseFloat(localStorage.getItem("maxScore")) || this.score;
		this.gameInit();
		this.start();
	}

	gameInit() {
		this.score = 0;
		this.isPaused = false;
		this.loop = 0;
		this.initialSnakeX = Math.floor(this.gameCellCount / 2) - 1;
		this.initialSnakeY = Math.floor(this.gameCellCount / 2);

		this.setGameSpeed(this.initialSnakeSpeed);
		this.grid = new RenderGrid(this);
		this.snake = new Snake(
			this,
			this.initialSnakeX,
			this.initialSnakeY,
			this.initialSnakeWidth
		);
		this.food = new Food(this);

		this.toggleGameStatusClass();
	}

	reset() {
		this.gameInit();
	}

	gamePauseUnpause() {
		this.isPaused = !this.isPaused;
	}

	start() {
		clearInterval(this.gameUpdateInterval);
		this.gameUpdateInterval = setInterval(() => {
			this.update();
			if (this.loop === 0) {
				this.isPaused = true;
				this.loop++;
			}
		}, 1000 / this.gameSpeed);
	}

	toggleGameStatusClass() {
		if (this.isPaused === false && this.loop !== 0) {
			this.gameStatusBtn.classList.add("bi-pause-circle-fill");
			this.gameStatusBtn.classList.remove("bi-play-fill");
		} else {
			this.gameStatusBtn.classList.add("bi-play-fill");
			this.gameStatusBtn.classList.remove("bi-pause-circle-fill");
		}
	}

	showGameSettingsForm() {
		this.gameSettingsForm.classList.add("active");
	}

	closeGameSettingsForm() {
		this.gameSettingsForm.classList.remove("active");
	}

	changeGameSettings(prop, x) {
		this[prop] = x;
		if (["gameCellSize", "gameCellCount"].includes(prop)) {
			clearInterval(this.gameUpdateInterval);
			this.reset();
		}
		this.start();
	}

	setGameSpeed(value) {
		let speedValue = parseFloat(value);
		this.gameSpeed = this.gameSpeedInput.value =
			speedValue < 1 ? 1 : speedValue;
		this.start();
	}

	validateInputCellCount(value) {
		return value <= 5 ? 5 : value;
	}

	validateInputCellSize(value) {
		return value <= 10 ? 10 : value;
	}

	validateInputSpeed(value) {
		return value < 1 ? 1 : value;
	}

	update() {
		if (this.isPaused) {
			return;
		}

		if (!this.snake.isAlive) {
			this.maxScore = this.score > this.maxScore ? this.score : this.maxScore;
			localStorage.setItem("maxScore", this.maxScore);
			this.deaths++;
			this.reset();
			this.start();
		}

		this.food.renderFood();
		this.snake.update();

		//If the snake eats the food, it grows. Just like real live.
		if (this.snake.x == this.food.x && this.snake.y == this.food.y) {
			this.food.placeFood();
			this.snake.addPart();
			this.score++;

			if (this.hardMode === true) {
				this.setGameSpeed(this.gameSpeed + 1);
			}
		}

		this.spanScore.innerHTML = this.score;
		this.spanDeaths.innerHTML = this.deaths;
		this.spanMaxScore.innerHTML = this.maxScore;

		this.grid.update();
	}
}
