# Use the official Node.js image as a base
FROM node:16

# Install necessary packages
RUN apt-get update \
  && apt-get install -y wget gnupg \
  && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable \
  --no-install-recommends \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Set environment variables to skip the download of Chromium and specify the Chrome executable path
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

# Expose port if your application listens on a specific port
EXPOSE 3000

# Specify the command to run your application
CMD [ "node", "index.js" ]
