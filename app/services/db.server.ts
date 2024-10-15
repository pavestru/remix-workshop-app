import type { AppLoadContext } from "@remix-run/cloudflare";

export type UrlObject = {
  url: string;
  shortUrl: string;
};

export async function getUrls(context: AppLoadContext) {
  const env = context.cloudflare.env;
  const urlsKeys = await env.SHORT_URLS.list<{ name: string }>({
    prefix: "url:",
  });

  const urls: UrlObject[] = [];
  for (const { name } of urlsKeys.keys) {
    urls.push(JSON.parse((await env.SHORT_URLS.get(name)) || ""));
  }

  return urls;
}

export async function getUrl(context: AppLoadContext, id: string) {
  const env = context.cloudflare.env;
  const json = await env.SHORT_URLS.get(`url:${id.toLowerCase()}`);
  if (!json) return;
  const url = JSON.parse(json || "") as UrlObject;
  return url;
}

export async function createUrl(
  context: AppLoadContext,
  shortUrl: string,
  url: string
) {
  const env = context.cloudflare.env;
  await env.SHORT_URLS.put(
    `url:${shortUrl.toLowerCase()}`,
    JSON.stringify({ url, shortUrl })
  );
}

export async function deleteUrl(context: AppLoadContext, shortUrl: string) {
  const env = context.cloudflare.env;
  await env.SHORT_URLS.delete(`url:${shortUrl.toLowerCase()}`);
}
