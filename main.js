var formControl = document.getElementById('roverControl');
var logContainer = document.getElementById('logContainer');

var rover;


var moveButtons = document.querySelectorAll('.js-move-button');
[].forEach.call(moveButtons, function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        formControl.roverProgram.value += this.getAttribute('data-move');
        return false;
    })
});

document.getElementById('startRover').addEventListener('click', startRover);

document.getElementById('roverProgram').addEventListener('input', function() {
    this.value = this.value.replace(/[^UDLR]/ig, '').toUpperCase();
})


function startRover() {
    var formControl = document.getElementById('roverControl');

    var gridWidth = parseInt(formControl.gridWidth.value);
    var gridHeight = parseInt(formControl.gridHeight.value);
    var roverX = parseInt(formControl.roverX.value);
    var roverY = parseInt(formControl.roverY.value);
    var roverDirection = parseInt(formControl.roverDirection.value);
    var program = formControl.roverProgram.value;

    drawGrid(gridWidth, gridHeight);

    if (!rover) {        
        roverLog('Grid Size: ' + gridWidth + ', ' + gridHeight);
        roverLog('Rover Position: ' + roverX + ', ' + roverY);
        roverLog('Rover Direction: ' + roverDirection);
        formControl.gridWidth.readOnly = true;
        formControl.gridHeight.readOnly = true;
        formControl.roverX.readOnly = true;
        formControl.roverY.readOnly = true;
    }

    rover = new Rover({
        gridWidth: gridWidth,
        gridHeight: gridHeight,
        x: roverX,
        y: roverY,
        direction: roverDirection,
        program: program
    });

    roverLog('- - - - -');  
    roverLog('Rover Input: ' + program);    

    drawRover(rover.x, rover.y, 'init');

    rover.startProgram();

    formControl.roverX.value = rover.x;
    formControl.roverY.value = rover.y;
    formControl.roverDirection.value = rover.direction;
    formControl.roverProgram.value = '';

    
    roverLog('Rover Position: ' + rover.x + ', ' + rover.y);
    roverLog('Rover Direction: ' + rover.direction);

    drawRover(rover.x, rover.y);
}

function roverLog(msg) {
    var log = document.createElement('p');
    log.innerHTML = msg;
    
    logContainer.appendChild(log);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function drawGrid(cols, rows) {
    var grid = document.getElementById('grid');
    grid.innerHTML = '';

    for (var r = rows; r >= 1; r--) {
        var rowElm = document.createElement('tr');
        for (var c = 1; c <= cols; c++) {
            var colElm = document.createElement('td');
            colElm.innerHTML = c + ', ' + r;
            colElm.className = 'text-center';
            colElm.setAttribute('id', 'pos-' + c + '-' + r)
            rowElm.appendChild(colElm);
        }
        grid.appendChild(rowElm);
    }
}

function drawRover(x, y, state) {
    var grid = document.getElementById('grid');
    var className = state ? 'rover-' + state : 'rover';

    var target = grid.querySelector('.' + className);

    if (target) {
        target.classList.remove(className);
    }

    grid.querySelector('#pos-' + x + '-' + y).classList.add(className);
}

function Rover(props) {
    this.speed = 1;
    Object.assign(this, props);
}

Rover.prototype = {
    startProgram: function() {
        var program = this.program.split('');
        var rover = this;

        program.forEach(function(command) {
            switch (command.toUpperCase()) {
                case 'U':
                    rover.moveForward();
                    break;
                case 'R':
                    rover.turnRight();
                    break;
                case 'D':
                    rover.moveBackward();
                    break;
                case 'L':
                    rover.turnLeft();
                    break;
            }
        });

    },
    moveForward: function() {
        switch (this.direction) {
            case 0:
                this.tryMove(0, 1);
                break;
            case 90:
                this.tryMove(1, 0);
                break;
            case 180:
                this.tryMove(0, -1);
                break;
            case 270:
                this.tryMove(-1, 0);
                break;
        }

    },
    moveBackward: function() {
        switch (this.direction) {
            case 0:
                this.tryMove(0, -1);
                break;
            case 90:
                this.tryMove(-1, 0);
                break;
            case 180:
                this.tryMove(0, 1);
                break;
            case 270:
                this.tryMove(-1, 0);
                break;
        }

    },
    turnLeft: function() {
        var direction = this.direction - 90;
        if (direction < 0) {
            direction = 360 + direction;
        }
        this.direction = direction;
    },
    turnRight() {
        this.direction = (this.direction + 90) % 360;
    },

    tryMove(dirX, dirY) {
        var newX = this.x + dirX * this.speed;
        var newY = this.y + dirY * this.speed;
        if (newX > 0 && newX <= this.gridWidth &&
            newY > 0 && newY <= this.gridHeight) {
            this.x = newX;
            this.y = newY;
        } else {
            console.log('cantMoveNext');
        }
    }

}