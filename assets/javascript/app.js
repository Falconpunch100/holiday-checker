var APIkey = "5c77f0c1-1a87-4fe6-8ffb-872bfa649208"
var testURL = "https://holidayapi.com/v1/holidays?pretty&key=5c77f0c1-1a87-4fe6-8ffb-872bfa649208&country=US&year=2019"
var WikiLink = "https://en.wikipedia.org/w/api.php?action=query&prop=info&inprop=url&format=json&origin=*&pageids="
var WikiSearch = "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch="
var WikiImage = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages%7Cpageterms&generator=prefixsearch&redirects=1&formatversion=2&piprop=thumbnail&pithumbsize=250&pilimit=20&wbptterms=description&gpslimit=20&gpssearch="
var placeholder = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Article_icon_cropped.svg/512px-Article_icon_cropped.svg.png"

async function testAPI() {
    try {
        var date = getCurrentDate()
        var response = await fetch(testURL + "&month=" + date.month + "&day=" + date.day);
        var data = await response.json()
        if (data.holidays.length !== 0) {
            wikipediaPageSearch(data)

        }
        else {
            displayHoliday(data)
        }
    } catch (error) {
        throw error
    }
}

async function datePicker(month, day) {
    try {
        var response = await fetch(testURL + "&month=" + month + "&day=" + day);
        var data = await response.json()
        if (data.holidays.length !== 0) {
            wikipediaPageSearch(data)

        }
        else {
            displayHoliday(data)
        }
    } catch (error) {
        throw error
    }
}

async function wikipediaPageSearch(data) {
    try {
        var response = await fetch(WikiSearch + data.holidays[0].name)
        var parsed = await response.json()
        var pageid = parsed.query.search[0].pageid
        var snippet = parsed.query.search[0].snippet
        var url = await wikipediaLinkSearch(pageid)
        var imageURL = await wikipediaImageSearch(data.holidays[0].name)
        displayHoliday(data, snippet, url, imageURL)
    } catch (error) {
        throw error
    }
}

async function wikipediaLinkSearch(pageid) {
    try {
        var response = await fetch(WikiLink + pageid)
        var parsed = await response.json()
        var url = parsed.query.pages[pageid].canonicalurl
        return url
    } catch (error) {
        throw error
    }
}

async function wikipediaImageSearch(holidayname) {
    try {
        var response = await fetch(WikiImage + holidayname)
        var parsed = await response.json()
        if (parsed.query !== undefined && parsed.query.pages[0].thumbnail !== undefined) {
            var imageURL = parsed.query.pages[0].thumbnail.source
            return imageURL
        }
        else {
            return ""
        }
    } catch (error) {
        throw error
    }
}

function getCurrentDate() {
    var today = new Date();
    var date = {
        month: today.getMonth() + 1,
        day: today.getDay() + 2
    }
    return date
}

function displayHoliday(data, snippet, url, imageURL) {
    var checkholiday = document.getElementById("currentHoliday")
    var today = new Date();

    if (data.holidays.length !== 0 && imageURL !== "") {
        var card = `<div class="card" style="width: 18rem;">
        <img src="${imageURL}" class="card-img-top" alt="${data.holidays[0].name}">
        <div class="card-body">
          <h5 class="card-title">Today is: ${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${data.holidays[0].name}</h6>
          <p class="card-text">${snippet}...</p>
          <a href="${url}" target=_blank class="card-link">Wikipedia Article</a>
        </div>
      </div>`
        checkholiday.innerHTML = card
    }
    else if (data.holidays.length !== 0 && imageURL === "") {
        var card = `<div class="card" style="width: 18rem;">
        <img src="${placeholder}" class="card-img-top" alt="${data.holidays[0].name}">
        <div class="card-body">
          <h5 class="card-title">Today is: ${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${data.holidays[0].name}</h6>
          <p class="card-text">${snippet}...</p>
          <a href="${url}" target=_blank class="card-link">Wikipedia Article</a>
        </div>
      </div>`
        checkholiday.innerHTML = card
        imageURL = placeholder;
    }
    else {
        var card = `<div class="card" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">Today is: ${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}</h5>
          <h6 class="card-subtitle mb-2 text-muted">No Holiday</h6>
          <p class="card-text">There are currently no holidays in the United States on this day.</p>
        </div>
      </div>`
        checkholiday.innerHTML = card
    }
}

testAPI()

var calendar = document.getElementById("calendar")
var cooldown;
var timer = 1500;
calendar.addEventListener("change", function (event) {
    clearTimeout(cooldown)
    var dateString = event.target.value
    var date = new Date(dateString);
    var month = date.getMonth() + 1
    var day = date.getDate() + 1
    cooldown = setTimeout(function() {
        datePicker(month, day)
    },
    timer);
});