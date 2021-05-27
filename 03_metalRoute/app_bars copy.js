// @TODO: YOUR CODE HERE!
// Set up chart
// Define SVG area dimensions
// =================================
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
// =================================
var margin = {
    top: 40,
    right: 60,
    bottom: 100,
    left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
    .select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
// =================================
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
// =================================
// =================================



// Initial Params
var chosenXAxis = "LHR";

// function used for updating x-scale var upon click on axis label
function xScale(representationData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(representationData, d => d[chosenXAxis]) * 0.8,
        d3.max(representationData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, chartWidth]);

    return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    if (chosenXAxis === "LHR") {
        var label = "No. of seats - Lower House:";
    }
    else {
        var label = "No. of seats - Upper House:";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.countryCode}<br>${label} ${d[chosenXAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("Part1.csv").then(function (representationData) {

    // parse data
    representationData.forEach(function (data) {
        data.LHR = +data.LHR;
        data.Country = +data.Country;
        data.countryCode = +data.countryCode;
        data.Population = +data.Population;
        data.UHR = +data.UHR;
        data.CPRLH = +data.CPRLH;
        data.CPRUH = +data.UHCPR;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(representationData, chosenXAxis);

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(representationData, d => d.Population)])
        .range([chartHeight, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll(".bar")
        .data(representationData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.Population))
        .attr("r", 20)
        .attr("fill", "red")
        .attr("opacity", ".75")
        .attr("width", xBandScale.bandwidth())
        .attr("height", d => chartHeight - yLinearScale(d.Population));

    // Create group for  2 x- axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    var LHRLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "LHR") // value to grab for event listener
        .classed("active", true)
        .text("No. of seats - Lower House:");

    var UHRLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "UHR") // value to grab for event listener
        .classed("inactive", true)
        .text("No. of seats - Upper House:");

    // append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Population");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(representationData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "UHR") {
                    UHRLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    LHRLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    UHRLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    LHRLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}).catch(function (error) {
    console.log(error);
});


// =================================
// =================================
// // Import data from the donuts.csv file
// // =================================
// representation.csv("data.csv").then(function (dataSet) {

//     // Parse Data/Cast as numbers
//     // ==============================
//     dataSet.forEach(function (data) {
//         data.poverty = +data.Country;
//         data.obesity = +data.LHCPR;
//     });

//     // Create scale functions
//     // ==============================
//     var xLinearScale = representation.scaleLinear()
//         .domain([8, representation.max(dataSet, d => d.Country)])
//         .range([0, chartWidth]);

//     var yLinearScale = representation.scaleLinear()
//         .domain([18, representation.max(dataSet, d => d.LHCPR)])
//         .range([chartHeight, 0]);

//     // Create axis functions
//     // ==============================
//     var bottomAxis = representation.axisBottom(xLinearScale);
//     var leftAxis = representation.axisLeft(yLinearScale);

//     // Append Axes to the chart
//     // ==============================
//     chartGroup.append("g")
//         .attr("transform", `translate(0, ${chartHeight})`)
//         .call(bottomAxis);

//     chartGroup.append("g")
//         .call(leftAxis);

//     // Create Circles
//     // ==============================
//     var circlesGroup = chartGroup.selectAll("circle")
//         .data(dataSet)
//         .enter()
//         .append("circle")
//         .attr("cx", d => xLinearScale(d.Country))
//         .attr("cy", d => yLinearScale(d.LHCPR))
//         .attr("r", 15)
//         .style("color", "orange")
//         .style("fill", "red")
//         .attr("opacity", ".75");

//     // To put state abbr inside the circles
//     // ==============================
//     // circlesGroup = chartGroup.selectAll("text")
//     //     .data(dataSet)
//     //     .enter()
//     //     .append("text")
//     //     .text(d => `${d.abbr}`)
//     //     .attr("cx", d => xLinearScale(d.Country))
//     //     .attr("cy", d => yLinearScale(d.LHCPR))

//     // Initialize tool tip
//     // ==============================
//     var toolTip = representation.tip()
//         .attr("class", "tooltip")
//         .offset([0, -20])
//         .html(function (d) {
//             return (`<strong>${d.Country}</strong><hr> poverty (%): ${d.LHCPR}`);
//         });

//     // Create tooltip in the chart
//     // ==============================
//     chartGroup.call(toolTip);

//     // Create event listeners to display and hide the tooltip
//     // ==============================
//     circlesGroup.on("click", function (data) {
//         toolTip.show(data, this);
//     })
//     // on mouseout event
//     circlesGroup.on("mouseout", function (data, index) {
//         toolTip.hide(data);
//     });

//     // Create axes labels
//     chartGroup.append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 0 - margin.left + 35)
//         .attr("x", 0 - (chartHeight / 2))
//         .attr("dy", "1em")
//         .attr("class", "axisText")
//         .text("Obesity (%)");

//     chartGroup.append("text")
//         .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
//         .attr("class", "axisText")
//         .text("Poverty (%)");
// }).catch(function (error) {
//     console.log(error);
// });

// ==============================================================================================