# Generated by Django 3.2.4 on 2021-11-29 22:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Artist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('artist_name', models.CharField(max_length=200, unique=True)),
                ('artist_bio', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Artwork',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('artwork_title', models.CharField(max_length=300)),
                ('description', models.TextField(blank=True, null=True)),
                ('about', models.TextField(blank=True, null=True)),
                ('image_ref', models.CharField(blank=True, max_length=200, null=True)),
                ('catalog_id', models.CharField(blank=True, max_length=200, null=True)),
                ('accession_number', models.CharField(blank=True, max_length=200, null=True)),
                ('artwork_slug', models.SlugField(max_length=300)),
                ('published', models.BooleanField(default=False)),
                ('artwork_creation_date', models.CharField(blank=True, max_length=50, null=True)),
                ('creation_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('pub_date', models.DateTimeField(blank=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('og_title', models.CharField(blank=True, max_length=200, null=True)),
                ('og_description', models.CharField(blank=True, max_length=300, null=True)),
                ('artist', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='artworks.artist')),
                ('curator', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ArtPoint',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('point_x', models.DecimalField(decimal_places=5, max_digits=8)),
                ('point_y', models.DecimalField(decimal_places=5, max_digits=8)),
                ('point_title', models.CharField(max_length=200)),
                ('pub_date', models.DateTimeField(auto_now_add=True, null=True, verbose_name='date published')),
                ('custom_order_index', models.IntegerField(blank=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('point_slug', models.SlugField(unique=True)),
                ('point_content', models.TextField(blank=True, null=True)),
                ('point_lede', models.CharField(blank=True, max_length=200, null=True)),
                ('point_image', models.ImageField(blank=True, null=True, upload_to='')),
                ('zoom_value', models.DecimalField(decimal_places=5, max_digits=8)),
                ('scale_value', models.IntegerField(default=130)),
                ('artwork_context', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='artworks.artwork')),
            ],
        ),
    ]
