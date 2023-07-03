import { formatDistance, format, getUnixTime } from "date-fns";
import { imageSize } from "image-size";
import * as fs from "fs";
import stopwords from "./stopwords";
import {
  type ForumTopic,
  type Gallery,
  type Item,
  type User,
  type Tags,
} from "@prisma/client";
import { sort } from "fast-sort";

type Sortable = ForumTopic[] | Gallery[] | Item[];

export const markup = [0.35, 0.25, 0.2, 0.5];

export const normalize = (str: string) => {
  str = str.replace(/^\s+|\s+$/g, "");
  str = str.toLowerCase();

  const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaeeeeiiiioooouuuunc------";

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-zA-Z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return str;
};

export const normalizeName = (str: string) => {
  str = str.replace(/^\s+|\s+$/g, "");
  const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaeeeeiiiioooouuuunc------";

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }
  str = str.replace(/[^a-zA-Z0-9 -]/g, "");

  return str;
};

export const getTime = (type: string, date: Date | string | null = null) => {
  if (date === null) {
    date = new Date();
  }

  if (typeof date === "string") {
    date = new Date(date);
  }

  if (type === "long") {
    return format(date, "PPPPpppp");
  }

  if (type === "short") {
    return format(date, "Pp");
  }

  if (type === "timestamp") {
    return getUnixTime(date);
  }

  if (type === "since") {
    return formatDistance(date, new Date(), { addSuffix: true });
  }
};

export const truncate = (text: string) => {
  return text.split(" ").splice(0, 50).join(" ") + "...";
};

export const formatPrice = (price: string, subtype: number) => {
  let adjustedPrice = parseInt(price) + parseInt(price) * markup[subtype];
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(adjustedPrice);
};

export const paginate = (
  items: Item[] | ForumTopic[] | Gallery[] | ForumComment[] | GalleryComment[],
  pageNumber: number,
  pageSize: number
) => {
  const startIndex = (pageNumber - 1) * pageSize;

  return items.slice(startIndex, startIndex + pageSize);
};

export const getCategorySelectOptions = (
  cats: GalleryCategory[] | ForumCategory[] | ShopCategory[],
  id: number
) => {
  let categoryOpts = [];
  for (var i = 0; i < cats.length; i++) {
    const opt = {
      label: cats[i].name,
      value: cats[i].id,
      selected: false,
    };

    if (id === cats[i].id) {
      opt.selected = true;
    }
    categoryOpts.push(opt);
  }

  return categoryOpts;
};

export const createThumbnailRatio = async (image: string) => {
  const MAX_WIDTH = 250;
  const MAX_HEIGHT = 250;

  const { width, height } = await getImageDimensions(image);

  const ratio = Math.min(MAX_WIDTH / width!, MAX_HEIGHT / height!);
  return { width: width! * ratio, height: height! * ratio };
};

export const getImageDimensions = async (image: string) => {
  const dimensions = imageSize(image);

  return dimensions;
};

export const randomString = (length: number) => {
  let result = "";
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];

  return result;
};

export const sorter = (
  items: ForumTopic[] | Gallery[] | Item[],
  sortParam: string,
  type: string
): ForumTopic[] | Gallery[] | Item[] => {
  const [sortField, sortOrder] = sortParam.split(" - ");
  let sorted: ForumTopic[] | Gallery[] | Item[];

  if (type === "forum") {
    switch (sortField) {
      case "date":
        if (sortOrder === "asc") {
          sorted = sort(items as ForumTopic[]).asc("date") as ForumTopic[];
        } else {
          sorted = sort(items as ForumTopic[]).desc("date") as ForumTopic[];
        }
        break;

      case "title":
        if (sortOrder === "asc") {
          sorted = sort(items as ForumTopic[]).desc("title") as ForumTopic[];
        } else {
          sorted = sort(items as ForumTopic[]).desc("title") as ForumTopic[];
        }
        break;

      default:
        throw new Error("Invalid sort field");
    }
  } else if (type === "gallery") {
    switch (sortField) {
      case "date":
        if (sortOrder === "asc") {
          sorted = sort(items as Gallery[]).asc("date") as Gallery[];
        } else {
          sorted = sort(items as Gallery[]).desc("date") as Gallery[];
        }
        break;

      case "title":
        if (sortOrder === "asc") {
          sorted = sort(items as Gallery[]).desc("title") as Gallery[];
        } else {
          sorted = sort(items as Gallery[]).desc("title") as Gallery[];
        }
        break;

      default:
        throw new Error("Invalid sort field");
    }
  } else {
    switch (sortField) {
      case "date":
        if (sortOrder === "asc") {
          sorted = sort(items as Item[]).asc("date") as Item[];
        } else {
          sorted = sort(items as Item[]).desc("date") as Item[];
        }
        break;

      case "title":
        if (sortOrder === "asc") {
          sorted = sort(items as Item[]).desc("title") as Item[];
        } else {
          sorted = sort(items as Item[]).desc("title") as Item[];
        }
        break;

      case "price":
        if (sortOrder === "asc") {
          sorted = sort(items as Item[]).desc("price") as Item[];
        } else {
          sorted = sort(items as Item[]).desc("price") as Item[];
        }
        break;

      default:
        throw new Error("Invalid sort field");
    }
  }

  return sorted;
};
