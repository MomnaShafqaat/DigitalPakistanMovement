from django.db import models
from django.conf import settings
from protests.models import Protest

class ProtestUpdate(models.Model):
    UPDATE_TYPES = [
        ('info', 'ℹ️ General Update'),
        ('alert', '🚨 Important Alert'),
        ('location', '📍 Location Change'),
        ('time', '⏰ Timing Update'),
        ('safety', '🛡️ Safety Update'),
        ('success', '🎉 Success Update'),
    ]
    
    protest = models.ForeignKey(Protest, on_delete=models.CASCADE, related_name='updates')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    update_type = models.CharField(max_length=20, choices=UPDATE_TYPES, default='info', verbose_name="Update Type")
    title = models.CharField(max_length=200, verbose_name="Update Title")
    text = models.TextField(verbose_name="Update Details")
    
    # Media
    image = models.ImageField(upload_to='update_images/', blank=True, null=True, verbose_name="Update Image")
    
    # Important flags
    is_important = models.BooleanField(default=False, verbose_name="Important Update")
    is_verified = models.BooleanField(default=True, verbose_name="Verified Information")
    
  