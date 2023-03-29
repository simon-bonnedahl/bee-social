import { useUser } from "@clerk/nextjs";
import { Button, Modal, Pagination } from "flowbite-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { api } from "~/utils/api";
import Resizer from "react-image-file-resizer";

function CreatePost() {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState("xl");

  const { mutate } = api.post.create.useMutation();

  const onPost = async () => {
    if (!imageFile) return;

    mutate({ content: content, image: imageFile });

    // Send the post data to the server or perform any other necessary action
  };

  const onPageChange = (page: number) => {
    setPage(page);
    if (page === 2) {
      setSize("4xl");
    }
    if (page === 1) {
      setSize("xl");
    }
  };

  return (
    <React.Fragment>
      <Button
        onClick={() => setVisible(true)}
        className="bg-orange-400 p-0 px-0 hover:bg-orange-500 dark:bg-orange-400 dark:hover:bg-orange-500"
      >
        Post
      </Button>
      <Modal show={visible} onClose={() => setVisible(false)} size={size}>
        <Modal.Header>Create new post</Modal.Header>
        <Modal.Body>
          {page === 1 && (
            <DragAndDropImage
              preview={preview}
              setPreview={setPreview}
              setImageFile={setImageFile}
            />
          )}
          {page === 2 && (
            <div className="flex gap-4">
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
            onPageChange={(page) => onPageChange(page)}
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
  setImageFile: (file: string | null) => void;
};

function DragAndDropImage(props: DragAndDropImageProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null); //remove

  const handleChange = async (file: File) => {
    const resizedFile = await resizeFile(file);
    setSelectedFile(resizedFile as string);
  };

  useEffect(() => {
    if (props.preview) return;
    if (!selectedFile) {
      props.setPreview(null);
      return;
    }
    props.setImageFile(selectedFile);
    props.setPreview(selectedFile); //remove preview
  }, [selectedFile]);

  const fileTypes = ["JPG", "PNG"];

  return (
    <>
      {props.preview && (
        <div className="flex flex-col items-center gap-2">
          <img src={props.preview} alt="preview" />
          <button onClick={() => props.setPreview(null)}>Remove</button>
        </div>
      )}
      {!props.preview && (
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          minSize={0.1}
          children={
            <div className="flex h-64 flex-col items-center justify-center gap-2">
              <AiOutlinePlusCircle size={80} />
              <span className="text-lg">Drag and drop or click to upload</span>
            </div>
          }
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
            @{user?.username}
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

const resizeFile = (file: File) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      468,
      468,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });

export default CreatePost;