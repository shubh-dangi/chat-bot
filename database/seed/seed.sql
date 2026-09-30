-- ==============================================================================
-- College AI - Production Database Development Seed Data
-- Target: Supabase PostgreSQL (PostgreSQL 15+)
-- NOTE: Contains exclusively fictional/demo data for development and testing.
-- ==============================================================================

-- 1. Insert Courses
INSERT INTO courses (id, name, code, description)
VALUES 
    ('c0000001-0000-0000-0000-000000000001', 'Bachelor of Computer Applications', 'BCA', 'Three-year undergraduate program focusing on computer applications and software development.'),
    ('c0000001-0000-0000-0000-000000000002', 'Bachelor of Technology in CSE', 'B.Tech-CSE', 'Four-year engineering degree encompassing computer systems, algorithms, and computing hardware.'),
    ('c0000001-0000-0000-0000-000000000003', 'Master of Computer Applications', 'MCA', 'Postgraduate program covering advanced software architecture, systems, and enterprise design.'),
    ('c0000001-0000-0000-0000-000000000004', 'Bachelor of Business Administration', 'BBA', 'Undergraduate program covering business management, operations, and commerce.')
ON CONFLICT (code) DO NOTHING;

-- 2. Insert Subjects
INSERT INTO subjects (id, course_id, name, code, semester, description)
VALUES
    ('s0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Data Structures & Algorithms', 'BCA-301', 3, 'Linear and non-linear data structures, trees, graphs, sorting and searching algorithms.'),
    ('s0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'Database Management Systems', 'BCA-302', 3, 'Relational databases, SQL, normalization, concurrency control, and transactions.'),
    ('s0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001', 'Web Application Development', 'BCA-501', 5, 'Modern full-stack web technologies, RESTful APIs, and frontend frameworks.'),
    ('s0000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000001', 'Computer Networks & Security', 'BCA-502', 5, 'Network protocols, OSI reference model, routing algorithms, and campus cybersecurity.'),
    ('s0000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000002', 'Operating Systems', 'CS-401', 4, 'Process management, synchronization, CPU scheduling, virtual memory, and file systems.'),
    ('s0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000002', 'Software Engineering Principles', 'CS-402', 4, 'Software lifecycle methodologies, agile practices, testing, and system architecture.')
ON CONFLICT (course_id, code) DO NOTHING;

-- 3. Insert Demo Profiles
-- NOTE: In production Supabase, auth_user_id references auth.users(id). 
-- These mock UUIDs represent demo users for local development.
INSERT INTO profiles (id, auth_user_id, full_name, role, department, avatar_url)
VALUES
    ('p0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Dean of Academics (Admin)', 'admin', 'Administration', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80'),
    ('p0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000002', 'Prof. Anita Sharma (Faculty)', 'teacher', 'Computer Science', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&q=80'),
    ('p0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000003', 'Jane Smith (Student)', 'student', 'Computer Science', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&q=80')
ON CONFLICT (auth_user_id) DO NOTHING;

-- 4. Insert Demo Students
INSERT INTO students (id, profile_id, student_id, full_name, email, phone, course_id, semester, division, enrollment_year, status)
VALUES
    ('d0000001-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000003', 'CS-2022-042', 'Jane Smith', 'jane.smith@demo.college.edu', '+1 (555) 234-8921', 'c0000001-0000-0000-0000-000000000001', 5, 'A', 2022, 'active'),
    ('d0000001-0000-0000-0000-000000000002', NULL, 'MATH-2021-018', 'Johnathan Doe', 'john.doe@demo.college.edu', '+1 (555) 456-7812', 'c0000001-0000-0000-0000-000000000002', 7, 'B', 2021, 'active'),
    ('d0000001-0000-0000-0000-000000000003', NULL, 'PHY-2024-009', 'Alice Johnson', 'alice.j@demo.college.edu', '+1 (555) 678-9034', 'c0000001-0000-0000-0000-000000000001', 1, 'A', 2024, 'active'),
    ('d0000001-0000-0000-0000-000000000004', NULL, 'ENG-2023-088', 'Vikram Malhotra', 'vikram.m@demo.college.edu', '+1 (555) 890-1234', 'c0000001-0000-0000-0000-000000000002', 3, 'A', 2023, 'active'),
    ('d0000001-0000-0000-0000-000000000005', NULL, 'BIO-2021-031', 'Sarah Williams', 's.williams@demo.college.edu', '+1 (555) 345-6789', 'c0000001-0000-0000-0000-000000000001', 6, 'A', 2021, 'graduated')
ON CONFLICT (student_id) DO NOTHING;

-- 5. Insert Sample Demo Documents Metadata (storage reference)
INSERT INTO documents (id, uploaded_by, title, description, file_name, storage_path, mime_type, file_size, status)
VALUES
    ('f0000001-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', 'University Academic Regulations & Code 2026', 'Official college regulations governing examinations, credit transfers, and disciplinary actions.', 'University_Academic_Curriculum_2026.pdf', 'college-documents/regulations/2026_regulations.pdf', 'application/pdf', 4404019, 'processed'),
    ('f0000001-0000-0000-0000-000000000002', 'p0000001-0000-0000-0000-000000000001', 'Campus Hostel Rules and Disciplinary Code', 'Guidelines for on-campus residential students including curfews and mess regulations.', 'Hostel_Rules_and_Disciplinary_Code.pdf', 'college-documents/handbooks/hostel_rules.pdf', 'application/pdf', 1887436, 'processed')
ON CONFLICT (storage_path) DO NOTHING;
