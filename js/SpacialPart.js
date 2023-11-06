class Grid{
    constructor(cellSize){
        this.cells = [];
        this.agents = [];
        
        this.cellSize = cellSize;
        this.cellsX = Math.ceil(width / cellSize);
        this.cellsY = Math.ceil(height / cellSize);

        for(let y = 0; y < this.cellsY; y++){
            let row = [];
            for(let x = 0; x < this.cellsX; x++){
                row.push(new Cell(x * cellSize ,y * cellSize ,cellSize , cellSize));
            }
            this.cells.push(row);
        }
    }

    update(){
        for(let agent of this.agents){
            let prevCellAtPos = this.getCellAt(agent.posOld.x, agent.posOld.y);
            let cellAtPos = this.getCellAt(agent.pos.x, agent.pos.y);

            if(prevCellAtPos != cellAtPos){
                    prevCellAtPos.removeAgent(agent);
                    cellAtPos.addAgent(agent);
            }
        }
    }

    draw(){
        var cells1D = this.cells.reduce(function(prev, next) {
            return prev.concat(next);
        });

        for(let cell of cells1D){
            cell.draw();
        }
    }

    getCellAt(x, y){
        let foundCellX = Math.floor(x / this.cellSize);
        let foundCellY = Math.floor(y / this.cellSize);
        
        foundCellX = clamp(foundCellX, 0 , this.cellsX - 1);
        foundCellY = clamp(foundCellY, 0 , this.cellsY - 1);
        return this.cells[foundCellY][foundCellX];
    }

    getNegbourhoodAt(x, y){
        let centerCellX = Math.floor(x / this.cellSize);
        let centerCellY = Math.floor(y / this.cellSize);

        let cellArr = [];

        for(let idY = centerCellY - 1; idY <= centerCellY + 1; idY++){
            for(let idX = centerCellX - 1; idX <= centerCellX + 1; idX++){
                if(idX < 0 || idY < 0 || idX > this.cellsX - 1 || idY > this.cellsY - 1) continue;
                cellArr.push(this.cells[idY][idX]);
            }
        }
        
        return cellArr;
    }

    getAgentsInNeigborhoodAt(x ,y){
        let centerCellX = Math.floor(x / this.cellSize);
        let centerCellY = Math.floor(y / this.cellSize);

        let agents = [];

        for(let idY = centerCellY - 1; idY <= centerCellY + 1; idY++){
            for(let idX = centerCellX - 1; idX <= centerCellX + 1; idX++){
                if(idX < 0 || idY < 0 || idX > this.cellsX - 1 || idY > this.cellsY - 1) continue;
                agents = agents.concat(this.cells[idY][idX].agents);
            }
        }

        return agents;
    }
}

class Cell{
    constructor(x, y, width, height){
        this.agents = [];

        this.color = color(30, 30, 30);
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(){
        stroke(this.color);
        noFill();
        
        rect(this.x, this.y, this.width, this.height);

        text(this.agents.length, this.x + 10, this.y + 20);
    }

    addAgent(agent){
        if(isInArray(agent, this.agents)) return -1;
        this.agents.push(agent);
        return 0;
    }

    removeAgent(agent){
        let index = this.agents.indexOf(agent);
        if (index > -1) {
            this.agents.splice(index, 1);
        }
    }
}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
  }