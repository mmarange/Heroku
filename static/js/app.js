// Endpoint for data
var url = "/samples"

// Initial d3.json() function
d3.json(url).then(data => {

  var selector = d3.select('#selDataset');
  var otuIDs = data['names'];

  // Populate the dropdown
  buildOptions(selector, otuIDs);

  var selected_otuID = selector.property('value');

  buildCharts(selected_otuID);
});

function buildCharts(subject_id) {

  d3.json(url).then(data => {

    console.log('in function');
    // Prepare metadata
    var metadata = data['metadata'];
    var filtered_meta = metadata.filter(m => m['id'] == subject_id)[0];
    
    // Assign Metadata variables
    var age = filtered_meta.age;
    var bbtype = filtered_meta.bbtype;
    var ethnicity = filtered_meta.ethnicity;
    var gender = filtered_meta.gender;
    var id = filtered_meta.id;
    var location = filtered_meta.location;
    var wfreq = filtered_meta.wfreq;

    // Prepare samples data
    var samples_data = data['samples'];
    var filtered_samples = samples_data.filter(s => s['id'] == subject_id);

    var sample_values = filtered_samples.map(d => d['sample_values']);
    var otu_ids = filtered_samples.map(d => d['otu_ids']);
    var otu_labels = filtered_samples.map(d => d['otu_labels']);
    
    var otu_labels_plt = otu_labels[0].slice(0,10).reverse();
    var sample_values_plt = sample_values[0].slice(0,10).reverse();
    var otu_ids_plt = otu_ids[0].slice(0,10).map(o => `OTU ${o}`).reverse();
    var otu_ids_plt_bubble = otu_ids[0].slice(0,10).reverse();

    //--------HORIZONTAL BAR GRAPH--------
    function bargraph() {
      var bar_data = [{
        type: 'bar',
        x: sample_values_plt,
        y: otu_ids_plt,
        orientation: 'h',
        text: otu_labels_plt,
        marker: {color: 'royalblue'}
      }];

      var layout = {
        title: `Plot showing top 10 OTUs of subject ID: ${subject_id}`,
        font:{
          family: 'Raleway, sans-serif'
        },
        
        xaxis: {text: 'Sample Values'},
        yaxis: {text: 'OTU IDS'}
      };
      
      Plotly.newPlot('bar', bar_data, layout);
    };
        
    bargraph();

    //--------BUBBLE CHART--------
    function bubbleChart(){
      var trace1 = {
        x: otu_ids_plt_bubble,
        y: sample_values_plt,
        text: otu_labels_plt,
        mode: 'markers',
        marker: {
          color: otu_ids_plt_bubble,
          size: sample_values_plt
        },
                
      };
      
      var data = [trace1];
      
      var layout = {
        title:  `Plot showing top 10 OTUs of subject ID: ${subject_id}`,
        // showlegend: false,
        // height: 600,
        // width: 600
      };
      
      Plotly.newPlot('bubble', data, layout);

    };
        
    bubbleChart();

    //--------GAUGE--------
    function buildGauge() {
      var data = [
        {
          type: "indicator",
          mode: "gauge+number",
          
          value: wfreq,
          title: { text: "Wash Frequency", font: { size: 17 } },
          gauge: {
            axis: { range: [null, 10], tickwidth: 1, tickcolor: "royalblue" },
            bar: { color: "royalblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 10], color: "lavender" }          
            ],        
          }
        }
      ];
    
      var layout = {
        width: 300,
        height: 400,
        margin: { t: 0, r: 0, l: 0, b: 0 },
      };
      
      Plotly.newPlot('gauge', data, layout);
    };

    buildGauge()
        
    function buildMetadata() {

      row = d3.select("table");
      row.html("")
      row.append('tr').append("td").text(`Id: ${id}`);
      
      row.append('tr').append("td").text(`ethnicity: ${ethnicity}`);
      row.append('tr').append("td").text(`gender: ${gender}`);
      row.append('tr').append("td").text(`age: ${age}`);
      row.append('tr').append("td").text(`location: ${location}`);
      row.append('tr').append("td").text(`bbtype: ${bbtype}`);
      row.append('tr').append("td").text(`wfreq: ${wfreq}`);
    };

    buildMetadata()
  });
}

function buildOptions(selector, otuIDs) { 
  
  otuIDs.forEach(name => {
      option = selector.append('option');
      option.property('value', name);
      option.text(name);
    });
}

function handleChange() {
  var selector = d3.select('#selDataset');
  otuID = selector.property('value');
  buildCharts(otuID);
}

var selector = d3.select('#selDataset');
selector.on('change', handleChange);