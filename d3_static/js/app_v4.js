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

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(dataSet, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([
            d3.min(dataSet, d => d[chosenXAxis]) * 0.8,
            d3.max(dataSet, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, chartWidth]);
    // .range([margin.left, chartWidth + margin.left]);

    return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(dataSet, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([
            d3.max(dataSet, d => d[chosenYAxis]) * 1.05,
            d3.min(dataSet, d => d[chosenYAxis]) * 0.95
        ])
        .range([0, chartHeight]);
    // .range([chartHeight + margin.top, margin.top]);

    return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating xAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// function used for updating circles group with a transition to
// new circles
// function renderYCircles(circlesGroup, newYScale, chosenYaxis) {

//     circlesGroup.transition()
//         .duration(1000)
//         .attr("cy", d => newYScale(d[chosenYAxis]));

//     return circlesGroup;
// }

// function used for updating circles group with new tooltip
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
        .offset([0, -0])
        .html(function (d) {
            return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    // return circlesGroup;

    circlesGroup.on("mouseover", function (data) {
        d3.select(this)
            .transition()
            .duration(500)
            .attr("r", 35);
    })
        // onmouseout event
        .on("mouseout", function (data) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("r", 20);
        });

    return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv").then(function (dataSet) {

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

    // // Create y scale function
    // var yLinearScale = d3.scaleLinear()
    //     .domain([(d3.min(dataSet, d => d.obesity) * 0.8), (d3.max(dataSet, d => d.obesity) * 1.2)])
    //     .range([chartHeight, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    console.log(bottomAxis)
    console.log(leftAxis)

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // append y axis
    // chartGroup.append("g")
    //     .call(leftAxis);
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
        // .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".75");

    // // Put state abbrevation text into the circles
    // circlesGroup = chartGroup.selectAll("text")
    //     .data(dataSet)
    //     .enter()
    //     .append("text")
    //     .text(d => `${d.abbr}`)
    //     .attr("cx", d => xLinearScale(d[chosenXAxis]))
    //     .attr("cy", d => yLinearScale(d[chosenYAxis]))

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
        .attr("y", 0 - margin.left)
        .attr("dy", "1em")
        .attr("value_y", "obesity") // value to grab for event listener
        .classed("active", true)
        .text("Obesity (%)");

    var incomeLabel = ylabelsGroup.append("text")
        .attr("x", 0 - (chartHeight / 2))
        .attr("y", 20 - margin.left)
        .attr("dy", "1em")
        .attr("value_y", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Income ($)");

    var smokesLabel = ylabelsGroup.append("text")
        .attr("x", 0 - (chartHeight / 2))
        .attr("y", 40 - margin.left)
        .attr("dy", "1em")
        .attr("value_y", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes (%)");


    // // append y axis
    // chartGroup.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - margin.left)
    //     .attr("x", 0 - (chartHeight / 2))
    //     .attr("dy", "1em")
    //     .classed("axis-text", true)
    //     .text("Obesity (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value_x = d3.select(this).attr("value_x");
            if (value_x !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value_x;
                chosenYAxis = value_y;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(dataSet, chosenXAxis);
                yLinearScale = yScale(dataSet, chosenYAxis);

                // updates x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);
                yAxis = renderYAxes(yLinearScale, yAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text for active and inactive labels permutations
                if (chosenXAxis === "healthcare" && chosenYAxis === "income") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
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
                else if (chosenXAxis === "healthcare" && chosenYAxis === "obesity") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
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
                else if (chosenXAxis === "healthcare" && chosenYAxis === "smokes") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
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
                else if (chosenXAxis === "poverty" && chosenYAxis === "obesity") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
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
                else if (chosenXAxis === "poverty" && chosenYAxis === "income") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
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
                else if (chosenXAxis === "poverty" && chosenYAxis === "smokes") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                } else if (chosenXAxis === "age" && chosenYAxis === "obesity") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
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
                else if (chosenXAxis === "age" && chosenYAxis === "income") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
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
                else if (chosenXAxis === "age" && chosenYAxis === "smokes") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
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

    // y axis labels event listener
    ylabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value_y = d3.select(this).attr("value_y");
            if (value_y !== chosenYAxis) {

                // replaces chosenYAxis with value
                chosenXAxis = value_x;
                chosenYAxis = value_y;

                console.log(chosenXAxis)
                console.log(value_x)
                console.log(chosenYAxis)
                console.log(value_y)

                // functions here found above csv import
                // updates y scale for new data
                xLinearScale = xScale(dataSet, chosenXAxis);
                yLinearScale = yScale(dataSet, chosenYAxis);

                // updates x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);
                yAxis = renderYAxes(yLinearScale, yAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text for active and inactive labels permutations
                if (chosenXAxis === "healthcare" && chosenYAxis === "income") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
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
                else if (chosenXAxis === "healthcare" && chosenYAxis === "obesity") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
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
                else if (chosenXAxis === "healthcare" && chosenYAxis === "smokes") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
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
                else if (chosenXAxis === "poverty" && chosenYAxis === "obesity") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
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
                else if (chosenXAxis === "poverty" && chosenYAxis === "income") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
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
                else if (chosenXAxis === "poverty" && chosenYAxis === "smokes") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                } else if (chosenXAxis === "age" && chosenYAxis === "obesity") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
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
                else if (chosenXAxis === "age" && chosenYAxis === "income") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
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
                else if (chosenXAxis === "age" && chosenYAxis === "smokes") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
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
