'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth';
import { AppType, Prisma } from '@prisma/client';

export interface CreateApplicationState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  application?: {
    id: string;
    slug: string;
    name: string;
    projectId: string;
  };
}

export async function createApplicationAction(
  prevState: CreateApplicationState | null,
  formData: FormData
): Promise<CreateApplicationState> {
  // 1. Authenticate owner session
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return {
      success: false,
      error: 'Unauthorized: Owner admin session required. Please log in.',
    };
  }

  // 2. Extract fields
  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const rawSlug = (formData.get('slug') as string | null)?.trim() ?? '';
  const summary = (formData.get('summary') as string | null)?.trim() ?? '';
  const projectId = (formData.get('projectId') as string | null)?.trim() ?? '';
  const appTypeInput = (formData.get('appType') as string | null)?.trim() ?? 'WEB';
  const rawTechStack = (formData.get('techStack') as string | null)?.trim() ?? '';
  const rawRepoUrl = (formData.get('repoUrl') as string | null)?.trim() ?? '';
  const rawLiveUrl = (formData.get('liveUrl') as string | null)?.trim() ?? '';
  const isPublic = formData.get('isPublic') === 'on' || formData.get('isPublic') === 'true';

  const fieldErrors: Record<string, string> = {};

  // 3. Validation
  // Name
  if (!name) {
    fieldErrors.name = 'Application name is required.';
  } else if (name.length < 2) {
    fieldErrors.name = 'Application name must be at least 2 characters.';
  } else if (name.length > 120) {
    fieldErrors.name = 'Application name must not exceed 120 characters.';
  }

  // Slug
  const slug = rawSlug.toLowerCase();
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slug) {
    fieldErrors.slug = 'Application slug is required.';
  } else if (slug.length < 2) {
    fieldErrors.slug = 'Slug must be at least 2 characters.';
  } else if (slug.length > 80) {
    fieldErrors.slug = 'Slug must not exceed 80 characters.';
  } else if (!slugRegex.test(slug)) {
    fieldErrors.slug =
      'Slug format is invalid. Use only lowercase letters, numbers, and single hyphens (e.g. "eduflex-app").';
  }

  // Summary
  if (!summary) {
    fieldErrors.summary = 'Summary is required.';
  } else if (summary.length < 5) {
    fieldErrors.summary = 'Summary must be at least 5 characters.';
  } else if (summary.length > 300) {
    fieldErrors.summary = 'Summary must not exceed 300 characters.';
  }

  // ProjectId (mandatory parent relationship)
  if (!projectId) {
    fieldErrors.projectId = 'A parent Project is required. Please select an existing project.';
  }

  // AppType
  const validAppTypes: AppType[] = [
    AppType.WEB,
    AppType.API,
    AppType.CLI,
    AppType.SERVICE,
    AppType.MOBILE,
  ];
  if (!validAppTypes.includes(appTypeInput as AppType)) {
    fieldErrors.appType = 'Invalid application type. Must be WEB, API, CLI, SERVICE, or MOBILE.';
  }

  // TechStack parsing
  const techStack = Array.from(
    new Set(
      rawTechStack
        .split(/[,\n]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    )
  );
  if (techStack.length === 0) {
    fieldErrors.techStack = 'Please specify at least one technology (e.g., Next.js, TypeScript).';
  }

  // URLs (optional)
  let repoUrl: string | null = null;
  if (rawRepoUrl) {
    try {
      const parsed = new URL(rawRepoUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        fieldErrors.repoUrl = 'Repository URL must use http:// or https:// protocol.';
      } else {
        repoUrl = rawRepoUrl;
      }
    } catch {
      fieldErrors.repoUrl = 'Please enter a valid URL (e.g. https://github.com/org/repo).';
    }
  }

  let liveUrl: string | null = null;
  if (rawLiveUrl) {
    try {
      const parsed = new URL(rawLiveUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        fieldErrors.liveUrl = 'Live application URL must use http:// or https:// protocol.';
      } else {
        liveUrl = rawLiveUrl;
      }
    } catch {
      fieldErrors.liveUrl = 'Please enter a valid URL (e.g. https://app.example.com).';
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: 'Please resolve the highlighted validation errors.',
      fieldErrors,
    };
  }

  // 4. Verify parent project exists
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, title: true },
    });
    if (!project) {
      return {
        success: false,
        error: 'The selected parent Project could not be found.',
        fieldErrors: { projectId: 'Selected project does not exist in the database.' },
      };
    }

    // 5. Verify slug uniqueness
    const existing = await prisma.application.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existing) {
      return {
        success: false,
        error: `An application with the slug "${slug}" already exists.`,
        fieldErrors: {
          slug: `Slug "${slug}" is already taken. Please choose another.`,
        },
      };
    }

    // 6. Create record in Neon PostgreSQL
    const application = await prisma.application.create({
      data: {
        name,
        slug,
        summary,
        projectId,
        appType: appTypeInput as AppType,
        techStack,
        repoUrl,
        liveUrl,
        isPublic,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        projectId: true,
      },
    });

    // 7. Revalidate Next.js cache paths
    revalidatePath('/applications');
    revalidatePath('/admin/applications');
    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    revalidatePath('/');

    return {
      success: true,
      application,
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return {
        success: false,
        error: `An application with the slug "${slug}" already exists.`,
        fieldErrors: { slug: 'Slug must be unique.' },
      };
    }
    console.error('Error creating application:', err);
    return {
      success: false,
      error: 'A database error occurred while creating the application record.',
    };
  }
}
