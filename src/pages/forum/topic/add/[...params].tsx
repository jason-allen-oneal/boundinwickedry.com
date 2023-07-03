"use client";

import dynamic from "next/dynamic";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TopicInput } from "@/lib/validation/forum";
import { getCategorySelectOptions } from "@/lib/utils";
import { requireAuth } from "@/lib/requireAuth";
import { getCategoryById, getAllCategories } from "@/lib/services/forum";
import Layout from "@/components/Layout";
import { useNotification } from "@/lib/contexts/notification";
import { yupResolver } from "@hookform/resolvers/yup";
import topicSchema from "@/lib/validation/forum";
const Editor = dynamic(() => import("@/components/blocks/Editor/Editor"), {
  ssr: false,
});

type PageProps = {
  category: ForumCategory;
  cats: ForumCategory[];
};

const ForumAddTopicPage: NextPage<PageProps> = ({
  category,
  cats,
}: PageProps) => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const { toast } = useNotification();

  const { handleSubmit, control, reset, register } = useForm<TopicInput>({
    defaultValues: {
      title: "",
      body: "",
      category: 0,
    },
  });

  const onSubmit = useCallback(
    async (data: any) => {
      const input = {
        title: data.title,
        body: content,
        category: data.category as number,
      };

      try {
        const request = await fetch("/api/forum/add/topic", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const result = await request.json();

        if (result.status == 201) {
          toast("success", result.message, () => {
            reset();
            router.push(result.result);
          });
        } else {
          toast("error", "Something went wrong: " + result.message);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [content]
  );

  const options = getCategorySelectOptions(cats, category?.id);

  const pageData = {
    title: "Add Topic",
    description: "",
  };

  return (
    <Layout data={pageData}>
      <div className="p-4 border border-primary">
        <h2 className="mb-3 text-3xl font-bold">Add New Topic</h2>
        <div className="mt-8 mb-6 flex justify-center px-4">
          <div>
            <form
              className="p-4 bg-neutral text-neutral-content shadow-lg rounded-lg border-2 border-secondary"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label className="block">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  className="input input-bordered border-secondary w-full max-w-xs my-2"
                />
              </label>

              <Editor onChange={setContent} value={content} />

              <label className="block mt-4">
                <span>Category</span>
                <select
                  className="select select-bordered border-secondary w-full max-w-xs my-2"
                  name="category"
                >
                  <option>Choose...</option>
                  {options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-4">
                <button className="btn btn-primary btn-sm" type="submit">
                  Add!
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = requireAuth(async (ctx: any) => {
  const id = +ctx.params.params[0];

  const category = await getCategoryById(id);
  const cats = await getAllCategories();

  return {
    props: {
      category,
      cats,
    },
  };
});

export default ForumAddTopicPage;
