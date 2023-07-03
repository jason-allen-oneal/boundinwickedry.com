import NextError from "next/error";
import type { NextPage } from "next";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/lib/auth";
import { useSession } from "next-auth/react";
import { paginate, sorter } from "@/lib/utils";
import { getCategoryById, getItemsByCategory } from "@/lib/services/shop";
import Pagination from "@/components/blocks/Pagination";
import Layout from "@/components/Layout";
import ProductCard from "@/components/shop/ProductCard";
import { Session } from "next-auth";

type PageProps = {
  category: ShopCategory;
  items: Item[];
  session: Session;
};

export async function getServerSideProps(ctx: any) {
  const session = await getServerSession(ctx.req, ctx.res, nextAuthOptions);
  const id = +ctx.params.params[0];

  const category = await getCategoryById(id);
  const items = await getItemsByCategory(category!.id);

  return {
    props: {
      category,
      items,
      session,
    },
  };
}

const ShopCategoryPage: NextPage<PageProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { data: session, status } = useSession();

  let user: any = {
    id: 0,
    email: "",
    name: "Guest",
    avatar: "",
    joined: 0,
    subtype: 0,
    verified: false,
    admin: false,
    slug: "guest",
    bio: "",
    socket: "",
    chat: 0,
    perPage: 12,
    sort: "title - asc",
  };

  if (session) {
    user = session.user;
  }

  const category = props.category;

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(user.perPage);
  const [sorting, setSorting] = useState(user.sort);
  const [items, setItems] = useState<Item[]>(props.items);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (e: any) => {
    setPerPage(e.target.value);
  };

  const handleSortingChange = (e: any) => {
    setSorting(e.target.value);
  };

  const paginatedItems = paginate(items, currentPage, perPage);

  useEffect(() => {
    setItems(sorter(items, sorting, "shop"));
  }, [sorting]);

  const data = {
    title: category?.name + " Items",
    description: "Items in " + category?.name,
  };

  return (
    <Layout data={data}>
      <div className="border border-secondary p-4">
        <h2>{category?.name}</h2>
        <div className="flex justify-between pt-2 px-2">
          <select
            onChange={handlePerPageChange}
            value={perPage}
            className="select select-bordered max-w-xs inline-block"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <select
            onChange={handleSortingChange}
            value={sorting}
            className="select select-bordered max-w-xs inline-block"
          >
            <option value="date - asc">Date Ascending</option>
            <option value="date - desc">Date Descending</option>
            <option value="title - asc">Title Ascending</option>
            <option value="title - desc">Title Descending</option>
            <option value="price - asc">Price Ascending</option>
            <option value="price - desc">Price Descending</option>
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {paginatedItems &&
            paginatedItems.map((item: Item) => {
              let features = [];
              if (item.features != undefined && item.features !== "") {
                features = item.features.split(",");
              }
              return (
                <ProductCard
                  item={item}
                  key={item.id}
                  features={features}
                  category={category}
                />
              );
            })}
        </div>

        <Pagination
          type="shop"
          itemCount={items.length}
          currentPage={currentPage}
          perPage={perPage}
          onPageChange={onPageChange}
        />
      </div>
    </Layout>
  );
};

export default ShopCategoryPage;
