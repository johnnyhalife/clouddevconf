(function($){
	$("#send").bind('click', function(e) {

		var msg = { content: $("input[type='text']").val() };
		
		$.post('/messages', msg).success(function(){
			console.log("Just enqueued: %s", JSON.stringify(msg));
		});
		
		e.preventDefault();
	});
})(jQuery);