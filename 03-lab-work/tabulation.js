/**
 * Вычисление факториала числа n
 * @param {number} n - целое неотрицательное число
 * @returns {number} факториал n
 */
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;

    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

/**
 * Табулирование функции варианта 16
 * f(x,y) = (x/2) * ∏(1 + y*x^n/n!) + (x+y)/(x^2+1) * ∏(y + x^(n+1)/(2n-5))
 */
function tabulate(nm1, nm2, xStart, xEnd, xStep, yStart, yEnd, yStep) {
    // Формирование массивов значений x и y
    const xValues = [];
    const yValues = [];

    for (let x = xStart; x <= xEnd + xStep/2; x += xStep) {
        xValues.push(parseFloat(x.toFixed(5)));
    }

    for (let y = yStart; y <= yEnd + yStep/2; y += yStep) {
        yValues.push(parseFloat(y.toFixed(5)));
    }

    if (xValues.length === 0 || yValues.length === 0) {
        return {
            xValues,
            yValues,
            matrix: [],
            maxVal: null,
            minVal: null,
            maxCoord: null,
            minCoord: null
        };
    }

    const matrix = [];
    let maxVal = -Infinity;
    let minVal = Infinity;
    let maxCoord = null;
    let minCoord = null;

    // Табулирование функции
    for (let i = 0; i < xValues.length; i++) {
        const row = [];
        const x = xValues[i];

        for (let j = 0; j < yValues.length; j++) {
            const y = yValues[j];
            let f = 0;

            try {
                // Первое произведение: (x/2) * ∏(1 + y*x^n/n!)
                let product1 = 1;
                for (let n = 1; n <= nm1; n++) {
                    const term = 1 + (y * Math.pow(x, n)) / factorial(n);
                    product1 *= term;
                }

                // Второе произведение: ∏(y + x^(n+1)/(2n-5))
                let product2 = 1;
                for (let n = 1; n <= nm2; n++) {
                    const denominator = 2 * n - 5;
                    const term = y + Math.pow(x, n + 1) / denominator;
                    product2 *= term;
                }

                // Полное выражение
                f = (x / 2) * product1 + ((x + y) / (Math.pow(x, 2) + 1)) * product2;

                // Проверка на бесконечность и NaN
                if (!isFinite(f) || isNaN(f)) {
                    f = NaN;
                }
            } catch (e) {
                f = NaN;
            }

            row.push(f);

            // Обновление максимума и минимума
            if (!isNaN(f)) {
                if (f > maxVal) {
                    maxVal = f;
                    maxCoord = { x, y, row: i, col: j };
                }
                if (f < minVal) {
                    minVal = f;
                    minCoord = { x, y, row: i, col: j };
                }
            }
        }
        matrix.push(row);
    }

    return {
        xValues,
        yValues,
        matrix,
        maxVal: maxVal !== -Infinity ? maxVal : null,
        minVal: minVal !== Infinity ? minVal : null,
        maxCoord,
        minCoord
    };
}

/**
 * Отрисовка таблицы результатов
 */
function renderTable(data, container) {
    const { xValues, yValues, matrix, maxVal, minVal, maxCoord, minCoord } = data;

    if (xValues.length === 0 || yValues.length === 0) {
        container.innerHTML = '<p class="error">Заданы пустые диапазоны.</p>';
        return;
    }

    // Построение заголовка таблицы
    let html = '<table><thead><tr><th>x\\y</th>';

    for (let y of yValues) {
        html += `<th>${y.toFixed(4)}</th>`;
    }
    html += '</tr></thead><tbody>';

    // Заполнение таблицы значениями
    for (let i = 0; i < xValues.length; i++) {
        const x = xValues[i];
        html += '<tr>';
        html += `<th>${x.toFixed(4)}</th>`;

        for (let j = 0; j < yValues.length; j++) {
            const val = matrix[i][j];
            let cellClass = '';
            let cellText = '';

            if (isNaN(val)) {
                cellText = '---';
            } else {
                cellText = val.toFixed(4);

                // Выделение максимума и минимума
                if (maxCoord && i === maxCoord.row && j === maxCoord.col) {
                    cellClass = 'max-cell';
                } else if (minCoord && i === minCoord.row && j === minCoord.col) {
                    cellClass = 'min-cell';
                }
            }

            html += `<td class="${cellClass}">${cellText}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody></table>';

    // Информация об экстремумах
    let infoHtml = '';
    if (maxVal !== null && minVal !== null) {
        infoHtml = `<p class="info">
            <strong>Максимум:</strong> f(${maxCoord.x.toFixed(4)}, ${maxCoord.y.toFixed(4)}) = ${maxVal.toFixed(6)} (зелёный)<br>
            <strong>Минимум:</strong> f(${minCoord.x.toFixed(4)}, ${minCoord.y.toFixed(4)}) = ${minVal.toFixed(6)} (красный)
        </p>`;
    } else if (maxVal === null && minVal === null) {
        infoHtml = '<p class="error">Нет ни одного допустимого значения функции (все точки не определены).</p>';
    }

    container.innerHTML = infoHtml + html;
}