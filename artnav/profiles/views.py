# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.template import loader

from django.http import HttpResponse, HttpResponseRedirect

from django.urls import reverse

from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

from django.shortcuts import get_object_or_404, render

from rest_framework import viewsets, mixins, views

from .forms import UserForm, ProfileForm

from .serializers import UserSerializer



# Create your views here.
@login_required
def profile(request):
	user = get_object_or_404(User, pk=request.user.id)
	user_form = UserForm(instance=request.user)
	profile_form = ProfileForm(instance=request.user.profile)

	context = {
		'user': user,
		'user_form': user_form,
		'profile_form': profile_form,
	}

	if request.method == 'POST':
		user_form = UserForm(request.POST, instance=request.user)
		profile_form = ProfileForm(request.POST, instance=request.user.profile)
		if user_form.is_valid() and profile_form.is_valid():
			user_form.save()
			profile_form.save()

			return HttpResponseRedirect(reverse('profiles:user-profile') )


	return render(request, 'profiles/profile.html', context)



class UserViewSet(viewsets.ModelViewSet):
  queryset = User.objects.all()
  serializer_class = UserSerializer
