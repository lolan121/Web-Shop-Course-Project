from rest_framework import serializers

from shop_item.models import ShopItem


class ShopItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopItem
        fields = "__all__"

class PriceChangeSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.CharField()

    class Meta:
        model = ShopItem
        fields = ["price", "id"]

class CreateItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopItem
        fields = ["price", "title", "description"]

class PurchaseItemsSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.CharField()

    class Meta:
        model = ShopItem
        fields = ["price", "id"]

class SimplePurchaseItemsSerializer(serializers.Serializer):
    id = serializers.CharField
    buyer = serializers.IntegerField
    seller = serializers.IntegerField
    price = serializers.DecimalField(max_digits=6, decimal_places=2)

class SearchStringSerializer(serializers.Serializer):
    searchQuery = serializers.CharField(allow_blank=True)