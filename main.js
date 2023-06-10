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

    async function confirm_click(course_num) {
        var popups = document.getElementsByClassName("modal-container");
        // var popups = document.getElementsByClassName("modal-content");

        if (popups.length != course_num) {
            console.log("Error: number of popups does not match number of courses");
            console.log("Number of popups: " + popups.length.toString());
            console.log("Number of courses: " + course_num.toString());
        }

        var popups = document.getElementsByClassName("modal-container"); // duplicate for debugging

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
        for (var i = 0; i < 1000; i++) {
            await new Promise(r => setTimeout(r, 1));

            var popups = document.getElementsByClassName("modal-container");
            if (popups.length == course_num) {
                console.log("confirm button found");
                return;
            }
            console.log("waiting for confirm button");
        }
    }

    async function rob_courses(courses) {
        // await new Promise(r => setTimeout(r, 1));

        var courses = document.getElementsByClassName("planningBox currentlyEnrolledBox courseSearchBox"); // duplicate for debugging

        // first click all the 'Enrol' buttons
        for (var i = 0; i < courses.length; i++) {
            console.log("Robbing course " + i.toString());
            var cnt_enrol = 0; // timeout counter

            // find 'Enrol' button
            var course = courses[i].querySelector('[class="updateEnrolment btn btn-sm btn-primary active"]');
            var code = courses[i].querySelector('[class="enrolment-code"]');
            console.log(code.innerHTML);
            // console.log(course);
            course.click();
        }

        // wait for the page to load
        await confirm_exists(courses.length);

        // then click all the 'Confirm' buttons
        await confirm_click(courses.length);
    }

    // Search "Your enrolment cart is empty" on the page
    var no_results = document.body.innerHTML.search("Your enrolment cart is empty");
    // If the string exists, then prompt the user to add courses
    if (no_results != -1) {
        alert("Your enrolment cart is empty");
        return;
    }

    // Class "planningBox currentlyEnrolledBox courseSearchBox" is the course in the table
    var courses = document.getElementsByClassName("planningBox currentlyEnrolledBox courseSearchBox");
    console.log(courses);
    // for (var i = 0; i < 2; i++) {
    //     // Get the course code
    //     console.log(courses[i]);
    // }

    var num_courses = courses.length;
    console.log(num_courses + " courses found");

    // Create a button with class "acorn-btn" 
    var btn = document.createElement("div");
    btn.className = "acorn-btn";
    btn.innerHTML = "Rob " + num_courses.toString() + " Courses";

    // Add the button to the page, at the left of the button with title="Get email help and access support resources"
    var parent = document.getElementsByClassName("flex-item user-controls")[0].children[0];
    var child = parent.children[0];
    parent.insertBefore(btn, child);

    // Add event listener to the button
    btn.addEventListener("click", function () {
        rob_courses(courses);
    });

})();