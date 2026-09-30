"""drop students table

Removes the user-facing student directory. The admin enrollment console now uses
local mock data (frontend/src/features/admin/data/managedStudents.ts), so the
students table and its indexes are no longer read or written by any endpoint.

Revision ID: c4a81f2d6b30
Revises: 701d4e9ea3b5
Create Date: 2026-09-30
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'c4a81f2d6b30'
down_revision: Union[str, Sequence[str], None] = '701d4e9ea3b5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # profiles.students and courses.students were SQLAlchemy-level backrefs only,
    # so there are no FKs on those tables pointing at students.id to unwind first.
    op.drop_index(op.f('ix_students_course_id'), table_name='students')
    op.drop_index(op.f('ix_students_department'), table_name='students')
    op.drop_index(op.f('ix_students_email'), table_name='students')
    op.drop_index(op.f('ix_students_full_name'), table_name='students')
    op.drop_index(op.f('ix_students_id'), table_name='students')
    op.drop_index(op.f('ix_students_profile_id'), table_name='students')
    op.drop_index(op.f('ix_students_semester'), table_name='students')
    op.drop_index(op.f('ix_students_status'), table_name='students')
    op.drop_index(op.f('ix_students_student_id'), table_name='students')
    op.drop_table('students')


def downgrade() -> None:
    op.create_table('students',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('profile_id', sa.Uuid(), nullable=True),
        sa.Column('student_id', sa.String(length=50), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.Column('department', sa.String(length=100), nullable=False),
        sa.Column('course_name', sa.String(length=100), nullable=False),
        sa.Column('course_id', sa.Uuid(), nullable=True),
        sa.Column('semester', sa.Integer(), nullable=False),
        sa.Column('division', sa.String(length=10), nullable=False),
        sa.Column('enrollment_year', sa.Integer(), nullable=False),
        sa.Column('gpa', sa.Float(), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('avatar_url', sa.String(length=500), nullable=True),
        sa.Column('advisor_name', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['course_id'], ['courses.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['profile_id'], ['profiles.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_students_course_id'), 'students', ['course_id'], unique=False)
    op.create_index(op.f('ix_students_department'), 'students', ['department'], unique=False)
    op.create_index(op.f('ix_students_email'), 'students', ['email'], unique=True)
    op.create_index(op.f('ix_students_full_name'), 'students', ['full_name'], unique=False)
    op.create_index(op.f('ix_students_id'), 'students', ['id'], unique=False)
    op.create_index(op.f('ix_students_profile_id'), 'students', ['profile_id'], unique=False)
    op.create_index(op.f('ix_students_semester'), 'students', ['semester'], unique=False)
    op.create_index(op.f('ix_students_status'), 'students', ['status'], unique=False)
    op.create_index(op.f('ix_students_student_id'), 'students', ['student_id'], unique=True)
