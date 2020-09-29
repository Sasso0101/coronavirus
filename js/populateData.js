function updateData() {
    $.getJSON('https://salvatoreandaloro.altervista.org/coronavirus/datiV2.php?_=' + new Date().getTime(), function(datiJSON) {
        dati = datiJSON;
        var idVersione = parseInt(document.getElementById('idVersione').innerHTML);
        var nuovoIdVersione = parseInt(dati.id);
        if (idVersione != nuovoIdVersione) {
            var nuovoUltimoAggiornamento = dati.lastUpdated.time+' '+dati.lastUpdated.day;

            // Counter totali
            document.getElementById('totalePositivi').innerHTML=dati.today.activeCases;
            document.getElementById('totaleDecessi').innerHTML=dati.today.deaths;
            document.getElementById('totaleGuariti').innerHTML=dati.today.recovered;
            document.getElementById('terapiaIntensiva').innerHTML=dati.today.intensiveCare+' in terapia intensiva';
            percentuale = (dati.today.deaths*100) / (dati.today.activeCases + dati.today.deaths + dati.today.recovered);
            document.getElementById('percentualeDeceduti').innerHTML= Math.round((percentuale + Number.EPSILON) * 100) / 100+'% casi totali in Italia';
            percentuale = (dati.today.recovered*100) / (dati.today.activeCases + dati.today.deaths + dati.today.recovered);
            document.getElementById('percentualeGuariti').innerHTML= Math.round((percentuale + Number.EPSILON) * 100) / 100+'% casi totali in Italia';
            document.getElementById('nuoviPositivi').innerHTML='+'+dati.today.newActiveCases+' positivi oggi';
            document.getElementById('nuoviDeceduti').innerHTML='+'+dati.today.newDeaths+' decessi oggi';
            document.getElementById('nuoviGuariti').innerHTML='+'+dati.today.newRecovered+' guariti oggi';

            document.getElementById('ultimoAggiornamento').innerHTML=nuovoUltimoAggiornamento;
            document.getElementById('ultimoControllo').innerHTML='';
            document.getElementById('idVersione').innerHTML = nuovoIdVersione;
            if (idVersione) {
                document.getElementById('ultimoControllo').innerHTML='I dati sono stati aggiornati.';
                clearTimeout(animation);
                $("#ultimoControllo").slideDown("slow");
                animation = setTimeout(function() {
                    $('#ultimoControllo').slideUp('slow');
                }, 5000);
            }
            regionsData = dati.regions;
            provincesData = dati.provinces;
            initMap();
            /* Charts */
            getChart2(dati.today);
            getChart1(dati.chart);
            getChart(dati.chart);
        }
        else {
            var oggi = new Date();
            var data = oggi.getDate()+'/'+(oggi.getMonth()+1)+'/'+oggi.getFullYear();
            var ora = oggi.getHours() + ":" + oggi.getMinutes() + ":" + oggi.getSeconds();
            document.getElementById('ultimoControllo').innerHTML='Nessun nuovo aggiornamento. Ultimo controllo '+data+' '+ora;
            clearTimeout(animation);
            $("#ultimoControllo").slideDown("slow");
            animation = setTimeout(function() {
                $('#ultimoControllo').slideUp('slow');
            }, 5000);
        }
    });
}