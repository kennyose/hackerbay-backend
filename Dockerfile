# use the alpine image 
FROM node:8.11.4-alpine

# set the work directory
WORKDIR /usr/src/app

# copy files to WORKDIR
ADD . /usr/src/app

# install alpine dependencies [ git]
RUN apk add --update git
RUN npm i npm@latest -g

# expose the port 8080
EXPOSE 8080

# execute the `npm start` command on a CLI
CMD ["npm", "start"]