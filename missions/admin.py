from django.contrib import admin
from .models import User, Volunteer, Skill, Interest, Language, Location, Mission, Application, Notification

admin.site.register(User)
admin.site.register(Volunteer)
admin.site.register(Skill)
admin.site.register(Interest)
admin.site.register(Language)
admin.site.register(Location)
admin.site.register(Mission)
admin.site.register(Application)
admin.site.register(Notification)
