import { redirect } from "remix";
import connectDb from "~/db/connectDb.server";

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  
  await db.models.snip.deleteOne({ _id: form._fields.inputID});
  return redirect("/snippets");
}