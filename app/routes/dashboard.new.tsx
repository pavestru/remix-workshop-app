import { ActionFunction } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";

export const action: ActionFunction = async ({ context, request }) => {
  const formData = await request.formData();

  // @TODO check if user authenticated, otherwise redirect to login

  // @TODO Save data
};

export default function DashboardNew() {
  return (
    <Form method="post">
      {/* Complete form */}
    </Form>
  );
}
