import { prisma } from "../prisma";
import { normalize, normalizeName } from "../utils";

export const getItem = async (id: number) => {
  const item = await prisma.item.findFirst({
    where: {
      id: {
        equals: id,
      },
    },
    include: {
      ShopCategory: true,
    },
  });

  return item;
};

export const getCategoryById = async (id: number) => {
  const category = await prisma.shopCategory.findFirst({
    where: {
      id: id,
    },
  });

  return category;
};

export const getItemsByCategory = async (id: number) => {
  const items = await prisma.item.findMany({
    where: {
      categoryId: id,
    },
  });

  return items;
};

export const createCategory = async (cat: string) => {
  try {
    const data = {
      name: normalizeName(cat),
      slug: normalize(cat),
      type: "shop",
      count: 0,
      parent: 0,
      hidden: false,
    };

    return await prisma.shopCategory.create({
      data: data,
      select: { id: true, name: true },
    });
  } catch (e) {
    console.log(e);
  }
};

export const createItem = async (item: any) => {
  try {
    return await prisma.item.create({
      data: item,
      select: { id: true },
    });
  } catch (e) {
    console.log(e);
  }
};
