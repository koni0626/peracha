import { API_BASE } from "../api";

export function safeHref(href: string) {
  if (/^(https?:|mailto:)/i.test(href)) {
    return href;
  }
  if (/^www\./i.test(href)) {
    return `https://${href}`;
  }
  return "#";
}

export function safeMediaSrc(src: string) {
  const normalizedApiSrc = normalizeApiMediaSrc(src);
  if (normalizedApiSrc) {
    return normalizedApiSrc;
  }
  if (/^(https?:|data:image\/|blob:)/i.test(src) || src.startsWith("/")) {
    return src;
  }
  return "#";
}

function normalizeApiMediaSrc(src: string) {
  try {
    const url = new URL(src, API_BASE);
    if (!url.pathname.startsWith("/api/")) {
      return null;
    }
    if (!["localhost", "127.0.0.1"].includes(url.hostname)) {
      return null;
    }
    const base = new URL(API_BASE);
    return `${base.origin}${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export function trimUrlPunctuation(url: string) {
  const match = url.match(/^(.+?)([.,!?;:、。)]*)$/);
  return { hrefText: match?.[1] ?? url, trailing: match?.[2] ?? "" };
}
