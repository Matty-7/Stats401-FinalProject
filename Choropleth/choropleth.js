
// Define dimensions and margins
const width = 960, height = 600;
const margin = {top: 10, right: 10, bottom: 10, left: 10};

// Define SVG element
const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Define projection and path
const projection = d3.geoAlbersUsa();
const path = d3.geoPath().projection(projection);

// Define color scale
const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 100]); // Max value is just an example, you can set it dynamically

// Load data and draw the map
Promise.all([
    d3.json("us-states.json"),  // NOTE: You need to provide this GeoJSON file
    d3.csv("city_job_count_final.csv")
]).then(function([us, jobData]) {
    // Draw states
    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#ccc");

    // Draw cities
    svg.append("g")
        .selectAll("circle")
        .data(jobData)
        .enter()
        .append("circle")
        .attr("cx", d => projection([d.Longitude, d.Latitude])[0])
        .attr("cy", d => projection([d.Longitude, d.Latitude])[1])
        .attr("r", d => Math.sqrt(d.Job_Count) / 2)
        .attr("fill", d => colorScale(d.Job_Count))
        .attr("opacity", 0.6);

    // Add tooltips or other interactivity here
});
