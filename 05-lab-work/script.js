// Хранение текущих матриц
let m1 = [];
let m2 = [];

// Элементы управления
const rowsM1 = document.getElementById('rowsM1');
const colsM1 = document.getElementById('colsM1');
const rowsM2 = document.getElementById('rowsM2');
const colsM2 = document.getElementById('colsM2');
const minVal = document.getElementById('minVal');
const maxVal = document.getElementById('maxVal');
const generateBtn = document.getElementById('generateBtn');
const transformBtn = document.getElementById('transformBtn');

// Контейнеры для вывода
const m1OriginalDiv = document.getElementById('m1Original');
const m2OriginalDiv = document.getElementById('m2Original');
const m1TransformedDiv = document.getElementById('m1Transformed');
const m2TransformedDiv = document.getElementById('m2Transformed');

/**
 * Генерирует матрицу заданного размера со случайными целыми числами в диапазоне [min, max]
 * @param {number} rows - количество строк
 * @param {number} cols - количество столбцов
 * @param {number} min - минимальное значение
 * @param {number} max - максимальное значение
 * @returns {number[][]} матрица
 */
function generateMatrix(rows, cols, min, max) {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () =>
            Math.floor(Math.random() * (max - min + 1)) + min
        )
    );
}

/**
 * Отображает матрицу в указанном DOM-элементе
 * @param {number[][]} matrix - матрица
 * @param {HTMLElement} container - элемент для вставки таблицы
 */
function renderMatrix(matrix, container) {
    // Очистка
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    if (!matrix || matrix.length === 0) return;

    const table = document.createElement('table');
    matrix.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    container.appendChild(table);
}

/**
 * Преобразует вектор (строку матрицы) – перемещает чётные элементы в начало, нечётные в конец.
 * Использует мутабельный метод sort с пользовательским компаратором.
 * @param {number[]} arr - массив чисел (изменяется на месте)
 */
function reorderEvenOdd(arr) {
    arr.sort((a, b) => {
        const aEven = a % 2 === 0;
        const bEven = b % 2 === 0;
        if (aEven && !bEven) return -1; // чётное перед нечётным
        if (!aEven && bEven) return 1;  // нечётное после чётного
        return 0; // сохраняем относительный порядок
    });
}

/**
 * Применяет функцию reorderEvenOdd к каждой строке матрицы (мутабельно)
 * @param {number[][]} matrix - матрица
 */
function transformMatrix(matrix) {
    matrix.forEach(row => reorderEvenOdd(row));
}

// Обработчик генерации
generateBtn.addEventListener('click', () => {
    // Получаем значения
    const r1 = parseInt(rowsM1.value, 10);
    const c1 = parseInt(colsM1.value, 10);
    const r2 = parseInt(rowsM2.value, 10);
    const c2 = parseInt(colsM2.value, 10);
    const min = parseInt(minVal.value, 10);
    const max = parseInt(maxVal.value, 10);

    // Валидация
    if (isNaN(r1) || r1 < 1 || r1 > 10) { alert('Строки M1 должны быть от 1 до 10'); return; }
    if (isNaN(c1) || c1 < 1 || c1 > 10) { alert('Столбцы M1 должны быть от 1 до 10'); return; }
    if (isNaN(r2) || r2 < 1 || r2 > 10) { alert('Строки M2 должны быть от 1 до 10'); return; }
    if (isNaN(c2) || c2 < 1 || c2 > 10) { alert('Столбцы M2 должны быть от 1 до 10'); return; }
    if (isNaN(min) || isNaN(max) || min > max) { alert('Некорректный диапазон'); return; }

    // Генерация
    m1 = generateMatrix(r1, c1, min, max);
    m2 = generateMatrix(r2, c2, min, max);

    // Отображение исходных
    renderMatrix(m1, m1OriginalDiv);
    renderMatrix(m2, m2OriginalDiv);
    // Очистка преобразованных (пока не применяли)
    renderMatrix([], m1TransformedDiv);
    renderMatrix([], m2TransformedDiv);
});

// Обработчик преобразования
transformBtn.addEventListener('click', () => {
    if (m1.length === 0 || m2.length === 0) {
        alert('Сначала сгенерируйте матрицы');
        return;
    }

    // Создаём глубокие копии для преобразования (чтобы сохранить исходные)
    const m1Copy = m1.map(row => row.slice());
    const m2Copy = m2.map(row => row.slice());

    // Применяем преобразование к копиям
    transformMatrix(m1Copy);
    transformMatrix(m2Copy);

    // Отображаем результат
    renderMatrix(m1Copy, m1TransformedDiv);
    renderMatrix(m2Copy, m2TransformedDiv);
});

// Инициализация: пустые матрицы
renderMatrix([], m1OriginalDiv);
renderMatrix([], m2OriginalDiv);
renderMatrix([], m1TransformedDiv);
renderMatrix([], m2TransformedDiv);