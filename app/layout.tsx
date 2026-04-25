import { cookies } from 'next/headers';
import LogoutButton from './components/LogoutButton';
export default async function RootLayout({ children }: { children: React.ReactNode }) {
const cookieStore = await cookies();
const session = cookieStore.get('session');
const user = session ? JSON.parse(session.value) : null;
return (
<html lang="fr">
<body>
<header style={{ background: '#1B8C3E', color: 'white', padding: '1rem 2rem',
display: 'flex', justifyContent: 'space-between' }}>
<h2 style={{ margin: 0 }}>TaskFlow</h2>
<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
{user && <span>{user.name}</span>}
{user && <LogoutButton />}
{!user && <a href="/login" style={{ color: 'white' }}>Login</a>}
</div>
</header>
<main>{children}</main>
</body>
</html>
);
}