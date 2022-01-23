# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse

from django.template import loader

from django.utils.text import slugify

from django.contrib.auth.decorators import login_required
from django.contrib import messages

from django.shortcuts import get_object_or_404, render

from rest_framework import viewsets, mixins, views

from artnav.artcollections.models import ArtCollection
from artnav.artworks.models import Artwork, Artist

from artnav.artcollections.forms import CreateNewArtCollectionForm
from artnav.artworks.forms import CreateNewArtworkForm, CreateNewArtistForm

from .serializers import DashboardArtworksSerializer, DashboardCollectionsSerializer

# Create your views here.
@login_required
def dashboard(request):
  user = request.user
  artcollections_list = ArtCollection.objects.filter()
  recent_collections = ArtCollection.objects.filter().order_by('-updated_at')[0:3]
  recent_artworks = Artwork.objects.filter().order_by('-updated_at')[0:6]
  all_recent = list(recent_collections) + list(recent_artworks)
  all_recent_sorted = sorted(
      all_recent, key=lambda x: x.updated_at, reverse=True)

  print(all_recent_sorted)

  template = loader.get_template('dashboard/dashboard.html')

  newArtCollectionForm = CreateNewArtCollectionForm()
  newArtworkForm = CreateNewArtworkForm(user)
  newArtistForm = CreateNewArtistForm()

  context = {
    # 'artcollections': artcollections_list,
    # 'recentCollections': recent_collections,
    'recentContent': all_recent_sorted,
    'recentArtworks': recent_artworks,
    'form': newArtCollectionForm,
    'artworkForm': newArtworkForm,
    'artistForm': newArtistForm
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
      messages.success(request, 'A new collection was just added.', extra_tags='alert alert-success')
    else:
      messages.warning(request, 'Your collection did not get added. Give it another shot.', extra_tags='alert alert-danger')

      return HttpResponseRedirect(reverse('dashboard:dashboard') )

  return HttpResponse(template.render(context, request))


@login_required
def handleAddArtwork(request):
  user = request.user
  # newArtworkForm = CreateNewArtworkForm(user)

  if request.method == 'POST':
    newArtworkForm = CreateNewArtworkForm(user, request.POST, request.FILES)

    if not newArtworkForm.is_valid():
      messages.warning(request, 'new Art was not created.', extra_tags='alert alert-danger')
    elif newArtworkForm.is_valid() and not newArtworkForm.cleaned_data['collection']:
      art = Artwork(
        artwork_title = newArtworkForm.cleaned_data['artwork_title'],
        artwork_slug = slugify(newArtworkForm.cleaned_data['artwork_title']),
        artist = newArtworkForm.cleaned_data['artist'],
        curator = request.user,
        image = newArtworkForm.cleaned_data['image']
      )
      art.save()
      messages.success(request, 'new Art was just created.', extra_tags='alert alert-success')

      return HttpResponseRedirect('/art/'+art.artwork_slug)

    elif newArtworkForm.is_valid() and newArtworkForm.cleaned_data['collection']:
      art = Artwork(
        artwork_title = newArtworkForm.cleaned_data['artwork_title'],
        artwork_slug = slugify(newArtworkForm.cleaned_data['artwork_title']),
        artist = newArtworkForm.cleaned_data['artist'],
        curator = request.user,
        image = newArtworkForm.cleaned_data['image']
      )
      art.save()

      selectedArtCollection = ArtCollection.objects.get(pk=newArtworkForm.cleaned_data['collection'].id)
      selectedArtCollection.artworks.add(art)
      messages.success(request, 'Art was just added to a collection.', extra_tags='alert alert-success')

      return HttpResponseRedirect('/art/'+art.artwork_slug)

  return HttpResponseRedirect(reverse('dashboard:dashboard') )


@login_required
def handleAddArtistForm(request):
  if request.method == 'POST':
    newArtistForm = CreateNewArtistForm(request.POST)
    if newArtistForm.is_valid():
      artist = Artist(
        artist_name = newArtistForm.cleaned_data['artist_name'],
        artist_bio = newArtistForm.cleaned_data['artist_bio']
      )
      artist.save()
      messages.success(request, 'A new artist was just added.', extra_tags='alert alert-success')
    else:
      messages.warning(request, 'Your artist did not get added. Give it another shot.', extra_tags='alert alert-danger')

  return HttpResponseRedirect(reverse('dashboard:dashboard') )



class RecentArtworksViewSet(viewsets.ModelViewSet):
  queryset = Artwork.objects.all().order_by('-updated_at')[0:10]
  serializer_class = DashboardArtworksSerializer

  def get_queryset(self):
    queryset = Artwork.objects.all().order_by('-updated_at')[0:10]
    print(self.request.user.username)

    if self.request.user.username == 'getty':
      queryset = Artwork.objects.filter(curator=self.request.user).order_by('-updated_at')[0:10]

    return queryset




class RecentCollectionsViewSet(viewsets.ModelViewSet):
  queryset = ArtCollection.objects.all().order_by('-updated_at')[0:10]
  serializer_class = DashboardCollectionsSerializer

  def get_queryset(self):
    queryset = ArtCollection.objects.all().order_by('-updated_at')[0:10]
    print(self.request.user.username)

    if self.request.user.username == 'getty':
      queryset = ArtCollection.objects.filter(curator=self.request.user).order_by('-updated_at')[0:10]

    return queryset


class AllArtworksViewSet(viewsets.ModelViewSet):
  queryset = Artwork.objects.all().order_by('-updated_at')
  serializer_class = DashboardArtworksSerializer

  def get_queryset(self):
    # This works!
    queryset = Artwork.objects.all().order_by('-updated_at')
    artist = self.request.query_params.get('artist', None)

    if artist is not None:
      queryset = queryset.filter(artist=artist)

    if self.request.user.username == 'getty':
      queryset = queryset.filter(curator=self.request.user).order_by('-updated_at')


    return queryset


class AllCollectionsViewSet(viewsets.ModelViewSet):
  queryset = ArtCollection.objects.all().order_by('-updated_at')
  serializer_class = DashboardCollectionsSerializer

  def get_queryset(self):
    queryset = ArtCollection.objects.all().order_by('-updated_at')
    print(self.request.user.username)

    if self.request.user.username == 'getty':
      queryset = ArtCollection.objects.filter(curator=self.request.user).order_by('-updated_at')

    return queryset






