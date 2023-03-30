import { Button, Modal } from "flowbite-react";
import React from "react";
import { toast } from "react-hot-toast";
import { BsChat } from "react-icons/bs";
import { api } from "~/utils/api";

function CreateComment() {
  const [comment, setComment] = React.useState<string>("");
  const [visible, setVisible] = React.useState<boolean>(false);

  const ctx = api.useContext();

  const { mutate, isLoading: isCommenting } = api.post.comment.useMutation({
    onSuccess: () => {
      setVisible(false);
      setComment("");
      toast.success("Comment created");
      void ctx.post.getAll.invalidate();
    },
    onError: (e: any) => {
      console.log(e);
      toast.error("Something went wrong");
    },
  });

  const onComment = async () => {
    // Send the comment data to the server or perform any other necessary action
    setVisible(false);
  };
  return (
    <React.Fragment>
      <BsChat
        className="h-6 w-6 dark:text-white"
        onClick={() => setVisible(true)}
      />
      <Modal show={visible} onClose={() => setVisible(false)} size="md">
        <Modal.Header>Comment</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-y-4">
            <textarea
              className="rounded-lg border border-gray-300 p-4 dark:border-gray-600"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-between">
          <Button
            className=" bg-orange-400 hover:bg-orange-500 dark:bg-orange-400 dark:hover:bg-orange-500"
            onClick={onComment}
            disabled={!comment}
          >
            Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default CreateComment;
