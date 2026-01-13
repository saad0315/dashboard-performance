const multer = require("multer");
const S3 = require("aws-sdk/clients/s3");
const AWS = require("aws-sdk");
const wasabiEndpoint = new AWS.Endpoint("s3.us-central-1.wasabisys.com");
const multerS3 = require("multer-s3");
const { v4: uuidv4 } = require("uuid"); // Import uuid for generating unique identifiers
const path = require("path"); // Node.js path module for working with file paths

// access-key= NOTIXZAPSQGPLC6FLE7Q
// secret-key= RwOTigWzCtenlBhfPegiyzemiPBiDvahbWGUtCv3
// access-key= QGJHSRVH4E1X0MEVDG0Z
// secret-key= 2sZufW6h6o4lCMAXC0MN5fRFDkwacUrXKRLOCV8Z

AWS.config.update({
  endpoint: wasabiEndpoint,
  // accessKeyId: '1MBT0WQPOD0FSWQBRC1F',
  accessKeyId: "B7EM1YEFRZBSO0XZ1OVZ",
  secretAccessKey: "5s9eeXCMbXzRpLMKSwbfLJyDLEXUgzwTIaNfnPJR",
  region: "us-central-1", // Replace with your desired region
});
// AWS.config.update({
//   endpoint: wasabiEndpoint,
//   // accessKeyId: '1MBT0WQPOD0FSWQBRC1F',
//   accessKeyId: "QGJHSRVH4E1X0MEVDG0Z",
//   secretAccessKey: "2sZufW6h6o4lCMAXC0MN5fRFDkwacUrXKRLOCV8Z",
//   region: "us-central-1", // Replace with your desired region
// });

const s3 = new AWS.S3();

const uploadAWS = (directory) =>
  multer({
    storage: multerS3({
      s3: s3,
      bucket: "bellevue-portal",
      acl: "public-read", // Or any other ACL settings you prefer
      contentType: multerS3.AUTO_CONTENT_TYPE,
      // key: function (req, file, cb) {
      //   const fileExtension = path.extname(file.originalname);
      //   const fileName = directory + uuidv4() + fileExtension;

      //   cb(null, fileName); // Fix the key function
      // },

      key: function (req, file, cb) {
      console.log(req.params);
      const fileExtension = path.extname(file.originalname);
      const fileName =
        `${req.params.projectId}/` +
        `${req.params.category}/` +
        uuidv4() +
        fileExtension;

      cb(null, fileName); // Fix the key function
    },
    }),
    // });
  }).array("files", 5);

const uploadAWSSingle = (directory) =>
  multer({
    storage: multerS3({
      s3: s3,
      bucket: "ebook-sales",
      acl: "public-read",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname);
        const fileName = directory + uuidv4() + fileExtension;
        console.log("file nameeeee uploaded",fileName);
        cb(null, fileName);
      },
    }),
  }).single("file");

module.exports = { uploadAWS, uploadAWSSingle };
