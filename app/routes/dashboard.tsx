import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Outlet, useLoaderData } from "@remix-run/react";

import { isUserAuthenticated } from "~/services/auth.server";
import { getUrls } from "~/services/db.server";

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

  // @TODO check if user authenticated, otherwise redirect to login

  if (_action === "delete") {
    // @TODO Add data deletion
  }
};

export default function Dashboard() {
  const { urls, hostDomain } = useLoaderData<LoaderData>();
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
                {hostDomain}
                <strong>/{url.shortUrl}</strong> -&gt; {url.url}
                {/* @TODO add Delete button */}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
