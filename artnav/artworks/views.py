# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from decouple import config
import os, json, boto3

from django.shortcuts import get_object_or_404, render

from django.http import HttpResponse, HttpResponseRedirect

from django.urls import reverse

from django.utils.text import slugify

from django.contrib.auth.decorators import login_required
from django.contrib import messages

from rest_framework import viewsets, mixins, views, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser


from .serializers import ArtistSerializer, ArtworkSerializer, ArtPointSerializer

from .models import Artwork, Artist, ArtPoint
from artnav.artcollections.models import ArtCollection

from .forms import CreateNewArtworkForm, CreateNewArtistForm, CreateNewPointForm, AddArtworkToCollectionForm


@login_required
def artworkList(request):
  user = request.user
  artwork_list = Artwork.objects.filter()
  newArtworkForm = CreateNewArtworkForm(user)
  newArtistForm = CreateNewArtistForm()
  context = {
    'artList': artwork_list,
    'artworkForm': newArtworkForm,
    'artistForm': newArtistForm
  }
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

    return HttpResponseRedirect(reverse('artworks:artwork-list') )

  return render(request, 'artworks/artwork-list.html', context)


@login_required
def artwork(request, artwork_slug):
  user = request.user
  artwork = get_object_or_404(Artwork, artwork_slug=artwork_slug)
  artist = Artist.objects.get(pk=artwork.artist_id)
  collections = ArtCollection.objects.filter(artworks=artwork.id)
  artworkPoints = ArtPoint.objects.filter(artwork_context_id=artwork.id)
  newPointForm = CreateNewPointForm(request.POST)
  addToCollectionForm = AddArtworkToCollectionForm(user)
  collections_found_in = ArtCollection.objects.filter(artworks__in=[artwork.id])

  context = {
    'artwork': artwork,
    'artist': artist,
    'collections': collections,
    'points': artworkPoints,
    'pointForm': newPointForm,
    'collectionForm': addToCollectionForm,
    'collections_found': collections_found_in,
  }

  if request.method == 'POST':
    if newPointForm.is_valid():
      point = ArtPoint(
        point_x = newPointForm.cleaned_data['point_x'],
        point_y = newPointForm.cleaned_data['point_y'],
        point_title = newPointForm.cleaned_data['point_title'],
        point_slug = slugify(newPointForm.cleaned_data['point_title']),
        point_content = newPointForm.cleaned_data['point_content'],
        artwork_context_id = artwork.id
      )
      point.save()
      messages.success(request, 'A new point was just added.', extra_tags='alert alert-success')
    else:
      messages.warning(request, 'Your point did not get added. Give it another shot.', extra_tags='alert alert-danger')

      return HttpResponseRedirect(reverse('artworks:artwork-detail', args=(artwork_slug, )) )

  return render(request, 'artworks/artwork.html', context)


@login_required
def artworkPreview(request, artwork_slug):
  user = request.user
  artwork = get_object_or_404(Artwork, artwork_slug=artwork_slug)
  artist = Artist.objects.get(pk=artwork.artist_id)
  collections = ArtCollection.objects.filter(artworks=artwork.id)
  artworkPoints = ArtPoint.objects.filter(artwork_context_id=artwork.id)
  # newPointForm = CreateNewPointForm(request.POST)
  # addToCollectionForm = AddArtworkToCollectionForm(user)
  collections_found_in = ArtCollection.objects.filter(artworks__in=[artwork.id])

  context = {
    'artwork': artwork,
    'artist': artist,
    'collections': collections,
    'points': artworkPoints,
    # 'pointForm': newPointForm,
    # 'collectionForm': addToCollectionForm,
    'collections_found': collections_found_in,
  }

  # if request.method == 'POST':
  #   if newPointForm.is_valid():
  #     point = ArtPoint(
  #       point_x = newPointForm.cleaned_data['point_x'],
  #       point_y = newPointForm.cleaned_data['point_y'],
  #       point_title = newPointForm.cleaned_data['point_title'],
  #       point_slug = slugify(newPointForm.cleaned_data['point_title']),
  #       point_content = newPointForm.cleaned_data['point_content'],
  #       artwork_context_id = artwork.id
  #     )
  #     point.save()
  #     messages.success(request, 'A new point was just added.', extra_tags='alert alert-success')
  #   else:
  #     messages.warning(request, 'Your point did not get added. Give it another shot.', extra_tags='alert alert-danger')

  #     return HttpResponseRedirect(reverse('artworks:artwork-detail', args=(artwork_slug, )) )

  return render(request, 'artworks/artwork-preview.html', context)


@login_required
def addExistingArtworkToCollection(request, artwork_slug):
  user = request.user
  if request.method == 'POST':
    print('post is heard!')
    newArtworkForm = AddArtworkToCollectionForm(user, request.POST)
    if newArtworkForm.is_valid():
      # art = Artwork(
      #   artwork_title = newArtworkForm.cleaned_data['artwork_title'],
      #   artwork_slug = slugify(newArtworkForm.cleaned_data['artwork_title']),
      #   artist = newArtworkForm.cleaned_data['artist'],
      #   curator = request.user,
      # )
      # art.save()
      artwork = Artwork.objects.get(artwork_slug=artwork_slug)
      # artwork.collection.id
      selectedArtCollection = ArtCollection.objects.get(pk=newArtworkForm.cleaned_data['collection'].id)
      selectedArtCollection.artworks.add(artwork)

      messages.success(request, 'Your artwork was added to a collection.', extra_tags='alert alert-success')
    else:
      messages.warning(request, 'Your artwork did not get added. Give it another shot.', extra_tags='alert alert-danger')

    return HttpResponseRedirect(reverse('artworks:artwork-detail', args=(artwork_slug, )) )



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

    return HttpResponseRedirect(reverse('artworks:artwork-list'))

  return HttpResponse(reverse('artworks:artwork-list'))
  # return render(request, 'artworks/artwork-list.html', context)


class ArtistViewSet(viewsets.ModelViewSet):
  queryset = Artist.objects.all()
  serializer_class = ArtistSerializer


class ArtworkViewSet(viewsets.ModelViewSet):
  queryset = Artwork.objects.all()
  serializer_class = ArtworkSerializer

  def get_queryset(self):
    # This works!

    queryset = Artwork.objects.all()
    accession_num = self.request.query_params.get('accession_num', None)

    if accession_num is not None:
      queryset = queryset.filter(accession_number=accession_num)

    return queryset


class ArtPointViewSet(viewsets.ModelViewSet, generics.RetrieveUpdateDestroyAPIView):
  queryset = ArtPoint.objects.all()
  serializer_class = ArtPointSerializer

  def get_queryset(self):
    # This works!
    orders = [ 'custom_order_index', '-pub_date' ]

    queryset = ArtPoint.objects.all().order_by(*orders)
    artwork = self.request.query_params.get('artwork', None)

    if artwork is not None:
      queryset = queryset.filter(artwork_context=artwork)

    return queryset


class s3SignView(views.APIView):
  renderer_classes = (JSONRenderer, )
  parser_classes = (JSONParser,)
  S3_BUCKET = config('AWS_STORAGE_BUCKET_NAME')

  def get(self, request, *args, **kwargs):

    file_name = request.GET.get('file_name', '')
    file_type = request.GET.get('file_type', '')

    s3 = boto3.client(
      's3',
      aws_access_key_id=config('AWS_ACCESS_KEY_ID'),
      aws_secret_access_key=config('AWS_SECRET_ACCESS_KEY')
    )

    presigned_post = s3.generate_presigned_post(
      Bucket = self.S3_BUCKET,
      Key = file_name,
      Fields = {"acl": "public-read", "Content-Type": file_type},
      Conditions = [
        {"acl": "public-read"},
        {"Content-Type": file_type}
      ],
      ExpiresIn = 3600
    )

    signed_key = json.dumps({
      'data': presigned_post,
      'url': 'https://%s.s3.amazonaws.com/%s' % (self.S3_BUCKET, file_name)
    })

    return Response(signed_key)
