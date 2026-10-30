-- Migração do CRM. Rode no SQL Editor do Supabase (depois do schema.sql).
alter table public.leads
  add column if not exists notas text,
  add column if not exists score int,
  add column if not exists prioridade text,
  add column if not exists dados jsonb;

-- Chave para a importação atualizar em vez de duplicar.
create unique index if not exists leads_nome_cidade_key on public.leads (nome, cidade);
