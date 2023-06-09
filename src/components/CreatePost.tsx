import { useUser } from "@clerk/nextjs";
import {
  Button,
  Modal,
  Pagination,
  Sidebar,
  Spinner,
} from "@alfiejones/flowbite-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { api } from "~/utils/api";
import Resizer from "react-image-file-resizer";
import { toast } from "react-hot-toast";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";

type CreatePostProps = {
  width?: string;
};
function CreatePost(props: CreatePostProps) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState("xl");

  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setVisible(false);
      setContent("");
      setPreview(null);
      setImageFile(null);
      setPage(1);
      setSize("xl");
      toast.success("Post created");
      void ctx.post.getAll.invalidate();
    },
    onError: (e) => {
      if (e instanceof TRPCClientError && e.message) {
        /* eslint-disable */
        const error = JSON.parse(e.message)[0];
        toast.error(error.message ?? "Something went wrong");
        /* eslint-enable */
      }
    },
  });

  const onPost = () => {
    // Send the post data to the server or perform any other necessary action
    if (!imageFile) {
      toast.error("Please upload an image");
      return;
    }
    mutate({ content: content, image: imageFile });
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
      <Sidebar.Item
        onClick={() => setVisible(true)}
        className=" text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
      >
        <div className="mt-2 flex items-center gap-5  ">
          <AiOutlinePlusCircle className="h-8 w-8 " />
          {props.width && props.width === "full" && "Post"}
        </div>
      </Sidebar.Item>
      <Modal
        show={visible}
        onClose={() => setVisible(false)}
        size={size}
        dismissible
      >
        <Modal.Body>
          {/* Header*/}
          <div className="flex h-12 w-full items-center justify-center border-b border-gray-300">
            <h1 className="text-md font-semibold">Create Post</h1>
          </div>
          <div className="flex h-96 items-center justify-center">
            {page === 1 && (
              <DragAndDropImage
                preview={preview}
                setPreview={setPreview}
                setImageFile={setImageFile}
              />
            )}
            {page === 2 && (
              <div className="flex gap-4">
                {preview && (
                  <Image src={preview} alt="preview" width={450} height={450} />
                )}

                <WriteContent content={content} setContent={setContent} />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-between">
          {page === 2 && (
            <Button
              className=" bg-orange-400 hover:bg-orange-500 dark:bg-orange-400 dark:hover:bg-orange-500"
              onClick={onPost}
              disabled={!content || !imageFile}
            >
              {isPosting ? (
                <div>
                  Posting <Spinner color="warning" size="sm" />
                </div>
              ) : (
                "Post"
              )}
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
          <Image src={props.preview} alt="preview" width={450} height={450} />
          <button onClick={() => props.setPreview(null)}>Remove</button>
        </div>
      )}
      {!props.preview && (
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          minSize={0.1}
        >
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-gray-400 dark:text-white">
            <AiOutlinePlusCircle size={60} />
            <span className="text-lg dark:text-white">
              Drag and drop or click to upload
            </span>
          </div>
        </FileUploader>
      )}
    </>
  );
}

type WriteContentProps = {
  content: string;
  setContent: (content: string) => void;
};
function WriteContent(props: WriteContentProps) {
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
          autoFocus
          ref={(input) => input && input.focus()}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500"
          placeholder="What do you want to share?"
          value={props.content}
          onChange={(e) => props.setContent(e.target.value)}
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
