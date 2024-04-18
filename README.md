### Comfy-Graph-Editor

This is a rewrite of ComfyUI. We changed the following:

- We replaced LiteGraph.js with React Flow; this is a more modern library with many more features and a better dev-experience
- We redesigned graph-logic to allow for loops and conditional branching. This will be used to create Agentic Systems in the future, similar to LangGraph.
- We redesigned the frontend to make it visually similar to Unreal Engine Blueprints.
- We store every graph as a Yjs doc, which enables multiple-users to collaboratively edit the same graph, and allows for efficiently streaming the results of real-time media generation.
- We redesigned server <-> client communication to be standardized and less ad-hoc.
- We changed the License from GPL-3 to a proprietary license.

### Usage:

- (write this later)

## Dev Notes:

### State Management:

First we create a yDoc, like `const ydoc = new Doc()`; this is stored outside of React, in client-memory. Then, we create a YJS provider, which establishes a websocket connection to our Yjs server; we will (1) send diffs that are applied to our local yDoc to this server, and (2) receive diffs from this server, and apply them to our local yDoc. This syncronizes state remotely.

In Zustand, we obtain a reference to this yDoc, like `nodesMap = ydoc.getMap<Node>('nodes')`. First, we subscribe to the Yjs Provider; when a state, such as nodesMap, changes, we apply this directly to our nodes, like `setNodes(Array.from(nodesMap.values())`. This updates our Zustand state `nodes`, which will propagate throughtout the rest of the app.

Next, we create a wrapper, around `setNodes()`, which will be used by ReactFlow. When any logic in our app calls `setNodes()`, we will also apply these changes to our yDoc. We also modify our `onNodesChanges` to similarly take changes that ReactFlow is proposing and apply them to our yDoc as well.

ReactFlow uses (1) `nodes` as the source of truth for state, (2) it uses `onNodesChange` as a handler called when it wants to apply state-changes to the graph. This allows us to implement our own custom logic to the state-changes. ReactFlow does not use `setNodes` directly to change state; it expects us to do that in reseponse to its events.

This is how state is propagated throughtout our app.
