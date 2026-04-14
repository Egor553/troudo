FROM node:22-alpine

# Install openssl for Prisma
RUN apk add --no-cache openssl netcat-openbsd

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema first for generation
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Expose backend port
EXPOSE 5000

# Copy and prepare entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
