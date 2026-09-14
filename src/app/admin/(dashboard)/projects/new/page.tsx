import { prisma } from '@/lib/db';
import ProjectCreateForm from '../ProjectCreateForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'New Project | Admin Console',
};

export default async function AdminNewProjectPage() {
  const availableIdeas = await prisma.idea.findMany({
    where: { project: null },
    select: { id: true, title: true, slug: true },
    orderBy: { title: 'asc' },
  });

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', width: '100%' }}>
      <ProjectCreateForm availableIdeas={availableIdeas} backHref="/admin/projects" />
    </div>
  );
}
