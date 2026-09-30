-- ==============================================================================
-- College AI - Production Database Migration 003: Supabase Storage Configuration
-- Target: Supabase Storage (storage.buckets & storage.objects)
-- ==============================================================================

-- 1. Create Private Storage Bucket for Institutional Documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'college-documents',
    'college-documents',
    false, -- Private bucket: access controlled via RLS and signed URLs
    26214400, -- 25 MB max file size
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 26214400,
    allowed_mime_types = ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown'
    ];

-- 2. Storage Policies for college-documents Bucket

-- Read policy: Authenticated college members can download/view documents
CREATE POLICY "college_documents_read_authenticated"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'college-documents');

-- Upload policy: Only authenticated Faculty and Admins can upload documents
CREATE POLICY "college_documents_upload_staff"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'college-documents'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE auth_user_id = auth.uid()
              AND role IN ('teacher', 'admin')
        )
    );

-- Delete policy: Only Admins can delete storage files
CREATE POLICY "college_documents_delete_admin"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'college-documents'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE auth_user_id = auth.uid()
              AND role = 'admin'
        )
    );
