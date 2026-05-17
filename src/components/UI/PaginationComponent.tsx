"use client"
import Pagination from "react-responsive-pagination";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  handlePageChange,
}) => {
  return (
    <Pagination
      current={currentPage}
      total={totalPages}
      onPageChange={handlePageChange}
      className="pagination-container my-10"
    />
  );
};

export default PaginationComponent;
