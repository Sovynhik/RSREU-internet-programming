/**
 * @fileoverview Лабораторная работа №7, Вариант 4
 * Анализ функций с использованием функций высшего порядка,
 * мемоизации, отладки и счётчика вызовов.
 */

/** @type {Function} f1(x) = x * sqrt(sin^3(x+10)) + (x^3 - cos x) / x */
const f1 = (x) => {
    if (x === 0) return NaN;
    const term1 = x * Math.sqrt(Math.pow(Math.sin(x + 10), 3));
    const term2 = (Math.pow(x, 3) - Math.cos(x)) / x;
    return term1 + term2;
};

/** @type {Function} f2(x) = sin^2 x - |sin(x-4)| */
const f2 = (x) => {
    return Math.pow(Math.sin(x), 2) - Math.abs(Math.sin(x - 4));
};

/** @type {Function} f3(x) = e^(x-2) + x^3 + 2*x*ln(x+3)/7 */
const f3 = (x) => {
    if (x + 3 <= 0) return NaN;
    return Math.exp(x - 2) + Math.pow(x, 3) + (2 * x * Math.log(x + 3)) / 7;
};

/** @type {Object.<string, Function>} Словарь функций для выбора по имени */
const funcs = { f1, f2, f3 };

/**
 * Поиск минимума среди определённых значений (не NaN и не Infinity)
 * @param {number[]} y - массив значений
 * @returns {number|null} минимум или null, если нет значений
 */
function calcMin(y) {
    const valid = y.filter(v => Number.isFinite(v));
    return valid.length ? Math.min(...valid) : null;
}

/**
 * Проверка, является ли функция монотонно убывающей на заданной сетке.
 * @param {number[]} x - массив абсцисс
 * @param {number[]} y - массив значений
 * @returns {boolean} true, если для всех последовательных точек с определёнными значениями y не возрастает
 */
function isMonotoneDecreasing(x, y) {
    const points = [];
    for (let i = 0; i < x.length; i++) {
        if (Number.isFinite(y[i])) {
            points.push({ x: x[i], y: y[i] });
        }
    }
    if (points.length < 2) return true;
    for (let i = 0; i < points.length - 1; i++) {
        if (points[i].y < points[i + 1].y) return false;
    }
    return true;
}

/**
 * Количество нулевых значений (с учётом погрешности 1e-10)
 * @param {number[]} y - массив значений
 * @returns {number} количество значений, близких к нулю
 */
function countZeros(y) {
    return y.filter(v => Number.isFinite(v) && Math.abs(v) < 1e-10).length;
}

/**
 * Создаёт обёртку над математической функцией с заданными опциями.
 * @param {Function} f - исходная функция одного аргумента
 * @param {Object} options - объект с булевыми флагами: memoize, debug, count
 * @returns {Function} обёрнутая функция с методами .getCache(), .getCacheSize(), .getCallCount(), .resetCallCount()
 */
function wrapFunction(f, options) {
    /** @type {Object.<number, number>} */
    let cache = {};
    /** @type {number} */
    let callCount = 0;

    /**
     * Обёрнутая функция
     * @param {number} x - аргумент
     * @returns {number} значение функции
     */
    function wrapped(x) {
        let result;

        if (options.memoize && cache.hasOwnProperty(x)) {
            result = cache[x];
        } else {
            result = f(x);
            if (options.memoize) {
                cache[x] = result;
            }
        }

        if (options.count) {
            callCount++;
        }

        if (options.debug) {
            console.log(`[${new Date().toLocaleTimeString()}] f(${x}) = ${result}`);
        }

        return result;
    }

    /** @returns {Object} объект кэша */
    wrapped.getCache = () => cache;
    /** @returns {number} размер кэша */
    wrapped.getCacheSize = () => Object.keys(cache).length;
    /** @returns {number} количество вызовов */
    wrapped.getCallCount = () => callCount;
    /** @returns {void} */
    wrapped.resetCallCount = () => { callCount = 0; };

    return wrapped;
}

/**
 * Вычисляет заданные характеристики функции на отрезке [a, b] с шагом h.
 * @param {Function} func - функция одного аргумента (может быть обёрнутой)
 * @param {number} a - начало отрезка
 * @param {number} b - конец отрезка
 * @param {number} h - шаг
 * @param {Array<Function>} charFuncs - массив функций характеристик
 * @returns {Array} массив результатов характеристик
 */
function computeCharacteristics(func, a, b, h, charFuncs) {
    /** @type {number[]} */
    const x = [];
    /** @type {number[]} */
    const y = [];
    for (let xi = a; xi <= b + h/2; xi += h) {
        const xVal = parseFloat(xi.toFixed(10));
        x.push(xVal);
        y.push(func(xVal));
    }
    return charFuncs.map(f => f(x, y));
}

/** @type {HTMLInputElement} */
const inputA = document.getElementById('inputA');
/** @type {HTMLInputElement} */
const inputB = document.getElementById('inputB');
/** @type {HTMLInputElement} */
const inputH = document.getElementById('inputH');
/** @type {HTMLSelectElement} */
const selectFunc = document.getElementById('selectFunc');
/** @type {HTMLInputElement} */
const chMin = document.getElementById('chMin');
/** @type {HTMLInputElement} */
const chMonotone = document.getElementById('chMonotone');
/** @type {HTMLInputElement} */
const chZeros = document.getElementById('chZeros');
/** @type {HTMLInputElement} */
const optMemoize = document.getElementById('optMemoize');
/** @type {HTMLInputElement} */
const optDebug = document.getElementById('optDebug');
/** @type {HTMLInputElement} */
const optCount = document.getElementById('optCount');
/** @type {HTMLButtonElement} */
const calcBtn = document.getElementById('calcBtn');
/** @type {HTMLElement} */
const charResultsDiv = document.getElementById('charResults');
/** @type {HTMLElement} */
const extraInfoDiv = document.getElementById('extraInfo');
/** @type {HTMLElement} */
const cacheOutputDiv = document.getElementById('cacheOutput');

/** @type {Object.<string, {label: string, func: Function}>} */
const characteristics = {
    min: { label: 'Минимум', func: (x, y) => calcMin(y) },
    monotone: { label: 'Монотонно убывающая', func: (x, y) => isMonotoneDecreasing(x, y) ? 'Да' : 'Нет' },
    zeros: { label: 'Количество нулевых значений', func: (x, y) => countZeros(y) }
};

calcBtn.addEventListener('click', () => {
    const a = parseFloat(inputA.value);
    const b = parseFloat(inputB.value);
    const h = parseFloat(inputH.value);
    const funcName = selectFunc.value;

    if (isNaN(a) || isNaN(b) || isNaN(h) || h <= 0) {
        alert('Некорректные значения a, b или h');
        return;
    }
    if (a > b) {
        alert('a должно быть меньше или равно b');
        return;
    }

    const baseFunc = funcs[funcName];

    const options = {
        memoize: optMemoize.checked,
        debug: optDebug.checked,
        count: optCount.checked
    };

    const wrappedFunc = wrapFunction(baseFunc, options);

    const selectedChars = [];
    if (chMin.checked) selectedChars.push(characteristics.min);
    if (chMonotone.checked) selectedChars.push(characteristics.monotone);
    if (chZeros.checked) selectedChars.push(characteristics.zeros);

    if (selectedChars.length === 0) {
        alert('Выберите хотя бы одну характеристику');
        return;
    }

    const charFuncs = selectedChars.map(c => c.func);
    const results = computeCharacteristics(wrappedFunc, a, b, h, charFuncs);

    let html = '';
    selectedChars.forEach((c, idx) => {
        html += `<p><strong>${c.label}:</strong> ${results[idx]}</p>`;
    });
    charResultsDiv.innerHTML = html;

    let extra = '';
    if (options.memoize) {
        extra += `<p>Размер кэша: ${wrappedFunc.getCacheSize()}</p>`;
    }
    if (options.count) {
        extra += `<p>Количество вызовов: ${wrappedFunc.getCallCount()}</p>`;
    }
    extraInfoDiv.innerHTML = extra;

    if (options.memoize) {
        const cache = wrappedFunc.getCache();
        let cacheHtml = '<table><tr><th>Аргумент</th><th>Значение</th></tr>';
        Object.keys(cache).sort((a,b) => parseFloat(a) - parseFloat(b)).forEach(key => {
            cacheHtml += `<tr><td>${key}</td><td>${cache[key]}</td></tr>`;
        });
        cacheHtml += '</table>';
        cacheOutputDiv.innerHTML = cacheHtml;
    } else {
        cacheOutputDiv.innerHTML = '<p>Мемоизация не включена</p>';
    }
});