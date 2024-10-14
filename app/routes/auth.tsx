import { MetaFunction } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "URL Shortener Authentication" },
    { name: "description", content: "URL Shortener Authentication" },
  ];
};

export default function Auth() {
  return (
    <main>
      <div>
        <h1>
          URL Shortener Authentication
        </h1>
        <div>
          <Outlet />
        </div>
      </div>
    </main>
  );
}
