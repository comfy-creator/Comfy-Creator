# Custom Nodes README

This readme provides instructions for authors of custom nodes on how to build their application using the compiler tools.

## Architecture
To make the custom nodes work, you need to build the package as a window/global variable. It is important to note that custom nodes should not make use of node_modules while building their package, especially when it comes to React. Including React in the custom nodes bundle can lead to conflicts with the React instance used in the Graph-Editor. Instead, you can access the React application through the window variable (`window.React`). Similarly, if you want to use "@xyflow/react" (`window.React`) in your custom nodes, you can access it through the window object as well. 


## Webpack

Webpack is currently the only compiler tool that is working. Check the `webpack-example` folder for more information on how to configure and use Webpack.


## Parcel and Rollup

Currently, Parcel and Rollup are not working. However, I am actively working on making them functional. I will update this readme as soon as they are ready to use.

Thank you for your understanding.
