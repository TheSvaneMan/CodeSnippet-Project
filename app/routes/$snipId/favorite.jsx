import { redirect } from "remix";
import connectDb from "~/db/connectDb.server";

export async function action({ request, params }) {
  const form = await request.formData();
  const db = await connectDb();
  if (form.get("favorite") == "true") {
    await db.models.snip.updateOne({_id: params.snipId}, {favorite: false});
    return redirect(`/${params.snipId}`);
  }
  await db.models.snip.updateOne({_id: params.snipId}, {favorite: true});
  return redirect(`/${params.snipId}`); 
}
  
