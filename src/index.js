import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';

const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

inputRef.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
    const inputValue = event.target.value.trim().toLowerCase();

    if (inputValue === '') {
        countryListRef.innerHTML = '';
        countryInfoRef.innerHTML = '';
        return;
    }

    fetchCountries(`${inputValue}?fields=name,capital,population,flags,languages`)
        .then(renderMarkup)
        .catch(() => {
            countryListRef.innerHTML = '';
            countryInfoRef.innerHTML = '';
            Notify.failure('Oops, there is no country with that name.');
        });
}

function renderMarkup(serverDataList) {
    if (serverDataList.length > 10) {
        countryListRef.innerHTML = '';
        countryInfoRef.innerHTML = '';
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
    }

    if (serverDataList.length === 1) {
        countryInfoRef.innerHTML = countryInfoMarkup(serverDataList[0]);
        countryListRef.innerHTML = '';
        return;
    }

    countryInfoRef.innerHTML = '';
    countryListRef.innerHTML = countryListMarkup(serverDataList);
}

function countryInfoMarkup({ name, flags, capital, population, languages }) {
    const countryLanguages = Object.values(languages).join(', ');

    return `<div>
    <img src="${flags.svg}" alt="Flag of ${name.official}.">
    <h1>${name.official}</h1>
    </div>
    <p><b>Capital:</b> ${capital}</p>
    <p><b>Population:</b> ${population}</p>
    <p><b>Languages:</b> ${countryLanguages}</p>`;
};

function countryListMarkup(serverDataList) {
    return serverDataList
        .map(({ flags, name }) => {
            return `<li>
            <img src="${flags.svg}" alt="Flag of ${name.official}">
            <p><b>${name.official}</b></p>
            </li>`;
        })
        .join('');
};