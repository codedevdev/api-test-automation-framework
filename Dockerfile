FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV CI=true
ENV BOOKER_BASE_URL=https://restful-booker.herokuapp.com
ENV FAKE_API_BASE_URL=https://fakerestapi.azurewebsites.net
ENV BOOKER_USERNAME=admin
ENV BOOKER_PASSWORD=password123
ENV API_TIMEOUT=15000
ENV LOG_LEVEL=info

CMD ["npm", "run", "test:ci"]
