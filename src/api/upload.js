import express from 'express';
import aws from 'aws-sdk';

aws.config.update({
  secretAccessKey: process.env.ACCESS_KEY_SECRET,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: process.env.REGION,
});

const s3 = new aws.S3();

const router = express.Router();

router.get('/', (req, res) => { //eslint-disable-line
  const fileName = req.query.name;
  const fileType = req.query.type;

  if (!fileName || !fileType) {
    res.status(400).json({
      error: 'missing parameters',
    });
    return res.end();
  }

  const params = {
    Bucket: process.env.BUCKET,
    Key: fileName,
    Expires: 5000,
    ContentType: fileType,
    ACL: 'public-read',
  };

  s3.getSignedUrl('putObject', params, (err, data) => { //eslint-disable-line
    if (err) {
      res.status(500).json({
        error: 'error occured',
      });
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${process.env.BUCKET}.s3.amazonaws.com/${fileName}`,
    };
    res.status(201).json(returnData);
  });
});

export default router;
