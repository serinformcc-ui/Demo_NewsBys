import { put } from "@vercel/blob";
import { getSupabaseAdmin } from "./_lib/supabaseAdmin.js";
import { readJson, requireMethod, sendJson } from "./_lib/request.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, "POST")) return;

  try {
    const body = await readJson(req);
    const { clientId, uploadedByProfileId, fileName, contentType, base64 } = body;

    if (!clientId || !fileName || !base64) {
      sendJson(res, 400, { error: "clientId, fileName and base64 are required" });
      return;
    }

    const safeName = String(fileName).replace(/[^a-zA-Z0-9._-]+/g, "-");
    const pathname = `newsbys/${clientId}/${Date.now()}-${safeName}`;
    const buffer = Buffer.from(base64, "base64");
    const blob = await put(pathname, buffer, {
      access: "public",
      contentType: contentType || "application/octet-stream",
      addRandomSuffix: true,
    });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("media_assets")
      .insert({
        client_id: clientId,
        uploaded_by_profile_id: uploadedByProfileId || null,
        file_name: fileName,
        content_type: contentType || null,
        url: blob.url,
      })
      .select()
      .single();

    if (error) throw error;

    sendJson(res, 200, { media: data, url: blob.url });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Upload failed" });
  }
}
