// Licensed under GLWTS

var orderByName = true;
var courses = [];
var coursesByName = [];
var coursesByTour = [];
var host = 'https://gb.oracolo.com/';

$(start);

function start() {
    $('#byTour').on('click', function() {
        courses = coursesByTour;
        renderPage();
    });
    $('#byName').on('click', function() {
        courses = coursesByName;
        renderPage();
    });
    downloadAndRender();
}

function downloadAndRender() {
    const src = host + 'icons.json?_=' + Date.now() + Math.random();
    const prx = 'https://json2jsonp.com/?url=' + encodeURIComponent(src) + '&callback=?';
    $.getJSON(prx, (data) => {
        data["Dunes Flaggy"] = {
            "icon": 'Dunes.png',
            "tour": 17,
            "forced-powerup": "-1",
        };
        data["The Shack Reversed"] = {
            "icon": 'The Shack.png',
            "tour": 31,
            "forced-powerup": "-1",
        };
        data["Test Lab Sticky"] = {
            "icon": 'Test Lab.png',
            "tour": 36,
            "forced-powerup": "-1",
        };
        data["Blades Twisted"] = {
            "icon": 'Blades.png',
            "tour": 40,
            "forced-powerup": "-1",
        };
        data["Pleasant Land Lasers"] = {
            "icon": 'Pleasant Land.png',
            "tour": 44,
            "forced-powerup": "-1",
        };
        data["Sewer Land Reversed"] = {
            "icon": 'Sewer Land.png',
            "tour": 48,
            "forced-powerup": "-1",
        };
        extractCourses(data);
        renderPage();
    });
}

function extractCourses(data) {
    coursesByName = [];
    coursesByTour = [];
    Object.keys(data).map((key) => {
        course = {};
        course.Name = key;
        course.Image = host + data[key].icon;
        course.Tour = data[key].tour;
        coursesByName.push(course);
        coursesByTour.push(course);
    });
    coursesByName.sort((a, b) => (a.Name > b.Name) ? 1 : -1);
    coursesByTour.sort((a, b) => (a.Tour > b.Tour) ? 1 : -1);
    courses = coursesByTour;
}

function renderPage() {
    $('#loading').show();
    $('#courses').hide();
    $('#courses').html('');
    $('#courseCount').html('(' + courses.length + ')');

    for (const course of courses) {
        var courseElement = $("<div class='course'>" +
            "<div class='courseIcon'><a href='course.html?c=" + course.Name + "'>" +
            "<img src='" + course.Image + "' class='courseImg' />" +
            "<img src='CourseBackground.png' class='courseBg' />" +
            "<img src='CourseBanner.png' class='courseBanner' />" +
            "<div class='courseTour'> TOUR " + course.Tour + '</div>' +
            "</div>" +
            "<div class='courseName'>" + course.Name + '</div>' +
            '</a>' +
            '</div>');
        $('#courses').append(courseElement);
    }
    $('#loading').hide();
    $('#courses').show();
    $('#buttons').show();
}