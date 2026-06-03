"""initial faultline tables

Revision ID: 001
Revises:
Create Date: 2026-06-03

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "brand_profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("brand_values", sa.Text(), nullable=False),
        sa.Column("brand_mission", sa.Text(), nullable=False),
        sa.Column("previous_messaging", sa.Text(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "analyses",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("brand_profile_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("campaign_draft", sa.Text(), nullable=False),
        sa.Column("brand_values", sa.Text(), nullable=False),
        sa.Column("brand_mission", sa.Text(), nullable=False),
        sa.Column("previous_messaging", sa.Text(), nullable=False),
        sa.Column("backlash_risk_score", sa.Integer(), nullable=False),
        sa.Column("result_json", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["brand_profile_id"], ["brand_profiles.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_analyses_created_at", "analyses", ["created_at"], unique=False)
    op.create_index("ix_analyses_brand_profile_id", "analyses", ["brand_profile_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_analyses_brand_profile_id", table_name="analyses")
    op.drop_index("ix_analyses_created_at", table_name="analyses")
    op.drop_table("analyses")
    op.drop_table("brand_profiles")
