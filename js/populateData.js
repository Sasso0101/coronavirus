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
            document.getElementById('newTests').innerHTML=formatNumber(dati.today.newTests);

            // Last updated
            document.getElementById('lastUpdated').innerHTML=newLastUpdated;
            
            /* Current restrictions map */
            redDays = ['5/1/2021', '6/1/2021'];
            orangeDays = ['9/1/2021', '10/1/2021'];
            yellowDays = ['7/1/2021', '8/1/2021'];
            today = new Date();
            today = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
            var todayParsed = Date.parse(today);
            if (redDays.includes(today)) document.getElementById('restrinctionsMap').src = 'maps/zonesRedBig.svg';
            else if (yellowDays.includes(today)) document.getElementById('restrinctionsMap').src = 'maps/zonesYellowBig.svg';
            else if (todayParsed > Date.parse('10/1/2021')) {
                document.getElementById('restrictionsSelection').style.display = 'none';
                document.getElementById('restrinctionsMap').src = 'maps/zones10Big.svg';
            }
            else document.getElementById('restrinctionsMap').src = 'maps/zonesOrangeBig.svg';

            /* Restriction calendar */
            populateCalendar();

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
    $.getJSON('https://salvatoreandaloro.altervista.org/coronavirus/5G.php?_=' + new Date().getTime(), function(datiJSON) {
        vaccinated = datiJSON.vaccinated;
        availableVaccines = datiJSON.availableVaccines;
        
        if (vaccinated != null && availableVaccines != null && vaccinated > 100000 && availableVaccines > 100000){
            document.getElementsByClassName('vaccine')[0].style.display = 'block';
            document.getElementById('vaccineLastUpdatedP').style.display = 'block';
            document.getElementById('vaccinated').innerHTML = formatNumber(vaccinated);
            document.getElementById('availableVaccines').innerHTML = formatNumber(availableVaccines);
            document.getElementById('lastUpdatedVaccines').innerHTML=datiJSON.lastUpdated;
        }
    });
}

function populateCalendar() {
    var container = document.getElementById('calendar');
    var zone = document.getElementById('copyZone').cloneNode(true);
    zone.removeAttribute('style');
    for (let i = 7; i <= 10; i++) {
        zone.getElementsByClassName('day')[0].textContent = i + ' gen';
        if ([7,8].includes(i)) {
            zone.getElementsByTagName('img')[0].setAttribute('src', 'maps/zonesYellow.png');
        } else {
            zone.getElementsByTagName('img')[0].setAttribute('src', 'maps/zonesOrange.png');
        }
        container.appendChild(zone.cloneNode(true));
    }
}