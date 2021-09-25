'use strict'

/** номер текущей страницы  */
let currentPage = 1;
/**  количество записей таблицы, отображаемых на одной странице. */
const perPage = 10;

/** Типы полей таблицы */
const dataTypes = ['firstName', 'lastName', 'about', 'eyeColor'];
/** клиентское именование полей. */
const ruDataTypes = ['Имя', 'Фамилия', 'Описание', 'Цвет глаз'];
/** состояние колонок таблицы: faslse - скрыта, true - отражена. */
const hiddenColumns = [false, false, false, false];
/** допустимые значения цвета глаз (для небольшой валидации формы). */
const eyeColors = ['blue', 'red', 'brown', 'green'];

/**
 * Хранит состояние сортировки таблцицы.
 */
const sort = {
    /** отсортированность таблицы. */
    sorted: false,
    /** поле сортировки. */
    dataType: null,
    /** вариант сортировки: по возрастанию - asc, по убыванию - desc.  */
    mode: null,
    /**
     * Меняет состояние типа сортировки:
     *  asc/null -> desc;
     * desc -> asc.
     * @returns {void}
     */
    changeMode() {
        if (this.mode === "desc" || !this.mode) {
            this.mode = "asc";
            return;
        }

        this.mode = "desc";
    },
};

/** массив данных для отображения в таблице на текущей странице. */
let dataForCurrentPage;

/**
 * Обновляет контент страницы: вычисляет массив данных для отображения в таблице,
 * заполняет таблицу этими данными,
 * заполняет контейнер с номерами страниц для пагинации.
 * @returns {void}
 */
const updateContent = () => {
    dataForCurrentPage = jsonData.slice((currentPage - 1) * perPage, (currentPage - 1) * perPage + perPage);
    fillTableBody(dataForCurrentPage);
    showPagination(jsonData.length, perPage, currentPage);
}

/**
 * Осуществляет переход на новую страницу,
 * обновляет контент страницы: вычисляет массив данных для отображения в таблице,
 * заполняет таблицу этими данными,
 * заполняет контейнер с номерами страниц для пагинации.
 * @param {number} newPageNumber - номер новой страницы.
 */
const changePage = newPageNumber => {
    currentPage = newPageNumber;
    hideEditForm();
    updateContent();
}

/**
 * Обновляет только содержимое таблицы данными.
 * @returns {void}
 */
const updateTable = () => void fillTableBody(dataForCurrentPage);



/**
 * Инициализация страницы при первом запуске или перезагрузке.
 */
fillTableHeader(); /* Отрисовка заголовка таблицы */
fillTableFooter(); /* Отрисовка футера таблицы */
updateContent(); /* отрисовка */



/**
 *  обработчики событий и вспомогательные функции. 
 */

/**
 * Обрабатывает переход страницы.
 * @param {Event} event 
 * @returns void
 */
const handlePagination = event => {
    /* используется делегирование событий */
    const pageNumber = event.target.closest(".main__pagination-container__number");
    /* если объект, на котором сгенерировано событие не блок с номером страниицы,
     *  или если кнопка перехода страницы не активна -> выход из функии
     */
    if (!pageNumber || pageNumber.classList.contains("pagination-disabled")) {
        return;
    }

    /* Осуществление перехода на страницу */
    changePage(+pageNumber.dataset.pageNumber);
}

/**
 * Осущестляет сортировку глобального массива с данными в соответствии с объектом, хранящим состояние сортировки.
 * @returns void
 */
const sortJsonData = () => {

    if (!sort.mode) {
        return;
    }

    /* установка режима сортировки: по взрастанию / по убыванию */
    const sortMode = sort.mode === 'asc' ? 1 : -1;

    /* сортировка  */
    if (sort.dataType === 'firstName') {
        jsonData = jsonData.sort((p1, p2) => {
            if (p1.name.firstName > p2.name.firstName) {
                return sortMode;
            }

            if (p1.name.firstName < p2.name.firstName) {
                return -sortMode;
            }

            return 0;
        });
        return;
    }

    if (sort.dataType === 'lastName') {
        jsonData = jsonData.sort((p1, p2) => {
            if (p1.name.lastName > p2.name.lastName) {
                return sortMode;
            }

            if (p1.name.lastName < p2.name.lastName) {
                return -sortMode;
            }

            return 0;
        });
        return;
    }

    if (sort.dataType === 'about') {
        jsonData = jsonData.sort((p1, p2) => {
            if (p1.about > p2.about) {
                return sortMode;
            }

            if (p1.about < p2.about) {
                return -sortMode;
            }

            return 0;
        });

        return;
    }

    if (sort.dataType === 'eyeColor') {
        jsonData = jsonData.sort((p1, p2) => {
            if (p1.eyeColor > p2.eyeColor) {
                return sortMode;
            }

            if (p1.eyeColor < p2.eyeColor) {
                return -sortMode;
            }

            return 0;
        });

        return;
    }

}

/**
 * Обрабатывает сортировку.
 * @param {Event} event 
 * @returns void
 */
const handleSorting = event => {
    const th = event.target.closest('.main__table-container__table__header__row__col');

    if (!th) {
        return;
    }

    /* если атрибут, по которому осуществляется сортировка, скрыт на странице - выход из функции */
    if (hiddenColumns[dataTypes.indexOf(th.dataset.type)]) {
        return;
    }

    /* если сортировка уже осуществлена - убрать индикацию в заголовке таблицы */
    if (sort.sorted) {
        toggleTableHeaderСlasses();
        /* если сортировка осуществлена по другому стобцу - изменить тип сортировки на null */
        if (th.dataset.type !== sort.dataType) {
            sort.mode = null;
        }
    }

    /* изменение состояния объекта сортировки */
    sort.sorted = true;
    sort.dataType = th.dataset.type;
    sort.changeMode();

    /* изменения страницы */
    toggleTableHeaderСlasses(); /* отрисовать индикацию сортировки */
    sortJsonData(); /* Сортировка данных */
    changePage(1); /* Переход на первую страницу */
}

/**
 * Обрабатывает скрытие стоблцов таблицы.
 * @param {Event} event 
 * @returns void
 */
const handleColumnView = event => {
    /* используется делегирование событий */
    /* Выбор из атрибута элемента номера столбца, который нужно скрыть */
    const colNumber = event.target.closest('.main__table-container__table__footer__row__col').dataset.col;

    hiddenColumns[colNumber - 1] = !hiddenColumns[colNumber - 1]; /* изменение состояния столбца в глобальном массиве */
    hideAndShowColumn(colNumber); /* отрисовка изменений на странице */
}

/**
 * Обрабатывает скрытие формы редактирования.
 * @returns void
 */
const handleEditFormHiding = () => void hideEditForm();

/**
 * Находит запись (кортеж) по id в данных только на текущей странице.
 * @param {string} id - id записи (кортежа).
 * @returns {Array} - массив массивов: [[key1, value1]].
 */
const findPerson = id => {
    for (let person of dataForCurrentPage) {

        if (person.id === id) {
            return [
                ['firstname', person.name.firstName],
                ['lastname', person.name.lastName],
                ['about', person.about],
                ['eyecolor', person.eyeColor],
            ];
        }
    }

    return null;
}

/**
 * Обрабатывает показ формы редактирования.
 * Отображает форму редактирования, заполняет поля, 
 * устанавливает фокус в поле редактирования того атрибута,
 * на котором было совершено событие.
 * @param {Event} event 
 * @returns void
 */
const handleEditFormShowing = event => {
    const personId = event.target.closest('.main__table-container__table__body__row').dataset.id;
    let targetDataType = "firstname";
    if (event.target.closest('.main__table-container__table__body__row__col')) {
        targetDataType = event.target.closest('.main__table-container__table__body__row__col').dataset.type.toLowerCase();
    }

    const values = findPerson(personId); /* поиск данных для вставки в поля формы */
    showEditForm(personId, targetDataType, values); /* отображение формы */
}

/**
 * Изменяет в глобальном массиве данных информацию о пользователе
 *  по его id
 * @param {number} id - id пользователя.
 * @param {Object} newValues - объект с новыми данными пользователя.
 * @returns void
 */
const setValues = (id, newValues) => {

    let person = findById(id);

    person.name.firstName = newValues.firstName;
    person.name.lastName = newValues.lastName;
    person.about = newValues.about;
    person.eyeColor = newValues.eyeColor;

    /**
     * Находит запись о пользователе по его идентификатору.
     * @param {number} id - идентификатор пользователя.
     * @returns {Object} объект пользвателя (ссылка на объект - элемент глобального массива данных)
     */
    function findById(id) {
        for (let person of jsonData) {
            if (person.id === id) {
                return person;
            }
        }
        return null;
    }
}

/**
 * Производит валидацию данных.
 * @param {Object} data - объект с данными.
 * @param {Function} validationFunction - колбэк-функция валидации.
 * @returns {string} - ключ, который не прошел валидацию или null в случае успешной валидации.
 */
const validateUpdatedData = (data, validationFunction) => {

    for (let [key, value] of Object.entries(data)) {
        if (!validationFunction(value)) {
            return key;
        }
    }

    return null;
}

/**
 * Осуществляет обработку и сохранение изменений данных из полей формы редатирования. 
 * @returns {{incorrectField: string, message: string}} результат обрботки.
 */
const saveChanges = () => {

    let changedPersonInfo = {
        firstName: document.querySelector('#form-firstname').value,
        lastName: document.querySelector('#form-lastname').value,
        eyeColor: document.querySelector('#form-eyecolor').value,
        about: document.querySelector('#form-about').value,
    };

    /* валидация данных и отправка изменений на сервер [данный функционал не конкретизируется Т.З.] */

    /* функции валидации */
    const validateString = str => str.length > 0;
    const validateColor = color => eyeColors.indexOf(color) >= 0;

    let incorrectField;

    incorrectField = validateUpdatedData(changedPersonInfo, validateString);
    if (incorrectField) {
        return {
            incorrectField,
            message: "Поля не должны быть пустыми.",
        }
    }

    incorrectField = validateUpdatedData({
        eyeColor: changedPersonInfo.eyeColor
    }, validateColor);
    if (incorrectField) {
        return {
            incorrectField,
            message: "Невозможно добавить этот цвета глаз.",
        }
    }

    const personId = document.querySelector('#edit-form').dataset.id;
    setValues(personId, changedPersonInfo); /* сохранение изменений в глобальном масстве */

    return {
        message: null,
        incorrectField: null
    }
}

/**
 * Обрабатывает сохранение данных формы редактирования. Осуществляет валидацию данных. 
 * В случае успешной обработки - сохраняет изменения, обновляет содержимое страницы.
 * В случае некорретных данных - выводит сообщение.
 * @param {Event} event 
 * @returns void
 */
const handleSaving = event => {
    event.preventDefault(); /* Отмена действия браузера по умолчанию (во избежание перезагрузки страницы)*/
    const {
        message
    } = saveChanges();
    if (message) {
        /* если данные некорректны - вывести алерт */
        alert(message);
        return;
    }

    /* отрисовка изменений */
    updateTable(); /* обновление таблицы */
    hideEditForm(); /* скрытие формы */
}

/* установка обработчиков событий */

document.querySelector('.main__table-container__table__body').addEventListener('click', handleEditFormShowing);
document.querySelector('.main__form-container__form-wrapper__header__btn-close').addEventListener('click', handleEditFormHiding);
document.querySelector('.main__form-container__form-wrapper__form__btn-save').addEventListener('click', handleSaving);
document.querySelector('.main__pagination-container').addEventListener('click', handlePagination);
document.querySelector('.main__table-container__table__header__row').addEventListener('click', handleSorting);
document.querySelector('.main__table-container__table__footer__row').addEventListener('click', handleColumnView);

/*
 * В большинстве случаев применяется делегироавние событий для упрощения процесса инициализации и экономии памяти.
 */