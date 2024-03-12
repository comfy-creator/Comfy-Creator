### State Management:

First we create a yDoc, like `const ydoc = new Doc()`; this is stored outside of React, in client-memory. Then, we create a YJS provider, which establishes a websocket connection to our Yjs server; we will (1) send diffs that are applied to our local yDoc to this server, and (2) receive diffs from this server, and apply them to our local yDoc. This syncronizes state remotely.

In Zustand, we obtain a reference to this yDoc, like `nodesMap = ydoc.getMap<Node>('nodes')`. First, we subscribe to the Yjs Provider; when a state, such as nodesMap, changes, we apply this directly to our nodes, like `setNodes(Array.from(nodesMap.values())`. This updates our Zustand state `nodes`, which will propagate throughtout the rest of the app.

Next, we create a wrapper, around `setNodes()`, which will be used by ReactFlow. When any logic in our app calls `setNodes()`, we will also apply these changes to our yDoc. We also modify our `onNodesChanges` to similarly take changes that ReactFlow is proposing and apply them to our yDoc as well.

ReactFlow uses (1) `nodes` as the source of truth for state, (2) it uses `onNodesChange` as a handler called when it wants to apply state-changes to the graph. This allows us to implement our own custom logic to the state-changes. ReactFlow does not use `setNodes` directly to change state; it expects us to do that in reseponse to its events.

This is how state is propagated throughtout our app.

# Vite React Flow Template

This template creates a very basic [React Flow](https://reactflow.dev) app with [Vite](https://vite.dev).

## Get it!

```sh
npx degit xyflow/vite-react-flow-template app-name
```

## Installation

```sh
npm run install
```

## Development

```sh
npm run dev
```

## Build

```sh
npm run build
```
