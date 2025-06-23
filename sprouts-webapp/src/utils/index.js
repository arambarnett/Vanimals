import querystring from "query-string";
import { useEffect, useLayoutEffect } from "react";

export const getVideoIdFromYoutubeLink = (link = "") => {
  const regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;
  const match = link.match(regex);
  if (match) return match[1];
  return null;
};

export const chopString = (str, length) => (str.length > length ? `${str.substring(0, length)}...` : str);

export const randomFrom = (array) => array[Math.floor(Math.random() * array.length)];

export const normalizeUsername = (username) => username
  .normalize("NFD")
  .replace(/[\u0300-\u036f]|\s|[\W_]+/g, "")
  .toLowerCase();

export const uploadFileToS3 = (preSignedUrl, file) => new Promise((res) => {
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", preSignedUrl, true);
  xhr.onload = (data) => {
    if (xhr.status === 200) {
      res(data);
    } else res({ error: data });
  };
  xhr.onerror = (error) => {
    res({ error });
  };
  xhr.send(file); // `file` is a File object here
});

export const copyToClipboard = (val) => {
  const el = document.createElement("textarea");
  el.style.display = "none";
  el.value = val;
  document.body.appendChild(el);
  el.select();
  el.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(el.value);
};

export const cancelPropagation = (e) => {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
};

export const isRoleTicked = (i) => ["0", "4", "5", "6"].includes(String(i));

export const parseJsonOrNull = (str) => {
  try {
    return JSON.parse(str);
  } catch (_) {
    return null;
  }
};

export const GaEvent = ({ action, category, label }) => {
  if (process.env.NEXT_PUBLIC_ENABLE_GA === "true") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
    });
  }
};

export const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const hexToRgbA = (hex, alpha = 255) => {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join("")}`;
    /* eslint-disable-next-line no-bitwise */
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255, alpha];
  }
  throw new Error("Bad Hex");
};

export const hexToVec4 = (hex) => {
  const rgb = hexToRgbA(hex);
  return rgb.map((key) => Number((key / 255).toFixed(4)));
};

export const pushIf = (cond, el) => (cond ? [el] : []);

export const getBrowserLanguageNumber = () => {
  if (typeof navigator !== "undefined") {
    const browserLang = navigator.language || navigator.userLanguage || "";
    const languageCode = Number(browserLang.startsWith("es"));
    return languageCode;
  }
  return 1;
};
export const getClientsideHref = () => {
  if (typeof window !== "undefined") {
    return {
      host: window.location.origin,
      query: querystring.parse(window.location.search),
      href: window.location.href,
      hash: window.location.hash.substr(1),
    };
  }
  return {
    host: "",
    query: {},
    hash: "",
  };
};

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export const calculateGroup = (id) => {
  const lastLetter = id[id.length - 1];
  const num = ALPHABET.indexOf(lastLetter);
  const group = num % 2 === 0;

  return Number(group);
};

export const getVideoIdByUrl = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : "";
};

export const millisToTimeComponents = (ms) => {
  let h;
  let m;
  let s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s %= 60;
  h = Math.floor(m / 60);
  m %= 60;
  const d = Math.floor(h / 24);
  h %= 24;

  return {
    d,
    h,
    m,
    s,
  };
};

export const formatPrice = (price) => `${String(price).slice(0, -2)}.${String(price).slice(-2)}`;
