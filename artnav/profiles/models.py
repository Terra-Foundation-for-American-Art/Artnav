# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.db.models.signals import post_save

from django.dispatch import receiver

from django.contrib.auth.models import User
from artnav.institutions.models import Institution


class Profile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	role = models.CharField(max_length=300, blank=True, null=True)
	# institution = models.ForeignKey(Institution, on_delete=models.SET_NULL, blank=True, null=True)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
	if created:
		Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
	instance.profile.save()