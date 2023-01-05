from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render
from django.views import View
from rest_framework.authtoken.models import Token

from shop_item.models import ShopItem


# Create your views here.

def hello_world_view(request):
    return HttpResponse("Hello world")

class landingView(View):

    def get(self, request):
        itemCount = ShopItem.objects.all().count()
        print(itemCount)
        return render(request, "landing.html", {"repopulated": False, "itemCount": itemCount})

    def post(self, request):


        # First delete all users and objects
        items = ShopItem.objects.all()
        items.delete()

        users = User.objects.all()
        users.delete()

        # Then create 6 new users
        for x in range(6):
            newUsername = "testuser" + str(x+1)
            newEmail = "testuser" + str(x+1) + "@shop.aa"
            newPassword = "pass" + str(x+1)

            newUser = User.objects.create_user(username=newUsername, password=newPassword, email=newEmail, id=x+1)
            Token.objects.create(user=newUser)

        # And finally create 10 new shop items for 3 users (all for sale).
        counter = 1
        for x in range(10):
            newDescription = "Lorem ipsum"
            newPrice = x + 1

            for y in range(3):
                newTitle = "Dummy item " + str(counter)
                counter = counter + 1

                newShopItem = ShopItem(
                    title=newTitle + "-" + str(y+1),
                    description=newDescription,
                    price=newPrice,
                    seller=User.objects.get(pk=y+1),
                    id=y*10+x
                )
                newShopItem.save()

        itemCount = ShopItem.objects.all().count()

        return render(request, "landing.html", {"repopulated": True, "itemCount": itemCount})
