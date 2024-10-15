import { ActionFunction, redirect } from "@remix-run/cloudflare";
import { Form, Link } from "@remix-run/react";
import { createUrl } from "~/services/db.server";

export const action: ActionFunction = async ({ context, request }) => {
  const formData = await request.formData();
  const shortUrl = formData.get("shortUrl");
  const url = formData.get("url");

  if (shortUrl && url) {
    try {
      await createUrl(context, shortUrl.toString(), url.toString());
    } catch (error) {
      return new Response("Error while storing the URL.", { status: 400 });
    }
    return redirect("/dashboard");
  } else {
    return new Response("Bad request", { status: 400 });
  }
};

export default function DashboardNew() {
  return (
    <Form
      method="post"
      className="flex justify-center items-start flex-col"
    >
      <label htmlFor="shortUrl" className="w-48">
        Short URL
        <input
          type="text"
          name="shortUrl"
          className="bg-zinc-100 border-zinc-500 border-2 rounded px-2"
          required
          pattern="[0-9a-zA-Z][0-9a-zA-Z\-_]*"
        />
        <span className="italic text-xs">Not case sensitive.</span>
      </label>
      <br />
      <label htmlFor="url" className="w-48">
        URL
        <input
          type="url"
          name="url"
          className="bg-zinc-100 border-zinc-500 border-2 rounded px-2"
          required
        />
      </label>
      <br />
      <div className="flex justify-center items-center">
        <Link
          to="/dashboard"
          type="button"
          className="py-1 px-4 mr-4 bg-zinc-100 border-zinc-500 border-2 rounded"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="py-1 px-4 bg-zinc-100 border-zinc-500 border-2 rounded"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
