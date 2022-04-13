# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

from django.contrib.auth.models import User
from django.utils import timezone


class Artist(models.Model):
  artist_name = models.CharField(max_length=200, unique=True)
  artist_bio = models.TextField(blank=True, null=True)
  lifespan = models.CharField(max_length=200, blank=True, null=True)

  def __str__(self):
    return self.artist_name

# @python_2_unicode_compatible
class Artwork(models.Model):
  artwork_title = models.CharField(max_length=300)
  about = models.TextField(null=True, blank=True)
  
  iiif_uuid = models.CharField(max_length=300, blank=True, null=True)
  credit = models.TextField(null=True, blank=True)
  dimensions = models.CharField(max_length=400, blank=True, null=True)
  medium = models.CharField(max_length=400, blank=True, null=True)

  accession_number = models.CharField(max_length=200, blank=True, null=True)
  artwork_slug = models.SlugField(max_length=300)

  artist = models.ForeignKey(Artist, on_delete=models.SET_NULL, null=True)
  curator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

  published = models.BooleanField(default=False)

  artwork_creation_date = models.CharField(max_length=50, blank=True, null=True)
  creation_date = models.DateTimeField(auto_now_add=True, blank=True, null=True)
  updated_at = models.DateTimeField(auto_now=True, null=True)

  og_title = models.CharField(max_length=200, blank=True, null=True)
  og_description = models.CharField(max_length=300, blank=True, null=True)
  # twitter_title = models.CharField(max_length=200, blank=True, null=True)
  # twitter_description = models.CharField(max_length=300, blank=True, null=True)

  def __str__(self):
    return self.artwork_title


class ArtPoint(models.Model):
  point_x = models.DecimalField(decimal_places=5, max_digits=8)
  point_y = models.DecimalField(decimal_places=5, max_digits=8)
  point_title = models.CharField(max_length=200)
  pub_date = models.DateTimeField('date published', auto_now_add=True, blank=True, null=True)
  custom_order_index = models.IntegerField(blank=True, null=True)
  updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
  point_slug = models.SlugField(unique=True)
  point_content = models.TextField(null=True, blank=True)
  point_lede = models.CharField(max_length=200, blank=True, null=True)
  artwork_context = models.ForeignKey(Artwork, on_delete=models.CASCADE,)
  point_image = models.ImageField(blank=True, null=True)
  zoom_value = models.DecimalField(decimal_places=5, max_digits=8,)
  scale_value = models.IntegerField(default=130)

  def __str__(self):
    return self.point_title

  def save(self, force_insert=False, force_update=False, *args, **kwargs):
    self.artwork_context.save()
    super(ArtPoint, self).save(force_insert, force_update, *args, **kwargs)


