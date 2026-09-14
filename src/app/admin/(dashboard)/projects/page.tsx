import { prisma } from '@/lib/db';
import ProjectsAdminClient from './ProjectsAdminClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects Management | Admin Console',
};

interface AdminProjectsPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminProjectsPage({ searchParams }: AdminProjectsPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const actionParam = resolvedParams.action;
  const newParam = resolvedParams.new;
  const initialMode = actionParam === 'new' || newParam === 'true' || newParam === '1' ? 'create' : 'list';

  const [projects, availableIdeas] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        idea: {
          select: { title: true },
        },
      },
    }),
    prisma.idea.findMany({
      where: { project: null },
      select: { id: true, title: true, slug: true },
      orderBy: { title: 'asc' },
    }),
  ]);

  return (
    <ProjectsAdminClient
      initialProjects={projects}
      availableIdeas={availableIdeas}
      initialMode={initialMode}
    />
  );
}
