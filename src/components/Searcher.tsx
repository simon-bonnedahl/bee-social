import { Sidebar } from "@alfiejones/flowbite-react";
import { Modal, Spinner } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { api } from "~/utils/api";

type SearcherProps = {
  width?: string;
};
function Searcher(props: SearcherProps) {
  const [visible, setVisible] = React.useState(false);

  const [search, setSearch] = React.useState("");

  const { data, isLoading } = api.user.getBySearch.useQuery({
    search,
  });

  const onSearch = (search: string) => {
    setSearch(search);
  };

  return (
    <React.Fragment>
      <Sidebar.Item
        onClick={() => setVisible(true)}
        className="text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
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
            <InputField onSearch={onSearch} />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="flex h-96 flex-col">
            {isLoading && <Spinner color="warning" />}
            {data?.length === 0 && <div>No users found</div>}
            {data?.map((user) => (
              <Link
                className="flex w-full gap-2  px-2 py-2 duration-300 ease-in-out hover:cursor-pointer hover:bg-gray-300"
                href={`/${user.username ?? ""}`}
                key={user.id}
              >
                <Image
                  src={user.profileImageUrl}
                  alt="Profile picture"
                  className="rounded-full"
                  width={50}
                  height={50}
                />
                <div className="flex items-center gap-2">@{user.username}</div>
              </Link>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

function InputField(props: { onSearch: (search: string) => void }) {
  const [search, setSearch] = React.useState("");

  return (
    <input
      type="text"
      className="h-12 w-96 rounded-lg border-none focus:ring-orange-400 dark:bg-gray-700"
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          props.onSearch(search);
        }
      }}
    />
  );
}

export default Searcher;
