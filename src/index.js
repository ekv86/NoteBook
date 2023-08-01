import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { nanoid } from 'nanoid'
import './index.css';
import notes from './notes';
import iconsArr from './icons'
import { createMarkupNote } from "./createNote";
import { archiveMarkupNote } from "./createNote";
import { statisticsMarkupActiveNote } from "./createNote";
import { getStatistic } from "./statisticsFilter";



const createBtnEl = document.querySelector('.create__btn');
const closeBtnEl = document.querySelector('.close__btn-js')
const backdropEl = document.querySelector('.backdrop');
const formEl = document.querySelector('.form-js');
const tableEl = document.querySelector('.table');
const tableBodyEl = document.querySelector('.table__body-js');
const archiveBodyEl = document.querySelector('.archive__body-js');
const archiveTableEl = document.querySelector('.archive__table');
const statisticBodyEl = document.querySelector('.statistics__body-js');


createBtnEl.addEventListener('click', onBtnClick);
closeBtnEl.addEventListener('click', onCloseBtnClick);
formEl.addEventListener('input', onInputClick)
formEl.addEventListener('submit', onSubmit);
tableBodyEl.addEventListener('click', onTableBtnClick);
tableEl.addEventListener('click', onTableClick);
archiveBodyEl.addEventListener('click', onArchiveBtnClick);
archiveTableEl.addEventListener('click', onArchiveTableClick);


let formData = {};
let formArr = [
    ...notes
];
let archiveArr = [];
let statisticsActiveObj = getStatistic(formArr);
let statisticsArchiveObj = getStatistic(archiveArr);

flatpickr("#datetime-picker");
tableBodyEl.innerHTML = createMarkupNote(formArr);
statisticBodyEl.innerHTML = statisticsMarkupActiveNote(totalCategories());
updateStatistic();

function totalCategories() {
    let totalArr = Object.keys(getStatistic(formArr.concat(archiveArr)));
    let uniqArr = []
    for (let i = 0; i < totalArr.length; i += 1) {
        let icon = iconsArr.find(el => el.category === totalArr[i]);
        let uniqObj = {};
        uniqObj.category = totalArr[i];
        uniqObj.icon = icon.img;
        uniqArr.push(uniqObj);
    }
    return uniqArr;
}

function onBtnClick() {
    backdropEl.classList.remove('visually-hidden')
}

function onCloseBtnClick() {
    backdropEl.classList.add('visually-hidden');
}

function onInputClick() {
    const formElements = formEl.elements;
    const name = formElements.name.value;
    const date = formElements.date.value;
    const category = formElements.category.value;
    const note = formElements.note.value;

    if (!formData.id) {
        formData.id = nanoid();
    }

    if (formData.date && formData.date !== date) {
        formData.changeDate = `${formData.date} / ${date}`;
    }

    if (!formData.date || formData.date === date) {
        formData.changeDate = '';
    }

    formData.name = name;
    formData.category = category;
    formData.note = note;
    formData.date = date;

    let icon = iconsArr.find(el => el.category === category);
    formData.icon = icon.img;
}

function onSubmit(e) {
    e.preventDefault();
    backdropEl.classList.add('visually-hidden');
    let changeEl = formArr.find(el => el.id === formData.id);
    let idx = formArr.indexOf(changeEl);
    if (changeEl) {
        formArr.splice(idx, 1, formData);
    }
    else { formArr.push(formData); }

    tableBodyEl.innerHTML = createMarkupNote(formArr);
    statisticBodyEl.classList.remove('visually-hidden')
    statisticBodyEl.innerHTML = statisticsMarkupActiveNote(totalCategories());
    formEl.reset();
    formData = {};
    updateStatistic();
}

function onTableBtnClick(e) {
    const activeEl = e.target.parentElement.parentElement;
    let elForAction = formArr.find(el => el.id === activeEl.id);
    let elIdx = formArr.indexOf(elForAction);

    if (e.target.closest('.edit-js')) {
        const formElements = formEl.elements;
        backdropEl.classList.remove('visually-hidden');

        formData.name = elForAction.name;
        formData.date = elForAction.date;
        formData.category = elForAction.category;
        formData.note = elForAction.note;
        formData.id = elForAction.id;

        formElements.name.value = formData.name;
        formElements.date.value = formData.date;
        formElements.category.value = formData.category;
        formElements.note.value = formData.note;
    }

    if (e.target.closest('.basket-js')) {
        formArr.splice(elIdx, 1);
        tableBodyEl.innerHTML = createMarkupNote(formArr);
        statisticBodyEl.innerHTML = statisticsMarkupActiveNote(totalCategories());
        totalCategories();
        updateStatistic();
    }

    if (e.target.closest('.archive-js')) {
        archiveArr.push(formArr[elIdx])
        formArr.splice(elIdx, 1);
        tableBodyEl.innerHTML = createMarkupNote(formArr);
        archiveTableEl.classList.remove('visually-hidden');
        archiveBodyEl.innerHTML = archiveMarkupNote(archiveArr);
        totalCategories();
        updateStatistic();
    }
}

function updateStatistic() {
    statisticsActiveObj = getStatistic(formArr);
    statisticsArchiveObj = getStatistic(archiveArr);
    let category = totalCategories().map(el => el.category);
    let items = [...statisticBodyEl.children];
    let allTd = []
    for (const item of items) {
        let td = [...item.children];
        allTd.push(...td)
    }
    for (const el of category) {
        for (const td of allTd) {
            if (td.textContent === el) {
                td.parentElement.querySelector('.active-field').textContent = statisticsActiveObj[el];
                td.parentElement.querySelector('.archive-field').textContent = statisticsArchiveObj[el];
            }
        }
    }
    if (formArr.length === 0 && archiveArr.length === 0) {
        statisticBodyEl.classList.add('visually-hidden')
    }
}

function onTableClick(e) {
    if (e.target.closest('.archive-all-js')) {
        archiveArr = archiveArr.concat(formArr);
        formArr.length = 0;
        archiveTableEl.classList.remove('visually-hidden');
        archiveBodyEl.innerHTML = archiveMarkupNote(archiveArr);
        tableBodyEl.innerHTML = createMarkupNote(formArr);
        updateStatistic();
    }

    if (e.target.closest('.delete-all-js')) {
        formArr.length = 0;
        tableBodyEl.innerHTML = createMarkupNote(formArr);
        statisticBodyEl.innerHTML = statisticsMarkupActiveNote(totalCategories());
        updateStatistic();
    }
}

function onArchiveBtnClick(e) {
    const activeEl = e.target.parentElement.parentElement;
    let elForAction = archiveArr.find(el => el.id === activeEl.id);
    let elIdx = archiveArr.indexOf(elForAction);

    if (e.target.closest('.back-to-active-js')) {
        formArr.push(archiveArr[elIdx])
        archiveArr.splice(elIdx, 1);
        tableBodyEl.innerHTML = createMarkupNote(formArr);
        archiveBodyEl.innerHTML = archiveMarkupNote(archiveArr);
        totalCategories();
        updateStatistic();
        if (archiveArr.length === 0) {
            archiveTableEl.classList.add('visually-hidden');
        }
    }
}

function onArchiveTableClick(e) {
    if (e.target.closest('.back-all-to-active-js')) {
        formArr = formArr.concat(archiveArr);
        archiveArr.length = 0;
        archiveTableEl.classList.add('visually-hidden');
        archiveBodyEl.innerHTML = archiveMarkupNote(archiveArr);
        tableBodyEl.innerHTML = createMarkupNote(formArr);
        updateStatistic();
    }
}