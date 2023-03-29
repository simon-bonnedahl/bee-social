import React from "react";
import { RouterOutputs } from "~/utils/api";

type PostProps = RouterOutputs["post"]["getAll"][number];

function Post(props: PostProps) {
  const { post, author } = props;
  console.log(post.imageUrl);
  return (
    <div>
      <div className="flex items-center gap-x-4">
        <img
          src={author.profileImageUrl}
          alt="Profile Picture"
          className="h-12 w-12 rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">@{author.username}</span>
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
        <button className="flex items-center gap-x-2">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
          <span className="text-sm text-gray-400">Like</span>
        </button>
        <button className="flex items-center gap-x-2">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <span className="text-sm text-gray-400">Comment</span>
        </button>
        <button className="flex items-center gap-x-2">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
          <span className="text-sm text-gray-400">Share</span>
        </button>
      </div>
    </div>
  );
}

export default Post;
