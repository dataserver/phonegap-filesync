((() => { // avoid conflicts
    const DEFAULT_CONFIG = {
        url : ''
    };

    // https://stackoverflow.com/questions/7298364/using-jquery-and-json-to-populate-forms
    function populateForm($form, data) {
        $.each(data, (key, value) => {// all json fields ordered by name
            let $ctrls, $ctrl;

            if (value instanceof Array){
                $ctrls = $form.find("[name='" + key + "[]']"); //all form elements for a name. Multiple checkboxes can have the same name, but different values
            } else {
                $ctrls = $form.find("[name='" + key + "']");
            }
            if ($ctrls.is("select")) { //special form types
                $("option", $ctrls).each(function() {
                    if (this.value == value) {
                        this.selected = true;
                    }
                });
            } else if ($ctrls.is("textarea")) {
                $ctrls.val(value);
            } else {
                switch ($ctrls.attr("type")) { //input type
                    case "text":
                    case "range":
                    case "hidden":
                        $ctrls.val(value);
                        break;
                    case "radio":
                        if ($ctrls.length >= 1) {
                            $.each($ctrls, function(index) { // every individual element
                                let elemValue = $(this).attr("value");
                                let singleVal = value;
                                let elemValueInData = singleVal;

                                if (elemValue == value) {
                                    $(this).prop("checked", true);
                                } else {
                                    $(this).prop("checked", false);
                                }
                            });
                        }
                        break;
                    case "checkbox":
                        if ($ctrls.length > 1) {
                            $.each($ctrls, function(index) { // every individual element
                                let elemValue = $(this).attr("value");
                                let elemValueInData;
                                let singleVal;

                                for (let i=0; i<value.length; i++) {
                                    singleVal = value[i];
                                    debug("singleVal", singleVal, "/value[i][1]", value[i][1]);
                                    if (singleVal == elemValue) {
                                        elemValueInData = singleVal;
                                    }
                                }
                                if (elemValueInData) {
                                    $(this).prop("checked", true);
                                } else {
                                    $(this).prop("checked", false);
                                }
                            });
                        } else if ($ctrls.length == 1) {
                            $ctrl = $ctrls;
                            if (value) {
                                $ctrl.prop("checked", true);
                            } else {
                                $ctrl.prop("checked", false);
                            }
                        }
                        break;
                }
            }
        });
    }

    function nl2br (str) {
        str = (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
        str = str.replace(/  /g, '&nbsp; ');
        return str;
    }

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
                $("#error").html(textStatus);
                $("#texto").html(textSaved);
            });
        }
    }

    $(document).ready(function() {
        let connectionStatus = "offline";
        let textSaved = get_syncfile();
        let configs = get_config();

        connectionStatus = navigator.onLine ? "online" : "offline";

        if (connectionStatus == "offline") {
            $("#texto").html(textSaved);
        } else {
           updateText();
        }

        $(document).on("pagecontainershow", function () {
            var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");

            var activePageId = activePage[0].id;
            switch (activePageId) {
                case 'page-config':
                    populateForm($("#form-configs"), configs);
                    break;
                case 'page-main':
                    break;
                case 'page-x':
                    break;
                default:
            }
        });

        $("#js-sync-get").click(function(){
            event.preventDefault();
            if (configs.url=="") {
                $("#on-off-status").html("URL to file not defined");
                $("#texto").html("Configure the URL to sync");
            } else {
                updateText();
            }
        });
        $("#js-configs-save").click(function(){
            event.preventDefault();
            let formData = $("#form-configs").serializeJSON();

            configs = set_config(formData);

            $(':mobile-pagecontainer').pagecontainer('change', '#page-main', {
                transition: 'flip',
                changeHash: false,
                reverse: true,
                showLoadMsg: true
            });
            updateText();
        });
    });


}))();