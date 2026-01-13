const { strictEqual } = require("assert");
const { default: mongoose } = require("mongoose");
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
            { userName: { $regex: this.queryStr.keyword, $options: "i" } },
            { userEmail: { $regex: this.queryStr.keyword, $options: "i" } },
          ],
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };
    const removeFields = ["keyword", "page", "limit", "pageSize", "sort", "selectedmonth"];
    removeFields.forEach((key) => delete queryCopy[key]);
    // if (queryCopy.companyName) {
    //   queryCopy.companyName = { $ne: queryCopy.companyName }; // Exclude matching companyName
    // }
    if (queryCopy.companyName) {
      this.query = this.query.where("companyName").equals(queryCopy.companyName);
    }
    if (queryCopy.organization) {
      this.query = this.query.where("organization").equals(queryCopy.organization);
    }
    // if (queryCopy.assigned) {
    //   this.query = this.query.where("assigned.user").equals(queryCopy.assigned);
    // }
if (queryCopy.assigned) {
      if (mongoose.Types.ObjectId.isValid(queryCopy.assigned)) {
        // Method 1: Using mongoose.Types.ObjectId directly in find
        this.query = this.query.find({ "assigned.user": mongoose.Types.ObjectId(queryCopy.assigned) });
      } else {
        console.error('Invalid ObjectId format for assigned filter:', queryCopy.assigned);
      }
      delete queryCopy.assigned;
    }
    if (queryCopy.status) {
      this.query = this.query.where("status").equals(queryCopy.status);
    }
  
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));

 if (this.queryStr.selectedmonth) {
      // expected format: "YYYY-MM"
      const [yStr, mStr] = this.queryStr.selectedmonth.split("-");
      const year = Number(yStr);
      const month = Number(mStr); 
      if (!Number.isNaN(year) && !Number.isNaN(month) && month >= 1 && month <= 12) {
        // start = first day of that month 00:00:00 UTC
        const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
        // end = first day of next month 00:00:00 UTC
        const end = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
        this.query = this.query.find({ createdAt: { $gte: start, $lt: end } });
        // If your date field is different, replace "createdAt" with that field name.
      }
      }
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
      // {
            //   [`firstName`]: {
            //     $regex: this.queryStr.keyword,
            //     $options: "i",
            //   },
            // },
            // {
            //   [`first_name`]: {
            //     $regex: this.queryStr.keyword,
            //     $options: "i",
            //   },
            // },
            // {
            //   [`name`]: {
            //     $regex: this.queryStr.keyword,
            //     $options: "i",
            //   },
            // },
            // {
            //   [`firstName`]: {
            //     $regex: this.queryStr.keyword,
            //     $options: "i",
            //   },
            // },
            // {
            //     [`last_name`]: {
            //       $regex: this.queryStr.keyword,
            //       $options: "i",
            //     },
            //   },
            // {
            //   [`user_name`]: {
            //     $regex: this.queryStr.keyword,
            //     $options: "i",
            //   },
            // },
            // {
            //     [`userName`]: {
            //       $regex: this.queryStr.keyword,
            //       $options: "i",
            //     },
            //   },
  
            // {
            //   [`user_email`]: {
            //     $regex: this.queryStr.keyword,
            //     $options: "i",
            //   },
            // },

            // {
            //   [`user_phone`]: {
            //     $regex: this.queryStr.keyword,
            //     $options: "i",
            //   },
            // },
            // {
            //     [`phoneNumber`]: {
            //       $regex: this.queryStr.keyword,
            //       $options: "i",
            //     },
            //   },