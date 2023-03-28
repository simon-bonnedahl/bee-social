import React from "react";

type PostProps = {
  post: any;
  author: any;
};
function Post(props: PostProps) {
  return (
    <div>
      <div className="flex items-center gap-x-4">
        <img
          src={props.author.profileImageUrl}
          alt="Profile Picture"
          className="h-12 w-12 rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-gray-700 dark:text-white">
            {props.author.firstName} {props.author.lastName}
          </span>
          <span className="text-sm text-gray-400">{props.author.username}</span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-700 dark:text-white">{props.post.content}</p>
      </div>
      <div className="mt-4">
        <img
          src={props.post.imageUrl}
          alt="Post Image"
          className="rounded-lg"
        />
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
