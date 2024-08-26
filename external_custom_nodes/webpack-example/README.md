# Building Custom Node Application with Webpack and Babel

This guide will walk you through the process of building a custom Node application using Webpack and Babel. By following these steps, you will be able to bundle your application and export a function as a window variable.

## Installation

1. Open the `package.json` file in your application.
2. Add the required packages for Webpack and Babel. (check this folder package.json for reference)
3. Run `npm install` to install the packages.

## Webpack Configuration

1. Create a Webpack configuration file in your project directory.
2. Adjust the configuration to suit your needs. You can refer to the configuration file in this folder for reference.
3. Create a babel config file (e.g babel.config.json in this folder) and add the presets.
4. Specify the entry point of your application in the Webpack config.
5. Configure the output to export the main function as a window variable. To do this, set the `libraryTarget` option to `'window'` in the Webpack config file. Additionally, specify any external packages that should be obtained from the window variable by adding them to the `externals` section in the `webpack.config.json` file.

## Building Your Application

1. Run the Webpack build command to bundle your application.
2. Check the `example-build.js` file in this folder for an example of the build result.
3. Make any necessary adjustments to the build configuration to match your application.

By following these steps, you will be able to successfully build your custom Node application using Webpack and Babel.
