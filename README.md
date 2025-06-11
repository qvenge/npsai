## Запуск дев сборки

```bash
npm run dev
```

## Деплой

Установить env переменные, либо в файле .env либо еще как
```
AUTH_SECRET=твой_ключ (генерируй через openssl rand -base64 32)
AUTH_TRUST_HOST=true
NEXT_PUBLIC_API_HOST=http://194.226.121.220:8020
NEXT_PUBLIC_SUPPORT_LINK=https://t.me/support
```

Установка deps, собрка, запуск:
```bash
npm install
npm run build
npm run start
```