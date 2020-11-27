async function fetchMap(chartData, type, value = 'activeCases', period = 'today') {
    var url, codeFieldName;
    if (type == 'region') {
        url = 'maps/regions.json';
        objectName = 'regions';
        codeFieldName = 'reg_istat_code_num';
    } else if (type == 'province') {
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
        if (type == 'region') {
            mapChartData.push({
                feature: mapFeatures.find((d) => d.properties[codeFieldName] == chartData[i].code),
                value: chartData[i][value],
                name: chartData[i]['name'],
                activeCases: chartData[i]['activeCases'],
                newActiveCases: chartData[i]['newActiveCases'],
                recovered: chartData[i]['recovered'],
                newRecovered: chartData[i]['newRecovered'],
                hospitalized: chartData[i]['hospitalized'],
                intensiveCare: chartData[i]['intensiveCare'],
                deaths: chartData[i]['deaths'],
                newDeaths: chartData[i]['newDeaths'],
                peopleTested: chartData[i]['peopleTested']
            });
        } else {
            mapChartData.push({
                feature: mapFeatures.find((d) => d.properties[codeFieldName] == chartData[i].code),
                value: chartData[i][value],
                name: chartData[i]['name'],
                totalCases: chartData[i]['totalCases'],
                totalCasesToday: chartData[i]['totalCasesToday'],
            });
        }
        labels.push(chartData[i].name);
    }
    return [labels, mapFeatures, mapChartData];
}

Chart.Tooltip.positioners.cursor = function(chartElements, coordinates) {
    return coordinates;
};

function initMap() {
    fetchMap(dati.regions, 'region').then(chartData => {
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
                showGraticule: false,
                showOutline: false,
                legend: {
                    display: false
                },
                scale: {
                    projection: "mercator"
                },
                geo: {
                    colorScale: {
                        display: true,
                        interpolate: 'reds',
                        legend: {
                            position: 'top-right',
                            margin: 50
                        },
                    },
                },
                elements: {
                    geoFeature: {
                        borderWidth: 1,
                        borderColor: '#000'
                    }
                },
                tooltips: {
                    titleFontSize: 14,
                    bodyFontSize: 14,
                    enabled: false,
                    custom: function(tooltip) {
                        var tooltipEl = document.getElementById('chartjs-tooltip');

                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
                            tooltipEl.innerHTML = '<table></table>';
                            this._chart.canvas.parentNode.appendChild(tooltipEl);
                        }

                        // Hide if no tooltip
			            if (tooltip.opacity === 0) {
			            	tooltipEl.style.opacity = 0;
			            	return;
                        }
                        
                        // Set caret Position
			            tooltipEl.classList.remove('above', 'below', 'no-transform');
			            if (tooltip.yAlign) {
			            	tooltipEl.classList.add(tooltip.yAlign);
			            } else {
			            	tooltipEl.classList.add('no-transform');
                        }
                        
                        function getBody(bodyItem) {
                            return bodyItem.lines;
                        }

                        // Set Text
			            if (tooltip.body) {
			            	var titleLines = tooltip.title || [];
			            	var bodyLines = tooltip.body.map(getBody);
			            	var innerHtml = '<thead>';
			            	titleLines.forEach(function(title) {
			            		innerHtml += '<tr><th>' + title + '</th></tr>';
			            	});
			            	innerHtml += '</thead><tbody>';
			            	bodyLines.forEach(function(body, i) {
			            		var colors = tooltip.labelColors[i];
			            		var style = 'background:' + colors.backgroundColor;
			            		style += '; border-color:' + colors.borderColor;
			            		style += '; border-width: 2px';
			            		var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
			            		innerHtml += '<tr><td>' + span + body + '</td></tr>';
			            	});
			            	innerHtml += '</tbody>';
			            	var tableRoot = tooltipEl.querySelector('table');
                            tableRoot.innerHTML = innerHtml;
                            var positionY = this._chart.canvas.offsetTop + 10;
                            var positionX = this._chart.canvas.offsetLeft;
                            if (positionX + tooltip.caretX < 140) {
                                positionX = 140 - tooltip.caretX;
                            }
                            if (positionX + tooltip.caretX > $( window ).width() - 150) {
                                positionX = $( window ).width() - 120 - tooltip.caretX;
                            }
                            if (tooltipEl.offsetHeight + positionY + tooltip.caretY + 10 > this._chart.canvas.clientHeight) {
                                positionY = -tooltipEl.offsetHeight - 10;
                            }
			                // Display, position, and set styles for font
			                tooltipEl.style.opacity = 1;
			                tooltipEl.style.left = positionX + tooltip.caretX + 'px';
			                tooltipEl.style.top = positionY + tooltip.caretY + 'px';
			                tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
			                tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
			                tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
			                tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
			            }
                    },
                    callbacks: {
                        title: function(tooltipItem, data) {
                            return data.datasets[tooltipItem[0].datasetIndex]['data'][tooltipItem[0].index]['name'];

                        },
                        label: function(tooltipItem, data) {
                            var value = data.datasets[tooltipItem.datasetIndex]['data'][tooltipItem.index];
                            if (data.datasets[tooltipItem.datasetIndex].label == 'Regioni') {
                                var label = "Attualmente positivi: "+value['activeCases']+' (+'+value['newActiveCases']+')<br>In ospedale: '+value['hospitalized']+'<br>In terapia intensiva: '+value['intensiveCare']+'<br>Guariti: '+value['recovered']+'<br>Decessi: '+value['deaths']+' (+'+value['newDeaths']+')<br>Persone testate: '+value['peopleTested']
                            } else {
                                var label = "Casi totali: "+value['totalCases']+' (+'+value['totalCasesToday']+')'
                            }
                            return label;
                        }
                    }
                }
            }
        });
    });
}

function updateMap(type, value = 'activeCases', period = 'today') {
    if (type == 'region') {
        label = 'Regioni';
        chartData = dati.regions;
    } else if (type == 'province') {
        label = 'Province';
        chartData = dati.provinces;
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
        resetBackground1 = 'byZone';
        if (value == 'activeCases') $('#RegionActiveCases').css('background-color', '#a0a0a0'); // Default
    }
    else if (territory == 'province') {
        show = 'provinceSelection';
        hide = 'regionSelection';
        resetBackground = 'byRegion';
        resetBackground1 = 'byZone';
        if (period == 'today') $('#ProvinceToday').css('background-color', '#a0a0a0'); // Default
    }

    $('#'+resetBackground).css('background-color', '#fff');
    $('#'+resetBackground1).css('background-color', '#fff');
    el.style.backgroundColor = "#a0a0a0";
    document.getElementById('zones').style.display = "none";
    document.getElementById('map').style.display = "block";
    document.getElementById(show).style.display = "flex";
    document.getElementById(hide).style.display = "none";
    document.getElementById('zonesInfo').style.display = "none";
}

function showZones() {
    document.getElementById('zones').style.display = "block";
    document.getElementById('zonesInfo').style.display = "block";
    document.getElementById('map').style.display = "none";
    document.getElementById('regionSelection').style.display = "none";
    document.getElementById('provinceSelection').style.display = "none";
    $('#byRegion').css('background-color', '#fff');
    $('#byProvince').css('background-color', '#fff');
    $('#byZone').css('background-color', '#a0a0a0');
}