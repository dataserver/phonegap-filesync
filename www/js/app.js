const DEFAULT_CONFIG = {
    url: '',
    file_is_markdown: 'github',
};
// CONFIG
function get_config() {
    let cfg = storage.get('configs');

    return Object.assign({}, DEFAULT_CONFIG, cfg);
}

function set_config(cfg) {

    storage.set('configs', cfg);
    toastr.success("Saved");
    return cfg;
}
// Synced file
function get_syncfile() {

    return storage.get('texto');
}

function set_syncfile(content = "") {

    storage.set('texto', content);

    return content;
}

function icon_is_online(is_online = true) {
    if (is_online) {
        return `<i class="fas fa-globe-americas" style="color:green;"></i>`;
    } else {
        return `<span class="fa-stack"><i class="fas fa-globe-americas"></i><i class="fas fa-ban fa-stack-2x"></i></span>`;
    }
}

function updateText() {
    let configs = get_config();
    let textSaved = get_syncfile();

    if (configs.url == "") {
        toastr.error("Missing configuration");
        $("#file-content").html("Configure the URL to sync");
    } else {
        $.ajax({
            url: configs.url,
            cache: false,
        }).done(function (result) {
            let newText;
            if (configs.file_is_markdown != "") {
                var converter = new showdown.Converter();
                converter.setFlavor(configs.file_is_markdown);
                newText = converter.makeHtml(result);
            } else {
                newText = nl2br(result);
            }
            $("#file-content").html(newText);
            set_syncfile(newText);
            toastr.success("Sync done");
        }).fail(function (jqXHR, textStatus) {
            toastr.error("Failed to sync");
            $("#file-content").html(textSaved);
        });
    }
}

var App = {

    exit_dlg: false,
    sidebar: "#sidebar",
    init: function () {
        this.bindEvents();

        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-center",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    },

    bindEvents: function () {
        var body = $('body');

        document.addEventListener('deviceready', this.onDeviceReady, false);
        // document.addEventListener('offline', this.onOffline, false);
        // document.addEventListener('online', this.onOnline, false);
        // document.addEventListener('pause', this.onPause, false);
        // document.addEventListener('resume', this.onResume, false);
        // document.addEventListener('volumeup', this.onVolumeUp, false);
        // document.addEventListener('volumedown', this.onVolumeDown, false);
        // document.addEventListener('backbutton', this.onBackButton, true);
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

    onDeviceReady: function () {
        let connectionStatus = "offline";
        let textSaved = get_syncfile();
        let configs = get_config();

        connectionStatus = navigator.onLine ? "online" : "offline";
        if (connectionStatus == "offline") {
            $("#service-status").html(icon_is_online(false) + " offline");
            $("#file-content").html(textSaved);
        } else {
            $("#service-status").html(icon_is_online() + " online");
            updateText();
        }

        $(".js-go-page").click(function (event) {
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
        $(".js-sync-get").click(function (event) {
            event.preventDefault();

            $("[data-role='page']").hide();
            $("#page-main").show();
            if (configs.url == "") {
                toastr.error("URL to file not defined");
                $("#file-content").html("Configure the URL to sync");
            } else {
                updateText();
            }
        });
        $(".js-configs-save").click(function (event) {
            event.preventDefault();
            let formData = $("#form-configs").serializeJSON();

            configs = set_config(formData);
            updateText();
            $("[data-role='page']").hide();
            $("#page-main").show();
        });
        $("#page-main").show();
    },
    onOffline: function () {
        $("#service-status").html("Offline");
    },
    onOnline: function () {
        $("#service-status").html("Online");
    },
    onPause: function () {},
    onResume: function () {},
    onVolumeUp: function () {},
    onVolumeDown: function () {},
    onMenuButton: function () {},
    onSearchButton: function () {},
    onBackButton: function () {
        if (App.exit_dlg === true) {
            App.exit();
        }
        App.exit_dlg = true;
    },
    exit: function () {
        navigator.app.exitApp();
    }
};