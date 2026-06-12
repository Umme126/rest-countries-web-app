let countriesData = [];
const apiEndpoint = 'https://restcountries.com/v3.1/all?fields=name,flags,population';

const gridEl = document.getElementById('countries-grid');
const loaderEl = document.getElementById('loader');
const errorEl = document.getElementById('error-message');
const searchInput = document.getElementById('search-input');

async function fetchCountries() {
    loaderEl.classList.remove('hidden');
    errorEl.classList.add('hidden');
    gridEl.innerHTML = '';
    searchInput.disabled = true;
    searchInput.value = '';

    try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const rawData = await response.json();

        const targets = ["Pakistan", "India", "United Arab Emirates"];
        let selected = rawData.filter(c => targets.includes(c.name.common));

        const remaining = rawData.filter(c => !targets.includes(c.name.common));
        const shuffledRemaining = remaining.sort(() => 0.5 - Math.random());

        countriesData = [
            ...selected,
            ...shuffledRemaining.slice(0, 10 - selected.length)
        ];

        countriesData.sort((a, b) =>
            a.name.common.localeCompare(b.name.common)
        );

    } catch (error) {
        console.warn(error);

        countriesData = [
            { name: { common: "Pakistan" }, population: 220892331, flags: { svg: "https://flagcdn.com/pk.svg" } },
            { name: { common: "India" }, population: 1380004385, flags: { svg: "https://flagcdn.com/in.svg" } },
            { name: { common: "United Arab Emirates" }, population: 9890400, flags: { svg: "https://flagcdn.com/ae.svg" } },
            { name: { common: "Canada" }, population: 38250000, flags: { svg: "https://flagcdn.com/ca.svg" } },
            { name: { common: "Japan" }, population: 125700000, flags: { svg: "https://flagcdn.com/jp.svg" } },
            { name: { common: "Brazil" }, population: 214300000, flags: { svg: "https://flagcdn.com/br.svg" } },
            { name: { common: "Australia" }, population: 25690000, flags: { svg: "https://flagcdn.com/au.svg" } },
            { name: { common: "Germany" }, population: 83200000, flags: { svg: "https://flagcdn.com/de.svg" } },
            { name: { common: "France" }, population: 67750000, flags: { svg: "https://flagcdn.com/fr.svg" } },
            { name: { common: "United Kingdom" }, population: 67330000, flags: { svg: "https://flagcdn.com/gb.svg" } }
        ];

        countriesData.sort((a, b) =>
            a.name.common.localeCompare(b.name.common)
        );
    } finally {
        loaderEl.classList.add('hidden');
        renderCountries(countriesData);
        searchInput.disabled = false;
    }
}

function renderCountries(list) {
    gridEl.innerHTML = '';

    if (list.length === 0) {
        gridEl.innerHTML =
            '<p style="text-align:center;">No countries found.</p>';
        return;
    }

    list.forEach(country => {
        const cardHtml = `
        <article class="country-card">
            <div class="flag-wrapper">
                <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
            </div>
            <div class="country-info">
                <h3>${country.name.common}</h3>
                <p>Population:
                <strong>${country.population.toLocaleString()}</strong></p>
            </div>
        </article>
        `;
        gridEl.insertAdjacentHTML('beforeend', cardHtml);
    });
}

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    const filtered = countriesData.filter(country =>
        country.name.common.toLowerCase().includes(query)
    );

    renderCountries(filtered);
});

window.addEventListener('DOMContentLoaded', fetchCountries);