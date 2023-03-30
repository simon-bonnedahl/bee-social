import React from "react";
import { api, RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { Spinner } from "flowbite-react";
import CreateComment from "./CreateComment";
dayjs.extend(relativeTime);

type PostProps = RouterOutputs["post"]["getAll"][number];

function Post(props: PostProps) {
  const { post, author } = props;

  const ctx = api.useContext();
  const { user } = useUser();
  const { mutate } = api.post.like.useMutation({
    onSuccess: () => {
      void ctx.post.getAll.invalidate();
    },
    onError: (e: any) => {
      console.log(e);
      toast.error("Something went wrong");
    },
  });

  const onLike = async () => {
    mutate({ postId: post.id });
  };

  return (
    <div className="rounded-lg bg-white p-8 shadow-xl dark:bg-gray-700">
      <div className="flex items-center gap-x-4">
        <img
          src={author.profileImageUrl}
          alt="Profile Picture"
          className="h-12 w-12 rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold dark:text-white">
            @{author.username}
            <span className="text-xs text-gray-500 dark:text-gray-300">
              {" · "}
              {dayjs(post.createdAt).fromNow()}
            </span>
          </span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-700 dark:text-white">{post.content}</p>
      </div>
      <div className="mt-4">
        {post.imageUrl && (
          <img src={post.imageUrl} alt="Post Image" className="rounded-lg" />
        )}
      </div>
      <div className="mt-4 flex items-center gap-x-4">
        <button className="flex items-center gap-x-2" onClick={onLike}>
          {post.likes.find((like) => like.userId === user?.id) ? (
            <AiFillHeart className="h-7 w-7 text-red-500" />
          ) : (
            <AiOutlineHeart className="h-7 w-7 dark:text-white" />
          )}

          <span className="dark:text-white">{post.likes.length}</span>
        </button>
        <div className="flex items-center gap-x-2">
          <CreateComment postId={post.id} />
          <span className="dark:text-white">{post.comments.length}</span>
        </div>
      </div>
      <div className="mt-4">
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}

type CommentSectionProps = {
  postId: number;
};

function CommentSection(props: CommentSectionProps) {
  //fetch comments
  const { data, isLoading } = api.post.getComments.useQuery({
    postId: props.postId,
  });
  if (isLoading) return <Spinner color="warning" />;
  if (!data) return <div>Something went wrong loading comments</div>;

  return (
    <div>
      <div className="flex max-h-28 flex-col items-center gap-2 overflow-y-scroll">
        {[...data].map(({ comment, user }) => {
          return (
            <div className="flex w-full items-center gap-x-4">
              <img
                src={user.profileImageUrl}
                alt="Profile Picture"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold dark:text-white">
                  @{user.username}
                  <span className="text-xs text-gray-500 dark:text-gray-300">
                    {" · "}
                    {dayjs(comment.createdAt).fromNow()}
                  </span>
                </span>

                <p className="text-sm text-gray-700 dark:text-white">
                  {comment.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Post;
