import { prisma } from "../prisma";
import { RECENT_RESOURCES_LIMIT } from "./constants";
import { CategoryWithCount, ResourceWithRelations } from "./types";

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
