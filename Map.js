class Map {
    constructor(cols=16, rows=16, init=1) {
        this.cols = cols;
        this.rows = rows;

        this.map = [];
        for (let i = 0; i < this.rows; i++) {
            this.map[i] = []
            for (let j = 0; j < this.cols; j++) {
                this.map[i][j] = init;
            }
        }
    }

    generate_map() {
        // map needs to be odd x odd
        if (this.cols % 2 != 1) this.cols--;
        if (this.rows % 2 != 1) this.rows--;

        // outer walls
        for (let i = 0; i < this.rows; i++) {
            this.map[0][i] = 1;
            this.map[this.cols - 1][i] = 1;
        }
        for (let i = 0; i < this.cols; i++) {
            this.map[i][0] = 1;
            this.map[i][this.rows - 1] = 1;
        }

        // define what is a wall block and what is a path block
        // 1 0 1 0 1 0 1 0 1 0 1
 
        // Wilson's Algorithm
    }

    drawMap() {
        var wall = new Cube(undefined,undefined,0);
        for (var x = 0; x < this.cols; x++) {
            for (var y = 0; y < this.rows; y++) {
                if (this.map[x][y] == 1) {
                    wall.color = [1.0, 1.0, 1.0, 1.0];
                    wall.matrix.setTranslate(x-(this.rows/2), -.75, y-(this.cols/2));
                    wall.render();
                }
            }
        }
    }
}