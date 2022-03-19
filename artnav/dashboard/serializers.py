from django.contrib.auth.models import User
from artnav.artworks.models import Artist, Artwork, ArtPoint
from artnav.artcollections.models import ArtCollection
from django.contrib.auth.models import User
from rest_framework import serializers
from artnav.artworks.serializers import ArtworkSerializer, ArtistSerializer
from artnav.profiles.serializers import UserSerializer
# from .base64Handler import Base64CharField
# from drf_base64.fields import Base64ImageField
from drf_extra_fields.fields import Base64ImageField


class DashboardArtworksSerializer(serializers.HyperlinkedModelSerializer):
  curator = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
  artist = ArtistSerializer(Artist)

  class Meta:
    model = Artwork
    fields = ('id', 'artwork_title', 'iiif_uuid', 'accession_number',
      'artwork_slug', 'artwork_creation_date', 'creation_date', 'updated_at', 'artist',
              'curator', 'published', 'og_title', 'og_description',)


class DashboardCollectionsSerializer(serializers.HyperlinkedModelSerializer):
  curator = UserSerializer(User)
  artworks = ArtworkSerializer(Artwork, many=True)

  class Meta:
    model = ArtCollection
    fields = ('collection_title', 'collection_slug', 'curatorial_statement', 'external_link',
      'artworks', 'pub_date', 'curator', 'id', 'creation_date', 'updated_at',)
