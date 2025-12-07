-- Add google_email and updated_at columns to user_google_tokens
alter table public.user_google_tokens
  add column if not exists google_email text;

alter table public.user_google_tokens
  add column if not exists updated_at timestamptz default timezone('utc', now());

-- Create function to automatically update updated_at timestamp
create or replace function public.set_user_google_tokens_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

-- Drop existing trigger if it exists
drop trigger if exists user_google_tokens_set_updated_at on public.user_google_tokens;

-- Create trigger to auto-update updated_at on row updates
create trigger user_google_tokens_set_updated_at
before update on public.user_google_tokens
for each row execute function public.set_user_google_tokens_updated_at();
