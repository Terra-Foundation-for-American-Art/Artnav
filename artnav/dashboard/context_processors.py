# from django.contrib.auth import AuthenticationMiddleware

from artnav.artcollections.models import ArtCollection
from artnav.artworks.models import Artwork, Artist

from artnav.artcollections.forms import CreateNewArtCollectionForm
from artnav.artworks.forms import CreateNewArtworkForm, CreateNewArtistForm

def add_dashboard_data_to_context(request):
  user = request.user
  if user.is_authenticated:
    collectionCount = len(ArtCollection.objects.filter(curator_id = user.id))
    artworkCount = len(Artwork.objects.filter(curator_id = user.id))
    contextData = {
      'collection_count': collectionCount,
      'artwork_count': artworkCount
    }
    return contextData
  else:
    contextData = {
      'collection_count': 0,
      'artwork_count': 0
    }
    return contextData


def add_dashboard_create_forms_to_context(request):
  user = request.user
  newArtCollectionForm = CreateNewArtCollectionForm()
  newArtworkForm = CreateNewArtworkForm(user)
  newArtistForm = CreateNewArtistForm()
  contextData = {
    'form': newArtCollectionForm,
    'artworkForm': newArtworkForm,
    'artistForm': newArtistForm
  }
  return contextData


def add_artists_and_collections_list_to_context(request):
  user = request.user
  if user.is_authenticated:
    artists = Artist.objects.all()
    collections = ArtCollection.objects.filter(curator_id = user.id)

    contextData = {
      'artists': artists,
      'collections': collections
    }

  else:
    contextData = {
      'artists': 'No artists found.',
      'collections': 'Login to see your collections'
    }

  return contextData

