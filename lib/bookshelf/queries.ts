import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

export type CategoryWithCount = Prisma.CategoryGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    _count: {
      select: { resources: true };
    };
  };
}>;

export type ResourceWithRelations = Prisma.ResourceGetPayload<{
  select: {
    id: true;
    title: true;
    author: true;
    type: true;
    recommendationReason: true;
    resourceLink: true;
    buyLink: true;
    imageUrl: true;
    createdAt: true;
    updatedAt: true;
    category: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
  },
}>;

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

export async function getRecentResources(limit: number = 6): Promise<ResourceWithRelations[]> {
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
    },
  });
}

export async function getCategoryBySlug(slug: string): Promise<CategoryWithCount | null> {
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

export async function getResourcesByCategory(slug: string): Promise<ResourceWithRelations[]> {
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
    },
  });
}
