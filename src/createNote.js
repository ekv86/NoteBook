import basket from './images/basket.png';
import edit from './images/edit.png';
import archive from './images/archive.png';
import './index.css';

export const createMarkupNote = (arr) => {
    return arr.map(({ id, name, date, category, note, changeDate, icon }) => `<tr id=${id}>
    <td class="icon"><img src=${icon} alt=${category} class="table__img"/></td>
    <td class ="table__name">${name}</td>
    <td>${date}</td>
    <td>${category}</td>
    <td>${note}</td>
    <td>${changeDate}</td>
    <td class="headImg edit-js"><img src=${edit} alt="edit"></td>
    <td class="headImg archive-js"><img src=${archive} alt="archive"></td>
    <td class="headImg basket-js"><img src=${basket} alt="basket"></td>
</tr>`).join('');
}

export const archiveMarkupNote = (arr) => {
    return arr.map(({ id, name, date, category, note, icon }) => `<tr id=${id}>
    <td class="icon"><img src=${icon} alt=${category} class="table__img"/></td>
    <td class ="table__name">${name}</td>
    <td>${date}</td>
    <td>${category}</td>
    <td>${note}</td>
    <td class="headImg back-to-active-js"><img src=${archive} alt="archive"></td>
</tr>`).join('');
}

export function statisticsMarkupActiveNote(arr) {
    return arr.map(({category, icon}) => `<tr class="statistic-field">
    <td class="icon"><img src=${icon} alt=${category} class="table__img"/></td>
<td class="key-field table__name">${category}</td><td class="active-field"></td>
<td class="archive-field"></td></tr>`).join('');
}





