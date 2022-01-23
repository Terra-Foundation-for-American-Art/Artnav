# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


class Institution(models.Model):
	name = models.CharField(max_length=200)
	about = models.TextField(max_length=1000)
	website = models.URLField(max_length=200, blank=True)
	slug = models.SlugField()

	def __unicode__(self):
		return self.name
