$(function() {
	const deleteButton = $("#deleteButton")
	const religionId = deleteButton.data("religion-id")
	const API_URL = "http://localhost:8080"

	//add event click listener to delete button
	deleteButton.on("click", function(event) {
		event.preventDefault();
	//in callback function, make jQuery ajax call with delete method
	$.ajax({
			method: "DELETE",
			contentType: "application/json",
			url: API_URL + "/religion/" + religionId,
	}) 
	//then redirect to religion listing page
	.then(res => {
			window.location.href= "../religion/"
		})
	})
})