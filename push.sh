#!/bin/sh

# If a command-line argument was passed in
if [ $1 ]
then
    echo "Push TAG: $1"
    TAG=$1
else
    # manually set the build tag
    echo "Use hardcoded push TAG"
    TAG=2.1
fi

DOCKER_REPO=docker-registry.ems.homedepot.com
NAME=tempo-meteor-d3
IMAGE=${DOCKER_REPO}/${NAME}:${TAG}

echo "--> Image name: ${IMAGE}"

docker push ${IMAGE} 
