'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth';
import { BusinessLegalType, BusinessStatus, Prisma } from '@prisma/client';

export interface CreateBusinessState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  business?: {
    id: string;
    slug: string;
    name: string;
    legalType: string;
    role: string;
    linkedApplicationName?: string;
    purpose?: string;
  };
}

export async function createBusinessAction(
  prevState: CreateBusinessState | null,
  formData: FormData
): Promise<CreateBusinessState> {
  // 1. Authenticate owner admin session
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
  const legalTypeInput = (formData.get('legalType') as string | null)?.trim() ?? 'STUDIO';
  const role = (formData.get('role') as string | null)?.trim() ?? '';
  const summary = (formData.get('summary') as string | null)?.trim() ?? '';
  const statusInput = (formData.get('status') as string | null)?.trim() ?? 'ACTIVE';
  const rawWebsiteUrl = (formData.get('websiteUrl') as string | null)?.trim() ?? '';
  const isPublic = formData.get('isPublic') === 'on' || formData.get('isPublic') === 'true';

  // Optional Application relationship
  const applicationId = (formData.get('applicationId') as string | null)?.trim() || null;
  const purpose = (formData.get('purpose') as string | null)?.trim() || null;

  const fieldErrors: Record<string, string> = {};

  // 3. Validation
  // Name
  if (!name) {
    fieldErrors.name = 'Business name is required.';
  } else if (name.length < 2) {
    fieldErrors.name = 'Business name must be at least 2 characters.';
  } else if (name.length > 120) {
    fieldErrors.name = 'Business name must not exceed 120 characters.';
  }

  // Slug
  const slug = rawSlug.toLowerCase();
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slug) {
    fieldErrors.slug = 'Business slug is required.';
  } else if (slug.length < 2) {
    fieldErrors.slug = 'Slug must be at least 2 characters.';
  } else if (slug.length > 80) {
    fieldErrors.slug = 'Slug must not exceed 80 characters.';
  } else if (!slugRegex.test(slug)) {
    fieldErrors.slug =
      'Slug format is invalid. Use only lowercase letters, numbers, and single hyphens (e.g. "richacademy").';
  }

  // LegalType validation against enum
  const validLegalTypes: BusinessLegalType[] = [
    BusinessLegalType.COMPANY,
    BusinessLegalType.STUDIO,
    BusinessLegalType.AGENCY,
    BusinessLegalType.FREELANCE,
  ];
  if (!validLegalTypes.includes(legalTypeInput as BusinessLegalType)) {
    fieldErrors.legalType = 'Invalid legal type. Must be COMPANY, STUDIO, AGENCY, or FREELANCE.';
  }

  // Role
  if (!role) {
    fieldErrors.role = 'Role/Title is required (e.g. "Founder & Director").';
  } else if (role.length < 2) {
    fieldErrors.role = 'Role must be at least 2 characters.';
  } else if (role.length > 100) {
    fieldErrors.role = 'Role must not exceed 100 characters.';
  }

  // Summary
  if (!summary) {
    fieldErrors.summary = 'Summary is required.';
  } else if (summary.length < 5) {
    fieldErrors.summary = 'Summary must be at least 5 characters.';
  } else if (summary.length > 500) {
    fieldErrors.summary = 'Summary must not exceed 500 characters.';
  }

  // Status validation against enum
  const validStatuses: BusinessStatus[] = [
    BusinessStatus.ACTIVE,
    BusinessStatus.INACTIVE,
  ];
  if (!validStatuses.includes(statusInput as BusinessStatus)) {
    fieldErrors.status = 'Invalid status. Must be ACTIVE or INACTIVE.';
  }

  // Website URL (optional)
  let websiteUrl: string | null = null;
  if (rawWebsiteUrl) {
    try {
      const parsed = new URL(rawWebsiteUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        fieldErrors.websiteUrl = 'Website URL must use http:// or https:// protocol.';
      } else {
        websiteUrl = rawWebsiteUrl;
      }
    } catch {
      fieldErrors.websiteUrl = 'Please enter a valid URL (e.g. https://richacademy.io).';
    }
  }

  // Optional Application relationship validation
  let targetApplication: { id: string; name: string } | null = null;
  if (applicationId) {
    if (!purpose) {
      fieldErrors.purpose = 'A purpose is required when connecting an application (e.g. what role this app plays in the business).';
    } else if (purpose.length < 5) {
      fieldErrors.purpose = 'Purpose must be at least 5 characters.';
    } else if (purpose.length > 500) {
      fieldErrors.purpose = 'Purpose must not exceed 500 characters.';
    }

    try {
      targetApplication = await prisma.application.findUnique({
        where: { id: applicationId },
        select: { id: true, name: true },
      });
      if (!targetApplication) {
        fieldErrors.applicationId = 'The selected Application could not be found in the database.';
      }
    } catch (err) {
      console.error('Error verifying application existence:', err);
      fieldErrors.applicationId = 'Error verifying selected application.';
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: 'Please resolve the highlighted validation errors.',
      fieldErrors,
    };
  }

  // 4. Verify slug uniqueness
  try {
    const existing = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existing) {
      return {
        success: false,
        error: `A business with the slug "${slug}" already exists.`,
        fieldErrors: {
          slug: `Slug "${slug}" is already taken. Please choose another.`,
        },
      };
    }

    // 5. Atomic creation using Prisma nested write (safe rollback if relationship fails)
    const business = await prisma.business.create({
      data: {
        name,
        slug,
        legalType: legalTypeInput as BusinessLegalType,
        role,
        summary,
        websiteUrl,
        status: statusInput as BusinessStatus,
        isPublic,
        ...(applicationId && purpose
          ? {
              applications: {
                create: {
                  applicationId,
                  purpose,
                },
              },
            }
          : {}),
      },
      select: {
        id: true,
        slug: true,
        name: true,
        legalType: true,
        role: true,
        applications: {
          select: {
            applicationId: true,
            purpose: true,
            application: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    // 6. Revalidate Next.js cache paths
    revalidatePath('/businesses');
    revalidatePath('/admin/businesses');
    revalidatePath('/admin/applications');
    revalidatePath('/applications');
    revalidatePath('/');

    const linkedApp = business.applications[0];

    return {
      success: true,
      business: {
        id: business.id,
        slug: business.slug,
        name: business.name,
        legalType: business.legalType,
        role: business.role,
        linkedApplicationName: linkedApp?.application?.name,
        purpose: linkedApp?.purpose,
      },
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return {
        success: false,
        error: `A business with the slug "${slug}" already exists.`,
        fieldErrors: { slug: 'Slug must be unique.' },
      };
    }
    console.error('Error creating business:', err);
    return {
      success: false,
      error: 'A database error occurred while creating the business record.',
    };
  }
}
