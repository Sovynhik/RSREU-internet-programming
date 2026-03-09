/**
 * Хранит оригинальные данные таблицы (неизменяемый эталон).
 * @type {number[][]}
 */
let originalData = [];

/**
 * Количество строк в оригинальной таблице.
 * @type {number}
 */
let originalRows = 0;

/**
 * Количество столбцов в оригинальной таблице.
 * @type {number}
 */
let originalCols = 0;

/** @type {HTMLInputElement} */
const rowsInput = document.getElementById('rowsInput');

/** @type {HTMLInputElement} */
const colsInput = document.getElementById('colsInput');

/** @type {HTMLInputElement} */
const createBtn = document.getElementById('createBtn');

/** @type {HTMLInputElement} */
const resetBtn = document.getElementById('resetBtn');

/** @type {HTMLElement} */
const tableContainer = document.getElementById('tableContainer');

/** @type {HTMLInputElement} */
const action1Btn = document.getElementById('action1Btn');

/** @type {HTMLInputElement} */
const action2Btn = document.getElementById('action2Btn');

/** @type {HTMLInputElement} */
const action3Btn = document.getElementById('action3Btn');

/** @type {HTMLInputElement} */
const rowsToExclude = document.getElementById('rowsToExclude');

/**
 * Проверяет и корректирует введённые пользователем размеры таблицы.
 * @returns {{rows: number, cols: number}} Объект с валидными значениями строк и столбцов (от 1 до 50)
 */
function getValidatedDimensions() {
    let rows = parseInt(rowsInput.value);
    let cols = parseInt(colsInput.value);
    if (isNaN(rows) || rows < 1) rows = 1;
    if (isNaN(cols) || cols < 1) cols = 1;
    if (rows > 50) rows = 50;
    if (cols > 50) cols = 50;
    rowsInput.value = rows;
    colsInput.value = cols;
    return { rows, cols };
}

/**
 * Генерирует двумерный массив случайных чисел от 1 до 100.
 * @param {number} rows - Количество строк
 * @param {number} cols - Количество столбцов
 * @returns {number[][]} Матрица случайных чисел
 */
function generateRandomData(rows, cols) {
    const data = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(Math.floor(Math.random() * 100) + 1);
        }
        data.push(row);
    }
    return data;
}

/**
 * Определяет индексы центральных элементов для массива заданной длины.
 * @param {number} length - Длина массива
 * @returns {number[]} Массив индексов центральных элементов
 */
function getCentralIndices(length) {
    if (length % 2 === 1) {
        return [Math.floor(length / 2)];
    } else {
        return [length / 2 - 1, length / 2];
    }
}

/**
 * Отрисовывает таблицу в контейнере на основе переданных данных.
 * @param {number[][]} data - Двумерный массив данных для отображения
 * @param {Object} options - Опции отрисовки
 * @param {number} [options.overrideRed] - Значение для заполнения красных ячеек
 * @param {number[]} [options.excludeRows] - Массив индексов строк, которые не должны иметь цвет
 */
function renderTable(data, options = {}) {
    // Очистка контейнера
    while (tableContainer.firstChild) {
        tableContainer.removeChild(tableContainer.firstChild);
    }

    const rows = data.length;
    const cols = data[0].length;
    const centerCols = getCentralIndices(cols);
    const centerRows = getCentralIndices(rows);
    const excludeRows = options.excludeRows || [];

    const table = document.createElement('table');

    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const td = document.createElement('td');
            let cellValue = data[i][j];

            // Заполнение красных ячеек, если задано и строка не исключена
            if (options.overrideRed !== undefined && centerCols.includes(j) && !excludeRows.includes(i)) {
                cellValue = options.overrideRed;
            }

            td.textContent = cellValue;

            // Расстановка цветов через классы (исключённые строки остаются без цвета)
            if (!excludeRows.includes(i)) {
                if (centerCols.includes(j)) {
                    td.classList.add('red-cell');
                } else if (centerRows.includes(i)) {
                    td.classList.add('blue-cell');
                }
            }

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    tableContainer.appendChild(table);
}

/**
 * Создаёт новую таблицу на основе введённых пользователем размеров.
 */
function createNewTable() {
    const { rows, cols } = getValidatedDimensions();
    originalRows = rows;
    originalCols = cols;
    originalData = generateRandomData(rows, cols);
    renderTable(originalData);
}

// Обработчики событий
createBtn.addEventListener('click', createNewTable);

resetBtn.addEventListener('click', () => {
    if (originalData.length > 0) {
        renderTable(originalData);
    } else {
        createNewTable();
    }
});

/**
 * Действие 1: Заполняет красные ячейки суммой или средним арифметическим всех чисел таблицы.
 */
action1Btn.addEventListener('click', () => {
    if (originalData.length === 0) {
        alert('Сначала создайте таблицу!');
        return;
    }

    // Определяем выбранное радио
    let selected = 'sum';
    const radios = document.getElementsByName('sumavgRed');
    for (let radio of radios) {
        if (radio.checked) {
            selected = radio.value;
            break;
        }
    }

    // Вычисляем общую сумму
    let totalSum = 0;
    for (let row of originalData) {
        for (let val of row) {
            totalSum += val;
        }
    }

    let value;
    if (selected === 'sum') {
        value = totalSum;
    } else {
        const totalCount = originalRows * originalCols;
        value = totalCount > 0 ? totalSum / totalCount : 0;
        value = Math.round(value * 100) / 100; // округление до двух знаков
    }

    renderTable(originalData, { overrideRed: value, excludeRows: [] });
});

/**
 * Действие 2: Убирает цветовую заливку для указанных пользователем строк.
 */
action2Btn.addEventListener('click', () => {
    if (originalData.length === 0) {
        alert('Сначала создайте таблицу!');
        return;
    }

    const input = rowsToExclude.value;
    if (!input.trim()) {
        alert('Введите номера строк');
        return;
    }

    // Парсим строки: разделяем по запятой, обрезаем пробелы, преобразуем в числа
    const parts = input.split(',').map(s => s.trim());
    const excludeIndices = [];
    for (let part of parts) {
        const num = parseInt(part, 10);
        if (isNaN(num) || num < 1 || num > originalRows) {
            alert(`Некорректный номер строки: ${part}. Допустимы значения от 1 до ${originalRows}`);
            return;
        }
        excludeIndices.push(num - 1); // переводим в 0-индексацию
    }

    renderTable(originalData, { excludeRows: excludeIndices });
});

/**
 * Действие 3: Поворачивает таблицу на 90 градусов вправо.
 */
action3Btn.addEventListener('click', () => {
    if (originalData.length === 0) {
        alert('Сначала создайте таблицу!');
        return;
    }

    const rows = originalRows;
    const cols = originalCols;
    // Создаём новую матрицу размером cols x rows
    const rotated = [];
    for (let i = 0; i < cols; i++) {
        rotated[i] = [];
        for (let j = 0; j < rows; j++) {
            // Исходный элемент (rows-1-j, i) становится (i, j) в повёрнутой
            rotated[i][j] = originalData[rows - 1 - j][i];
        }
    }

    // Отрисовываем повёрнутую таблицу (цвета пересчитаются по новым размерам)
    renderTable(rotated, { excludeRows: [] });
});

// Инициализация при загрузке
createNewTable();