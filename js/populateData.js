function updateData() {
    $.getJSON('https://salvatoreandaloro.altervista.org/coronavirus/dati.php?_=' + new Date().getTime(), function(dati) {
        var idVersione = parseInt(document.getElementById('idVersione').innerHTML);
        var nuovoIdVersione = parseInt(dati.idVersione);
        if (idVersione != nuovoIdVersione) {
            var nuovoUltimoAggiornamento = dati.ultimoAggiornamento.ora+' '+dati.ultimoAggiornamento.data;
            var totalePositivi = 0, totaleDecessi = 0, totaleGuariti = 0, totaleNonConfermati = 0, nonConfermati = '', nome = '';
            const tabella = document.getElementById('regioni').getElementsByTagName('tbody')[0];
            // Reset tabella
            tabella.innerHTML = tabella.rows[0].innerHTML;
            for(regione in dati['regioni']) {
                nome = regione;
                regione = dati["regioni"][regione];
                var row = document.createElement("tr");
                // Incremento counter totali
                totalePositivi += regione.contagiati;
                totaleDecessi += regione.decessi;
                totaleGuariti += regione.guariti;
                // Casi non confermati
                nonConfermati = '';
                if (regione.nonConfermati > 0) {
                    nonConfermati = ' (+'+regione.nonConfermati+')*';
                    totaleNonConfermati += regione.nonConfermati;
                }
                // Inserimento riga
                row.innerHTML = '<td>'+nome+'</td><td>'+regione.contagiati+nonConfermati+'</td><td>'+regione.decessi+'</td><td>'+regione.guariti+'</td>';
                tabella.appendChild(row);
            }
            nonConfermati='';
            if (totaleNonConfermati > 0) {
                document.getElementById('notaNonConfermati').innerHTML='* Casi di tampone positivo ma non confermati';
                nonConfermati = ' (+'+totaleNonConfermati+')*';
            }
            // Riga finale totale Italia
            var row = document.createElement("tr");
            row.classList.add("rigaTotaleItalia");
            row.innerHTML = '<td>Italia</td><td>'+totalePositivi+nonConfermati+'</td><td>'+totaleDecessi+'</td><td>'+totaleGuariti+'</td>';
            tabella.appendChild(row);
            var row = document.createElement("tr");
            row.innerHTML = '<td colspan="4">'+dati.paeseAlMondo+'° paese nel mondo per numero di contagi</td>';
            tabella.appendChild(row);
            // Counter totali
            document.getElementById('totalePositivi').innerHTML=totalePositivi;
            document.getElementById('totaleDecessi').innerHTML=totaleDecessi;
            document.getElementById('totaleGuariti').innerHTML=totaleGuariti;
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