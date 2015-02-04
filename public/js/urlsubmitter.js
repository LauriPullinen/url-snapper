$(document).ready(function() {
	// Instead of submitting the form really, get the id with AJAX, then 
	// display it to the user nicely.
	$("form").submit(function(event) {
		var formData = $(this).serialize();
		$.ajax({
			url: "/",
			method: "POST",
			data: formData,
			success: function(data) {
				var container = $("#short-url-container");
				var urlInput = container.find("input");
				// Set input value to the new shortened URL
				urlInput.val(window.location.protocol + 
					"//" + window.location.host + "/" + data);
				// Show the container (widths don't work for display:none)
				container.show();
				// Set the input width to the correct value
				var available = container.find("#speech-bubble").width();
				var text = container.find("#text-container").width();
				urlInput.outerWidth(available - text);
				// Select the input for easy copying
				urlInput.select();
			},
			error: function() {
			}
		});
		event.preventDefault();
	});
});