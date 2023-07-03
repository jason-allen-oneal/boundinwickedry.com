// @ts-nocheck

import { PrismaClient } from "@prisma/client";
import { normalize, normalizeName, randomString } from "@/lib/utils";
import { parse } from "csv-parse";
import fs from "fs";
import https from "https";
import { hash } from "argon2";
import * as cheerio from "cheerio";
import axios from "axios";
import * as download from "image-downloader";

const prisma = new PrismaClient();

const downloadUrl = new URL(
  process.env.DISTRIBUTOR +
    "/feeds/" +
    process.env.USER +
    "/" +
    process.env.PASS +
    "/products-detailed-pipedel.txt"
);
const sourceFile = process.env.ROOT_PATH + "/files/inv.txt";

const products: any[] = [];

async function downloadImage(url: string, filepath: string) {
  return new Promise((resolve: (result) => void, reject: (err) => void) => {
    download
      .image({
        url,
        dest: filepath,
        extractFilename: true,
      })
      .then(({ filename }) => {
        const n = filename.lastIndexOf("/");
        const result = filename.substring(n + 1);

        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export const getImage = async (image: string) => {
  return await downloadImage(
    image,
    process.env.ROOT_PATH + "/public/images/shop/"
  );
};

export const getRemoteFile = async (
  outFile: string,
  url: URL
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outFile);
    const req = https.get(url, (res) => {
      res.pipe(file);

      file.on("finish", () => {
        file.close();
        console.log("Download Completed");
        resolve();
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.end();
  });
};

async function readFile(path: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", function (err, data) {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
}

const processItems = async (items: any[]) => {
  try {
    await prisma.item.createMany({
      data: items,
    });
  } catch (err) {
    console.log(err);
  }
};

async function main() {
  console.log("Inserting basic database data");

  const forumCats = await prisma.forumCategory.createMany({
    data: [
      {
        name: "Test",
        slug: "test",
        parent: 0,
        count: 0,
        hidden: false,
      },
      {
        name: "Test 2",
        slug: "test-2",
        parent: 1,
        count: 1,
        hidden: false,
      },
    ],
  });

  const galleryCats = await prisma.galleryCategory.createMany({
    data: {
      name: "Test",
      slug: "test",
      parent: 0,
      count: 1,
      hidden: false,
    },
  });

  const chatRooms = await prisma.chatRooms.createMany({
    data: [
      {
        name: "#general-chat",
        creator: 1,
      },
      {
        name: "#safety",
        creator: 1,
      },
    ],
  });

  const hashedPassword = await hash(process.env.PASS as string);

  const admin = {
    id: 1,
    email: "jason.allen.oneal@gmail.com",
    name: "Chaos Creator",
    password: hashedPassword,
    fullname: "Jason O'Neal",
    avatar: "c6b7c9cff765313f.jpg",
    subtype: 2,
    verified: true,
    admin: true,
    slug: "chaos-creator",
  };

  const admins = await prisma.user.createMany({
    data: [
      admin,
      {
        email: "system@boundinwickedry.com",
        name: "System",
        password: hashedPassword,
        fullname: "System",
        avatar: "c6b7c9cff765313f.jpg",
        subtype: 2,
        verified: true,
        admin: true,
        slug: "system",
      },
      {
        email: "ai@boundinwickedry.com",
        name: "AI",
        password: hashedPassword,
        fullname: "AI",
        avatar: "c6b7c9cff765313f.jpg",
        subtype: 2,
        verified: true,
        admin: true,
        slug: "ai",
      },
    ],
  });

  const settings = await prisma.userSettings.create({
    data: {
      uid: admin.id,
      sort: "title - asc",
      perPage: 10,
      avatarWidth: 100,
      avatarHeight: 100,
    },
  });

  const topics = await prisma.forumTopic.create({
    data: {
      title: "Test",
      text: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel ullamcorper lacus. In ut laoreet mi. Phasellus id mattis nisl. Nam ornare elit tellus. Duis a vehicula magna. Nullam tincidunt ex in est gravida, a rhoncus ipsum dictum. Morbi pharetra magna nec diam posuere, in vestibulum purus ultrices.</p><p>Nulla vitae faucibus nisl. Cras nec ornare metus, interdum maximus velit. Sed dapibus arcu eu facilisis vehicula. Cras faucibus, sem et rhoncus iaculis, ligula mauris euismod ex, eget semper nibh dui et sapien. Integer dapibus viverra nisi, ut bibendum massa tincidunt a. In eu lectus quam. Suspendisse potenti. Proin facilisis purus vitae diam vehicula, id consectetur tortor porta. Sed dictum finibus eleifend. Mauris ac nunc interdum nulla iaculis molestie. Aenean iaculis quam sem, non pellentesque odio bibendum quis. Nulla fermentum iaculis arcu, non dictum ante pulvinar eget.</p>",
      slug: "test",
      categoryId: 2,
      featured: false,
      authorId: 1,
    },
  });

  const galleries = await prisma.gallery.create({
    data: {
      title: "Lorem ipsum",
      slug: "lorem-ipsum",
      categoryId: 1,
      featured: false,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel ullamcorper lacus. In ut laoreet mi. Phasellus id mattis nisl.",
      authorId: 1,
    },
  });

  const entries = await prisma.entry.createMany({
    data: [
      {
        thumb: "",
        path: "KfuxH7iN7F13DHzm.jpg",
        height: 2688,
        width: 4032,
        galleryId: 1,
      },
      {
        thumb: "NuLfvIYsktSFx58x.png",
        path: "NuLfvIYsktSFx58x.mp4",
        height: 1440,
        width: 2560,
        galleryId: 1,
      },
    ],
  });

  console.log("Scraping shop category heirarchy.");

  const unknowns = await prisma.shopCategory.create({
    data: {
      name: "Unknowns",
      slug: "unknowns",
      parent: 0,
      count: 0,
      hidden: true,
    },
  });

  const { data } = await axios.get(process.env.DISTRIBUTOR as string);
  const $ = cheerio.load(data);

  const topNodes = $("li.level-1");

  topNodes.each(async (i, element) => {
    if (i < 15) {
      const span = $(element).children("span");
      const link = $(span).children("a");
      const text = $(link).text();
      const parent = await prisma.shopCategory.create({
        data: {
          name: text,
          slug: normalize(text),
          parent: 0,
          count: 0,
          hidden: false,
        },
      });

      let siblings = $(span).siblings();
      if (siblings.length > 0) {
        let subContainer = $(span).siblings("ul");

        $("li.level-2", subContainer).each(async (idx, el) => {
          const subSpan = $(el).children("span");
          const subLink = $(subSpan).children("a");
          const subText = $(subLink).text();
          if (!subText.includes("img")) {
            const sub = await prisma.shopCategory.create({
              data: {
                name: subText,
                slug: normalize(subText),
                parent: parent["id"],
                count: 0,
                hidden: false,
              },
            });

            let subSiblings = $(subSpan).siblings();
            if (subSiblings.length > 0) {
              let subSubContainer = $(subSpan).siblings("ul");

              $("li.level-3", subSubContainer).each(async (i, e) => {
                const subSubSpan = $(e).children("span");
                const subSubLink = $(subSubSpan).children("a");
                const subSubText = $(subSubLink).text();
                if (!subSubText.includes("img")) {
                  if (subSubText.length < 30) {
                    const subSub = await prisma.shopCategory.create({
                      data: {
                        name: subSubText,
                        slug: normalize(subSubText),
                        parent: sub["id"],
                        count: 0,
                        hidden: false,
                      },
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  });

  console.log("Downloading product file...");

  await getRemoteFile(sourceFile, downloadUrl);

  console.log("Parsing product file.");

  const dataset = await readFile(sourceFile);

  const allLines = dataset.split("\n");
  const lines = [];
  for (const l of allLines) {
    lines.push(l.trimEnd());
  }
  const headings = lines[0].split("|");
  lines.shift();

  for (const line of lines) {
    const fields = line.split("|");
    let obj = {};

    let j = 0;
    for (const heading of headings) {
      obj[heading] = fields[j];
      j++;
    }

    if (obj.title != undefined && obj.title != "") {
      products.push(obj);
    }
  }

  const items = [];
  for (const product of products) {
    const slug = normalize(product.title);
    let found = items.find((o, i) => {
      if (o.slug == slug) {
        return true;
      }
    });

    if (found) continue;

    let image = "";
    if (
      product.image != undefined &&
      product.image != "" &&
      product.image != null
    ) {
      image = await getImage(product.image);
      console.log("Image file downloaded to: ", image);
    }

    let features = "";
    if (product.features != undefined) {
      if (product.features.includes('"')) {
        const newStr = product.features.replace('"', " inch");
        features = newStr;
      }
    }

    const categories = product.category?.split(";");
    let category = categories[0];

    let cat = await prisma.shopCategory.findFirst({
      where: {
        slug: normalize(category),
      },
    });

    let active = true;
    if (cat == undefined || product.discontinued == "No") {
      if (cat == undefined) {
        cat = unknowns;
      }
      active = false;
    }

    const itemData = {
      title: normalizeName(product.title),
      slug: slug,
      model: product.model,
      price: parseInt(product.price) + "",
      categoryId: cat.id,
      image: image,
      description: product.description,
      brand: product.brand,
      color: product.color,
      size: product.size,
      option: product.option,
      flavor: product.flavor,
      scent: product.scent,
      material: product.material,
      power: product.power ? product.power : "",
      features: features,
      height: product.height,
      length: product.length,
      length_insertable: product.length_insertable,
      diameter: product.diameter ? product.diameter : "",
      in_stock: product.in_stock == "Yes" ? true : false,
      active: active,
      suggested_retail: product.suggested_retail,
    };

    items.push(itemData);
  }

  console.log("Parsing complete.");
  console.log("Inserting items...");

  await processItems(items);

  console.log("Item insert complete.");
  console.log("Seed completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
