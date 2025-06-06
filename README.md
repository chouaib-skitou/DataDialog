# DataDialog

**DataDialog** est une application de messagerie web moderne facilitant la communication claire grâce à des messages structurés.

---

## 🚀 Fonctionnalités Principales

- **Interface de Chat Intuitive**  
  Expérience utilisateur fluide pour envoyer et recevoir des messages au sein de fils de discussion.

- **Messages Structurés**  
  Possibilité d'envoyer des données complexes (ex. offres de stage, commandes, questions Oui/Non) via des schémas prédéfinis.

- **Schémas Noyau & Extensions**  
  - **Schéma Noyau** : Types de base (case à cocher, question binaire, etc.).  
  - **Schémas d’Extension** : Ajoutez facilement de nouveaux schémas métier (stage, réservation, pizza, etc.).

- **Organisation en Fils de Discussion**  
  Groupez les conversations par fils, avec plusieurs participants, pour un suivi plus simple.

- **Navigation Claire**  
  - Page d'accueil avec présentation du projet.  
  - Page de chat dédiée pour l'interface de messagerie.

---

## 📂 Structure du Projet

```
/
├── app/                      # (PRINCIPAL) Next.js App Router
│   ├── chat/
│   │   └── page.tsx          # Page principale du chat
│   ├── globals.css           # Styles globaux (import Tailwind)
│   ├── layout.tsx            # Mise en page globale (Navbar, Main, Footer)
│   └── page.tsx              # Page d'accueil
│
├── components/               # (PRINCIPAL) Composants React (Next.js)
│   ├── data-dialog-app.tsx   # Conteneur principal de la messagerie
│   ├── navbar.tsx            # Barre de navigation
│   ├── thread-list.tsx       # Liste des fils de discussion
│   ├── message-area.tsx      # Zone d'affichage et de composition des messages
│   ├── message-item.tsx      # Composant pour chaque message
│   └── message-composer.tsx  # Formulaire pour envoyer un message
│
├── services/                 # (PRINCIPAL) Logique métier et données côté client
│   ├── data-service.ts       # Gestion en mémoire des utilisateurs, fils et messages
│   └── schema-service.ts     # Définitions des schémas (noyau + extensions)
│
├── schema-noyau.json         # Schéma JSON principal (core) utilisé par schema-service
│
├── src/plugins/              # Schémas d’extension (anciens exemples JSON)
│   ├── PizzaOrderPlugin/
│   │   └── schema.json       # Exemple de schéma d’extension pizza
│   ├── RoomBookingPlugin/
│   │   └── schema.json       # Exemple de schéma d’extension réservation
│   └── StageSchemaPlugin/
│       └── schema.json       # Exemple de schéma d’extension stage
│
├── styles/                   # Fichiers CSS (Tailwind, etc.)
│   └── globals.css
│
├── public/                   # Ressources statiques (images, fonts)
│
├── types/                    # Définitions TypeScript partagées
│   └── index.ts
│
├── postcss.config.mjs        # Configuration PostCSS
├── tailwind.config.ts        # Configuration Tailwind CSS
├── next.config.mjs           # Configuration Next.js
├── tsconfig.json             # Configuration TypeScript
└── README.md                 # [Vous êtes ici] Documentation du projet
```

> **⚠️ Note** : Les répertoires `src/` (Vite) et `backend/` datent de versions précédentes et ne sont plus utilisés par la version Next.js active.

---

## 🗂️ Emplacement des Schémas

- **Schéma Noyau** :  
  - Fichier unique : `schema-noyau.json` (à la racine).  
  - Chargé par `services/schema-service.ts` pour définir les annotations de base.

- **Schémas d’Extension** :  
  - Définis directement dans `services/schema-service.ts` (JavaScript).  
  - Dossiers exemples (non utilisés) : `src/plugins/…/schema.json`.

---

## ⚙️ Installation & Lancement

1. **Cloner le dépôt**  
   ```bash
   git clone https://github.com/chouaib-skitou/DataDialog
   cd DataDialog
   ```

2. **Installer les dépendances**  
   ```bash
   pnpm install
   ```

3. **Démarrer en mode développement**  
   ```bash
   pnpm dev
   ```  
   Rendez-vous sur [http://localhost:3000](http://localhost:3000) pour accéder à l’application.

---

## 📋 Utilisation

1. **Page d'accueil** (`/`)  
   Présentation rapide du projet et accès au chat.

2. **Page de Chat** (`/chat`)  
   - **Liste des fils** : Créez ou sélectionnez un fil de discussion.  
   - **Affichage des messages** : Découvrez l’historique (texte libre + données structurées).  
   - **Composer un message** :  
     - Saisissez du texte libre.  
     - Ajoutez un élément structuré : choisissez un schéma parmi la liste (case, binaire, stage, pizza, etc.), puis remplissez les champs correspondants.  
     - Envoyez le message : il s’enregistre en mémoire (perdu au rafraîchissement).

3. **Création de nouveaux fils**  
   - Cliquez sur « Nouveau fil ».  
   - Entrez un titre et sélectionnez des participants (IDs prédéfinis : `user-alice`, `user-bob`, `user-charlie`).  
   - Validez pour générer un nouveau fil.

---

## ⚠️ Limitations Actuelles

- **Stockage en mémoire** : Toutes les données (utilisateurs, fils, messages) sont perdues au rechargement de la page.  
- **Authentification codée en dur** : L’utilisateur « courant » est fixé à `user-alice`.  
- **Pas de temps réel** : La messagerie reste monodeviculaire et ne synchronise pas entre onglets/clients.

---

## 🙌 Contributions

Vous souhaitez contribuer ?  
1. Forkez ce dépôt.  
2. Créez une branche (`git checkout -b feature/ma-fonctionnalite`).  
3. Commitez vos modifications (`git commit -m 'Ajout d’une nouvelle fonctionnalité'`).  
4. Poussez votre branche (`git push origin feature/ma-fonctionnalite`).  
5. Ouvrez un Pull Request.

---

## 📜 Licence

Ce projet est sous licence MIT. Consultez le fichier [LICENSE](LICENSE) pour plus de détails.
