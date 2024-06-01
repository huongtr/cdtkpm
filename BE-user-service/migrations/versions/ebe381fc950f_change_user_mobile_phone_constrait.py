"""Change user mobile phone constrait

Revision ID: ebe381fc950f
Revises: c81c12a5478c
Create Date: 2024-04-21 12:47:48.635639

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ebe381fc950f'
down_revision = 'c81c12a5478c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_index('ix_users_mobile_phone')
        batch_op.create_index(batch_op.f('ix_users_mobile_phone'), ['mobile_phone'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_users_mobile_phone'))
        batch_op.create_index('ix_users_mobile_phone', ['mobile_phone'], unique=True)

    # ### end Alembic commands ###