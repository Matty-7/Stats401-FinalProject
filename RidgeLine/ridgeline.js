// 加载数据
d3.json("Glassdoor_Gender_Pay_Gap_Processed.json").then(data => {

    // 将数据按照教育程度进行分组
    const groupedData = d3.group(data, d => d.Education);

    // 准备用于绘图的数据
    const plotData = Array.from(groupedData, ([key, value]) => {
        return { education: key, salaries: value.map(d => d.Salary) };
    });

    // 设置SVG元素
    const svg = d3.select("#mySvg"),
        margin = { top: 20, right: 30, bottom: 40, left: 40 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 创建x轴的比例尺
    const x = d3.scaleLinear()
        .domain([0, d3.max(plotData, d => d3.max(d.salaries))])
        .range([0, width]);

    // 创建y轴的比例尺
    const y = d3.scaleBand()
        .domain(plotData.map(d => d.education))
        .range([0, height])
        .padding(1);

    // 添加x轴
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5));

    // 添加y轴
    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    // 绘制Ridgeline图表
    plotData.forEach((d, i) => {
        const density = kernelDensityEstimator(d.salaries, kernelEpanechnikov(7), x.ticks(40));
        g.append("path")
            .datum(density)
            .attr("class", "line")
            .attr("d", d3.line()
                .curve(d3.curveBasis)
                .x(d => x(d[0]))
                .y(d => y(d.education) + y.bandwidth() - d[1]))
            .style("stroke", "#000")
            .style("stroke-width", 1.5)
            .style("fill", "#69b3a2");
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
});
