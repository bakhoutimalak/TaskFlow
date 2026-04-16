# Réponses aux Questions Théoriques

# Séance 1 — Le Web Moderne & React

# Partie 1 — Que contient le `<body>` ? Lien avec le CSR ?

Le `<body>` contient uniquement `<div id="root"></div>`. C'est le point d'entrée du **Client-Side Rendering** : le HTML est vide au départ, et c'est JavaScript (React) qui injecte tout le contenu dans ce `div` côté navigateur, après le chargement.

# Partie 2 — Différence données en dur vs API REST ?

| Données en dur | API REST (json-server) |
|----------------|------------------------|
| Fixes dans le code source | Dynamiques, modifiables sans recompiler |
| Impossible à partager entre clients | Accessible par n'importe quel client (React, mobile…) |
| Pas de persistance | Persistées dans `db.json` |
| Pas de vraies opérations CRUD | GET, POST, PUT, DELETE disponibles |

# Partie 3.1 — Pourquoi `className` au lieu de `class` ?

En JSX, le code est transformé en JavaScript. Or `class` est un **mot réservé** en JS (pour les classes ES6). React utilise donc `className` pour éviter le conflit. JSX n'est pas du HTML, c'est du JS qui *ressemble* à du HTML.

# Partie 3.2 — Pourquoi `key={p.id}` obligatoire dans `.map()` ?

React utilise la `key` pour identifier chaque élément de liste et **optimiser le re-render** (algorithme de réconciliation). Sans key, React ne sait pas quel élément a changé ou été supprimé.

Utiliser l'**index** comme key est risqué : si la liste est réordonnée ou filtrée, les indices changent → React pense que tous les éléments ont changé → re-renders inutiles + bugs d'état (ex: inputs qui gardent la mauvaise valeur).

# Q1 — Combien de fois le `useEffect` s'exécute ?

**Une seule fois**, au montage du composant. Le tableau de dépendances vide `[]` signifie : *"ne réexécute pas cet effet quand le state change"*. Sans `[]`, il s'exécuterait à chaque render.

# Q2 — json-server arrêté, que se passe-t-il au rechargement ?

Le `fetch` échoue → le bloc `catch` est déclenché → `console.error('Erreur:', error)` s'affiche. Le state reste vide (`[]`), les composants s'affichent vides. L'état `loading` passe quand même à `false` grâce au `finally`.

# Q3 — Network (F12) : requêtes vers localhost:4000 ?

Oui, 2 requêtes apparaissent : `GET /projects` et `GET /columns`. Code HTTP **200 OK** si json-server tourne. Si arrêté : erreur réseau (`net::ERR_CONNECTION_REFUSED`), pas de code HTTP.

# Q4 — Nouvelles données après modification de db.json ?

Oui, après rechargement de la page React. Le cycle complet :

1. Rechargement → `App` se monte
2. `useEffect` se déclenche
3. `fetch` envoie `GET /projects` et `GET /columns`
4. json-server lit `db.json` (à jour) et répond
5. `setProjects` / `setColumns` mettent le state à jour
6. React re-render → les nouveaux composants s'affichent

# Q5 — Flux de données (json-server → composants)

```
db.json
  └─► json-server (port 4000)
        └─► fetch() dans useEffect
              └─► setProjects() / setColumns()  ← useState
                    └─► Re-render de App
                          ├─► <Sidebar projects={projects} />  ← props
                          └─► <MainContent columns={columns} />  ← props
```

# Séance 2 — Auth Context & Protected Layout

# Q2 — Pourquoi `useAuth()` lance une erreur si context est `null` ?

Ça prévient le bug silencieux : si un développeur utilise `useAuth()` en dehors d'un `<AuthProvider>`, le context serait `null` et l'app crasherait de façon cryptique. L'erreur explicite *"useAuth doit être utilisé dans un AuthProvider"* indique immédiatement **où** est le problème.

# Q3 — Sans Context, comment partager le `user` ?

Il faudrait du **prop drilling** : passer `user` de `App` → `Header`, `App` → `Sidebar`, `App` → `Login`… Au minimum **3 props** directes, et si la hiérarchie est profonde, chaque composant intermédiaire devrait transmettre `user` sans même l'utiliser. Le Context élimine ce problème.

# Q4 — Pourquoi `e.preventDefault()` est indispensable ?

Sans ça, le formulaire déclenche son comportement HTML par défaut : **rechargement de la page**. Toute la logique async `handleSubmit` serait interrompue, le state React réinitialisé, et la requête vers json-server ne partirait jamais.

# Q5 — Que fait `{ password: _, ...user }` ?

C'est de la **destructuration avec renommage** : on extrait `password` dans `_` (convention pour "variable ignorée") et on met **tout le reste** dans `user`. Résultat : `user` contient `{ id, email, name }` sans le mot de passe.

On exclut le password pour ne **jamais le stocker dans le state React**. Principe du moindre privilège : le front n'a pas besoin du mot de passe une fois authentifié.

# Q6 — Pourquoi `Dashboard` séparé et pas tout dans `App` ?

`App` est le composant **décideur** (login ou dashboard ?). Si on met le `useEffect` fetch dans `App`, il s'exécute même quand l'utilisateur n'est pas connecté → requêtes inutiles. En séparant, le `Dashboard` avec son `useEffect` n'est **monté que si l'user est connecté**, donc le fetch ne se déclenche qu'au bon moment.

# Q8 — Flux du callback `onLogout`

```
[Header] bouton "Déconnexion" cliqué
  └─► onClick → appelle onLogout() (prop reçue)
        └─► dispatch({ type: 'LOGOUT' })  (dans App/Dashboard)
              └─► authReducer → retourne initialState ({ user: null, ... })
                    └─► state.user = null
                          └─► App re-render
                                └─► !authState.user → affiche <Login />
```

# Q9 — Pourquoi le flash disparaît avec `useLayoutEffect` ?

- Avec **`useEffect`** : Render → Commit → **Paint** (navigateur affiche position 0,0) → Effect (corrige la position) → le user voit le flash
- Avec **`useLayoutEffect`** : Render → Commit → Effect (corrige la position) → **Paint** → le navigateur peint directement à la bonne position, jamais de flash visible

# Q10 — Pourquoi ne pas utiliser `useLayoutEffect` partout ?

Parce qu'il **bloque le paint** du navigateur le temps de s'exécuter. Si le code dans `useLayoutEffect` est lent (calculs lourds, accès DOM multiples), l'utilisateur voit une page **figée**. `useEffect` est non-bloquant et préférable dans 95% des cas. `useLayoutEffect` ne sert que pour les mesures DOM où le flash visuel est inacceptable.
