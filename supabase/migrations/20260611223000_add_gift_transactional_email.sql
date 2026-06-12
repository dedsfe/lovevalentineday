alter table public.gifts
  add column if not exists buyer_email text,
  add column if not exists email_sent_at timestamptz,
  add column if not exists email_error text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'gifts_buyer_email_format_check'
      and conrelid = 'public.gifts'::regclass
  ) then
    alter table public.gifts
      add constraint gifts_buyer_email_format_check
      check (
        buyer_email is null
        or (
          length(buyer_email) <= 254
          and buyer_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
        )
      );
  end if;
end $$;
