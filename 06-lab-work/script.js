/**
 * @fileoverview Лабораторная работа №6, Вариант 4: Детали
 * Генерация массива объектов деталей, удаление свойства "материал" при массе ниже порога,
 * добавление свойства "габаритный объём", сортировка по убыванию массы, сериализация JSON.
 */

/** @type {Array<Object>} Текущий массив деталей */
let details = [];

/** @type {HTMLInputElement} Поле ввода количества деталей */
const countInput = document.getElementById('countInput');
/** @type {HTMLInputElement} Поле ввода порога массы */
const massThreshold = document.getElementById('massThreshold');
/** @type {HTMLButtonElement} Кнопка генерации */
const generateBtn = document.getElementById('generateBtn');
/** @type {HTMLButtonElement} Кнопка удаления материала */
const deleteMaterialBtn = document.getElementById('deleteMaterialBtn');
/** @type {HTMLButtonElement} Кнопка добавления объёма */
const addVolumeBtn = document.getElementById('addVolumeBtn');
/** @type {HTMLButtonElement} Кнопка сортировки */
const sortBtn = document.getElementById('sortBtn');
/** @type {HTMLButtonElement} Кнопка сохранения JSON */
const saveBtn = document.getElementById('saveBtn');
/** @type {HTMLButtonElement} Кнопка загрузки JSON */
const loadBtn = document.getElementById('loadBtn');
/** @type {HTMLInputElement} Скрытый input для выбора файла */
const loadFile = document.getElementById('loadFile');

/** @type {HTMLElement} Контейнер для исходных деталей */
const originalTable = document.getElementById('originalTable');
/** @type {HTMLElement} Контейнер для деталей после удаления материала */
const afterDeleteTable = document.getElementById('afterDeleteTable');
/** @type {HTMLElement} Контейнер для деталей после добавления объёма */
const afterVolumeTable = document.getElementById('afterVolumeTable');
/** @type {HTMLElement} Контейнер для отсортированных деталей */
const sortedTable = document.getElementById('sortedTable');

/** @type {Array<Object>} Массив деталей после удаления материала */
let detailsAfterDelete = [];
/** @type {Array<Object>} Массив деталей после добавления объёма */
let detailsAfterVolume = [];
/** @type {Array<Object>} Массив отсортированных деталей */
let detailsSorted = [];

/** @constant {Array<string>} Список возможных материалов */
const materials = ['Сталь', 'Алюминий', 'Пластик', 'Медь', 'Латунь', 'Дерево', 'Стекло', 'Титан'];
/** @constant {Array<string>} Список названий организаций-поставщиков */
const orgNames = ['ООО "МеталлСнаб"', 'ЗАО "ДетальСервис"', 'ИП Петров', 'Компания "ТехноПром"', 'ОАО "Машиностроитель"', 'ТД "Инструмент"'];

/**
 * Генерирует случайное число в диапазоне [min, max]
 * @param {number} min - Минимальное значение
 * @param {number} max - Максимальное значение
 * @param {boolean} [float=false] - Возвращать число с плавающей точкой
 * @returns {number} Случайное число
 */
function random(min, max, float = false) {
    const val = Math.random() * (max - min) + min;
    return float ? val : Math.floor(val);
}

/**
 * Генерирует случайный телефон в формате +7XXXYYYYYYY
 * @returns {string} Случайный номер телефона
 */
function randomPhone() {
    return `+7${random(900, 999)}${random(1000000, 9999999)}`;
}

/**
 * Создаёт случайный объект детали
 * @param {number} index - Индекс детали для формирования названия
 * @returns {Object} Объект детали
 */
function createDetail(index) {
    const length = random(1, 50);
    const width = random(1, 30);
    const height = random(1, 20);
    const mass = random(0.5, 50, true);
    const material = materials[random(0, materials.length - 1)];
    const suppliersCount = random(1, 4);
    const suppliers = [];
    for (let i = 0; i < suppliersCount; i++) {
        suppliers.push({
            name: orgNames[random(0, orgNames.length - 1)],
            phone: randomPhone()
        });
    }
    return {
        name: `Деталь-${index}`,
        dimensions: { length, width, height },
        material,
        mass: +mass.toFixed(2),
        suppliers
    };
}

/**
 * Генерирует массив деталей заданного размера
 * @param {number} count - Количество деталей
 * @returns {Array<Object>} Массив объектов деталей
 */
function generateDetails(count) {
    return Array.from({ length: count }, (_, i) => createDetail(i + 1));
}

/**
 * Форматирует поставщиков для отображения (только первый + количество остальных)
 * @param {Array<Object>} suppliers - Массив поставщиков
 * @returns {string} Отформатированная строка
 */
function formatSuppliers(suppliers) {
    if (!suppliers || suppliers.length === 0) return '—';
    const first = suppliers[0];
    let result = `${first.name} (${first.phone})`;
    if (suppliers.length > 1) {
        result += ` и ещё ${suppliers.length - 1}`;
    }
    return result;
}

/**
 * Отображает массив деталей в указанном контейнере как HTML-таблицу
 * @param {Array<Object>} detailsArray - Массив деталей для отображения
 * @param {HTMLElement} container - Контейнер для вставки таблицы
 */
function renderDetails(detailsArray, container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    if (!detailsArray || detailsArray.length === 0) {
        container.textContent = 'Нет данных';
        return;
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Название', 'Габариты (Д×Ш×В)', 'Материал', 'Масса', 'Поставщики', 'Объём'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    detailsArray.forEach(d => {
        const tr = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.textContent = d.name;
        tr.appendChild(tdName);

        const tdDim = document.createElement('td');
        tdDim.textContent = `${d.dimensions.length}×${d.dimensions.width}×${d.dimensions.height}`;
        tr.appendChild(tdDim);

        const tdMat = document.createElement('td');
        tdMat.textContent = d.material !== undefined ? d.material : '—';
        tr.appendChild(tdMat);

        const tdMass = document.createElement('td');
        tdMass.textContent = d.mass;
        tr.appendChild(tdMass);

        const tdSup = document.createElement('td');
        tdSup.textContent = formatSuppliers(d.suppliers);
        tr.appendChild(tdSup);

        const tdVol = document.createElement('td');
        tdVol.textContent = d.volume !== undefined ? d.volume.toFixed(2) : '—';
        tr.appendChild(tdVol);

        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.appendChild(table);
}

/**
 * Обновляет все таблицы на основе текущих состояний
 */
function renderAll() {
    renderDetails(details, originalTable);
    renderDetails(detailsAfterDelete, afterDeleteTable);
    renderDetails(detailsAfterVolume, afterVolumeTable);
    renderDetails(detailsSorted, sortedTable);
}

/**
 * Инициализация: создание начального набора деталей
 */
function init() {
    const count = parseInt(countInput.value, 10) || 5;
    details = generateDetails(count);
    detailsAfterDelete = details.map(d => ({ ...d, suppliers: d.suppliers.map(s => ({...s})) }));
    detailsAfterVolume = details.map(d => ({ ...d, suppliers: d.suppliers.map(s => ({...s})) }));
    detailsSorted = [];
    renderAll();
}

generateBtn.addEventListener('click', () => {
    const count = parseInt(countInput.value, 10);
    if (isNaN(count) || count < 1 || count > 20) {
        alert('Введите количество деталей от 1 до 20');
        return;
    }
    details = generateDetails(count);
    detailsAfterDelete = details.map(d => ({ ...d, suppliers: d.suppliers.map(s => ({...s})) }));
    detailsAfterVolume = details.map(d => ({ ...d, suppliers: d.suppliers.map(s => ({...s})) }));
    detailsSorted = [];
    renderAll();
});

deleteMaterialBtn.addEventListener('click', () => {
    const threshold = parseFloat(massThreshold.value);
    if (isNaN(threshold)) {
        alert('Введите корректный порог массы');
        return;
    }
    let deletedCount = 0;
    detailsAfterDelete.forEach(d => {
        if (d.mass < threshold && d.material !== undefined) {
            delete d.material;
            deletedCount++;
        }
    });
    renderAll();
    alert(`Удалено свойств "материал" у ${deletedCount} деталей.`);
});

addVolumeBtn.addEventListener('click', () => {
    detailsAfterVolume.forEach(d => {
        const { length, width, height } = d.dimensions;
        d.volume = length * width * height;
    });
    renderAll();
});

sortBtn.addEventListener('click', () => {
    const copy = details.map(d => ({
        ...d,
        dimensions: { ...d.dimensions },
        suppliers: d.suppliers.map(s => ({ ...s }))
    }));
    copy.sort((a, b) => b.mass - a.mass);
    detailsSorted = copy;
    renderAll();
});

saveBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(details, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'details.json';
    a.click();
    URL.revokeObjectURL(url);
});

loadBtn.addEventListener('click', () => {
    loadFile.click();
});

loadFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const data = JSON.parse(ev.target.result);
            if (!Array.isArray(data)) throw new Error('Не массив');
            details = data;
            detailsAfterDelete = details.map(d => ({ ...d, suppliers: d.suppliers ? d.suppliers.map(s => ({...s})) : [] }));
            detailsAfterVolume = details.map(d => ({ ...d, suppliers: d.suppliers ? d.suppliers.map(s => ({...s})) : [] }));
            detailsSorted = [];
            renderAll();
        } catch (err) {
            alert('Ошибка загрузки JSON: ' + err.message);
        }
        loadFile.value = '';
    };
    reader.readAsText(file);
});

init();