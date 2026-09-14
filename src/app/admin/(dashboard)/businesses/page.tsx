import { prisma } from '@/lib/db';
import BusinessesAdminClient from './BusinessesAdminClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Businesses & Offices Management | Admin Console',
};

interface AdminBusinessesPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminBusinessesPage({ searchParams }: AdminBusinessesPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const actionParam = resolvedParams.action;
  const newParam = resolvedParams.new;
  const initialMode = actionParam === 'new' || newParam === 'true' || newParam === '1' ? 'create' : 'list';

  const [businesses, availableApplications] = await Promise.all([
    prisma.business.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        applications: {
          include: {
            application: {
              select: {
                id: true,
                name: true,
                slug: true,
                appType: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    }),
    prisma.application.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        appType: true,
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <BusinessesAdminClient
      initialBusinesses={businesses}
      availableApplications={availableApplications}
      initialMode={initialMode}
    />
  );
}
