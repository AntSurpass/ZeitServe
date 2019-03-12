sudo docker run -d \
--name m5stack-com \
-p 5050:5050 \
-p 5055:5055 \
-v $PWD:/home/m5stack-com \
nodejs-v8 \
/opt/node/bin/node /home/m5stack-com/index.js