import { json, redirect } from "@remix-run/cloudflare";

import { isUserAuthenticated } from "~/services/auth.server";

// @TODO: Finalize the loader function

export const loader = async () => {
  if (isUserAuthenticated()) {
    return json({ /* data */ });
  }
  // Not authenticated, redirect to login:
  return redirect("/auth/login", 302);
};

export default function Dashboard() {
  return (
    <div>
      <h2>Welcome</h2>
    </div>
  );
}
