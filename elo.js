// Licensed under GLWTS

var stateTimer = -1;

$(start);

function start() {
    $('#invalid').hide();
    for (var player = 1; player <= 4; player++) setPlayerTrophies(player, '');
    $('.trophyInput').on('input change', function() {
        var player = this.id[1];
        if (getPlayerTrophies(player) >= 0) {
            $('#p' + player + 'score').show();
        } else {
            $('#p' + player + 'score').hide();
            $('#p' + player + 'scorelabel').html('-');
        }
        saveState();
    });
    $('.scoreInput').on('input change', function() {
        var player = this.id[1];
        if (getPlayerTrophies(player) >= 0) {
            $('#p' + player + 'scorelabel').text(this.value);
        } else {
            $('#p' + player + 'scorelabel').html('-');
        }
        saveState();
    });
    $('.remove').on('click', function() {
        setPlayerTrophies(this.id[1], '');
        saveState();
    });
    $('#reset').on('click', clearForm);
    $('#randomize').on('click', randomInit);
    $(window).on('hashchange', initFromURL);
    initFromURL();
};

function trophyDelta(myTrophies, theirTrophies) {
    var delta = myTrophies - theirTrophies;
    var win = Math.round(32 * (1 - 1 / (1 + Math.pow(10, -delta / 1000))));
    var lose = Math.round(-32 * (1 - 1 / (1 + Math.pow(10, delta / 1000))));
    var tie = win - 16;
    return { win: win, lose: lose, tie: tie, trophiesDelta: Math.abs(delta) };
}

function calculate() {
    $('#invalid').hide();
    for (var player = 1; player <= 4; player++) {
        var playerTrophies = getPlayerTrophies(player);
        var playerScore = getPlayerScore(player);
        var winloss = 0;
        var invalid = false;
        for (var opponent = 1; opponent <= 4; opponent++) {
            if (player == opponent) continue;
            var opponentTrophies = getPlayerTrophies(opponent);
            var targetSpan = $('#p' + player + 'fromp' + opponent);
            if (opponentTrophies == -1 || playerTrophies == -1) {
                targetSpan.html('-');
                continue;
            }
            var opponentScore = getPlayerScore(opponent);
            var result = trophyDelta(playerTrophies, opponentTrophies);
            var delta =
                playerScore > opponentScore ?
                result.win :
                playerScore < opponentScore ?
                result.lose :
                result.tie;
            var valueToShow = delta > 0 ? '+' + delta : delta;
            invalid = invalid || result.trophiesDelta > 400;
            targetSpan.html(valueToShow);
            if (typeof delta == 'number') winloss += delta;
        }
        valueToShow = '-';
        if (playerTrophies != -1)
            valueToShow = winloss > 0 ? '+' + winloss : winloss;
        $('#p' + player + 'winloss').html(valueToShow);
        if (invalid) $('#invalid').show();
    }
}

function getPlayerTrophies(player) {
    var v = $('#p' + player + 'trophies').val();
    if (v == '') return -1;
    return parseInt(v);
}

function getPlayerScore(player) {
    return parseInt($('#p' + player + 'score').val());
}

function setPlayerTrophies(player, trophies) {
    if (isNaN(trophies)) trophies = '';
    if (trophies < 0) trophies = '';
    $('#p' + player + 'trophies').val(trophies);
    if (getPlayerTrophies(player) >= 0) {
        $('#p' + player + 'score').show();
        $('#p' + player + 'remove').show();
    } else {
        setPlayerScore(player, 0);
        $('#p' + player + 'remove').hide();
    }
}

function setPlayerScore(player, score) {
    if (isNaN(score)) score = 0;
    if (getPlayerTrophies(player) >= 0) {
        $('#p' + player + 'score').val(parseInt(score));
        $('#p' + player + 'score').show();
        $('#p' + player + 'scorelabel').html(score);
    } else {
        $('#p' + player + 'score').val(0);
        $('#p' + player + 'score').hide();
        $('#p' + player + 'scorelabel').html('-');
    }
}

function updateUrl() {
    var params = '';
    var sep = '#s=';
    var empty = true;
    for (var player = 1; player <= 4; player++) {
        var trophies = getPlayerTrophies(player);
        if (trophies >= 0) {
            params += sep + trophies + ',' + getPlayerScore(player);
            empty = false;
        } else {
            params += sep + ',';
        }
        sep = ',';
    }
    document.location.href =
        document.location.pathname + (empty ? '' : params.replace(/,+$/, ''));
}

function saveState() {
    if (stateTimer > 0) clearTimeout(stateTimer);
    stateTimer = setTimeout(updateUrl, 40);
}

function clearForm() {
    for (var player = 1; player <= 4; player++) setPlayerTrophies(player, '');
    saveState();
}

function showScenario(t1, s1, t2, s2, t3, s3, t4, s4) {
    setPlayerTrophies(1, t1);
    setPlayerTrophies(2, t2);
    setPlayerTrophies(3, t3);
    setPlayerTrophies(4, t4);
    setPlayerScore(1, s1);
    setPlayerScore(2, s2);
    setPlayerScore(3, s3);
    setPlayerScore(4, s4);
    saveState();
}

function randomInit() {
    var players = Math.floor(Math.random() * 3) + 2;
    var min = Math.floor(Math.random() * 3200);
    var t1 = Math.floor(Math.random() * 400) + min;
    var t2 = Math.floor(Math.random() * 400) + min;
    var t3 = t4 = s1 = s2 = s3 = s4 = '';
    if (players == 2) {
        s1 = 3;
        s2 = Math.floor(Math.random() * 4);
    } else if (players == 3) {
        t3 = Math.floor(Math.random() * 400) + min;
        s1 = 6 + Math.floor(Math.random() * 2);
        do {
            s2 = Math.floor(Math.random() * 8);
            s3 = Math.floor(Math.random() * 8);
        } while (s1 < s2 || s2 < s3);
    } else if (players == 4) {
        t3 = Math.floor(Math.random() * 400) + min;
        t4 = Math.floor(Math.random() * 400) + min;
        s1 = 9 + Math.floor(Math.random() * 3);
        do {
            s2 = Math.floor(Math.random() * 12);
            s3 = Math.floor(Math.random() * 12);
            s4 = Math.floor(Math.random() * 12);
        } while (s1 < s2 || s2 < s3 || s3 < s4);
    }
    showScenario(t1, s1, t2, s2, t3, s3, t4, s4);
    calculate();
}

function initFromURL() {
    var query = '';
    if (window.location.hash) query = window.location.hash.replace('#', '?');
    if (window.location.search) query = window.location.search;
    if (query != '') {
        var urlParams = new URLSearchParams(query);
        if (urlParams.has('s')) {
            params = urlParams.get('s').split(',');
            var t1 = params[0];
            var s1 = params[1];
            var t2 = params[2];
            var s2 = params[3];
            var t3 = params[4];
            var s3 = params[5];
            var t4 = params[6];
            var s4 = params[7];
            showScenario(t1, s1, t2, s2, t3, s3, t4, s4);
        }
    }
    calculate();
}