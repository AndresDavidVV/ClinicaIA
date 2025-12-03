-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- STAFF TABLE
create table if not exists staff (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  role text check (role in ('doctor', 'admin')) not null,
  phone_number text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PATIENTS TABLE
create table if not exists patients (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  cedula text unique not null,
  birth_date date not null,
  gender text,
  contact_info jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MEDICAL RECORDS TABLE
create table if not exists medical_records (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid references patients(id) on delete cascade not null,
  doctor_id uuid references staff(id),
  record_date timestamp with time zone default timezone('utc'::text, now()) not null,
  type text not null, -- 'consulta', 'examen', 'cirugia', 'urgencia'
  description text not null,
  diagnosis text,
  treatment text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Simple for MVP: allow all operations for now, or public)
alter table staff enable row level security;
alter table patients enable row level security;
alter table medical_records enable row level security;

-- Policy to allow public access (since we are simulating auth in frontend mostly, or using anon key)
-- In a real app, this would be authenticated users only.
create policy "Allow public access to staff" on staff for all using (true);
create policy "Allow public access to patients" on patients for all using (true);
create policy "Allow public access to medical_records" on medical_records for all using (true);

