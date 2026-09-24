# Guía de Despliegue Rápido (SENA Inducción)

Este proyecto está configurado para desplegarse en **Vercel** en menos de 2 minutos.

## 🚀 Pasos Ultra-Simplificados

1.  **Sube a GitHub:** Crea un repositorio y sube estos archivos.
2.  **Conecta Vercel:** En [Vercel](https://vercel.com), selecciona "Import Project" y elige tu repo.
3.  **Variables de Entorno:** Cuando llegues a la sección "Environment Variables", **copia y pega** el siguiente bloque completo (Vercel permite pegar todo de una vez):

```env
VITE_FIREBASE_PROJECT_ID="confident-ally-6xjsq"
VITE_FIREBASE_APP_ID="1:65007191778:web:980b27ee29a4c0729280bb"
VITE_FIREBASE_API_KEY="AIzaSyCTi4hA6HEKFKxfLaf5Yx6D0ZkIpo2zzyY"
VITE_FIREBASE_AUTH_DOMAIN="confident-ally-6xjsq.firebaseapp.com"
VITE_FIREBASE_DATABASE_ID="ai-studio-guagamificadadei-7c087762-caf9-4bc8-bc03-0cf3042c5a30"
VITE_FIREBASE_STORAGE_BUCKET="confident-ally-6xjsq.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="65007191778"
```

4.  **Listo:** Haz clic en **Deploy** y tu app estará en línea.

---
*Nota: No necesitas configurar nada más, el archivo `vercel.json` ya se encarga de que todo funcione perfectamente.*
