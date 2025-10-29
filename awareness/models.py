from django.db import models
from django.conf import settings

class BlogPost(models.Model):
    CATEGORY_CHOICES = [
        ('legal_rights', '📚 Legal Rights'),
        ('protest_safety', '🛡️ Protest Safety'),
        ('laws', '⚖️ Laws & Regulations'),
        ('guidelines', '📋 Protest Guidelines'),
        ('success_stories', '🌟 Success Stories'),
        ('general', '📢 General Awareness'),
    ]
    
    title = models.CharField(max_length=200, verbose_name="Post Title")
    content = models.TextField(verbose_name="Content")
    excerpt = models.TextField(max_length=300, blank=True, verbose_name="Short Excerpt")
    
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="Author")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general', verbose_name="Category")
    
    # Media
    featured_image = models.ImageField(upload_to='blog_images/', blank=True, null=True, verbose_name="Featured Image")
    
    # Status
    is_published = models.BooleanField(default=False, verbose_name="Publish Post")
    is_featured = models.BooleanField(default=False, verbose_name="Featured Post")
    
    # Statistics
    views_count = models.PositiveIntegerField(default=0, verbose_name="Views")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Blog Post"
        verbose_name_plural = "Blog Posts"
        ordering = ['-created_at']

class Comment(models.Model):
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(verbose_name="Comment")
    is_approved = models.BooleanField(default=True, verbose_name="Approved")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.user} on {self.blog_post}"

    class Meta:
        verbose_name = "Comment"
        verbose_name_plural = "Comments"
        ordering = ['-created_at']

class Like(models.Model):
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['blog_post', 'user']
        verbose_name = "Like"
        verbose_name_plural = "Likes"

    def __str__(self):
        return f"{self.user.username} likes {self.blog_post.title}"