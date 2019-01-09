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