// set the dimensions and margins of the graph
const margin = {top: 80, right: 30, bottom: 50, left:110},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left}, ${margin.top})`);

//read data
// d3.csv("probly.csv").then(function(data) {
d3.csv("Final.csv").then(function(data) {
  // Get the different categories and count them
//   const categories = ["Almost Certainly", "Very Good Chance", "We Believe", "Likely", "About Even", "Little Chance", "Chances Are Slight", "Almost No Chance" ]
  const categories = ["High School","College","Masters","PhD"]
  const n = categories.length

  // Compute the mean of each group
  allMeans = []
  for (i in categories){
    currentGroup = categories[i]
    mean = d3.mean(data, function(d) { return +d[currentGroup] })
    allMeans.push(mean)
  }

  // Create a color scale using these means.
  const myColor = d3.scaleSequential()
    .domain([0,100])
    .interpolator(d3.interpolateViridis);

  // Add X axis
  const x = d3.scaleLinear()
    .domain([40800, 184100])
    .range([ 0, width ]);
  svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickValues([0,25, 50, 75, 100]).tickSize(-height) )
    .select(".domain").remove()

  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + 40)
      .text("Probability (%)");

  // Create a Y scale for densities
  const y = d3.scaleLinear()
    .domain([0, 0.0004])
    .range([ height, 0]);

  // Create the Y axis for names
  const yName = d3.scaleBand()
    .domain(categories)
    .range([0, height])
    .paddingInner(1)
  svg.append("g")
    .call(d3.axisLeft(yName).tickSize(0))
    .select(".domain").remove()

  // Compute kernel density estimation for each column:
  const kde = kernelDensityEstimator(kernelEpanechnikov(100), x.ticks(35)) // increase this 40 for more accurate density.
  const allDensity = []
  for (i = 0; i < n; i++) {
      key = categories[i]
      density = kde( data.map(function(d){  return d[key]; }) )
      allDensity.push({key: key, density: density})
  }

  // Add areas
  svg.selectAll("areas")
    .data(allDensity)
    .join("path")
      .attr("transform", function(d){return(`translate(0, ${(yName(d.key)-height)})` )})
      .attr("fill", function(d){
        grp = d.key ;
        index = categories.indexOf(grp)
        value = allMeans[index]
        return myColor( value  )
      })
      .datum(function(d){return(d.density)})
      .attr("opacity", 0.7)
      .attr("stroke", "#000")
      .attr("stroke-width", 0.1)
      .attr("d",  d3.line()
          .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      )

})

// This is what I need to compute kernel density estimation
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}