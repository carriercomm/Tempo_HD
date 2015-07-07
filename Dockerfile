FROM ubuntu:14.04

MAINTAINER David Boardman <david_boardman1@homedepot.com>

RUN mkdir -p /opt/isv

WORKDIR /opt/isv

ADD . /opt/isv

RUN ./scripts/bootstrap.sh 

EXPOSE 3000

WORKDIR /opt/isv/Tempo_HD

CMD ["/usr/local/bin/meteor", "run"]

