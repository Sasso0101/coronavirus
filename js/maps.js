async function fetchMap(chartData, type, value = 'activeCases', period = 'today') {
    var url, codeFieldName;
    if (type == 'region') {
        url = 'maps/regions.json';
        objectName = 'regions';
        codeFieldName = 'reg_istat_code_num';
    } else {
        url = 'maps/provinces.json';
        objectName = 'provinces';
        codeFieldName = 'prov_istat_code_num';
        switch (period) {
            case '30days':
                value = 'totalCasesLast30Days';
                break;
            case 'today':
                value = 'totalCasesToday';
                break;
            case 'all':
                value = 'totalCases';
                break;
        }
    }
    let response = await fetch(url);
    let mapData = await response.json();

    mapFeatures = ChartGeo.topojson.feature(mapData, mapData.objects[objectName]).features;
    labels = [];
    mapChartData =  []
    for (var i = 0; i < chartData.length; i++) {
        mapChartData.push({
            feature: mapFeatures.find((d) => d.properties[codeFieldName] == chartData[i].code),
            value: chartData[i][value]
        });
        labels.push(chartData[i].name);
    }
    return [labels, mapFeatures, mapChartData];
}
Chart.defaults.choropleth.defaultColor = '#ffffff';
Chart.defaults.choropleth.defaultFontColor = '#ffffff';
Chart.defaults.choropleth.defaultFontSize = 20;
function initMap() {
    fetchMap(regionsData, 'region').then(chartData => {
        map = new Chart(document.getElementById("map").getContext("2d"), {
            type: 'choropleth',
            data: {
                labels: chartData[0],
                datasets: [{
                    label: 'Regioni',
                    outline: chartData[1],
                    data: chartData[2],
                }]
            },
            options: {
                aspectRatio: 0.75,
                showGraticule: true,
                showOutline: true,
                legend: {
                    display: false
                },
                scale: {
                    projection: "mercator"
                },
                geo: {
                    colorScale: {
                        display: true,
                        interpolate: "reds",
                    }
                },
                elements: {
                    geoFeature: {
                        borderWidth: 1,
                        borderColor: '#000'
                    }
                }
            }
        });
    });
}

function updateMap(type, value = 'activeCases', period = 'today') {
    if (type == 'region') {
        label = 'Regioni';
        chartData = regionsData;
    } else {
        label = 'Province';
        chartData = provincesData;
    }
    fetchMap(chartData, type, value, period).then(chartData => {
        map.data = {
            labels: chartData[0],
            datasets: [{
                label: label,
                outline: chartData[1],
                data: chartData[2],
            }]
        }
        map.update();
    });
}

function showTerritory(el, territory, value = 'activeCases', period = 'today') {
    updateMap(territory, value, period);
    var hide;
    $('#valueSelection .choice').css('background-color', '#fff');
    if (territory == 'region') {
        show = 'regionSelection';
        hide = 'provinceSelection';
        resetBackground = 'byProvince';
        if (value == 'activeCases') $('#RegionActiveCases').css('background-color', '#a0a0a0'); // Default
    }
    else {
        show = 'provinceSelection';
        hide = 'regionSelection';
        resetBackground = 'byRegion';
        if (period == 'today') $('#ProvinceToday').css('background-color', '#a0a0a0'); // Default
    }

    $('#'+resetBackground).css('background-color', '#fff');
    el.style.backgroundColor = "#a0a0a0";
    document.getElementById(show).style.display = "flex";
    document.getElementById(hide).style.display = "none";
}