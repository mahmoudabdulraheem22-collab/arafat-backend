FROM oven/bun:1

WORKDIR /app

# 1. تثبيت جميع المكتبات بما فيها أدوات البناء (بدون flag --production)
COPY package*.json bun.lock* ./
RUN bun install

# 2. نسخ بقية أسطر المشروع
COPY . .

# 3. تجميع مشروع Vite والسيرفر لإنشاء مجلد dist/server.cjs
RUN bun run build

EXPOSE 8080

# 4. تشغيل السيرفر
CMD ["bun", "run", "start"]
