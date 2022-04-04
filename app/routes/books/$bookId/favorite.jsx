import { redirect } from "remix";
import connectDb from "~/db/connectDb.server";

export async function action({ request, params }) {
  const form = await request.formData();
  const db = await connectDb();
  if (form.get("favorite") == "true") {
    await db.models.Book.updateOne({_id: params.bookId}, {favorite: false});
    return redirect(`/books/${params.bookId}`);
  }
  await db.models.Book.updateOne({_id: params.bookId}, {favorite: true});
  return redirect(`/books/${params.bookId}`);
}
  
