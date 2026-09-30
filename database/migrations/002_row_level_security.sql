-- ==============================================================================
-- College AI - Production Database Migration 002: Row Level Security (RLS)
-- Target: Supabase PostgreSQL (PostgreSQL 15+)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Helper Functions for Supabase Auth & Role Resolution
-- ------------------------------------------------------------------------------

-- Retrieve application profile ID for the current authenticated Supabase user
CREATE OR REPLACE FUNCTION current_profile_id()
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Retrieve application role for the current authenticated Supabase user
CREATE OR REPLACE FUNCTION current_profile_role()
RETURNS VARCHAR AS $$
  SELECT role FROM profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if current authenticated user is an administrator
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE auth_user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if current authenticated user is a teacher or admin
CREATE OR REPLACE FUNCTION is_faculty_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE auth_user_id = auth.uid() AND role IN ('teacher', 'admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 2. Enable RLS on All Sensitive Tables
-- ------------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 3. Profiles Policies
-- ------------------------------------------------------------------------------
-- Users can view their own profile; faculty & admins can view student profiles
CREATE POLICY "profiles_select_own_or_staff"
    ON profiles FOR SELECT
    TO authenticated
    USING (
        auth_user_id = auth.uid() 
        OR is_faculty_or_admin()
    );

-- Users can insert their own profile during registration
CREATE POLICY "profiles_insert_own"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth_user_id = auth.uid());

-- Users can update their own non-role profile fields; admins can update all
CREATE POLICY "profiles_update_own"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth_user_id = auth.uid() OR is_admin())
    WITH CHECK (
        (auth_user_id = auth.uid() AND role = (SELECT role FROM profiles WHERE auth_user_id = auth.uid()))
        OR is_admin()
    );

-- Only admins can delete profiles
CREATE POLICY "profiles_delete_admin"
    ON profiles FOR DELETE
    TO authenticated
    USING (is_admin());

-- ------------------------------------------------------------------------------
-- 4. Courses & Subjects Policies
-- ------------------------------------------------------------------------------
-- All authenticated users can read academic courses & subjects
CREATE POLICY "courses_read_authenticated"
    ON courses FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "courses_write_admin"
    ON courses FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "subjects_read_authenticated"
    ON subjects FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "subjects_write_admin"
    ON subjects FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- ------------------------------------------------------------------------------
-- 5. Students Policies (Strict Student Privacy - No public access)
-- ------------------------------------------------------------------------------
-- Admins and Teachers can read student records. Students can only read their own linked record.
CREATE POLICY "students_select_authorized"
    ON students FOR SELECT
    TO authenticated
    USING (
        is_faculty_or_admin()
        OR profile_id = current_profile_id()
    );

-- Only admins can insert new student records
CREATE POLICY "students_insert_admin"
    ON students FOR INSERT
    TO authenticated
    WITH CHECK (is_admin());

-- Only admins can update student records (or faculty editing academic status)
CREATE POLICY "students_update_staff"
    ON students FOR UPDATE
    TO authenticated
    USING (is_faculty_or_admin())
    WITH CHECK (is_faculty_or_admin());

-- Only admins can delete student records
CREATE POLICY "students_delete_admin"
    ON students FOR DELETE
    TO authenticated
    USING (is_admin());

-- ------------------------------------------------------------------------------
-- 6. Chat Sessions Policies (Strict Owner Isolation)
-- ------------------------------------------------------------------------------
-- Users can only read their own chat sessions
CREATE POLICY "chat_sessions_select_owner"
    ON chat_sessions FOR SELECT
    TO authenticated
    USING (user_id = current_profile_id());

-- Users can only create chats for themselves
CREATE POLICY "chat_sessions_insert_owner"
    ON chat_sessions FOR INSERT
    TO authenticated
    WITH CHECK (user_id = current_profile_id());

-- Users can only update their own chat titles
CREATE POLICY "chat_sessions_update_owner"
    ON chat_sessions FOR UPDATE
    TO authenticated
    USING (user_id = current_profile_id())
    WITH CHECK (user_id = current_profile_id());

-- Users can delete their own chat sessions
CREATE POLICY "chat_sessions_delete_owner"
    ON chat_sessions FOR DELETE
    TO authenticated
    USING (user_id = current_profile_id());

-- ------------------------------------------------------------------------------
-- 7. Messages Policies (Strict Chat Owner Isolation + Shared Read Access)
-- ------------------------------------------------------------------------------
-- Messages readable by chat owner, OR anyone via a valid non-expired/non-revoked shared chat
CREATE POLICY "messages_select_owner_or_shared"
    ON messages FOR SELECT
    TO public
    USING (
        -- Authenticated chat owner
        EXISTS (
            SELECT 1 FROM chat_sessions cs
            WHERE cs.id = messages.chat_id
              AND cs.user_id = current_profile_id()
        )
        -- OR Active public share token exists
        OR EXISTS (
            SELECT 1 FROM shared_chats sc
            WHERE sc.chat_id = messages.chat_id
              AND sc.revoked_at IS NULL
              AND (sc.expires_at IS NULL OR sc.expires_at > CURRENT_TIMESTAMP)
        )
    );

-- Only chat owner can insert messages into their conversation
CREATE POLICY "messages_insert_owner"
    ON messages FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_sessions cs
            WHERE cs.id = messages.chat_id
              AND cs.user_id = current_profile_id()
        )
    );

-- Only chat owner can edit messages
CREATE POLICY "messages_update_owner"
    ON messages FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM chat_sessions cs
            WHERE cs.id = messages.chat_id
              AND cs.user_id = current_profile_id()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_sessions cs
            WHERE cs.id = messages.chat_id
              AND cs.user_id = current_profile_id()
        )
    );

-- Only chat owner can delete messages
CREATE POLICY "messages_delete_owner"
    ON messages FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM chat_sessions cs
            WHERE cs.id = messages.chat_id
              AND cs.user_id = current_profile_id()
        )
    );

-- ------------------------------------------------------------------------------
-- 8. Shared Chats Policies (Read-Only Share Links, Owner Management)
-- ------------------------------------------------------------------------------
-- Public read access to active non-expired share links (read-only)
CREATE POLICY "shared_chats_select_active"
    ON shared_chats FOR SELECT
    TO public
    USING (
        created_by = current_profile_id()
        OR (
            revoked_at IS NULL
            AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
        )
    );

-- Only chat owner can create a shared chat entry
CREATE POLICY "shared_chats_insert_owner"
    ON shared_chats FOR INSERT
    TO authenticated
    WITH CHECK (
        created_by = current_profile_id()
        AND EXISTS (
            SELECT 1 FROM chat_sessions cs
            WHERE cs.id = shared_chats.chat_id
              AND cs.user_id = current_profile_id()
        )
    );

-- Only creator can update or revoke their share link
CREATE POLICY "shared_chats_update_owner"
    ON shared_chats FOR UPDATE
    TO authenticated
    USING (created_by = current_profile_id())
    WITH CHECK (created_by = current_profile_id());

-- Only creator can delete share link
CREATE POLICY "shared_chats_delete_owner"
    ON shared_chats FOR DELETE
    TO authenticated
    USING (created_by = current_profile_id());

-- ------------------------------------------------------------------------------
-- 9. Documents & Document Chunks Policies
-- ------------------------------------------------------------------------------
-- Authenticated users can view processed institutional documents
CREATE POLICY "documents_select_authenticated"
    ON documents FOR SELECT
    TO authenticated
    USING (status = 'processed' OR is_faculty_or_admin());

-- Faculty and Admins can upload documents
CREATE POLICY "documents_insert_staff"
    ON documents FOR INSERT
    TO authenticated
    WITH CHECK (
        is_faculty_or_admin()
        AND uploaded_by = current_profile_id()
    );

-- Faculty and Admins can update document metadata
CREATE POLICY "documents_update_staff"
    ON documents FOR UPDATE
    TO authenticated
    USING (is_faculty_or_admin())
    WITH CHECK (is_faculty_or_admin());

-- Only Admins can delete documents
CREATE POLICY "documents_delete_admin"
    ON documents FOR DELETE
    TO authenticated
    USING (is_admin());

-- Chunks readable if parent document is readable
CREATE POLICY "document_chunks_select_authenticated"
    ON document_chunks FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM documents d
            WHERE d.id = document_chunks.document_id
              AND (d.status = 'processed' OR is_faculty_or_admin())
        )
    );

-- Chunks writeable only by staff/service-role
CREATE POLICY "document_chunks_write_staff"
    ON document_chunks FOR ALL
    TO authenticated
    USING (is_faculty_or_admin())
    WITH CHECK (is_faculty_or_admin());

-- ------------------------------------------------------------------------------
-- 10. Audit Logs Policies (Append-only security log, Admin read-only)
-- ------------------------------------------------------------------------------
-- Only Admins can view audit logs
CREATE POLICY "audit_logs_select_admin"
    ON audit_logs FOR SELECT
    TO authenticated
    USING (is_admin());

-- Authenticated actions can insert audit log entries
CREATE POLICY "audit_logs_insert_authenticated"
    ON audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (user_id = current_profile_id() OR user_id IS NULL);

-- UPDATE and DELETE on audit_logs are permanently prevented to guarantee audit trail immutability
