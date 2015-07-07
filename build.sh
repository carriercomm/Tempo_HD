#!/bin/sh

# If a command-line argument was passed in
if [ $1 ]
then
    echo "Build TAG: $1"
    TAG=$1
else
    # manually set the build tag
    echo "Use hardcoded build TAG"
    TAG=2.0
fi

DOCKER_REPO=docker-registry.ems.homedepot.com
NAME=tempo-meteor-d3
IMAGE=${DOCKER_REPO}/${NAME}:${TAG}

echo "--> Image name: ${IMAGE}"

docker build -t ${IMAGE} .
