document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('#grid');
    const scoreDisplay = document.querySelector('#score');
    const startButton = document.querySelector('#start-button');
    const width = 11; // Adaptado à tua grid
    const height = 17;
    const gridSize = width * height;
    let squares = [];
    let currentPosition = 4;
    let currentRotation = 0;
    let score = 0;
    let timerId;   

    // Criar as células da grid
    for (let i = 0; i < gridSize; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
        squares.push(square);
    }

    // Tetrominos
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];

    const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
    const colors = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'];
    let random = Math.floor(Math.random() * tetrominoes.length);
    let currentColor = colors[Math.floor(Math.random() * colors.length)];
    let current = tetrominoes[random][currentRotation];

    // Desenhar o tetromino
    function draw() {
        current.forEach(index => {
            const square = squares[currentPosition + index];
            square.classList.add('tetromino');
            square.style.backgroundColor = currentColor;
        });
    }    

    // Apagar o tetromino
    function undraw() {
        current.forEach(index => {
            const square = squares[currentPosition + index];
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });
    }    

    // Mover para baixo
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // Verificar se chegou ao fim
    function freeze() {
        if (
            current.some(index => {
                const nextIndex = currentPosition + index + width;
                return nextIndex >= width * height || squares[nextIndex].classList.contains('taken');
            })
        ) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));

            // Novo tetromino
            random = Math.floor(Math.random() * tetrominoes.length);
            current = tetrominoes[random][0];
            currentColor = colors[Math.floor(Math.random() * colors.length)];
            currentPosition = 4;
            draw();
            addScore();
            gameOver();
        }
    }

    // Controles com teclado
    function control(e) {
        if (e.key === 'ArrowLeft') {
            moveLeft();
        } else if (e.key === 'ArrowRight') {
            moveRight();
        } else if (e.key === 'ArrowDown') {
            moveDown();
        } else if (e.key === 'ArrowUp') {
            rotate();
        }
    }

    document.addEventListener('keydown', control);

    // Mover para a esquerda
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    // Mover para a direita
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    // Rodar o tetromino
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) currentRotation = 0;
        current = tetrominoes[random][currentRotation];
        draw();
    }

    // Mostrar pontuação
    function addScore() {
        for (let i = 0; i < gridSize; i += width) {
            const row = Array.from({ length: width }, (_, j) => i + j);
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.textContent = score;

                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                });

                const removed = squares.splice(i, width);
                squares = removed.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    // Fim de jogo
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.textContent = 'Fim!';
            clearInterval(timerId);
        }
    }

    // Iniciar ou pausar jogo
    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
        }
    });
});
