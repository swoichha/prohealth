# Generated by Django 2.0.5 on 2018-06-11 11:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users_query', '0002_auto_20180611_1113'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='prescription',
            name='doc',
        ),
    ]
