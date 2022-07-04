# inventory-management

A simple QR-Code and web based inventory system to help keeping track off stuff. Not done yet!

## Run as docker container

docker build . -t lopfi/inventory-management
docker run -d -p 3000:3000 --name inventory-management -v ./db:/db lopfi/inventory-management
