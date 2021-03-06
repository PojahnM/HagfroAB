var Hagfro = null;

$(function(){
    Hagfro = {};

    Hagfro.construct = function(params) {
        var body = $('body');
        var page = Hagfro.getPage();
        var pageContent = body.html();

        body.html(se.hagfro.renderSite({
            title: params.title,
            renderTrademark: params.renderTrademark,
            renderWelcomeImage: params.renderWelcomeImage,
            pages: [
                {
                    'title': 'Hem',
                    'url': 'index.html',
                    'selected': page === 'index.html' || page.length === 0
                },
                {
                    'title': 'HagFro',
                    'url': 'hagfro.html',
                    'selected': page === 'hagfro.html'
                },
                {
                    'title': 'Familjehem',
                    'url': 'familjehem.html',
                    'selected': page === 'familjehem.html'
                },
                {
                    'title': 'Intresseanmälan',
                    'url': 'intresseanmalan.html',
                    'selected': page === 'intresseanmalan.html'
                },
                {
                    'title': 'Verksamhet',
                    'url': 'verksamhet.html',
                    'selected': page === 'verksamhet.html'
                },
                {
                    'title': 'Kontakt',
                    'url': 'kontakt.html',
                    'selected': page === 'kontakt.html'
                }
            ]
        }).content);

        $('.page-content').append(pageContent);

        $('.footer-text').on('click', function(){
            Hagfro.dialog('Site created by Pojahn Moradi, HagFro AB collaborator.', "OK");
        });

        if(params.renderWelcomeImage) {
            Hagfro.initSlideshow();
        }
    };

    Hagfro.initSlideshow = function() {
        var img1 = $('.kid1');
        var img2 = $('.kid2');
        var func = function(){};
        var fadeTime = 5000;

        setInterval(function(){
            img1.fadeOut(fadeTime);
            img2.fadeIn(fadeTime);
        }, fadeTime * 2);

        setInterval(function(){
            img2.fadeOut(fadeTime);
            img1.fadeIn(fadeTime);
        }, fadeTime);
    };

    Hagfro.getPage = function() {
        var url = window.location.href.split('?')[0];
        return url.substring(url.lastIndexOf('/') + 1);
    };

    Hagfro.constructMap = function(id) {
        var position = new google.maps.LatLng(59.42132,	17.84826);
        var map = new google.maps.Map(document.getElementById(id), {
            center: position,
            zoom: 15
        });

        var marker=new google.maps.Marker({
          position:position,
        });
        marker.setMap(map);
    };

    Hagfro.dialog = function(text, buttonText) {
        $('body').prepend(se.hagfro.renderDialog({
            text: text,
            buttonText: buttonText
        }).content);

        $('html').prepend(se.hagfro.overlay({}).content);

        $('.dialog-button').click(function(){
            $('.dialog').remove();
            $('.overlay').remove();
        });
    };

    Hagfro.emailField = function() {
       var container = $('.email-section');
       var sendButton = container.find('.send-button');

       container.find('.send-button').click(function(e){
            e.preventDefault();

            var obj = {};
            var skip = false;

            $('.sendable').each(function(){
                var ref = $(this);

                if(!ref.val().length) {
                    Hagfro.dialog('Ett eller fler av dom obligatoriska fälten är tomma. Vänligen försök igen.', "OK");
                    skip = true;
                    return false;
                }

                if((ref.prop('type') === 'radio' && ref.is(':checked')) || ref.prop('type') !== 'radio') {
                    obj[ref.prop('name')] = ref.prop('value');
                }
            });

            if(skip) {
                return;
            }

            sendButton.prop('disabled', true);
            sendButton.val('Skickar...');
            console.log("Sending data:");
            console.log(obj);

            $.ajax({
                url: "https://formspree.io/info@hagfro.se",
                method: "POST",
                data: obj,
                dataType: "json",
                success: function(data) {
                    if(data.success) {
                        container.find('.resetable').val('');
                        Hagfro.dialog('Tack!', "OK");
                    } else {
                        Hagfro.dialog('Något gick fel. Vänligen försök igen.', "OK");
                    }
                },
                complete: function() {
                    sendButton.prop('disabled', false);
                    sendButton.val('Skicka');
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    Hagfro.dialog('Något gick fel. Vänligen försök igen.', "OK");
                }
            });
       });
    };
});
