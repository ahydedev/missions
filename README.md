# Missions: Olympic Volunteering Platform
## Video URL: https://youtu.be/6etNKrTf9BI

### Concept
This Capstone project application is a volunteering portal for the Paris 2024 Olympic Games.

The application was built with Django using Python and JavaScript, and is structured as a single-page application with client-side rendering reflecting the dynamic nature of the site. 

The software is designed to serve as a one-stop-site for volunteers to access, apply for and receive updates on prospective volunteer placements, and for Olympic mission managers to post and track opportunities, progress candidates’ applications, confirm appointments, and help volunteers to prepare for their placements.

### Distinctiveness and Complexity
This application is distinct from others in this course in terms of its purpose and scope, being a specialised recruitment tool and community engagement platform with a targeted audience. It enables individuals to locate and secure suitable volunteer placements for the Games and provides placement managers with user-friendly resourcing software with which they can advertise opportunities (aka ‘Missions’) and source and select candidates for their vacancies. 

The application is more complex than other CS50w projects with more elaborate and numerous functions (19), models and forms. Its features include, for example:

-	Multiple filters (such as locations, skills and languages) which help to match candidates with the most suitable opportunities and allow individuals to target preferred placements
-	Automated application scoring to help managers to identify best-placed candidates
-	Volunteer and manager notifications, such as confirmation of application, notification of outcome, confirmation of listing closure, and acknowledgement of a change of personal details 

The front-end design of this application is more feature-rich and interactive than that of previous projects, using more advanced JavaScript to create a highly visual and engaging platform for the user. Front-end features include video backgrounds, animations such as page transitions and a Games countdown function, and rely on a combination of static and online multimedia.

Tailored and/or restricted views target different users, with volunteers having access to listed placement opportunities and their own application data, and mission managers having access to posting features and the database of applications for their respective missions. JavaScript and CSS are used extensively to display, style and hide elements based on, for example, the status of a user’s application, as well as to pre-populate forms with known information (for example, checkboxes for skills the user has declared during registration are pre-checked on the mission application form). 

The site has a responsive design with mobile, tablet and desktop views. JavaScript History API is also in use for easy site navigation.

### Design Choices
The developer chose to build an Olympic volunteering platform because it provided an opportunity to create a highly interactive, JavaScript-driven site supported by Django’s user-friendly model-view-template framework and strong security features. 

A single page application with client-side rendering and AJAX-based API calls provided quicker and smoother transitions between browser views during development, as well as easier interactions with the site’s JavaScript overall, than was the case with Jinja templating.

The server-side coding is defensive and makes use of Django’s CSRF validation and access restrictions based on request method, user id and access level. Request data is validated using checks for integrity, value and index errors, supported by HTML form validation in the browser.

### Components and Functionality
The application can be run via Django using the command python manage.py runserver from the project folder (“olympics”) in which **manage.py** and the application files are located. 

The application’s business logic is written in **views.py**, the bridge between the model and presentation layer and the location where requests, authentication, validation and responses are handled allowing the application to run.

When an end user accesses the site’s index route in the browser (this being the local address http://127.0.0.1:8000/ in the developer’s application demonstration video) they are presented with the main template, **index.html**, with the display set as *welcome view*. This view contains multiple sections promoting Paris 2024 volunteer opportunities and providing key information such as event dates, locations, volunteer benefits, and details of the application process, alongside rich-media elements such as video loops of Olympic sports. 

**script.js** contains the JavaScript functions for the application’s front end features, requesting and retrieving mission, candidate and application data using AJAX and using event handlers, loops and conditionals to display, style and hide views as the user navigates the site. 

The main navigation bar connects the application’s main views, including the *opportunities view*, which returns a preview list of all current volunteer opportunities from **db.sqlite3**, the application’s relational database which holds all data relating to users, volunteers, missions, locations, applications, skills, languages, interests, and user notifications (as set out in **models.py**. Pagination and filter features then allow for a more targeted search of the database.

Clicking on ‘View Mission’ displays the *mission view*, via which the user can submit an application for a post. The *apply view* then renders an application form displaying the user’s profile information (for review pre-submission), requesting an application statement and providing a set of checkboxes for placement locations, required skills and languages so that the user can confirm their preferred locations and specify that they meet some/all of the skills and language requirements. 

On submission of an application, the apply function in views.py saves the application to the database and returns a notification to the user thanking them for their application. The user is presented with the *my missions view* which displays a summary of all applications they have submitted and the status of each application. They will also see a new notifications badge in red on the navbar, indicating that they have one or more new notifications to read (the exact number being displayed within the badge).

If the user is a mission manager (i.e. has been assigned manager level access by a superuser) they will see a ‘Switch to Manager View’ link on the navbar, allowing them to access manager level features including the *add mission view* and *my posts view*, which presents a list of that manager’s posted missions and dashboard data such as the number of filled and open positions for each role.  

The ‘View Applications’ button takes the manager to a paginated, filterable list of applications for the post in question. Each application has been automatically scored against skills and language requirements with scores presented to the manager in the preview list. From here the manager can access the individual *application view*, which provides full details of the application and includes buttons to appoint or reject the application, or move to the next/previous application in the list. Clicking ‘Appoint’ or ‘Reject’ triggers the respective function in views.py which changes the application status to accepted/unsuccessful in the database and returns a tailored notification to the candidate confirming the outcome.

The manager can also close recruitment on any mission by clicking on the Close Recruitment button in the applications view. This changes the status of the mission to “is_live=False”, and sends a notification to the manager asking them to close any outstanding individual applications.

### Reflections
The application is believed to be fit-for-purpose and this endeavour was successful in that the developer set out to create a JavaScript-rich site that provides a welcoming, engaging and interactive user experience. 

If the task were to be repeated, the developer would focus on more deliberate database field design at the outset in the hope of avoiding a large number of migrations during development. Similarly a more heavily class-based approach to CSS would be adopted to avoid over-specificity. 

This application provides significant opportunities for further development and enhancement, including integration of maps to highlight/select venues, email notifications, automated shortlisting of applications (these are currently scored and directed to managers for a decision), horizontal database partitioning (such as for the Olympic and Paralympic Games which take place later in the year), multi-language support, and on-site query management.
