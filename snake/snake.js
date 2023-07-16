class SnakePart {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

export class Snake {
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
		const lastPart = this.parts[this.parts.length - 1];
		this.parts.push(new SnakePart(lastPart.x, lastPart.y));
	}

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
		this.game.scaleEmoji(this.game.deathFace);
	}
}
