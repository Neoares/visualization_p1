function showError(el, error){
  el.innerHTML = ('<div class="error" style="color:red;">'
                + '<p>JavaScript Error: ' + error.message + '</p>'
                + "<p>This usually means there's a typo in your chart specification. "
                + "See the javascript console for the full traceback.</p>"
                + '</div>');
  throw error;
}

var embedOpt = {"mode": "vega-lite"};

function draw(selector, data, options=embedOpt) {
    var el = document.querySelector(selector);
    vegaEmbed(selector, data, options)
        .catch(error => showError(el, error));

}

var graphs = {'map': undefined, 'quant_fam': undefined, 'balls': undefined, 'quant_com': undefined, 'ben_com': undefined}

// MAP
fetch(window.location.origin + '/graphs/map.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        myJson.data.url = 'graphs/' + myJson.data.url
        graphs.map = myJson
        draw('#map', myJson)
    });

// QUANT-FAM
fetch(window.location.origin + '/graphs/graph_quant_fam.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        graphs.quant_fam = myJson
        draw('#quant-fam', myJson)
    });

// BALLS
fetch(window.location.origin + '/graphs/balls_bqy.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        graphs.balls = myJson
        draw('#ball', myJson)
    });

// QUANTITAT / COMARCA
fetch(window.location.origin + '/graphs/graph_quant_com.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        graphs.quant_com = myJson
        draw('#quant-com', myJson)
    });

// BENEFICI / COMARCA
fetch(window.location.origin + '/graphs/graph_benef_comarca.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        graphs.ben_com = myJson
        draw('#ben-com', myJson)
    });


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
    console.log("clicked")
    swap_level(event)
})