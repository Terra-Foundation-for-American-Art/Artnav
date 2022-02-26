# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.
from .models import Artwork, Artist, ArtPoint


# class ArtPointInline(admin.TabularInline):
# 	model = ArtPoint


class ArtworkAdmin(admin.ModelAdmin):
	fieldsets = [
		('Curator', {'fields': ['curator']}),
		('Artwork Title', {'fields': ['artwork_title', 'artwork_slug', 'published']}),
    	('About the Artwork', {'fields': ['artwork_creation_date', 'accession_number', 'iiif_uuid', 'credit', 
		'dimensions', 'medium',]}),
		('Artist', {'fields': ['artist']})
	]
	prepopulated_fields = {'artwork_slug': ('artwork_title',), }
	list_display = ('artwork_title', )
	list_filter = ['artwork_title', ]
	search_fields = ['artwork_title']
	# inlines = [ArtPointInline]


class ArtistAdmin(admin.ModelAdmin):
	fieldsets = [
		('Artist Name', {'fields': ['artist_name']}),
		('Biography', {'fields': ['lifespan', 'artist_bio']})
	]
	list_display = ['artist_name']
	search_fields = ['artist_name']


class ArtPointAdmin(admin.ModelAdmin):
	fieldsets = [
		('Point of Interest Title', {'fields': [
		 'point_title', 'point_slug', 'point_lede']}),
		('Point of Interest Location', {'fields': ['point_x', 'point_y']}),
		('Point Meta Entry', {'fields': ['point_content']}),
		('Artwork Context', {'fields': ['artwork_context']})
	]
	prepopulated_fields = {'point_slug': ('point_title',), }
	list_display = ['point_title']
	search_fields = ['point_title']


admin.site.register(Artwork, ArtworkAdmin)
admin.site.register(Artist, ArtistAdmin)
admin.site.register(ArtPoint, ArtPointAdmin)
