from django import forms

from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _

import datetime #for checking renewal date range.

from artnav.artworks.models import Artist


class CreateNewArtCollectionForm(forms.Form):
    collection_title = forms.CharField(max_length=200)
    curatorial_statement = forms.CharField(widget=forms.Textarea)

# class editArtCollectionForm(forms.Form, instance):
#     collection_title = forms.CharField(max_length=200)
#     curatorial_statement = forms.CharField(widget=forms.Textarea)

    # def clean_collection_title(self):
    #     data = self.cleaned_data['collection_title']

    #     if data.isalpha():
    #         print('it is alpha numeric!')
    #         return data

    #     else:
    #         print('Validation error')
    #         raise ValidationError(_('Collection Titles can only contain letters and numbers.'))

    # def clean_curatorial_statement(self):
    #     data = self.cleaned_data['curatorial_statement']
    #     return data

class CreateNewArtworkForm(forms.Form):
    artwork_title = forms.CharField(max_length=200)
    artist = forms.ModelChoiceField(queryset=Artist.objects.all())
    image = forms.ImageField()
