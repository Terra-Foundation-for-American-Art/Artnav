# Generated by Django 3.2.4 on 2022-01-23 22:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artworks', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='artist',
            name='lifespan',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='artwork',
            name='credit',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='artwork',
            name='dimensions',
            field=models.CharField(blank=True, max_length=400, null=True),
        ),
        migrations.AddField(
            model_name='artwork',
            name='iiif_uuid',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
        migrations.AddField(
            model_name='artwork',
            name='medium',
            field=models.CharField(blank=True, max_length=400, null=True),
        ),
    ]
