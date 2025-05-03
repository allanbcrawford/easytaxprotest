-- Drop existing tables in reverse order of dependencies
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS entities;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS users;

-- users
CREATE TABLE IF NOT EXISTS users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  first_name text,
  last_name text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  auth_user_id uuid
);

-- properties
CREATE TABLE IF NOT EXISTS properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  address_line1 text not null,
  address_line2 text,
  city text,
  state text,
  zip text,
  lat double precision,
  lng double precision,
  formatted_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- entities
CREATE TABLE IF NOT EXISTS entities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  name text not null,
  type text not null,
  relationship_to_entity text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- submissions
CREATE TABLE IF NOT EXISTS submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  property_id uuid references properties(id),
  entity_id uuid references entities(id),
  status text default 'new',
  property_address text,
  first_name text,
  last_name text,
  email text,
  phone text,
  entity_owned text,
  entity_type text,
  entity_name text,
  relationship_to_entity text,
  signer_role text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
