import type { NextPage } from "next";
import { InferGetServerSidePropsType } from "next";
import Layout from "@/components/Layout";
import { getAllCategories } from "@/lib/services/forum";

export async function getServerSideProps(context: any) {
  const cats = await getAllCategories();

  return {
    props: {
      cats,
    },
  };
}

type PageProps = {
  cats: ForumCategory[];
};

const ForumIndexPage: NextPage<PageProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const data = {
    title: "Forum Index",
    description: "Tell us your secrets.",
  };

  return (
    <Layout data={data}>
      <div className="border border-primary">
        <div className="mt-8 mb-6 flex justify-center px-4">
          <h2 className="text-3xl font-bold">Forum</h2>
        </div>
        <div>
          <div className="">
            {props.cats &&
              props.cats.map((cat: ForumCategory, i: number) => (
                <div
                  className="w-full p-2 border-secondary border grid grid-cols-6 gap-2"
                  key={i}
                >
                  <div className="col-span-4">
                    <div className="text-xl">
                      <a href={`/forum/category/${cat.id}/${cat.slug}/`}>
                        {cat.name}
                      </a>
                    </div>
                    {cat.subs.length > 0 && (
                      <div className="text-sm">
                        <strong>Subcategories:</strong>
                      </div>
                    )}
                    {cat.subs &&
                      cat.subs.map((sub: ForumCategory, idx: number) => (
                        <div className="text-sm pl-4" key={idx}>
                          <a href={`/forum/category/${sub.id}/${sub.slug}/`}>
                            {sub.name}
                          </a>
                        </div>
                      ))}
                  </div>
                  <div className="col-span-2">
                    {cat.latest == null ? (
                      <p>No topics</p>
                    ) : (
                      <div className="text-sm">
                        <a
                          href={`/forum/topic/${cat.latest.id}/${cat.latest.slug}/`}
                        >
                          {cat.latest.title}
                        </a>
                        <br />
                        By:{" "}
                        <a
                          href={`/user/profile/${cat.latest.user.id}/${cat.latest.user.slug}`}
                        >
                          {cat.latest.user.name}
                        </a>
                        <br />
                        {cat.latest.date}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForumIndexPage;
