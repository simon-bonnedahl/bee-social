import { Button, Modal } from "flowbite-react";
import React, { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";

function CreatePost() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setImage(event.target.files[0]!);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Send the post data to the server or perform any other necessary action
  };

  const [visible, setVisible] = useState(false);

  return (
    <React.Fragment>
      <Button
        onClick={() => setVisible(true)}
        className=" bg-orange-400 hover:bg-orange-500 dark:bg-orange-400 dark:hover:bg-orange-500"
      >
        <div className="flex items-center gap-2">
          Create Post
          <AiOutlinePlusCircle className="h-6 w-6" />
        </div>
      </Button>
      <Modal show={visible} onClose={() => setVisible(false)}>
        <Modal.Header>Terms of Service</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              With less than a month to go before the European Union enacts new
              consumer privacy laws for its citizens, companies around the world
              are updating their terms of service agreements to comply.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The European Union’s General Data Protection Regulation (G.D.P.R.)
              goes into effect on May 25 and is meant to ensure a common set of
              data rights in the European Union. It requires organizations to
              notify users as soon as possible of high-risk data breaches that
              could personally affect them.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setVisible(true)}>I accept</Button>
          <Button color="gray" onClick={() => setVisible(true)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default CreatePost;
