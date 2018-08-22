import {getSecret} from './utils'
const Jimp = require('jimp');
const jsonpatch = require('rfc6902');
const jwt = require('jsonwebtoken');

/**
 * @desc Login endpoint controller
 * @param {*} req
 * @param {*} res
 */
export const AuthController = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  const payload = {
    username,
    password
  };

  if (!(password && username)) {
    res
      .status(401)
      .json({message: 'error'});
    return;
  }

  // Create Token
  let token;

  try {
    token = jwt.sign(payload, getSecret(), {expiresIn: '1d'});
  } catch (err) {
    console.log(err)
  }

  if (!token) {
    res
      .status(400)
      .json({message: 'Failed to sign payload'});

    return;
  }

  // Send response containing token
  res
    .status(200)
    .json({success: true, message: 'Successfully authenticated', payload, token});
  return
};

/**
 * @desc Patch endpoint controller
 * @param {*} req
 * @param {*} res
 */
export const JsonPatchController = async(req, res) => {
  let {json, patch} = req.body;

  // Check to make sure required body properties are objects when parsed
  if (typeof JSON.parse(json) !== 'object' && typeof JSON.parse(patch) !== 'object') {
    res
      .status(401)
      .json({message: 'patcher only accepts objects'});
    return;
  }

  // rfc6902 library applyPatch method* mutates the JSON obj to be patched
  let users = JSON.parse(json);

  try {
    await jsonpatch.applyPatch(users, JSON.parse(patch));
  } catch (err) {
    res
      .status(401)
      .json({message: 'Error Patching JSON'});
    return
  }

  res
    .status(200)
    .json({success: true, message: 'Patch successful', patchedObj: users});
  return
};

/**
 * @desc Thumbnail endpoint controller
 * @param {*} req
 * @param {*} res
 */
export const ResizeController = (req, res) => {
  const url = req.query.url;

  // helper function to check file extension
  const checkContentType = content => {
    switch (content) {
      case 'image/gif':
        return true;
      case 'image/jpeg':
        return true;
      case 'image/png':
        return true;
      case 'image/svg+xml':
        return true;
      default:
        return false;
        break;
    }
  };

  if (!url) {
    res
      .status(401)
      .json({message: 'url query is required'});
    return;
  }

  /* Get picture with URL, resize to thumbnail (50 x 50) and respond to request */
  Jimp
    .read(url)
    .then(image => {
      /* Check if image is of an acceptable format */
      if (!checkContentType(image.getMIME())) {
        res
          .status(402)
          .json({message: 'request is not a picture'});
        return;
      }

      image
        .resize(50, 50)
        .quality(90)
        .getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
          res.set("Content-Type", Jimp.MIME_JPEG);
          res.send(buffer);

          if (err) 
            throw err;
          }
        )

    })
    .catch(err => {
      res
        .status(401)
        .json({message: 'error fetching image'});
      return;
    })

};
