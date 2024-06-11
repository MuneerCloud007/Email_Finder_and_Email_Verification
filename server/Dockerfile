# Use Puppeteer's official Docker image as the base image
FROM ghcr.io/puppeteer/puppeteer:19.7.2

# Set environment variables to use the bundled Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application to the working directory
COPY . .

# Specify the command to run your application
CMD [ "node", "index.js" ]
