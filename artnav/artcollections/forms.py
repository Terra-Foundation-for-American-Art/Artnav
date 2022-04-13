from django import forms

from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _

import datetime #for checking renewal date range.

from artnav.artworks.models import Artist


class CreateNewArtCollectionForm(forms.Form):
    collection_title = forms.CharField(max_length=200)
    curatorial_statement = forms.CharField(widget=forms.Textarea)

class CreateNewArtworkForm(forms.Form):
    artwork_title = forms.CharField(max_length=200)
    artist = forms.ModelChoiceField(queryset=Artist.objects.all())
    image = forms.ImageField()
