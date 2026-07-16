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
    const { ownerEmail, ownerName, ownerRole, name, sector, language, tags, accounts, assignedUsers } = body;

    if (!ownerEmail || !name) {
      sendJson(res, 400, { error: "ownerEmail and name are required" });
      return;
    }

    const supabase = getSupabaseAdmin();
    const normalizedEmail = String(ownerEmail).trim().toLowerCase();
    const profileCandidates = new Map();
    profileCandidates.set(normalizedEmail, {
      email: normalizedEmail,
      full_name: ownerName || normalizedEmail,
      role: ownerRole === "admin" ? "admin" : "cm",
    });

    (Array.isArray(assignedUsers) ? assignedUsers : []).forEach((user) => {
      const email = String(user?.email || "").trim().toLowerCase();
      if (!email) return;
      profileCandidates.set(email, {
        email,
        full_name: user.name || email,
        role: user.role === "admin" ? "admin" : "cm",
      });
    });

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .upsert(Array.from(profileCandidates.values()), { onConflict: "email" })
      .select();
    if (profileError) throw profileError;
    const profile = profiles.find((item) => item.email === normalizedEmail) || profiles[0];

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
      .insert(profiles.map((memberProfile) => ({
        client_id: client.id,
        profile_id: memberProfile.id,
        role: memberProfile.role,
      })));
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
