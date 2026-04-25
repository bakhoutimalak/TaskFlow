# TP 1 — Next.js : Du CSR au SSR
---

## Q1. Structure React Vite vs Next.js

| Élément | React Vite | Next.js |
|---|---|---|
| Dossier principal | `src/` | `app/` |
| Point d'entrée | `main.tsx`, `App.tsx` | `layout.tsx`, `page.tsx` |
| Routing | `react-router-dom` (dans le code) | Routing par dossiers (file-based) |
| Config | `vite.config.ts` | `next.config.ts` |
| Styles | `globals.css` | `globals.css` |

> **Différence clé :** React utilise le routing via du code, Next.js utilise la structure des dossiers.

---

## Q2. Combien de fichiers pour créer la route `/login` ?

**Next.js → 1 seul fichier suffit :**

```
app/login/page.tsx
```

Avec React Router, il faut :
1. Créer le composant
2. L'importer dans `App.tsx`
3. Ajouter la route manuellement

---

## Q3. Récupération de l'`id` : React vs Next.js

**React (côté client) :**
```tsx
const { id } = useParams();
```

**Next.js (côté serveur) :**
```tsx
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
}
```

> **Différence :** React récupère l'id côté client, Next.js peut le récupérer côté serveur directement.

---

## Q5. Chargement des projets : React SPA vs Next.js

**React SPA :**
```tsx
const [projects, setProjects] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetch('/api/projects')
    .then(res => res.json())
    .then(data => setProjects(data));
}, []);
```

**Next.js (Server Component) :**
```tsx
const res = await fetch('http://localhost:4000/projects');
const projects = await res.json();
```

> Le code Next.js est **beaucoup plus simple** : pas de `useState`, pas de `useEffect`.

---

## Q6. Voit-on la requête GET `/projects` dans l'onglet Network ?

**Non.**

La requête est faite **côté serveur** par Next.js. Le navigateur reçoit directement le HTML **déjà rempli** avec les données. Aucune requête réseau n'est visible depuis le client.

---

## Q7. Pourquoi `'use client'` dans Login et pas dans Dashboard ?

| Page | Directive | Raison |
|---|---|---|
| `Login` | `'use client'` | Utilise `useState`, `onChange`, `onSubmit` → interactivité côté client requise |
| `Dashboard` | *(aucune)* | Affiche seulement des données récupérées côté serveur → reste Server Component |

---

## Q8. Équivalent de `useNavigate()` en Next.js

L'équivalent est `useRouter()` depuis `next/navigation` :

```ts
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/dashboard');
```

---

## Q9. Code source — React SPA

Dans une React SPA, on voit uniquement :

```html
<div id="root"></div>
```

Les noms des projets **ne sont pas** dans le HTML initial car le contenu est généré **côté client** par JavaScript après le chargement.

---

## Q10. Code source — Next.js (SSR)

Avec Next.js, le HTML est **déjà rempli** au chargement. Les noms des projets **apparaissent directement** dans le HTML source.

> C'est la **preuve du SSR** : le serveur génère le HTML complet avant de l'envoyer au navigateur.

---

## Q11. Header persistant en React Router

En React Router, on plaçait le `Header` dans un composant **parent commun**, souvent dans `App.tsx` ou dans un layout global, pour qu'il reste affiché pendant toute la navigation.

---

## Q12. Layout spécifique Dashboard

Créer le fichier :

```
app/dashboard/layout.tsx
```

Ce layout sera **automatiquement appliqué** à toutes les pages du dossier `dashboard/`.

---

## Q13. Un Server Component peut-il utiliser `onClick` ?

**Non.**

`onClick` nécessite JavaScript **côté client**, alors qu'un Server Component s'exécute uniquement **côté serveur**. Il faut utiliser `'use client'` pour les composants interactifs.

---

## Q14. Bouton « + Nouveau projet » : transformer toute la page en Client Component ?

**Non.**

Il vaut mieux :
- Garder la page `Dashboard` en **Server Component**
- Ajouter seulement un **petit Client Component** pour le bouton ou le formulaire interactif

> C'est le principe de **composition** dans Next.js : minimiser les Client Components.

---

## Q15. Avantage sécurité du fetch côté serveur

En faisant le fetch côté serveur :

- Le navigateur **ne voit pas** directement l'URL `localhost:4000`
- L'API interne est **masquée** du client
- Les endpoints sont mieux protégés
- On peut **contrôler les accès** côté serveur plus facilement

