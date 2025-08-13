#!/bin/bash
# Alternative startup script using serve package
# Build the application
npx webpack --mode production

# Start the production server using serve
serve -s build -l 5000 --host 0.0.0.0