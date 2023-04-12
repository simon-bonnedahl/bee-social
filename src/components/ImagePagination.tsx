import React from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
type ImagePaginationProps = {
  images: string[];
};

function ImagePagination(props: ImagePaginationProps) {
  const [currentPage, setCurrentPage] = React.useState(0);

  const next = () => {
    if (currentPage < props.images.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previous = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const Dot = ({ active }: { active: boolean }) => {
    return (
      <div
        className={`h-2 w-2 rounded-full bg-gray-300 ${
          active ? "bg-gray-700" : ""
        }`}
      />
    );
  };

  return (
    <>
      <div className="item-center absolute top-2/4 flex h-10 w-full justify-between px-4">
        <button onClick={previous}>
          <AiOutlineLeft />
        </button>
        <button onClick={next}>
          <AiOutlineRight />
        </button>
      </div>
      <div className="bg-balck absolute bottom-4 left-2/4 flex gap-1">
        {props.images.map((image, index) => (
          <Dot active={index === currentPage} key={index} />
        ))}
      </div>
    </>
  );
}

export default ImagePagination;
