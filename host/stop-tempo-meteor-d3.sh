#!/bin/bash

for id in $(docker ps -a | grep tempo-meteor-d3 | awk '{print $1}')
do
    name=$(docker inspect $id | grep Name | awk -F: '{print $2}' | tr -d '", ')
    echo "--> Stopping container $name"
    docker stop $id
    #sleep 1

    if [ "x$1" == "xdelete" ]
    then
        echo "--> Removing container $name"
        docker rm $id
        #sleep 1
    fi
done
