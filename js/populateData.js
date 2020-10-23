function formatNumber(num, addPlus = false) {
    var newNum = num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    if (addPlus && num > 0) {
        newNum = '+' + newNum;
    }
    return newNum;
}
function calculatePercentage(oldValue, newValue) {
    var diff = newValue - oldValue;
    var perc = Math.round((diff/Math.abs(oldValue))*1000)/10;
    return formatNumber(perc, true) + '%';
}

function updateData() {
    $.getJSON('https://salvatoreandaloro.altervista.org/coronavirus/datiV6.php?_=' + new Date().getTime(), function(datiJSON) {
        dati = datiJSON;
        var versionID = parseInt(document.getElementById('idVersione').innerHTML);
        var newVersionID = parseInt(dati.id);
        if (versionID != newVersionID) {
            var newLastUpdated = dati.lastUpdated.time+' '+dati.lastUpdated.day;

            /* Counters */
            // Total cases
            document.getElementById('activeCases').innerHTML=formatNumber(dati.today.activeCases);
            document.getElementById('deaths').innerHTML=formatNumber(dati.today.deaths);
            document.getElementById('recovered').innerHTML=formatNumber(dati.today.recovered);
            document.getElementById('hospitalized').innerHTML=formatNumber(dati.today.hospitalized);
            document.getElementById('intensiveCare').innerHTML=formatNumber(dati.today.intensiveCare);
            document.getElementById('peopleTested').innerHTML=formatNumber(dati.today.peopleTested);

            // Percentages
            document.getElementById('newActiveCasesPercentage').innerHTML=calculatePercentage(dati.yesterday.newActiveCases, dati.today.newActiveCases);
            document.getElementById('newDeathsPercentage').innerHTML=calculatePercentage(dati.yesterday.newDeaths, dati.today.newDeaths);
            document.getElementById('newRecoveredPercentage').innerHTML=calculatePercentage(dati.yesterday.newRecovered, dati.today.newRecovered);
            document.getElementById('diffHospitalizedPercentage').innerHTML=calculatePercentage(dati.yesterday.diffHospitalized, dati.today.diffHospitalized);
            document.getElementById('diffIntensiveCarePercentage').innerHTML=calculatePercentage(dati.yesterday.diffIntensiveCare, dati.today.diffIntensiveCare);
            document.getElementById('newTestsPercentage').innerHTML=calculatePercentage(dati.yesterday.newTests, dati.today.newTests);
            
            // New cases
            document.getElementById('newActiveCases').innerHTML=formatNumber(dati.today.newActiveCases, true);
            document.getElementById('newDeaths').innerHTML=formatNumber(dati.today.newDeaths, true);
            document.getElementById('newRecovered').innerHTML=formatNumber(dati.today.newRecovered, true);
            document.getElementById('diffHospitalized').innerHTML=formatNumber(dati.today.diffHospitalized, true);
            document.getElementById('diffIntensiveCare').innerHTML=formatNumber(dati.today.diffIntensiveCare, true);
            document.getElementById('newTests').innerHTML=formatNumber(dati.today.newTests, true);

            // Last updated
            document.getElementById('lastUpdated').innerHTML=newLastUpdated;
            
            /* Cases map */
            initMap();

            /* Charts */
            //Vertical chart (new cases)
            chartNewCases(dati.chartNewCases);
            //Line chart
            initCasesChart();
            //Fill line chart with data (cumulative cases)
            chartCumulativeCases();
        };
    });
}