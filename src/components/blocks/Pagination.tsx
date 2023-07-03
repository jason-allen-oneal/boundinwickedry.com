type Props = {
  type: string;
  itemCount: number;
  perPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ type, itemCount, perPage, currentPage, onPageChange }: Props) => {
  const pageCount = Math.ceil(itemCount / perPage);

  if (pageCount === 1) {
    return (
      <div className="btn-group text-center">
        <button className="btn btn-sm btn-disabled">1</button>
      </div>
    );
  }

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="flex items-center">
    <div className="btn-group mx-auto  text-center">
      {pages.map((page: number) => (
        <button
          key={page}
          className={`btn btn-sm btn-secondary ${page === currentPage ? "btn-active" : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
    </div>
  );
};

export default Pagination;
