# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

from artnav.artworks.models import Artwork


# Create your models here.
class ArtCollection(models.Model):
  collection_title = models.CharField(max_length=200, unique=True)
  collection_slug = models.SlugField(max_length=50)
  curatorial_statement = models.TextField(blank=True, null=True)
  external_link = models.CharField(max_length=300, null=True)
  artworks = models.ManyToManyField(Artwork, blank=True)
  pub_date = models.DateTimeField('date published', auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  curator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
  creation_date = models.DateTimeField(auto_now_add=True)


  def __str__(self):
  	return self.collection_title
