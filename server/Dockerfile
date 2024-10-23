FROM node

# ENV
ENV NODE_ENV production

# 使用淘宝 NPM 镜像（国内机器构建推荐启用）
# RUN npm config set registry https://registry.npm.taobao.org/

RUN rm -rf /app

ADD ./dist /app

WORKDIR /app

# move
RUN npm install --only=production

# INSTALL
RUN npm install -g pm2 --only=production

# clean
RUN npm prune --production

EXPOSE 3000

WORKDIR /app
CMD ["pm2-runtime","start","ecosystem.config.js"]
#CMD nohup node WorldServerMain.js > world_log.txt &
#CMD node MasterServerMain.js
#CMD ["node","WorldServerMain.js SID=2"]