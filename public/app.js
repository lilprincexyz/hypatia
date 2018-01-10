// this is mock data, but when we create our API
// we'll have it return data that looks like this
var MOCK_RELIGIONS = {
	"religions": [
        {
            "id": "1111111",
            "name": "Buddhism",
            "historicalRoots": "Roots B",
            "basicBeliefs": "Eight-Fold Path",
            "practices": "meditation on citta",
            "organization": "Dhamma",
            "books": "The Dhammapada",
            "created": 1470016976609
        },
        {
            "id": "2222222",
            "name": "Christianity",
            "historicalRoots": "Root C",
            "basicBeliefs": "Christ as Messiah",
            "practices": "prayer to Christ",
            "organization": "Church",
            "books": "The Holy Bible",
            "created": 1470012976609
        },
        {
            "id": "333333",
            "name": "Islam",
            "historicalRoots": "Root I",
            "basicBeliefs": "Muhammad as Allah's prophet",
            "practices": "prayer to Allah",
            "organization": "Mosque",
            "books": "The Quran",
            "created": 1470011976609
        },
        {
            "id": "4444444",
            "name": "Judaism",
            "historicalRoots": "Root J",
            "basicBeliefs": "The Shema Yisrael",
            "practices": "prayer to Adonai",
            "organization": "Synagogue",
            "books": "The Torah",
            "created": 1470009976609
        }
    ]
};

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getReligions(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
	setTimeout(function(){ callbackFn(MOCK_RELIGIONS)}, 1);
}

// this function stays the same when we connect
// to real API later
function displayReligions(data) {
    data.religions.forEach(function(religion)
     {
	   $('body').append(
        '<p>' + religion.name + '</p>');
    })
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayReligions() {
	getReligions(displayReligions);
}

//  on page load do this
$(function() {
	getAndDisplayReligions();
})