import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Link, Outlet, useFetcher, useLoaderData } from "@remix-run/react";

import { isUserAuthenticated } from "~/services/auth.server";
import { deleteUrl, getUrls } from "~/services/db.server";

type LoaderData = {
  urls: Awaited<ReturnType<typeof getUrls>>;
  hostDomain: string;
};

export const meta: MetaFunction = () => {
  return [
    { title: "URL Shortener Dashboard" },
    { name: "description", content: "URL Shortener Dashboard" },
  ];
};

export const loader: LoaderFunction = async ({ context, request }) => {
  const url = new URL(request.url);
  if (await isUserAuthenticated(context, request)) {
    const urls = await getUrls(context);

    return json<LoaderData>({
      urls,
      hostDomain: url.origin,
    });
  }
  // Not authenticated, redirect to login:
  return redirect("/auth/login", 302);
};

export const action: ActionFunction = async ({ context, request }) => {
  const formData = await request.formData();
  const _action = formData.get("_action");

  if (await isUserAuthenticated(context, request)) {
    if (_action === "delete") {
      const shortUrl = formData.get("shortUrl");
      if (shortUrl) {
        await deleteUrl(context, shortUrl.toString());
      }
      return null;
    }
  }
  return redirect("/auth/login", 302);
};

export default function Dashboard() {
  const { urls, hostDomain } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  return (
    <main>
      <div>
        <h1>Dashboard</h1>
      </div>
      <Outlet />
      <div>
        <ul>
          {urls.map((url) => (
            <li key={url.shortUrl} className="mt-1">
              <fetcher.Form method="POST">
                {hostDomain}
                <strong>/{url.shortUrl}</strong> -&gt; {url.url}
                <input type="hidden" name="shortUrl" value={url.shortUrl} />
                <button
                  type="submit"
                  name="_action"
                  value="delete"
                  className="ml-4 px-4 bg-red-400 rounded text-white"
                >
                  Delete
                </button>
              </fetcher.Form>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
