import { useUser } from "@clerk/nextjs";
import { Button, Modal, Pagination } from "flowbite-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { api } from "~/utils/api";

function CreatePost() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(1);

  const { mutate } = api.post.create.useMutation();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setImage(event.target.files[0]!);
  };

  const onPost = () => {
    // Send the post data to the server or perform any other necessary action
    mutate({ content: content, imageUrl: preview ?? "" });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Send the post data to the server or perform any other necessary action
  };

  return (
    <React.Fragment>
      <Button
        onClick={() => setVisible(true)}
        className=" bg-orange-400 hover:bg-orange-500 dark:bg-orange-400 dark:hover:bg-orange-500"
      >
        <div className="flex items-center gap-2">
          Post
          <AiOutlinePlusCircle className="h-6 w-6" />
        </div>
      </Button>
      <Modal show={visible} onClose={() => setVisible(false)}>
        <Modal.Header>Create new post</Modal.Header>
        <Modal.Body>
          {page === 1 && (
            <DragAndDropImage preview={preview} setPreview={setPreview} />
          )}
          {page === 2 && (
            <div className="flex">
              {preview && <img src={preview} />}

              <WriteContent content={content} setContent={setContent} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="flex justify-between">
          <Pagination
            currentPage={page}
            layout="navigation"
            totalPages={2}
            onPageChange={(page) => setPage(page)}
          />
          {page === 2 && content && (
            <Button
              className=" bg-orange-400 hover:bg-orange-500 dark:bg-orange-400 dark:hover:bg-orange-500"
              onClick={onPost}
            >
              Share
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

type DragAndDropImageProps = {
  preview: string | null;
  setPreview: (preview: string | null) => void;
};

function DragAndDropImage(props: DragAndDropImageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (file: File) => {
    console.log("File dropped");

    setSelectedFile(file);
  };

  useEffect(() => {
    if (props.preview) return;
    if (!selectedFile) {
      props.setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile as Blob);
    props.setPreview(objectUrl);
  }, [selectedFile]);

  const fileTypes = ["JPG", "PNG"];

  return (
    <>
      {props.preview && (
        <div>
          <img src={props.preview} alt="preview" />
          <button></button>
        </div>
      )}
      {!props.preview && (
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
        />
      )}
    </>
  );
}

type WriteContentProps = {
  content: string;
  setContent: (content: string) => void;
};
function WriteContent(props: WriteContentProps) {
  const [content, setContent] = useState(props.content);

  const { user } = useUser();
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Image
          src={user?.profileImageUrl || ""}
          alt="profile picture"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold dark:text-white">
            {user?.username}
          </span>
        </div>
      </div>

      <form className="w-full">
        <textarea
          id="message"
          rows={6}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500"
          placeholder="What do you want to share?"
          value={content}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              props.setContent(content);
            }
          }}
          onChange={(e) => setContent(e.target.value)}
        />
      </form>
    </div>
  );
}

export default CreatePost;
