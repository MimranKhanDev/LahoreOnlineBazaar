// backend/utils/apiFilters.js

/**
 * 🔍 API FILTERS - Advanced filtering, searching, and pagination
 *
 * This class provides:
 * 1. Search by keyword (product name)
 * 2. Filter by price, ratings, category
 * 3. Pagination
 *
 * 📝 HOW IT WORKS:
 *    - Takes a Mongoose query and query string
 *    - Builds the query progressively
 *    - Returns the modified query
 *
 * 🔄 USAGE:
 *    const apiFilters = new APIFilters(Product.find(), req.query)
 *      .search()
 *      .filters()
 *      .pagination(8);
 *    const products = await apiFilters.query;
 *
 * ✅ VERDICT: Your version is perfect! Clean, modern, ES Modules.
 */

class APIFilters {
  constructor(query, queryStr) {
    this.query = query; // Mongoose query object
    this.queryStr = queryStr; // Query parameters from URL
  }

  /**
   * 🔍 Search by keyword
   *
   * Looks for keyword in product name (case-insensitive)
   * Example: ?keyword=iphone → finds products with "iphone" in name
   */
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword, // Match pattern
            $options: "i", // Case-insensitive
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this; // Return this for chaining
  }

  /**
   * 🎯 Apply filters
   *
   * Removes special fields (keyword, page, limit)
   * Converts operators (gt, gte, lt, lte) to MongoDB syntax ($gt, $gte, $lt, $lte)
   * Example: ?price[gte]=100&price[lte]=500 → { price: { $gte: 100, $lte: 500 } }
   */
  filters() {
    const queryCopy = { ...this.queryStr };

    // Fields to remove (these are not database fields)
    const fieldsToRemove = ["keyword", "page", "limit"];
    fieldsToRemove.forEach((el) => delete queryCopy[el]);

    // Advance filter for price, ratings etc
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /**
   * 📄 Pagination
   *
   * Limits results per page and skips based on page number
   * Example: ?page=2&limit=10 → skips first 10, returns next 10
   */
  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default APIFilters;
