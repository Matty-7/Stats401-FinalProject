
let rawData;
let stratifiedData;
let color;


// Specify the chart’s dimensions.
const width = 1154;
const height = 1154;

// Create the SVG container.
let svg = d3.select('body')
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

function initialize(){
    // stratify
    stratifiedData = d3.stratify()
        .id(function (d) {return d.name;})
        .parentId(function (d) {return d.industry;})
        (rawData);

    // specify color
    color = d3.scaleOrdinal(stratifiedData.children, d3.schemeTableau10);

    //add a special option for returning to the overall view
    d3.select("#selectButton")
        .append('option')
        .text('Overview')
        .attr("value", function (d){return -1;});// return -1

    //add the industry dropdown menu
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(stratifiedData.children)
        .enter()
        .append('option')
        .text(function (d) { return d.id; }) // text showed in the menu
        .attr("value", function (d, i) {return i; }); // return the index of the child

    d3.select('#selectButton').on("change", function (){
        // recover the option that has been chosen
        const selectedNum = d3.select(this).property("value");
        //update
        if (selectedNum < 0){
            update(stratifiedData);
        }
        else{
            update(stratifiedData.children[selectedNum]);
        }
    })

}


function update(selectedData){
    svg.selectAll("*").remove();
    draw(selectedData);
}

function draw(data){
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

    // append text
    leaf.append('text')
        .attr("x", 3)
        .attr("y", d => (d.y1 - d.y0)/3)
        .text(d => d.data.id);

    // Filter
    leaf.selectAll('text')
        // originally I want to dynamically decide based on the length of the company name
        // however blob glitches out when I do d.data.id.length
        .filter(function(d){return (d.x1 - d.x0) <= 100})
        .remove();

}

// function draw(){
//
//     // stratify
//     const data = d3.stratify()
//         .id(function (d) {return d.name;})
//         .parentId(function (d) {return d.industry;})
//         (rawData);
//
//     // specify color
//     const color = d3.scaleOrdinal(data.children, d3.schemeTableau10);
//
//     // compute layout
//     const root =d3.treemap()
//         .tile(d3.treemapSquarify)
//         .size([width,height])
//         .padding(1)
//         .round(true)
//         (d3.hierarchy(data)
//             .sum(d => d.data.employeeCount)
//             .sort((a,b) => b.value - a.value));
//
//     //add the dropdown menu
//     d3.select("#selectButton")
//         .selectAll('myOptions')
//         .data(data.children)
//         .enter()
//         .append('option')
//         .text(function (d) { return d.id; }) // text showed in the menu
//         .attr("value", function (d) { return d; }); // corresponding value returned by the button
//
//     // Add a cell for each leaf of the hierarchy.
//     const leaf = svg.selectAll("g")
//         .data(root.leaves())
//         .join("a")
//         .attr("transform", d => `translate(${d.x0},${d.y0})`)
//         .attr("target", "_blank");
//
//
//     // Append a tooltip.
//     const format = d3.format(",d");
//     leaf.append("title")
//         .text(d => `${d.data.parent.id}\n${d.data.id}\n${format(d.value)}`);
//
//     // Append a color rectangle.
//     leaf.append("rect")
//         .attr("id", d => 'rect-'+ d.id)
//         .attr("fill", d => color(d.data.parent))
//         .attr("fill-opacity", 0.6)
//         .attr("width", d => d.x1 - d.x0)
//         .attr("height", d => d.y1 - d.y0);
//
//     // append text
//     leaf.append('text')
//         .attr("x", 3)
//         .attr("y", d => (d.y1 - d.y0)/3)
//         .text(d => d.data.id);
//
//     // Filter
//     leaf.selectAll('text')
//         // originally I want to dynamically decide based on the length of the company name
//         // however blob glitches out when I do d.data.id.length
//         .filter(function(d){return (d.x1 - d.x0) <= 100})
//         .remove();
//
// }

d3.csv('ProcessedData1.csv').then(function (data) {
    rawData = data;
    initialize();
    draw(stratifiedData)
})