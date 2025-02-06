FROM node:16.15.0 AS build

# Copy the rest of the application source code
COPY . .

RUN yarn install

# Build the React app for production
RUN yarn run build

#Serve the React app with Nginx
# Use Nginx to serve the built app
FROM nginx:alpine

# Copy the custom nginx.conf to Nginx's config directory
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the build folder from the build stage to the Nginx container
COPY --from=build /build /usr/share/nginx/html

# Expose port 80 to be accessible externally
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
