
// Read the Final.csv data using d3.csv (d3.js v7)
d3.csv("Final.csv").then(data => {
    console.log("Data loaded:", data);
    
    // Set up the SVG container and chart dimensions
    const margin = {top: 20, right: 20, bottom: 30, left: 50};
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create the SVG container
    const svg = d3.select("#mySvg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Define scales and other chart elements
    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scalePoint().range([height, 0]);
    const area = d3.area().curve(d3.curveBasis);

    // Prepare the data (modified to include all columns)
    const keys = data.columns;  // Include all columns as data
    const values = data.map(d => keys.map(key => +d[key]));

    // Set scale domains
    xScale.domain([0, d3.max(values.flat())]);
    yScale.domain(keys);

    // Draw the Ridgeline paths
    const offset = 50;  // Vertical offset between the paths
    keys.forEach((key, i) => {
        const y = yScale(key);
        const vals = values.map(d => d[i]);

        svg.append("path")
            .datum(vals)
            .attr("fill", "#69b3a2")
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("d", area.y1(d => y - offset + d));
    });

    // Add axes (optional)
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    svg.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);
    svg.append("g").call(yAxis);
});
