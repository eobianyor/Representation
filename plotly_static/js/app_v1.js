// If using python server, visit here to see data: http://localhost:8000/data/data.json

// Declare variables
var sampleValuesSorted
var sampleValuesTop10
var otu_idsTop10
var otu_labelsTop10
var indvMetadata
var selectedID
var metadataArray
var wFreq
var nos

// // // // ----------------------------------------------------------- // // // // 
// // // //      FUNCTIONS TO PULL AND LOAD DEMOGRAPHIC INFORMATION    // // // //
// // // // ---------------------------------------------------------- // // // // 
function metaDataSearchLoop(selectedID) {
    d3.json("data/samples.json").then((bbData) => {
        selectedIDLocal = selectedID
        nos = 0
        metadataArray = bbData.metadata
        metadataArray.forEach(entry => {
            if (selectedIDLocal == metadataArray[nos].id) {
                d3.select('#Demographic_id').text(`ID: ${(metadataArray[nos].id)}`);
                d3.select('#Demographic_ethnicity').text(`Ethnicity: ${metadataArray[nos].ethnicity}`);
                d3.select('#Demographic_gender').text(`Gender: ${metadataArray[nos].gender}`);
                d3.select('#Demographic_age').text(`Age: ${metadataArray[nos].age}`);
                d3.select('#Demographic_location').text(`Location: ${metadataArray[nos].location}`);
                d3.select('#Demographic_bbtype').text(`Bbtype: ${metadataArray[nos].bbtype}`);
                d3.select('#Demographic_wfreq').text(`Wfreq: ${metadataArray[nos].wfreq}`);
            };
            nos = nos + 1;
        });
        // console.log(metadataArray)
    });
};

// // // // --------------------------------// // // // 
// // // //      FUNCTION TO PLOT GRAPHS    // // // //
// // // // --------------------------------// // // // 
function plotGraphsLoop(selectedID) {
    d3.json("data/samples.json").then((bbData) => {
        // Declare variables 
        var sampleValuesAll
        var otu_idsAll
        var otu_labelsAll
        var samplesArray

        // Run forEach to get the neccessary arrays needed for plots
        selectedIDLocal = selectedID
        nos = 0
        samplesArray = bbData.samples;
        samplesArray.forEach(entry => {
            if (selectedIDLocal == samplesArray[nos].id) {
                sampleValuesAll = samplesArray[nos].sample_values;
                otu_idsAll = samplesArray[nos].otu_ids;
                otu_labelsAll = samplesArray[nos].otu_labels;
            };
            nos = nos + 1;
        });

        // Declare more variables
        var sampleValuesAll
        var otu_idsAll
        var otu_labelsAll
        var sampleValuesTop10
        var otu_idsTop10
        var otu_labelsTop10


        // Slice arrays to get the first 10 objects for plotting
        sampleValuesTop10 = sampleValuesAll.slice(0, 10);
        otu_idsTop10 = otu_idsAll.slice(0, 10);
        otu_labelsTop10 = otu_labelsAll.slice(0, 10);

        // Sort and reverse top 10 sample values
        var sampleValuesTop10Sort = sampleValuesTop10.sort((a, b) => b - a);
        sampleValuesTop10Sort.reverse()
        // console.log(sampleValuesTop10Sort)

        // // Add some text to otu IDs
        // Declare some more variables
        nos = 0
        var new_otu_idsTop10 = []
        var new_otu_idsAll = []

        // Run forEach to add some text (OTU) to each otu_id value for all data and for top10
        otu_idsAll.forEach(i => {
            new_otu_idsAll.push(`OTU ${i}`);
        });
        otu_idsTop10.forEach(i => {
            new_otu_idsTop10.push(`OTU ${i}`);
        });

        // Get the wash freq info for guage CharacterData
        // Declare some more variables
        var wFreq
        var metaDataID
        var wFreqMax = 0
        selectedIDLocal = selectedID
        nos = 0
        metadataArray = bbData.metadata

        // Run forEach to verify ID no, get the wash frequency number (wfreq) and get the max wfreq value to setup guage plot
        metadataArray.forEach(entry => {
            if (selectedIDLocal == metadataArray[nos].id) {
                metaDataID = metadataArray[nos].id
                wFreq = metadataArray[nos].wfreq
            };
            if (wFreqMax < metadataArray[nos].wfreq) {
                wFreqMax = metadataArray[nos].wfreq
            };
            nos = nos + 1;
        });
        // console.log(wFreqMax)
        // console.log(metaDataID);
        // console.log(wFreq);

        // // BUILD PLOTS // // --------------------------------------------------------

        // // build bar plot
        var trace1 = {
            x: sampleValuesTop10Sort,
            y: new_otu_idsTop10,
            type: "bar",
            orientation: 'h',
            marker: {
                color: '#DE648F',
                width: 0.25
            },
        };

        var barData = [trace1];

        var barLayout = {
            title: `Top 10 Belly Button bacteria for OTU ID${selectedIDLocal}`,
            xaxis: { title: "# of Samples" },
            yaxis: { title: "OTU ID" }
        };

        Plotly.newPlot("bar", barData, barLayout);


        // // build bubble plot
        var trace2 = {
            x: otu_idsAll,
            y: sampleValuesAll,
            text: otu_labelsAll,
            mode: "markers",
            marker: {
                color: sampleValuesAll,
                size: sampleValuesAll
            },
        };

        var bubbleData = [trace2];

        var bubbleLayout = {
            title: `Belly Button bacteria for OTU ID${selectedIDLocal}`,
            showlegend: false,
            xaxis: { title: "OTU ID" },
            yaxis: { title: "# of Samples" }
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);


        // // build Guage plot
        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wFreq,
                title: { text: ` Wash frequency for OTU ID${selectedIDLocal}` },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [0, wFreqMax + 1] },
                    steps: [
                        { range: [0, ((1 / 4) * (wFreqMax + 1))], color: "#4D283D" },
                        { range: [((1 / 4) * (wFreqMax + 1)), ((2 / 4) * (wFreqMax + 1))], color: "#804265" },
                        { range: [((2 / 4) * (wFreqMax + 1)), ((3 / 4) * (wFreqMax + 1))], color: "#BF6397" },
                        { range: [((3 / 4) * (wFreqMax + 1)), ((4 / 4) * (wFreqMax + 1))], color: "#FF85CA" },
                    ]
                }
            }
        ];

        var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot("gauge", data, layout);
    });
};

// // // // ----------------------------------------------------------- // // // // 
// // // //       EVENT LISTENER FUNCTION TO HANDLE A SELECTION        // // // //
// // // // ---------------------------------------------------------- // // // //

// Function to handle a selection
function optionChanged(selectedID) {
    // d3.event.preventDefault();
    var selectedID = d3.select("#selDataset").property("value");
    d3.select("#selDataset").node().value = "";
    plotGraphsLoop(selectedID)
    metaDataSearchLoop(selectedID)
    console.log(selectedID)
}

// Add event listener for submit button - Not needed this time cos it's in the html code
// d3.select('#selDataset').on('change', handleSelection);

// // // // ------------------------------------------------------------------------------------------------------------------------------------------------------------ // // // // 
// // TO SETUP AN INITIALIZE FUNCTION THAT'LL POPULATE THE DROPDOWN, SELECT A RANDOM DEFAULT ID AND CALL THE PLOT GRAPH AND METADATA FUNCTIONS TO POPULATE LANDING PAGE // // // // 
// // // // ----------------------------------------------------------------------------------------------------------------------------------------------------------- // // // //
function initialize() {
    var selector = d3.select('#selDataset');

    d3.json("data/samples.json").then((bbData) => {

        var idNames = bbData.names;
        // console.log(idNames)

        idNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        //         // Select a sample from your data and call your build charts and metadata functions.
        selectedID = idNames[Math.floor(Math.random() * idNames.length)]
        plotGraphsLoop(selectedID)
        metaDataSearchLoop(selectedID)
        console.log(selectedID)

    });
}

initialize()