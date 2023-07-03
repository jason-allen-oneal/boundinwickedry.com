import { prisma } from "../prisma";

export const getAllCategories = async () => {
  const cats = await prisma.galleryCategory.findMany();

  return cats;
};

export const getCategoryById = async (id: number) => {
  const category = await prisma.galleryCategory.findUnique({
    where: {
      id: id,
    },
  });

  return category;
};

export const getGalleriesByCategoryId = async (id: number) => {
  const galleries = await prisma.gallery.findMany({
    where: {
      categoryId: id,
    },
    include: {
      Entry: {
        select: {
          id: true,
          thumb: true,
          path: true,
        },
      },
      User: true,
    },
  });

  return galleries;
};

export const getGallery = async (id: number) => {
  const gallery = await prisma.gallery.findFirst({
    where: {
      id: id,
    },
    include: {
      Entry: true,
      User: true,
      GalleryCategory: true,
      GalleryComment: {
        include: {
          User: true,
        },
      },
    },
  });

  return gallery;
};

export const getGalleryEntries = async (id: number) => {
  const entries = await prisma.entry.findMany({
    where: {
      galleryId: id,
    },
  });

  return entries;
};
