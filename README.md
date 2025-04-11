
```markdown
# Medical Frontend Application

![Project Banner](https://via.placeholder.com/1200x400?text=Medical+Management+System)

Application frontend pour la gestion des dossiers médicaux des patients avec tableau de bord, gestion des examens et génération de rapports.

## 🚀 Fonctionnalités

- **Gestion des patients** : Création, visualisation et modification des profils patients
- **Examens médicaux** : Suivi des examens sanguins et urinaires
- **Tableau de bord** : Vue d'ensemble des indicateurs clés
- **Rapports PDF** : Génération de rapports médicaux professionnels
- **Thème clair/sombre** : Interface adaptable aux préférences visuelles

## 🛠 Technologies utilisées

![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-06B6D4?logo=tailwind-css)
![Next-Themes](https://img.shields.io/badge/Next--Themes-0.2-lightgrey)
![React-Icons](https://img.shields.io/badge/React--Icons-4.10-red)

## 📦 Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/Medmana/FrontHack.git
   cd FrontHack
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configurer les variables d'environnement**
   Créer un fichier `.env.local` à la racine :
   ```env
   NEXT_PUBLIC_API_URL=https://votre-api-backend.com
   NEXT_PUBLIC_APP_ENV=development
   ```

4. **Lancer l'application**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

## 🏗 Structure du projet

```
medical-frontend/
├── public/              # Assets statiques
├── src/
│   ├── components/      # Composants réutilisables
│   ├── hooks/           # Hooks personnalisés
│   ├── pages/           # Routes de l'application
│   ├── styles/          # Fichiers CSS globaux
│   ├── types/           # Définitions TypeScript
│   ├── utils/           # Fonctions utilitaires
│   └── lib/             # Bibliothèques externes configurées
├── next.config.js       # Configuration Next.js
├── tailwind.config.js   # Configuration Tailwind
└── tsconfig.json        # Configuration TypeScript
```

## 🌈 Thèmes

L'application supporte le mode clair/sombre grâce à `next-themes` :

```tsx
import { ThemeProvider } from 'next-themes'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
```

## 📄 Génération des PDF

La génération de rapports PDF s'appuie sur le backend. Exemple de requête :

```ts
const generateReport = async (patientId: string) => {
  const response = await fetch(`/api/patients/${patientId}/report`);
  const blob = await response.blob();
  // Téléchargement du PDF...
};
```

## 🤝 Contribution

1. Forker le projet
2. Créer une branche (`git checkout -b feature/ma-nouvelle-fonctionnalite`)
3. Commiter vos changements (`git commit -m 'Ajout d'une super fonctionnalité'`)
4. Pousser vers la branche (`git push origin feature/ma-nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

