import { redirect } from "@remix-run/cloudflare";

export const loader = async () => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    // @TODO: We need supabaseClient and headers

    const { error } = await supabaseClient.auth.exchangeCodeForSession(code);
    if (error) {
      return redirect("/auth/login");
    }
    return redirect("/dashboard", {
      headers,
    });
  }
  return new Response("Authentication failed. Please try again", {
    status: 400,
  });
};
