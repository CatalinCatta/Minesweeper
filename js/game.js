const difficulties = {
    easy: {
        rows: 9,
        cols: 9,
        mines: 10
    },
    medium: {
        rows: 16,
        cols: 16,
        mines: 40
    },
    hard: {
        rows: 16,
        cols: 30,
        mines: 99
    },
    impossible: {
        rows: 24,
        cols: 30,
        mines: 180
    }
};

function checkBombs(x, y) {
    let counter = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            try {

                document.querySelector('[data-row*="' + (x + i).toString() + '"]' + '[data-col*="' + (y + j).toString() + '"]').classList.contains('mine') && counter++;

            } catch (error) {
            }
        }
    }
    return counter;
}


function emptyArea(x, y, doNotUseArr) {
    doNotUseArr.push([x, y]);

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {

            if (doNotUseArr[doNotUseArr.length - 1][0] !== x + i || doNotUseArr[doNotUseArr.length - 1][1] !== y + j) {

                try {
                    let element = document.querySelector(`[data-row*="${x + i}"][data-col*="${y + j}"]`);
                    if (!element.classList.contains('mine') && !element.classList.contains('open') && !element.classList.contains("flagged")) {
                        let bombs = checkBombs((x + i), (y + j));

                        element.classList.add('open');

                        bombs !== 0 ? element.innerHTML = `&nbsp;${bombs.toString()}&nbsp;` : emptyArea((x + i), (y + j), doNotUseArr);

                    }
                } catch (error) {
                }
            }
        }
    }
}


function flagsLeft() {
    let counter = 0;

    for (let flag of document.querySelectorAll('.field')) {

        flag.classList.contains('mine') && counter++;

        flag.classList.contains('flagged') && counter--;

    }
    return counter;
}


function checkWin() {
    let hitCounter = 0;
    let bombCounter = 0;

    for (let opened of document.querySelectorAll('.field')) {

        opened.classList.contains('open') && hitCounter++;

        opened.classList.contains('mine') && bombCounter++;

    }
    return document.querySelectorAll('.field').length === hitCounter + bombCounter;
}


function countUp() {
    let counter = 0;

    let interval = setInterval(function () {
        counter++;

        document.getElementById("elapsed-time-counter").value = Math.floor(counter / 250).toString();

        if (document.querySelector('.game-field')
            .getAttribute('class') === 'game-field end') {
            clearInterval(interval);
        }
    });
}

function switchFlagType() {
    const myButton = document.getElementById('changeFlagType');
    if (localStorage.getItem('flag') == null) {
        myButton.classList.remove('flag-disabled');
        myButton.classList.add('flag-enabled');
        localStorage.setItem('flag', " ");
    } else {
        myButton.classList.remove('flag-enabled');
        myButton.classList.add('flag-disabled');
        localStorage.removeItem("flag");
    }
}


const game = {
    firstClick: true,
    mineCount: 0,
    rows: 0,
    cols: 0,

    init: function () {
        localStorage.removeItem("flag");
        this.drawBoard();
        document.querySelector('#flags-left-counter')
            .setAttribute('value', flagsLeft().toString());
        this.initRightClick();
        this.initLeftClick();
        document.getElementById('changeFlagType').addEventListener('click', switchFlagType);
    },

    drawBoard: function () {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if (localStorage.getItem('difficulty') == null) localStorage.setItem('difficulty', 'easy');
        if (localStorage.getItem('rows') == null) localStorage.setItem('rows', '9');
        if (localStorage.getItem('cols') == null) localStorage.setItem('cols', '9');
        if (localStorage.getItem('mines') == null) localStorage.setItem('mines', '10');

        let dificulty = urlParams.get('difficulty');
        let rows = localStorage.getItem('rows');
        let cols = localStorage.getItem('cols');
        let mineCount = localStorage.getItem('mines');

        if (difficulties[dificulty]) {
            rows = difficulties[dificulty].rows;
            cols = difficulties[dificulty].cols;
            mineCount = difficulties[dificulty].mines;
            localStorage.setItem('difficulty', dificulty);
        } else {
            let tempRow = urlParams.get('rows');
            let tempCols = urlParams.get('cols');
            let tempMineCount = urlParams.get('mines');

            if (tempRow != null) rows = parseInt(tempRow);
            if (tempCols != null) cols = parseInt(tempCols);
            if (tempMineCount != null) mineCount = parseInt(tempMineCount);
        }

        localStorage.setItem('rows', rows)
        localStorage.setItem('cols', cols)
        localStorage.setItem('mines', mineCount)
            
        this.mineCount = mineCount;
        this.rows = rows;
        this.cols = cols;

        let gameField = document.querySelector(".game-field");
        this.setGameFieldSize(gameField, rows, cols);
        let cellIndex = 0
        for (let row = 0; row < rows; row++) {
            const rowElement = this.addRow(gameField);
            for (let col = 0; col < cols; col++) {
                this.addCell(rowElement, row, col, false);
                cellIndex++;
            }
        }
    }, getRandomMineIndexes: function (mineCount, cols, rows) {
        const cellCount = cols * rows;
        let mines = new Set();
        do {
            mines.add(Math.round(Math.random() * (cellCount - 1)));
        } while (mines.size < mineCount && mines.size < cellCount);
        return mines;
    }, setGameFieldSize: function (gameField, rows, cols) {
        gameField.style.width = (gameField.dataset.cellWidth * cols) + 'px';
        gameField.style.height = (gameField.dataset.cellHeight * rows) + 'px';
    }, addRow: function (gameField) {
        gameField.insertAdjacentHTML('beforeend', '<div class="row"></div>');
        return gameField.lastElementChild;
    }, addCell: function (rowElement, row, col, isMine) {
        rowElement.insertAdjacentHTML('beforeend', `<div class="field${isMine ? ' mine' : ''}"
                        data-row="${row}"
                        data-col="${col}">&nbsp;&nbsp;&nbsp;&nbsp;</div>`);
    }, initRightClick() {
        const fields = document.querySelectorAll('.game-field .row .field');

        for (let field of fields) {
            field.addEventListener('contextmenu', async function (e) {
                flagHandle(field, e)
            });
        }
    }, initLeftClick() {
        for (let field of document.querySelectorAll('.field')) {

            field.addEventListener('click', function (e) {
                beehive(field, e);
            });
        }
    }, generateMines: function (safeRow, safeCol) {

        const safeCells = new Set();

        const canProtect3x3 =
            this.mineCount <= (this.rows * this.cols - 9);

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {

                if (!canProtect3x3 && (i !== 0 || j !== 0))
                    continue;

                const row = safeRow + i;
                const col = safeCol + j;

                if (
                    row >= 0 &&
                    row < this.rows &&
                    col >= 0 &&
                    col < this.cols
                ) {
                    safeCells.add(`${row},${col}`);
                }
            }
        }

        const mines = new Set();

        while (mines.size < this.mineCount) {

            const index =
                Math.floor(Math.random() * this.rows * this.cols);

            const row = Math.floor(index / this.cols);
            const col = index % this.cols;

            if (safeCells.has(`${row},${col}`))
                continue;

            mines.add(index);
        }

        mines.forEach(index => {

            const row = Math.floor(index / this.cols);
            const col = index % this.cols;

            document
                .querySelector(
                    `[data-row="${row}"][data-col="${col}"]`
                )
                .classList.add('mine');
        });
    },
};

function beehive(field, e) {
    if (localStorage.getItem('flag') == null) {
        areaHandle(field, e);
    } else {
        flagHandle(field, e);
    }
}

function flagHandle(field, event) {
    if (field.className.includes('open')) return;
    if (!event.currentTarget.classList.contains('flagged') && flagsLeft() <= 0) return;

    event.preventDefault();
    event.currentTarget.classList.toggle('flagged');

    document.querySelector('#flags-left-counter')
        .setAttribute('value', flagsLeft().toString());

    document.getElementById("elapsed-time-counter").value === '' && countUp('start');
}

function areaHandle(field, event) {
    if (game.firstClick) {
        game.firstClick = false;

        game.generateMines(
            parseInt(field.dataset.row),
            parseInt(field.dataset.col)
        );
    }

    if (field.className === 'field') {
        event.currentTarget.classList.add('open');

        let bombs = checkBombs(parseInt(field.getAttribute('data-row')), parseInt(field.getAttribute('data-col')));

        if (bombs === 0) {
            field.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;"

            emptyArea(parseInt(field.getAttribute('data-row')), parseInt(field.getAttribute('data-col')), []);

        } else field.innerHTML = `&nbsp;${bombs.toString()}&nbsp;`;

    } else if (field.className === 'field mine') {

        for (let mine of document.getElementsByClassName('field mine')) {
            mine.classList.add('bomb');
        }

        alert('LOSE :((');
        document.querySelector('.game-field')
            .classList.add('end');
    }

    checkWin() && (alert('!!!WIN!!!'), document.querySelector('.game-field')
        .classList.add('end'));

    document.getElementById("elapsed-time-counter").value === '' && countUp('start');
}

game.init()