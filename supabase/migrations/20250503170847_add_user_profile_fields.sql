-- Add extra profile fields to users table
alter table users
  add column if not exists phone text,
  add column if not exists address text,
  add column if not exists entity_owned text,
  add column if not exists entity_type text,
  add column if not exists entity_name text,
  add column if not exists relationship_to_entity text,
  add column if not exists signer_role text,
  add column if not exists auth_user_id uuid;
