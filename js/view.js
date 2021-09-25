'use strict'

/** содержимое футера таблицы при нескрытом столбце. */
const innerText = 'Скрыть';
/** содержимое футера таблицы при скрытом столбце. */
const hiddenInnerText = '+';
/** количество отображаемых номеров страниц. */
const maxNumberOfPaginationBlocks = 5;



/**
 * Создает содерижмое футера таблицы. 
 * @returns {DocumentFragment} - содержимое футера таблицы.
 */
const createTableFooter = () => {

    const tfoot = document.createDocumentFragment();

    const tr = document.createElement('tr');
    tr.classList.add('main__table-container__table__footer__row');

    for (let column = 1; column <= dataTypes.length; column++) {

        const td = document.createElement('td');
        td.classList.add('main__table-container__table__footer__row__col');
        td.dataset.col = column;

        /** если столбец таблицы скрыт, добавление класса 'footer-hidden' к соответтвующей ячейке */
        if (hiddenColumns[column - 1]) {
            td.classList.add('footer-hidden');
            td.textContent = hiddenInnerText;
        } else {
            td.textContent = innerText;
        }

        tr.append(td);
    }

    tfoot.append(tr);

    return tfoot;
}

/**
 * Отрисовывает футер таблицы.  
 */
const fillTableFooter = () => {
    const tfoot = document.querySelector('.main__table-container__table__footer');
    tfoot.append(createTableFooter());
}

/**
 * Создает содержимое заголовка таблицы.
 * @returns {DocumentFragment} - содержимое заголовка таблицы.
 */
const createTableHeader = () => {
    const thead = document.createDocumentFragment();

    const tr = document.createElement('tr');
    tr.classList.add('main__table-container__table__header__row');

    for (let column = 0; column < dataTypes.length; column++) {

        const th = document.createElement('th');
        th.classList.add('main__table-container__table__header__row__col');
        th.dataset.type = dataTypes[column];

        const div = document.createElement('div');
        const span = document.createElement('span');
        span.classList.add('main__table-container__table__header__row__col__text');
        span.textContent = ruDataTypes[column];

        const img = document.createElement('img');
        img.src = 'img/arrow-down-sign-to-navigate.png';
        img.classList.add('sort-arrow');

        div.append(span);
        div.append(img);

        /** если столбец таблицы скрыт, добавление класса 'hidden-column' к соответтвующей ячейке */
        if (hiddenColumns[column]) {
            div.classList.add('hidden-column');
        }

        th.append(div);
        tr.append(th);
    }

    thead.append(tr);

    return thead;
}

/**
 * Отрисовывает заголовок таблицы.  
 */
const fillTableHeader = () => {
    const thead = document.querySelector('.main__table-container__table__header');
    thead.append(createTableHeader());
}

/**
 * Создает содержимое тела таблицы из массива данных.
 * @param {Array} data - массив данных.
 * @returns {DocumentFragment} содержимое тела таблицы.
 */
const createTableBody = data => {
    const tbody = document.createDocumentFragment();

    for (let row of data) {

        /* Атрибут data-id строки таблицы хранит в себе id пользователя.
         * (Id используется для вставки данных в фому редактирования при её отображении)
         */
        const tr = document.createElement('tr');
        tr.classList.add("main__table-container__table__body__row");
        tr.dataset.id = row.id;

        /**
         * Первый элемент подмассива, т.е. values[n][0], вставляется в качетве значения атрибута data-type
         * второй элемент подмассива, т.е. values[n][1], вставляется в ячейку таблицы.
         */
        const values = [
            ['firstName', row.name.firstName],
            ['lastName', row.name.lastName],
            ['about', row.about],
            ['eyeColor', row.eyeColor],
        ];

        /* заполнение ячеек строки таблицы */
        for (let [dataType, value] of values) {

            const td = document.createElement('td');
            td.dataset.type = dataType;
            td.classList.add("main__table-container__table__body__row__col");

            const div = document.createElement('div');

            /* создание блока, окрашенного в соответствии со цветом глаз */
            if (dataType === 'eyeColor') {

                div.classList.add("color-container");
                const colorRay = document.createElement('div');
                colorRay.classList.add("color-container__color-ray");
                colorRay.dataset.color = value;
                div.append(colorRay);
            } else {
                div.textContent = value;
            }

            td.append(div);

            /** если столбец таблицы скрыт, добавление класса 'hidden-column' к соответтвующей ячейке */
            if (hiddenColumns[dataTypes.indexOf(dataType)]) {
                td.classList.add('hidden-column');
                td.firstElementChild.classList.add('hidden-column');
                if (td.firstElementChild.firstElementChild) {
                    td.firstElementChild.firstElementChild.classList.add('hidden-column');
                }
            }

            tr.append(td);
        }

        tbody.append(tr);
    }

    return tbody;
}

/**
 * Очищает, затем отрисовывает содержимое тела таблицы из массива данных.
 * @param {Array} data - массив данных.
 */
const fillTableBody = data => {
    const tbody = document.querySelector('.main__table-container__table__body');
    tbody.innerHTML = '';
    tbody.append(createTableBody(data));
}

/**
 * Очищает форму редактирования.
 */
const clearEditForm = () => {
    for (let field of dataTypes) {
        const formInput = document.querySelector(`#form-${field.toLowerCase()}`);
        formInput.value = "";
    }
}

/**
 * Анимирует скрытие формы редактирования через добавление стилей в вызове setTimeout.
 */
const animateEditFormHiding = () => {
    const el = document.querySelector('.main__form-container');
    /* плавная установка прозрачности формы */
    el.classList.add('opacity-none'); // transition: 0.3s
    /* плавное уменьшение размеров формы (чтобы таблица плавно сдвинулась на свое место) */
    setTimeout(() => el.classList.add('hidden'), 350);  // transition: 0.5s  
    /* добавление CSS свойства display форме редактирования в значение none */
    setTimeout(() => el.classList.add('display-none'), 1000);
}

/**
 * Плавно скрывает форму редактирования и очищает поля.
 */
const hideEditForm = () => {
    animateEditFormHiding(); /* плавное скрытие формы */
    /* Задержка нужна для того, чтобы поля формы очистились уже после того, 
     * как форма полностью исчезнет с экрана.
     */
    setTimeout(clearEditForm, 325); /* очистка полей формы */
}

/**
 * Анимирует появление формы редактирования через добавление стилей в вызове setTimeout.
 */
const animateEditFormAppearance = async () => {
    const el = document.querySelector('.main__form-container');

    /** если форма скрыта - просто отображение */
    if (el.classList.contains('opacity-none')) { 
        el.classList.remove('display-none');
        el.classList.remove('hidden');    // transition: 0.5s      
        setTimeout(() => el.classList.remove('opacity-none'), 500);  // transition: 0.3s
    } 
    /** если форма уже отрыта - скрытие и отображение заново */
    else {
        el.classList.add('opacity-none'); /// transition: 0.3s
        setTimeout(() => el.classList.remove('opacity-none'), 350); // transition: 0.3s
        await new Promise((resolve, reject) => void setTimeout(() => void resolve(), 300));
    }
}

/**
 * Плавно отображает форму редактирования, заполняет поля, устанавливает фокус в input.
 * @param {string} personId - id строки данных.
 * @param {string} focusDataType - поле для установки фокуса.
 * @param {Array} values - строка данных для вставки в поля формы (массив массивов: [[key1, value1]]).
 */
const showEditForm = async (personId, focusDataType, values) => {
    await animateEditFormAppearance(); /* плавное появления формы */

    document.querySelector('#edit-form').dataset.id = personId; /* вставляет атрибут data-id */

    /* вставка данных в поля формы */
    for (let [dataType, value] of values) {
        const formInput = document.querySelector(`#form-${dataType}`);
        formInput.value = value;

        /* установка фокуса на  */
        if (dataType === focusDataType) {
            formInput.focus();
        }
    }
}


/**
 * Создает объект DocumentFragment с блоками для пагинации
 * или null в том случае, если невозможно осуществить пагинацию или в этом нет необходимости.
 * @param {Number} length - общее число записей
 * @param {Number} perPage - число записей на страницу
 * @param {Number} currentPage - номер текущей страницы
 * @returns {DocumentFragment} - блоки для пагинации
 */
const createTablePagination = (length, perPage, currentPage) => {
    /* если невозможно осуществить пагинацию - выход из функции */
    if (!length || !perPage || perPage <= 0 || length <= 0 || perPage > length) {
        return null;
    }

    const paginationContent = document.createDocumentFragment();
    /** количество страниц, на которых разбивается массив данных */
    const numberOfPages = Math.ceil(length / perPage);

    /** Определение номера страницы, с которого вставлять номера страниц для того,
     * чтобы текущая станица была (почти) всегда посередине блока с номерами страниц
     * index = 5; currentPage = 7 => '< 5 6 7 8 9 >'
     * index находится вычетанием из номера текущей страницы половины количества отображаемых номеров страниц.
     */
    let index = Math.trunc(currentPage - (maxNumberOfPaginationBlocks - 1) / 2);

    /** Если index меньше нуля, значит, номер текущей страницы еще не достиг середины блока с номерами страниц:
     * currentPage = 2, maxNumberOfPaginationBlocks = 5, середина = 3 => < 1 2 3 4 5 >
     */
    if (index <= 0) {
        index = 1;
    }
    /** Если (index + количество отображаемых номеров страниц - 1) больше общего количества страниц, 
     * значит, текущая страница уже слишком сильно приблизилась к последней странице (сдвигать вправо больше некуда).
     * currentPage = 7, numberOfPages = 8, maxNumberOfPaginationBlocks = 5 => < 4 5 6 7 8 >
     */
    else if (index + maxNumberOfPaginationBlocks - 1 > numberOfPages) {
        index = numberOfPages - maxNumberOfPaginationBlocks + 1;
    }

    /** создание элементов с номерами траниц */
    for (let count = 0; count < maxNumberOfPaginationBlocks; count++) {

        const div = document.createElement('div');
        div.classList.add("main__pagination-container__number");
        div.textContent = `${index}`;
        div.dataset.pageNumber = `${index}`;
        div.title = index !== currentPage ? `Перейти на ${index} страницу` : '';

        /* Если пользователь находится на последней странице => выдеение элемента с номеров
         * добавлением класса 'pagination-current'
         */
        if (index === currentPage) {
            div.classList.add('pagination-current');
        }

        paginationContent.append(div);
        ++index;
    }

    /* создание элемента со стрелочкой влево */
    const leftArrow = document.createElement('div');
    leftArrow.classList.add("main__pagination-container__number", "pagination-arrow");
    leftArrow.dataset.pageNumber = `${currentPage-1}`;
    leftArrow.innerHTML = `<svg width="18" height="18"><use xlink:href="#left" /></svg>`;

    /* Если пользователь находится на первой странице => листать влево некуда =>
     * добавление класса 'pagination-disabled'
     */
    if (currentPage === 1) {
        leftArrow.classList.add("pagination-disabled")
    } else {
        leftArrow.title = `Перейти на предыдущую страницу`
    }

    paginationContent.prepend(leftArrow); /* добление в начало контейнера для номеров страниц */

    /* создание элемента со стрелочкой вправо */
    const rigthArrow = document.createElement('div');
    rigthArrow.classList.add("main__pagination-container__number", "pagination-arrow");
    rigthArrow.dataset.pageNumber = `${currentPage+1}`;
    rigthArrow.innerHTML = `<svg width="18" height="18"><use xlink:href="#right" /></svg>`;

    /* Если пользователь находится на последней странице => листать вправо некуда =>
     * добавление класса 'pagination-disabled'
     */
    if (currentPage === numberOfPages) {
        rigthArrow.classList.add("pagination-disabled")
    } else {
        rigthArrow.title = `Перейти на следующую страницу`
    }

    paginationContent.append(rigthArrow);

    return paginationContent;
}


/**
 * Отрисовывает блоки для пагинации и помещает их в контейнер с классом main__pagination-container__number
 * В случае, если невозможно осуществить пагинацию или в этом нет необходимости, скрывает контейнер,
 * добавляя класс hidden
 * @param {Number} length - общее число записей
 * @param {Number} perPage - число записей на страницу
 * @param {Number} currentPage - номер текущей страницы
 */
const showPagination = (length, perPage, currentPage) => {
    const paginationContent = createTablePagination(length, perPage, currentPage); /** создание содержимого контейнера */
    const paginationContainer = document.querySelector('.main__pagination-container'); /**поиск элемента-контейнера */

    /* если пагинацию осуществить невозможно - скрыть контейнер для номеров страниц */
    if (!paginationContent) {
        paginationContainer.classList.add("hidden");
        return;
    }
    /* очистка содержимого контейнера и отрисовка созданных номеров страниц */
    paginationContainer.innerHTML = '';
    paginationContainer.append(paginationContent);
}

/**
 * Отображает индикацию сортировки в заголовке таблицы.
 */
const toggleTableHeaderСlasses = () => {
    /* поворачивает стрелочку */
    const arrow = document.querySelector(`
    .main__table-container__table__header__row__col[data-type="${sort.dataType}"]  
    .sort-arrow
    `);
    arrow.classList.toggle(`sorted-${sort.mode}`);
    /* изменяет свойства текста заголовка столбца таблицы */
    const headingText = document.querySelector(`
    .main__table-container__table__header__row__col[data-type="${sort.dataType}"]  
    .main__table-container__table__header__row__col__text
    `);

    headingText.classList.toggle('table-header-active');
}

/**
 * Скрывает столбец таблицы по его номеру.
 * @param {number} colNumber - номер столбца таблицы для скрытия.
 */
const hideAndShowColumn = colNumber => {
    const columns = document.querySelectorAll(`    
    .main__table-container__table__body__row__col:nth-child(${colNumber}),     
    .main__table-container__table__body__row__col:nth-child(${colNumber}) div, 
    .main__table-container__table__header__row__col:nth-child(${colNumber}) div,
    .main__table-container__table__header__row__col:nth-child(${colNumber}) img
    `);

    columns.forEach(column => void column.classList.toggle('hidden-column'));

    const footerCol = document.querySelector(`.main__table-container__table__footer__row__col:nth-child(${colNumber})`);

    /* смена содержимого кнопки скрытия */
    footerCol.classList.toggle('footer-hidden');

    if (footerCol.classList.contains('footer-hidden')) {
        footerCol.innerHTML = hiddenInnerText;
    } else {
        footerCol.innerHTML = innerText;
    }
}