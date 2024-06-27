# Use the official Node.js image
FROM node:20-alpine

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight web server to serve the app
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the web server
CMD ["npm", "start"]
