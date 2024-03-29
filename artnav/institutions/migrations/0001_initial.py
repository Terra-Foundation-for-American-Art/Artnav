# Generated by Django 3.2.4 on 2021-11-29 22:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Institution',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('about', models.TextField(max_length=1000)),
                ('website', models.URLField(blank=True)),
                ('slug', models.SlugField()),
            ],
        ),
    ]
