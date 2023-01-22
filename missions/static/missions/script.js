// Global variables: skills, languages, locations, sports of interest
SKILLS = ["Customer Service", "Event Support", "Chaperoning", "Working with Sports Equipment", "Logistics", "First Aid", "Translation", "Administration", "Marketing", "Design", "Training", "Finance", "Press Operations", "Analytics", "Data Entry", "Photography"]
INTERESTS = ["Archery", "Athletics", "Badminton", "Basketball", "Boxing", "Canoe", "Road Cycling", "Cycling Track", "Mountain Biking", "BMX", "Equestrian", "Fencing", "Football", "Golf", "Gymnastics", "Trampoline", "Handball", "Hockey", "Judo", "Modern Pentathlon", "Rowing", "Rugby", "Sailing", "Shooting", "Table Tennis", "Taekwondo", "Tennis", "Triathlon", "Volleyball", "Beach Volleyball", "Diving", "Marathon Swimming", "Swimming", "Water Polo", "Weightlifting", "Wrestling", "Climbing", "Skateboarding", "Surfing"]
LANGUAGES = ["Chinese", "English", "Spanish", "Arabic", "French", "Persian", "German", "Russian", "Malay", "Portuguese", "Italian", "Turkish", "Lahnda", "Tamil", "Urdu", "Korean", "Hindi", "Bengali", "Japanese", "Vietnamese", "Telugu", "Marathi"]
LOCATIONS = ["Paris", "Greater Paris", "Marseille", "Lille", "Nice", "Lyon", "Saint-Etienne", "Nantes", "Bordeaux", "Châteauroux", "Tahiti"]

document.addEventListener("DOMContentLoaded", function() {

    // Hide page loader icon on page load with 1 second delay
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.querySelector(".page-loader").style.display = "none"; 
        }, "1500");
    });

    // Display welcome view
    document.querySelector("#opportunities-view").style.display = 'none';
    document.querySelector("#welcome-view").style.display = 'block';
    document.querySelector("#add-mission-view").style.display = 'none';
    document.querySelector("#mission-view").style.display = 'none';
    document.querySelector("#apply-view").style.display = 'none';
    document.querySelector("#posts-view").style.display = 'none';
    document.querySelector("#applications-view").style.display = 'none';
    document.querySelector("#application-view").style.display = 'none';
    document.querySelector("#my-missions-view").style.display = 'none';  
    document.querySelector("#notifications-view").style.display = 'none';
    document.querySelector("#update-profile-view").style.display = "none";
        
    // Switch animated banner text after 15 seconds
    setTimeout(() => {
        document.querySelector(".scroll-left").innerHTML = `
            <p><strong>Please <b>register</b> via 'Log In' to access and apply for opportunities, or use staff login <b>Manager</b> password <b>manager</b></strong></p>
        `;
    }, "15000");               

    // When opportunities nav link clicked, display preview list of live missions
    document.querySelector("#opportunities-link").addEventListener("click", function() {
        viewOpportunities(1);                
    });  

    // When view all current missions text is clicked, display preview list of live missions
    document.querySelector("#show-missions").addEventListener("click", function() {
        viewOpportunities(1);                
    });  

    // When notifications link is selected display user notifications view
    if (document.querySelector("#notifications-link")) {
        document.querySelector("#notifications-link").addEventListener("click", function() {
            viewNotifications();                
        });  
    }

    // When username is clicked, display profile view for review/update
    if (document.querySelector(".username")) {
        document.querySelector(".username").addEventListener("click", function() {
            updateProfile();                
        });  
    }

    // When switch user view button is clicked, display manager/volunteer menu items only                    
    if (document.querySelector("#user-view-btn")) { 
        document.querySelector("#user-view-btn").addEventListener('click', function() {

            if (document.querySelector("#user-view-btn").innerHTML == "Switch to Manager View") {
                document.querySelector("#my-posts-link").style.display = "inline-block";
                document.querySelector("#post-mission-link").style.display = "inline-block";
                document.querySelector("#view-opportunities-link").style.display = "none";
                document.querySelector("#my-missions-link").style.display = "none";
                document.querySelector("#volunteer-news-link").style.display = "none"; 
                document.querySelector("#user-view-btn").innerHTML = "Switch to Volunteer View";
            } else {
                document.querySelector("#my-posts-link").style.display = "none";
                document.querySelector("#post-mission-link").style.display = "none";
                document.querySelector("#view-opportunities-link").style.display = "inline-block";
                document.querySelector("#my-missions-link").style.display = "inline-block";
                document.querySelector("#volunteer-news-link").style.display = "inline-block"; 
                document.querySelector("#user-view-btn").innerHTML = "Switch to Manager View";
            }
        });
    }

    // When my missions link is selected, preview user applications
    if (document.querySelector("#my-missions-link")) {
        document.querySelector("#my-missions-link").addEventListener("click", function() {
            myMissions(); 
        });                
    }       

    // When add mission link clicked, display post mission form
    if (document.querySelector("#post-link")) {
        document.querySelector("#post-link").addEventListener("click", function() {
            addMission(); 
        });                
    }         

    // When my posts link is clicked, display user posts
    if (document.querySelector("#posts-link")) {
        document.querySelector("#posts-link").addEventListener("click", function() {
            viewPosts(); 
        });                
    }    

    // When missions filter button is clicked, display filter options
    if (document.querySelector("#missions-filter-btn")) {
        document.querySelector("#missions-filter-btn").addEventListener("click", function() {
            if (document.querySelector("#filter-options").style.display == "none") {
                viewFilteredMissions(1);  
            } else if (document.querySelector("#filter-options").style.display == "block") {
                document.querySelector("#filter-options").style.display = "none";
                document.querySelector("#current-missions-list").innerHTML = "";
                viewOpportunities(1);
            }
        });
    }

    // For mobile viewport, hide dropdown menu when menu item clicked
    if (window.innerWidth < 551) {
        document.querySelectorAll(".nav-link").forEach(item => {
            item.addEventListener("click", function() {
                document.querySelector(".nav-list").style.display = "none";
            })
        });
        document.querySelector("#nav-toggle").addEventListener("click", function() {
            if (document.querySelector(".nav-list").style.display == "block") {
                document.querySelector(".nav-list").style.display = "none";
            } else {
                document.querySelector(".nav-list").style.display = "block";
            }
        });             
    }

    // Display alerts for sections in development
    document.querySelector("#sign-up-btn").addEventListener("click", function(event) {
        alert("This feature is currently in development. Please try again soon.");  
        event.preventDefault();            
    });  
    if (document.querySelector("#news-link")) {
        document.querySelector("#news-link").addEventListener("click", function() {
            alert("This section is currently being updated. Please try again later.");                
        });  
    }

    // Add JavaScript history API for user navigation
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((item) => {
        item.onclick = function() {
            const state = this.dataset.view;
            history.pushState(state, "", `${state}`);
        }
    });
    
    // Allow user to return to previous section by clicking back on browser
    window.onpopstate = function(event) {
        if (event.state) {
            if (event.state == "opportunities") { viewOpportunities(1); }
            else if (event.state == "my-missions") { myMissions(); }
            else if (event.state == "notifications") { viewNotifications(); }
            else if (event.state == "profile") { updateProfile(); }
            else if (event.state == "posts") { viewPosts(); }
            else if (event.state == "new") { addMission(); }
            else if (event.state == "news") { window.location = "/"; }
            else { window.location = "/"; }
        }
        else { window.location = "/"; }
    }
});

function addMission() {

    // Make post form visible, hide other views
    document.querySelector("#opportunities-view").style.display = 'none';
    document.querySelector("#welcome-view").style.display = 'none';
    document.querySelector("#add-mission-view").style.display = 'block';
    document.querySelector("#all-locations").innerHTML = "";
    document.querySelector("#all-skills").innerHTML = "";
    document.querySelector("#all-languages").innerHTML = "";
    document.querySelector("#mission-view").style.display = 'none';
    document.querySelector("#apply-view").style.display = 'none';
    document.querySelector("#posts-view").style.display = 'none';
    document.querySelector("#applications-view").style.display = 'none';
    document.querySelector("#application-view").style.display = 'none';
    document.querySelector("#my-missions-view").style.display = 'none';  
    document.querySelector("#notifications-view").style.display = 'none';
    document.querySelector("#update-profile-view").style.display = "none";

    // Reset form field values
    document.querySelector("#title").value = "";
    document.querySelector("#description").value = "";
    document.querySelector("#competition").value = "";
    document.querySelector("#category").value = "";
    document.querySelector("#duration").value = "";
    document.querySelector("#num-positions").value = "";
    document.querySelector("#app-deadline").value = "";

    // Insert checkboxes for locations, skills, languages
    for (const location of LOCATIONS) {
        document.querySelector("#all-locations").innerHTML += `
            <label class="form-check-label" for="${location}">
                <input class="form-check-input all-locations" type="checkbox" value="${location}" name="locations" id="${location}">
                ${location}
            </label>
        `;
    }

    for (const skill of SKILLS) {
        document.querySelector("#all-skills").innerHTML += `
            <label class="form-check-label" for="${skill}">
                <input class="form-check-input all-skills" type="checkbox" value="${skill}" name="skills" id="${skill}">
                ${skill}
            </label>
        `;
    }

    for (const language of LANGUAGES) {
        document.querySelector("#all-languages").innerHTML += `
            <label class="form-check-label" for="${language}">
                <input class="form-check-input all-languages" type="checkbox" value="${language}" name="languages" id="${language}">
                ${language}
            </label>
        `;
    }

    // When form is posted, save mission
    document.querySelector("#add-mission-form").onsubmit = function () {

        let locations = []
        var checkboxes = document.querySelectorAll(".all-locations:checked");
        for(const checkbox of checkboxes) {
            locations.push(checkbox.value);
        }
        
        let skills = []
        var checkboxes = document.querySelectorAll(".all-skills:checked");
        for(const checkbox of checkboxes) {
            skills.push(checkbox.value);
        }
        
        let languages = []
        var checkboxes = document.querySelectorAll(".all-languages:checked");
        for(const checkbox of checkboxes) {
            languages.push(checkbox.value);
        }
        
        fetch("/new", {
            method: 'POST',
            body: JSON.stringify({
                title: document.querySelector("#title").value,
                competition: document.querySelector("#competition").value,
                category: document.querySelector("#category").value,
                description: document.querySelector("#description").value,
                duration: document.querySelector("#duration").value,    
                locations: locations,
                skills: skills,
                languages: languages,                 
                num_positions: document.querySelector("#num-positions").value,   
                interview_required: document.querySelector("#interview").value,
                applications_deadline: document.querySelector("#app-deadline").value
            }),
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin'
        }) 
        .then(response => response.json())
        .then(result => {
    
            // Print result
            console.log(result);
        })

        // Display my posts view, hide other views
        setTimeout(() => {
            const state = "posts";
            history.pushState(state, "", `${state}`);
            viewPosts();
        }, 500);
        return false;
    }
}

function viewOpportunities(page) {

    // Make view visible, hide other views
    document.querySelector("#opportunities-view").style.display = 'block';
    document.querySelector("#welcome-view").style.display = 'none';
    document.querySelector("#add-mission-view").style.display = 'none';
    document.querySelector("#mission-view").style.display = 'none';
    document.querySelector("#apply-view").style.display = 'none';
    document.querySelector("#posts-view").style.display = 'none';
    document.querySelector("#applications-view").style.display = 'none';
    document.querySelector("#application-view").style.display = 'none';
    document.querySelector("#my-missions-view").style.display = 'none';
    document.querySelector("#notifications-view").style.display = 'none';
    document.querySelector("#current-missions-list").innerHTML = "";
    document.querySelector("#mission-pagination-links").style.visibility = "visible";
    document.querySelector("#mission-pagination-links").innerHTML = "";
    document.querySelector("#filter-options").style.display = "none";
    document.querySelector("#filter-icon").innerHTML = "filter_list";
    document.querySelector("#update-profile-view").style.display = "none";

    // Fetch live missions from database
    fetch(`/opportunities/${page}`)
    .then(response => response.json())
    .then(response => {

        // Print json response
        console.log(response);

        // Add pagination links
        const previousPageLink = document.createElement("li");
        previousPageLink.className = response.has_previous ? "page-item" : "page-item disabled";
        previousPageLink.innerHTML = `<a class="page-link" tabindex="-1">Previous</a>`;
        if (previousPageLink.className != "page-item disabled") {
            previousPageLink.addEventListener("click", function() {
                viewOpportunities(page - 1);                
            });
        }
        document.querySelector("#mission-pagination-links").append(previousPageLink);

        // For each page of paginated posts display a page link
        for (let page = 1; page <= response.pages; page++) {
            const pageLink = document.createElement("li");
            if (page == response.current_page) {
                pageLink.className = "page-item active";
            } else {
                pageLink.className = "page-item";
            }
            pageLink.innerHTML = `<a class="page-link">${page}</a></li>`;
            pageLink.addEventListener("click", function() {
                viewOpportunities(page);
            });
            document.querySelector("#mission-pagination-links").append(pageLink);
        }

        // Load next page link
        const nextPageLink = document.createElement("li");
        nextPageLink.className = response.has_next ? "page-item" : "page-item disabled";
        nextPageLink.innerHTML = `<a class="page-link" tabindex="+1">Next</a>`;
        if (nextPageLink.className != "page-item disabled") {
            nextPageLink.addEventListener("click", function() {
                viewOpportunities(page + 1);                
            });
        }
        document.querySelector("#mission-pagination-links").append(nextPageLink);

        // If there are no posts to display, confirm to user
        if (response.missions.length == 0) {
            document.querySelector("#current-missions-list").innerHTML = `
                <div class="preview flag">
                    <p>There are no current volunteering opportunities to display.</p>
                </div>
            `;
        } else {

            // For each post..
            response.missions.forEach(mission => {
                
                // Create div to display preview of application
                const missionItem = document.createElement("div");

                // Display locations array as string with spacing
                let locations = mission.locations.join(", ");

                // Place application preview content in div
                missionItem.innerHTML = `
                    <div>
                        <p class="preview-item"><b>${mission.title}</b></p>
                        <p class="preview-item">Locations: &nbsp ${locations}</p>
                        <p class="preview-item">Duration: &nbsp ${mission.duration}</p>
                        <p class="preview-item">Created: &nbsp ${mission.created}</p>
                    </div>
                    <div class="preview-button-row">
                        <a class="btn btn-primary view-mission-btn" data-view="mission">View Mission</a>
                    </div>
                `;
                missionItem.className += "preview";

                // When view mission button is clicked, go to application
                missionItem.querySelector(".view-mission-btn").addEventListener("click", function() {
                    const state = this.dataset.view;
                    history.pushState(state, "", `${state}`);
                    viewMission(mission.id);
                });
                
                // Display preview application on page
                document.querySelector("#current-missions-list").append(missionItem);
            })
        }   
    })
}

function viewFilteredMissions(page) {

    // Display filter options form  
    document.querySelector("#filter-options").style.display = "block";
    document.querySelector("#filter-options").innerHTML = `
        <form id="filter-form">
            <div class="form-group">    
                <div id="filter-locations" class="form-check form-check-inline">
                <span class="filter">Locations:&nbsp</span>
                </div>
            </div>
            <div class="form-group">
                <div id="filter-skills" class="form-check form-check-inline">
                <span class="filter">Skills:&nbsp</span>
                </div>
            </div>
            <div class="form-group">
                <div id="filter-languages" class="form-check form-check-inline">
                <span class="filter">Languages:&nbsp</span>
                </div>
            </div>
            <button type="submit" id="apply-filters-btn" class="btn btn-primary">Apply</button>
        </form>
    `;

    // Add checkboxes for filter items
    for (const location of LOCATIONS) {
        document.querySelector("#filter-locations").innerHTML += `
            <label class="form-check-label" for="${location}">
                <input class="form-check-input filter-locations" type="checkbox" value="${location}" name="locations" id="${location}">
                ${location}
            </label>
        `;
    }

    for (const skill of SKILLS) {
        document.querySelector("#filter-skills").innerHTML += `
            <label class="form-check-label" for="${skill}">
                <input class="form-check-input filter-skills" type="checkbox" value="${skill}" name="skills" id="${skill}">
                ${skill}
            </label>
        `;
    }

    for (const language of LANGUAGES) {
        document.querySelector("#filter-languages").innerHTML += `
            <label class="form-check-label" for="${language}">
                <input class="form-check-input filter-languages" type="checkbox" value="${language}" name="languages" id="${language}">
                ${language}
            </label>
        `;
    }

    // When apply filters button is clicked, get filtered posts
    document.querySelector("#filter-form").onsubmit = function (event) {

        // Reset display
        document.querySelector("#current-missions-list").innerHTML = "";
        document.querySelector("#filter-icon").innerHTML = "filter_list_off";
        document.querySelector("#mission-pagination-links").style.visibility = "hidden";

        // Store checkbox values
        let locations = []
        var checkboxes = document.querySelectorAll(".filter-locations:checked");
        for(const checkbox of checkboxes) {
            locations.push(checkbox.value);
        }
        
        let skills = []
        var checkboxes = document.querySelectorAll(".filter-skills:checked");
        for(const checkbox of checkboxes) {
            skills.push(checkbox.value);
        }

        let languages = []
        var checkboxes = document.querySelectorAll(".filter-languages:checked");
        for(const checkbox of checkboxes) {
            languages.push(checkbox.value);
        }

        // Fetch filtered missions
        fetch(`/opportunities/${page}`, {
            method: 'POST',
            body: JSON.stringify({
                locations: locations,
                skills: skills,
                languages: languages           
            }),
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin'
        }) 
        .then(response => response.json())
        .then(response => {
            
            // Print json response
            console.log(response);

            // If there are no matching posts, confirm to user
            if (response.missions.length == 0) {
                document.querySelector("#current-missions-list").innerHTML = `
                    <div class="preview flag">
                        <p>There are no matching volunteering opportunities to display.</p>
                    </div>
                `;
            } else {

                // For each post..
                response.missions.forEach(mission => {
                    
                    // Create div to display preview of application
                    const missionItem = document.createElement("div");

                    // Place application preview content in div
                    let locations = mission.locations.join(", ");
                    missionItem.innerHTML = `
                        <div>
                            <p class="preview-item"><b>${mission.title}</b></p>
                            <p class="preview-item">Locations: &nbsp ${locations}</p>
                            <p class="preview-item">Duration: &nbsp ${mission.duration}</p>
                            <p class="preview-item">Created: &nbsp ${mission.created}</p>
                        </div>
                        <div>
                            <a class="btn btn-primary view-mission-btn" data-view="mission">View Mission</a>
                        </div>
                    `;
                    missionItem.className += "preview";

                    // When view mission button is clicked, go to application
                    missionItem.querySelector(".view-mission-btn").addEventListener("click", function() {
                        const state = this.dataset.view;
                        history.pushState(state, "", `${state}`);
                        viewMission(mission.id);
                    });

                    // Display preview application on page
                    document.querySelector("#current-missions-list").append(missionItem);
                })
            }
        })
        return false;
    }
}
                    
function viewMission(mission_id) {

    // Make mission view visible, hide other views
    document.querySelector("#opportunities-view").style.display = 'none';
    document.querySelector("#welcome-view").style.display = 'none';
    document.querySelector("#add-mission-view").style.display = 'none';
    document.querySelector("#mission-view").style.display = 'block';
    document.querySelector("#apply-view").style.display = 'none';
    document.querySelector("#posts-view").style.display = 'none';
    document.querySelector("#applications-view").style.display = 'none';
    document.querySelector("#application-view").style.display = 'none';
    document.querySelector("#my-missions-view").style.display = 'none';
    document.querySelector("#notifications-view").style.display = 'none';
    document.querySelector("#update-profile-view").style.display = "none";

    // Fetch candidate data for population into application form
    fetch(`/missions/${mission_id}`)
    .then(response => response.json())
    .then(response => {

        // Print json response
        console.log(response);

        // Display arrays as strings with spacing between items
        let locations = response.mission.locations.join(", ");
        let skills = response.mission.skills.join(", ");
        let languages = response.mission.languages.join(", ");
        
        // Render mission content
        document.querySelector("#mission-details").innerHTML = ` 
            <div id="mission-details-content">
                <h1>${response.mission.title}</h1>
                <p><b>Competition:</b> ${response.mission.games}</p> 
                <p><b>Mission category</b>: ${response.mission.category}</p> 
                <p><b>Placement location(s):</b> ${locations}</p>
                <p><b>Duration</b>: ${response.mission.duration}</p>
                <p><b>Description</b>: ${response.mission.description}</p>
                <p><b>Skills required:</b> ${skills}</p>
                <p><b>Language requirement:</b> ${languages}</p>
                <p><b>Open positions:</b> ${response.mission.num_open_positions}</p>
                <p><b>Created:</b> ${response.mission.created}</p>
                <p><b>Deadline for applications:</b> ${response.mission.applications_deadline}</p>
                <br>
                <a id="apply-btn" class="btn btn-primary" data-view="apply">Apply Now</a>
            </div>
        `;

        // If user is not logged in, flag login requirement to user and disable apply button
        applyBtn = document.querySelector("#apply-btn");
        if (!response.is_logged_in) {
            applyBtn.innerHTML = "Please log in to apply";
            applyBtn.href = "/login";
            
        // Add event listener to apply button, submit application on click
        } else {
            applyBtn.addEventListener('click', function() {
                const state = this.dataset.view;
                history.pushState(state, "", `${state}`);        
                apply(response.mission.id);
            });
        }
    })
}

function apply(mission_id) {

    // Make application form view visible, hide other views
    document.querySelector("#opportunities-view").style.display = 'none';
    document.querySelector("#welcome-view").style.display = 'none';
    document.querySelector("#add-mission-view").style.display = 'none';
    document.querySelector("#mission-view").style.display = 'none';
    document.querySelector("#apply-view").style.display = 'block';
    document.querySelector("#posts-view").style.display = 'none';
    document.querySelector("#applications-view").style.display = 'none';
    document.querySelector("#application-view").style.display = 'none';
    document.querySelector("#my-missions-view").style.display = 'none';  
    document.querySelector("#notifications-view").style.display = 'none'; 
    document.querySelector("#update-profile-view").style.display = "none";

    // Fetch candidate data for population into application form
    fetch(`/apply/${mission_id}`)
    .then(response => response.json())
    .then(response => {

        // Print json response
        console.log(response);

        // Render application form
        document.querySelector("#application-form").innerHTML = `

            <h3 class="section-title">Application for ${response.mission.title}</h3>  
            
            <p id="profile-link-text">Please check that the details list below are correct and up to date. Alternatively please click <a id="profile-link" data-view="profile">here</a> to update your profile information.</p>
            <div class="form-group row">
                <label for="first-name" class="col-sm-2 col-form-label">First Name: </label>
                <div class="col-sm-10">
                    <input class="form-control" autofocus type="text" id="first-name" name="first-name" placeholder="${response.candidate.first_name}" disabled>
                </div>
            </div>
            <div class="form-group row">
                <label for="last-name" class="col-sm-2 col-form-label">Last Name: </label>
                <div class="col-sm-10">
                    <input class="form-control" autofocus type="text" id="last-name" name="last-name" placeholder="${response.candidate.last_name}" disabled>
                </div>
            </div>
            <div class="form-group row">
                <label for="email" class="col-sm-2 col-form-label">Email: </label>
                <div class="col-sm-10">
                    <input class="form-control" type="email" id="email" name="email" placeholder="${response.candidate.email}" disabled>
                </div>
            </div>
            <div class="form-group row">
                <label for"city" class="col-sm-2 col-form-label">City/town of Residence: </label>
                <div class="col-sm-10">
                    <input class="form-control" autofocus type="text" id="city" name="city" placeholder="${response.candidate.city_of_residence }" disabled>
                </div>
            </div>
            <div class="form-group row">
                <label for="country" class="col-sm-2 col-form-label">Country of Residence: </label>
                <div class="col-sm-10">
                    <input class="form-control" autofocus type="text" id="country" name="country" placeholder="${response.candidate.country_of_residence}" disabled>
                </div>
            </div>
            <div class="form-group row">
                <label for="nationality" class="col-sm-2 col-form-label">Nationality: </label>
                <div class="col-sm-10">
                    <input class="form-control" autofocus type="text" id="nationality" name="nationality" placeholder="${response.candidate.nationality}" disabled>
                </div>
            </div>

            <br>

            <form id="application">

                <p><b>Application Details</b></p>
                <p>Please provide a short statement (up to 500 words) telling us about your motivation for applying for this volunteer mission.
                <div class="form-group">
                    <textarea class="form-control" id="statement" name="statement" rows="5" required></textarea>
                </div>
                <p>Please provide details of your availability to volunteer, including from and to dates:</p>
                <div class="form-group">
                    <input type="text" class="form-control" id="availability" name="availability" required>
                </div>
                <div class="form-group">
                    <p>Please select the locations at which you are available to volunteer for this mission: </p>
                    <div id="locations-can-work" class="form-check form-check-inline">
                    </div>
                </div>
                <div class="form-group">
                    <p>Relevant skills (please tick all that are applicable):</p>
                    <div id="relevant-skills" class="form-check form-check-inline">
                    </div>
                </div>
                <div class="form-group">
                    <p>Do you speak any or all of the following languages?</p>   
                    <div id="relevant-languages" class="form-check form-check-inline">
                    </div>
                </div>
                <br>
                <button type="submit" id="submit-app-btn" class="btn btn-primary">Submit Application</button>

            </form>
        `;

        // Insert checkboxes for locations, skills, languages (display as checked by default where user has already declared skill/language/interest)
        for (const location of response.mission.locations) {
            document.querySelector("#locations-can-work").innerHTML += `
                <label class="form-check-label" for="${location}">
                    <input class="form-check-input locations" type="checkbox" value="${location}" name="locations" id="${location}">
                    ${location}
                </label>
            `;
        }

        let volSkills = response.candidate.skills;
        for (const skill of response.mission.skills) {
            if (volSkills.includes(skill)) {
                document.querySelector("#relevant-skills").innerHTML += `
                    <label class="form-check-label" for="${skill}">
                        <input class="form-check-input skills" type="checkbox" value="${skill}" name="skills" id="${skill}" checked>
                        ${skill}
                    </label>
                `;
            } else {
                document.querySelector("#relevant-skills").innerHTML += `
                    <label class="form-check-label" for="${skill}">
                        <input class="form-check-input skills" type="checkbox" value="${skill}" name="skills" id="${skill}">
                        ${skill}
                    </label>
                `;
            }
        }

        let volLanguages = response.candidate.languages;
        for (const language of response.mission.languages) {
            if (volLanguages.includes(language)) {
                document.querySelector("#relevant-languages").innerHTML += `
                    <label class="form-check-label" for="${language}">
                        <input class="form-check-input languages" type="checkbox" value="${language}" name="languages" id="${language}" checked>
                        ${language}
                    </label>
                `;
            } else {
                document.querySelector("#relevant-languages").innerHTML += `
                <label class="form-check-label" for="${language}">
                    <input class="form-check-input languages" type="checkbox" value="${language}" name="languages" id="${language}">
                    ${language}
                </label>
            `;
            }
        }

        // Direct user to profile when update profile text clicked
        document.querySelector("#profile-link").addEventListener('click', function() {
            const state = this.dataset.view;
            history.pushState(state, "", `${state}`);        
            updateProfile();
        });

        // Save application when submit button clicked
        document.querySelector("#application").onsubmit = function () {

            let locations = []
            var checkboxes = document.querySelectorAll(".locations:checked");
            for(const checkbox of checkboxes) {
                locations.push(checkbox.value);
            }
            
            let skills = []
            var checkboxes = document.querySelectorAll(".skills:checked");
            for(const checkbox of checkboxes) {
                skills.push(checkbox.value);
            }
            
            let languages = []
            var checkboxes = document.querySelectorAll(".languages:checked");
            for(const checkbox of checkboxes) {
                languages.push(checkbox.value);
            }

            fetch(`/apply/${mission_id}`, {
                method: 'POST',
                body: JSON.stringify({
                    application_statement: document.querySelector("#statement").value,
                    locations: locations,
                    skills: skills,
                    languages: languages,
                    availability: document.querySelector("#availability").value            
                }),
                headers: {'X-CSRFToken': csrftoken},
                mode: 'same-origin'
            }) 
            .then(response => response.json())
            .then(result => {
        
                // Print result
                console.log(result);
            })       
            
            // Display my missions view, hide other views
            setTimeout(() => {
                const state = "my-missions";
                history.pushState(state, "", `${state}`);
                myMissions();
            }, 500); 
            return false;
        }
    })
}

function myMissions() {

    // Make my missions view visible, hide other views
    document.querySelector("#opportunities-view").style.display = 'none';
    document.querySelector("#welcome-view").style.display = 'none';
    document.querySelector("#add-mission-view").style.display = 'none';
    document.querySelector("#mission-view").style.display = 'none';
    document.querySelector("#apply-view").style.display = 'none';
    document.querySelector("#posts-view").style.display = 'none';
    document.querySelector("#applications-view").style.display = 'none';
    document.querySelector("#application-view").style.display = 'none';
    document.querySelector("#my-missions-view").style.display = 'block';
    document.querySelector("#notifications-view").style.display = 'none';
    document.querySelector("#update-profile-view").style.display = "none";

    // Reset missions list contents
    document.querySelector("#my-missions-list").innerHTML = `
        <h3 class="section-title">My Missions</h3>
    `;

    // Fetch user applications from database
    fetch("/my-missions")
    .then(response => response.json())
    .then(response => {

        // Print json response
        console.log(response);

        // If there are no applications to display, confirm to user
        if (response.applications.length == 0) {
            document.querySelector("#my-missions-list").innerHTML += `
                <div class="preview flag">
                    <p>There are no applications to display.</p>
                </div>
            `;
        } else {

            // For each application..
            response.applications.forEach(application => {
                
                // Create div to display application preview
                const applicationItem = document.createElement("div");

                // Place application preview content in div
                applicationItem.innerHTML = `
                    <div>
                        <p class="preview-item">Mission: &nbsp <b>${application.mission}</b></p>
                        <p class="preview-item">Application status: &nbsp <b>${application.status}</b></p>
                        <p class="preview-item appointment"></p>
                    </div>
                    <div>
                        <a class="btn btn-primary view-mission-btn" data-view="mission">View Mission</a>
                        <a class="btn btn-primary view-my-app-btn" data-view="application">My Application</a>
                    </div>
                `;
                applicationItem.className += "preview";

                if (application.appointment_confirmed == "True") {
                    applicationItem.querySelector(".appointment").innerHTML = "APPLICATION SUCCESSFUL";
                }

                // When view mission button is clicked, go to application
                applicationItem.querySelector(".view-mission-btn").addEventListener("click", function() {
                    const state = this.dataset.view;
                    history.pushState(state, "", `${state}`);
                    viewMission(application.mission_id);
                });

                // When view my application button clicked, display limited view of application
                applicationItem.querySelector(".view-my-app-btn").addEventListener("click", function() {
                    const state = this.dataset.view;
                    history.pushState(state, "", `${state}`);
                    viewApplication(application.id);                
                });  

                // Display application on page
                document.querySelector("#my-missions-list").append(applicationItem);
            })    
        }
    })
} 

function viewPosts() {

    // Make my posts view visible, hide other views
    document.querySelector("#opportunities-view").style.display = 'none';
    document.querySelector("#welcome-view").style.display = 'none';
    document.querySelector("#add-mission-view").style.display = 'none';
    document.querySelector("#mission-view").style.display = 'none';
    document.querySelector("#apply-view").style.display = 'none';
    document.querySelector("#posts-view").style.display = 'block';
    document.querySelector("#applications-view").style.display = 'none';
    document.querySelector("#application-view").style.display = 'none';
    document.querySelector("#my-missions-view").style.display = 'none';
    document.querySelector("#notifications-view").style.display = 'none';
    document.querySelector("#update-profile-view").style.display = "none";

    // Reset posts list content
    document.querySelector("#manager-posts-list").innerHTML = `
        <h3 class="section-title">Posted Missions</h3>
    `;

    // Fetch posted missions from database
    fetch("/posts")
    .then(response => response.json())
    .then(response => {

        // Print json response
        console.log(response);

        // If there are no posts to display, confirm to user
        if (response.missions.length == 0) {
            document.querySelector("#manager-posts-list").innerHTML += `
                <div class="preview flag">
                    <p>There are no posts to display.</p>
                </div>
            `;
        } else {

            // For each post..
            response.missions.forEach(mission => {
                
                // Create div to display mission preview
                const missionItem = document.createElement("div");

                // Reformat returned data
                let locations = mission.locations.join(", ");
                let interviewRequired = mission.interview_required ? "Yes" : "No";

                // Place mission preview content in div
                missionItem.innerHTML = `
                    <div>
                        <p class="preview-item closed-flag"></p>
                        <p class="preview-item post-title"><b>${mission.title}</b></p>
                        <p class="preview-item">Locations: ${locations}</p>
                        <p class="preview-item">Duration: ${mission.duration}</p>
                        <p class="preview-item">Positions: ${mission.num_positions}</p>
                        <p class="preview-item">Open Positions: ${mission.num_open_positions}</p>
                        <p class="preview-item">Filled Positions: ${mission.num_filled_positions}</p>
                        <p class="preview-item">Applications: ${mission.num_applications}</p>
                        <p class="preview-item">Interview Required: ${interviewRequired}</p>
                        <p class="preview-item">Applications Deadline: ${mission.applications_deadline}</p>  
                    </div>
                    <div class="post-preview-buttons">      
                        <a class="btn btn-primary view-mission-details-btn" data-view="mission">View Mission</a>
                        <a class="btn btn-primary preview-apps-btn" data-view="applications">View Applications</a>
                    </div>
                `;

                if (mission.is_live) {
                    missionItem.querySelector(".post-preview-buttons").innerHTML += `
                        <a class="btn btn-primary close-btn">Close Recruitment</a>
                    `;
                } else {
                    missionItem.querySelector(".closed-flag").innerHTML = "RECRUITMENT CLOSED";
                    missionItem.querySelector(".closed-flag"). style.display = "block";
                }
                missionItem.className += "post-preview";

                // When view mission button is clicked, go to mission page
                missionItem.querySelector(".view-mission-details-btn").addEventListener("click", function() {
                    const state = this.dataset.view;
                    history.pushState(state, "", `${state}`);
                    viewMission(mission.id);
                });
                
                // When view applications button clicked, display preview list of applications for mission
                missionItem.querySelector(".preview-apps-btn").addEventListener("click", function() {
                    const state = this.dataset.view;
                    history.pushState(state, "", `${state}`);
                    previewApplications(mission.id, 1);                
                });  

                // When close recruitment button clicked, close listing
                if (missionItem.querySelector(".close-btn")) {
                    missionItem.querySelector(".close-btn").addEventListener("click", function() {
                        closeRecruitment(mission.id);                
                    });  
                }

                // Display mmission preview on page
                document.querySelector("#manager-posts-list").append(missionItem);
            })    
        }
    })
} 

function previewApplications(mission_id, page) {

    // Make applications view visible, hide other views
    document.querySelector("#opportunities-view").style.display = 'none';
    document.querySelector("#welcome-view").style.display = 'none';
    document.querySelector("#add-mission-view").style.display = 'none';
    document.querySelector("#mission-view").style.display = 'none';
    document.querySelector("#apply-view").style.display = 'none';
    document.querySelector("#posts-view").style.display = 'none';
    document.querySelector("#applications-view").style.display = 'block';
    document.querySelector("#application-view").style.display = 'none';
    document.querySelector("#my-missions-view").style.display = 'none';
    document.querySelector("#applications-list").innerHTML = "";
    document.querySelector("#apps-pagination-links").style.visibility = "visible";
    document.querySelector("#apps-pagination-links").innerHTML = "";
    document.querySelector("#apps-filter-options").style.display = "none";
    document.querySelector("#apps-filter-btn").style.display = "inline-block";
    document.querySelector("#apps-filter-icon").innerHTML = "filter_list";
    document.querySelector("#apps-filter-reset-btn").style.display = "none";
    document.querySelector("#notifications-view").style.display = 'none';
    document.querySelector("#update-profile-view").style.display = "none";

    // Set filter event listener count to 0 (refered to in filterApplications function to prevent duplication of event listeners)
    filterEventListenerCount = 0;

    // Fetch mission applications from database
    fetch(`/applications/${mission_id}/${page}`)
    .then(response => response.json())
    .then(response => {

        // Print json response
        console.log(response);

        // Add pagination links
        const previousPageLink = document.createElement("li");
        previousPageLink.className = response.has_previous ? "page-item" : "page-item disabled";
        previousPageLink.innerHTML = `<a class="page-link" tabindex="-1">Previous</a>`;
        if (previousPageLink.className != "page-item disabled") {
            previousPageLink.addEventListener("click", function() {
                previewApplications(response.mission.id, page - 1);                
            });
        }
        document.querySelector("#apps-pagination-links").append(previousPageLink);

        // For each page of paginated posts display a page link
        for (let page = 1; page <= response.pages; page++) {
            const pageLink = document.createElement("li");
            if (page == response.current_page) {
                pageLink.className = "page-item active";
            } else {
                pageLink.className = "page-item";
            }
            pageLink.innerHTML = `<a class="page-link">${page}</a></li>`;
            pageLink.addEventListener("click", function() {
                previewApplications(response.mission.id, page);
            });
            document.querySelector("#apps-pagination-links").append(pageLink);
        }

        // Load next page link
        const nextPageLink = document.createElement("li");
        nextPageLink.className = response.has_next ? "page-item" : "page-item disabled";
        nextPageLink.innerHTML = `<a class="page-link" tabindex="+1">Next</a>`;
        if (nextPageLink.className != "page-item disabled") {
            nextPageLink.addEventListener("click", function() {
                previewApplications(response.mission.id, page + 1);                
            });
        }
        document.querySelector("#apps-pagination-links").append(nextPageLink);

        // When applications filter button is clicked, display filter options
        var appsFilterHandler = function() {
            document.querySelector("#apps-filter-options").style.display = "block";
            document.querySelector("#apps-filter-btn").removeEventListener("click", appsFilterHandler);
            filterApplications(response.mission.id, 1);
        } 
        document.querySelector("#apps-filter-btn").addEventListener("click", appsFilterHandler);
        
        // If there are no applications to display, confirm to user
        if (response.applications.length == 0) {
            document.querySelector("#applications-list").innerHTML = `
                <div class="preview flag">
                    <p>There are no applications to display.</p>
                </div>
            `;
        } else {

            // For each application..
            response.applications.forEach(application => {
                
                // Create div to display application preview
                const appsPreviewDiv = document.createElement("div");

                // Place application preview content in div
                appsPreviewDiv.innerHTML = `
                    <p class="preview-item">Candidate: <b>${application.first_name} ${application.last_name}</b></p>
                    <p class="preview-item">Location: ${application.city_of_residence}, ${application.country_of_residence}</p>
                    <p class="preview-item">Skills match: ${application.skills_match}</p>
                    <p class="preview-item">Languages match: ${application.languages_match}</p>
                    <p class="preview-item">Applied: ${application.created}</p>
                    <a class="btn btn-primary view-app-btn" data-view="application">View Application</a>
                `;             

                // If application status is reviewed, set div color to grey and specify reviewed
                if (application.status == "Reviewed") {
                    appsPreviewDiv.className += "preview flag";
                    appsPreviewDiv.querySelector(".view-app-btn").innerHTML = "Reviewed";
                } else {
                    appsPreviewDiv.className += "preview";
                }

                // When view application button is clicked, display application
                appsPreviewDiv.querySelector(".view-app-btn").addEventListener("click", function() {
                    const state = this.dataset.view;
                    history.pushState(state, "", `${state}`);
                    viewApplication(application.id);
                });

                // Display preview application on page
                document.querySelector("#applications-list").append(appsPreviewDiv);
            })
        
            // Populate filter options div
            document.querySelector("#apps-filter-options").innerHTML = `
                <form id="apps-filter-form">    
                    <div class="form-group">    
                        <div id="filter-review-status" class="form-check form-check-inline">
                            <span class="filter">Application status:&nbsp&nbsp</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <div id="filter-available-locations" class="form-check form-check-inline">
                            <span class="filter">Find candidates available to work in:&nbsp&nbsp</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <div id="filter-skills-match" class="form-check form-check-inline">
                            <span class="filter">Skills match:&nbsp&nbsp</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <div id="filter-languages-match" class="form-check form-check-inline">
                            <span class="filter">Languages match:&nbsp&nbsp</span>
                        </div>
                    </div>            
                    <button type="submit" id="apply-apps-filter-btn" class="btn btn-primary">Apply</button>
                </form>
            `;

            // Add checkboxes for filter items
            document.querySelector("#filter-review-status").innerHTML += `
                <label class="form-check-label" for="unreviewed">
                    <input class="form-check-input filter-review-status" type="checkbox" value="unreviewed" name="review-status" id="unreviewed">
                    Unreviewed
                </label>
                <label class="form-check-label" for="reviewed">
                    <input class="form-check-input filter-review-status" type="checkbox" value="reviewed" name="review-status" id="reviewed">
                    Reviewed
                </label>
            `;
            
            let missionLocations = response.mission.locations;
            for (const location of missionLocations) {
                document.querySelector("#filter-available-locations").innerHTML += `
                    <label class="form-check-label" for="${location}">
                        <input class="form-check-input filter-available-locations" type="checkbox" value="${location}" name="locations" id="${location}">
                        ${location}
                    </label>
                `;
            }

            let missionSkills = response.mission.skills;
            for (const skill of missionSkills) {
                document.querySelector("#filter-skills-match").innerHTML += `
                    <label class="form-check-label" for="${skill}">
                        <input class="form-check-input filter-skills-match" type="checkbox" value="${skill}" name="skills" id="${skill}">
                        ${skill}
                    </label>
                `;
            }

            let missionLanguages = response.mission.languages;
            for (const language of missionLanguages) {
                document.querySelector("#filter-languages-match").innerHTML += `
                    <label class="form-check-label" for="${language}">
                        <input class="form-check-input filter-languages-match" type="checkbox" value="${language}" name="languages" id="${language}">
                        ${language}
                    </label>
                `;
            }
        }
    })
}

function filterApplications(mission_id, page) {

    // Display filter options form  
    document.querySelector("#apps-filter-options").style.display = "block";  

    // When apply filters button is clicked, get filtered applications
    document.querySelector("#apps-filter-form").onsubmit = function (event) {

        // Reset display
        document.querySelector("#applications-list").innerHTML = "";
        document.querySelector("#apps-pagination-links").style.visibility = "hidden";
        document.querySelector("#apps-filter-btn").style.display = "none";
        document.querySelector("#apps-filter-reset-btn").style.display = "inline-block";

        // Store checkbox values
        let reviewStatus = []
        var checkboxes = document.querySelectorAll(".filter-review-status:checked");
        for (const checkbox of checkboxes) {
            reviewStatus.push(checkbox.value);
        }
        
        let locations = []
        var checkboxes = document.querySelectorAll(".filter-available-locations:checked");
        for (const checkbox of checkboxes) {
            locations.push(checkbox.value);
        }
        
        let skills = []
        var checkboxes = document.querySelectorAll(".filter-skills-match:checked");
        for (const checkbox of checkboxes) {
            skills.push(checkbox.value);
        }
        
        let languages = []
        var checkboxes = document.querySelectorAll(".filter-languages-match:checked");
        for (const checkbox of checkboxes) {
            languages.push(checkbox.value);
        }
        
        // Fetch filtered applications
        fetch(`/applications/${mission_id}/${page}`, {
            method: 'POST',
            body: JSON.stringify({
                review_status: reviewStatus,
                locations: locations,
                skills: skills,
                languages: languages           
            }),
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin'
        }) 
        .then(response => response.json())
        .then(response => {
            
            // Print json response
            console.log(response);

            // If no event listeners already applied to filter reset btn, add event listener to delete filters and display all applications
            var appsFilterResetHandler = function() {
                document.querySelector("#apps-filter-reset-btn").removeEventListener("click", appsFilterResetHandler);
                previewApplications(response.mission.id, 1);    
            }
            if (filterEventListenerCount == 0) {
                document.querySelector("#apps-filter-reset-btn").addEventListener("click", appsFilterResetHandler);  
                filterEventListenerCount += 1;
            }
            
            // If there are no applications to display, confirm to user
            if (response.applications.length == 0) {
                document.querySelector("#applications-list").innerHTML = `
                    <div class="preview flag">
                        <p>There are no applications to display.</p>
                    </div>
                `;
            } else {
                            
                // For each application..
                response.applications.forEach(application => {
                
                    // Create div to display application preview
                    const appsPreviewDiv = document.createElement("div");

                    // Place application preview content in div
                    appsPreviewDiv.innerHTML = `
                        <p class="preview-item">${application.first_name} ${application.last_name}</p>
                        <p class="preview-item">${application.city_of_residence}, ${application.country_of_residence}</p>
                        <p class="preview-item">Skills match: ${application.skills_match}</p>
                        <p class="preview-item">Languages match: ${application.languages_match}</p>
                        <p class="preview-item">Applied: ${application.created}</p>
                        <a class="btn btn-primary view-app-btn" data-view="application">View Application</a>
                    `;             

                    // If application status is reviewed, set div color to grey and specify reviewed
                    if (application.status == "Reviewed") {
                        appsPreviewDiv.className += "preview flag";
                        appsPreviewDiv.querySelector(".view-app-btn").innerHTML = "Reviewed";
                    } else {
                        appsPreviewDiv.className += "preview";
                    }

                    // When view application button is clicked, display application
                    appsPreviewDiv.querySelector(".view-app-btn").addEventListener("click", function() {
                        const state = this.dataset.view;
                        history.pushState(state, "", `${state}`);
                        viewApplication(application.id);
                    });

                    // Display preview application on page
                    document.querySelector("#applications-list").append(appsPreviewDiv);
                })
            }
        })
        return false;
    }
}

function viewApplication(application_id) {

    // Make application view visible, hide other views
    document.querySelector("#opportunities-view").style.display = 'none';
    document.querySelector("#welcome-view").style.display = 'none';
    document.querySelector("#add-mission-view").style.display = 'none';
    document.querySelector("#mission-view").style.display = 'none';
    document.querySelector("#apply-view").style.display = 'none';
    document.querySelector("#posts-view").style.display = 'none';
    document.querySelector("#applications-view").style.display = 'none';
    document.querySelector("#application-view").style.display = 'block';
    document.querySelector("#my-missions-view").style.display = 'none';
    document.querySelector("#notifications-view").style.display = 'none';
    document.querySelector("#update-profile-view").style.display = "none";

    // Fetch candidate data for population into application form
    fetch(`/application/${application_id}`)
    .then(response => response.json())
    .then(response => {

        // Print json response
        console.log(response);

        // Reformat strings
        let skills = response.application.skills;
        skills = skills.replace(/[\[\]']+/g,'');    // https://www.jsdiaries.com/how-to-remove-brackets-from-string-in-javascript/#:~:text=Brackets%20can%20be%20removed%20from,replace()%20method.
        let languages = response.application.languages;
        languages = languages.replace(/[\[\]']+/g,'');  
        let interests = response.application.interests;
        interests = interests.replace(/[\[\]']+/g,'');  
        let locations = response.application.locations;
        locations = locations.replace(/[\[\]']+/g,'');  

        // Render application content
        document.querySelector("#application-details").innerHTML = ` 
            <h1>Application for ${response.application.mission}</h1>
            <p><b>Submitted:</b> &nbsp ${response.application.created}</p>
            <p><b>First Name:</b> &nbsp ${response.application.first_name}</p>
            <p><b>Last Name:</b> &nbsp ${response.application.last_name}</p>
            <p><b>Email:</b> &nbsp ${response.application.email}</p>
            <p><b>City:</b> &nbsp ${response.application.city_of_residence}</p>
            <p><b>Country:</b> &nbsp ${response.application.country_of_residence}</p>
            <p><b>Application Statement:</b> &nbsp ${response.application.application_statement}</p>
            <p><b>Availability:</b> &nbsp ${response.application.availability}</p>    
            <p><b>Possible work locations:</b> &nbsp ${locations}</p> 
            <p><b>Relevant skills:</b> &nbsp ${skills}</p>
            <p><b>Languages:</b> &nbsp ${languages}</p>   
            <p><b>Sports of interest:</b> &nbsp ${interests}</p>
        `;

        // If user is manager and is not the applicant, display manager options 
        if (response.authorised_manager) {
            document.querySelector("#application-details").innerHTML += `
                <p><b>Skills match:</b> &nbsp ${response.application.skills_match}</p>
                <p><b>Languages match:</b> &nbsp ${response.application.languages_match}</p>  
                <br>
                <p id="outcome"></p>
                <br>  
                <a id="appoint" class="btn btn-primary">Appoint Candidate</a>
                <a id="reject" class="btn btn-primary">Reject Application</a>
                <a id="prev-app" class="btn btn-primary">Previous Application</a>
                <a id="next-app" class="btn btn-primary">Next Application</a>
            `;
        }

        // If application has already been reviewed, replace appoint and reject buttons with confirmation of decision
        if (response.authorised_manager && response.application.status == "Reviewed") {
            document.querySelector("#appoint").style.display = "none";
            document.querySelector("#reject").style.display = "none";
            if (response.application.appointment_confirmed == "True") {
                document.querySelector("#outcome").innerHTML = "APPOINTED";
            } else {
                document.querySelector("#outcome").innerHTML = "UNSUCCESSFUL";
            }
        }

        // If the application is the first or last in the index, hide previous/next button
        if (response.authorised_manager && !response.app_has_previous) {
            document.querySelector("#prev-app").style.display = "none";
        }
        if (response.authorised_manager && !response.app_has_next) {
            document.querySelector("#next-app").style.display = "none";
        }

        // When appoint button is clicked, appoint candidate
        if (document.querySelector("#appoint")) {
            document.querySelector("#appoint").addEventListener("click", function() {
                appointCandidate(response.application.id);
            });
        }
        
        // When reject button is clicked, reject application
        if (document.querySelector("#reject")) {
            document.querySelector("#reject").addEventListener("click", function() {
                rejectApplication(response.application.id);
            });
        }

        // When view next application button is clicked, display next application in list
        if (document.querySelector("#next-app")) {
            document.querySelector("#next-app").addEventListener("click", function() {
                goToApplication(response.application.id, "next");
            });
        }

        // When previous application button is clicked, display previous application in list
        if (document.querySelector("#prev-app")) {
            document.querySelector("#prev-app").addEventListener("click", function() {
                goToApplication(response.application.id, "prev");
            });
        }
    })
}

function goToApplication(application_id, prev_or_next) {

    // Send current application id to server to identify index position
    fetch(`/go-to/${application_id}/${prev_or_next}`)
    .then(response => response.json())
    .then(response => {

        // Print json response
        console.log(response);

        // Display application
        viewApplication(response.application.id);
    })
    return false;
}

function appointCandidate(application_id) {
    
    fetch(`/appoint/${application_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            is_appointed: "True",
            is_unsuccessful: "False"
        }),
        headers: {'X-CSRFToken': csrftoken},
        mode: 'same-origin'
    })
    .then(response => response.json())
    .then(response => {

        // Print result
        console.log(response);

        // Return to applications
        setTimeout(() => {
            const state = "applications";
            history.pushState(state, "", `${state}`);
            previewApplications(response.mission_id, 1);
        }, 500);
        return false;
    })        
}

function rejectApplication(application_id) {
    
    fetch(`/reject/${application_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            is_unsuccessful: "True",
            is_appointed: "False"
        }),
        headers: {'X-CSRFToken': csrftoken},
        mode: 'same-origin'
    })
    .then(response => response.json())
    .then(response => {

        // Print result
        console.log(response);

        // Return to applications
        setTimeout(() => {
            const state = "applications";
            history.pushState(state, "", `${state}`);
            previewApplications(response.mission_id, 1);
        }, 500);
        return false;
    })       
}

function closeRecruitment(mission_id) {
    
    fetch(`/close/${mission_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            is_live: "False"
        }),
        headers: {'X-CSRFToken': csrftoken},
        mode: 'same-origin'
    })
    .then(response => response.json())
    .then(result => {

        // Print result
        console.log(result);
    })        

    // Return home 
    window.scrollTo(0, 0);
    setTimeout(() => {window.location = "/";}, 500);
}

function viewNotifications() {

    // Make notifications view visible, hide other views
    document.querySelector("#opportunities-view").style.display = 'none';
    document.querySelector("#welcome-view").style.display = 'none';
    document.querySelector("#add-mission-view").style.display = 'none';
    document.querySelector("#mission-view").style.display = 'none';
    document.querySelector("#apply-view").style.display = 'none';
    document.querySelector("#posts-view").style.display = 'none';
    document.querySelector("#applications-view").style.display = 'none';
    document.querySelector("#application-view").style.display = 'none';
    document.querySelector("#my-missions-view").style.display = 'none';
    document.querySelector("#notifications-view").style.display = 'block';
    document.querySelector("#update-profile-view").style.display = "none";

    // Reset content
    document.querySelector("#notifications-list").innerHTML = `
        <h3 class="section-title">Notifications</h3>
    `;

    // Fetch user notifications from database
    fetch("/notifications")
    .then(response => response.json())
    .then(response => {

        // Print json response
        console.log(response);

        // If there are no notifications to display, confirm to user
        if (response.notifications.length == 0) {
            document.querySelector("#notifications-list").innerHTML += `
                <div class="preview flag">
                    <p>There are no notifications to display.</p>
                </div>
            `;
        } else {

            // For each notification..
            response.notifications.forEach(notification => {
                
                // Create notification div
                const notificationDiv = document.createElement("div");

                // Place notification content in div
                notificationDiv.innerHTML = `
                    <div>
                        <p class="notification-unread-flag"></p>   
                        <p class=""><b>${notification.subject}</b></p>
                        <p class="">${notification.content}</p>
                        <p class="">Sent: ${notification.sent}</p>
                    </div>
                `;                
                // If notification is unread, highlight item in view
                notificationDiv.className = (!notification.is_read) ? "notification unread" : "notification";
                notificationDiv.querySelector(".notification-unread-flag").innerHTML = (notificationDiv.className == "notification unread") ? "UNREAD" : ""; 

                // Display notification
                document.querySelector("#notifications-list").append(notificationDiv);
            })    
            
            // Hide new notifications badge
            if (document.querySelector("#notification-count")) {
                document.querySelector("#notification-count").style.visibility = "hidden";
            }
        }
    })

    // Reset status of all user notifications to read
    fetch("/notifications", {
        method: 'PUT',
        body: JSON.stringify({
            is_read: "True"
        }),
        headers: {'X-CSRFToken': csrftoken},
        mode: 'same-origin'
    })
    .then(response => response.json())
    .then(result => {

        // Print json response
        console.log(result);
    })
} 

function updateProfile() {

    // Make profile view visible, hide other views
    document.querySelector("#update-profile-view").style.display = "block";
    document.querySelector("#opportunities-view").style.display = 'none';
    document.querySelector("#welcome-view").style.display = 'none';
    document.querySelector("#add-mission-view").style.display = 'none';
    document.querySelector("#mission-view").style.display = 'none';
    document.querySelector("#apply-view").style.display = 'none';
    document.querySelector("#posts-view").style.display = 'none';
    document.querySelector("#applications-view").style.display = 'none';
    document.querySelector("#application-view").style.display = 'none';
    document.querySelector("#my-missions-view").style.display = 'none';
    document.querySelector("#notifications-view").style.display = 'none';

    // Fetch user profile data
    fetch("/profile")
    .then(response => response.json())
    .then(response => {
        
        // Print json response
        console.log(response);

        // Display profile as populated, editable form
        document.querySelector("#profile-details").innerHTML = `

            <form id="update-profile-form">
                <h3 class="section-title">Profile</h3>  
                <p>Please check that your profile information is correct. Alternatively please update the relevant fields on this page and click 'Update My Profile' to make any changes.</p>
                <div class="form-group row">
                    <label for="first-name" class="col-sm-2 col-form-label">First Name: </label>
                    <div class="col-sm-10">
                        <input class="form-control" autofocus type="text" id="update-first-name" name="first-name" value="${response.volunteer.first_name}" required>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="last-name" class="col-sm-2 col-form-label">Last Name: </label>
                    <div class="col-sm-10">
                        <input class="form-control" autofocus type="text" id="update-last-name" name="last-name" value="${response.volunteer.last_name}" required>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="email" class="col-sm-2 col-form-label">Email: </label>
                    <div class="col-sm-10">
                        <input class="form-control" type="email" id="update-email" name="email" value="${response.volunteer.email}" required>
                    </div>
                </div>
                <div class="form-group row">
                    <label for"city" class="col-sm-2 col-form-label">City/town of Residence: </label>
                    <div class="col-sm-10">
                        <input class="form-control" autofocus type="text" id="update-city" name="city" value="${response.volunteer.city_of_residence }" required>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="country" class="col-sm-2 col-form-label">Country of Residence: </label>
                    <div class="col-sm-10">
                        <input class="form-control" autofocus type="text" id="update-country" name="country" value="${response.volunteer.country_of_residence}" required>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="nationality" class="col-sm-2 col-form-label">Nationality: </label>
                    <div class="col-sm-10">
                        <input class="form-control" autofocus type="text" id="update-nationality" name="nationality" value="${response.volunteer.nationality}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="my-skills" id="my-skills-label" class="col-sm-2 col-form-label">Skills:</label>
                    <div id="my-skills" class="form-check form-check-inline">
                    </div>
                </div>
                <div class="form-group">
                    <label for="my-languages" id="my-languages-label" class="col-sm-2 col-form-label">Languages:</label>
                    <div id="my-languages" class="form-check form-check-inline">
                    </div>
                </div>
                <div class="form-group">
                    <label for="my-interests" id="my-interests-label" class="col-sm-2 col-form-label">Sports of interest:</label>
                    <div id="my-interests" class="form-check form-check-inline">
                    </div>
                </div>
                <br>
                <button type="submit" id="update-profile-btn" class="btn btn-primary">Update My Profile</button>
            </form>
        `;

        // Add checkboxes for skills. languages, interests
        let volSkills = response.volunteer.skills;
        let volLanguages = response.volunteer.languages;
        let volInterests = response.volunteer.interests;

        for (const skill of SKILLS) {
            if (volSkills.includes(skill)) {
                document.querySelector("#my-skills").innerHTML += `    
                    <label class="form-check-label" for="${skill}">
                        <input class="form-check-input my-skills" type="checkbox" value="${skill}" name="skills" id="${skill}" checked>
                        ${skill}
                    </label>
                `;
            } else {
                document.querySelector("#my-skills").innerHTML += `    
                    <label class="form-check-label" for="${skill}">
                        <input class="form-check-input my-skills" type="checkbox" value="${skill}" name="skills" id="${skill}">
                        ${skill}
                    </label>
                `;
            }
        }
    
        for (const language of LANGUAGES) {
            if (volLanguages.includes(language)) {
                document.querySelector("#my-languages").innerHTML += `
                    <label class="form-check-label" for="${language}">
                        <input class="form-check-input my-languages" type="checkbox" value="${language}" name="languages" id="${language}" checked>
                        ${language}
                    </label>
                `;
            } else {
                document.querySelector("#my-languages").innerHTML += `
                    <label class="form-check-label" for="${language}">
                        <input class="form-check-input my-languages" type="checkbox" value="${language}" name="languages" id="${language}">
                        ${language}
                    </label>
                `;
            }
        }

        for (const interest of INTERESTS) {
            if (volInterests.includes(interest)) {
                document.querySelector("#my-interests").innerHTML += `
                    <label class="form-check-label" for="${interest}">
                        <input class="form-check-input my-interests" type="checkbox" value="${interest}" name="interests" id="${interest}" checked>
                        ${interest}
                    </label>
                `;
            } else {
                document.querySelector("#my-interests").innerHTML += `
                    <label class="form-check-label" for="${interest}">
                        <input class="form-check-input my-interests" type="checkbox" value="${interest}" name="interests" id="${interest}">
                        ${interest}
                    </label>
                `;
            }
        }

        // Save profile information when form submitted
        document.querySelector("#update-profile-form").onsubmit = function () {

            let skills = []
            var checkboxes = document.querySelectorAll(".my-skills:checked");
            for (const checkbox of checkboxes) {
                skills.push(checkbox.value);
            }
            
            let languages = []
            var checkboxes = document.querySelectorAll(".my-languages:checked");
            for (const checkbox of checkboxes) {
                languages.push(checkbox.value);
            }

            let interests = []
            var checkboxes = document.querySelectorAll(".my-interests:checked");
            for (const checkbox of checkboxes) {
                interests.push(checkbox.value);
            }

            fetch("/profile", {
                method: 'PUT',
                body: JSON.stringify({
                    first_name: document.querySelector("#update-first-name").value,
                    last_name: document.querySelector("#update-last-name").value,
                    email: document.querySelector("#update-email").value,
                    city_of_residence: document.querySelector("#update-city").value,
                    country_of_residence: document.querySelector("#update-country").value,
                    nationality: document.querySelector("#update-nationality").value,
                    skills: skills,
                    interests: interests,
                    languages: languages,
                }),
                headers: {'X-CSRFToken': csrftoken},
                mode: 'same-origin'
            }) 
            .then(response => response.json())
            .then(result => {
        
                // Print result
                console.log(result);
            })
            
            // Return home 
            window.scrollTo(0, 0);
            setTimeout(() => {window.location = "/";}, 500);
            return false;
        }       
    })
}

// Provide CSRF protection for AJAX (https://docs.djangoproject.com/en/4.1/howto/csrf/)
function getCookie(name) {                  
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// Countdown timer to Olympics (credit: https://www.educative.io/answers/how-to-create-a-countdown-timer-using-javascript)
var gamesStartDate = new Date('Jul 26, 2024 00:00:00').getTime();
var countdownTimer = setInterval(() => {
    var now = new Date().getTime();
    var remainingTime = gamesStartDate - now;
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    daysLeft = Math.trunc(remainingTime / day);
    hoursLeft = Math.trunc((remainingTime % day) / hour);
    minutesLeft = Math.trunc((remainingTime % hour) / minute);
    secondsLeft = Math.trunc((remainingTime % minute) / second);
    document.querySelector('#days').innerHTML = daysLeft + ' Days';
    document.querySelector('#hours').innerHTML = hoursLeft + ' Hours';
    document.querySelector('#minutes').innerHTML = minutesLeft + ' Minutes';
    document.querySelector('#seconds').innerHTML = secondsLeft + ' Seconds';
}, 1000);
