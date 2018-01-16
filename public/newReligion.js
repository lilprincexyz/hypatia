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

    const error = "Field is required."

    if (! religion.name) {
	    	$name.siblings(".error").text(error);
    }

    if (! religion.historicalRoots) {
    	$historicalRoots.siblings(".error").text(error);
    }

        if (! religion.basicBeliefs) {
    	$basicBeliefs.siblings(".error").text(error);
    }

        if (! religion.practices) {
    	$practices.siblings(".error").text(error);
    }

        if (! religion.organization) {
    	$organization.siblings(".error").text(error);
    }    

	$.ajax({
		method: "POST",
		contentType: "application/json",
		url: "../religion/", 
		data: JSON.stringify(religion)
	})
	.then(res => {
		window.location.href= "../religion/"
	})
}) 