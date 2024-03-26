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

    function load_course_popup(courses) {
        console.log("Loading courses");
        for (let course of courses) {
            // find 'Enrol' button
            var enrol_btn = course.querySelector('[class="updateEnrolment btn btn-sm btn-primary active"]');
            var code = course.querySelector('[class="enrolment-code"]');
            console.log("Loading course " + code.innerText);
            enrol_btn.click();
        }
    }

    function click_enrol(course_num) {
        var popups = document.getElementsByClassName("modal-container");

        if (popups.length != course_num) {
            console.log("Error: number of popups does not match number of courses");
            console.log("Number of popups: " + popups.length.toString());
            console.log("Number of courses: " + course_num.toString());
        }

        for (let popup of popups) {
            // find Title
            var title = popup.querySelector("#modalHeading");
            console.log(title.innerText.replace("Opening dialog.", "Just enrolled"));

            // find 'Confirm' button
            var confirm = popup.querySelector("#enrolFromPlan");
            confirm.click();
            console.log("clicked confirm");

        }
    }

    function click_close(course_num) {
        var popups = document.getElementsByClassName("modal-container");

        if (popups.length != course_num) {
            console.log("Error: number of popups does not match number of courses");
            console.log("Number of popups: " + popups.length.toString());
            console.log("Number of courses: " + course_num.toString());
        }

        for (let popup of popups) {
            // find Title
            var title = popup.querySelector("#modalHeading");
            console.log(title.innerText.replace("Opening dialog.", "Just closed"));

            // find 'Close' button
            var close = popup.querySelector('[class="close icon-cancel"]');
            close.click();
            console.log("clicked close");
        }
    }

    async function wait_enrol_btn(course_num) {
        console.log("waiting for " + course_num.toString() + " confirm buttons");
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

    // Add the button to the page, at the left of the button with title="Get email help and access support resources"
    var observer = new MutationObserver(function (mutations) {
        var element = document.getElementsByClassName("flex-item user-controls");
        var courses = document.getElementsByClassName("planningBox currentlyEnrolledBox courseSearchBox");

        // Element exists, add the button
        if (element.length > 0 && courses.length > 0) {
            observer.disconnect();

            // Search "Your enrolment cart is empty" on the page
            var no_results = document.body.innerText.search("Your enrolment cart is empty");
            // If the string exists, then prompt the user to add courses
            if (no_results != -1) {
                alert("Your enrolment cart is empty");
                return;
            }

            // Print the courses found
            var num_courses = courses.length;
            for (var i = 0; i < num_courses; i++) {
                // Print in plain text
                console.log(courses[i].querySelector("h4").innerText);
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
            load_btn.addEventListener("click", async function () {
                load_course_popup(courses);
                await wait_enrol_btn(num_courses);
                click_close(num_courses);
            });

            // Create a button with class "acorn-btn" 
            var rob_btn = document.createElement("div");
            rob_btn.className = "acorn-btn";
            rob_btn.innerText = "Rob " + num_courses.toString() + " Courses";
            parent.insertBefore(rob_btn, child);

            // Add event listener to the button
            rob_btn.addEventListener("click", async function () {
                load_course_popup(courses);
                await wait_enrol_btn(courses.length);
                click_enrol(courses.length);
                click_close(courses.length);
            });

        }
    });

    // Observe the page for changes
    observer.observe(document, { childList: true, subtree: true });

})();

