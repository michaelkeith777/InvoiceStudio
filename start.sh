#!/bin/bash
# Build the application
npx webpack --mode production

# Start the production server using Node.js/Express
node server.js