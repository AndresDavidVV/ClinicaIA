-- Insert Staff
insert into staff (full_name, role, phone_number) values
('Dr. Alejandro Vega', 'doctor', '5551001'),
('Dra. Sofia Martinez', 'doctor', '5551002'),
('Carlos Ruiz', 'admin', '5552001'),
('Maria Lopez', 'admin', '5552002');

-- Insert Patients
insert into patients (full_name, cedula, birth_date, gender, contact_info) values
('Juan Perez', '1001', '1980-05-15', 'M', '{"phone": "5553001", "address": "Calle 1 #10-20"}'),
('Ana Gomez', '1002', '1975-08-22', 'F', '{"phone": "5553002", "address": "Av. Central 45"}'),
('Roberto Diaz', '1003', '1960-11-30', 'M', '{"phone": "5553003", "address": "Barrio Norte"}'),
('Lucia Torres', '1004', '1992-02-14', 'F', '{"phone": "5553004", "address": "Conjunto Residencial Los Pinos"}'),
('Miguel Angel Rodriguez', '1005', '1955-01-10', 'M', '{"phone": "5553005", "address": "Calle 100"}'),
('Elena Vasquez', '1006', '1988-07-07', 'F', '{"phone": "5553006", "address": "Carrera 7"}'),
('David Silva', '1007', '2001-12-25', 'M', '{"phone": "5553007", "address": "Zona Sur"}'),
('Carmen Mendoza', '1008', '1945-09-18', 'F', '{"phone": "5553008", "address": "El Poblado"}'),
('Pablo Escobar', '1009', '1970-03-30', 'M', '{"phone": "5553009", "address": "Centro"}'),
('Laura Quintero', '1010', '1995-06-12', 'F', '{"phone": "5553010", "address": "Laureles"}');

-- Insert Medical Records (Complex histories)

-- Patient 1: Juan Perez (Hipertension + Diabetes incipiente)
insert into medical_records (patient_id, doctor_id, record_date, type, description, diagnosis, treatment, notes)
select id, (select id from staff where role='doctor' limit 1), '2023-01-15', 'consulta', 'Paciente refiere dolores de cabeza constantes y sed excesiva.', 'Hipertensión arterial grado 1', 'Losartán 50mg cada 12h, dieta baja en sodio.', 'Se solicita glicemia en ayunas.'
from patients where cedula = '1001';

insert into medical_records (patient_id, doctor_id, record_date, type, description, diagnosis, treatment, notes)
select id, (select id from staff where role='doctor' limit 1), '2023-02-20', 'examen', 'Resultados de laboratorio.', 'Prediabetes', 'Metformina 850mg si no mejora con dieta.', 'Hemoglobina glicosilada en 5.8%.'
from patients where cedula = '1001';

-- Patient 2: Ana Gomez (Cancer de mama - Caso del amigo)
insert into medical_records (patient_id, doctor_id, record_date, type, description, diagnosis, treatment, notes)
select id, (select id from staff where role='doctor' limit 1), '2023-06-10', 'consulta', 'Nódulo palpable en mama derecha detectado en autoexamen.', 'Sospecha de Ca de Mama', 'Mamografía y Ecografía mamaria.', 'Paciente ansiosa.'
from patients where cedula = '1002';

insert into medical_records (patient_id, doctor_id, record_date, type, description, diagnosis, treatment, notes)
select id, (select id from staff where role='doctor' limit 1), '2023-06-25', 'examen', 'Mamografía BIRADS 4C.', 'Carcinoma Ductal Infiltrante', 'Biopsia core.', 'Se requiere confirmación histopatológica urgente.'
from patients where cedula = '1002';

insert into medical_records (patient_id, doctor_id, record_date, type, description, diagnosis, treatment, notes)
select id, (select id from staff where role='doctor' limit 1), '2023-07-05', 'consulta', 'Revisión de biopsia. El médico oncólogo anterior indicó que "no era nada grave" verbalmente a pesar del reporte.', 'Carcinoma Ductal Infiltrante Grado 3', 'Mastectomía radical modificada + Quimioterapia.', 'ATENCIÓN: El reporte patológico confirma malignidad agresiva. La IA detecta discrepancia con la nota verbal previa reportada por paciente.'
from patients where cedula = '1002';

-- Patient 3: Roberto Diaz (EPOC + Fumador)
insert into medical_records (patient_id, doctor_id, record_date, type, description, diagnosis, treatment, notes)
select id, (select id from staff where role='doctor' limit 1), '2023-03-10', 'urgencia', 'Dificultad respiratoria severa.', 'Exacerbación de EPOC', 'Nebulizaciones con Ipratropio/Salbutamol, Corticoides IV.', 'Saturación 82% al ingreso.'
from patients where cedula = '1003';

-- Patient 4: Lucia Torres (Embarazo alto riesgo)
insert into medical_records (patient_id, doctor_id, record_date, type, description, diagnosis, treatment, notes)
select id, (select id from staff where role='doctor' limit 1), '2023-08-01', 'consulta', 'Control prenatal semana 24. Cefalea.', 'Preeclampsia leve', 'Alfametildopa 250mg cada 8h.', 'Monitoreo de presión arterial diario.'
from patients where cedula = '1004';

-- Patient 5: Miguel Angel Rodriguez (Arritmia)
insert into medical_records (patient_id, doctor_id, record_date, type, description, diagnosis, treatment, notes)
select id, (select id from staff where role='doctor' limit 1), '2023-09-15', 'examen', 'Electrocardiograma de rutina.', 'Fibrilación Auricular', 'Anticoagulación con Warfarina.', 'Riesgo de ACV elevado.'
from patients where cedula = '1005';

-- Populate more records for Admin stats (Occupancy, trends)
-- Adding bulk dummy records for last month
insert into medical_records (patient_id, doctor_id, record_date, type, description, diagnosis, treatment, notes)
select id, (select id from staff where role='doctor' limit 1), generated_date, 'consulta', 'Control general.', 'Sano', 'Ninguno', 'Chequeo anual.'
from patients, generate_series(now() - interval '1 month', now(), '1 day') as generated_date
where cedula in ('1006', '1007', '1008')
limit 50;

