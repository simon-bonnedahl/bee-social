import React, { useEffect } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Sidebar } from "@alfiejones/flowbite-react";

import { AiOutlinePlusCircle } from "react-icons/ai";
import { FileUploader } from "react-drag-drop-files";
import Image from "next/image";
import FileResizer from "react-image-file-resizer";
import ImagePagination from "./ImagePagination";

export default function CreatePostv2() {
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState<number>(1);
  const [images, setImages] = useState<string[]>([]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <Sidebar.Item
        onClick={openModal}
        className=" text-lg duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-sm hover:font-semibold"
      >
        <div className="mt-2 flex items-center gap-5  ">
          <AiOutlinePlusCircle className="h-8 w-8 " />
          {true && "Post"}
        </div>
      </Sidebar.Item>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            {/* The actual dialog panel  */}
            <Dialog.Panel className="mx-auto flex h-5/6  w-5/12 flex-col overflow-hidden rounded-xl bg-white">
              {/*Header*/}
              <div className="relative flex w-full items-center justify-center border-b border-gray-300 py-2">
                <span className="font-semibold">Create a new post</span>
                {images && (
                  <button
                    className="absolute right-4 justify-end text-sm font-semibold text-blue-500"
                    onClick={() => setStep(step + 1)}
                  >
                    Next
                  </button>
                )}
              </div>
              {/*Body*/}
              <div className="flex h-full w-full items-center justify-center">
                <DragAndDropImage images={images} setImages={setImages} />
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

type DragAndDropImageProps = {
  images: string[];
  setImages: (images: string[]) => void;
};

function DragAndDropImage(props: DragAndDropImageProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null); //remove

  const resizeFile = (file: File) =>
    new Promise((resolve) => {
      FileResizer.imageFileResizer(
        file,
        600,
        600,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const handleChange = async (file: File) => {
    const resizedFile = await resizeFile(file);
    setSelectedFile(resizedFile as string);
    // add the resized file to the state the state array with the other images
    props.setImages([...props.images, resizedFile as string]);
  };

  const fileTypes = ["JPG", "PNG"];

  return (
    <>
      {props.images.length !== 0 && (
        <div className="relative h-full w-full">
          <Image
            src={props.images[0] ?? ""}
            alt="preview"
            width={600}
            height={600}
            className="z-60 left-0 top-0 h-full w-full "
          />
          <div className="absolute bottom-2 right-2">
            <FileUploader
              handleChange={handleChange}
              name="file"
              types={fileTypes}
              minSize={0.1}
            >
              Add another
            </FileUploader>
          </div>
          {props.images.length > 1 && <ImagePagination images={props.images} />}
        </div>
      )}
      {props.images.length == 0 && (
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          minSize={0.1}
        >
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400 dark:text-white">
            <AiOutlinePlusCircle size={80} />
            <span className="text-lg dark:text-white">
              Drag and drop or click to upload
            </span>
          </div>
        </FileUploader>
      )}
    </>
  );
}
