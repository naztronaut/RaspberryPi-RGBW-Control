let config = {
    url: 'http://192.168.1.225',
};

let whiteStatus = 0;
let currentColors = {};
let rgbBrightnessChange = false;

$(document).ready(function() {
    // Cache buster added because caching was a big problem on mobile
    let cacheBuster = new Date().getTime();

    // btnStatus();
    getLEDStatus('rgb');
    getLEDStatus('white');

    const pickr = Pickr.create({
        el: '.color-picker',
        theme: 'classic', // or 'monolith', or 'nano'
        lockOpacity: true,
        padding: 15,
        inline: true,

        swatches: [
            'rgba(255, 0, 0, 1)',
            'rgba(255, 82, 0, 1)',
            'rgba(0, 255, 0, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(27, 161, 17, 1)',
            'rgba(255, 255, 0, 1)', // yellow broken
            'rgba(255, 0, 255, 1)',
            'rgba(108, 16, 157, 1)',
            'rgba(0, 255, 255, 1)',
            'rgba(24, 139, 167, 1)',
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

    pickr.off().on('swatchselect', e => {
        // sendData(e); // Swatchselect apparently triggers save so it triggers sendData() automatically
        pickr.setColor(e.toRGBA().toString(0));


    });
    pickr.on('save', e => {

        // If 'save' is being triggered by brightness changes instead
        if(rgbBrightnessChange == false) {
            let tempColors = pickr.getColor().toRGBA();
            currentColors.red = Math.floor(tempColors[0]);
            currentColors.green = Math.floor(tempColors[1]);
            currentColors.blue = Math.floor(tempColors[2]);
        } else {
            rgbBrightnessChange = false;
        }
        sendData(e);
    });

    $(".rgbBrightness").on('click', function (e) {
       console.log($(this).val());
       let newRed = Math.floor(currentColors.red * ($(this).val()));
       let newGreen = Math.floor(currentColors.green * ($(this).val()));
       let newBlue = Math.floor(currentColors.blue * ($(this).val()));
       rgbBrightnessChange = true;
       console.log(newRed, newGreen, newBlue);
       pickr.setColor(`rgb(${newRed}, ${newGreen}, ${newBlue})`);
       console.log(pickr.getColor().toRGBA().toString());
       console.log(currentColors);
    });

    function sendData(e){
        let obj = e.toRGBA();
        let red = Math.floor(obj[0]);
        let green = Math.floor(obj[1]);
        let blue = Math.floor(obj[2]);
        let queryBuilder = `red=${red}&green=${green}&blue=${blue}`;

        $.ajax({
            url: `${config.url}/api/lr/?${queryBuilder}&${cacheBuster}`,
            method: 'GET',
            dataType: 'json',
            cache: false,
            success: function (result) {
                console.log(result);
                console.log(currentColors);
            }
        });
    }

     $('#btnToggle').on('click', function(e){
        if(whiteStatus == 0) {
            whiteStatus = Math.floor(255);
        } else {
            whiteStatus = 0;
        }

        changeWhiteLed(whiteStatus);
        e.preventDefault();
    });

    $('.whiteBrightness').on('click', function(e){
        let freq = 0;
        switch ($(this).val()) {
            case '25':
                freq = 64;
                break;
            case '50':
                freq = 128;
                break;
            case '75':
                freq = 192;
                break;
            case '100':
                freq = 255;
                break;
            default:
                freq = 0;
                break;
        }
        changeWhiteLed(freq);
        e.preventDefault();
    });

    function changeWhiteLed(frequency){
        $.ajax({
            url: `${config.url}/api/lr/white?white=${frequency}&${cacheBuster}`,
            method: 'GET',
            success: function(result) {
                console.log(result);
            },
            complete: btnStatus
        });
    }

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

    // Get RGB Status so Color Picker in UI is set to that color on page load
    function getLEDStatus(color) {
        $.ajax({
            url: `${config.url}/api/lr/getStatus?colors=${color}&${cacheBuster}`,
            method: 'GET',
            success: function(result) {
                if(color == 'rgb') {
                    let colors = `rgb(${result.red}, ${result.green}, ${result.blue})`;
                    currentColors.red = result.red;
                    currentColors.green = result.green;
                    currentColors.blue = result.blue;
                    pickr.setColor(colors);
                    console.log(currentColors);
                } else {
                    whiteStatus = result.white;
                    btnStatus();
                }
            },
        });
    }

});