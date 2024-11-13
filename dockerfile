# Use the official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy application source code
COPY . .

# Build the application
RUN yarn build

# Expose the port
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start"]
