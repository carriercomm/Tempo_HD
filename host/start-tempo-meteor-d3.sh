#!/bin/bash

DIRNAME=$(dirname $0)
BUILDNUMBERFILE=jenkins-build-number.txt

# If a command-line argument was passed in
if [ $1 ]
then
    echo "Start TAG: $1"
    TAG=$1
else
    if [ -e ${DIRNAME}/${BUILDNUMBERFILE} ]
    then
        # manually set the start tag
        TAG=$(cat ${DIRNAME}/${BUILDNUMBERFILE})
        echo "Use Jenkins Build TAG: ${TAG}"
    else
        # manually set the start tag
        TAG=1.0
        echo "Use hardcoded start TAG: ${TAG}"
    fi
fi

NAME=tempo-meteor-d3
DOCKER_REPO=docker-registry.ems.homedepot.com
IMAGE=${DOCKER_REPO}/${NAME}:${TAG}

# 
# Start or Run docker container
#
if a=$( docker ps -a | grep $NAME )
then
    cmd="docker start $NAME"
    echo $cmd
    $cmd
    exit 0
fi


cmd="docker run -d \
    --restart=always \
    --volume /etc/localtime:/etc/localtime:ro \
    --publish 3000:3000 \
    --name $NAME \
    ${IMAGE}"
# to help debug
echo $cmd
$cmd
