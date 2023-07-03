import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import CommentForm from "./CommentForm";
import Comments from "./Comments";

type IComment = ForumComment | GalleryComment;
type IComments = IComment[];
type Thing = ForumTopic | Gallery;
type Props = {
  type: string;
  topic?: ForumTopic;
  gallery?: Gallery;
  comments: IComments;
};

const CommentSection = (props: Props) => {
  const { status } = useSession();

  const [commentData, setComments] = useState<IComments>(props.comments);

  const addComment = (comment: IComment) => {
    setComments([...commentData, comment]);
  };

  let thing: Thing;
  if (props.type == "forum") {
    thing = props.topic;
  } else {
    thing = props.gallery;
  }

  return (
    <div className="mx-auto">
      <div className="py-3 px-2">
        {status !== "authenticated" ? (
          <p className="mx-auto">
            You must{" "}
            <Link href="/user/login/">
              login
            </Link>{" "}
            or{" "}
            <Link href="/user/register/">
              register
            </Link>{" "}
            to post a comment!
          </p>
        ) : (
          <CommentForm
            type={props.type}
            thing={thing}
            addComment={addComment}
          />
        )}
      </div>
      <div className="mx-auto mt-4 py-3 px-2">
        <Comments type={props.type} comments={commentData} />
      </div>
    </div>
  );
};

export default CommentSection;
