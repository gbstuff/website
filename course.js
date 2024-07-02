// Licensed under GLWTS

var host = 'https://gb.oracolo.com/';
var courses = {};
var info = {};
var stateTimer = -1;

$(start);

function start() {
    $('#course').hide();
    loadCourses();
    loadInfo();
    stateTimer = setInterval(showCourse, 200);
}

function loadCourses() {
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
        courses = data;
    });
}

function loadInfo() {
    const src = host + 'courses.json?_=' + Date.now() + Math.random();
    const prx = 'https://json2jsonp.com/?url=' + encodeURIComponent(src) + '&callback=?';
    $.getJSON(prx, (data) => { info = data; });
}

function getNameFromURL() {
    var query = '';
    if (window.location.hash) query = window.location.hash.replace('#', '?');
    if (window.location.search) query = window.location.search;
    if (query != '') {
        var urlParams = new URLSearchParams(query);
        if (urlParams.has('c')) return urlParams.get('c');
    }
    return '';
}

function showCourse() {
    const coursesReady = Object.keys(courses).length > 0;
    const infoReady = Object.keys(info).length > 0;
    if (!coursesReady || !infoReady) return;
    if (stateTimer > 0) {
        clearInterval(stateTimer);
        stateTimer = -1;
    }

    const courseName = getNameFromURL();
    if (!(courseName in courses && courseName in info)) {
        document.location.href = '404.html';
    }

    const icon = courses[courseName].icon;
    const tour = courses[courseName].tour;
    const fourcedPowerup = courses[courseName]["forced-powerup"];

    const name = info[courseName].name;
    const stratsUrl = info[courseName].stratsUrl;
    const imagesUrl = info[courseName].imagesUrl;
    const discussionsUrl = info[courseName].discussionsUrl;
    const designers = info[courseName].designers;
    const debutSeason = info[courseName].debutSeason;
    const debutDate = info[courseName].debutDate;
    const triviaNotes = info[courseName].triviaNotes;

    $('#name').html(name);
    $('#icon').html('<img src="' + host + icon + '" class="icon" />');
    $('#tour').html('TOUR ' + tour);

    if (stratsUrl != '')
        $('#stratsUrl').html('<span class="stratsUrl">&bull; <a href="' + stratsUrl + '">Strategies [Discord]</a></span>');
    else
        $('#stratsUrl').hide();

    if (imagesUrl != '')
        $('#imagesUrl').html('<span class="imagesUrl">&bull; <a href="' + imagesUrl + '">Screenshots [Discord]</a></span>');
    else
        $('#imagesUrl').hide();

    if (discussionsUrl != '')
        $('#discussionsUrl').html('<span class="discussionsUrl">&bull; <a href="' + discussionsUrl + '">Discussions [Discord]</a></span>');
    else
        $('#discussionsUrl').hide();

    if (triviaNotes != '')
        $('#triviaNotes').html('<span class="triviaNotes">' + triviaNotes + '</span>');
    else
        $('#triviaNotes').hide();

    $('#fourcedPowerup').hide();
    $('#designers').hide();
    $('#debutSeason').hide();
    $('#debutDate').hide();

    $('#loading').hide();
    $('#course').show();
}