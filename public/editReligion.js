$(function() {
	const $editReligionForm = $("#editReligionForm")
	const $name = $("#name");
	// const API_URL = "http://localhost:8080";
	const $id = $("#editReligionForm");
	const religionId = $id.data("religion-id");
	console.log(religionId)
	const $historicalRoots = $("#historicalRoots");
	const $basicBeliefs = $("#basicBeliefs");
	const $practices = $("#practices");
	const $organization = $("#organization");
	const $books = 	$("#books");

	$editReligionForm.on("submit", function(event) {
		event.preventDefault();
		const religion = { 
			name: $name.val(),
			id: religionId,
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
		method: "PUT",
		contentType: "application/json",
		url: "/religion/" + religionId, 
		data: JSON.stringify(religion)
		})
		.then(res => {
			window.location.href= "/religion/" + religionId
		})
	}) 
}) 