#!/bin/bash

sudo docker run -d \
-p 19222:19222 \
--name m5-flow \
-v $PWD/flow.conf:/etc/nginx/conf.d/nginx-ide.conf \
-v $PWD/dist/M5Flow:/M5Flow/dist \
nginx