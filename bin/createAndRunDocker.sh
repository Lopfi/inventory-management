#!/bin/bash

cd ../client
npm run build
cd ..
docker build . -t lopfi/inventory-management
docker run -p 3000:3000 -d lopfi/inventory-management --name inventory-management