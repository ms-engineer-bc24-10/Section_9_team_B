# Generated by Django 5.0.4 on 2024-12-08 12:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_auth', '0006_user_auth_method_user_created_at_user_oauth_provider_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(blank=True, choices=[('user', 'User'), ('operator', 'Operator'), ('developer', 'Developer')], max_length=10, null=True),
        ),
    ]
