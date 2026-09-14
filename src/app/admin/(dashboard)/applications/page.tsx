import { prisma } from '@/lib/db';
import ApplicationsAdminClient from './ApplicationsAdminClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Applications Management | Admin Console',
};

interface AdminApplicationsPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminApplicationsPage({ searchParams }: AdminApplicationsPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const actionParam = resolvedParams.action;
  const newParam = resolvedParams.new;
  const initialMode = actionParam === 'new' || newParam === 'true' || newParam === '1' ? 'create' : 'list';

  const [applications, availableProjects] = await Promise.all([
    prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    }),
    prisma.project.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
      },
      orderBy: { title: 'asc' },
    }),
  ]);

  return (
    <ApplicationsAdminClient
      initialApplications={applications}
      availableProjects={availableProjects}
      initialMode={initialMode}
    />
  );
}
