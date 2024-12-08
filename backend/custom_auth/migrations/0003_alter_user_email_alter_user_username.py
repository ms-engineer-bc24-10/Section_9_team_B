# Generated by Django 5.0.4 on 2024-12-07 07:47

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_auth', '0002_user_firebase_uid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.core.validators.RegexValidator(message='Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters.', regex='^[\\w.@+\\-ぁ-んァ-ン一-龥]+$')], verbose_name='username'),
        ),
    ]