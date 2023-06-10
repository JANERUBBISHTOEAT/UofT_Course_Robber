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

    function rob_courses(courses) {
        for (var i = 0; i < courses.length; i++) {
            console.log("Robbing course " + i.toString());
            var cnt_enrol = 0; // timeout counter

            // find 'Enrol' button
            var course = courses[i].querySelector("div.header-info-vertical > div > div.controls-container > div:nth-child(1) > a");
            while (!course) {
                console.log("waiting for enrol button");
                course = courses[i].querySelector("div.header-info-vertical > div > div.controls-container > div:nth-child(1) > a");
                if (cnt_enrol++ > 10000) {
                    console.log("timeout");
                    return;
                }
            }
            // click the button
            console.log("enrol button found, clicking");
            console.log(course);
            course.click();

            // sleep asynchronically
            setTimeout(function () {
                // until find 'Confirm' button
                var cnt_confirm = 0;
                var confirm = document.querySelector("#enrolFromPlan");
                while (!confirm) {
                    confirm = document.querySelector("#enrolFromPlan");
                    console.log("waiting for confirm button");
                    console.log(confirm);
                    if (cnt_confirm++ > 10000) {
                        console.log("timeout");
                        return;
                    }
                }
                // click the button
                console.log("confirm button found, clicking");
                console.log(confirm);
                confirm.click();
            }, 100);
        }
    }

    // window.onload = function () {

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

    // }

})();