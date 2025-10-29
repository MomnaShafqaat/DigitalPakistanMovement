from django.contrib.auth.models import AbstractUser
from django.db import models

# Pakistani cities list - we can expand this
PAKISTAN_CITIES = [
    ('islamabad', 'Islamabad'),
    ('rawalpindi', 'Rawalpindi'),
    ('karachi', 'Karachi'),
    ('lahore', 'Lahore'),
    ('faisalabad', 'Faisalabad'),
    ('multan', 'Multan'),
    ('peshawar', 'Peshawar'),
    ('quetta', 'Quetta'),
    ('sialkot', 'Sialkot'),
    ('gujranwala', 'Gujranwala'),
    ('bahawalpur', 'Bahawalpur'),
    ('sargodha', 'Sargodha'),
    ('sukkur', 'Sukkur'),
    ('larkana', 'Larkana'),
    ('hyderabad', 'Hyderabad'),
    ('abbottabad', 'Abbottabad'),
    ('mardan', 'Mardan'),
    ('kasur', 'Kasur'),
    ('dera ghazi khan', 'Dera Ghazi Khan'),
    ('sheikhupura', 'Sheikhupura'),
]

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('user', 'Regular User'),      # Can create blog posts, support protests
        ('organizer', 'Organizer'),    # Can create protests AND blog posts
        ('admin', 'Admin'),            # Can manage everything
    ]
    
    # Personal Information
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    city = models.CharField(max_length=100, choices=PAKISTAN_CITIES, blank=True)
    bio = models.TextField(blank=True, verbose_name="About Me")
    phone_number = models.CharField(max_length=15, blank=True, verbose_name="Phone Number")
    
    # Pakistani ID Information (optional)
    cnic_number = models.CharField(max_length=15, blank=True, verbose_name="CNIC Number")
    date_of_birth = models.DateField(null=True, blank=True, verbose_name="Date of Birth")
    
    # Verification Status
    is_verified = models.BooleanField(default=False, verbose_name="Verified Organizer")
    verification_documents = models.FileField(
        upload_to='verification_docs/', 
        blank=True, 
        null=True,
        verbose_name="Verification Documents"
    )
    
    # Social Media Links (for organizers)
    facebook_url = models.URLField(blank=True, verbose_name="Facebook Profile")
    twitter_url = models.URLField(blank=True, verbose_name="Twitter Profile")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} - {self.get_city_display()}" if self.city else self.username

    # ADD THESE METHODS FOR PERMISSION CHECKING
    def can_create_protests(self):
        """Check if user can create protests"""
        return self.role in ['organizer', 'admin']
    
    def can_create_blog_posts(self):
        """Check if user can create blog posts"""
        return self.role in ['user', 'organizer', 'admin']
    
    def can_manage_content(self):
        """Check if user can manage all content (admin only)"""
        return self.role == 'admin'

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"