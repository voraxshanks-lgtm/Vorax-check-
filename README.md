# VORAX CHECK BAN V2
Render: Build Command `npm install`, Start Command `npm start`, Root Directory vide si les fichiers sont à la racine.

Variables Render:
- INFOBIP_BASE_URL = https://y4geyg.api.infobip.com
- INFOBIP_API_KEY = nouvelle clé secrète Infobip
- ADMIN_TEST_TOKEN = secret long et privé

Routes:
- GET / : interface
- GET /api/health : santé du serveur
- POST /api/check : valide le format, renvoie UNKNOWN faute de preuve de bannissement.
- POST /api/infobip/test : test protégé de l'authentification Infobip via GET /account/1/balance. Envoyer Authorization: Bearer <ADMIN_TEST_TOKEN>.

Le test Infobip vérifie seulement l'accès au compte Infobip, pas le bannissement d'un compte WhatsApp personnel. Aucun numéro vérifié n'est enregistré. Ne jamais publier les clés dans GitHub ou le navigateur.
