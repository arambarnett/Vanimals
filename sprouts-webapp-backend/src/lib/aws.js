const fileType = require("file-type");
const AwsSDK = require("aws-sdk");
const { nanoid } = require("../utils");

module.exports = ({ AWS }) => {
  const S3 = new AwsSDK.S3({
    region: "us-east-1",
    apiVersion: "2006-03-01",
    params: { Bucket: AWS.BUCKET_NAME },
    signatureVersion: "v4",
    credentials: {
      secretAccessKey: AWS.SECRET_KEY,
      accessKeyId: AWS.ACCESS_KEY
    }
  });

  return {
    preSignURL: async ({ key }) => S3.getSignedUrlPromise("putObject", {
      Bucket: AWS.BUCKET_NAME,
      ACL: "public-read",
      Expires: 60,
      Key: key,
    }),
    uploadFile: async (directories, buffer, metadata, tags) => {
      const fileInfo = await fileType.fromBuffer(buffer);
      const filename = nanoid();
      const dirs = directories.join("/");
      return S3.upload({
        ACL: "public-read",
        Key: `${dirs}/${filename}.${fileInfo.ext}`,
        Bucket: AWS.BUCKET_NAME,
        Body: buffer,
        Metadata: metadata,
        ContentType: fileInfo.mime
      }, { tags }).promise();
    },
  };
};
