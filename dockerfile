# Etapa de desarrollo
FROM node:18-alpine AS dev

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración para la instalación de dependencias
COPY package.json yarn.lock ./

# Instalar las dependencias
RUN yarn install --frozen-lockfile

# Copiar el resto del código del proyecto
COPY . .

# Exponer el puerto 4000
EXPOSE 4000

# Comando para iniciar Next.js en modo desarrollo en el puerto 4000
CMD ["yarn", "dev", "-p", "4000"]
