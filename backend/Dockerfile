# Use Node.js 22 LTS
FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose backend port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]