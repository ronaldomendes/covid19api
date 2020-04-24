const url = 'https://api.covid19api.com/summary'
const tBody = document.querySelector('tbody')
let globalStats = document.getElementById('globalStats')
let statsByCountry = document.getElementById('statsByCountry')
const noCases = document.getElementById('noCases')
const withCases = document.getElementById('selectCountry')
let allCountries = []

const buildChart = (lines) => {
    let chart = new Chart(globalStats, {
        type: 'horizontalBar',
        data: {
            labels: ['New Confirmed', 'Total Confirmed', 'New Deaths', 'Total Deaths',
                'New Recovered', 'Total Recovered'],
            datasets: [{
                label: 'COVID-19 Global Stats',
                backgroundColor: 'red',
                borderColor: 'white',
                data: [lines.NewConfirmed, lines.TotalConfirmed, lines.NewDeaths, lines.TotalDeaths,
                lines.NewRecovered, lines.TotalRecovered]
            }]
        },
        options: {}
    })
    globalStats.insertAdjacentHTML('beforeend', chart)
}

const buildLineTable = (lines) => {
    let result = lines.filter((data) => data.TotalConfirmed !== 0)
    result.forEach((line, index) => {
        const lineTable =
            `<tr>
                <td>${line.Country}</td>
                <td>${line.NewConfirmed}</td>
                <td>${line.TotalConfirmed}</td>
                <td>${line.NewDeaths}</td>
                <td>${line.TotalDeaths}</td>
                <td>${line.NewRecovered}</td>
                <td>${line.TotalRecovered}</td>        
            </tr>`
        tBody.insertAdjacentHTML('beforeend', lineTable)
    })
}

const noCovidCases = (lines) => {
    let result = lines.filter(data => data.TotalConfirmed === 0)
    return result.forEach(data => {
        const lineSelect = `<option value="${data.Country}">${data.Country}</option>`
        noCases.insertAdjacentHTML('beforeend', lineSelect)
    })
}

const withCovidCases = (lines) => {
    let result = ''
    result = lines.filter(data => data.TotalConfirmed !== 0)
    return result.forEach(data => {
        const lineSelect = `<option value="${data.Country}">${data.Country}</option>`
        withCases.insertAdjacentHTML('beforeend', lineSelect)
    })
}

const covidStatsByCountry = (lines, selectedCountry) => {
    let res = lines.filter(data => data.Country === selectedCountry)

    let chart = new Chart(statsByCountry, {
        type: 'horizontalBar',
        data: {
            labels: ['New Confirmed', 'Total Confirmed', 'New Deaths', 'Total Deaths',
                'New Recovered', 'Total Recovered'],
            datasets: [{
                label: `COVID-19 Stats (${res[0].Country})`,
                backgroundColor: 'red',
                borderColor: 'white',
                data: [res[0].NewConfirmed, res[0].TotalConfirmed, res[0].NewDeaths, res[0].TotalDeaths,
                res[0].NewRecovered, res[0].TotalRecovered]
            }]
        },
        options: {}
    })
    statsByCountry.insertAdjacentHTML('beforeend', chart)
}

window.onload = () => {
    fetch(url)
        .then(resp => resp.json())
        .then(resp => {
            buildLineTable(resp.Countries)
            buildChart(resp.Global)
            noCovidCases(resp.Countries)
            withCovidCases(resp.Countries)
            allCountries = resp.Countries
        })
}

withCases.addEventListener('change', function () {
    let option = this.selectedOptions[0]
    let selectedCountry = option.textContent
    statsByCountry.innerHTML = null
    covidStatsByCountry(allCountries, selectedCountry)
})