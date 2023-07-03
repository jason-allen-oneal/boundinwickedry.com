import { prisma } from "@/lib/prisma";
import { getTime } from "@/lib/utils";

export const getAllCategories = async () => {
  const cats = await prisma.forumCategory.findMany({
    where: {
      parent: 0,
    },
  });

  const categories = [];

  for (const cat of cats) {
    const subs = await prisma.forumCategory.findMany({
      where: {
        parent: cat.id,
      },
    });

    const ids = [];
    for (const sub of subs) {
      ids.push({
        categoryId: sub.id,
      });
    }
    ids.push({
      categoryId: cat.id,
    });

    const latestTopics = await prisma.forumTopic.findMany({
      where: {
        OR: ids,
      },
      include: {
        User: true,
      },
      take: 1,
      orderBy: {
        date: "desc",
      },
    });

    let latest: ForumTopic = latestTopics[0] || null;

    if (latest) {
      latest = {
        id: latestTopics[0].id,
        title: latestTopics[0].title,
        date: getTime("since", latestTopics[0].date),
        slug: latestTopics[0].slug,
        user: {
          id: latestTopics[0].User.id,
          name: latestTopics[0].User.name,
          slug: latestTopics[0].User.slug,
        },
      };
    }

    const obj = {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parent: cat.parent,
      subs: subs,
      latest: latest,
    };

    categories.push(obj);
  }

  return categories;
};

export const getCategoryById = async (id: number) => {
  const cat = await prisma.forumCategory.findFirst({
    where: {
      id: id,
    },
  });

  let parent: ForumCategory = null;

  if (cat!.parent) {
    parent = await prisma.forumCategory.findFirst({
      where: {
        id: cat!.parent,
      },
    });
  }

  const subs = await prisma.forumCategory.findMany({
    where: {
      parent: cat!.id,
    },
  });

  const obj = {
    id: cat!.id,
    name: cat!.name,
    slug: cat!.slug,
    parent: parent,
    subs: subs,
  };

  return obj;
};

export const getTopicsByCategory = async (id: number) => {
  const results = await prisma.forumTopic.findMany({
    where: {
      categoryId: id,
    },
    include: {
      User: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const topics = [];
  for (const r of results) {
    const obj = {
      id: r.id,
      title: r.title,
      slug: r.slug,
      user: r.User,
      categoryId: r.categoryId,
      featured: r.featured,
      public: r.public,
      date: getTime("short", r.date),
    };

    topics.push(obj);
  }

  return topics;
};

export const getTopic = async (id: number) => {
  const topic = await prisma.forumTopic.findFirst({
    where: {
      id: id,
    },
    include: {
      User: true,
      ForumCategory: true,
    },
  });

  return topic;
};

export const getComments = async (id: number) => {
  const results = await prisma.forumComment.findMany({
    where: {
      topicId: id,
    },
    include: {
      User: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const comments = [];
  for (const r of results) {
    const obj = {
      id: r.id,
      text: r.text,
      User: r.User,
      date: getTime("short", r.date),
    };

    comments.push(obj);
  }

  return comments;
};
