import type { LoaderFunction } from "@remix-run/cloudflare";
import {
  isRouteErrorResponse,
  redirect,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { getUrl } from "../services/db.server";

export const loader: LoaderFunction = async ({ params, context }) => {
  const { slug } = params;
  if (!slug) throw new Response("Not found", { status: 404 });

  const urlObj = await getUrl(context, slug);
  if (urlObj?.url) {
    return redirect(urlObj.url);
  } else {
    throw new Response("Not found", { status: 404 });
  }
};

export function ErrorBoundary() {
  const error = useRouteError();
  const { slug } = useParams();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status} - Oops, /{slug} is not found</h1>
      </div>
    );
  }
  throw new Error(`Unsupported error.`);
}

