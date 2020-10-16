Chart.defaults.global.maintainAspectRatio = false;
Chart.defaults.global.defaultFontFamily =  "'Roboto', 'sans-serif'";
Chart.defaults.global.layout.padding = {left: 0, right: 0, top: 20, bottom: 0}
Chart.defaults.global.elements.line.tension = 0;
// Chart.defaults.global.elements.point.hitRadius = 10;
Chart.defaults.global.legend.labels.fontColor = "#ffffff";
Chart.defaults.global.defaultFontSize = 13;
Chart.defaults.global.legend.labels.usePointStyle = true;
Chart.defaults.global.legend.labels.boxWidth = 20;
Chart.defaults.global.legend.labels.padding = 10;
Chart.defaults.global.legend.position = "bottom";
Chart.defaults.global.tooltips.titleFontSize = 14
Chart.defaults.global.tooltips.bodyFontSize = 14
Chart.defaults.line.scales.xAxes[0].gridLines = {color: "#8a8a8a"};
Chart.defaults.line.scales.xAxes[0].ticks = {fontColor: "#fff"};
Chart.defaults.line.scales.yAxes[0].gridLines = {color: "#8a8a8a"};
Chart.defaults.line.scales.yAxes[0].ticks = {fontColor: "#fff"}
Chart.defaults.bar.scales.xAxes[0].gridLines = {color: "#8a8a8a"};
Chart.defaults.bar.scales.xAxes[0].ticks = {fontColor: "#fff"};
Chart.defaults.bar.scales.yAxes[0].gridLines = {color: "#8a8a8a"};
Chart.defaults.bar.scales.yAxes[0].ticks = {fontColor: "#fff"};
Chart.defaults.doughnut.cutoutPercentage = 70;

// Primo grafico nuvi casi (barre verticali)
function chartNewCases(chartData){
    datasets = [];
    isHidden = false;
    for (var i = 1; i < chartData.length; i++) {
        var label = chartData[i][0];
        var color = chartData[i][1];
        chartData[i].splice(0, 2);
        datasets.push({
            label: label,
            data: chartData[i],
            borderColor: color,
            pointBackgroundColor: color,
            backgroundColor: color,
            fill: false,
            hidden: isHidden
        });
        isHidden = true;
    }
    var ctx = document.getElementById('canvasdatiGrafico1').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData[0],
            datasets: datasets
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'timecenter',
                    time: {
                        unit: 'month',
                        parser: 'DD/MM/YYYY',
                        displayFormats: {
                            month: 'MMM'
                        }
                    },
                    barPercentage: 1.4,
                    categoryPercentage: 1.0,
                    gridLines: {
                        color: "#8A8A8A",
                        offsetGridLines: true
                    },
                    ticks: {
                        maxRotation: 90
                    }
                }]
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            legend: {
                display: true,
                onHover: function (e) {
                  e.target.style.cursor = 'pointer'
                },
                onLeave: function (e) {
                  e.target.style.cursor = 'default'
                }
            }
        }
    });
}

function initCasesChart() {
    var ctx = document.getElementById('casesChart').getContext('2d');
    casesChart = new Chart(ctx, {
        type: 'line',
        options: {
            scales: {
                xAxes: [{
                    type: 'timecenter',
                    time: {
                        unit: 'month',
                        parser: 'DD/MM/YYYY',
                        displayFormats: {
                            month: 'MMM'
                        }
                    },
                    gridLines: {
                        color: "#8A8A8A",
                        offsetGridLines: true
                    },
                    ticks: {
                        maxRotation: 90
                    }
                }],
                yAxes: [{
                    stacked: true,
                }]
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            legend: {
                display: true,
                onHover: function (e) {
                  e.target.style.cursor = 'pointer'
                },
                onLeave: function (e) {
                  e.target.style.cursor = 'default'
                }
            }
        }
    });
}

function updateCasesChart(el, selection){
    if (selection == 'all') {
        chartCumulativeCases();
        $('#activeCases').css('background-color', '#fff');
    }
    else if (selection == 'activeCases') {
        chartActiveCases();
        $('#all').css('background-color', '#fff');
    }
    el.style.backgroundColor = "#a0a0a0";
}

// Grafico casi attivi per tipo orizzontale
function chartActiveCases(){
    var activeCases = dati.chartActiveCases;
    datasets = [];
    for (var i = 1; i < activeCases.length; i++) {
        isHidden = false;
        var label = activeCases[i][0];
        var color = activeCases[i][1];
        var borderColor = activeCases[i][2];
        var chartData = activeCases[i].slice(3, activeCases[i].length); //Return all elements but first 3
        datasets.push({
            label: label,
            data: chartData,
            borderColor: borderColor,
            pointBackgroundColor: color,
            pointRadius: 0,
            backgroundColor: color,
            fill: true,
            hidden: isHidden
        });
    }
    casesChart.data = {
        labels: activeCases[0],
        datasets: datasets
    }
    casesChart.update();
}

// Grafico casi attivi per tipo orizzontale
function chartCumulativeCases(){
    var cumulativeCases = dati.chartCumulativeCases;
    datasets = [];
    for (var i = 1; i < cumulativeCases.length; i++) {
        isHidden = false;
        var label = cumulativeCases[i][0];
        var color = cumulativeCases[i][1];
        var chartData = cumulativeCases[i].slice(2, cumulativeCases[i].length); //Return all elements but first 2
        datasets.push({
            label: label,
            data: chartData,
            borderColor: color,
            pointBackgroundColor: color,
            pointRadius: 0,
            backgroundColor: color,
            fill: true,
            hidden: isHidden
        });
    }
    casesChart.data = {
        labels: cumulativeCases[0],
        datasets: datasets
    }
    casesChart.update();
}

var TimeCenterScale = Chart.scaleService.getScaleConstructor('time').extend({
    getPixelForTick: function(index) {
        var ticks = this.getTicks();
        if (index < 0 || index >= ticks.length) {
            return null;
        }
        // Get the pixel value for the current tick.
        var px = this.getPixelForOffset(ticks[index].value);

        // Get the next tick's pixel value.
        var nextPx = this.right;
        var nextTick = ticks[index + 1];
        if (nextTick) {
            nextPx = this.getPixelForOffset(nextTick.value);
        }

        // Align the labels in the middle of the current and next tick.
        return px + (nextPx - px) / 2;
    },
});
// Register the scale type
var defaults = Chart.scaleService.getScaleDefaults('time');
Chart.scaleService.registerScaleType('timecenter', TimeCenterScale, defaults);
