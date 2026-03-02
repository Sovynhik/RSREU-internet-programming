let originalData = [];
let originalRows = 0;
let originalCols = 0;

const rowsInput = document.getElementById('rowsInput');
const colsInput = document.getElementById('colsInput');
const createBtn = document.getElementById('createBtn');
const resetBtn = document.getElementById('resetBtn');
const tableContainer = document.getElementById('tableContainer');
const action1Btn = document.getElementById('action1Btn');
const action2Btn = document.getElementById('action2Btn');
const action3Btn = document.getElementById('action3Btn');
const thresholdInput = document.getElementById('threshold');
const sumavgRadios = document.getElementsByName('sumavg');

// Валидация размеров
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

// Генерация случайных чисел
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

// Определение центральных индексов
function getCentralIndices(length) {
    if (length % 2 === 1) {
        return [Math.floor(length / 2)];
    } else {
        return [length / 2 - 1, length / 2];
    }
}

// Отрисовка таблицы (только общие методы DOM)
function renderTable(data, options = {}) {
    // Очистка контейнера
    while (tableContainer.firstChild) {
        tableContainer.removeChild(tableContainer.firstChild);
    }

    const rows = data.length;
    const cols = data[0].length;
    const centerCols = getCentralIndices(cols);
    const centerRows = getCentralIndices(rows);

    const table = document.createElement('table');

    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const td = document.createElement('td');
            let cellValue = data[i][j];

            // Если нужно переопределить значение в синих ячейках
            if (options.overrideBlue !== undefined && centerRows.includes(i)) {
                cellValue = options.overrideBlue;
            }

            td.textContent = cellValue;

            // Расстановка цветов
            if (centerCols.includes(j)) {
                td.style.backgroundColor = '#ffcccc'; // красный
            } else if (centerRows.includes(i)) {
                td.style.backgroundColor = '#ccccff'; // синий
            }

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    tableContainer.appendChild(table);
}

// Создание новой таблицы
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

// Действие 1: удалить строки, где сумма меньше порога
action1Btn.addEventListener('click', () => {
    if (originalData.length === 0) {
        alert('Сначала создайте таблицу!');
        return;
    }

    const threshold = parseFloat(thresholdInput.value);
    if (isNaN(threshold)) {
        alert('Введите корректное пороговое значение');
        return;
    }

    // Вычисляем суммы строк
    const rowSums = originalData.map(row => row.reduce((acc, val) => acc + val, 0));

    // Формируем новый массив данных, оставляя только строки с суммой >= threshold
    const newData = originalData.filter((_, index) => rowSums[index] >= threshold);

    if (newData.length === 0) {
        alert('После удаления таблица пуста. Операция отменена.');
        return;
    }

    renderTable(newData);
});

// Действие 2: заполнить синие ячейки суммой или средним
action2Btn.addEventListener('click', () => {
    if (originalData.length === 0) {
        alert('Сначала создайте таблицу!');
        return;
    }

    let selected = 'sum';
    for (let radio of sumavgRadios) {
        if (radio.checked) {
            selected = radio.value;
            break;
        }
    }

    // Общая сумма
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

    renderTable(originalData, { overrideBlue: value });
});

// Действие 3: отразить строки зеркально по вертикали
action3Btn.addEventListener('click', () => {
    if (originalData.length === 0) {
        alert('Сначала создайте таблицу!');
        return;
    }

    // Создаём копию и переворачиваем массив строк
    const mirrored = [...originalData].reverse();
    renderTable(mirrored);
});

// Инициализация
createNewTable();