import { api, RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { Spinner } from "@alfiejones/flowbite-react";
import CreateComment from "./CreateComment";
import Image from "next/image";
import { BsChatFill } from "react-icons/bs";
import Link from "next/link";
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

  const onLike = () => {
    mutate({ postId: post.id });
  };

  return (
    <div className="bg-white p-8  dark:bg-gray-800">
      <div className="flex items-center gap-x-4">
        <Link className="hover:cursor-pointer" href={"/" + author.username}>
          <Image
            src={author.profileImageUrl}
            alt="Profile Picture"
            className="h-12 w-12 rounded-full"
            width={40}
            height={40}
          />
        </Link>
        <div className="flex flex-col">
          <span className="text-sm font-semibold dark:text-white">
            <Link className="hover:cursor-pointer" href={"/" + author.username}>
              {author.username}
            </Link>
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
          <Image
            src={post.imageUrl}
            alt="Post Image"
            className="rounded-lg"
            width={500}
            height={500}
          />
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
            <div className="flex w-full items-center gap-x-4" key={comment.id}>
              {user.profileImageUrl && (
                <Link
                  className="hover:cursor-pointer"
                  href={"/" + user.username}
                >
                  <Image
                    src={user.profileImageUrl}
                    alt="Profile Picture"
                    className="h-10 w-10 rounded-full"
                    width={40}
                    height={40}
                  />
                </Link>
              )}

              <div className="flex flex-col">
                <span className="text-xs font-semibold dark:text-white">
                  <Link
                    className="hover:cursor-pointer"
                    href={"/" + user.username}
                  >
                    {user.username}
                  </Link>

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

export function PostSmall(props: PostProps) {
  const { post, author } = props;
  return (
    <Link href={`/post/${post.id}`} className="group">
      {post.imageUrl && (
        <div className="relative h-80 w-80 md:h-72  md:w-72">
          <Image
            src={post.imageUrl}
            alt="Post Image"
            width={325}
            height={325}
          />
          {/*Shade Overlay*/}
          <div className="z-5 absolute inset-0 flex items-center justify-center  bg-black opacity-0 duration-500 ease-in-out  group-hover:opacity-40"></div>
          {/*Likes and Comments Overlay*/}
          <div className="z-5 absolute inset-0 flex items-center justify-center gap-4  opacity-0 duration-500 ease-in-out  group-hover:opacity-100">
            <div className="flex items-center gap-2 group-hover:opacity-100">
              <AiFillHeart className="h-6 w-6 text-white" />
              <p className="text-2xl font-bold text-white">
                {post.likes.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <BsChatFill className="h-5 w-5  text-white" />
              <p className="text-2xl font-bold text-white">
                {post.comments.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}

export default Post;
