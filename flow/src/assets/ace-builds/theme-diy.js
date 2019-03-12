ace.define("ace/theme/diy",["require","exports","module","ace/lib/dom"],function(e,t,n){t.isDark=!0,t.cssClass="ace-diy",t.cssText=".ace-diy .ace_gutter {\
    background: #202020;\
    color: #8F908A\
    }\
    .ace-diy .ace_print-margin {\
    width: 1px;\
    background: #555651\
    }\
    .ace-diy {\
    background-color: #1e1e1e;\
    color: #F8F8F2\
    }\
    .ace_print-margin-layer {\
    display:none\
    }\
    .ace-diy .ace_cursor {\
    color: #F8F8F0\
    }\
    .ace-diy .ace_marker-layer .ace_selection {\
    background: #49483E\
    }\
    .ace-diy.ace_multiselect .ace_selection.ace_start {\
    box-shadow: 0 0 3px 0px #272822;\
    }\
    .ace-diy .ace_marker-layer .ace_step {\
    background: rgb(102, 82, 0)\
    }\
    .ace-diy .ace_marker-layer .ace_bracket {\
    margin: -1px 0 0 -1px;\
    border: 1px solid #49483E\
    }\
    .ace-diy .ace_marker-layer .ace_active-line {\
    background: #202020\
    }\
    .ace-diy .ace_gutter-active-line {\
    background-color: #272727\
    }\
    .ace-diy .ace_marker-layer .ace_selected-word {\
    border: 1px solid #49483E\
    }\
    .ace-diy .ace_invisible {\
    color: #52524d\
    }\
    .ace-diy .ace_entity.ace_name.ace_tag,\
    .ace-diy .ace_keyword,\
    .ace-diy .ace_meta.ace_tag,\
    .ace-diy .ace_storage {\
    color: #F92672\
    }\
    .ace-diy .ace_punctuation,\
    .ace-diy .ace_punctuation.ace_tag {\
    color: #fff\
    }\
    .ace-diy .ace_constant.ace_character,\
    .ace-diy .ace_constant.ace_language,\
    .ace-diy .ace_constant.ace_numeric,\
    .ace-diy .ace_constant.ace_other {\
    color: #AE81FF\
    }\
    .ace-diy .ace_invalid {\
    color: #F8F8F0;\
    background-color: #F92672\
    }\
    .ace-diy .ace_invalid.ace_deprecated {\
    color: #F8F8F0;\
    background-color: #AE81FF\
    }\
    .ace-diy .ace_support.ace_constant,\
    .ace-diy .ace_support.ace_function {\
    color: #66D9EF\
    }\
    .ace-diy .ace_fold {\
    background-color: #A6E22E;\
    border-color: #F8F8F2\
    }\
    .ace-diy .ace_storage.ace_type,\
    .ace-diy .ace_support.ace_class,\
    .ace-diy .ace_support.ace_type {\
    font-style: italic;\
    color: #66D9EF\
    }\
    .ace-diy .ace_entity.ace_name.ace_function,\
    .ace-diy .ace_entity.ace_other,\
    .ace-diy .ace_entity.ace_other.ace_attribute-name,\
    .ace-diy .ace_variable {\
    color: #A6E22E\
    }\
    .ace-diy .ace_variable.ace_parameter {\
    font-style: italic;\
    color: #FD971F\
    }\
    .ace-diy .ace_string {\
    color: #E6DB74\
    }\
    .ace-diy .ace_comment {\
    color: #75715E\
    }\
    .ace-diy .ace_indent-guide {\
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y\
    }";var r=e("../lib/dom");r.importCssString(t.cssText,t.cssClass)});
                (function() {
                    ace.require(["ace/theme/diy"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            