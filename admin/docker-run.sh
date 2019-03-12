sudo docker run -d \
--name m5stack-admin \
-p 9809:9809 \
-v $PWD/nginx.conf:/etc/nginx/conf.d/nginx.conf \
-v $PWD/dist/m5stack-admin:/home/m5stack-admin \
nginx