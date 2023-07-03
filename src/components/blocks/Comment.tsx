import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { getTime } from "@/lib/utils";
import { useNotification } from "@/lib/contexts/notification";

type IComment = ForumComment | GalleryComment;

type Props = {
  comment: IComment;
  type: string;
};

const Comment = ({ comment, type }: Props) => {
  const [votes, setVotes] = useState<number>(comment.votes);
  const { toast } = useNotification();

  const handleVote = async (id: number, type: string) => {
    const input = {
      id: id,
      type: type,
    };

    try {
      const request = await fetch("/api/vote/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const result = await request.json();

      if (result.status == 201) {
        toast('success', "Vote added!");
        setVotes(result.result.votes);
      } else {
        toast('error', "Something went wrong: " + result.message);
        console.log("error", JSON.stringify(result));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <div className="flex-shrink-0 mr-3">
        <img className="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10" src={`/images/avatars/${comment.User.avatar}`} alt="" />
      </div>
      <div className="flex-1 border border-secondary rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
        <strong>{comment.User.name}</strong> <span className="text-xs text-gray-400">{getTime('short', comment.date)}</span>
        <p className="text-sm">
          Upvote?{" "}
          <FontAwesomeIcon
            onClick={() => handleVote(comment.id, type)}
            icon={faThumbsUp}
          />{" "}
          {votes}
        </p>
        <p className="text-sm">
          {comment.text}
        </p>
      </div>
    </div>
  );
};

export default Comment;
