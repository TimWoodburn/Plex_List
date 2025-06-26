# frontend/Dockerfile
FROM node:20-alpine

# Create working directory
WORKDIR /app

# Copy package.json and lock
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Expose Vite's port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]
