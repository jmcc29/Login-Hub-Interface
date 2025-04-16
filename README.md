# Despliegue con docker

### PASO 1
clonar el repositorio e ingresar a la misma

### PASO 2
construir la imagen con:
```
docker build --no-cache -t login-hub-frontend .
```
### PASO 3
```
docker run -d -p 3001:3001 login-hub-frontend
```
# Despliegue sin docker

### PASO 1
clonar el repositorio e ingresar a la misma

### PASO 2
instalar las dependencias con:
```
pnpm install
```
### PASO 3
ejecutar en ambiente de desarrollo
```
pnpm dev
```

### PASO 0
ejecutar en ambiente de producción
```
pnpm build
pnpm start
```