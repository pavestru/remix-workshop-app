import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { createSupabaseServerClient } from "~/services/auth.server";

export const loader = async ({ context, request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    const { supabaseClient, headers } = createSupabaseServerClient(context, request);
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
