# --- Etapa 1: build da aplicação React com Vite ---
FROM node:20-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# URL da API principal usada em tempo de build (pode ser sobrescrita com --build-arg)
ARG VITE_API_BASE_URL=http://localhost:5000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# --- Etapa 2: serve os arquivos estáticos com Nginx ---
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
