from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    is_manager = models.BooleanField(default=False) 
    new_notifications = models.IntegerField(default=0) 


class Skill(models.Model):
    name = models.CharField(max_length=100)

class Interest(models.Model):
    name = models.CharField(max_length=100)

class Language(models.Model):
    name = models.CharField(max_length=100)


class Volunteer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    city_of_residence = models.CharField(max_length=100)
    country_of_residence = models.CharField(max_length=100)
    nationality = models.CharField(max_length=100)
    skills = models.ManyToManyField(Skill, related_name="volunteers_with_skill", null=True)    
    interests = models.ManyToManyField(Interest, related_name="volunteers_with_interest", null=True) 
    languages = models.ManyToManyField(Language, related_name="language_speakers", null=True) 

    def serialize(self):
        return {
            "user_id": self.user_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.user.email,
            "city_of_residence": self.city_of_residence,
            "country_of_residence": self.country_of_residence,
            "nationality": self.nationality,
            "skills": [skill.name for skill in self.skills.all()],
            "languages": [language.name for language in self.languages.all()],
            "interests": [interest.name for interest in self.interests.all()]
        }


class Location(models.Model):
    name = models.CharField(max_length=100)


GAMES = (
    ("Olympic Games", "Olympic Games"),
    ("Paralympic Games", "Paralympic Games"),
)

MISSION_TYPES = (
    ("Quality Experience", "Quality Experience"),
    ("Sporting Performance", "Sporting Performance"),
    ("Organisation", "Organisation"),
)

class Mission(models.Model):
    title = models.CharField(max_length=100)
    games = models.CharField(max_length=30, choices=GAMES, null=True)
    category = models.CharField(max_length=30, choices=MISSION_TYPES)
    description = models.TextField(max_length=1000)    
    created = models.DateField(auto_now_add=True, null=True)
    manager = models.ForeignKey(User, on_delete=models.CASCADE, related_name="manager_missions")
    locations = models.ManyToManyField(Location, related_name="missions_at_location")
    duration = models.CharField(max_length=30, null=True) 
    skills = models.ManyToManyField(Skill, related_name="missions_requiring_skill")
    languages = models.ManyToManyField(Language, related_name="missions_requiring_language")
    num_positions = models.IntegerField(default=0)    
    num_applications = models.IntegerField(default=0)  
    num_open_positions = models.IntegerField(default=0)
    num_filled_positions = models.IntegerField(default=0) 
    interview_required = models.BooleanField(default=False)
    applications_deadline = models.DateField()
    is_live = models.BooleanField(default=True)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "games": self.games,
            "category": self.category,
            "description": self.description,
            "created": self.created,
            "locations": [location.name for location in self.locations.all()],
            "duration": self.duration,
            "skills": [skill.name for skill in self.skills.all()],             
            "languages": [language.name for language in self.languages.all()],
            "num_positions": self.num_positions,
            "num_open_positions": self.num_open_positions,
            "num_filled_positions": self.num_filled_positions,
            "num_applications": self.num_applications,
            "interview_required": self.interview_required,
            "applications_deadline": self.applications_deadline,
            "is_live": self.is_live
        }


class Application(models.Model):
    candidate = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name="candidate_applications")
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE, related_name="applications_for_mission", null=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=254)
    city_of_residence = models.CharField(max_length=100)
    country_of_residence = models.CharField(max_length=100)
    nationality = models.CharField(max_length=100)
    application_statement = models.TextField(max_length=5000)
    locations = models.TextField(max_length=2000, null=True)
    skills = models.TextField(max_length=2000)
    interests = models.TextField(max_length=2000)
    languages = models.TextField(max_length=2000)
    availability = models.CharField(max_length=10)
    skills_match = models.CharField(max_length=10)
    languages_match = models.CharField(max_length=10)
    availability_match = models.CharField(max_length=10)
    created = models.DateField(auto_now_add=True, null=True)
    is_accepted = models.BooleanField(default=False) 
    is_unsuccessful = models.BooleanField(default=False) 

    def serialize(self):
        return {
            "id": self.id,
            "mission": self.mission.title,
            "mission_id": self.mission_id,
            "candidate": self.candidate_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "city_of_residence": self.city_of_residence,
            "country_of_residence": self.country_of_residence,
            "application_statement": self.application_statement,
            "locations": self.locations,
            "skills": self.skills,
            "interests": self.interests,
            "languages": self.languages,
            "availability": self.availability,  
            "skills_match": self.skills_match,          
            "languages_match": self.languages_match,
            "created": self.created,
            "status": "Reviewed" if self.is_accepted or self.is_unsuccessful else "Submitted",
            "appointment_confirmed": "True" if self.is_accepted else "False"
        }


class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_notifications")
    subject = models.CharField(max_length=100)
    content = models.TextField(max_length=5000)
    sent = models.DateField(auto_now_add=True, null=True)
    is_read = models.BooleanField(default=False) 

    def serialize(self):
        return {
            "id": self.id,
            "recipient": self.recipient_id,
            "subject": self.subject,
            "content": self.content,
            "sent": self.sent, 
            "is_read": self.is_read
        }