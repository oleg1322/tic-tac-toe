const PVP_BUTTON = document.getElementById('pvp_button');
const PVC_BUTTON = document.getElementById('pvc_button');
const HOME_BUTTON = document.querySelector('.home-button');
const CROSS_OPTION_BUTTON = document.querySelector('.croos-option');
const CIRCLE_OPTION_BUTTON = document.querySelector('.circle-option');

const SIDE_OPTION = document.querySelector('.side-option');
const START_MENU = document.querySelector('.rival-ortions');

const HIDE_CLASS = 'hide';
const SHOW_CLASS = 'show';
const CROSS_CLASS = 'cross';
const CIRCLE_CLASS = 'circle';

//взаимодействуемое
const cellElements = document.querySelectorAll('.cell');
const cellElementsArray = [...cellElements];

const gameboard = document.getElementById('gameboard');
const winMessage = document.querySelector('.endgame-screen');
const winScreen = document.querySelector('.win-screen');
const restartButton = document.querySelector('.restart-button');

const WINN_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

let CIRCLE_TURN;

PVP_BUTTON.addEventListener('click', pvpMode);
PVC_BUTTON.addEventListener('click', sideOption);
HOME_BUTTON.addEventListener('click', homeClick);
CROSS_OPTION_BUTTON.addEventListener('click',pvcMode_CROSS);
CIRCLE_OPTION_BUTTON.addEventListener('click',pvcMode_CIRCLE);

/* игрок против игрока */

function pvpMode() {
    START_MENU.classList.add(HIDE_CLASS);

    startGame();
    restartButton.addEventListener('click', startGame)

    function startGame() {
        CIRCLE_TURN = false;
        cellElements.forEach(cell => {
            cell.classList.remove(CROSS_CLASS);
            cell.classList.remove(CIRCLE_CLASS);
            cell.removeEventListener('click', turn);
            cell.addEventListener('click', turn, {once: true})
        });
        setHoverClass();

        winScreen.classList.remove(SHOW_CLASS);
    }

    function turn(e) {
        const cell = e.target;
        const cellClass = CIRCLE_TURN ? CIRCLE_CLASS: CROSS_CLASS;
        
        //ход
        cell.classList.add(cellClass);

        //проверка победы
        if (winCheck(cellClass)) {
        endGame(false, cellClass);
        } else if (isDraw()) {
            endGame(true, cellClass);
        } else {
            CIRCLE_TURN = !CIRCLE_TURN;
            setHoverClass();
        }
    }
}

//  игрок против AI 

//за нолки
function pvcMode_CIRCLE() {

    let aiClass = CROSS_CLASS;

    START_MENU.classList.add(HIDE_CLASS);
    SIDE_OPTION.classList.remove(SHOW_CLASS);

    startGame();
    restartButton.addEventListener('click', startGame)

    function startGame() {
        CIRCLE_TURN = false;
        replay();

        cellElements[randomCellIndex()].classList.add(aiClass);
        CIRCLE_TURN = true;
        

        cellElements.forEach(cell => {
            cell.removeEventListener('click', turn);
            cell.addEventListener('click', turn, {once: true})
        })

        winScreen.classList.remove(SHOW_CLASS);
    }

    function turn(e) {

            CIRCLE_TURN = true
            // ход нолика
            const cell = e.target;
            let cellClass =  CIRCLE_TURN ? CIRCLE_CLASS: CROSS_CLASS;
            cell.classList.add(cellClass);
            //проверка победы
            if (winCheck(cellClass)) {
                endGame(false, cellClass);
            } else if (isDraw()) {
                endGame(true, cellClass);
            } else {
                setHoverClass();
            }
            
            
            //лучший ход крестика по миимаксу
            cellClass = aiClass;
            cellElements[bestMoveIndex(aiClass)].classList.add(cellClass);
            //проверка победы
            if (winCheck(cellClass)) {
                endGame(false, cellClass);
            } else if (isDraw()) {
                endGame(true, cellClass);
            } 
    }

}

//за крестики
function pvcMode_CROSS() {

    let aiClass = CIRCLE_CLASS;

    START_MENU.classList.add(HIDE_CLASS);
    SIDE_OPTION.classList.remove(SHOW_CLASS);

    startGame();
    restartButton.addEventListener('click', startGame)

    function startGame() {
        CIRCLE_TURN = false;
        replay();

        cellElements.forEach(cell => {
            cell.removeEventListener('click', turn);
            cell.addEventListener('click', turn, {once: true})
        })

        setHoverClass();
        winScreen.classList.remove(SHOW_CLASS);
    }

    function turn(e) {
            const cell = e.target;
            let cellClass =  CROSS_CLASS;
            cell.classList.add(cellClass);
            //проверка победы
            if (winCheck(cellClass)) {
                endGame(false, cellClass);
            } else if (isDraw()) {
                endGame(true, cellClass);
            } else {
                setHoverClass();
            }
            
            cellClass = aiClass;
            cellElements[bestMoveIndex(aiClass)].classList.add(cellClass);
            //проверка победы
            if (winCheck(cellClass)) {
                endGame(false, cellClass);
            } else if (isDraw()) {
                endGame(true, cellClass);
            } 
    }

}

function winCheck(cellClass) {
    return WINN_COMBOS.some(combo => {
        return combo.every(index => {
            return cellElements[index].classList.contains(cellClass);
        })
    })  
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(CROSS_CLASS) || 
            cell.classList.contains(CIRCLE_CLASS);
    })
}

function endGame(draw, cellClass) {
    draw? winMessage.innerText = `draw...`:
         winMessage.innerText = `${cellClass} wins`;

    winScreen.classList.add('show');
}

function setHoverClass() {
    gameboard.classList.remove(CROSS_CLASS);
    gameboard.classList.remove(CIRCLE_CLASS);

    CIRCLE_TURN? gameboard.classList.add(CIRCLE_CLASS): 
                 gameboard.classList.add(CROSS_CLASS);
}

function randomCellIndex() {
    let min = 0;
    let max = 9; 
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function replay() {
    cellElements.forEach(cell => {
        cell.classList.remove(CROSS_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
    });
}

function minimax(cellElements, playerClass) {
    if (winCheck(CROSS_CLASS)){
        return {score: 20}
    } else if (winCheck(CIRCLE_CLASS)) {
        return {score: -20}
    } else if (isDraw()) {
        return {score: 0}
    }

    let moves = [];

    for (let i = 0; i < cellElements.length; i++) {
            if (!(cellElements[i].classList.contains(CROSS_CLASS) || 
            cellElements[i].classList.contains(CIRCLE_CLASS))) {
                let move = {};
                move.index = i;
                cellElements[i].classList.add(playerClass);

                if (playerClass == CROSS_CLASS) {
                    let result = minimax(cellElements, CIRCLE_CLASS);
                    move.score = result.score;
                } else {
                    let result = minimax(cellElements, CROSS_CLASS);
                    move.score = result.score;
                }

                cellElements[i].classList.remove(playerClass);
                moves.push(move);
        }
    }

    let bestMove;
    if (playerClass == CROSS_CLASS) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if(moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if(moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function bestMoveIndex(playerClass) {
    return minimax(cellElements, playerClass).index;
}

function homeClick() {
    replay();
    winScreen.classList.remove(SHOW_CLASS);
    START_MENU.classList.remove(HIDE_CLASS);
}

function sideOption() {
    START_MENU.classList.add(HIDE_CLASS);
    SIDE_OPTION.classList.add(SHOW_CLASS);
}