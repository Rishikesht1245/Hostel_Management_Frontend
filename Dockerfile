# Use LTS version of Node.js
FROM node:lts-alpine as build-stage

# Set environment variables
ENV VITE_API_URL='https://api.hostel4u.xyz/api/v1' \
    VITE_BACKEND_CHAT='ws://api.hostel4u.xyz' \
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

# Use Caddy to serve the React app
FROM caddy:alpine

# Copy built app from build stage
COPY --from=build-stage /app/dist /usr/share/caddy

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Expose port 80
EXPOSE 80
EXPOSE 443

# Command to run Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
