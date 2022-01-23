# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse

from artnav.artworks.models import Artwork
from artnav.artcollections.models import ArtCollection

def artmap(request, artwork_slug):
  found_artmap = get_object_or_404(Artwork, artwork_slug=artwork_slug, published=True)
  collections_found_in = ArtCollection.objects.filter(artworks__in=[found_artmap.id])
  context = {
    'artwork': found_artmap,
    'collections': collections_found_in
  }
  return render(request, 'gallery/artmap.html', context)
