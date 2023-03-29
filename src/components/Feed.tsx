import { Spinner } from "flowbite-react";
import React from "react";
import { api } from "~/utils/api";
import Post from "./Post";

function Feed() {
  //fetch posts with trpcs

  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <Spinner size="xl" color="warning" />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="my-10 flex flex-col items-center gap-6">
      {[...data].map(({ post, author }) => (
        <Post post={post} author={author} />
      ))}
    </div>
  );
}

export default Feed;
