import {stateShapes} from "@observablehq/us-county-datasets"

Plot.plot({
    projection: "albers-usa",
    width: exampleWidth,
    height: exampleHeight,
    marks: [
      Plot.frame({stroke: "white", fill: "#111"}),
      Plot.geo(stateShapes, {stroke: "#fff", strokeWidth: 0.35})
    ]
  })

  usStateCodes = import('https://cdn.skypack.dev/us-state-codes@1.1.2?min').then(d => d.default)
  stateShapes = topojson.feature(us, us.objects.states)
  statesByFips = new Map(Array.from(us.objects.states.geometries, d => [d.id, d.properties]))
  // The borders of the states are merged so we can render a single line where they would otherwise overlap
  statesMesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b)