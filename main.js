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

    window.onload = function () {
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

        var num_courses = courses.length;
        console.log(num_courses);

        // Create a button with class "acorn-btn" 
        var btn = document.createElement("div");
        btn.className = "acorn-btn";
        btn.innerHTML = "Rob " + num_courses.toString() + " Courses";

        // Add the button to the page, at the left of the button with title="Get email help and access support resources"
        var parent = document.getElementsByClassName("flex-item user-controls")[0].children[0];
        console.log(parent);
        var child = parent.children[0];
        console.log(child);
        parent.insertBefore(btn, child);
    }

})();