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

    async function confirm_click() {
        // return;
        for (var i = 0; i < 100; i++) {
            await new Promise(r => setTimeout(r, 2000));

            // click this confirm button
            var confirm = document.querySelector("#enrolFromPlan");
            // console.log(confirm);
            if (!confirm) {
                console.log("no more confirm button, exiting");
                return;
            }
            console.log("confirm button found, clicking");
            confirm.click();

            // close the popup
            var close = document.getElementsByClassName("close icon-cancel");
            // console.log(close[0]);
            console.log("close button found, clicking");
            close[0].click();
        }
    }

    async function confirm_exists() {
        for (var i = 0; i < 1000; i++) {
            await new Promise(r => setTimeout(r, 1));

            var confirm = document.querySelector("#enrolFromPlan");
            if (confirm) {
                console.log("confirm button found");
                return;
            }
            console.log("waiting for confirm button");
        }
    }

    async function rob_courses(courses) {

        // first click all the 'Enrol' buttons
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
            // console.log(course);
            course.click();
        }

        // wait for the page to load
        await confirm_exists();

        // then click all the 'Confirm' buttons
        confirm_click();
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