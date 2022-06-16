import { redirect } from "remix";
import connectDb from "~/db/connectDb.server";

export async function action({ request, params }) {
    const form = await request.formData();
    const db = await connectDb();
    const currentUserID = form.get("userID");
    if (form.get("followSnip") == "true") {
        await db.models.user.updateOne({ _id: currentUserID }, { $pull: { following: params.snipId } });
        return redirect(`/snippets/${params.snipId}`);
    } else {
        await db.models.user.updateOne({ _id: currentUserID }, { $push: { following: params.snipId } });
    }
    return redirect(`/snippets/${params.snipId}`);
}

