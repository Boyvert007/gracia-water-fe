export const handlePageParams = (params) => {
    let newParams = {
      ...params,
      page: 0,
      length: 10,
    };
  
    (newParams.page = params.page + 1), (newParams.length = params.length);
  
    return newParams;
  };
  