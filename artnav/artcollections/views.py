# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import get_object_or_404, render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
# from django.core.urlresolvers import reverse
from django.utils.text import slugify

from rest_framework import viewsets

from .serializers import ArtCollectionSerializer

from .models import ArtCollection
from artnav.artworks.models import Artwork, Artist

from .forms import CreateNewArtCollectionForm, CreateNewArtworkForm
from artnav.artworks.forms import CreateNewArtistForm


@login_required
def collectionList(request):
  user = request.user
  collection_list = ArtCollection.objects.filter()
  newArtCollectionForm = CreateNewArtCollectionForm()

  context = {
    'collections': collection_list,
    'form': newArtCollectionForm,
  }
  if request.method == 'POST':
      newCollectionForm = CreateNewArtCollectionForm(request.POST)
      print('POST message seen!')

      if newCollectionForm.is_valid():
        ac = ArtCollection(
          collection_title = newCollectionForm.cleaned_data['collection_title'],
          collection_slug = slugify(newCollectionForm.cleaned_data['collection_title']),
          curatorial_statement = newCollectionForm.cleaned_data['curatorial_statement'],
          curator = request.user
        )
        ac.save()
        print('form is valid!')
        return HttpResponseRedirect(reverse('artcollections:collection-list'))

  return render(request, 'artcollections/collection-list.html', context)

@login_required
def collection(request, collection_slug):
  user = request.user
  collection = get_object_or_404(ArtCollection, collection_slug=collection_slug)

  newArtworkForm = CreateNewArtworkForm()
  newArtistForm = CreateNewArtistForm()
  editCollectionForm = CreateNewArtCollectionForm(request.POST, collection)

  art = collection.artworks.all().order_by('-pub_date')
  context = {
    'collection': collection,
    'artworks': art,
    'artworkForm': newArtworkForm,
    'artistForm': newArtistForm,
    'editCollectionForm': editCollectionForm
  }

  if request.method == 'POST':
    if editCollectionForm.is_valid():
      ac = ArtCollection(
        collection_title = editCollectionForm.cleaned_data['collection_title'],
        collection_slug = slugify(editCollectionForm.cleaned_data['collection_title']),
        curatorial_statement = editCollectionForm.cleaned_data['curatorial_statement'],
        curator = request.user
      )
      ac.save()
      print('form is valid!')

  return render(request, 'artcollections/collection.html', context)


@login_required
def handleAddArtwork(request, collection_slug):
  user = request.user
  newArtworkForm = CreateNewArtworkForm()
  if request.method == 'POST':
    newArtworkForm = CreateNewArtworkForm(request.POST, request.FILES)
    if newArtworkForm.is_valid():
      art = Artwork(
        artwork_title = newArtworkForm.cleaned_data['artwork_title'],
        artwork_slug = slugify(newArtworkForm.cleaned_data['artwork_title']),
        artist = newArtworkForm.cleaned_data['artist'],
        curator = request.user,
        image = newArtworkForm.cleaned_data['image'],
      )
      art.save()
      selectedArtCollection = ArtCollection.objects.get(collection_slug=collection_slug)
      selectedArtCollection.artworks.add(art)
      print('form is valid!')
    else:
      print('form is NOT valid!')

  return HttpResponseRedirect(reverse('artcollections:collection', args=[collection_slug]) )


@login_required
def handleAddArtist(request, collection_slug):
  if request.method == 'POST':
    newArtistForm = CreateNewArtistForm(request.POST)
    if newArtistForm.is_valid():
      artist = Artist(
        artist_name = newArtistForm.cleaned_data['artist_name'],
        artist_bio = newArtistForm.cleaned_data['artist_bio']
      )
      artist.save()

  return HttpResponseRedirect(reverse('artcollections:collection', args=[collection_slug]) )


class ArtCollectionViewSet(viewsets.ModelViewSet):
  queryset = ArtCollection.objects.all()
  serializer_class = ArtCollectionSerializer

  def get_queryset(self):
    queryset = ArtCollection.objects.all()
    artwork = self.request.query_params.get('artwork', None)

    if artwork is not None:
      queryset = queryset.filter(artworks=artwork)

    if self.request.user.username == 'getty':
      queryset = queryset.filter(curator=self.request.user)

    return queryset







