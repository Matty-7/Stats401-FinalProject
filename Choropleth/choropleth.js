// Read the CSV file
d3.csv("city_job_count_final.csv").then(function(data) {
  
  // Select the body of the HTML document
  var body = d3.select("body");
  
  // Create an SVG element
  var svg = body.append("svg")
    .attr("width", 960)
    .attr("height", 600);

  // Define a scale for the circle radius
  var radiusScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.Job_Count; })])
    .range([5, 50]);

  // Create circles for each city
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d, i) { return i * 60 + 50; })  // For now, place them horizontally
    .attr("cy", 300)  // Vertically centered
    .attr("r", function(d) { return radiusScale(d.Job_Count); })  // Radius based on job count
    .attr("fill", "blue");

});
