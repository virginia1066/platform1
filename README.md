# Описание проектов

## Bakend

### Системные требования:
* VPS с виртуализацией и поддержкой работы docker
* Ubuntu 22.4+
* Минимум 2Gb оперативной памяти
* 1 CPU 3+ГГц
* 20GB места на диске (SSD)

### Установка docker:

Проверить наличие docker и docker-compose можно так:
```shell
docker -v
docker-compose -v
```
Если версии вывелись, то устанавливать docker не надо.

```shell
# Установка зависимостей
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common

# Добавление официального GPG-ключа Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Добавление репозитория Docker
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установка Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Добавление текущего пользователя в группу docker
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Перезапуск службы Docker
sudo systemctl restart docker
```

Сервер настроен таким образом (firewall), что принимает запросы только от CloudFlare
https://habr.com/ru/articles/414837
Для адаптации этого к docker надо `INPUT` заменить на `FORWARD`:
```bash 
iptables -A FORWARD  1 -p tcp -m multiport --dports 80,443 -j DROP
```

### Запуск контейнеров

Необходимо задать переменные окружения
* TG_TOKEN - АПИ токен телеграм бота (можно посмотреть у @BotFather)
* CLASS_RPS - ограничение rps (запросов в секунду) АПИ мой класс
* DB_PASS - пароль от BD
* DB_USER - имя пользователя BD
* DB_HOST - ip адрес сервера с BD
* DB_PORT - порт по которому доступна BD
* SERVER_PORT - Порт на котором будет запускаться сервер
* DB_MAX_CONNECTIONS - Максимальное количество коннекшенов с BD
* MY_CLASS_API_KEY - АПИ ключ для работсы с мой класс
* DEBUG_MODE - Режим включения дополнительных логов (может быть 1 или 0)
* TG_MK_ADMIN_USER - username администратора для связи (без @)
* TG_BOT_NAME - username бота
* GOOGLE_SHEETS_API_KEY - АПИ ключ google sheets
* GOOGLE_SHEETS_ID - id страницы с которой будут браться данные для колод
* LK_SITE_ORIGIN - урл где развёрнут сервер (https://lk.virginiabeowulf.com)
* DEBUG_MODE - для дополнительных логов. Принимает значение 1 и 0
* TG_LINK_ATTRIBUTE_ID - id атрибута в который система прописывает себе ссылку для телеграм
* AMPLITUDE_API_KEY - API ключ для амплитуды (система аналитики)
* SESSION_SECRET - любой набор слов или символов, от этого секрета создаётся и проверяется подпись в сессии внутири webapp
* MIN_NOTIFY_WORDS_COUNT - минимальное количество cлов доступных для повторения для нотификации пользователя
* NOTIFY_REPEAT_TIME - время когда будет запускаться нотификация пользователей о том что у них есть слова для повторения в формате 24:59, время будет выполняться в таймзоне сервера, по умолчанию это гринвич

Для автодеплоя нужно прописать в env github:
* secrets.SERVER_IP - ip адрес сервера на который будет деплоиться
* secrets.SERVER_USERNAME - username под которым будет логиниться на сервер
* secrets.SERVER_PASSWORD - пароль от сервера
* secrets.GIT_TOKEN - гит токен для pull репозитория
* vars.PROJECT_PATH - путь до папки с проектом куда на сервере будет склонирован репозиторий (должен существовать)

В документе google.sheets в котором будут базовые колоды должны быть обязательны 3 столбца **"RU","EN","Disabled"**.
Удалять строки в документе нельзя.

Сервис имеет возможность горизонтального масштабирования.
При горизонтальном масштабировании обязательно учесть количество одновременных подключений к БД (по умолчанию у БД 100 подключений).
Демоны должны быть запущены только на 1 сервере.

Данные секреты можно установить через .env файл или задать в терминале непосредсвенно перед вызовом команды запуска докер

### Сборка

Необходимо перейти в директорию проекта и выполнить команду с переменными окружения (как указано в запуске)
```shell
docker-compose build
```

### Запуск
Необходимо перейти в директорию проекта и далее в папку bakend и затем выплнить команду
Если вы используете .env файл, то надо его создать и запустить:
```shell
docker-compose --env-file {{путь к вашему .env}} up -d
```
Если вы задаёте секреты инлайн:
```shell
TG_TOKEN=... CLASS_RPS=... ... docker-compose up -d
```
