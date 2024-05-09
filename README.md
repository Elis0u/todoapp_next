# TODOAPP
***
L'application todoapp a été conçue pour découvrir NextJS 14 suivant le page router et les autres technologies utilisées.
C'est une todo app simple avec la possibilité d'ajouter des tâches, les editer, les supprimer et les notifier comme acquis.
Mise en place d'un système d'authentification simple.

## Technologies
- NextJS 14
- Next auth
- MongoDb
- Tailwind

## Lancement de projet

Après avoir télécharger le projet :

```bash
npm install
```
Et pour lancer le projet
```bash
npm run dev
```

Il faudra d'abord créer un fichier `.env` (voir le .env.template), voici un exemple :

```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_URL_INTERNAL=http://127.0.0.1:3000
MONGO_URL= créer un service mongo et inserer le lien compass
SALT_ROUND=12
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET= generer un secret
```

Ouvrez [http://localhost:3000](http://localhost:3000) sur le net and enjoy !


