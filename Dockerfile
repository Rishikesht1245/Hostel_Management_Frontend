# Use LTS version of Node.js
FROM node:lts-alpine as build-stage

# Set environment variables
ENV VITE_API_URL='http://13.53.190.180:3000/api/v1' \
    VITE_BACKEND_CHAT='ws://13.53.190.180:3000' \
    VITE_RAZORPAY_API_ID='rzp_test_52pMKUsVhUtk2U'

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Use Nginx to serve the React app
FROM nginx:stable-alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 nginx
EXPOSE 80

# Command to run nginx : to run nginx in the foreground.
CMD ["nginx", "-g", "daemon off;"]
