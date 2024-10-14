import { json, type LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { createSupabaseServerClient } from "~/services/auth.server";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const { supabaseClient, headers } = createSupabaseServerClient(
    context,
    request
  );

  // @TODO: We need provider here

  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    options: {
      redirectTo: `${url.origin}/auth/callback`,
    },
  });

  if (error) {
    return json({ success: false }, { headers });
  }

  return redirect(data.url, { headers });
};
