# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.
from .models import ArtCollection
# from artworks.models import Artwork


# class ArtworkInline(admin.TabularInline):
# 	model = Artwork


class ArtCollectionAdmin(admin.ModelAdmin):
	fieldsets = [
		('Curator', {'fields': ['curator']}),
		('Collection Title', {'fields': ['collection_title', 'collection_slug']}),
		('Curatorial Statement', {'fields': ['curatorial_statement']}),
		('Artworks', {'fields': ['artworks']})
	]
	prepopulated_fields = {'collection_slug': ('collection_title',), }
	list_display = ('collection_title', 'pub_date')
	list_filter = ['collection_title', 'pub_date']
	search_fields = ['collection_title', 'curatorial_statement']
	filter_horizontal = ('artworks',)
	# inlines = [ArtworkInline]

admin.site.register(ArtCollection, ArtCollectionAdmin)