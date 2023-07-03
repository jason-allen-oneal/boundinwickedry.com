import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import type { NextPage } from "next";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/lib/auth";
import { useSession } from "next-auth/react";
import {
  getCategoryById,
  getGalleriesByCategoryId,
} from "@/lib/services/gallery";
import { paginate, sorter } from "@/lib/utils";
import Layout from "@/components/Layout";
import GalleryCategoryItem from "@/components/gallery/CategoryItem";
import Pagination from "@/components/blocks/Pagination";
import { Session } from "next-auth";

type PageProps = {
  category: GalleryCategory;
  galleries: Gallery[];
  session: Session;
};

export async function getServerSideProps(ctx: any) {
  const session = await getServerSession(ctx.req, ctx.res, nextAuthOptions);
  const id = +ctx.params.params[0];

  const category = await getCategoryById(id);
  const galleries = JSON.parse(
    JSON.stringify(await getGalleriesByCategoryId(id))
  );

  return {
    props: {
      category,
      galleries,
      session,
    },
  };
}

const GalleryCategoryPage: NextPage<PageProps> = (
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
    sort: "date - desc",
  };

  if (session) {
    user = session.user;
  }

  const category = props.category;

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(user.perPage);
  const [sorting, setSorting] = useState(user.sort);
  const [galleries, setGalleries] = useState<Gallery[]>(props.galleries);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (e: any) => {
    setPerPage(e.target.value);
  };

  const handleSortingChange = (e: any) => {
    setSorting(e.target.value);
  };

  const paginatedGalleries = paginate(galleries, currentPage, perPage);

  useEffect(() => {
    setGalleries(sorter(galleries, sorting, "gallery"));
  }, [sorting]);

  const data = {
    title: category?.name + " Galleries",
    description: "Galleries from " + category?.name,
  };

  return (
    <Layout data={data}>
      <div className="border border-primary">
        <div className="mt-8 flex px-2 justify-between">
          <div className="text-2xl font-bold float-left">
            Category - {category?.name}
          </div>
          <div className="float-right">
            {user.id === 0 ? (
              <p className="text-sm">
                You must <Link href="/user/login/">login</Link> or{" "}
                <Link href="/user/register/">register</Link> to post a new
                topic!
              </p>
            ) : (
              <Link
                href={"/forum/topic/add/" + category?.id + "/"}
                className="btn btn-secondary btn-sm"
              >
                New Topic
              </Link>
            )}
          </div>
        </div>
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
          </select>
        </div>
        <div className="mt-8 mb-6 p-4">
          <div className="border-2 border-primary bg-base-200 rounded p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4">
            {paginatedGalleries.length == 0 && (
              <div className="w-full border-secondary border p-2">
                <p>No galleries yet!</p>
              </div>
            )}
            {paginatedGalleries.length > 0 &&
              paginatedGalleries.map((gallery: Gallery) => (
                <GalleryCategoryItem
                  key={gallery.id}
                  gallery={gallery}
                  inCategory={true}
                />
              ))}
          </div>
        </div>
        <div className="mt-8 mb-6 flex justify-center">
          <Pagination
            type="gallery"
            itemCount={galleries.length}
            currentPage={currentPage}
            perPage={perPage}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </Layout>
  );
};

export default GalleryCategoryPage;
