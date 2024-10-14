import { type AppLoadContext, redirect } from "@remix-run/cloudflare";

import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

export const createSupabaseServerClient = (
  context: AppLoadContext,
  request: Request
) => {
  const env = context.cloudflare.env as {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  };
  const headers = new Headers();
  const supabaseClient = createServerClient(
    env.SUPABASE_URL!,
    env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
    }
  );
  return { supabaseClient, headers };
};

export const getAuthenticatedUser = async (
  context: AppLoadContext,
  request: Request
) => {
  const { supabaseClient, headers } = createSupabaseServerClient(
    context,
    request
  );

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  if (!session) {
    throw redirect("/auth/login");
  }

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();

  if (error) {
    // JWT validation has failed
    throw redirect("/auth/login");
  }

  return { session, user, headers };
};

export const isUserAuthenticated = () => {
  // @TODO: Implement this function
  return false;
};
