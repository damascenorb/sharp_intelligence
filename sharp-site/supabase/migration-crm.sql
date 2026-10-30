-- Migração do CRM. Rode no SQL Editor do Supabase. Pode rodar mais de uma vez.
alter table public.leads
  add column if not exists notas text,
  add column if not exists score int,
  add column if not exists prioridade text,
  add column if not exists dados jsonb;

create unique index if not exists leads_nome_cidade_key on public.leads (nome, cidade);

-- Colunas do pipeline, criadas pela equipe.
create table if not exists public.colunas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ordem int not null default 0,
  criado_em timestamptz not null default now()
);
alter table public.colunas enable row level security;
create policy "equipe le colunas" on public.colunas for select to authenticated using (true);
create policy "equipe cria colunas" on public.colunas for insert to authenticated with check (true);
create policy "equipe edita colunas" on public.colunas for update to authenticated using (true) with check (true);
create policy "equipe exclui colunas" on public.colunas for delete to authenticated using (true);

insert into public.colunas (nome, ordem)
select v.nome, v.ordem from (values ('Novo', 1), ('Em contato', 2), ('Proposta', 3), ('Fechado', 4), ('Descartado', 5)) as v(nome, ordem)
where not exists (select 1 from public.colunas);

alter table public.leads add column if not exists coluna_id uuid references public.colunas(id) on delete set null;

update public.leads l set coluna_id = c.id
from public.colunas c
where l.coluna_id is null
  and c.nome = case l.status when 'Contato' then 'Em contato' else l.status end;

-- Observações do card, em forma de mensagens.
create table if not exists public.mensagens (
  id bigint generated always as identity primary key,
  lead_id bigint not null references public.leads(id) on delete cascade,
  autor text not null,
  texto text not null check (char_length(texto) between 1 and 2000),
  criado_em timestamptz not null default now()
);
create index if not exists mensagens_lead_idx on public.mensagens (lead_id, criado_em);
alter table public.mensagens enable row level security;
create policy "equipe le mensagens" on public.mensagens for select to authenticated using (true);
create policy "equipe envia mensagens" on public.mensagens for insert to authenticated with check (autor = (auth.jwt() ->> 'email'));

-- Atualização em tempo real do chat.
do $$ begin
  alter publication supabase_realtime add table public.mensagens;
exception when duplicate_object then null;
end $$;
