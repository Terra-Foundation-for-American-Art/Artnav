from django.conf import settings


def debug_context(request):
  return {'DEBUG': settings.DEBUG}

def env_context(request):
  return {'ENVTYPE': settings.ENVIRON_TYPE}