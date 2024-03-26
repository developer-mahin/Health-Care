type TCalculatePagination = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};

const calculatePagination = (options: TCalculatePagination) => {
  const page: Number = Number(options.page) || 1;
  const limit: Number = Number(options.limit) || 10;
  const skip: Number = (Number(page) - 1) * Number(limit);

  const sortBy: String = options.sortBy || "createdAt";
  const sortOrder: String = options.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default calculatePagination;
