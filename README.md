#  TP 2 — Next.js : Server Actions, API Routes & Auth
---

## Q1. En React SPA, que fallait-il faire après un POST ? Et en Next.js ?

**React SPA :**
```tsx
// Après un POST, mise à jour manuelle de l'état
const res = await fetch('/api/projects', { method: 'POST', body: ... });
const newProject = await res.json();
setProjects(prev => [...prev, newProject]); // ou re-fetch
```

**Next.js avec Server Action :**
```tsx
'use server';
// Après l'action
revalidatePath('/dashboard');
```

> La page se **rafraîchit automatiquement** avec les nouvelles données grâce à `revalidatePath`.

---

## Q3. Pourquoi le bouton Supprimer est un `<form>` avec un input hidden et pas un `onClick` ?

Le `Dashboard` est un **Server Component**. Or, un Server Component **ne peut pas utiliser `onClick`** (pas de JavaScript côté client).

Le formulaire permet d'envoyer les données au serveur via une **Server Action**, sans avoir besoin de JavaScript côté client :

```tsx
<form action={deleteProject}>
  <input type="hidden" name="id" value={project.id} />
  <button type="submit">Supprimer</button>
</form>
```

---

## Q4. Test de `http://localhost:3000/api/projects`

On obtient une **réponse JSON** contenant la liste des projets.

> Cela démontre que **Next.js joue maintenant le rôle de backend** grâce aux API Routes.

---

## Q5. Différence entre API Route et Server Action

| Critère | API Route | Server Action |
|---|---|---|
| Accès | Via une URL HTTP (`/api/projects`) | Appelée directement depuis un composant Next.js |
| Usage | Exposer une API publique | Traiter une action interne (formulaire) |
| Clients | Tout client (mobile, externe) | Uniquement l'app Next.js |
| Exemple | `GET /api/projects` | `createProject()` dans un `<form>` |

```
API Route   → endpoint réutilisable par d'autres clients
Server Action → action interne à l'application
```

---

## Q6. Login Next.js vs React SPA : combien de `useState` en moins ?

**React SPA :**
```tsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);
// → 4 useState
```

**Next.js avec Server Action :**
```tsx
const [state, formAction] = useActionState(loginAction, null);
// → 1 useActionState remplace tout
```

> On réduit **fortement** le nombre de `useState` grâce à `useActionState`.

---

## Q7. Cookie session : visible ? Lisible avec `document.cookie` ?

| Question | Réponse |
|---|---|
| Visible dans F12 > Application > Cookies ? |  Oui |
| Lisible via `document.cookie` ? |  Non |

Le cookie est marqué **`HttpOnly`**, ce qui le **protège contre le vol par JavaScript** (attaques XSS).

```
HttpOnly → inaccessible depuis document.cookie
```

---

## Q8. Middleware vs ProtectedRoute React

**React SPA (ProtectedRoute) :**
- Peut afficher **brièvement** le Dashboard avant de rediriger
- La vérification se fait **après** le chargement du composant (côté client)

**Next.js Middleware :**
```ts
// middleware.ts
export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  if (!session) return NextResponse.redirect('/login');
}
```
- La page **ne se charge même pas** si l'utilisateur n'est pas connecté
- Le middleware intercepte la requête **avant la génération du HTML**

>  **Pas de flash de contenu protégé** avec le Middleware Next.js.

---

## Q9. Pourquoi `middleware.ts` est à la racine et pas dans `app/` ?

Parce que le middleware agit au **niveau global** de l'application.

Il doit intercepter les requêtes **avant qu'elles atteignent les routes**. C'est pourquoi il est placé à la **racine du projet**, pas dans `app/`.

```
/
├── middleware.ts   ← racine du projet
├── app/
│   ├── dashboard/
│   └── login/
```

---

## Q10. Le layout lit le cookie avec `cookies()`. En React SPA, comment faisait-on ?

**React SPA :**
```tsx
// Context API, localStorage ou état global
const { user } = useAuth();
// ou
const token = localStorage.getItem('token');
```

**Next.js (Server Component) :**
```tsx
import { cookies } from 'next/headers';

const session = cookies().get('session');
```

> Next.js peut lire le cookie **directement côté serveur**, sans passer par le client.

---

## Q11. Server Actions vs API Routes : lequel utiliser ?

| Cas d'usage | Choix recommandé |
|---|---|
| Formulaire de création de projet dans l'app Next.js |  **Server Action** |
| Application mobile ou externe qui consomme la même API |  **API Route** |

```
Server Action  → actions internes à l'application
API Route      → endpoint réutilisable par d'autres clients
```

---

## Q12. Avantage sécurité : cookies + middleware vs JWT mémoire + ProtectedRoute

| Critère | JWT en mémoire + ProtectedRoute | Cookie HttpOnly + Middleware |
|---|---|---|
| Token accessible par JS |  Oui (risque XSS) |  Non (HttpOnly) |
| Flash de contenu protégé |  Possible |  Impossible |
| Protection côté serveur |  Non |  Oui (avant le rendu) |
| Risque de fuite côté client | Élevé | Faible |

---

## Q13. Si on arrête `json-server`, les API Routes fonctionnent-elles encore ?

**Oui.**

Les API Routes de Next.js lisent et écrivent directement dans `db.json`, sans passer par `json-server`.

> **Next.js remplace `json-server`** en tant que backend intégré.

---

## Q14. Cookie HttpOnly : un script XSS peut-il le voler ?

**Non.**

```js
document.cookie // → ne retourne pas le cookie HttpOnly
```

Un script XSS **ne peut pas lire** un cookie `HttpOnly` via `document.cookie`.

>  Le cookie `HttpOnly` protège la session contre le **vol par JavaScript malveillant**.

