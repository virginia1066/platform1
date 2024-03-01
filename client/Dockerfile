# Используем базовый образ Node.js
FROM node:18-alpine as builder

ARG REACT_APP_TG_BOT_NAME
ARG REACT_APP_TG_MK_ADMIN_USER

ENV REACT_APP_TG_BOT_NAME=$REACT_APP_TG_BOT_NAME
ENV REACT_APP_TG_MK_ADMIN_USER=$REACT_APP_TG_MK_ADMIN_USER

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json в контейнер
COPY package*.json ./

RUN npm ci --verbose --no-audit

# Копируем остальные файлы проекта в контейнер
COPY tsconfig.json ./
COPY src ./src/
COPY scripts ./scripts/
COPY scripts ./scripts/
COPY public ./public/
COPY config ./config/

RUN npm run build

# Stage 2: Запустить Nginx и использовать собранные файлы React
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
# Копировать собранные файлы React из предыдущего этапа в Nginx
COPY --from=builder /app/build /usr/share/nginx/html/web-app

# Указать порт, который будет использоваться во время выполнения контейнера
EXPOSE 80

# Команда для запуска Nginx при запуске контейнера
CMD ["nginx", "-g", "daemon off;"]