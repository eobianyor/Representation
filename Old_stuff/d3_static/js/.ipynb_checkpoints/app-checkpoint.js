// @TODO: YOUR CODE HERE!
// Set up chart
// Define SVG area dimensions
// =================================================================
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
// =================================================================
var margin = {
    top: 40,
    right: 60,
    bottom: 100,
    left: 80
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;
var circleSize = 15
var circleZoom = 30

// Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================================================
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
// =================================================================
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "LHCPR";

// function used for updating x-scale var upon click on axis label
// =================================================================
function xScale(dataSet, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([
            (d3.min(dataSet, d => d[chosenXAxis])) * 0.9,
            (d3.max(dataSet, d => d[chosenXAxis])) * 1.1
        ])
        .range([0, chartWidth]);

    return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
// =================================================================
function yScale(dataSet, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([
            (d3.min(dataSet, d => d[chosenYAxis])) * 0.9,
            (d3.max(dataSet, d => d[chosenYAxis])) * 1.1
        ])
        .range([chartHeight, 0]);

    return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
// =================================================================
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating yAxis var upon click on axis label
// =================================================================
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to new circles
// =================================================================
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// function used for updating circles group with the state abbreviations into new circles
// =================================================================
function renderStatesCircle(stateCircles, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    stateCircles.transition()
        .duration(1000)
        .attr("dx", d => newXScale(d[chosenXAxis]) - 11)
        .attr("dy", d => newYScale(d[chosenYAxis]) + 6);

    return stateCircles;
}

// function used for updating circles group with new tooltip
// =================================================================
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "poverty" && chosenYAxis === "obesity") {
        var xlabel = "Poverty (%)";
        var ylabel = "Obesity (%)";
    }
    else if (chosenXAxis === "healthcare" && chosenYAxis === "obesity") {
        var xlabel = "Healthcare (%)";
        var ylabel = "Obesity (%)";
    }
    else if (chosenXAxis === "age" && chosenYAxis === "obesity") {
        var xlabel = "Age (yrs)";
        var ylabel = "Obesity (%)";
    }
    else if (chosenXAxis === "poverty" && chosenYAxis === "income") {
        var xlabel = "Poverty (%)";
        var ylabel = "Income ($)";
    }
    else if (chosenXAxis === "healthcare" && chosenYAxis === "income") {
        var xlabel = "Healthcare (%)";
        var ylabel = "Income ($)";
    }
    else if (chosenXAxis === "age" && chosenYAxis === "income") {
        var xlabel = "Age (yrs)";
        var ylabel = "Income ($)";
    }
    else if (chosenXAxis === "poverty" && chosenYAxis === "smokes") {
        var xlabel = "Poverty (%)";
        var ylabel = "Smokes (%)";
    }
    else if (chosenXAxis === "healthcare" && chosenYAxis === "smokes") {
        var xlabel = "Healthcare (%)";
        var ylabel = "Smokes (%)";
    }
    else if (chosenXAxis === "age" && chosenYAxis === "smokes") {
        var xlabel = "Age (yrs)";
        var ylabel = "Smokes (%)";
    }
    else {
        var xlabel = "Poverty (%)";
        var ylabel = "Obesity (%)";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -80])
        .html(function (d) {
            return (`<h6>${d.state}</h6><br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);

    // mouse over for tool tip and identifying the selected circle
    // =================================================================
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this)
        d3.select(this).style("stroke", "black").style("stroke-width", 3).attr("fill", "#66120C").attr("r", circleZoom);
    })
    // onmouseout event
    circlesGroup.on("mouseout", function (data, index) {
        toolTip.hide(data)
        d3.select(this).style("stroke", "#FF756B").style("stroke-width", 1).attr("fill", "#E6001C").attr("r", circleSize);
    });

    return circlesGroup;
}

// =================================================================
// Retrieve data from the CSV file and execute everything below
// =================================================================
d3.csv("assets/data/data.csv").then(function (dataSet) {

    // parse data
    dataSet.forEach(function (data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
        data.healthcare = +data.healthcare;
        data.income = +data.income;
        data.age = +data.age;
        data.smokes = +data.smokes;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(dataSet, chosenXAxis);

    // yLinearScale function above csv import
    var yLinearScale = yScale(dataSet, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        // .attr("transform", `translate(0, ${chartHeight})`)
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(dataSet)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", circleSize)
        .attr("stroke", "#FF756B")
        .attr("stroke-width", 1)
        .attr("fill", "#E6001C")
        .attr("opacity", ".75");

    // Put state abbrevation text into the circles
    var stateCircles = chartGroup.selectAll(".statetext")
        .data(dataSet)
        .enter()
        .append("text")
        .text(d => `${d.abbr}`)
        .attr("dx", d => (xLinearScale(d[chosenXAxis]) - 11))
        .attr("dy", d => (yLinearScale(d[chosenYAxis]) + 6))
        .attr("fill", "white");

    // Create group for  3 x- axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value_x", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty (%)");

    var healthcareLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value_x", "healthcare") // value to grab for event listener
        .classed("inactive", true)
        .text("Healthcare (%)");

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value_x", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (yrs)");

    // Create group for  3 y- axis labels
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var obesityLabel = ylabelsGroup.append("text")
        .attr("x", 0 - (chartHeight / 2))
        .attr("y", 10 - margin.left)
        // .attr("dy", "1em")
        .attr("value_y", "obesity") // value to grab for event listener
        .classed("active", true)
        .text("Obesity (%)");

    var incomeLabel = ylabelsGroup.append("text")
        .attr("x", 0 - (chartHeight / 2))
        .attr("y", 30 - margin.left)
        // .attr("dy", "1em")
        .attr("value_y", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Income ($)");

    var smokesLabel = ylabelsGroup.append("text")
        .attr("x", 0 - (chartHeight / 2))
        .attr("y", 50 - margin.left)
        // .attr("dy", "1em")
        .attr("value_y", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes (%)");

    // =================================================================
    // updateToolTip function above csv import
    // =================================================================
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // =================================================================
    // x axis labels event listener
    // =================================================================
    xlabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value_x = d3.select(this).attr("value_x");
            if (value_x !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value_x;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(dataSet, chosenXAxis);

                // updates x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                stateCircles = renderStatesCircle(stateCircles, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "healthcare") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
    // =================================================================
    // y axis labels event listener
    // =================================================================
    ylabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value_y = d3.select(this).attr("value_y");
            if (value_y !== chosenYAxis) {

                // replaces chosenYAxis with value
                chosenYAxis = value_y;

                // console.log(chosenYAxis)

                // functions here found above csv import
                // updates y scale for new data
                yLinearScale = yScale(dataSet, chosenYAxis);

                // updates x axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                stateCircles = renderStatesCircle(stateCircles, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenYAxis === "income") {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}).catch(function (error) {
    console.log(error);
});