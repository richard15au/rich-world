import { prisma } from '@/lib/db';
import BusinessCreateForm from '../BusinessCreateForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'New Business | Admin Console',
};

export default async function AdminNewBusinessPage() {
  const availableApplications = await prisma.application.findMany({
    select: { id: true, name: true, slug: true, appType: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', width: '100%' }}>
      <BusinessCreateForm availableApplications={availableApplications} backHref="/admin/businesses" />
    </div>
  );
}
