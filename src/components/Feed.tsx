import React from "react";
import { api } from "~/utils/api";
import Post from "./Post";

function Feed() {
  //fetch posts with trpcs

  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.map(({ post, author }) => (
        <Post post={post} author={author} />
      ))}
    </div>
  );
}

export default Feed;
