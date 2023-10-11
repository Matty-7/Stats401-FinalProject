
let myData;


// Specify the chart’s dimensions.
const width = 1154;
const height = 1154;

// Create the SVG container.
const svg = d3.select('body')
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

function draw(){

    // stratify
    const data = d3.stratify()
        .id(function (d) {return d.name;})
        .parentId(function (d) {return d.industry;})
        (myData);

    // specify color
    const color = d3.scaleOrdinal(data.children, d3.schemeTableau10);

    // compute layout
    const root =d3.treemap()
        .tile(d3.treemapSquarify)
        .size([width,height])
        .padding(1)
        .round(true)
        (d3.hierarchy(data)
            .sum(d => d.data.employeeCount)
            .sort((a,b) => b.value - a.value));

    // Add a cell for each leaf of the hierarchy.
    const leaf = svg.selectAll("g")
        .data(root.leaves())
        .join("a")
        .attr("transform", d => `translate(${d.x0},${d.y0})`)
        .attr("target", "_blank");

    // Append a tooltip.
    const format = d3.format(",d");
    leaf.append("title")
        .text(d => `${d.data.parent.id}\n${d.data.id}\n${format(d.value)}`);

    // Append a color rectangle.
    leaf.append("rect")
        .attr("id", d => 'rect-'+ d.id)
        .attr("fill", d => color(d.data.parent))
        .attr("fill-opacity", 0.6)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);


    // I don't know how to make this work please help


    // // Append a clipPath to ensure text does not overflow.
    // leaf.append("clipPath")
    //     .attr("id", d => "clip-" + d.id);
    //
    // // Append multiline text. The last line shows the value and has a specific formatting.
    // leaf.append("text")
    //     .attr("clip-path", d => "clip-" + d.id)
    //     .selectAll("tspan")
    //     .data(d => d.id.concat(format(d.value)))
    //     .join("tspan")
    //     .attr("x", 3)
    //     .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
    //     .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
    //     .text(d => d);
}

d3.csv('ProcessedData1.csv').then(function (data) {
    myData = data;
    draw();
})