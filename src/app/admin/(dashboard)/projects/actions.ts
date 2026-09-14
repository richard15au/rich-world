'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth';
import { ProjectStatus, Prisma } from '@prisma/client';

export interface CreateProjectState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  project?: {
    id: string;
    slug: string;
    title: string;
  };
}

export async function createProjectAction(
  prevState: CreateProjectState | null,
  formData: FormData
): Promise<CreateProjectState> {
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
  const title = (formData.get('title') as string | null)?.trim() ?? '';
  const rawSlug = (formData.get('slug') as string | null)?.trim() ?? '';
  const tagline = (formData.get('tagline') as string | null)?.trim() ?? '';
  const description = (formData.get('description') as string | null)?.trim() ?? '';
  const statusInput = (formData.get('status') as string | null)?.trim() ?? 'ACTIVE';
  const featured = formData.get('featured') === 'on' || formData.get('featured') === 'true';
  const isPublic = formData.get('isPublic') === 'on' || formData.get('isPublic') === 'true';
  const rawRepoUrl = (formData.get('repoUrl') as string | null)?.trim() ?? '';
  const rawLiveUrl = (formData.get('liveUrl') as string | null)?.trim() ?? '';
  const rawIdeaId = (formData.get('ideaId') as string | null)?.trim() ?? '';

  const fieldErrors: Record<string, string> = {};

  // 3. Validation
  if (!title) {
    fieldErrors.title = 'Project title is required.';
  } else if (title.length < 2) {
    fieldErrors.title = 'Title must be at least 2 characters.';
  } else if (title.length > 120) {
    fieldErrors.title = 'Title must not exceed 120 characters.';
  }

  const slug = rawSlug.toLowerCase();
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slug) {
    fieldErrors.slug = 'Project slug is required.';
  } else if (slug.length < 2) {
    fieldErrors.slug = 'Slug must be at least 2 characters.';
  } else if (slug.length > 80) {
    fieldErrors.slug = 'Slug must not exceed 80 characters.';
  } else if (!slugRegex.test(slug)) {
    fieldErrors.slug =
      'Slug format is invalid. Use only lowercase letters, numbers, and single hyphens (e.g. "my-project-hub").';
  }

  if (!tagline) {
    fieldErrors.tagline = 'Tagline is required.';
  } else if (tagline.length < 5) {
    fieldErrors.tagline = 'Tagline must be at least 5 characters.';
  } else if (tagline.length > 200) {
    fieldErrors.tagline = 'Tagline must not exceed 200 characters.';
  }

  if (!description) {
    fieldErrors.description = 'Description is required.';
  } else if (description.length < 10) {
    fieldErrors.description = 'Description must be at least 10 characters.';
  }

  const validStatuses: ProjectStatus[] = [
    ProjectStatus.ACTIVE,
    ProjectStatus.MAINTENANCE,
    ProjectStatus.ARCHIVED,
  ];
  if (!validStatuses.includes(statusInput as ProjectStatus)) {
    fieldErrors.status = 'Invalid status. Must be ACTIVE, MAINTENANCE, or ARCHIVED.';
  }

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

  let ideaId: string | null = null;
  if (rawIdeaId && rawIdeaId !== 'none') {
    ideaId = rawIdeaId;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: 'Please resolve the highlighted validation errors.',
      fieldErrors,
    };
  }

  // 4. Duplicate slug check
  try {
    const existing = await prisma.project.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existing) {
      return {
        success: false,
        error: `A project with the slug "${slug}" already exists.`,
        fieldErrors: {
          slug: `Slug "${slug}" is already taken. Please choose another.`,
        },
      };
    }

    // 5. Idea link validation
    if (ideaId) {
      const idea = await prisma.idea.findUnique({
        where: { id: ideaId },
        include: { project: true },
      });
      if (!idea) {
        return {
          success: false,
          error: 'The selected Idea could not be found.',
          fieldErrors: { ideaId: 'Selected idea does not exist.' },
        };
      }
      if (idea.project) {
        return {
          success: false,
          error: 'The selected Idea is already linked to another project.',
          fieldErrors: { ideaId: 'This idea is already associated with an existing project.' },
        };
      }
    }

    // 6. Create record in Neon
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        tagline,
        description,
        status: statusInput as ProjectStatus,
        featured,
        repoUrl,
        liveUrl,
        isPublic,
        ideaId,
      },
      select: {
        id: true,
        slug: true,
        title: true,
      },
    });

    // 7. Revalidate Next.js cache
    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    revalidatePath('/');

    return {
      success: true,
      project,
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return {
        success: false,
        error: `A project with the slug "${slug}" already exists.`,
        fieldErrors: { slug: 'Slug must be unique.' },
      };
    }
    console.error('Error creating project:', err);
    return {
      success: false,
      error: 'A database error occurred while creating the project record.',
    };
  }
}
