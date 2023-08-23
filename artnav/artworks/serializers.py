from artnav.artworks.models import Artist, Artwork, ArtPoint
from django.contrib.auth.models import User
from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField 


class ArtistSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = Artist
    fields = ('artist_name', 'artist_bio', 'lifespan', 'id')


class ArtPointSerializer(serializers.ModelSerializer):
  point_image = Base64ImageField(required=False)

  class Meta:
    model = ArtPoint
    fields = ('point_x', 'point_y','zoom_value', 'scale_value', 'point_title', 'point_image', 'point_slug',
      'point_content', 'point_lede', 'artwork_context', 'pub_date', 'custom_order_index', 'id')

 
class ArtworkSerializer(serializers.HyperlinkedModelSerializer):
  curator = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
  artist = serializers.PrimaryKeyRelatedField(queryset=Artist.objects.all())

  class Meta:
    model = Artwork
    fields = ('id', 'artwork_title', 'about', 'description', 'iiif_uuid', 'credit', 'dimensions', 
      'medium', 'accession_number', 'artwork_slug', 'artwork_creation_date', 'creation_date', 
      'updated_at', 'artist', 'curator', 'published', 'og_title', 'og_description',)





