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
### Запуск контейнера с сервером

Необходимо задать переменные окружения
* TG_TOKEN - АПИ токен телеграм бота
* CLASS_RPS - ограничение rps (запросов в секунду) АПИ мой класс
* DB_PASS - пароль от BD
* DB_USER - имя пользователя BD
* DB_HOST - ip адрес сервера с BD
* DB_PORT - порт по которому доступна BD
* SERVER_PORT - Порт на котором будет запускаться сервер
* DB_MAX_CONNECTIONS - Максимальное количество коннекшенов с BD
* MY_CLASS_API_KEY - АПИ ключ для работсы с мой класс
* DEBUG_MODE - Режим включения дополнительных логов запросов к BD (может быть 1 или 0)

Сервис имеет возможность горизонтального масштабирования, при горизонтальном масштабировании учесит количество коннекшенов к БД (по умолчанию у БД 100 коннекшенов)

Данные секреты можно установить через .env файл или задать в терминале непосредсвенно перед вызовом команды запуска докер

### Сборка

Необходимо перейти в директорию проекта и далее в папку bakend и выполнить команду
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
