# Generated by Django 4.2.3 on 2023-08-23 15:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artworks', '0006_remove_artwork_pub_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='artwork',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
