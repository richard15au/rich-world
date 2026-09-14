import { prisma } from '@/lib/db';
import ApplicationCreateForm from '../ApplicationCreateForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'New Application | Admin Console',
};

export default async function AdminNewApplicationPage() {
  const availableProjects = await prisma.project.findMany({
    select: { id: true, title: true, slug: true },
    orderBy: { title: 'asc' },
  });

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', width: '100%' }}>
      <ApplicationCreateForm availableProjects={availableProjects} backHref="/admin/applications" />
    </div>
  );
}
