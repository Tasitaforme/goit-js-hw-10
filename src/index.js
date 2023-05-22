import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries.js'

const DEBOUNCE_DELAY = 300;
const inputEl = document.getElementById('search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

countryListEl.style.cssText = `
    list-style: none;
    padding: 0px;
    margin: 0;
    font-weight: bold;
    font-size: 20px;`;

inputEl.addEventListener('input', debounce(onLoad, DEBOUNCE_DELAY));

function onLoad(e) {
    if (e.target.value.trim() == '') {
        return;
    } 
        
    const inputValue = e.target.value.trim().replace(/\s+/g, ' ');
   
    fetchCountries(inputValue)
        .then(data => {
            clearSearchDisplayInfo();
            if (data.length > 10) {
                return Notify.info(
                    'Too many matches found. Please enter a more specific name.',
                    { clickToClose: true }
                );
            } else if (data.length <= 10 && data.length >= 2) {
                return countryListEl.insertAdjacentHTML(
                    'beforeend',
                    createMarkupList(data)
                );
            } else if (data.length === 1) {
                return countryInfoEl.insertAdjacentHTML(
                    'beforeend',
                    createMarkupCountryInfo(data)
                );
            }
        })
        .catch(() => {
            clearSearchDisplayInfo();
            Notify.failure(`Oops, there is no country with that name`, {
                clickToClose: true,
            });}
      );
}
function clearSearchDisplayInfo() {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
}

function createMarkupList(arr) {
  return arr
    .map(
      ({ name: { official: officialName }, flags: { svg: flagImg } }) =>
        `<li class="country-list-item"><img src="${flagImg}" alt="${officialName}" width="50"><p>${officialName}</p></li>`
    )
    .join('');
}

function createMarkupCountryInfo(arr) {
    return arr
      .map(
        ({
          name: { official },
          capital,
          population,
          languages,
          flags: { svg },
        }) =>
          `<div class="country-list-item">
          <img src="${svg}" alt="${official}" width="50">
          <h1 style ="margin: 0">${official}</h1></div>
          <p><b>Capital:</b> ${capital}</з>
          <p><b>Population:</b> ${population}</p>
          <p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>`
      )
      .join('');
}
