-- MealLink schema. Paste into Supabase → SQL Editor → Run.
create table if not exists profiles(id uuid primary key references auth.users on delete cascade,role text not null check(role in('donor','ngo')),name text not null,created_at timestamptz default now());
create table if not exists ngos(id uuid primary key default gen_random_uuid(),user_id uuid unique references auth.users on delete cascade,name text not null,area text,lat float8 not null,lng float8 not null,capacity int not null default 50,accepts text[] not null default '{veg,nonveg}',pickup text not null default 'yes' check(pickup in('yes','limited','no')),contact text,is_demo boolean not null default false,created_at timestamptz default now());
create table if not exists donations(id uuid primary key default gen_random_uuid(),donor_id uuid not null references auth.users on delete cascade,donor_name text not null,quantity int not null check(quantity>0),food_type text not null,veg boolean not null,location text not null,lat float8,lng float8,created_at timestamptz not null default now(),deadline timestamptz not null,status text not null default 'AVAILABLE' check(status in('AVAILABLE','CLAIMED','PICKUP_IN_PROGRESS','PICKED_UP','COMPLETED','EXPIRED')),ngo_id uuid references ngos(id),claimed_at timestamptz,picked_at timestamptz);
alter table profiles enable row level security;alter table ngos enable row level security;alter table donations enable row level security;
drop policy if exists p_self on profiles;create policy p_self on profiles for select to authenticated using(id=auth.uid());
drop policy if exists n_read on ngos;create policy n_read on ngos for select to authenticated using(true);
drop policy if exists n_upd on ngos;create policy n_upd on ngos for update to authenticated using(user_id=auth.uid());
drop policy if exists d_read on donations;create policy d_read on donations for select to authenticated using(true);
drop policy if exists d_ins on donations;create policy d_ins on donations for insert to authenticated with check(donor_id=auth.uid() and exists(select 1 from profiles where id=auth.uid() and role='donor') and deadline>now());
-- New-user trigger: builds profile (+ NGO row) from signup metadata
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
declare m jsonb:=new.raw_user_meta_data;
begin
insert into profiles(id,role,name) values(new.id,case when m->>'role'='ngo' then 'ngo' else 'donor' end,coalesce(nullif(m->>'name',''),'User'));
if m->>'role'='ngo' then insert into ngos(user_id,name,area,lat,lng,capacity,accepts,pickup,contact) values(new.id,m->>'name',m->>'address',(m->>'lat')::float8,(m->>'lng')::float8,coalesce((m->>'capacity')::int,50),array(select jsonb_array_elements_text(m->'accepts')),coalesce(m->>'pickup','yes'),m->>'contact'); end if;
return new; end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();
-- Atomic claim (row lock => two NGOs can never claim the same donation)
create or replace function claim_donation(p_id uuid) returns void language plpgsql security definer set search_path=public as $$
declare n ngos;d donations;
begin
select * into n from ngos where user_id=auth.uid();
if n.id is null then raise exception 'Only registered NGOs can claim donations'; end if;
select * into d from donations where id=p_id for update;
if d.id is null then raise exception 'Donation not found'; end if;
if d.status<>'AVAILABLE' then raise exception 'This donation is no longer available'; end if;
if d.deadline<=now() then raise exception 'This donation has expired'; end if;
if n.capacity<d.quantity then raise exception 'Your capacity is too low for this donation'; end if;
update donations set status='CLAIMED',ngo_id=n.id,claimed_at=now() where id=p_id; end $$;
create or replace function advance_donation(p_id uuid) returns void language plpgsql security definer set search_path=public as $$
declare n ngos;d donations;
begin
select * into n from ngos where user_id=auth.uid();select * into d from donations where id=p_id for update;
if d.id is null or n.id is null or d.ngo_id<>n.id then raise exception 'Not your donation'; end if;
update donations set status=case status when 'CLAIMED' then 'PICKUP_IN_PROGRESS' when 'PICKUP_IN_PROGRESS' then 'PICKED_UP' when 'PICKED_UP' then 'COMPLETED' else status end,picked_at=case when status='PICKUP_IN_PROGRESS' then now() else picked_at end where id=p_id; end $$;
create or replace function expire_stale() returns void language sql security definer set search_path=public as $$ update donations set status='EXPIRED' where status='AVAILABLE' and deadline<=now() $$;
revoke execute on function claim_donation,advance_donation,expire_stale from public,anon;
grant execute on function claim_donation,advance_donation,expire_stale to authenticated;
do $$ begin alter publication supabase_realtime add table donations; exception when duplicate_object then null; end $$;
-- Demo NGOs (fictional, cannot log in or claim; real NGOs register themselves)
insert into ngos(name,area,lat,lng,capacity,accepts,pickup,contact,is_demo) select * from(values
('Hope Shelter','Andheri East',19.1136,72.8697,80,'{veg,nonveg}'::text[],'yes','+91 98000 00001',true),
('Care Foundation','Goregaon West',19.1663,72.8526,100,'{veg,nonveg}','yes','+91 98000 00002',true),
('Community Kitchen','Malad West',19.1874,72.8484,50,'{veg}','limited','+91 98000 00003',true),
('Annapurna Trust','Jogeshwari',19.1362,72.8489,150,'{veg}','yes','+91 98000 00004',true),
('Nourish Hub','Kandivali',19.2043,72.8505,40,'{veg,nonveg}','yes','+91 98000 00005',true)) v(a,b,c,d,e,f,g,h,i) where not exists(select 1 from ngos where is_demo);
