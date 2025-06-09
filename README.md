## Запуск дев сборки

```bash
npm run dev
```

## Деплой

Установить env переменные, либо в файле .env либо еще как
```
AUTH_SECRET=твой_ключ (генерируй через openssl rand -base64 32)
AUTH_TRUST_HOST=true
```

Установка deps, собрка, запуск:
```bash
npm install
npm run build
npm run start
```