import { getSupabaseAdmin } from "./_lib/supabaseAdmin.js";
import { readJson, requireMethod, sendJson } from "./_lib/request.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, "POST")) return;

  try {
    const body = await readJson(req);
    const {
      clientId,
      socialAccountId,
      createdByProfileId,
      scheduledAt,
      caption,
      format,
      goal,
      mediaAssetId,
      mediaUrl,
    } = body;

    if (!clientId || !socialAccountId || !scheduledAt || !caption) {
      sendJson(res, 400, { error: "clientId, socialAccountId, scheduledAt and caption are required" });
      return;
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("scheduled_posts")
      .insert({
        client_id: clientId,
        social_account_id: socialAccountId,
        created_by_profile_id: createdByProfileId || null,
        scheduled_at: scheduledAt,
        caption,
        format: format || "Post",
        goal: goal || "Engagement",
        media_asset_id: mediaAssetId || null,
        media_url: mediaUrl || null,
        status: "scheduled",
      })
      .select()
      .single();

    if (error) throw error;

    sendJson(res, 200, { post: data });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Could not schedule post" });
  }
}
