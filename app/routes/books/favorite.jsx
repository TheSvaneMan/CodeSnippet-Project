import { redirect } from "remix";
import connectDb from "~/db/connectDb.server";

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  if (form._fields.favorite == ["true"]) {
    await db.models.Book.updateOne({_id: form._fields.inputID}, {favorite: false});
    return form._fields.favorite;
  }
  await db.models.Book.updateOne({_id: form._fields.inputID}, {favorite: true});
  return redirect("/");
}
  
