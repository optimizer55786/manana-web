import cookie from "cookie";
import LZUTF8 from "lzutf8";

/*
CookieOptions = {
  expire?: number | Date
  maxAge?: number
  domain?: string
  path?: string
  secure?: boolean
  httpOnly?: boolean
}
*/

export const getByteSize = (obj) => {
  const str = typeof obj !== "string" ? JSON.stringify(obj) : obj;
  return Buffer.from(str).length;
};

export const setCookie = (name, value, options = {}) => {
  const rawCookie = {};
  rawCookie[name] = value;

  if (typeof value === "object") {
    rawCookie[name] = JSON.stringify(value);
  }

  if (rawCookie[name]) {
    rawCookie[name] = LZUTF8.compress(rawCookie[name].toString(), {
      outputEncoding: "Base64",
    });
  }

  window.document.cookie = cookie.serialize(name, rawCookie[name], options);

  return window.document.cookie;
};

export const getCookie = (name) => {
  const cookies = cookie.parse(window.document.cookie);
  let value = cookies && cookies[name];

  if (!value) {
    return null;
  }

  // we need a fall-back for the decompress action for when the new
  // compression tool is pushed to production
  if (value) {
    let decompressed = LZUTF8.decompress(value, { inputEncoding: "Base64" });
    value = !decompressed ? value : decompressed;
  }

  const hasToParse = (value && value[0] === "{") || value[0] === "[";

  return hasToParse ? JSON.parse(value) : value;
};

export const removeCookie = (name) => {
  const options = { expires: new Date(1970, 1, 1, 0, 0, 1), maxAge: 0 };

  window.document.cookie = cookie.serialize(name, "", options);

  return window.document.cookie;
};
