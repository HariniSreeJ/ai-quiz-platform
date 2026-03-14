from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # AbstractUser gives us username, email, password, etc.
    account_created_timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
