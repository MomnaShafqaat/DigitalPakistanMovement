from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'role', 'city', 'is_verified', 'is_staff']
    list_editable = ['role', 'is_verified']
    list_filter = ['role', 'is_verified', 'is_staff']
    search_fields = ['username', 'email', 'city']