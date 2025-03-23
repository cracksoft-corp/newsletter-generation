import axios from 'axios';
import fs from 'fs/promises';
import * as path from 'path';
import crypto from 'crypto';

/**
 * Replace these constants with your own values:
 * - AUTH_HEADER: The "Authorization" header from your DevTools. Example:
 *      "Token token=2131277:c495347d989e90fb7a2eb67fe7b9f464"
 * - FILE_PATH:   Path to the file on your local system you want to upload.
 * - FILE_NAME:   The filename you want to appear in ConvertKit (e.g. "image.png").
 * - CONTENT_TYPE: The MIME type of your file (image/png, image/jpeg, etc.).
 */
const token = process.env.KIT_AUTH_TOKEN; // looks like token=account_id:session_key, eg. token=2104553:09403590fhruh09fheuh039r8huehf039rh
const AUTH_HEADER  = `Token token=${token}`;

const headers = {
    'Authorization': AUTH_HEADER,
    'Content-Type': 'application/json',
     "Accept": "application/json",
     "Origin": "https://app.kit.com",
     "Referer": "https://app.kit.com/",
     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ...",
     "Accept-Language": "en-GB,en;q=0.5",
     "Sec-Fetch-Dest": "empty",
     "Sec-Fetch-Mode": "cors",
     "Sec-Fetch-Site": "cross-site",
     "Sec-GPC": "1",
     "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Brave\";v=\"133\", \"Chromium\";v=\"133\"",
     "sec-ch-ua-mobile": "?0",
     "sec-ch-ua-platform": "\"macOS\"",
};

/**
 * 1) Prepare the upload (POST to FileKit)
 * 2) Upload to S3 (PUT)
 * 3) Finalize the upload (PATCH to FileKit)
 */
export async function uploadImage(filePath: string): Promise<string> {
  // Read file from disk
  const filename = path.basename(filePath);
  const fileData = await fs.readFile(filePath);
  const fileSize = fileData.length;

  // Compute Base64 MD5
  const md5Checksum = crypto.createHash('md5').update(fileData).digest('base64');

  // STEP 1: Prepare upload
  // (Same endpoint you see in DevTools, typically /uploads/url)
  const prepareUrl = 'https://api.filekitcdn.com/uploads/url';
  const prepareBody = {
    filename,
    byte_size: fileSize,
    content_type: "image/png",
    checksum: md5Checksum
  };

//   console.log(`Prepare step: ${prepareUrl} with ${prepareBody.byte_size} bytes`);

  const prepareResp = await axios.post(prepareUrl, prepareBody, { headers: headers });
//   console.log(`Prepare step success: `, JSON.stringify(prepareResp.data, null, 2));

  // The response typically has:
  // {
  //   id: 41288855,
  //   signed_id: "eyJfcmFpbHMiOnsiZGF0YSI6NDEyODg4NTUsInB1ciI6ImJsb2JfaWQifX0=--...",
  //   direct_upload: {
  //     url: "...",
  //     headers: { "Content-Type": "image/png", ... }
  //   },
  //   ...
  // }
  const { id, signed_id, direct_upload } = prepareResp.data;
  const { url: s3Url, headers: s3Headers } = direct_upload;
  // STEP 2: Upload file bytes to S3
  // We replicate exactly the headers from direct_upload.headers
  // plus the raw file data in the PUT body.
  await axios.put(s3Url, fileData, { headers: s3Headers });
//   console.log('S3 upload success');

  // STEP 3: Finalize the upload with FileKit
  // In many setups, it's PATCH /uploads/:id with JSON body that references attachable_sgid or signed_id.
  // Check your DevTools to confirm. Here’s a common example:
  const finalizeUrl = `https://api.filekitcdn.com/files`;
  const finalizeBody = { blob_id: prepareResp.data.id };
  const finalizeResp = await axios.post(finalizeUrl, finalizeBody, { headers: headers });

//   console.log('Finalize step success:', JSON.stringify(finalizeResp.data, null, 2));
  return finalizeResp.data.email_url;
}
