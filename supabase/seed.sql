-- supabase/seed.sql — minimal seed so the home page renders without empty states.

insert into public.studio_stats (key, label, value, display_order) values
  ('downloads',    'Total Downloads',  '12M+',     1),
  ('active_users', 'Active Players',   '850K',     2),
  ('countries',    'Countries',        '120+',     3),
  ('projects',     'Shipped Projects', '24',       4)
on conflict (key) do nothing;

insert into public.team_members (name, role, bio, photo_url, display_order, active) values
  ('Ajmal Khan',    'Founder & CEO',          'Builds product-led studios.',           null, 1, true),
  ('Riya Sharma',   'Head of Engineering',    'Android, backend, and ops.',            null, 2, true),
  ('Marco Bianchi', 'Creative Director',      'Art direction across games and Web3.',  null, 3, true),
  ('Lena Park',     'Web3 Lead',              'Smart contracts and on-chain games.',   null, 4, true);

insert into public.games (slug, title, tagline, description, genre, platforms, status, hero_image_url, trailer_url, play_store_url, release_date, downloads_count, published) values
  ('apex-runners',     'Apex Runners',     'Vertical parkour for your thumbs.', 'A hyper-casual endless runner with procedural cityscapes.', 'Hyper-casual', '{android,ios}', 'live',        null, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://play.google.com/store/apps/details?id=studio.appleape.apexrunners', '2024-04-12', 5400000, true),
  ('void-archers',     'Void Archers',     'Roguelike archery, neon arenas.',    'Mid-core roguelike with deterministic seed sharing.',     'Roguelike',    '{android}',     'live',        null, null, 'https://play.google.com/store/apps/details?id=studio.appleape.voidarchers', '2024-09-30', 1100000, true),
  ('orbit-merchants',  'Orbit Merchants',  'Trade across a clockwork solar system.', 'A cozy economy sim about routes, risk, and reputation.', 'Sim',         '{android,ios}', 'coming_soon', null, null, null, null, 0, true);

insert into public.web3_projects (slug, title, description, chains, live_url, contract_addresses, audit_url, supported_wallets, status, published) values
  ('orchard-marketplace', 'Orchard Marketplace', 'Curated NFT marketplace for indie artists.', '{base,ethereum}', 'https://orchard.example.com', '{"base":"0x0000000000000000000000000000000000000000"}'::jsonb, 'https://audits.example.com/orchard.pdf', '{metamask,coinbase,rainbow}', 'live', true),
  ('chain-quests',        'Chain Quests',        'On-chain quest engine for mobile games.',    '{solana}',        'https://quests.example.com', '{"solana":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"}'::jsonb, null, '{phantom,solflare}', 'testnet', true);

insert into public.apps (slug, title, tagline, description, category, platforms, status, release_date, published) values
  ('focus-flame', 'Focus Flame', 'A pomodoro timer that flickers when you focus.', 'Ambient productivity timer.',  'Productivity', '{android,ios}', 'live', '2024-02-01', true),
  ('coin-ledger', 'Coin Ledger', 'A privacy-first crypto portfolio tracker.',     'Local-only portfolio app.',    'Finance',      '{android}',     'live', '2024-06-15', true);

insert into public.job_openings (slug, title, department, location, employment_type, description, requirements, perks, active) values
  ('senior-unity-engineer',    'Senior Unity Engineer',    'Engineering', 'Remote (APAC)', 'full_time', 'Build the next generation of our action titles.', 'Shipped two+ titles, deep Unity profiling experience.', 'Equity, profit share, hardware budget.', true),
  ('smart-contract-engineer',  'Smart Contract Engineer',  'Web3',        'Remote (Global)', 'full_time', 'Own the Solidity and Anchor side of our Web3 line.', '3+ years Solidity, audit experience.',                  'Equity, profit share, conference budget.', true);

insert into public.posts (slug, title, excerpt, content_mdx, tags, published, published_at)
values
  ('hello-appleape', 'Hello from AppleApe Studios', 'Why we are building a product studio across games, Web3, and apps.',
   E'# Hello from AppleApe Studios\n\nWe are a small product studio.\n\nWe ship Android games, Web3 applications, and useful apps.',
   '{studio,announcement}', true, now() - interval '2 days'),
  ('void-archers-postmortem', 'Void Archers — a roguelike postmortem', 'What worked, what did not, and what is next for our second title.',
   E'# Void Archers postmortem\n\nA short look at the numbers behind launch month.',
   '{games,postmortem}', true, now() - interval '1 day');
