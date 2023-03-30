import { Button, Modal, Spinner } from "flowbite-react";
import React from "react";
import { toast } from "react-hot-toast";
import { BsChat } from "react-icons/bs";
import { api } from "~/utils/api";

type CreateCommentProps = {
  postId: number;
};

function CreateComment(props: CreateCommentProps) {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [content, setContent] = React.useState<string>("");

  const ctx = api.useContext();

  const { mutate, isLoading: isCommenting } = api.post.comment.useMutation({
    onSuccess: () => {
      setVisible(false);
      setContent("");
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
    mutate({ content, postId: props.postId });
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
          <CommentInput content={content} setContent={setContent} />
        </Modal.Body>
        <Modal.Footer className="flex justify-between">
          <Button
            className=" bg-orange-400 hover:bg-orange-500 dark:bg-orange-400 dark:hover:bg-orange-500"
            onClick={onComment}
            disabled={!content || isCommenting}
          >
            {isCommenting ? <Spinner color="warning" /> : "Comment"}
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
type CommentInputProps = {
  content: string;
  setContent: (content: string) => void;
};
function CommentInput(props: CommentInputProps) {
  const [comment, setComment] = React.useState<string>(props.content);
  return (
    <div className="flex flex-col gap-y-4">
      <textarea
        className="rounded-lg border border-gray-300 p-4 dark:border-gray-600"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            props.setContent(comment);
          }
        }}
      />
    </div>
  );
}

export default CreateComment;
