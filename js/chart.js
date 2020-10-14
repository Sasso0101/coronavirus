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
function getChart1(chartData){
    datasets = [];
    isHidden = true;
    for (var i = 6; i < chartData.length; i++) {
        if (i == 6) {isHidden = false;}
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

// Grafico casi totali orizzontale
function getChart(chartData){
    datasets = [];
    for (var i = 1; i < 6; i++) {
        isHidden = false;
        if (i == 5) {isHidden = true;}
        var label = chartData[i][0];
        var color = chartData[i][1];
        chartData[i].splice(0, 2);
        datasets.push({
            label: label,
            data: chartData[i],
            borderColor: color,
            pointBackgroundColor: color,
            pointRadius: 0,
            backgroundColor: color,
            fill: false,
            hidden: isHidden
        });
    }
    var ctx = document.getElementById('canvasdatiGrafico').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
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

// Grafico a torta
function getChart2(today){
    datasets = [];
    chartData = [today.selfIsolation, today.hospitalized, today.intensiveCare, today.deaths, today.recovered]
    labels = ['Isolamento domiciliare', 'Ospedalizzati', 'Terapia intensiva', 'Deceduti', 'Guariti'];
    colors = ['#ffaa00', '#0080ff', '#ff1900', '#000000', '#15a30d'];
    var ctx = document.getElementById('canvasdatiGrafico2').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'doughnut',
        plugins: [ChartDataLabels],
        data: {
            labels: labels,
            datasets: [{
                data: chartData,
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            legend: {
                position: 'right',
                align: 'center',
                onClick: ''
            },
            layout: {
                padding: {left: 0, right: 0, top: 10, bottom: 10}
            },
            plugins: {
                datalabels: {
                    color: '#fff',
                    font: {
                        size: '14',
                        weight: '900'
                    },
                    anchor: 'center',
                    align: 'center',
                    display: 'auto',
                    formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.map(data => {
                            sum += data;
                        });
                        let percentage = (value*100 / sum).toFixed(2)+"%";
                        return percentage;
                    }
                }
            }
        }
    });
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
