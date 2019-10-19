let config = {
    multi: true,
    kitchenRight: 'http://192.168.1.169',
    kitchenLeft: 'http://192.168.1.167' // Optional - only required if `multi` is true
};

let globalStatus = 0;

$(document).ready(function() {
    // Cache buster added because caching was a big problem on mobile
    let cacheBuster = new Date().getTime();
    if(config.multi) {
        $("#multi").show();
    }
    $.ajax({
        url: config.kitchenRight + '/kitchenLights/led/status.txt?' + cacheBuster, //kitchen right
        method: 'GET',
        dataType: 'text',
        cache: false,
        success: function (result) {
            globalStatus = result;
            btnStatus();
            if(config.multi) {
                singleButton('Right', result);
            }
        }
    });

    if(config.multi) {
        $.ajax({
            url: config.kitchenLeft + '/kitchenLights/led/status.txt?' + cacheBuster, //kitchen right
            method: 'GET',
            dataType: 'text',
            cache: false,
            success: function (result) {
                singleButton('Left', result);
            }
        });
    }
    
    $('#btnToggle').on('click', function(e){
        let state;
        if(globalStatus == 0) {
            state = 'on';
            globalStatus = 1;
        } else {
            state = 'off';
            globalStatus = 0;
        }

        //right
        $.ajax({
            url: config.kitchenRight + '/api/kitchen?status=' + state,
            method: 'GET',
            success: function(result) {
                if(config.multi) {
                    singleButton('Right', globalStatus);
                }
            },
            complete: btnStatus
        });

        if(config.multi) {
            //left
            $.ajax({
                url: config.kitchenLeft + '/api/kitchen?status=' + state, //kitchen right
                method: 'GET',
                dataType: 'text',
                success: function (result) {
                    singleButton('Left', globalStatus);
                }
            });
        }
        e.preventDefault();
    });

    // Main big button - uses kitchenRight for master data.
    function btnStatus() {
        if(globalStatus == 0) {
            $('#btnToggle').text('Turn On');
            $('#btnToggle').removeClass().addClass('btn btn-block btn-dark');
            if(config.multi) {
                singleButton('Left', 0);
                singleButton('Right', 0);
            }
        } else {
            $('#btnToggle').text('Turn Off')
            $('#btnToggle').removeClass().addClass('btn btn-block btn-light');
            if(config.multi) {
                singleButton('Left', 1);
                singleButton('Right', 1);
            }
        }
    }

    if(config.multi) {
        $('.single').on('click', function (e) {
            let side;
            let url;
            if($(e.target).data('side') == 'Left') {
                side = 'Left';
                url = config.kitchenLeft;
            } else {
                side = 'Right';
                url = config.kitchenRight;
            }
            $.ajax({
                url: url + '/api/kitchen/toggle?' + cacheBuster, //kitchen right
                method: 'GET',
                dataType: 'json',
                cache: false,
                success: function (result) {
                    singleButton(side, result.status);
                }
            });
            e.preventDefault();
        });

        function singleButton(side, state) {
            if (state == "0") {
                $('#kitchen' + side).text(side + ' On');
                $('#kitchen' + side).removeClass().addClass('btn btn-block btn-dark');
            } else {
                $('#kitchen' + side).text(side + ' Off');
                $('#kitchen' + side).removeClass().addClass('btn btn-block btn-light');
            }
        }
    }
});