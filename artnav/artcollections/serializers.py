from artnav.artcollections.models import ArtCollection
from artnav.artworks.models import Artwork
from rest_framework import serializers
from django.contrib.auth.models import User


class ArtCollectionSerializer(serializers.HyperlinkedModelSerializer):
  curator = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
  artworks = serializers.PrimaryKeyRelatedField(queryset=Artwork.objects.all(), many=True)

  class Meta:
    model = ArtCollection
    fields = ('collection_title', 'collection_slug', 'curatorial_statement', 'external_link',
      'artworks', 'pub_date', 'curator', 'id')

