import { Dropdown, Sidebar } from "@alfiejones/flowbite-react";
import clerkClient from "@clerk/clerk-sdk-node";
import { Modal, Spinner } from "flowbite-react";
import React from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { api } from "~/utils/api";

import Searchresults from "./Searchresults";

type SearcherProps = {
  width?: string;
};
function Searcher(props: SearcherProps) {
  const [visible, setVisible] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const { data, isLoading } = api.user.getBySearch.useQuery({
    search,
  });

  return (
    <React.Fragment>
      <Sidebar.Item
        onClick={() => setVisible(true)}
        classNameName=" text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
      >
        <div className="mt-2 flex items-center gap-5  ">
          <AiOutlineSearch className="h-8 w-8 " />
          {props.width && props.width === "full" && "Search"}
        </div>
      </Sidebar.Item>
      <Modal
        show={visible}
        onClose={() => setVisible(false)}
        dismissible={true}
        size="xl"
      >
        <Modal.Header className="w-full">
          <div className="flex w-full items-center gap-2">
            <AiOutlineSearch className="h-6 w-6 text-gray-500" />
            <input
              type="text"
              className="h-12 w-96 rounded-lg border-none focus:ring-orange-400 dark:bg-gray-700"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="h-96">
            {isLoading && <Spinner color="warning" />}
            {data?.map((user) => (
              <div className="">
                <div className="flex items-center gap-2">{user.username}</div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

export default Searcher;
