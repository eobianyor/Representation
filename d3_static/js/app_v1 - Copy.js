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

// Import data from the donuts.csv file
// =================================
d3.csv("data.csv").then(function (dataSet) {

    // Parse Data/Cast as numbers
    // ==============================
    dataSet.forEach(function (data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    });

    // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(dataSet, d => d.poverty)])
        .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .domain([18, d3.max(dataSet, d => d.obesity)])
        .range([chartHeight, 0]);

    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(dataSet)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", 15)
        .style("color", "orange")
        .style("fill", "red")
        .attr("opacity", ".75");

    // To put state abbr inside the circles
    // ==============================
    // circlesGroup = chartGroup.selectAll("text")
    //     .data(dataSet)
    //     .enter()
    //     .append("text")
    //     .text(d => `${d.abbr}`)
    //     .attr("cx", d => xLinearScale(d.poverty))
    //     .attr("cy", d => yLinearScale(d.obesity))

    // Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([0, -20])
        .html(function (d) {
            return (`<strong>${d.state}</strong><hr> poverty (%): ${d.poverty}<br>obesity (%): ${d.obesity}`);
        });

    // Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function (data) {
        toolTip.show(data, this);
    })
    // on mouseout event
    circlesGroup.on("mouseout", function (data, index) {
        toolTip.hide(data);
    });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 35)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obesity (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty (%)");
}).catch(function (error) {
    console.log(error);
});

// ==============================================================================================