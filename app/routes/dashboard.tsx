import {
  json,
  LoaderFunction,
  redirect,
  type MetaFunction,
} from "@remix-run/cloudflare";
import {
  getAuthenticatedUser,
} from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "URL Shortener Dashboard" },
    { name: "description", content: "URL Shortener Dashboard" },
  ];
};

export const loader: LoaderFunction = async ({ context, request }) => {
  // @TODO: Add dala loading and sending to the client
  
  const { user } = await getAuthenticatedUser(context, request);
  if (user) {
    return json(/* data */);
  }
  // Not authenticated, redirect to login:
  return redirect("/auth/login", 302);
};

export default function Dashboard() {
  // @TODO: Load data from the server
  return (
    <main>
      <div>
        <h1>Dashboard</h1>
      </div>
      <div>
        {/* Add list of URLs here */}
      </div>
    </main>
  );
}
