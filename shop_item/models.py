from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class ShopItem(models.Model):
    title = models.CharField(max_length=20)
    description = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    created_date = models.DateTimeField(auto_now_add=True)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name="seller")
    buyer = models.ForeignKey(User, null=True, on_delete=models.PROTECT, related_name="buyer")
    # Items do not always have a buyer. Only after being purchased will they have a buyer but until then this field
    # will be NULL.