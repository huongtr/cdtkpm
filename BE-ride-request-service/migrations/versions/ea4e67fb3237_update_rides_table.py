"""Update rides table

Revision ID: ea4e67fb3237
Revises: 794962a2ba28
Create Date: 2024-04-26 18:58:52.937030

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ea4e67fb3237'
down_revision = '794962a2ba28'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('rides', schema=None) as batch_op:
        batch_op.add_column(sa.Column('vehicle_type', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('rides', schema=None) as batch_op:
        batch_op.drop_column('vehicle_type')

    # ### end Alembic commands ###