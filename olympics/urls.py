from django.urls import path, include

from django.contrib import admin

admin.autodiscover()

import missions.views


urlpatterns = [
    path("", missions.views.index, name="index"),
    path("login", missions.views.login_view, name="login"),
    path("logout", missions.views.logout_view, name="logout"),
    path("register", missions.views.register, name="register"),
    path("new", missions.views.add_mission, name="add_mission"),
    path("opportunities/<int:page>", missions.views.view_opportunities, name="view_opportunities"), 
    path("missions/<int:mission_id>", missions.views.view_mission, name="view_mission"),
    path("apply/<int:mission_id>", missions.views.apply, name="apply"),
    path("posts", missions.views.view_posts, name="view_posts"),
    path("applications/<int:mission_id>/<int:page>", missions.views.preview_applications, name="preview_applications"),
    path("application/<int:application_id>", missions.views.view_application, name="view_application"),
    path("go-to/<int:application_id>/<str:prev_or_next>", missions.views.go_to_application, name="go_to_application"),
    path("appoint/<int:application_id>", missions.views.appoint_candidate, name="appoint_candidate"),
    path("reject/<int:application_id>", missions.views.reject_application, name="reject_application"),
    path("close/<int:mission_id>", missions.views.close_recruitment, name="close_recruitment"),
    path("my-missions", missions.views.my_missions, name="my_missions"),
    path("profile", missions.views.update_profile, name="update_profile"),
    path("notifications", missions.views.view_notifications, name="view_notifications"),
    path("admin/", admin.site.urls)
]
