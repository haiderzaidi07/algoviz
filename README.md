# AlgoViz

An application to visualize the performance of Kruskal's and Prim’s algorithms on graphs, either sparse or dense, with inputs ranging from 5 to 250 nodes

![AlgoViz GIF](https://github.com/haiderzaidi07/haiderzaidi07/blob/main/algoviz.gif?raw=true)

## Live Demo

The live demo of this website can be accessed at: https://algovyz.netlify.app/


## Features

- Custom graph size
- Ability to drag and move nodes around
- Measures the performance of algorithms up to 0.1 milliseconds


## Tech Stack

**Client:** TypeScript, React, TailwindCSS, D3.js


## Run Locally

Clone the project

```bash
git clone https://github.com/haiderzaidi07/algoviz.git
```

Go to the project directory

```bash
cd algoviz/
```

Install dependencies

```bash
npm install
```

Start the server

```bash
npm run dev
```


## Lessons Learned

- Learnt to use D3.js to implement force directed graph
- Learnt to use "performance" object in JavaScript to measure the running time of algorithms


## Further Optimizations

- Add specific types for drag and simulation ticking methods in Graph.tsx
