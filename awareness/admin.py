from django.contrib import admin
from .models import BlogPost, Comment, Like

# Simple admin registration
admin.site.register(BlogPost)
admin.site.register(Comment)
admin.site.register(Like)