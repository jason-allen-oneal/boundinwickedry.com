"use client";

import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import type { NextPage } from "next";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/lib/auth";
import { useSession } from "next-auth/react";
import { getCategoryById, getTopicsByCategory } from "@/lib/services/forum";
import { paginate, sorter } from "@/lib/utils";
import Layout from "@/components/Layout";
import Pagination from "@/components/blocks/Pagination";
import { Session } from "next-auth";

export const getServerSideProps = async (ctx: any) => {
  const session = await getServerSession(ctx.req, ctx.res, nextAuthOptions);

  const id = +ctx.params.id[0];

  const category = await getCategoryById(id);

  const topics = await getTopicsByCategory(id);

  return {
    props: {
      category,
      topics,
      session,
    },
  };
};

type PageProps = {
  category: ForumCategory;
  topics: ForumTopic[];
  session: Session;
};

const ForumCategoryPage: NextPage<PageProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { data: session } = useSession();

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

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(user.perPage);
  const [sorting, setSorting] = useState(user.sort);
  const [topics, setTopics] = useState<ForumTopic[]>(props.topics);

  const category = props.category;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (e: any) => {
    setPerPage(e.target.value);
  };

  const handleSortingChange = (e: any) => {
    setSorting(e.target.value);
  };

  const paginatedTopics = paginate(topics, currentPage, perPage);

  const pageData = {
    title: category?.name + " Topics",
    description: "Topics from " + category?.name,
  };

  useEffect(() => {
    setTopics(sorter(topics, sorting, "forum"));
  }, [sorting]);

  return (
    <Layout data={pageData}>
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

        {category.subs.length > 0 && (
          <div className="text-sm">
            <strong>Subcategories:</strong>
          </div>
        )}
        {category.subs &&
          category.subs.map((sub: ForumCategory, idx: number) => (
            <div className="text-sm pl-4" key={idx}>
              <a href={`/forum/category/${sub.id}/${sub.slug}/`}>{sub.name}</a>
            </div>
          ))}

        <div className="mt-8 mb-6 p-4">
          <div className="">
            {paginatedTopics.length == 0 && (
              <div className="w-full border-secondary border p-2">
                <p>No topics yet!</p>
              </div>
            )}
            {paginatedTopics.length > 0 &&
              paginatedTopics.map((topic: ForumTopic, i: number) => (
                <div
                  className="w-full p-2 border-secondary border grid grid-cols-6 gap-2"
                  key={i}
                >
                  <div className="col-span-4">
                    <a href={`/forum/topic/${topic.id}/${topic.slug}/`}>
                      {topic.title}
                    </a>
                  </div>
                  <div className="col-span-2">{topic.date}</div>
                  <div className="col-span-6">
                    <p>
                      By:{" "}
                      <a href={`/user/profile/${topic.user.id}/`}>
                        {topic.user.name}
                      </a>
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-8 mb-6 flex justify-center">
          <Pagination
            type="forum"
            itemCount={topics.length}
            currentPage={currentPage}
            perPage={perPage}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ForumCategoryPage;
