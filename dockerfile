# Use the official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files for dependency installation
COPY package.json ./

# Copy the entire project (excluding items in .dockerignore)
COPY . .

# Install dependencies
RUN yarn install

# Build the Next.js app
RUN yarn build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
