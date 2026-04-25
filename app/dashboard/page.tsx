import AddProjectForm from './AddProjectForm';
import { deleteProject, renameProject } from '../actions/projects';

export default async function DashboardPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/projects`,
    { cache: 'no-store' }
  );

  const projects = await res.json();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>

      <AddProjectForm />

      <ul>
        {projects.map((p: any) => (
          <li
            key={p.id}
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: p.color,
                display: 'inline-block',
              }}
            />

            <a href={`/projects/${p.id}`}>{p.name}</a>

            <form action={renameProject} style={{ display: 'flex', gap: 4 }}>
              <input type="hidden" name="id" value={p.id} />
              <input name="newName" placeholder="Nouveau nom" required />
              <button type="submit">✏️</button>
            </form>

            <form action={deleteProject}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit">🗑️</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}