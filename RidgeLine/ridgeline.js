// 加载数据
d3.json("Glassdoor_Gender_Pay_Gap_Processed.json").then(data => {

    // 将数据按照教育程度进行分组
    const groupedData = d3.group(data, d => d.Education);
    const categories = Array.from(groupedData.keys());
  
    // 准备用于绘图的数据
    const plotData = Array.from(groupedData, ([key, value]) => {
      return { education: key, salaries: value.map(d => d.Salary) };
    });
  
    // 设置维度和图表边距
    const margin = {top: 80, right: 30, bottom: 50, left: 110},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
  
    // 追加SVG元素到页面
    const svg = d3.select("#mySvg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // 创建x轴的比例尺
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Salary)])
      .range([0, width]);
  
    // 添加x轴
    svg.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(-height))
      .select(".domain").remove();
  
    // 创建y轴的比例尺
    const yName = d3.scaleBand()
      .domain(categories)
      .range([0, height])
      .paddingInner(1);
  
    // 添加y轴
    svg.append("g")
      .call(d3.axisLeft(yName).tickSize(0))
      .select(".domain").remove();
  
    // 创建y轴的密度比例尺
    const y = d3.scaleLinear()
      .domain([0, 0.0001])  // 密度比例尺的域可能需要根据你的数据进行调整
      .range([height, 0]);
  
    // 计算核密度估计值
    const kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40));
    const allDensity = plotData.map(d => {
      const density = kde(d.salaries);
      return { key: d.education, density: density };
    });
  
    // 添加区域
    svg.selectAll("areas")
      .data(allDensity)
      .join("path")
        .attr("transform", d => `translate(0, ${yName(d.key) - height})`)
        .attr("fill", "#69b3a2")  // 你可以通过一个颜色比例尺来为不同的教育程度设置不同的颜色
        .attr("opacity", 0.7)
        .attr("stroke", "#000")
        .attr("stroke-width", 0.1)
        .datum(d => d.density)
        .attr("d", d3.line()
            .curve(d3.curveBasis)
            .x(d => x(d[0]))
            .y(d => y(d[1]))
        );
  
  });
  
  // 核密度估计函数
  function kernelDensityEstimator(kernel, X) {
    return function(V) {
      return X.map(function(x) {
        return [x, d3.mean(V, function(v) { return kernel(x - v); })];
      });
    };
  }
  
  // 核函数
  function kernelEpanechnikov(k) {
    return function(v) {
      return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
  }
  