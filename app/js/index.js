$(document).ready(function()
{ 
      
	src = 'ajax_autocomplete.php?';

    // Load the cities straight from the server, passing the country as an extra param
    $("#autocomplete").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: src,
                dataType: "json",
                data: {
                    term : request.term,
                    source_language : $(".source").val()
                },
                success: function(data) {
                    response(data);
                }
            });
        },
        min_length: 4,
        delay: 300,
		html: true,
		
		// optional (if other layers overlap autocomplete list)
        open: function(event, ui) {
            $(".ui-autocomplete").css("z-index", 1000);
        }
		
		
		
    });	
	
	
	$('#filter_submit').click(function()
	{
   		//console.log(mode);return false;
        $(".source_language_text").attr("disabled", "disabled");
		var source = $('.source').val();
		if(source == ''){
		alert("Plz Select Source Language");
		return false;
		}
		
		var target = $('.target').val();
		if(target == ''){
		alert("Plz Select Target Language");
		return false;
		}
		
    	var source_language_text = $('.source_language_text').val();
        if(source_language_text == ''){
		alert("Plz Enter Source Language Text");
		return false;
		}
		
        $.isLoading({ text: "please wait while processing request" });
		$.get('helper.php?mode='+mode+'&task=speech_conversion&source='+source+'&target='+target+'&text='+source_language_text, function(data) {
				
		$.isLoading( "hide" );
        var sound = $('<embed autoplay="true" height="0" width="0" />');
		if(mode == 'open_source'){
		var sound_file = "sound.wav";
		}
		else if(mode == 'google'){
		var sound_file = "sound.mp3";
		}
		sound.attr('src', sound_file);
		$('body').append(sound);
       $("#filter_reset").trigger("click");	
       $("div.history").load("history.txt");
       $(".source_language_text").removeAttr("disabled");
		});
		
		
		//$(".sub-form").submit();
		
	});
	
	$('#filter_reset').click(function()
	{
	  $(".source_language_text").val('');
	});
	
	
	$(document).keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13') {
        //alert('You pressed a "enter" key in somewhere');  
        $("#filter_submit").trigger("click");
		event.preventDefault();
        return false;  		
    }
   });		
	
     // default load
	 $("div.history").load("history.txt");
 
});