AOS.init({
  duration: 1200,
})

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

$(function() {
	const editButton = $("#editButton")
	const religionId = editButton.data("religion-id")
	const API_URL = "http://localhost:8080"

	//add event click listener to edit button
	editButton.on("click", function(event) {
		event.preventDefault();
		// //then redirect to religion listing page
		window.location.href = "../religion/" + religionId + "/edit"
	})
})