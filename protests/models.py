from django.db import models
from django.conf import settings
from django.utils import timezone

# Pakistani cities (same as users)
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

# Common protest causes in Pakistan
PROTEST_CAUSES = [
    ('education', 'Education Rights'),
    ('healthcare', 'Healthcare Facilities'),
    ('electricity', 'Electricity & Utilities'),
    ('water', 'Water Shortage'),
    ('employment', 'Employment & Jobs'),
    ('human_rights', 'Human Rights'),
    ('women_rights', "Women's Rights"),
    ('minority_rights', 'Minority Rights'),
    ('price_hike', 'Price Hike & Inflation'),
    ('land_issues', 'Land & Property Issues'),
    ('political', 'Political Issues'),
    ('governance', 'Governance & Corruption'),
    ('environment', 'Environmental Issues'),
    ('other', 'Other Issues'),
]

class Protest(models.Model):
    STATUS_CHOICES = [
        ('pending', '⏳ Pending Approval'),
        ('approved', '✅ Approved'),
        ('rejected', '❌ Rejected'),
        ('upcoming', '📅 Upcoming'),
        ('ongoing', '🔴 Live - Ongoing'),
        ('completed', '✅ Completed'),
        ('cancelled', '❌ Cancelled'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=200, verbose_name="Protest Title")
    description = models.TextField(verbose_name="Detailed Description")
    cause = models.CharField(max_length=50, choices=PROTEST_CAUSES, verbose_name="Protest Cause")
    
    # Organizer Information
    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='organized_protests',
        verbose_name="Organizer"
    )
    organizer_contact = models.CharField(max_length=15, blank=True, verbose_name="Organizer Contact Number")
    
    # Location Details
    city = models.CharField(max_length=100, choices=PAKISTAN_CITIES, verbose_name="City")
    specific_location = models.CharField(max_length=300, verbose_name="Specific Location/Venue")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, verbose_name="Latitude")
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, verbose_name="Longitude")
    
    # Date & Time
    start_datetime = models.DateTimeField(verbose_name="Start Date & Time")
    end_datetime = models.DateTimeField(verbose_name="End Date & Time")
    
    # Expected Participation
    expected_participants = models.PositiveIntegerField(
        default=0, 
        verbose_name="Expected Number of Participants"
    )
    
    # Media & Documents
    poster = models.ImageField(
        upload_to='protest_posters/', 
        blank=True, 
        null=True,
        verbose_name="Protest Poster/Flyer"
    )
    supporting_documents = models.FileField(
        upload_to='protest_documents/', 
        blank=True, 
        null=True,
        verbose_name="Supporting Documents"
    )
    
    # Status & Verification
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    is_verified = models.BooleanField(default=False, verbose_name="Verified Protest")
    verification_notes = models.TextField(blank=True, verbose_name="Admin Verification Notes")
    
    # Safety Information
    is_peaceful = models.BooleanField(default=True, verbose_name="Peaceful Protest")
    safety_guidelines = models.TextField(blank=True, verbose_name="Safety Guidelines")
    
    # Statistics
    views_count = models.PositiveIntegerField(default=0, verbose_name="Total Views")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    verified_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} - {self.get_city_display()}"

    class Meta:
        verbose_name = "Protest"
        verbose_name_plural = "Protests"
        ordering = ['-created_at']

    def is_upcoming(self):
        return self.start_datetime > timezone.now()
    
    def is_ongoing(self):
        now = timezone.now()
        return self.start_datetime <= now <= self.end_datetime
    
    def is_completed(self):
        return self.end_datetime < timezone.now()

class Support(models.Model):
    """Track users who support a protest"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    protest = models.ForeignKey(Protest, on_delete=models.CASCADE, related_name='supports')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'protest']  # Prevent duplicate supports
        verbose_name = "Support"
        verbose_name_plural = "Supports"

    def __str__(self):
        return f"{self.user.username} supports {self.protest.title}"