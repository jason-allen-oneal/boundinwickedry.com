import NextError from "next/error";
import type { NextPage } from "next";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import parse from "html-react-parser";
import Image from "next/image";
import Link from "next/link";
import { getCategoryById, getItem } from "@/lib/services/shop";
import { formatPrice, createThumbnailRatio } from "@/lib/utils";
import Layout from "@/components/Layout";
import Breadcrumbs from "@/components/blocks/Breadcrumbs";
import ShopButtons from "@/components/shop/ShopButtons";

type PageProps = {
  itemData: {
    item: Item;
    width: number;
    height: number;
  };
};

export async function getServerSideProps(context: any) {
  const id = +context.params.params[0];
  const item = await getItem(id);
  console.log("item", JSON.stringify(item));
  const { width, height } = await createThumbnailRatio(
    "/var/www/biw/public/images/shop/" + item?.image
  );

  const data = {
    item: item,
    width: width,
    height: height,
  };

  const itemData = JSON.parse(JSON.stringify(data));

  return {
    props: {
      itemData,
    },
  };
}

const ShopItemPage: NextPage<PageProps> = ({ itemData }: PageProps) => {
  const [activeTab, setActiveTab] = useState<string>("description");
  const { data } = useSession();
  const user = data?.user;
  console.log("item2", JSON.stringify(itemData.item));
  let markupType = 0;
  if (user) {
    markupType = user.subtype;
  }

  const category = itemData.item?.ShopCategory;

  const handleTab = (index: string) => {
    setActiveTab(index);
  };

  const pageData = {
    title: "",
    description: "",
  };

  return (
    <Layout data={pageData}>
      <div className="pb-">
        <div className="border-b py-6">
          <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
            <h1 className="text-xl font-semibold">{itemData.item?.title}</h1>
            <Breadcrumbs
              base="shop"
              parent={category}
              item={itemData.item?.name}
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col w-full lg:flex-row">
            <div className="grid flex-shrink-0 place-items-center my-20 lg:pr-6">
              <Image
                className="shop-item-image"
                src={`/images/shop/${itemData.item?.image as string}`}
                alt={itemData.item?.name}
                width={itemData.width}
                height={itemData.height}
              />
            </div>
            <div className="divider lg:divider-horizontal" />
            <div className="grid flex-shrink my-20">
              <div className="flex flex-col space-y-5 lg:pl-4">
                <h3 className="text-xl font-semibold">
                  {formatPrice(itemData.item?.price as string, markupType)}
                </h3>

                <ShopButtons item={itemData.item} view="item" />

                {/* Tabs */}
                <div className="tabs pt-8">
                  <button
                    type="button"
                    className={`tab tab-lg tab-lifted ${
                      activeTab == "description" ? "tab-active" : ""
                    } text-gray-400`}
                    id="product-description"
                    onClick={() => handleTab("description")}
                  >
                    Description
                  </button>
                  <button
                    type="button"
                    className={`tab tab-lg tab-lifted ${
                      activeTab == "features" ? "tab-active" : ""
                    } text-gray-400`}
                    id="product-features"
                    onClick={() => handleTab("features")}
                  >
                    Features
                  </button>
                  <button
                    type="button"
                    className={`tab tab-lg tab-lifted ${
                      activeTab == "specs" ? "tab-active" : ""
                    } text-gray-400`}
                    id="product-specs"
                    onClick={() => handleTab("specs")}
                  >
                    Specs
                  </button>
                  <button
                    type="button"
                    className={`tab tab-lg tab-lifted ${
                      activeTab == "reviews" ? "tab-active" : ""
                    } text-gray-400`}
                    id="product-reviews"
                    onClick={() => handleTab("reviews")}
                  >
                    Reviews
                  </button>
                </div>
                <div id="border-secondary bg-neutral -mt-4">
                  <div
                    className={`bg-neutral text-neutral-content p-2 ${
                      activeTab == "description" ? "" : "hidden"
                    }`}
                    id="product-description-content"
                  >
                    {parse(itemData.item?.description)}
                  </div>
                  <div
                    id="product-features-content"
                    className={`bg-neutral text-neutral-content p-2 ${
                      activeTab == "features" ? "" : "hidden"
                    } tab-content`}
                  >
                    <ul
                      role="list"
                      className="marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-400"
                    >
                      {itemData.item?.features != undefined &&
                        itemData.item?.features != "" &&
                        itemData.item?.features
                          .split(",")
                          .map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))}
                    </ul>
                  </div>
                  <div
                    id="product-specs-content"
                    className={`bg-neutral text-neutral-content p-2 ${
                      activeTab == "specs" ? "" : "hidden"
                    } tab-content`}
                  >
                    <ul
                      role="list"
                      className="marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-400"
                    >
                      {itemData.item?.color != undefined &&
                        itemData.item?.color != "" && (
                          <li>Color: {itemData.item?.color}</li>
                        )}
                      {itemData.item?.size != undefined &&
                        itemData.item?.size != "" && (
                          <li>Size: {itemData.item?.size}</li>
                        )}
                      {itemData.item?.option != undefined &&
                        itemData.item?.option != "" && (
                          <li>Option: {itemData.item?.option}</li>
                        )}
                      {itemData.item?.flavor != undefined &&
                        itemData.item?.flavor != "" && (
                          <li>Flavor: {itemData.item?.flavor}</li>
                        )}
                      {itemData.item?.scent != undefined &&
                        itemData.item?.scent != "" && (
                          <li>Scent: {itemData.item?.scent}</li>
                        )}
                      {itemData.item?.material != undefined &&
                        itemData.item?.material != "" && (
                          <li>Material: {itemData.item?.material}</li>
                        )}
                      {itemData.item?.power != undefined &&
                        itemData.item?.power != "" && (
                          <li>Power: {itemData.item?.power}</li>
                        )}
                      {itemData.item?.height != undefined &&
                        itemData.item?.height != "" && (
                          <li>Height: {itemData.item?.height}</li>
                        )}
                      {itemData.item?.length != undefined &&
                        itemData.item?.length != "" && (
                          <li>Length: {itemData.item?.length}</li>
                        )}
                      {itemData.item?.length_insertable != undefined &&
                        itemData.item?.length_insertable != "" && (
                          <li>
                            Insertable Length:{" "}
                            {itemData.item?.length_insertable}
                          </li>
                        )}
                      {itemData.item?.diameter != undefined &&
                        itemData.item?.diameter != "" && (
                          <li>Diameter: {itemData.item?.diameter}</li>
                        )}
                    </ul>
                  </div>
                  <div
                    id="product-reviews-content"
                    className={`bg-neutral text-neutral-content p-2 ${
                      activeTab == "reviews" ? "" : "hidden"
                    } tab-content`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShopItemPage;
