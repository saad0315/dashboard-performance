const { strictEqual } = require("assert");
const { stringify } = require("querystring");
//i want to add 2 more filters in it one is of status and one for the assigned to
class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            // { status: { $regex: this.queryStr.keyword, $options: "i" } },
            { source: { $regex: this.queryStr.keyword, $options: "i" } },
          
          ],
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter for status
    if (queryCopy.organization) {
      this.query = this.query.where("organization").equals(queryCopy.organization);
    }
    if (queryCopy.assignedTo) {
      this.query = this.query.where("assignedTo").equals(queryCopy.assignedTo);
    }
    if (queryCopy.source) {
      this.query = this.query.where("source").equals(queryCopy.source);
    }
    if (queryCopy.status) {
      this.query = this.query.where("status").equals(queryCopy.status);
    }
  
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    const sortBy = this.queryStr.sort || "-createdAt"; // Default sorting by createdAt in descending order

    this.query = this.query.limit(resultPerPage).skip(skip).sort(sortBy);
    return this;
  }
}

module.exports = ApiFeatures;
