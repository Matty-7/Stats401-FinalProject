async function fetchData() {
    const response = await fetch('city_job_count_with_coordinates.json');
    const data = await response.json();
    return data;
  }

async function drawBubbles() {
const cityData = await fetchData();

const svg = d3.select("#map"); // 假设你的SVG元素的ID是"map"

// 根据你的需求来调整这些比例和颜色
const radiusScale = d3.scaleSqrt().domain([0, d3.max(cityData, d => d.job_count)]).range([2, 50]);
const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(cityData, d => d.job_count)]);

// 添加bubbles
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
  
  // 主函数
(async function main() {
    await drawBubbles();
  })();
  