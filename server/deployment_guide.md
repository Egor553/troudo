# 🚀 Troudo API: Инструкци по деплою на Ubuntu

Эта инструкция поможет тебе развернуть бэкенд на сервере Yandex Cloud.

## 1. Подготовка сервера (Ubuntu)

Выполните эти команды в терминале сервера:

```bash
# Обновляем пакеты
sudo apt update && sudo apt upgrade -y

# Устанавливаем Node.js (версия 20+)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Устанавливаем PM2 глобально
sudo npm install -g pm2
```

## 2. Загрузка проекта

Если проекта еще нет на сервере:
```bash
git clone https://github.com/Egor553/troudo.git
cd troudo/server
```
Если проект уже там — обновите его:
```bash
cd troudo/server
git pull
```

## 3. Установка и настройка

```bash
# Устанавливаем зависимости
npm install

# Генерируем клиент Prisma
npx prisma generate

# Запускаем миграции базы данных (если БД уже создана в Yandex Cloud)
# npx prisma migrate deploy

# Создаем файл .env и вставляем туда свои ключи
nano .env
```
> [!IMPORTANT]
> После открытия `nano .env`, вставь все переменные окружения (JWT_SECRET, DATABASE_URL, YOOKASSA_SHOP_ID и т.д.) и нажми `Ctrl+O`, `Enter`, `Ctrl+X`.

## 4. Запуск приложения через PM2

Приложение будет запущено в кластерном режиме (на всех ядрах процессора).

```bash
# Запуск через конфиг
pm2 start ecosystem.config.js

# Чтобы приложение само запускалось после перезагрузки сервера:
pm2 save
pm2 startup
# (Скопируй и выполни команду, которую выведет терминал выше)
```

## 5. Полезные команды PM2

- `pm2 status` — проверить, работает ли сервер.
- `pm2 logs troudo-api` — смотреть логи в реальном времени.
- `pm2 restart troudo-api` — перезагрузить сервер (например, после обновления кода).
- `pm2 stop troudo-api` — остановить сервер.

---
**Troudo API теперь доступен на порту 3000!** (Не забудь открыть порт 3000 в настройках безопасности Yandex Cloud).

## 6. Сборка Frontend

```bash
cd /home/tokarev/troudo
npm install
npm run build
```
Собранные файлы появятся в папке `dist`.

## 7. Настройка Nginx

```bash
# Устанавливаем Nginx
sudo apt install nginx -y

# Копируем наш конфиг в папку Nginx
sudo cp nginx.conf /etc/nginx/sites-available/troudo

# Активируем конфиг
sudo ln -s /etc/nginx/sites-available/troudo /etc/nginx/sites-enabled/

# Проверяем конфиг на ошибки
sudo nginx -t

# Перезапускаем Nginx
sudo systemctl restart nginx
```

## 8. Важно: Права доступа
Чтобы Nginx мог читать файлы в твоей домашней папке:
```bash
chmod 755 /home/tokarev
```
