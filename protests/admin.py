from django.contrib import admin
from .models import Protest, Support

# Simple admin registration
admin.site.register(Protest)
admin.site.register(Support)