# Generated by Django 5.0.4 on 2024-12-12 10:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('garbage_analysis', '0004_garbagebag_created_at_timestamp'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='garbagebag',
            name='created_at_timestamp',
        ),
    ]
