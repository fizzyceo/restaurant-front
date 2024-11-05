export const Pagination = ({
  currentPage,
  totalRows,
  rowsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageClick(i)}
        >
          <span className="page-link">{i}</span>
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="pagination-container d-flex align-items-center justify-content-end">
      <ul className="pagination cursor-pointer">{renderPageNumbers()}</ul>
    </div>
  );
};
