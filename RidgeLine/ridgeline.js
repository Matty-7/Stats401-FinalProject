const margin = {top: 120, right: 30, bottom: 100, left:110},
    width = 860 - margin.left - margin.right,
    height = 620 - margin.top - margin.bottom;

const x = d3.scaleLinear()
    .domain([40800, 184100])
    .range([ 0, width]);

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left},${margin.top})`);

const xAxis = svg.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).tickValues([40800,69460,98120,126780,155440,184100]).tickSize(-height-80) )

const myCurves = svg.selectAll("areas")

svg.append("text").attr("class","ticker").attr("transform", "translate(0," + (height+70) + ")")
svg.append("text").attr("class","kernel").attr("transform", "translate(0," + (height+90) + ")")



//read data
d3.csv("Final.csv").then(function(data) {

  // Get the different categories and count them
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

  x.domain([40800, 184100]);

    xAxis
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickValues([40800,69460,98120,126780,155440,184100]).tickSize(-height-80) )

  // Add X axis label:
  const title = svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width/2)
      .attr("y", height + 40)
      .text("Density");

  // Create a Y scale for densities
  const y = d3.scaleLinear()
    .domain([0,  0.00025])
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
  let kde = kernelDensityEstimator(kernelEpanechnikov(200), x.ticks(20))
  svg.select(".ticker").text("X:"+20)
  svg.select(".kernel").text("Kernel:"+200)
  let allDensity = []
  for (i = 0; i < n; i++) {
      key = categories[i]
      density = kde( data.map(function(d){  return d[key]; }) )
      allDensity.push({key: key, density: density})
  }

  // Add areas
  myCurves
    .data(allDensity)
    .join("path")
      .attr("class", "myCurves")
      .attr("transform", function(d){return(`translate(0, ${(yName(d.key)-height)})`)})
      .attr("fill", "#007BFF")
      .datum(function(d){return(d.density)})
      .attr("opacity", 0.6)
      .attr("stroke", "#000")
      .attr("stroke-width", 0.1)
      .attr("d",  d3.line()
          .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      )

      let k = 200
      let X = 20
    
      function updateChart1(binNumber,k,X) {
        // recompute density estimation
        X = binNumber
        let kde = kernelDensityEstimator(kernelEpanechnikov(k), x.ticks(binNumber))
        let allDensity = []
        for (i = 0; i < n; i++) {
            key = categories[i]
            density = kde( data.map(function(d){  return d[key]; }) )
            allDensity.push({key: key, density: density})
        }
    
    
        // update the chart

        svg.selectAll('.myCurves').remove()


        svg.select(".ticker").text("X:"+binNumber)

        myCurves
        .data(allDensity)
          .join("path")
          .attr("class", "myCurves")
          .attr("transform", function(d){return(`translate(0, ${(yName(d.key)-height)})`)})
          .attr("fill", "#007BFF")
          .datum(function(d){return(d.density)})
          .attr("opacity", 0.6)
          .attr("stroke", "#000")
          .attr("stroke-width", 0.1)
          .attr("d",  d3.line()
              .curve(d3.curveBasis)
              .x(function(d) { return x(d[0]); })
              .y(function(d) { return y(d[1]); })
          )
      }

      function updateChart2(binNumber,k,X) {
        // recompute density estimation
        let kde = kernelDensityEstimator(kernelEpanechnikov(binNumber), x.ticks(X))
        k = binNumber
        let allDensity = []
        for (i = 0; i < n; i++) {
            key = categories[i]
            density = kde( data.map(function(d){  return d[key]; }) )
            allDensity.push({key: key, density: density})
        }
    
    
        // update the chart

        svg.selectAll('.myCurves').remove()


        svg.select(".kernel").text("X:"+binNumber)

        myCurves
        .data(allDensity)
          .join("path")
          .attr("class", "myCurves")
          .attr("transform", function(d){return(`translate(0, ${(yName(d.key)-height)})`)})
          .attr("fill", "#007BFF")
          .datum(function(d){return(d.density)})
          .attr("opacity", 0.6)
          .attr("stroke", "#000")
          .attr("stroke-width", 0.1)
          .attr("d",  d3.line()
              .curve(d3.curveBasis)
              .x(function(d) { return x(d[0]); })
              .y(function(d) { return y(d[1]); })
          )
      }
    
//     const brush = d3.brushX()
//     .extent([[0, 0], [width, height]])
//     .on("end", brushed);

//   svg.append("g")
//     .attr("class", "brush")
//     .call(brush);

    d3.select("#mySlider1").on("change", function(d){
        selectedValue = this.value
        updateChart1(selectedValue,k,X)
    })

    d3.select("#mySlider2").on("change", function(d){
        selectedValue = this.value
        updateChart2(selectedValue,k,X)
    })
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



// function brushed(event) {
//     if (!event.selection) {
//         resetZoom();  // Reset zoom if brush is cleared
//         return;
//     }

//     // Getting the selected brush coordinates
//     const [x0, x1] = event.selection;
    
//     // Update the x scale domain and re-render the chart
//     x.domain([x0, x1].map(x.invert, x));

//     // Update X axis
//     xAxis.transition().call(d3.axisBottom(x).tickValues([40800,69460,98120,126780,155440,184100]).tickSize(-height-80));

//     // Update the curves directly using myCurves

//     // myCurves
//     //     .transition()
//     //     .attr("d", d3.line()
//     //         .curve(d3.curveBasis)
//     //         .x(function(d) { return x(d[0]); })
//     //         .y(function(d) { return y(d[1]); })
//     //     );

// }
// function resetZoom() {
//     x.domain([40800, 184100]);
//     xAxis.transition().call(d3.axisBottom(x).tickValues([40800,69460,98120,126780,155440,184100]).tickSize(-height-80));
//     myCurves
//         .transition()
//         .attr("d",  d3.line()
//             .curve(d3.curveBasis)
//             .x(function(d) { return x(d[0]); })
//             .y(function(d) { return y(d[1]); })
//         );
// }