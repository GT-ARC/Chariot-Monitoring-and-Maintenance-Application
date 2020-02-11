# base image
FROM tiangolo/node-frontend:10 as build-stage

# install chrome for protractor tests
RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH


# install and cache app dependencies
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
RUN npm install
RUN npm install -g @angular/cli
RUN npm uninstall @angular-devkit/build-angular
RUN npm install @angular-devkit/build-angular

# add app
COPY . /usr/src/app

# start app
#CMD ng serve --disableHostCheck --host 0.0.0.0
RUN ng build
#RUN node --max_old_space_size=4096 node_modules/.bin/ng build --prod --verbose true

FROM nginx:1.15

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf
