# Use an official Node.js image as the base image
FROM node:16.20.1-alpine as base

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files and install dependencies
COPY package*.json yarn.lock ./
RUN yarn

# ---------- Build Stage ----------
FROM base as build

# Copy the rest of your application code
COPY . .

# Build your Nest.js application
RUN yarn build

# ---------- Final Stage ----------
FROM base as final

# Copy the built application from the build stage
COPY --chown=node:node . .
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env.development ./.env


# Expose the port your Nest.js application will run on

EXPOSE 9201
# Start your Nest.js application
CMD ["yarn", "start:prod"]

# Build script
# docker build -t nanoimg --no-cache .
