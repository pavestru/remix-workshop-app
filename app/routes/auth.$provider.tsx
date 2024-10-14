import { json, type LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Provider } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "~/services/auth.server";

export const loader = async ({ 
  context, request, params 
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const { supabaseClient, headers } = createSupabaseServerClient(context, request);

  const provider = params.provider as Provider;

  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${url.origin}/auth/callback`
    }
  });

  if (error) {
    return json({ success: false }, { headers });
  }

  return redirect(data.url, { headers });
};
  