import { Sidebar } from "@alfiejones/flowbite-react";
import { Modal, Spinner } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { api } from "~/utils/api";

type SearcherProps = {
  width?: string;
};
function Searcher(props: SearcherProps) {
  const [visible, setVisible] = React.useState(false);

  const [input, setInput] = React.useState("");

  const { data, isLoading } = api.user.getBySearch.useQuery({
    search: input,
  });

  const router = useRouter();

  const onRoute = (username: string) => {
    setVisible(false);
    router.push("/" + username).catch((e) => console.log(e));
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
            {visible && <InputField input={input} setInput={setInput} />}
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="it flex h-96 flex-col">
            {isLoading && (
              <div className="flex h-full w-full items-center justify-center">
                <Spinner color="warning" size="xl" />
              </div>
            )}
            {data?.length === 0 && <div>No users found</div>}
            {data?.map((user) => (
              <div
                className="flex w-full gap-2  px-2 py-2 duration-300 ease-in-out hover:cursor-pointer hover:bg-gray-300"
                onClick={() => onRoute(user.username ?? "")}
                key={user.id}
              >
                <Image
                  src={user.profileImageUrl}
                  alt="Profile picture"
                  className="rounded-full"
                  width={50}
                  height={50}
                />
                <div className="flex items-center gap-2  dark:text-white">
                  {user.username}
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

type InputFieldProps = {
  input: string;
  setInput: (input: string) => void;
};
export function InputField(props: InputFieldProps) {
  return (
    <input
      type="text"
      autoFocus
      className="h-12 w-96 rounded-lg border-solid focus:ring-yellow-400 dark:bg-gray-700"
      placeholder="Search"
      ref={(input) => input && input.focus()}
      value={props.input}
      onChange={(e) => props.setInput(e.target.value)}
    />
  );
}

export default Searcher;
