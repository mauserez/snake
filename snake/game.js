import { RenderGrid } from "./grid.js";
import { Snake } from "./snake.js";
import { Food } from "./food.js";

export class Game {
	constructor(
		gameCellCount,
		gameCellSize,
		gameSpeed,
		gameAreaId,
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

		this.gameArea = document.getElementById(gameAreaId);
		this.spanScore = document.getElementById(spanScoreId);
		this.scoreFace = this.spanScore.parentNode.getElementsByTagName("i")[0];

		this.spanDeaths = document.getElementById(spanDeathsId);
		this.deathFace = this.spanDeaths.parentNode.getElementsByTagName("i")[0];

		this.spanMaxScore = document.getElementById(spanMaxScoreId);
		this.maxScoreFace =
			this.spanMaxScore.parentNode.getElementsByTagName("i")[0];

		this.gameStatusBtn = document.getElementById(gameStatusBtnId);
		this.gameSettingsForm = document.getElementById("game-settings");
		this.gameSpeedInput = document.getElementById("game-speed");
		this.gameSpeedVisible = document.getElementById("game-speed-visible");

		this.deaths = 0;
		this.gameInit();

		this.maxScore =
			localStorage.getItem("maxScore") === null
				? this.score
				: localStorage.getItem("maxScore");
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

	gameUnpause() {
		this.isPaused = false;
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
		this.gameSpeed =
			this.gameSpeedInput.value =
			this.gameSpeedVisible.innerHTML =
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
		return value < 1 || isNaN(value) ? 1 : value;
	}

	scaleEmoji(emoji) {
		emoji.classList.add("scalable");
		setTimeout(() => {
			emoji.classList.remove("scalable");
		}, 500);
	}

	hardModeToggle() {
		this.hardMode = !this.hardMode;
		if (this.hardMode === true) {
			this.gameArea.classList.add("hard-mode-border");
		} else {
			this.gameArea.classList.remove("hard-mode-border");
		}
	}

	update() {
		if (this.isPaused) {
			return;
		}

		if (!this.snake.isAlive) {
			if (this.score > this.maxScore) {
				this.scaleEmoji(this.maxScoreFace);
			}
			this.maxScore = this.score > this.maxScore ? this.score : this.maxScore;
			localStorage.setItem("maxScore", this.maxScore);

			this.deaths++;
			this.reset();
			this.start();
		}

		this.food.renderFood();
		this.snake.update();

		if (this.snake.x == this.food.x && this.snake.y == this.food.y) {
			this.scaleEmoji(this.scoreFace);
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
