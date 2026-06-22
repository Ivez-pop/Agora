import { prisma } from "../prisma";
import { RECENT_RESOURCES_LIMIT } from "./constants";
import { CategoryWithCount, ResourceWithRelations } from "./types";
import { Prisma, ResourceType } from "@prisma/client";

export async function getCategories(): Promise<CategoryWithCount[]> {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: { resources: true },
      },
    },
  });
}

export async function getRecentResources(
  limit: number = RECENT_RESOURCES_LIMIT,
): Promise<ResourceWithRelations[]> {
  return prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      author: true,
      type: true,
      recommendationReason: true,
      resourceLink: true,
      buyLink: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      recommendedBy: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function getCategoryBySlug(
  slug: string,
): Promise<CategoryWithCount | null> {
  return prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: { resources: true },
      },
    },
  });
}

export async function getResourcesByCategory(
  slug: string,
): Promise<ResourceWithRelations[]> {
  return prisma.resource.findMany({
    where: {
      category: { slug },
    },
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      author: true,
      type: true,
      recommendationReason: true,
      resourceLink: true,
      buyLink: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      recommendedBy: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function getResourceById(
  id: string,
): Promise<ResourceWithRelations | null> {
  return prisma.resource.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      author: true,
      type: true,
      recommendationReason: true,
      resourceLink: true,
      buyLink: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      recommendedBy: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

function buildResourcesQuery(params: { q?: string; type?: string; sort?: string }) {
  const where: Prisma.ResourceWhereInput = {};

  if (params.type && Object.values(ResourceType).includes(params.type as ResourceType)) {
    where.type = params.type as ResourceType;
  }

  if (params.q && params.q.trim() !== "") {
    const searchString = params.q.trim();
    where.OR = [
      { title: { contains: searchString, mode: "insensitive" } },
      { author: { contains: searchString, mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.ResourceOrderByWithRelationInput = { createdAt: "desc" };
  if (params.sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (params.sort === "title-asc") {
    orderBy = { title: "asc" };
  } else if (params.sort === "title-desc") {
    orderBy = { title: "desc" };
  }

  return { where, orderBy };
}

export async function getFilteredResources(params: {
  q?: string;
  type?: string;
  sort?: string;
}): Promise<ResourceWithRelations[]> {
  const { where, orderBy } = buildResourcesQuery(params);

  return prisma.resource.findMany({
    where,
    orderBy,
    select: {
      id: true,
      title: true,
      author: true,
      type: true,
      recommendationReason: true,
      resourceLink: true,
      buyLink: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      recommendedBy: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function getFilteredCategoryResources(
  categorySlug: string,
  params: { q?: string; type?: string; sort?: string },
): Promise<ResourceWithRelations[]> {
  const { where, orderBy } = buildResourcesQuery(params);

  const finalWhere: Prisma.ResourceWhereInput = {
    ...where,
    category: { slug: categorySlug },
  };

  return prisma.resource.findMany({
    where: finalWhere,
    orderBy,
    select: {
      id: true,
      title: true,
      author: true,
      type: true,
      recommendationReason: true,
      resourceLink: true,
      buyLink: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      recommendedBy: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function searchResources(query: string): Promise<ResourceWithRelations[]> {
  return getFilteredResources({ q: query });
}

