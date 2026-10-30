-- Tabela de leads do quadro de prospecção. Rode no SQL Editor do Supabase.
create table if not exists public.leads (
  id bigint generated always as identity primary key,
  rank int,
  nome text not null,
  profissional text,
  segmento text,
  cidade text,
  uf text,
  endereco text,
  telefone text,
  instagram text,
  contato text,
  maps text,
  nota numeric,
  avaliacoes int,
  problemas text,
  oportunidade text,
  status text not null default 'Novo'
    check (status in ('Novo', 'Contato', 'Proposta', 'Fechado', 'Descartado')),
  updated_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Só usuários logados (equipe) leem e alteram. Anônimos não têm política, logo não acessam.
create policy "equipe le leads" on public.leads
  for select to authenticated using (true);
create policy "equipe insere leads" on public.leads
  for insert to authenticated with check (true);
create policy "equipe atualiza leads" on public.leads
  for update to authenticated using (true) with check (true);
create policy "equipe remove leads" on public.leads
  for delete to authenticated using (true);
