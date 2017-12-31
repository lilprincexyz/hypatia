$(function() {
	const $editReligionForm = $("#editReligionForm")
	const $name = $("#name");
	const API_URL = "http://localhost:8080";
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