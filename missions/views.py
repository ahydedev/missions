from django.shortcuts import render
import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.core.paginator import Paginator   
from django.views.decorators.csrf import csrf_exempt

from .models import User, Volunteer, Skill, Interest, Language, Location, Mission, Application, Notification


# Global lists
SKILLS = ["Customer Service", "Event Support", "Chaperoning", "Working with Sports Equipment", "Logistics", "First Aid", "Translation", "Administration", "Marketing", "Design", "Training", "Finance", "Press Operations", "Analytics", "Data Entry", "Photography"]
INTERESTS = ["Archery", "Athletics", "Badminton", "Basketball", "Boxing", "Canoe", "Road Cycling", "Cycling Track", "Mountain Biking", "BMX", "Equestrian", "Fencing", "Football", "Golf", "Gymnastics", "Trampoline", "Handball", "Hockey", "Judo", "Modern Pentathlon", "Rowing", "Rugby", "Sailing", "Shooting", "Table Tennis", "Taekwondo", "Tennis", "Triathlon", "Volleyball", "Beach Volleyball", "Diving", "Marathon Swimming", "Swimming", "Water Polo", "Weightlifting", "Wrestling", "Climbing", "Skateboarding", "Surfing"]
LANGUAGES = ["Chinese", "English", "Spanish", "Arabic", "French", "Persian", "German", "Russian", "Malay", "Portuguese", "Italian", "Turkish", "Lahnda", "Tamil", "Urdu", "Korean", "Hindi", "Bengali", "Japanese", "Vietnamese", "Telugu", "Marathi"]
LOCATIONS = ["Paris", "Greater Paris", "Marseille", "Lille", "Nice", "Lyon", "Saint-Etienne", "Nantes", "Bordeaux", "Châteauroux", "Tahiti"]


def index(request):
    
    return render(request, "missions/index.html")


def login_view(request):
    
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "missions/login.html", {
                "message": "Invalid username and/or password."
            })
    
    else:
        return render(request, "missions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "missions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()

            # Set up user as new volunteer
            user = User.objects.get(username=username)
            first_name = request.POST["first-name"]   
            last_name = request.POST["last-name"]
            city_of_residence = request.POST["city"]
            country_of_residence = request.POST["country"] 
            nationality = request.POST["nationality"]
            skills = request.POST.getlist("skills")
            interests = request.POST.getlist("interests")
            languages = request.POST.getlist("languages")
            
            new_volunteer = Volunteer(
                user = user,  
                first_name = first_name,      
                last_name = last_name,
                city_of_residence = city_of_residence,
                country_of_residence = country_of_residence, 
                nationality = nationality
            )
            new_volunteer.save()

            # Save declared skills, interests, and languages
            for skill in skills:
                skill = Skill.objects.get(name=skill)
                new_volunteer.skills.add(skill)

            for interest in interests:
                interest = Interest.objects.get(name=interest)
                new_volunteer.interests.add(interest)

            for language in languages:
                language = Language.objects.get(name=language)
                new_volunteer.languages.add(language)
            
        except IntegrityError:
            return render(request, "missions/register.html", {
                "message": "Username already taken."
            })
        
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    
    else:
        return render(request, "missions/register.html", {
            "SKILLS": SKILLS,
            "INTERESTS": INTERESTS,
            "LANGUAGES": LANGUAGES
        })


@login_required
def add_mission(request):

    if request.method == "POST":

        if request.user.is_manager:

            # Get form data
            data = json.loads(request.body)
            title = data.get("title")
            games = data.get("competition")
            category = data.get("category")
            description = data.get("description")
            manager = request.user
            locations = data.get("locations")
            duration = data.get("duration")
            skills = data.get("skills")
            languages = data.get("languages")
            num_positions = data.get("num_positions")  
            num_open_positions = num_positions
            interview_required = data.get("interview_required")
            interview_required = "True" if interview_required == "on" else "False"
            applications_deadline = data.get("applications_deadline")
                
            # Save mission to database
            try:
                new_mission = Mission(
                title = title,
                games = games,
                category = category,
                description = description,
                manager = manager,
                duration = duration,
                num_positions = num_positions,
                num_open_positions = num_open_positions,
                interview_required = interview_required,
                applications_deadline = applications_deadline 
                )
                new_mission.save()

                # Update ManyToMany fields: locations, required skills and languages
                for location in locations:
                    new_location = Location.objects.get(name=location)
                    new_mission.locations.add(new_location)
                
                for skill in skills:
                    new_skill = Skill.objects.get(name=skill)
                    new_mission.skills.add(new_skill)
                
                for language in languages:
                    new_language = Language.objects.get(name=language)
                    new_mission.languages.add(new_language)

                # Confirm submission
                return JsonResponse({"message": "Mission saved successfully."}, status=201)

            except IntegrityError:
                return JsonResponse({"message": "IntegrityError: it was not possible to save this post to the database. Please check your submission or contact an administrator for support."}, status=400)

        else:
            return JsonResponse({"error": "User not authorised."}, status=403)
            
    else:
        return JsonResponse({"error": "POST request required."}, status=400)


@csrf_exempt
def view_opportunities(request, page):

    if request.method == "GET":

        # Retrieve current missions from the database
        missions = Mission.objects.filter(is_live=True)

        # Sort newest first
        missions = missions.order_by("-created").all()

        # Paginate posts
        paginator = Paginator(missions, 10)
        current_page = page
        pages = paginator.num_pages
        page_object = paginator.get_page(current_page)
        has_previous = page_object.has_previous()
        has_next = page_object.has_next()

        # Return paginated posts
        return JsonResponse({"missions": [mission.serialize() for mission in page_object], "pages": pages, "current_page": current_page, "has_previous": has_previous, "has_next": has_next}, safe=False)

    elif request.method == "POST":

        # Get filter data
        data = json.loads(request.body)
        locations = data.get("locations")
        skills = data.get("skills")
        languages = data.get("languages")

        mission_ids = []

        # Get missions at specified locations
        for location in locations:
            location = Location.objects.get(name=location)
            missions_at_location = location.missions_at_location.all()
            for mission in missions_at_location:
                mission_ids.append(mission.id)
        missions = Mission.objects.filter(id__in=mission_ids, is_live=True)

        # Get missions with skills match
        for skill in skills:
            skill = Skill.objects.get(name=skill)
            missions_requiring_skill = skill.missions_requiring_skill.all()
            for mission in missions_requiring_skill:
                mission_ids.append(mission.id)
        missions = Mission.objects.filter(id__in=mission_ids, is_live=True)

        # Get missions with languages match
        for language in languages:
            language = Language.objects.get(name=language)
            missions_requiring_language = language.missions_requiring_language.all()
            for mission in missions_requiring_language:
                mission_ids.append(mission.id)
        missions = Mission.objects.filter(id__in=mission_ids, is_live=True)

        # Sort by recency
        missions = missions.order_by("-created").all()

        # Paginate posts
        paginator = Paginator(missions, 10)
        current_page = page
        pages = paginator.num_pages
        page_object = paginator.get_page(current_page)
        has_previous = page_object.has_previous()
        has_next = page_object.has_next()

        # Return filtered posts
        return JsonResponse({"missions": [mission.serialize() for mission in page_object], "pages": pages, "current_page": current_page, "has_previous": has_previous, "has_next": has_next}, safe=False)

    else:
        return JsonResponse({"error": "GET or POST request required."}, status=400)     


def view_mission(request, mission_id):
    
    if request.method == "GET":
        
        # Get mission data    
        try:
            mission = Mission.objects.get(id=mission_id)
            
            # Return mission data
            return JsonResponse({"mission": mission.serialize(), "is_logged_in": request.user.is_authenticated}, safe=False)

        except Mission.DoesNotExist:
            return JsonResponse({"error": "The requested mission could not be found."}, status=404)
    
    else:
        return JsonResponse({"error": "GET request required."}, status=400)


@login_required
def apply(request, mission_id):    
    
    if request.method == 'GET':

        # Get mission and candidate data
        try:
            mission = Mission.objects.get(id=mission_id)
            candidate = Volunteer.objects.get(user_id=request.user.id)

            # Return mission and candidate data to application form view
            return JsonResponse({"mission": mission.serialize(), "candidate": candidate.serialize()}, safe=False)

        except Mission.DoesNotExist:
            return JsonResponse({"error": "The requested mission could not be found."}, status=404)

    if request.method == 'POST':
        
        # Get mission and candidate data
        mission = Mission.objects.get(id=mission_id)
        candidate = Volunteer.objects.get(user_id=request.user.id)

        # Get form data
        data = json.loads(request.body)
        first_name = candidate.first_name
        last_name = candidate.last_name
        email = candidate.user.email
        city_of_residence = candidate.city_of_residence
        country_of_residence = candidate.country_of_residence
        nationality = candidate.nationality
        application_statement = data.get("application_statement")
        skills = data.get("skills")
        locations = data.get("locations")
        languages = data.get("languages")
        interests = candidate.interests.all()
        availability = data.get("availability")
        
        # Score skills and languages against requirements
        required_skills = mission.skills.count()
        matching_skills = len(skills)
        skills_match = f"{matching_skills}/{required_skills}"
        
        required_languages = mission.languages.count()
        matching_languages = len(languages)
        languages_match = f"{matching_languages}/{required_languages}"

        # Extract name values from interests QuerySet
        names_of_interests = []
        for interest in interests:
            names_of_interests.append(interest.name)

        # Create new Application object
        try:
            new_application = Application(
            mission = mission,
            candidate = candidate,
            first_name = first_name,
            last_name = last_name,
            email = email,
            city_of_residence = city_of_residence,
            country_of_residence = country_of_residence,
            nationality = nationality,
            application_statement = application_statement,
            availability = availability,
            locations = locations,
            skills = skills,
            languages = languages,
            interests = names_of_interests,
            skills_match = skills_match,
            languages_match = languages_match
            )
            new_application.save()
            mission.num_applications = mission.applications_for_mission.count()
            mission.save()

            # Create new user notification
            user_notification = Notification(
                recipient = request.user,
                subject = "Thank you for your application for {role}, {name}!".format(role = mission.title, name = candidate.first_name),
                content = "We've received your application and will be in touch as soon as possible with an update. In the meantime, please check this site regularly and stay in touch on Instagram, LinkedIn and Facebook! Thank you again - we appreciate the effort, passion and dedication you have shown in volunteering for the Paris Olympics."
            )
            user_notification.save()
            request.user.new_notifications = request.user.new_notifications + 1
            request.user.save()
                
            # Confirm submission
            return JsonResponse({"message": "Application submitted successfully."}, status=201)
        
        except IntegrityError:
            return JsonResponse({"message": "IntegrityError: it was not possible to save this post to the database. Please check your submission or contact an administrator for support."}, status=400)   

    else:
        return JsonResponse({"error": "GET or POST request required."}, status=400)


@login_required
def view_posts(request):

    if request.method == "GET":

        if request.user.is_manager:

            # Display preview list of posts belonging to user
            missions = request.user.manager_missions.all()

            # Sort missions newest first
            missions = missions.order_by("-created").all()

            # Return missions
            return JsonResponse({"missions": [mission.serialize() for mission in missions]}, safe=False)

        else:
            return JsonResponse({"error": "User not authorised."}, status=403)

    else:
        return JsonResponse({"error": "GET request required."}, status=400)


@login_required
def preview_applications(request, mission_id, page):

    mission = Mission.objects.get(id=mission_id)

    if request.user.is_manager and mission.manager == request.user:
        
        if request.method == "GET":

            # Get applications for specified mission
            applications = Application.objects.filter(mission_id=mission_id)
            
            # Display newest posts first
            applications = applications.order_by("-created").all()

            # Paginate applications
            paginator = Paginator(applications, 10)
            current_page = page
            pages = paginator.num_pages
            page_object = paginator.get_page(current_page)
            has_previous = page_object.has_previous()
            has_next = page_object.has_next()

            # Return paginated posts
            return JsonResponse({"applications": [application.serialize() for application in page_object], "mission": mission.serialize(), "pages": pages, "current_page": current_page, "has_previous": has_previous, "has_next": has_next}, safe=False)

        elif request.method == "POST":

            # Get filters
            data = json.loads(request.body)
            review_status = data.get("review_status")
            locations = data.get("locations")
            skills = data.get("skills")
            languages = data.get("languages")

            # Get applications for specified mission
            mission = Mission.objects.get(id=mission_id)
            mission_applications = Application.objects.filter(mission_id=mission_id)
            
            matching_application_ids = []

            # Get reviewed/unreviewed applications (or both if specified)
            status_values = ["unreviewed", "reviewed"]
            if all(value in review_status for value in status_values): 
                for application in mission_applications:
                    matching_application_ids.append(application.id)
            elif "reviewed" in review_status:
                reviewed_applications = mission_applications.filter(is_accepted=True) | mission_applications.filter(is_unsuccessful=True)
                for application in reviewed_applications:
                    matching_application_ids.append(application.id)
            elif "unreviewed" in review_status:
                unreviewed_applications = mission_applications.filter(is_accepted=False, is_unsuccessful=False)
                for application in unreviewed_applications:
                    matching_application_ids.append(application.id)
            else:
                for application in mission_applications:
                    matching_application_ids.append(application.id)

            # Filter applications by availability to work at specified locations
            for location in locations:
                for application in mission_applications:
                    if location not in application.locations:
                        matching_application_ids.remove(application.id) 

            # Filter applications by skills match
            for skill in skills:
                for application in mission_applications:
                    if skill not in application.skills:
                        matching_application_ids.remove(application.id)

            # Filter missions by languages match
            for language in languages:
                for application in mission_applications:
                    if language not in application.languages:
                        matching_application_ids.remove(application.id)

            matching_applications = Application.objects.filter(id__in=matching_application_ids)

            # Sort applications newest first
            matching_applications = matching_applications.order_by("-created").all()

            # Paginate applications
            paginator = Paginator(matching_applications, 10)
            current_page = page
            pages = paginator.num_pages
            page_object = paginator.get_page(current_page)
            has_previous = page_object.has_previous()
            has_next = page_object.has_next()

            # Return paginated posts
            return JsonResponse({"applications": [application.serialize() for application in page_object], "mission": mission.serialize(), "pages": pages, "current_page": current_page, "has_previous": has_previous, "has_next": has_next}, safe=False)

        else:
            return JsonResponse({"error": "GET or POST request required."}, status=400)

    else:
        return JsonResponse({"error": "User not authorised."}, status=403)


@login_required
def view_application(request, application_id):

    if request.method == "GET":

        try:
            application = Application.objects.get(id=application_id)
        except Application.DoesNotExist:
            return JsonResponse({"error": "The requested application could not be found."}, status=404)
    
        # Find application's position in list of applications for mission
        applications_for_mission = Application.objects.filter(mission=application.mission_id)
        application_ids = []
        for app in applications_for_mission:
            application_ids.append(app.id)    
        current_app_index = application_ids.index(application.id)
        app_has_previous = False if current_app_index == 0 else True
        app_has_next = False if current_app_index == len(application_ids) - 1 else True

        if request.user.is_manager and request.user.id != application.candidate.user_id:

            # Return application with confirmation that the user has administrative privileges 
            return JsonResponse({"application": application.serialize(), "authorised_manager": True,"app_has_previous": app_has_previous, "app_has_next": app_has_next}, safe=False)

        elif request.user.id == application.candidate_id:

            # Return limited application details 
            return JsonResponse({"application": application.serialize(), "authorised_manager": False}, safe=False)

        else:
            return JsonResponse({"error": "User not authorised."}, status=403)

    else:
        return JsonResponse({"error": "GET request required."}, status=400)


@login_required
def go_to_application(request, application_id, prev_or_next):

    if request.method == "GET":
        
        if request.user.is_manager:

            # Get application data
            current_application = Application.objects.get(id=application_id)
            applications_for_mission = Application.objects.filter(mission=current_application.mission_id)
            
            # Find current application's position in list of applications
            application_ids = []
            for application in applications_for_mission:
                application_ids.append(application.id)    
            current_app_index = application_ids.index(current_application.id)
            
            # Identify previous/next application 
            if prev_or_next == "next":
                try:
                    application = applications_for_mission[current_app_index + 1]
                    return JsonResponse({"application": application.serialize()}, safe=False)
                except IndexError:
                    return JsonResponse({"error": "There is no next application to display."}, status=404)

            if prev_or_next == "prev":
                try:
                    application = applications_for_mission[current_app_index - 1]
                    return JsonResponse({"application": application.serialize()}, safe=False)
                except ValueError:
                    return JsonResponse({"error": "There is no previous application to display."}, status=404)

        else:
            return JsonResponse({"error": "User not authorised."}, status=403)

    else:
        return JsonResponse({"error": "GET request required."}, status=400)
        

@login_required
def appoint_candidate(request, application_id):

    if request.method == "PUT":

        application = Application.objects.get(id=application_id)
        candidate = Volunteer.objects.get(user_id=application.candidate_id)

        # If user is manager and is not the applicant
        if request.user.is_manager and request.user.id != candidate.user_id:
    
            # Update application status
            application.is_accepted = True
            application.is_unsuccessful = False
            application.save()

            # Notify candidate
            user_notification = Notification(
                recipient = candidate.user,
                subject = "{name}, you're going to the Paris Olympics!".format(name = candidate.first_name),
                content = "We are delighted to confirm that your application for the role of {role} has been accepted by the Olympic Organising Committee. A position has been reserved for you and a member of the team will make contact with you shortly to discuss next steps, including propose dates and the location of your placement. Congratulations on your appointment - we trust that you will find this placement a highly enjoyable and rewarding one, and look forward to providing you with further information, guidance and support as we move closer to the games.".format(role = application.mission.title),
            )
            user_notification.save()
            candidate.user.new_notifications = candidate.user.new_notifications + 1
            candidate.user.save()

            # Return confirmation 
            return JsonResponse({"message": "Application updated (outcome: appointment)", "mission_id": application.mission_id}, status=200)

        else:
            return JsonResponse({"error": "User not authorised."}, status=403)

    else:
        return JsonResponse({"error": "PUT request required."}, status=400)


@login_required
def reject_application(request, application_id):

    if request.method == "PUT":

        application = Application.objects.get(id=application_id)
        candidate = Volunteer.objects.get(user_id=application.candidate_id)

        # If user is manager and is not the applicant
        if request.user.is_manager and request.user.id != candidate.user_id:

            # Update application status
            application.is_accepted = False
            application.is_unsuccessful = True
            application.save()

            # Notify candidate
            user_notification = Notification(
                recipient = candidate.user,
                subject = "Update on your application for {role}".format(role = application.mission.title),
                content = "Dear {name}, thank you for your application for a {role} position at the Paris Olympics. We are very sorry to have to share with you that your application has not been successful on this occasion. We have received a high volume of applications for this opportunity and have selected candidates whose applications matched the position requirements most closely. We would like to take this opportunity to thank you again for your interest in this opportunity, and emphasise that you can still apply for any other opportunities which might be of interest at this point.".format(role = application.mission.title, name = candidate.first_name) 
            )
            user_notification.save()
            candidate.user.new_notifications = candidate.user.new_notifications + 1
            candidate.user.save()           
            
            # Return confirmation 
            return JsonResponse({"message": "Application updated (outcome: application unsuccessful)", "mission_id": application.mission_id}, status=200)

        else:
            return JsonResponse({"error": "User not authorised."}, status=403)

    else:
        return JsonResponse({"error": "PUT request required."}, status=400)


@login_required
def close_recruitment(request, mission_id):

    if request.method == "PUT":

        mission = Mission.objects.get(id=mission_id)

        if request.user.is_manager and mission.manager == request.user:
    
            # Update mission status
            mission.is_live = False
            mission.save()

            # Issue reminder notification to manager to close any outstanding applications 
            manager_notification = Notification(
                recipient = request.user,
                subject = "Volunteer recruitment for {role}".format(role = mission.title),
                content = "As requested {role} is now listed as closed and will no longer appear in current opportunities listings. <b>Please approve or reject any pending applications</b> for this post in order to notify candidates of the outcome of their application".format(role = mission.title) 
            )
            manager_notification.save()
            request.user.new_notifications = request.user.new_notifications + 1
            request.user.save()           
            
            # Return confirmation 
            return JsonResponse({"message": "Recruitment closed."}, status=200)

        else:
            return JsonResponse({"error": "User not authorised."}, status=403)

    else:
        return JsonResponse({"error": "PUT request required."}, status=400)


@login_required
def my_missions(request):

    if request.method == "GET":

        # Get user applications
        applications = Application.objects.filter(candidate_id=request.user.id)
            
        # Display newest posts first
        applications = applications.order_by("-created").all()

        # Return applications
        return JsonResponse({"applications": [application.serialize() for application in applications]}, safe=False)

    else:
        return JsonResponse({"error": "GET request required."}, status=400)


@login_required
def update_profile(request):

    # Get volunteer data
    volunteer = Volunteer.objects.get(user_id=request.user.id)
    
    # Check user is volunteer
    if request.user.id == volunteer.user_id:    

        if request.method == 'GET':

            # Return candidate data for review
            return JsonResponse({"volunteer": volunteer.serialize()}, safe=False)

        if request.method == 'PUT':

            # Get profile data
            volunteer = Volunteer.objects.get(user_id=request.user.id)

            # Get form data
            data = json.loads(request.body)
            first_name = data.get("first_name")
            last_name = data.get("last_name")
            email = data.get("email")
            city_of_residence = data.get("city_of_residence")
            country_of_residence = data.get("country_of_residence")
            nationality = data.get("nationality")
            skills = data.get("skills")
            languages = data.get("languages")
            interests = data.get("interests")

            # Update volunteer data
            volunteer.first_name = first_name
            volunteer.last_name = last_name
            request.user.email = email
            volunteer.city_of_residence = city_of_residence
            volunteer.country_of_residence = country_of_residence
            volunteer.nationality = nationality
            volunteer.save()

            # Update declared skills, interests, and languages
            volunteer.skills.clear()
            for skill in skills:
                skill = Skill.objects.get(name=skill)
                volunteer.skills.add(skill)

            volunteer.interests.clear()
            for interest in interests:
                interest = Interest.objects.get(name=interest)
                volunteer.interests.add(interest)

            volunteer.languages.clear()
            for language in languages:
                language = Language.objects.get(name=language)
                volunteer.languages.add(language)

            # Create new user notification
            user_notification = Notification(
                recipient = request.user,
                subject = "Profile data updated",
                content = "Hi {first_name}, thank you for updating your profile details. These have been updated and will appear on your profile page. Please take a moment to check that the new details are correct.".format(first_name = volunteer.first_name),
            )
            user_notification.save()
            request.user.new_notifications = request.user.new_notifications + 1
            request.user.save()
                
            # Confirm submission
            return JsonResponse({"message": "Profile updated successfully."}, status=200)

        else:
            return JsonResponse({"error": "GET or PUT request required."}, status=400)

    else:
        return JsonResponse({"error": "User not authorised."}, status=403)


@login_required
def view_notifications(request):

    if request.method == "GET":

        # Retrieve and sort user notifications    
        notifications = request.user.user_notifications.all()
        notifications = notifications.order_by("-sent").all()

        # Reset new notifications to none
        request.user.new_notifications = 0
        request.user.save()

        # Return list of notifications belong to user
        return JsonResponse({"notifications": [notification.serialize() for notification in notifications]}, safe=False)

    elif request.method == "PUT":

        # Set status of all user notifications to read
        notifications = request.user.user_notifications.all()
        for notification in notifications:
            notification.is_read = True
            notification.save()

        # Return confirmation
        return JsonResponse({"message": "Notifications set to read."}, status=200)

    else:
        return JsonResponse({"error": "GET or PUT request required."}, status=400)
