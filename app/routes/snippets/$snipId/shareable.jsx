import { redirect } from "remix";
import connectDb from "~/db/connectDb.server";

export async function action({ request, params }) {
    const form = await request.formData();
    const db = await connectDb();
    if (form.get("shareable") == "true") {
        await db.models.snip.updateOne({ _id: params.snipId }, { shareable: false });
        return redirect(`/snippets/${params.snipId}`);
    }
    await db.models.snip.updateOne({ _id: params.snipId }, { shareable: true });
    return redirect(`/snippets/${params.snipId}`);
}

