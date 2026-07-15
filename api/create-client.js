import { getSupabaseAdmin } from "./_lib/supabaseAdmin.js";
import { readJson, requireMethod, sendJson } from "./_lib/request.js";

function metricSeed(index) {
  return {
    audience: 2800 + index * 1900,
    engagement: 4.2 + index * 0.7,
    reach: 16000 + index * 8400,
    posts_count: 6 + index * 3,
    clicks: 420 + index * 160,
    saves: 110 + index * 55,
    response_rate: 72 + index * 4,
    growth: 4.5 + index * 0.8,
  };
}

export default async function handler(req, res) {
  if (!requireMethod(req, res, "POST")) return;

  try {
    const body = await readJson(req);
    const { ownerEmail, ownerName, ownerRole, name, sector, language, tags, accounts } = body;

    if (!ownerEmail || !name) {
      sendJson(res, 400, { error: "ownerEmail and name are required" });
      return;
    }

    const supabase = getSupabaseAdmin();
    const normalizedEmail = String(ownerEmail).trim().toLowerCase();

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .upsert({
        email: normalizedEmail,
        full_name: ownerName || normalizedEmail,
        role: ownerRole === "admin" ? "admin" : "cm",
      }, { onConflict: "email" })
      .select()
      .single();
    if (profileError) throw profileError;

    const { data: client, error: clientError } = await supabase
      .from("clients")
      .insert({
        name,
        sector: sector || "Nuevo cliente",
        language: language || "Espanol",
        owner_profile_id: profile.id,
        tags: Array.isArray(tags) ? tags : [],
      })
      .select()
      .single();
    if (clientError) throw clientError;

    const { error: memberError } = await supabase
      .from("client_members")
      .insert({ client_id: client.id, profile_id: profile.id, role: profile.role });
    if (memberError) throw memberError;

    const accountRows = (Array.isArray(accounts) ? accounts : [])
      .filter((account) => account.handle)
      .map((account, index) => ({
        client_id: client.id,
        network: account.network,
        handle: account.handle,
        external_account_id: account.externalAccountId || null,
        access_token: account.accessToken || null,
        ...metricSeed(index),
      }));

    const { data: socialAccounts, error: accountsError } = accountRows.length
      ? await supabase.from("social_accounts").insert(accountRows).select()
      : { data: [], error: null };
    if (accountsError) throw accountsError;

    sendJson(res, 200, { profile, client, accounts: socialAccounts || [] });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Could not create client" });
  }
}
