class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filters() {
    const queryCopy = { ...this.queryStr };

    const fieldsToRemove = ["keyword", "page", "limit"];
    fieldsToRemove.forEach((el) => delete queryCopy[el]);

    const formattedQuery = {};
    for (const key in queryCopy) {
      if (key.includes("[") && key.endsWith("]")) {
        const field = key.split("[")[0];
        const op = key.split("[")[1].replace("]", "");
        if (!formattedQuery[field]) formattedQuery[field] = {};
        formattedQuery[field][op] = queryCopy[key]; // no $ here
      } else {
        formattedQuery[key] = queryCopy[key];
      }
    }

    let queryStr = JSON.stringify(formattedQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default APIFilters;
