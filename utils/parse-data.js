var fs = require('fs');

var getDataFromFile = function() {
  var rawData = fs.readFileSync(
    '../src/resources/data/gsheets.json',
    'utf8'
  );

  rawData = JSON.parse(rawData);

  var records = rawData.feed.entry;
  var data = records.map(function(input) {
    var out = {};
    out.nombre = input.gsx$nombre.$t;
    out.apellido = input.gsx$apellido.$t;
    out.localidad = input.gsx$localidad.$t;
    out.fecha_des = input.gsx$fechades.$t;
    out.genero = input.gsx$genero.$t;
    out.accion_al_des = input.gsx$accionaldes.$t;
    out.nombre = input.gsx$nombre.$t;
    out.imagen = input.gsx$foto1.$t;

    return out;
  });

  return data;
};

var outputData = getDataFromFile();
var jsonString = JSON.stringify(outputData);
fs.writeFile('result.json', jsonString, 'utf8');