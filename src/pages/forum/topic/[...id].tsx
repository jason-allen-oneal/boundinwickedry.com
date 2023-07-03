"use client";

import dynamic from "next/dynamic";
import type { NextPage } from "next";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useCallback } from "react";
import DOMPurify from "isomorphic-dompurify";
import { useNotification } from "@/lib/contexts/notification";
import { getCategoryById, getTopic, getComments } from "@/lib/services/forum";
import { paginate, getTime } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import commentSchema, { CommentInput } from "@/lib/validation/comment";
import Layout from "@/components/Layout";
import Breadcrumbs from "@/components/blocks/Breadcrumbs";
import DateTime from "@/components/blocks/DateTime";
import Pagination from "@/components/blocks/Pagination";
import Comment from "@/components/blocks/Comment";

const Editor = dynamic(() => import("@/components/blocks/Editor/Editor"), {
  ssr: false,
});

type PageProps = {
  category: ForumCategory;
  topic: ForumTopic;
  comments: ForumComment[];
};

const ForumTopicPage: NextPage<PageProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { data: session, status } = useSession();
  const { toast } = useNotification();

  const category = props.category;
  const topic = props.topic;
  const comments = props.comments;

  const [content, setContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [commentData, setComments] = useState(comments);
  const pageSize = 10;

  const addComment = (comment: ForumComment) => {
    setComments((prev) => [...prev, comment]);
  };

  const pageData = {
    title: topic!.title,
    description: topic!.title + " in " + category!.name,
  };

  let clean = DOMPurify.sanitize(topic!.text);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedComments = paginate(comments, currentPage, pageSize);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const data = {
      comment: content,
      id: topic!.id,
    };

    try {
      const request = await fetch("/api/forum/add/comment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await request.json();

      if (result.status === 201) {
        toast("success", result.message);
        addComment(result.result);
      } else {
        toast("success", "Something went wrong: " + result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout data={pageData}>
      <div className="border border-primary x-4 p-4 mx-auto">
        <div>
          <div className="flex justify-between items-center rounded-t border-t-2 border-l-2 border-r-2 border-primary p-4 bg-base-200">
            <div className="flex w-full sm:items-center gap-x-5 sm:gap-x-3">
              <div className="flex-shrink-0">
                <div>
                  <div className="w-20 ml-6">
                    <Image
                      src={"/images/avatars/" + topic!.User.avatar}
                      alt=""
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                  <p>
                    <Link
                      href={`/user/profile/${topic!.User.id}/${
                        topic!.User.slug
                      }/`}
                      className="text-sm text-base-content font-semibold"
                    >
                      {topic!.User.name}
                    </Link>
                  </p>
                </div>
              </div>

              <div className="grow">
                <div className="grid sm:flex sm:justify-between sm:items-center gap-2">
                  <div>
                    <ul className="text-xs text-base-content">
                      <li className="inline-block relative pr-6 last:pr-0 last-of-type:before:hidden before:absolute before:top-1/2 before:right-2 before:-translate-y-1/2 before:w-1 before:h-1 before:rounded-full">
                        {getTime("since", topic!.date)}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <Breadcrumbs
                      base="forum"
                      parent={category}
                      item={topic!.title}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5 md:space-y-8 bg-base-100 px-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 shadow-xl rounded-b border-b-2 border-l-2 border-r-2 border-primary">
            <div className="space-y-3">
              <h2 className="flex-auto mb-3 text-2xl font-bold leading-8 tracking-tight">
                {topic!.title}
              </h2>

              <div className="text-lg text-base-content">
                <div dangerouslySetInnerHTML={{ __html: clean }} />
              </div>
            </div>
          </div>
        </div>
        <div className="pt-10">
          {status !== "authenticated" ? (
            <p className="text-sm">
              You must <Link href="/user/login/">login</Link> or{" "}
              <Link href="/user/register/">register</Link> to comment!
            </p>
          ) : (
            <div>
              <div className="mx-auto max-w-lg">
                <form
                  onSubmit={handleSubmit}
                  className="p-4 bg-base-200 text-base-content shadow-lg rounded-lg border-2 border-primary max-w-lg"
                >
                  <div className="mb-2">
                    <label
                      htmlFor="comment"
                      className="text-lg text-base-content"
                    >
                      Add a Reply
                    </label>
                    <br />
                    <Editor onChange={setContent} value={content} />
                  </div>
                  <div>
                    <button
                      className="px-3 py-2 text-sm btn btn-secondary rounded"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        <div className="pt-10 space-y-4">
          {paginatedComments.length == 0 && (
            <p className="text-center">No comments yet!</p>
          )}
          {paginatedComments.length > 0 &&
            paginatedComments.map((comment: ForumComment, i: number) => (
              <Comment key={i} type="forum" comment={comment} />
            ))}
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const id = +context.params.id[0];

  let topic = await getTopic(id);

  const category = await getCategoryById(topic?.categoryId as number);

  const comments = await getComments(id);

  topic = JSON.parse(JSON.stringify(topic));

  return {
    props: {
      category,
      topic,
      comments,
    },
  };
}

export default ForumTopicPage;
