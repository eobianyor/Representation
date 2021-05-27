// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 90
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("body")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from hours-of-tv-watched.csv
d3.csv("Part1c.csv").then(function (representationData) {

    console.log(representationData);

    // Cast the hours value to a number for each piece of tvData
    representationData.forEach(function (d) {
        d.cpr = +d.cpr;
        d.reps = +d.reps;
        d.population = +d.population;
    });

    // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
    var xBandScale = d3.scaleBand()
        .domain(representationData.map(d => d.countryCode))
        .range([0, chartWidth])
        .padding(0.1);

    // Create a linear scale for the vertical axis.
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(representationData, d => d.cpr)])
        .range([chartHeight, 0]);

    // Create two new functions passing our scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xBandScale);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

    // Append two SVG group elements to the chartGroup area,
    // and create the bottom and left axes inside of them
    chartGroup.append("g")
        .call(leftAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // Create one SVG rectangle per piece of Data
    // ============ OPTION 1 ============
    // Use the linear and band scales to position each rectangle within the chart
    var barsGroup = chartGroup.selectAll(".bar")
        .data(representationData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xBandScale(d.countryCode))
        .attr("y", d => yLinearScale(d.cpr))
        .attr("fill", "red")
        .attr("opacity", ".5")
        .attr("stroke-width", "2")
        .attr("stroke", "black")
        .attr("width", xBandScale.bandwidth())
        .attr("height", d => chartHeight - yLinearScale(d.cpr));

    // ========== OPTION 1 END ==========
    // // ============ OPTION 2 ============

    // var barSpacing = 10; // desired space between each bar
    // var scaleY = 10; // 10x scale on rect height

    // // Create a 'barWidth' variable so that the bar chart spans the entire chartWidth.
    // var barWidth = (chartWidth - (barSpacing * (representationData.length - 1))) / representationData.length;

    // // @TODO
    // // Create code to build the bar chart using the Data.
    // chartGroup.selectAll(".bar")
    //     .data(representationData)
    //     .enter()
    //     .append("rect")
    //     .classed("bar", true)
    //     .attr("width", d => barWidth)
    //     .attr("height", d => d.cpr * scaleY)
    //     .attr("x", (d, i) => i * (barWidth + barSpacing))
    //     .attr("y", d => chartHeight - d.cpr * scaleY);

    // // ========== OPTION 2 END ==========


    // Create group for x- axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    var LHRLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        // .attr("value", "LHR") // value to grab for event listener
        .attr("text-anchor", "middle")
        .attr("font-size", "32px")
        .attr("fill", "green")
        .classed("active", true)
        .text("Countries");

    // append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .attr("font-size", "24px")
        .attr("fill", "orange")
        .classed("axis-text", true)
        .text("Citizens per representative");


    // chartGroup.append("text")
    //     // Position the text
    //     // Center the text: (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor)
    //     .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 20})`)
    //     .attr("text-anchor", "middle")
    //     .attr("font-size", "16px")
    //     .attr("fill", "green")
    //     .text("Morning Donut Craving Level");

    // chartGroup.append("text")
    //     .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 37})`)
    //     .attr("text-anchor", "middle")
    //     .attr("font-size", "16px")
    //     .attr("fill", "orange")
    //     .text("Evening Donut Craving Level");

    // // ================ TOOLTIP V1 ================
    // // updateToolTip function above csv import
    // var chartGroup = updateToolTip(d.country, chartGroup);

    // // // ================ TOOLTIP V2 ================
    // // Step 1: Initialize Tooltip
    // var toolTip = d3.tip()
    //     .attr("class", "tooltip") //toolTip doesn't have a "classed()" function like core d3 uses to add classes, so we use the attr() method.
    //     .offset([80, 50]) // (vertical, horizontal)
    //     .html(function (d) {
    //         return (`<strong>${d.country}<strong><hr>${d.reps} Reps`);
    //     });

    // // Step 2: Create the tooltip in chartGroup.
    // barsGroup.call(toolTip);

    // // Step 3: Create "mouseover" event listener to display tooltip
    // barsGroup.on("mouseover", function (d) {
    //     toolTip.show(d, this);
    // })
    //     // Step 4: Create "mouseout" event listener to hide tooltip
    //     .on("mouseout", function (d) {
    //         toolTip.hide(d);
    //     });


    // // // ================ TOOLTIP V3 ================
    // // Create the event listeners with transitions
    // barsGroup.on("mouseover", function () {
    //     d3.select(this)
    //         .transition()
    //         .duration(500)
    //         .attr("fill", "yellow");
    // })
    //     .on("mouseout", function () {
    //         d3.select(this)
    //             .transition()
    //             .duration(500)
    //             .attr("fill", "green");
    //     });

    // // // // ================ TOOLTIP V4 ================
    // // Step 1: Append a div to the body to create tooltips, assign it a class
    // // Because the tooltip class has a CSS setting for "display: none", this div will be invisible initially.
    // // =======================================================
    // var toolTip = d3.select("body").append("div")
    //     .attr("class", "tooltip");

    // // Step 2: Add an onmouseover event to display a tooltip
    // // The tooltip's CSS styling has position: absolute which will allow us to explicitly define the location with left & top.
    // // ========================================================
    // barsGroup.on("mouseover", function (d, i) {
    //     // make the tooltip visible
    //     toolTip.style("display", "block");
    //     toolTip.html(`<strong>${d.country}<strong><hr>${d.reps}Reps`)

    //         // d3.event.pageX andp pageY are the mouse coordinates for the pointer that triggered the event
    //         .style("left", d3.event.pageX + "px")
    //         .style("top", d3.event.pageY + "px");
    // })
    //     // Step 3: Add an onmouseout event to make the tooltip invisible
    //     .on("mouseout", function () {
    //         toolTip.style("display", "none");
    //     });

    // // // ================ TOOLTIP V5 ================

    // Step 1: Append tooltip div
    var toolTip = d3.select("body")
        .append("div")
        .classed("tooltip", true);

    // Step 2: Create "mouseover" event listener to display tooltip
    barsGroup.on("mouseover", function (d) {
        toolTip.style("display", "block")
            .html(
                `<strong>${d.country}<strong><hr>${d.reps} Reps`)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
    })
        // Step 3: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function () {
            toolTip.style("display", "none");
        });


}).catch(function (error) {
    console.log(error);
});
