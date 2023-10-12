// Fetching the data from the JSON file
async function fetchData() {
  const response = await fetch('city_job_count_with_coordinates.json');
  const data = await response.json();
  console.log(data)
  return data;
}


// Function to draw bubbles on the map
async function drawBubbles() {
  const cityData = await fetchData();

  const svg = d3.select("#map"); // Assuming your SVG element has the ID "map"

  // You can adjust these scales according to your needs
  const radiusScale = d3.scaleSqrt().domain([0, d3.max(cityData, d => d.job_count)]).range([2, 50]);
  const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(cityData, d => d.job_count)]);

  // Adding bubbles
  svg.selectAll(".bubble")
    .data(cityData)
    .enter()
    .append("circle")
    .attr("class", "bubble")
    .attr("cx", d => d.coordinates[0])
    .attr("cy", d => d.coordinates[1])
    .attr("r", d => radiusScale(d.job_count))
    .attr("fill", d => colorScale(d.job_count))
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5);
}

// Main function to draw the bubbles
(async function main() {
  await drawBubbles();
})();
