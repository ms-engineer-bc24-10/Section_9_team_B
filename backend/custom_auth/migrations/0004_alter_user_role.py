# Generated by Django 5.0.4 on 2024-12-07 14:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_auth', '0003_alter_user_email_alter_user_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('user', 'User'), ('operator', 'Operator')], default='user', max_length=10),
        ),
    ]