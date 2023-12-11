# Use Node.js LTS as the base image
FROM node:16

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "start:prod"]

