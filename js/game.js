function checkBombs(x, y) {
    let counter = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            try {

                document.querySelector(
                    '[data-row*="' + (x + i).toString() + '"]' + '[data-col*="' + (y + j).toString() + '"]'
                ).classList.contains('mine')
                && counter++;

            }catch (error){}
        }
    }
    return counter;
}


function emptyArea(x, y, doNotUseArr) {
    doNotUseArr.push([x,y]);

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {

            if (doNotUseArr[doNotUseArr.length - 1][0] !== x + i
                || doNotUseArr[doNotUseArr.length - 1][1] !== y + j){

                try {
                    if (!document.querySelector(
                        '[data-row*="' + (x + i).toString() + '"][data-col*="' + (y + j).toString() + '"]'
                        ).classList.contains('mine')

                        && !document.querySelector(
                            '[data-row*="' + (x + i).toString() + '"][data-col*="' + (y + j).toString() + '"]'
                        ).classList.contains('open')
                    ) {

                        let bombs = checkBombs((x + i), (y + j));

                        document.querySelector(
                            '[data-row*="' + (x + i).toString() + '"][data-col*="' + (y + j).toString() + '"]'
                        ).classList.add('open');

                        bombs !== 0 ?
                            document.querySelector(
                                '[data-row*="' + (x + i).toString() + '"][data-col*="' + (y + j).toString() + '"]'
                            ).innerHTML += bombs
                            : emptyArea((x + i), (y + j), doNotUseArr);

                    }
                } catch (error) {}
            }
        }
    }
}


function flagsLeft() {
    let counter = 0;

    for (let flag of document.querySelectorAll('.field')) {

        flag.classList.contains('mine')
        && counter++;

        flag.classList.contains('flagged')
        && counter--;

    }
    return counter;
}


function checkWin() {
    let hitCounter = 0;
    let bombCounter = 0;

    for (let opened of document.querySelectorAll('.field')) {

        opened.classList.contains('open')
        && hitCounter++;

        opened.classList.contains('mine')
        && bombCounter++;

    }
    return document.querySelectorAll('.field').length
        === hitCounter + bombCounter;
}


function countUp(){
    let counter = 0;

    let interval = setInterval(function () {
        counter++;

        document.getElementById("elapsed-time-counter").value
            = Math.floor(counter / 250).toString();

        if (document.querySelector('.game-field')
                .getAttribute('class')
            === 'game-field end'
        ) {
            clearInterval(interval);
        }
    });
}


const game = {
    init: function () {
        this.drawBoard();
        document.querySelector('#flags-left-counter')
            .setAttribute('value', flagsLeft().toString());
        // TODO: do the rest of the game setup here (eg. add event listeners)
        this.initRightClick();
        this.initLeftClick();
    },

    drawBoard: function () {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const rows = parseInt(urlParams.get('rows'));
        const cols = parseInt(urlParams.get('cols'));
        const mineCount = parseInt(urlParams.get('mines'));
        const minePlaces = this.getRandomMineIndexes(mineCount, cols, rows);

        let gameField = document.querySelector(".game-field");
        this.setGameFieldSize(gameField, rows, cols);
        let cellIndex = 0
        for (let row = 0; row < rows; row++) {
            const rowElement = this.addRow(gameField);
            for (let col = 0; col < cols; col++) {
                this.addCell(rowElement, row, col, minePlaces.has(cellIndex));
                cellIndex++;
            }
        }
    },
    getRandomMineIndexes: function (mineCount, cols, rows) {
        const cellCount = cols * rows;
        let mines = new Set();
        do {
            mines.add(Math.round(Math.random() * (cellCount - 1)));
        } while (mines.size < mineCount && mines.size < cellCount);
        return mines;
    },
    setGameFieldSize: function (gameField, rows, cols) {
        gameField.style.width = (gameField.dataset.cellWidth * rows) + 'px';
        gameField.style.height = (gameField.dataset.cellHeight * cols) + 'px';
    },
    addRow: function (gameField) {
        gameField.insertAdjacentHTML(
            'beforeend',
            '<div class="row"></div>'
        );
        return gameField.lastElementChild;
    },
    addCell: function (rowElement, row, col, isMine) {
        rowElement.insertAdjacentHTML(
            'beforeend',
            `<div class="field${isMine ? ' mine' : ''}"
                        data-row="${row}"
                        data-col="${col}">&nbsp;</div>`);
    },
    // reference solution for "Create mine flagging feature" user story
    initRightClick() {
        // we collect all fields of the game.
        // (the same selector is used as in the style.css file for finding the fields)
        const fields = document.querySelectorAll('.game-field .row .field');

        // for all fields...
        for (let field of fields) {
            // we add the same event listener for the right click (so called contextmenu) event
            field.addEventListener('contextmenu', async function (event) {
                // so if you right-click on any field...

                // context menu remains hidden
                event.preventDefault();

                // and "flagged" class toggles on the clicked element
                // (styles of "flagged" class are defined in style.css)
                event.currentTarget.classList.toggle('flagged');

                document.querySelector('#flags-left-counter')
                    .setAttribute('value', flagsLeft().toString());

                document.getElementById("elapsed-time-counter").value === ''
                && countUp('start');
            });
        }
    },
    initLeftClick() {
        for (
            let field of document.querySelectorAll('.field'
        )) {

            field.addEventListener(
                'click', function (event) {

                    if (field.className === 'field') {
                        event.currentTarget.classList.add('open');

                        let bombs = checkBombs(
                            parseInt(field.getAttribute('data-row')),
                            parseInt(field.getAttribute('data-col'))
                        );

                        if (bombs === 0) {
                            field.innerHTML = ""

                            emptyArea(
                                parseInt(field.getAttribute('data-row')),
                                parseInt(field.getAttribute('data-col')),
                                []
                            );

                        }else {
                            field.innerHTML += bombs.toString()
                        }

                    } else if (field.className === 'field mine') {

                        for (
                            let mine of document.getElementsByClassName('field mine')
                            ) {
                            mine.classList.add('bomb');
                        }

                        alert('LOSE :((');
                        document.querySelector('.game-field')
                            .classList.add('end');
                    }

                    checkWin() &&(alert('!!!WIN!!!'),
                        document.querySelector('.game-field')
                            .classList.add('end'));

                    document.getElementById("elapsed-time-counter").value === ''
                    && countUp('start');
            });
        }
    },

};

game.init()