/**
 * @fileoverview Лабораторная работа №8, Вариант 4
 * Класс «Квадратная матрица» с наследованием через прототипы и логированием.
 */

// ---------- Базовый класс BaseObject ----------
/**
 * Конструктор BaseObject. Инициализирует лог вызовов.
 * @constructor
 */
function BaseObject() {
    /** @type {Array<{method: string, args: Array, timestamp: Date}>} */
    this.log = [];
}

/**
 * Регистрирует вызов метода.
 * @param {string} methodName - имя вызванного метода
 * @param {...*} args - аргументы вызова
 */
BaseObject.prototype.register = function(methodName, ...args) {
    this.log.push({
        method: methodName,
        args: args,
        timestamp: new Date()
    });
};

/** Очищает лог вызовов. */
BaseObject.prototype.clearLog = function() {
    this.log = [];
};

/** Выводит лог в консоль. */
BaseObject.prototype.printLog = function() {
    console.log(`Лог вызовов для объекта ${this.constructor.name}:`);
    this.log.forEach((entry, index) => {
        console.log(`${index + 1}. ${entry.method}(${entry.args.join(', ')}) at ${entry.timestamp.toLocaleString()}`);
    });
};

// ---------- Класс Matrix, наследующий от BaseObject ----------
/**
 * Конструктор квадратной матрицы.
 * @constructor
 * @param {number} n - размер матрицы (n x n)
 */
function Matrix(n) {
    // Вызов конструктора родителя
    BaseObject.call(this);

    /** @type {number} */
    this.size = n;

    /** @type {Array<Array<number>>} */
    this.data = [];
    for (let i = 0; i < n; i++) {
        this.data[i] = new Array(n).fill(0);
    }
}

// Наследование прототипа BaseObject
Matrix.prototype = Object.create(BaseObject.prototype);
Matrix.prototype.constructor = Matrix;

/**
 * Возвращает элемент матрицы.
 * @param {number} i - индекс строки
 * @param {number} j - индекс столбца
 * @returns {number} значение элемента
 */
Matrix.prototype.get = function(i, j) {
    this.register('get', i, j);
    if (i < 0 || i >= this.size || j < 0 || j >= this.size) {
        throw new Error('Индекс вне границ матрицы');
    }
    return this.data[i][j];
};

/**
 * Устанавливает элемент матрицы.
 * @param {number} i - индекс строки
 * @param {number} j - индекс столбца
 * @param {number} value - новое значение
 */
Matrix.prototype.set = function(i, j, value) {
    this.register('set', i, j, value);
    if (i < 0 || i >= this.size || j < 0 || j >= this.size) {
        throw new Error('Индекс вне границ матрицы');
    }
    this.data[i][j] = value;
};

/**
 * Сложение матриц.
 * @param {Matrix} other - другая матрица
 * @returns {Matrix} новая матрица-сумма
 */
Matrix.prototype.add = function(other) {
    this.register('add', other);
    if (this.size !== other.size) {
        throw new Error('Размеры матриц не совпадают');
    }
    const result = new Matrix(this.size);
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            result.data[i][j] = this.data[i][j] + other.data[i][j];
        }
    }
    return result;
};

/**
 * Вычитание матриц.
 * @param {Matrix} other - другая матрица
 * @returns {Matrix} новая матрица-разность
 */
Matrix.prototype.subtract = function(other) {
    this.register('subtract', other);
    if (this.size !== other.size) {
        throw new Error('Размеры матриц не совпадают');
    }
    const result = new Matrix(this.size);
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            result.data[i][j] = this.data[i][j] - other.data[i][j];
        }
    }
    return result;
};

/**
 * Умножение матриц.
 * @param {Matrix} other - другая матрица
 * @returns {Matrix} новая матрица-произведение
 */
Matrix.prototype.multiply = function(other) {
    this.register('multiply', other);
    if (this.size !== other.size) {
        throw new Error('Размеры матриц не совпадают');
    }
    const result = new Matrix(this.size);
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            let sum = 0;
            for (let k = 0; k < this.size; k++) {
                sum += this.data[i][k] * other.data[k][j];
            }
            result.data[i][j] = sum;
        }
    }
    return result;
};

/**
 * Находит индексы максимального элемента.
 * @returns {{i: number, j: number}} объект с индексами
 */
Matrix.prototype.maxIndex = function() {
    this.register('maxIndex');
    let maxVal = -Infinity;
    let maxI = -1, maxJ = -1;
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            if (this.data[i][j] > maxVal) {
                maxVal = this.data[i][j];
                maxI = i;
                maxJ = j;
            }
        }
    }
    return { i: maxI, j: maxJ };
};

/**
 * Находит индексы минимального элемента.
 * @returns {{i: number, j: number}} объект с индексами
 */
Matrix.prototype.minIndex = function() {
    this.register('minIndex');
    let minVal = Infinity;
    let minI = -1, minJ = -1;
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            if (this.data[i][j] < minVal) {
                minVal = this.data[i][j];
                minI = i;
                minJ = j;
            }
        }
    }
    return { i: minI, j: minJ };
};

/**
 * Переопределение toString() для вывода матрицы.
 * @returns {string} строковое представление матрицы
 */
Matrix.prototype.toString = function() {
    let str = '';
    for (let i = 0; i < this.size; i++) {
        str += this.data[i].join('\t') + '\n';
    }
    return str;
};

// ---------- Интерфейс ----------
/** @type {HTMLInputElement} */
const sizeInput = document.getElementById('matrixSize');
/** @type {HTMLButtonElement} */
const createBtn = document.getElementById('createBtn');
/** @type {HTMLButtonElement} */
const randomBtn = document.getElementById('randomBtn');

/** @type {HTMLElement} */
const matrixADiv = document.getElementById('matrixA');
/** @type {HTMLElement} */
const matrixBDiv = document.getElementById('matrixB');
/** @type {HTMLElement} */
const resultDiv = document.getElementById('resultMatrix');

// Кнопки действий
const getABtn = document.getElementById('getABtn');
const setABtn = document.getElementById('setABtn');
const maxABtn = document.getElementById('maxABtn');
const minABtn = document.getElementById('minABtn');
const getBBtn = document.getElementById('getBBtn');
const setBBtn = document.getElementById('setBBtn');
const maxBBtn = document.getElementById('maxBBtn');
const minBBtn = document.getElementById('minBBtn');
const addBtn = document.getElementById('addBtn');
const subBtn = document.getElementById('subBtn');
const mulBtn = document.getElementById('mulBtn');

const printLogABtn = document.getElementById('printLogABtn');
const printLogBBtn = document.getElementById('printLogBBtn');
const clearLogABtn = document.getElementById('clearLogABtn');
const clearLogBBtn = document.getElementById('clearLogBBtn');

/** @type {Matrix} */
let matA = null;
/** @type {Matrix} */
let matB = null;

/**
 * Отображает матрицу в указанном контейнере.
 * @param {Matrix} matrix - объект матрицы
 * @param {HTMLElement} container - контейнер для вставки таблицы
 */
function renderMatrix(matrix, container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    if (!matrix) return;

    const table = document.createElement('table');
    for (let i = 0; i < matrix.size; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < matrix.size; j++) {
            const td = document.createElement('td');
            td.textContent = matrix.data[i][j];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    container.appendChild(table);
}

/** Обновляет отображение матриц A и B */
function renderAll() {
    renderMatrix(matA, matrixADiv);
    renderMatrix(matB, matrixBDiv);
}

/**
 * Создаёт новые матрицы размера n, заполненные нулями.
 * @param {number} n - размер
 */
function createMatrices(n) {
    matA = new Matrix(n);
    matB = new Matrix(n);
    renderAll();
}

/**
 * Заполняет матрицы случайными числами от 0 до 9.
 */
function randomFill() {
    if (!matA || !matB) {
        alert('Сначала создайте матрицы');
        return;
    }
    for (let i = 0; i < matA.size; i++) {
        for (let j = 0; j < matA.size; j++) {
            matA.data[i][j] = Math.floor(Math.random() * 10);
            matB.data[i][j] = Math.floor(Math.random() * 10);
        }
    }
    renderAll();
}

// Инициализация при загрузке
createBtn.addEventListener('click', () => {
    const n = parseInt(sizeInput.value, 10);
    if (isNaN(n) || n < 1 || n > 10) {
        alert('Размер должен быть от 1 до 10');
        return;
    }
    createMatrices(n);
});

randomBtn.addEventListener('click', randomFill);

// Вспомогательная функция для запроса индексов у пользователя
function promptIndexes(which) {
    const i = prompt(`Введите индекс строки для матрицы ${which} (от 0 до ${matA.size-1}):`);
    const j = prompt(`Введите индекс столбца для матрицы ${which} (от 0 до ${matA.size-1}):`);
    if (i === null || j === null) return null;
    const ii = parseInt(i, 10);
    const jj = parseInt(j, 10);
    if (isNaN(ii) || isNaN(jj) || ii < 0 || ii >= matA.size || jj < 0 || jj >= matA.size) {
        alert('Некорректные индексы');
        return null;
    }
    return { i: ii, j: jj };
}

getABtn.addEventListener('click', () => {
    if (!matA) { alert('Сначала создайте матрицы'); return; }
    const idx = promptIndexes('A');
    if (idx) {
        try {
            const val = matA.get(idx.i, idx.j);
            alert(`A[${idx.i}][${idx.j}] = ${val}`);
        } catch (e) {
            alert(e.message);
        }
    }
});

setABtn.addEventListener('click', () => {
    if (!matA) { alert('Сначала создайте матрицы'); return; }
    const idx = promptIndexes('A');
    if (idx) {
        const val = prompt(`Введите новое значение для A[${idx.i}][${idx.j}]:`);
        if (val === null) return;
        const num = parseFloat(val);
        if (isNaN(num)) {
            alert('Некорректное число');
            return;
        }
        try {
            matA.set(idx.i, idx.j, num);
            renderAll();
        } catch (e) {
            alert(e.message);
        }
    }
});

maxABtn.addEventListener('click', () => {
    if (!matA) { alert('Сначала создайте матрицы'); return; }
    const idx = matA.maxIndex();
    alert(`Максимальный элемент A: A[${idx.i}][${idx.j}] = ${matA.data[idx.i][idx.j]}`);
});

minABtn.addEventListener('click', () => {
    if (!matA) { alert('Сначала создайте матрицы'); return; }
    const idx = matA.minIndex();
    alert(`Минимальный элемент A: A[${idx.i}][${idx.j}] = ${matA.data[idx.i][idx.j]}`);
});

// Аналогично для B
getBBtn.addEventListener('click', () => {
    if (!matB) { alert('Сначала создайте матрицы'); return; }
    const idx = promptIndexes('B');
    if (idx) {
        try {
            const val = matB.get(idx.i, idx.j);
            alert(`B[${idx.i}][${idx.j}] = ${val}`);
        } catch (e) {
            alert(e.message);
        }
    }
});

setBBtn.addEventListener('click', () => {
    if (!matB) { alert('Сначала создайте матрицы'); return; }
    const idx = promptIndexes('B');
    if (idx) {
        const val = prompt(`Введите новое значение для B[${idx.i}][${idx.j}]:`);
        if (val === null) return;
        const num = parseFloat(val);
        if (isNaN(num)) {
            alert('Некорректное число');
            return;
        }
        try {
            matB.set(idx.i, idx.j, num);
            renderAll();
        } catch (e) {
            alert(e.message);
        }
    }
});

maxBBtn.addEventListener('click', () => {
    if (!matB) { alert('Сначала создайте матрицы'); return; }
    const idx = matB.maxIndex();
    alert(`Максимальный элемент B: B[${idx.i}][${idx.j}] = ${matB.data[idx.i][idx.j]}`);
});

minBBtn.addEventListener('click', () => {
    if (!matB) { alert('Сначала создайте матрицы'); return; }
    const idx = matB.minIndex();
    alert(`Минимальный элемент B: B[${idx.i}][${idx.j}] = ${matB.data[idx.i][idx.j]}`);
});

// Операции
addBtn.addEventListener('click', () => {
    if (!matA || !matB) { alert('Сначала создайте матрицы'); return; }
    try {
        const result = matA.add(matB);
        renderMatrix(result, resultDiv);
    } catch (e) {
        alert(e.message);
    }
});

subBtn.addEventListener('click', () => {
    if (!matA || !matB) { alert('Сначала создайте матрицы'); return; }
    try {
        const result = matA.subtract(matB);
        renderMatrix(result, resultDiv);
    } catch (e) {
        alert(e.message);
    }
});

mulBtn.addEventListener('click', () => {
    if (!matA || !matB) { alert('Сначала создайте матрицы'); return; }
    try {
        const result = matA.multiply(matB);
        renderMatrix(result, resultDiv);
    } catch (e) {
        alert(e.message);
    }
});

// Логи
printLogABtn.addEventListener('click', () => {
    if (!matA) { alert('Сначала создайте матрицы'); return; }
    matA.printLog();
});

printLogBBtn.addEventListener('click', () => {
    if (!matB) { alert('Сначала создайте матрицы'); return; }
    matB.printLog();
});

clearLogABtn.addEventListener('click', () => {
    if (!matA) { alert('Сначала создайте матрицы'); return; }
    matA.clearLog();
    alert('Лог матрицы A очищен');
});

clearLogBBtn.addEventListener('click', () => {
    if (!matB) { alert('Сначала создайте матрицы'); return; }
    matB.clearLog();
    alert('Лог матрицы B очищен');
});

// При загрузке создаём матрицы по умолчанию
window.addEventListener('load', () => {
    createMatrices(3);
    randomFill();
});