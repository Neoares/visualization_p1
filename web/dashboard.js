function showError(el, error){
  el.innerHTML = ('<div class="error" style="color:red;">'
                + '<p>JavaScript Error: ' + error.message + '</p>'
                + "<p>This usually means there's a typo in your chart specification. "
                + "See the javascript console for the full traceback.</p>"
                + '</div>');
  throw error;
}

var embedOpt = {"mode": "vega-lite"};

var map_file = "graphs/map.json";
const map_el = document.getElementById('map');
vegaEmbed("#map", map_file, embedOpt)
  .catch(error => showError(map_el, error));

var chart1_file = "graphs/graph_quant_fam.json";
const chart1_el = document.getElementById('chart1');
vegaEmbed("#chart1", chart1_file, embedOpt)
  .catch(error => showError(chart1_el, error));

var chart2_file = "graphs/graph_quant_fam.json";
const chart2_el = document.getElementById('chart2');
vegaEmbed("#chart2", chart2_file, embedOpt)
  .catch(error => showError(chart2_el, error));

var chart3_file = "graphs/graph_quant_fam.json";
const chart3_el = document.getElementById('chart3');
vegaEmbed("#chart3", chart3_file, embedOpt)
  .catch(error => showError(chart3_el, error));
