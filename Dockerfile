# Use Node.js LTS as the base image
FROM node:20

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Copy package.json and package-lock.json to the working directory
COPY package*.json /usr/src/app/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . /usr/src/app

RUN npm run generate

# Expose the port your app runs on
EXPOSE 3000

# Start the application in development mode
# CMD ["ls && ls ./src"]
CMD ["npm", "run", "start:prod"]

