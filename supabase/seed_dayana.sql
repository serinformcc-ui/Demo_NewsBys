with naiara_profile as (
  insert into profiles (email, full_name, role)
  values ('naiara@serinfor.net', 'Naiara Serinfor', 'cm')
  on conflict (email) do update set full_name = excluded.full_name, role = excluded.role
  returning id
),
dayana_client as (
  insert into clients (name, sector, language, owner_profile_id, tags)
  select 'Dayana', 'Influencer lifestyle', 'Espanol', id, array['influencer', 'lifestyle', 'colaboraciones']
  from naiara_profile
  returning id
),
membership as (
  insert into client_members (client_id, profile_id, role)
  select dayana_client.id, naiara_profile.id, 'cm'
  from dayana_client, naiara_profile
  on conflict (client_id, profile_id) do nothing
)
insert into social_accounts (client_id, network, handle, audience, engagement, reach, posts_count, clicks, saves, response_rate, growth)
select dayana_client.id, account.network::social_network, account.handle, account.audience, account.engagement, account.reach, account.posts_count, account.clicks, account.saves, account.response_rate, account.growth
from dayana_client,
(values
  ('Instagram', '@dayana', 48400, 7.3, 232000, 31, 7200, 2100, 91, 9.9),
  ('Instagram', '@dayana.style', 22100, 6.5, 118000, 18, 3700, 980, 86, 8.1),
  ('LinkedIn', 'Dayana Creator', 6100, 4.8, 27400, 7, 690, 240, 78, 5.6)
) as account(network, handle, audience, engagement, reach, posts_count, clicks, saves, response_rate, growth);
