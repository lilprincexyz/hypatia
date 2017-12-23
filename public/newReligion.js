// alert("Hello World!");
const $newReligionForm = $("#newReligionForm");
const $name = $("#name");
const $historicalRoots = $("#historicalRoots");
const $basicBeliefs = $("#basicBeliefs");
const $practices = $("#practices");
const $organization = $("#organization");
const $books = 	$("#books");
	
$newReligionForm.on("submit", function(event) {
	event.preventDefault();
	const religion = { 
		name: $name.val(),
		historicalRoots: $historicalRoots.val(),
		basicBeliefs: $basicBeliefs.val(),
		practices: $practices.val(),
		organization: $organization.val(),
		books: [$books.val()]
	};
	$.post({url: "../religion/", data: religion, dataType: "json"});

}) 