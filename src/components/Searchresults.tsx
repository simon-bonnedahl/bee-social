import clerkClient from "@clerk/clerk-sdk-node";
import React from "react";

type SearchresultsProps = {
  input: string;
};
async function Searchresults(props: SearchresultsProps) {
  const usersMatching = await clerkClient.users.getUserList({
    query: props.input,
    limit: 10,
  });

  return (
    <div>
      {usersMatching.map((user) => (
        <div>{user.username}</div>
      ))}
    </div>
  );
}

export default Searchresults;
