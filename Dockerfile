FROM node:latest
LABEL maintainer="greengoals@gmail.com"

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./
COPY scripts ./scripts

# Add the scripts directory to the PATH
ENV PATH="/usr/src/app/scripts:${PATH}"

RUN apt-get update && apt-get install -y netcat-openbsd \
    && npm install \
    && npx --package typescript tsc --init \
    && chmod -R +x /usr/src/app/scripts

# Copy local code to the container image.
COPY . .

# Expose port 3000 to the Docker host, so we can access it
# from the outside.
EXPOSE 3000

# Run the web service on container startup.
CMD ["sh", "./scripts/commands.sh"]