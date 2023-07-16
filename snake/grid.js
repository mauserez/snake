export class RenderGrid {
	constructor(game) {
		this.game = game;
		this.grid = [];
		this.buildGrid();
	}

	buildGrid() {
		let gameAreaWidthHeight = 0;
		this.game.gameArea.innerHTML = "";

		for (let x = 0; x < this.game.gameCellCount; x++) {
			this.grid[x] = [];
			gameAreaWidthHeight += this.game.gameCellSize;

			for (let y = 0; y < this.game.gameCellCount; y++) {
				let gridCell = document.createElement("div");
				gridCell.style.width = gridCell.style.height =
					this.game.gameCellSize + "px";

				gridCell.style.left = x * this.game.gameCellSize + "px";
				gridCell.style.top = y * this.game.gameCellSize + "px";

				this.game.gameArea.appendChild(gridCell);

				this.grid[x][y] = {
					div: gridCell,
					isFilled: false,
					className: "empty-cell",
				};
			}
		}

		this.game.gameArea.style.width = `${gameAreaWidthHeight}px`;
		this.game.gameArea.style.height = `${gameAreaWidthHeight}px`;
	}

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
