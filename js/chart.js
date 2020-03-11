Chart.defaults.global.maintainAspectRatio = false;
Chart.defaults.global.defaultFontFamily =  "'Roboto', 'sans-serif'";
Chart.defaults.global.layout.padding = {left: 0, right: 0, top: 20, bottom: 0}
Chart.defaults.global.elements.line.tension = 0;
Chart.defaults.global.elements.point.hitRadius = 6;
Chart.defaults.global.legend.labels.fontColor = "#d4d4d4";
Chart.defaults.global.legend.labels.usePointStyle = true;
Chart.defaults.global.legend.labels.boxWidth = 20;
Chart.defaults.global.legend.labels.padding = 10;
Chart.defaults.global.legend.position = "bottom";
Chart.defaults.line.scales.xAxes[0].gridLines = {color: "#8a8a8a"};
Chart.defaults.line.scales.xAxes[0].ticks = {fontColor: "#fff"};
Chart.defaults.line.scales.yAxes[0].gridLines = {color: "#8a8a8a"};
Chart.defaults.line.scales.yAxes[0].ticks = {fontColor: "#fff"}
Chart.defaults.bar.scales.xAxes[0].gridLines = {color: "#8a8a8a"};
Chart.defaults.bar.scales.xAxes[0].ticks = {fontColor: "#fff"};
Chart.defaults.bar.scales.yAxes[0].gridLines = {color: "#8a8a8a"};
Chart.defaults.bar.scales.yAxes[0].ticks = {fontColor: "#fff"};

function getChart(){
    $.getJSON('https://salvatoreandaloro.altervista.org/coronavirus/grafico/datiGrafico.php?_=' + new Date().getTime(), function(dati) {
        datasets = [];
        for (var i = 1; i < dati.length; i++) {
            var label = dati[i][0];
            var color = dati[i][1];
            dati[i].splice(0, 2);
            datasets.push({
                label: label,
                data: dati[i],
                borderColor: color,
                pointBackgroundColor: color,
                backgroundColor: color,
                fill: false
            });
        }
        var ctx = document.getElementById('canvasdatiGrafico').getContext('2d');
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dati[0],
                datasets: datasets
            }
        });
    });
}

function getChart1(){
    $.getJSON('https://salvatoreandaloro.altervista.org/coronavirus/grafico/datiGrafico2.php?_=' + new Date().getTime(), function(dati) {
        datasets = [];
        for (var i = 4; i < dati.length; i++) {
            var label = dati[i][0];
            var color = dati[i][1];
            dati[i].splice(0, 2);
            datasets.push({
                label: label,
                data: dati[i],
                borderColor: color,
                pointBackgroundColor: color,
                backgroundColor: color,
                fill: false
            });
        }
        var ctx = document.getElementById('canvasdatiGrafico1').getContext('2d');
        var chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dati[0],
                datasets: datasets
            }
        });
    });
}