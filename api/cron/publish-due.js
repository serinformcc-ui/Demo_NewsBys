import { getSupabaseAdmin } from "../_lib/supabaseAdmin.js";
import { sendJson } from "../_lib/request.js";

const META_VERSION = process.env.META_GRAPH_VERSION || "v23.0";

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  const url = new URL(req.url, "https://newsbys.local");
  return req.headers.authorization === `Bearer ${secret}`
    || req.headers["x-cron-secret"] === secret
    || url.searchParams.get("secret") === secret;
}

async function publishInstagram({ account, post }) {
  if (!account.external_account_id || !account.access_token) {
    throw new Error("Instagram account is missing external_account_id or access_token");
  }
  if (!post.media_url) {
    throw new Error("Instagram publishing requires a public media_url");
  }

  const baseUrl = `https://graph.facebook.com/${META_VERSION}/${account.external_account_id}`;
  const containerBody = new URLSearchParams({
    image_url: post.media_url,
    caption: post.caption,
    access_token: account.access_token,
  });

  const containerResponse = await fetch(`${baseUrl}/media`, {
    method: "POST",
    body: containerBody,
  });
  const container = await containerResponse.json();
  if (!containerResponse.ok) {
    throw new Error(container.error?.message || "Meta media container creation failed");
  }

  const publishBody = new URLSearchParams({
    creation_id: container.id,
    access_token: account.access_token,
  });
  const publishResponse = await fetch(`${baseUrl}/media_publish`, {
    method: "POST",
    body: publishBody,
  });
  const published = await publishResponse.json();
  if (!publishResponse.ok) {
    throw new Error(published.error?.message || "Meta media_publish failed");
  }

  return published.id;
}

export default async function handler(req, res) {
  if (!isAuthorized(req)) {
    sendJson(res, 401, { error: "Unauthorized cron call" });
    return;
  }

  const supabase = getSupabaseAdmin();
  const { data: posts, error } = await supabase
    .from("scheduled_posts")
    .select("*, social_accounts(*)")
    .eq("status", "scheduled")
    .lte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(10);

  if (error) {
    sendJson(res, 500, { error: error.message });
    return;
  }

  const results = [];

  for (const post of posts || []) {
    const account = post.social_accounts;
    try {
      await supabase.from("scheduled_posts").update({ status: "publishing", error_message: null }).eq("id", post.id);

      if (account.network !== "Instagram") {
        throw new Error(`Real publishing for ${account.network} is not implemented yet`);
      }

      const externalPostId = await publishInstagram({ account, post });
      await supabase
        .from("scheduled_posts")
        .update({
          status: "published",
          external_post_id: externalPostId,
          published_at: new Date().toISOString(),
          error_message: null,
        })
        .eq("id", post.id);

      results.push({ id: post.id, status: "published", externalPostId });
    } catch (error) {
      await supabase
        .from("scheduled_posts")
        .update({ status: "failed", error_message: error.message || "Publishing failed" })
        .eq("id", post.id);
      results.push({ id: post.id, status: "failed", error: error.message });
    }
  }

  sendJson(res, 200, { processed: results.length, results });
}
