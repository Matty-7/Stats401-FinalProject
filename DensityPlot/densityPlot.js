// set the dimensions and margins of the graph
const margin = { top: 30, right: 130, bottom: 30, left: 50 },
    width = 560 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// get the data
d3.csv("Glassdoor_Gender_Pay_Gap_Processed.csv").then(function (data) {

    // add the x Axis
    const x = d3.scaleLinear()
        .domain([40800, 185100])
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // add the y Axis
    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 0.0002]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Compute kernel density estimation
    const kde = kernelDensityEstimator(kernelEpanechnikov(100), x.ticks(50));
    const colors = ["#69b3a2", "#404080", "#FF5733", "#33FF57"];
    const variables = ["High School","College","Masters","PhD"];

    variables.forEach((variable, index) => {
        const density = kde(
            data.filter(d => d.Education === variable)
                .map(d => d.Salary)
        );

        // Plot the area
        svg.append("path")
            .attr("class", "mypath")
            .datum(density)
            .attr("fill", colors[index])
            .attr("opacity", ".6")
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("stroke-linejoin", "round")
            .attr("d", d3.line()
                .curve(d3.curveBasis)
                .x(d => x(d[0]))
                .y(d => y(d[1]))
            );
    });

    // Handmade legend
    variables.forEach((variable, index) => {
        svg.append("circle").attr("cx", 400).attr("cy", 30 + index * 30).attr("r", 6).style("fill", colors[index]);
        svg.append("text").attr("x", 420).attr("y", 30 + index * 30).text(variable).style("font-size", "15px").attr("alignment-baseline", "middle");
    });

});

// Function to compute density
function kernelDensityEstimator(kernel, X) {
    return function (V) {
        return X.map(function (x) {
            return [x, d3.mean(V, function (v) { return kernel(x - v); })];
        });
    };
}
function kernelEpanechnikov(k) {
    return function (v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}
