# Generated by Django 3.2.4 on 2022-03-21 14:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0003_remove_profile_website'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='role',
        ),
    ]