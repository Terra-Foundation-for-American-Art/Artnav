# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.
from .models import Institution
# from artworks.models import Artwork


# class ArtworkInline(admin.TabularInline):
# 	model = Artwork


class InstitutionAdmin(admin.ModelAdmin):
	fieldsets = [
		('Institution Name', {'fields': ['name', 'slug']}),
		('About', {'fields': ['about']}),
		('Website', {'fields': ['website']})
	]
	prepopulated_fields = {'slug': ('name',), }
	list_display = ('name', 'website')
	list_filter = ['name']
	search_fields = ['name']
	# inlines = [ArtworkInline]

admin.site.register(Institution, InstitutionAdmin)