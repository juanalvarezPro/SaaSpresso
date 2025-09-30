# 📋 Scripts de Gestión de Planes de MercadoPago

Este directorio contiene scripts para gestionar los planes de suscripción de MercadoPago de manera fácil y automatizada.

## 🚀 Comandos Disponibles

### 1. Listar Planes Existentes
```bash
npm run plans:list
```
- Muestra todos los planes que tienes en MercadoPago
- Genera automáticamente las constantes para tu código
- Te da los IDs de los planes para usar en otros scripts

### 2. Crear Planes Estándar
```bash
npm run plans:create:standard
```
- Crea los 4 planes estándar de SaaS (Pro/Business x Mensual/Anual)
- Usa la configuración de `lib/mercadopago-plans-constants.ts`

### 3. Crear Plan Personalizado
```bash
npm run plans:create "Nombre del Plan" 25 USD 1 months 12
```
Parámetros:
- `nombre`: Nombre del plan (requerido)
- `monto`: Precio del plan (requerido)
- `moneda`: USD, COP, ARS, etc. (opcional, default: USD)
- `frecuencia`: Cada cuántos períodos (opcional, default: 1)
- `tipo_frecuencia`: days, weeks, months (opcional, default: months)
- `repeticiones`: Número de repeticiones, null = ilimitado (opcional, default: null)

### 4. Gestionar Planes Existentes
```bash
npm run plans:manage <acción> <plan_id>
```

Acciones disponibles:
- `pause <plan_id>` - Pausar un plan
- `activate <plan_id>` - Activar un plan
- `cancel <plan_id>` - Cancelar un plan
- `details <plan_id>` - Ver detalles de un plan
- `help` - Mostrar ayuda

Ejemplos:
```bash
# Pausar un plan usando ID completo
npm run plans:manage pause 2c9380848c8c8c8c8c8c8c8c8c8c8c8c

# Activar un plan usando clave de constantes
npm run plans:manage activate pro_monthly

# Ver detalles de un plan
npm run plans:manage details business_yearly
```

## 📁 Archivos Importantes

### `lib/mercadopago-plans-constants.ts`
- Contiene las constantes de tus planes existentes
- Se actualiza automáticamente cuando ejecutas `npm run plans:list`
- Configuración de planes estándar para crear nuevos

### `scripts/list-plans.ts`
- Script para listar todos los planes
- Genera automáticamente las constantes

### `scripts/create-plans.ts`
- Script para crear planes nuevos
- Soporta planes estándar y personalizados

### `scripts/manage-plans.ts`
- Script para gestionar planes existentes
- Pausar, activar, cancelar, ver detalles

## 🔄 Flujo de Trabajo Recomendado

1. **Primera vez**: Ejecuta `npm run plans:list` para ver qué planes tienes
2. **Crear nuevos**: Usa `npm run plans:create:standard` o `npm run plans:create`
3. **Gestionar**: Usa `npm run plans:manage` para pausar/activar/cancelar
4. **Actualizar constantes**: Ejecuta `npm run plans:list` después de cambios

## ⚠️ Notas Importantes

- Los planes **NO se pueden eliminar** en MercadoPago, solo se pueden **cancelar**
- Los planes cancelados no se pueden reactivar
- Los planes pausados se pueden reactivar
- Siempre ejecuta `npm run plans:list` después de hacer cambios para actualizar las constantes

## 🛠️ Instalación

Si es la primera vez que usas estos scripts, instala las dependencias:

```bash
npm install
```

## 🔧 Configuración

Asegúrate de tener configurado tu `MERCADOPAGO_ACCESS_TOKEN` en tu archivo `.env`:

```env
MERCADOPAGO_ACCESS_TOKEN=tu_token_aqui
```
