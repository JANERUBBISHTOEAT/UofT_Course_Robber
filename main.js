// ==UserScript==
// @name         UofT_Course_Robber
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://acorn.utoronto.ca/sws/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=utoronto.ca
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function load_courses(courses) {
        console.log("Loading courses");
        for (var i = 0; i < courses.length; i++) {
            console.log("Loading course " + i.toString());

            // find 'Enrol' button
            var course = courses[i].querySelector('[class="updateEnrolment btn btn-sm btn-primary active"]');
            var code = courses[i].querySelector('[class="enrolment-code"]');
            console.log(code.innerText);
            course.click();
        }
    }

    async function confirm_click(course_num) {
        var popups = document.getElementsByClassName("modal-container");

        if (popups.length != course_num) {
            console.log("Error: number of popups does not match number of courses");
            console.log("Number of popups: " + popups.length.toString());
            console.log("Number of courses: " + course_num.toString());
        }

        for (var i = 0; i < popups.length; i++) {
            // find Title
            var title = popups[i].querySelector("#modalHeading");
            console.log(title.innerHTML);

            // find 'Confirm' button
            var confirm = popups[i].querySelector("#enrolFromPlan");
            confirm.click();
            console.log("clicked confirm");

            // find 'Close' button
            var close = popups[i].querySelector('[class="close icon-cancel"]');
            close.click();
            console.log("clicked close");
        }
    }

    async function confirm_exists(course_num) {
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutations) => {
                const popups = document.getElementsByClassName("modal-container");
                if (popups.length === course_num) {
                    console.log("confirm button found");
                    observer.disconnect();
                    resolve();
                } else {
                    console.log("waiting for confirm button");
                }
            });

            observer.observe(document, { childList: true, subtree: true });
        });
    }

    async function rob_courses(courses) {
        // first load all the courses
        load_courses(courses);

        // wait for the page to load
        await confirm_exists(courses.length);

        // then click all the 'Confirm' buttons
        await confirm_click(courses.length);
    }



    // Add the button to the page, at the left of the button with title="Get email help and access support resources"
    var observer = new MutationObserver(function (mutations) {
        var element = document.getElementsByClassName("flex-item user-controls");
        var courses = document.getElementsByClassName("planningBox currentlyEnrolledBox courseSearchBox");

        // Element exists, add the button
        if (element.length > 0 && courses.length > 0) {
            observer.disconnect();

            // Search "Your enrolment cart is empty" on the page
            var no_results = document.body.innerHTML.search("Your enrolment cart is empty");
            // If the string exists, then prompt the user to add courses
            if (no_results != -1) {
                alert("Your enrolment cart is empty");
                return;
            }

            // Print the courses found
            var num_courses = courses.length;
            for (var i = 0; i < num_courses; i++) {
                // Print in plain text
                // Remove whitespace and newlines
                console.log(courses[i].querySelector("h4").innerText.replace(/\s/g, ' '));
            }
            console.log(num_courses + " courses found");

            // Create a button with class "acorn-btn" 
            var load_btn = document.createElement("div");
            load_btn.className = "acorn-btn";
            load_btn.innerText = "Load Courses";
            var parent = element[0].children[0];
            var child = parent.children[0];
            parent.insertBefore(load_btn, child);

            // Add event listener to the button
            load_btn.addEventListener("click", function () {
                load_courses(courses);
            });

            // Create a button with class "acorn-btn" 
            var rob_btn = document.createElement("div");
            rob_btn.className = "acorn-btn";
            rob_btn.innerHTML = "Rob " + num_courses.toString() + " Courses";
            parent.insertBefore(rob_btn, child);

            // Add event listener to the button
            rob_btn.addEventListener("click", function () {
                rob_courses(courses);
            });

        }
    });

    // Observe the page for changes
    observer.observe(document, { childList: true, subtree: true });

})();

