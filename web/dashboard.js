function showError(el, error){
  el.innerHTML = ('<div class="error" style="color:red;">'
                + '<p>JavaScript Error: ' + error.message + '</p>'
                + "<p>This usually means there's a typo in your chart specification. "
                + "See the javascript console for the full traceback.</p>"
                + '</div>');
  throw error;
}

var embedOpt = {"mode": "vega-lite"};

function draw(selector, data, key, options=embedOpt) {
    var el = document.querySelector(selector);
    vegaEmbed(selector, data, options)
        .then(function (response) {
            views[key] = response
        })
        .catch(error => showError(el, error));

}

// document.body.style.minWidth = window.innerWidth + 'px';

var lpw = document.getElementById('left-pane').getBoundingClientRect().width
var rpw = document.getElementById('right-pane').getBoundingClientRect().width
var legend_width = 221

var graphs = {'map': undefined, 'balls': undefined, 'quant_com': undefined, 'ben_com': undefined}
var views = {'map': undefined, 'balls': undefined, 'quant_com': undefined, 'ben_com': undefined}


function load() {
    // MAP + QUANT-FAM
    fetch(window.location.origin + '/graphs/map_graph_quant_fam.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            graphs.map = myJson
            graphs.map.config.view.width = Math.round(lpw) - legend_width - 100;
            graphs.map.vconcat[1].width = graphs.map.config.view.width + legend_width
            draw('#map', graphs.map)
        });

    // BALLS
    fetch(window.location.origin + '/graphs/balls_bqy.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            graphs.balls = myJson
            //graphs.balls.config.view.autosize = {"type": "fit", "resize": true, "contains": "padding"}
            graphs.balls.width = Math.round(rpw) - 150
            graphs.balls.height = window.innerHeight - 300
            draw('#ball', graphs.balls)
        });

    // QUANTITAT / COMARCA
    fetch(window.location.origin + '/graphs/graph_quant_com.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            graphs.quant_com = myJson
            //graphs.quant_com.config.view.autosize = {"type": "fit", "resize": true, "contains": "padding"}
            //graphs.quant_com.config.view.width = Math.round(rpw) - 360
            graphs.quant_com.hconcat[0].width = Math.round(rpw) - 260
            draw('#quant-com', graphs.quant_com)
        });

    // BENEFICI / COMARCA
    fetch(window.location.origin + '/graphs/graph_benef_comarca.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            graphs.ben_com = myJson
            //graphs.ben_com.config.view.autosize = {"type": "fit", "resize": true, "contains": "padding"}
            // graphs.ben_com.config.view.width = Math.round(rpw) - 250
            graphs.ben_com.hconcat[0].width = Math.round(rpw) - 260
            draw('#ben-com', graphs.ben_com)
        });
}
load()



var which = 1
function swap_level(event) {
    l1 = document.querySelectorAll('#main-grid .level-1');
    l2 = document.querySelectorAll('#main-grid .level-2');
    label = document.querySelector('#change-view span.text ')

    if (which == 2) {
        which = 1
        Array.from(l1).map(el => {el.style.display = ''})
        Array.from(l2).map(el => {el.style.display = 'none'})
        label.innerHTML = 'View details'
    } else {
        which = 2
        Array.from(l1).map(el => {el.style.display = 'none'})
        Array.from(l2).map(el => {el.style.display = ''})
        label.innerHTML = 'View generic'
    }
}

l2 = document.querySelectorAll('#main-grid .level-2');
Array.from(l2).map(el => {el.style.display = 'none'})

document.querySelector('#content nav .more-info').addEventListener('click', event => {
    swap_level(event)
})
