    const DEFAULT_CONFIG = {
        url : ''
    };
    // CONFIG
    function get_config() {
        // let raw = localStorage.getItem('configs');
        // let cfg = JSON.parse(raw);
        let cfg = storage.get('configs');

        return Object.assign({}, DEFAULT_CONFIG, cfg);
    }
    function set_config(cfg) {

        //localStorage.setItem("configs", JSON.stringify(cfg));
        storage.set('configs', cfg);
        return cfg;
    }
    // Synced file
    function get_syncfile() {
        //let raw = localStorage.getItem('texto');
        //return JSON.parse(raw);
        return storage.get('texto');
    }
    function set_syncfile(content="") {

        //localStorage.setItem("texto", JSON.stringify(content));
        storage.set('texto', content);

        return content;
    }

    function updateText() {
        let configs = get_config();
        let textSaved = get_syncfile();

        if (configs.url=="") {
            $("#on-off-status").html("URL to file not defined");
            $("#texto").html("Configure the URL to sync");
        } else {
            $.ajax({
                url : configs.url,
                cache: false,
            }).done(function(result){
                let newText = nl2br(result);

                $("#on-off-status").html("online");
                $("#texto").html(newText);
                set_syncfile(newText);
            }).fail(function(jqXHR, textStatus) {
                $("#on-off-status").html("online but failed to retrieve data");
                //$("#error").html(textStatus);
                $("#texto").html(textSaved);
            });
        }
    }


var App = {

    exit_dlg: false,
    sidebar: "#sidebar",

    init: function(){
        this.bindEvents();
    },
    
    bindEvents: function(){
        var body = $('body');

        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('offline', this.onOffline, false);
        document.addEventListener('online', this.onOnline, false);
        // document.addEventListener('pause', this.onPause, false);
        // document.addEventListener('resume', this.onResume, false);
        // document.addEventListener('volumeup', this.onVolumeUp, false);
        // document.addEventListener('volumedown', this.onVolumeDown, false);
        document.addEventListener('backbutton', this.onBackButton, true);
        // document.addEventListener('menubutton', this.onMenuButton, true);
        // document.addEventListener('searchbutton', this.onSearchButton, true);

        // body.swipe({
        //     allowPageScroll:"vertical",
        //     swipe: function(event, direction, distance, duration, fingerCount, fingerData){
        //         var sidebar = $(App.sidebar).data('sidebar');

        //         if (direction === 'right' && fingerData[0].start.x < 24) {
        //             //if (!sidebar.isOpened()) {
        //                 sidebar.open();
        //                 //event.preventDefault();
        //                 //event.stopPropagation();
        //             //}
        //         //} else if (sidebar.isOpened() && direction === 'left') {
        //         } else if (direction === 'left') {
        //             sidebar.close();
        //             //event.preventDefault();
        //             //event.stopPropagation();
        //         } else {
        //             // Swipe on screen

        //         }
        //     }
        // });

    },
    
    onDeviceReady: function(){

        let connectionStatus = "offline";
        let textSaved = get_syncfile();
        let configs = get_config();

        connectionStatus = navigator.onLine ? "online" : "offline";

        if (connectionStatus == "offline") {
            $("#texto").html(textSaved);
        } else {
           updateText();
        }

        $(".js-go-page").click(function(){
            event.preventDefault();
            let page = $(this).attr('data-page');
            
            switch (page) {
                case 'page-config':
                    populateForm($("#form-configs"), configs);
                    $("[data-role='page']").hide();
                    $("#page-config").show();
                    break;
                case 'page-main':
                    $("[data-role='page']").hide();
                    $("#page-main").show();
                    break;
                case 'page-x':
                    break;
                default:
            }
        });

        $(".js-sync-get").click(function(){
            event.preventDefault();

            $("[data-role='page']").hide();
            $("#page-main").show();
            if (configs.url == "") {
                $("#on-off-status").html("URL to file not defined");
                $("#texto").html("Configure the URL to sync");
            } else {
                updateText();
            }
        });
        $(".js-configs-save").click(function(){
            event.preventDefault();
            let formData = $("#form-configs").serializeJSON();
            configs = set_config(formData);
            updateText();

            $("[data-role='page']").hide();
            $("#page-main").show();
        });
        $("#page-main").show();

    },

    onOffline: function(){
        $("#on-off-status").html("Offline");
    },
    onOnline: function(){
      $("#on-off-status").html("Online");  
    },
    onPause: function(){},
    onResume: function(){},
    onVolumeUp: function(){},
    onVolumeDown: function(){},
    onMenuButton: function(){},
    onSearchButton: function(){},
    onBackButton: function(){
        if (App.exit_dlg === true) {
            App.exit();
        }
        App.exit_dlg = true;
        Metro.toast.create("Press the BACK button again to exit from Application", function(){
            App.exit_dlg = false;
        });
    },
    exit: function(){
        navigator.app.exitApp();
    }
};
