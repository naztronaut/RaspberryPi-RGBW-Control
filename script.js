let config = {
    url: 'http://192.168.1.225',
};

let whiteStatus = 0;

$(document).ready(function() {
    // Cache buster added because caching was a big problem on mobile
    let cacheBuster = new Date().getTime();

    btnStatus();
    getRGBStatus();

    const pickr = Pickr.create({
        el: '.color-picker',
        theme: 'classic', // or 'monolith', or 'nano'
        lockOpacity: true,
        padding: 15,
        inline: true,

        swatches: [
            'rgba(255, 0, 0, 1)',
            'rgba(0, 255, 0, 1)',
            'rgba(0, 0, 255, 1)',
            // 'rgba(255, 250.0, 0, 1)', // yellow broken
            'rgba(255, 0, 255, 1)',
            'rgba(0, 255, 255, 1)',
            'rgba(255, 255, 255, 1)',
            'rgba(0, 0, 0, 1)',
        ],

        components: {

            // Main components
            preview: true,
            opacity: false,
            hue: true,

            // Input / output Options
            interaction: {
                hex: true,
                rgba: true,
                // hsla: true,
                // hsva: true,
                // cmyk: true,
                input: true,
                // clear: true,
                save: true
            }
        }
    });

    pickr.on('swatchselect', e => {
        sendData(e);
    });
    pickr.on('save', e => {
        sendData(e);
    });

    function sendData(e){
        let obj = e.toRGBA();
        let red = Math.floor(obj[0]);
        let green = Math.floor(obj[1]);
        let blue = Math.floor(obj[2]);
        let queryBuilder = `red=${red}&green=${green}&blue=${blue}`;
        console.log(queryBuilder);

        $.ajax({
            url: `${config.url}/api/lr/?${queryBuilder}&${cacheBuster}`,
            method: 'GET',
            dataType: 'json',
            cache: false,
            success: function (result) {
                console.log(result);
            }
        });
    }

     $('#btnToggle').on('click', function(e){

        // let state;
        if(whiteStatus == 0) {
            whiteStatus = Math.floor(255);
        } else {
            whiteStatus = 0;
        }

        //right
        $.ajax({
            url: `${config.url}/api/lr/white?white=${whiteStatus}&${cacheBuster}`,
            method: 'GET',
            success: function(result) {
                console.log(result);
            },
            complete: btnStatus
        });
        e.preventDefault();
    });

    // Main big button - uses kitchenRight for master data.
    function btnStatus() {
        if(whiteStatus == 0) {
            $('#btnToggle').text('Turn On');
            $('#btnToggle').removeClass().addClass('btn btn-block btn-dark');
        } else {
            $('#btnToggle').text('Turn Off')
            $('#btnToggle').removeClass().addClass('btn btn-block btn-light');
        }
    }

    function getRGBStatus() {
        $.ajax({
            url: `${config.url}/api/getRGB?${cacheBuster}`,
            method: 'GET',
            success: function(result) {
                console.log(result);
                let colors = {
                    red: result.red,
                    green: result.green,
                    blue: result.blue
                };
                pickr.setColor(colors);
            },
        });
    }

});