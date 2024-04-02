const demoGraph = {
  nodes: [
    { id: 0, x: 250.80528773601532, y: 139.3222370386022 },
    { id: 1, x: 350.36149752809234, y: 174.4403718083411 },
    { id: 2, x: 424.89890164107817, y: 264.60763737795065 },
    { id: 3, x: 283.36554304504915, y: 417.69909738682776 },
    { id: 4, x: 201.260792942095, y: 339.91628122308936 },
    { id: 5, x: 150.89890164107817, y: 264.60763737795065 },
    { id: 6, x: 300.89890164107817, y: 264.60763737795065 },
  ],
  edges: [
    {
      source: 0,
      target: 1,
      weight: 28,
    },
    {
      source: 1,
      target: 2,
      weight: 16,
    },
    {
      source: 2,
      target: 3,
      weight: 12,
    },
    {
      source: 3,
      target: 4,
      weight: 22,
    },
    {
      source: 4,
      target: 5,
      weight: 25,
    },
    {
      source: 5,
      target: 0,
      weight: 10,
    },
    {
      source: 1,
      target: 6,
      weight: 14,
    },
    {
      source: 4,
      target: 6,
      weight: 24,
    },
    {
      source: 3,
      target: 6,
      weight: 18,
    },
  ],
};

export default demoGraph