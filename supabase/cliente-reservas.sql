-- Ejecuta este script en Supabase SQL Editor.
-- Anade un codigo privado por reserva y una consulta segura para clientes.

alter table public.reservas
  add column if not exists cliente_token text;

update public.reservas
set cliente_token = 'EU-' ||
  upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 4)) || '-' ||
  upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 4)) || '-' ||
  upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 4)) || '-' ||
  upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 4)) || '-' ||
  upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 4)) || '-' ||
  upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 4))
where cliente_token is null;

alter table public.reservas
  alter column cliente_token set not null;

create unique index if not exists reservas_cliente_token_key
  on public.reservas (cliente_token);

drop policy if exists "insert_publico" on public.reservas;

create policy "insert_publico" on public.reservas
  for insert to anon
  with check (
    estado = 'pendiente'
    and origen = 'web'
    and cliente_token like 'EU-%'
  );

grant insert on table public.reservas to anon;
grant select, insert, update, delete on table public.reservas to authenticated;

create or replace function public.consultar_reserva_cliente(codigo_reserva text)
returns table (
  perro text,
  raza text,
  tamano text,
  dueno text,
  entrada date,
  hora_entrada text,
  salida date,
  hora_salida text,
  servicio text,
  vacunas boolean,
  estado text,
  origen text,
  creada timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    r.perro,
    r.raza,
    r.tamano,
    r.dueno,
    r.entrada,
    r.hora_entrada,
    r.salida,
    r.hora_salida,
    r.servicio,
    r.vacunas,
    r.estado,
    r.origen,
    r.creada
  from public.reservas r
  where r.cliente_token = upper(trim(codigo_reserva))
  limit 1;
$$;

revoke all on function public.consultar_reserva_cliente(text) from public;
grant execute on function public.consultar_reserva_cliente(text) to anon, authenticated;
