import { redirect } from "remix";
import connectDb from "~/db/connectDb.server";

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  if (form.get("favorite") == "true") {
    await db.models.Book.updateOne({_id: form.get("inputID")}, {favorite: false});
     return redirect("/");
  }
  await db.models.Book.updateOne({_id: form.get("inputID")}, {favorite: true});
  return redirect("/");
}
  
