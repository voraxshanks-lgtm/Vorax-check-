# VORAX WHATSAPP CHECKER V2

Site public sans inscription, sans connexion et sans comptes utilisateurs.

## Lancer en local
1. Installer Node.js 18 ou plus récent.
2. Ouvrir un terminal dans ce dossier.
3. Exécuter `npm install`.
4. Exécuter `npm start`.
5. Ouvrir `http://localhost:3000`.

## Déployer sur Render
- Créer un service **Web Service** et connecter le dépôt GitHub.
- Runtime : Node.
- Build Command : `npm install`
- Start Command : `npm start`
- Render fournit automatiquement la variable `PORT`.

## Limite importante
Le site valide le format du numéro et affiche **IMPOSSIBLE À VÉRIFIER** pour le statut de bannissement.
WhatsApp/Meta ne fournit pas d'API publique officielle permettant de vérifier si n'importe quel numéro personnel est banni. Le site ne prétend donc jamais connaître un statut qu'il ne peut pas obtenir.

Il n'y a pas de limite de nombre d'utilisateurs ni de création de comptes. Une petite limite anti-abus par adresse IP protège seulement le serveur contre les rafales de requêtes.
