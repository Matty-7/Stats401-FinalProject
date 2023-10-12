// map.js
d3.json('gz_2010_us_050_00_500k.json').then(data => {
    const width = 960;
    const height = 600;
    const projection = d3.geoAlbersUsa().fitSize([width, height], data);
    const path = d3.geoPath().projection(projection);
    

    d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', 'steelblue');
});
