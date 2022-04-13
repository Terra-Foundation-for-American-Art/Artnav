from django import forms

from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _

import datetime #for checking renewal date range.

from artnav.artworks.models import Artwork, Artist, ArtPoint
from artnav.artcollections.models import ArtCollection


class CreateNewArtworkForm(forms.ModelForm):
    collection = forms.ModelChoiceField(queryset=ArtCollection.objects.none(), required=False)

    class Meta:
      model = Artwork
      fields = (
        'artwork_title',
        'artist',
        'collection',
        # 'image',
      )

    def __init__(self, user, *args, **kwargs):
        super(CreateNewArtworkForm, self).__init__(*args, **kwargs)

        if user.is_authenticated:
          self.fields['collection'].queryset = ArtCollection.objects.filter(curator=user)
        else:
          self.fields['collection'].queryset = None


class AddArtworkToCollectionForm(forms.Form):
    collection = forms.ModelChoiceField(queryset=ArtCollection.objects.none())

    def __init__(self, user, *args, **kwargs):
        super(AddArtworkToCollectionForm, self).__init__(*args, **kwargs)

        if user.is_authenticated:
          self.fields['collection'].queryset = ArtCollection.objects.filter(curator=user)
        else:
          self.fields['collection'].queryset = None


class CreateNewArtistForm(forms.ModelForm):

  class Meta:
    model = Artist
    fields = (
      'artist_name',
      'artist_bio',
    )


class CreateNewPointForm(forms.Form):
    point_x = forms.DecimalField()
    point_y = forms.DecimalField()
    point_title = forms.CharField(max_length=200)
    point_content = forms.CharField(widget=forms.Textarea)


