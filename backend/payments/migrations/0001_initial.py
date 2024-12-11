# Generated by Django 5.0.4 on 2024-12-07 11:28

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tourist_spots', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.PositiveIntegerField(verbose_name='支払い金額')),
                ('status', models.CharField(choices=[('paid', 'Paid'), ('refunded', 'Refunded'), ('failed', 'Failed')], default='paid', max_length=10, verbose_name='ステータス')),
                ('is_participating', models.BooleanField(default=False, verbose_name='ごみ拾い参加フラグ')),
                ('stripe_session_id', models.CharField(max_length=255, unique=True, verbose_name='StripeセッションID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='作成日時')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新日時')),
                ('tourist_spot', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to='tourist_spots.touristspot', verbose_name='観光地')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to=settings.AUTH_USER_MODEL, verbose_name='ユーザー')),
            ],
            options={
                'verbose_name': '取引',
                'verbose_name_plural': '取引',
            },
        ),
    ]