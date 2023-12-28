# Use an official Node runtime as a parent image
FROM node:18.5

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle your app's source code inside the Docker image
COPY . .

# Make port 9091 available to the world outside this container
EXPOSE 9091

# Define the command to run your app
CMD [ "node", "app.js" ]
