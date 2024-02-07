# Используем базовый образ Node.js
FROM node:16

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json в контейнер
COPY package*.json ./

RUN npm ci --verbose --no-audit

# Копируем остальные файлы проекта в контейнер
COPY tsconfig.json ./
COPY src ./src/

RUN npm run build

EXPOSE 3000

# Устанавливаем команду, которая будет выполняться при запуске контейнера
CMD [ "npm", "start" ]