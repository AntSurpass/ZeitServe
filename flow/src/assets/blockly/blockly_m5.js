Blockly.Component = [];
Blockly.Declare = [];
Blockly.modules = [];
Blockly.ButtonEvents = [];
Blockly.Remotes = [];
Blockly.Units = [];
Blockly.ResImages = [];
Blockly.REMOTE_KEY = '';

Blockly.Msg.MATH_HUE = '#30A9DE';
Blockly.Msg.TEXTS_HUE = '#F17F42';
Blockly.Msg.LOOPS_HUE = '#58C9B9';
Blockly.Msg.LOGIC_HUE = '#22559C';
Blockly.Msg.VARIABLES_HUE = '#791E94';
Blockly.Msg.LISTS_HUE = '#2EC4B6';
Blockly.Msg.LCD_HUE = '#FFBC42';
Blockly.Msg.BUTTON_HUE = '#D81159';
Blockly.Msg.SPEAKER_HUE = '#4F86C6';
Blockly.Msg.TIMER_HUE = '#EE2560';
Blockly.Msg.SDCARD_HUE = '#75D701';
Blockly.Msg.GPIO_HUE = '#EF5285';
Blockly.Msg.PWM_HUE = '#F100E5';
Blockly.Msg.ADC_HUE = '#5C196B';
Blockly.Msg.DAC_HUE = '#0080FF';
Blockly.Msg.UART_HUE = '#3AC569';
Blockly.Msg.FUNCTION_HUE = '#995BA5';
Blockly.Msg.COMPONENT_HUE = '#75D701';
Blockly.Msg.COMPONENT_LABEL_HUE = '#EC6A5C';
Blockly.Msg.COMPONENT_TITLE_HUE = '#EE7785';
Blockly.Msg.COMPONENT_RECT_HUE = '#D1B6E1';
Blockly.Msg.COMPONENT_CIRCLE_HUE = '#4FB0C6';
Blockly.Msg.COMPONENT_IMAGE_HUE = '#AAABD3';
Blockly.Msg.M5STAND_HUE = '#8CD790';
Blockly.Msg.MOTOR_HUE = '#75D701';
Blockly.Msg.SERVO_HUE = '#005874';
Blockly.Msg.NXT_MOTOR_HUE = '#80D4F6';
Blockly.Msg.RGB_HUE = '#68bcfe';
Blockly.Msg.DHT_HUE = '#fe4365';
Blockly.Msg.PINS_HUE = '#3ac569';
Blockly.Msg.ADVANCED_HUE = '#ff5f2e';
Blockly.Msg.BASIC_HUE = '#fdc23e';
Blockly.Msg.REMOTE_HUE = '#00b9f1';
Blockly.Msg.EMOJI_HUE = '#EE7785';

Blockly.Generator.prototype.workspaceToCode = function (workspace) {
    if (!workspace) {
        // Backwards compatibility from before there could be multiple workspaces.
        console.warn('No workspace specified in workspaceToCode call.  Guessing.');
        workspace = Blockly.getMainWorkspace();
    }
    var code = [];
    this.init(workspace);
    var blocks = workspace.getTopBlocks();
    for (var x = 0, block; block = blocks[x]; x++) {
        var line = this.blockToCode(block);
        if (goog.isArray(line)) {
            // Value blocks return tuples of code and operator order.
            // Top-level blocks don't care about operator order.
            line = line[0];
        }
        if (line) {
            if (block.outputConnection) {
                // This block is a naked value.  Ask the language's code generator if
                // it wants to append a semicolon, or something.
                line = this.scrubNakedValue(line);
            }
            code.push(line);
        }
    }
    code = code.join('\n');  // Blank line between each section.
    code = this.finish(code);
    // Final scrubbing of whitespace.
    code = code.replace(/^\s+\n/, '');
    code = code.replace(/\n\s+$/, '\n');
    code = code.replace(/[ \t]+\n/g, '\n');
    return code;
};

Blockly.addModule = function (module_name) {
    if (Blockly.modules.indexOf(module_name) === -1) Blockly.modules.push(module_name);
    else return;
}

Blockly.addDeclare = function (varname) {
    if (Blockly.Declare.indexOf(varname) === -1) {
        Blockly.Declare.push(varname);
    }
}

Blockly.addButtonEvent = function (eventObj) {
    if (Blockly.ButtonEvents.length === 0) return Blockly.ButtonEvents.push(eventObj);
    var isExist = false;
    for (var i = 0; i < Blockly.ButtonEvents.length; i++) {
        if (Blockly.ButtonEvents[i].event === eventObj.event) {
            isExist = true;
            break;
        }
        if(Blockly.ButtonEvents[i].id === eventObj.id) {
            isExist = true;
            Blockly.ButtonEvents[i].event = eventObj.event;
            break;
        }
    }
    if (!isExist) Blockly.ButtonEvents.push(eventObj);
}

Blockly.addRemote = function (eventObj) {
    if (Blockly.Remotes.length === 0) return Blockly.Remotes.push(eventObj);
    for (var i = 0; i < Blockly.Remotes.length; i++) {
        if (Blockly.Remotes[i].id === eventObj.id) {
            Blockly.Remotes.splice(i, 1);
            break;
        }
    }
    Blockly.Remotes.push(eventObj);
}

Blockly.defineGlobal = function () {
    var defineList = [];

    // Define Component
    var componentList = [];
    for (var i = 0; i < Blockly.Component.length; i++) {
        if(Blockly.Component[i].name === 'button0' || Blockly.Component[i].name === 'button1' || Blockly.Component[i].name === 'button2') continue;
        componentList.push(Blockly.Component[i].name);
    }

    var varialbes = [];
    var blocks = this.getMainWorkspace().getAllBlocks();
    for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].type === "variables_get" || blocks[i].type === "variables_set") {
            var varname = this.getMainWorkspace().getVariableById(blocks[i].getVars()).name;
            if (varialbes.indexOf(varname) > -1) continue;
            varialbes.push(varname);
        }
        // if(blocks[i].type === "emoji_show" || blocks[i].type === "emoji_set_single") {
        //     if (varialbes.indexOf('emoji') > -1) continue;
        //     varialbes.push('emoji');
        // }
    }

    var modules = [];
    for(var i = 0; i < Blockly.modules.length; i++) {
        modules.push(Blockly.modules[i]);
    }

    return defineList.concat(componentList, varialbes, modules);
}

/**
 * Default Event
 */
Blockly.Blocks['function_in_event'] = {
    init: function () {
        this.setDeletable(false);
        this.setColour(Blockly.Msg.BUTTON_HUE);
        this.appendDummyInput()
            .appendField('setup');
        this.appendStatementInput('EVENT');
    }
}
Blockly.Python['function_in_event'] = function (block) {
    var event = Blockly.Python.statementToCode(block, 'EVENT', Blockly.Python.ORDER_FUNCTION_CALL) || '';
    return ['def setup():\n' + event + '  pass', Blockly.Python.ORDER_MEMBER];
}

Blockly.Blocks['function_out_event'] = {
    init: function () {
        this.setDeletable(false);
        this.setColour(Blockly.Msg.BUTTON_HUE);
        this.appendDummyInput()
            .appendField('Out_event');
        this.appendStatementInput('EVENT');
    }
}
Blockly.Python['function_out_event'] = function (block) {
    var event = Blockly.Python.statementToCode(block, 'EVENT', Blockly.Python.ORDER_FUNCTION_CALL) || '';
    return ['def out_event():\n' + event + '  pass', Blockly.Python.ORDER_MEMBER];
}

Blockly.Blocks['function_main_event'] = {
    init: function () {
        this.setDeletable(false);
        this.setColour(Blockly.Msg.BUTTON_HUE);
        this.appendDummyInput()
            .appendField('Loop');
        this.appendStatementInput('EVENT');
    }
}
Blockly.Python['function_main_event'] = function (block) {
    var event = Blockly.Python.statementToCode(block, 'EVENT', Blockly.Python.ORDER_FUNCTION_CALL) || '';
    return ['def loop():\n' + event + '\n  pass', Blockly.Python.ORDER_MEMBER];
}

/**
 * Button
 */
Blockly.Blocks['buttonA_pressed_handler'] = {
    init: function () {
        this.setDeletable(false);
        this.setColour(Blockly.Msg.BUTTON_HUE);
        this.appendDummyInput()
            .appendField('ButtonA_Pressed');
        this.appendStatementInput('EVENT');
    }
}
Blockly.Python['buttonA_pressed_handler'] = function (block) {
    var event = Blockly.Python.statementToCode(block, 'EVENT', Blockly.Python.ORDER_FUNCTION_CALL) || '';
    return ['def buttonA_pressed():\n' + event + '  pass', Blockly.Python.ORDER_MEMBER];
}

Blockly.Blocks['buttonB_pressed_handler'] = {
    init: function () {
        this.setDeletable(false);
        this.setColour(Blockly.Msg.BUTTON_HUE);
        this.appendDummyInput()
            .appendField('ButtonB_Pressed');
        this.appendStatementInput('EVENT');
    }
}
Blockly.Python['buttonB_pressed_handler'] = function (block) {
    var event = Blockly.Python.statementToCode(block, 'EVENT', Blockly.Python.ORDER_FUNCTION_CALL) || '';
    return ['def buttonB_pressed():\n' + event + '  pass', Blockly.Python.ORDER_MEMBER];
}

Blockly.Blocks['buttonC_pressed_handler'] = {
    init: function () {
        this.setDeletable(false);
        this.setColour(Blockly.Msg.BUTTON_HUE);
        this.appendDummyInput()
            .appendField('ButtonC_Pressed');
        this.appendStatementInput('EVENT');
    }
}
Blockly.Python['buttonC_pressed_handler'] = function (block) {
    var event = Blockly.Python.statementToCode(block, 'EVENT', Blockly.Python.ORDER_FUNCTION_CALL) || '';
    return ['def buttonC_pressed():\n' + event + '  pass', Blockly.Python.ORDER_MEMBER];
}

Blockly.Blocks['pins_analog_read'] = {
    init: function () {
        this.setColour(Blockly.Msg.PINS_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('analog read pin ')
            .appendField(new Blockly.FieldDropdown([
                ['36', '36'],
                ['35', '35']
            ]), 'PIN');
    }
}
Blockly.Python['pins_analog_read'] = function (block) {
    Blockly.addModule('m5_pin');
    Blockly.addDeclare('pin');
    var pin = block.getFieldValue('PIN') || '4';
    return ['pin.analogRead(' + pin + ')', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['pins_analog_write'] = {
    init: function () {
        this.setColour(Blockly.Msg.PINS_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('analog write pin ')
        this.appendValueInput('PIN');
        this.appendDummyInput()
            .appendField(' duty ');
        this.appendValueInput('DUTY');
    }
}
Blockly.Python['pins_analog_write'] = function (block) {
    Blockly.addModule('m5_pin');
    Blockly.addDeclare('pin');
    // var pin = block.getFieldValue('PIN') || '4';
    var pin = Blockly.Python.valueToCode(block, 'PIN', Blockly.Python.ORDER_FUNCTION_CALL) || '26';
    var duty = Blockly.Python.valueToCode(block, 'DUTY', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return 'pin.analogWrite(' + pin + ', ' + duty + ')\n';
}

Blockly.Blocks['pins_digital_read'] = {
    init: function () {
        this.setColour(Blockly.Msg.PINS_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('digital read pin ');
        this.appendValueInput('PIN');
    }
}
Blockly.Python['pins_digital_read'] = function (block) {
    Blockly.addModule('m5_pin');
    Blockly.addDeclare('pin');
    var pin = Blockly.Python.valueToCode(block, 'PIN', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var code = 'pin.digitalRead(' + pin + ')';
    return [code, Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['pins_digital_write'] = {
    init: function () {
        this.setColour(Blockly.Msg.PINS_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('digital write pin ')
        this.appendValueInput('PIN');
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['0', '0'],
                ['1', '1']
            ]), 'VALUE');
    }
}
Blockly.Python['pins_digital_write'] = function (block) {
    Blockly.addModule('m5_pin');
    Blockly.addDeclare('pin');
    var pin = Blockly.Python.valueToCode(block, 'PIN', Blockly.Python.ORDER_FUNCTION_CALL) || '26';
    var value = block.getFieldValue('VALUE') || '0';
    return 'pin.digitalWrite(' + pin + ', ' + value + ')\n';
}

Blockly.Blocks['pins_set_mode'] = {
    init: function () {
        this.setColour(Blockly.Msg.PINS_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set pin ');
        this.appendValueInput('PIN');
        this.appendDummyInput()
            .appendField(' mode ')
            .appendField(new Blockly.FieldDropdown([
                ['OUT', 'OUT'],
                ['IN', 'IN'],
                ['OUT_OD', 'OUT_OD'],
                ['INOUT', 'INOUT'],
                ['INOUT_OD', 'INOUT_OD']
            ]), 'MODE');
        this.appendDummyInput()
            .appendField(' pull ')
            .appendField(new Blockly.FieldDropdown([
                ['PULL_FLOAT', 'PULL_FLOAT'],
                ['PULL_UP', 'PULL_UP'],
                ['PULL_DOWN', 'PULL_DOWN'],
                ['PULL_UPDOWN', 'PULL_UPDOWN']
            ]), 'PULL');
    }
}
Blockly.Python['pins_set_mode'] = function (block) {
    Blockly.addModule('m5_pin');
    Blockly.addDeclare('pin');
    var pin = Blockly.Python.valueToCode(block, 'PIN', Blockly.Python.ORDER_FUNCTION_CALL) || '5';
    var mode = block.getFieldValue('mode') || 'OUT';
    var pull = block.getFieldValue('PULL') || 'PULL_FLOAT';
    return 'pin.pin_mode(' + pin + ', machine.ADC.' + mode + ', machine.ADC.' + pull + ')\n';
}

Blockly.Blocks['pins_set_map'] = {
    init: function () {
        this.setColour(Blockly.Msg.PINS_HUE);
        this.setOutput(true);

        this.appendValueInput('MAP')
            .appendField('map')
        this.appendValueInput('FROM_LOW')
            .appendField('from low')
        this.appendValueInput('FROM_HIGH')
            .appendField('from high')
        this.appendValueInput('TO_LOW')
            .appendField('to low')
        this.appendValueInput('TO_HIGH')
            .appendField('to high')
    }
}
Blockly.Python['pins_set_map'] = function (block) {
    Blockly.addModule('m5_pin');
    Blockly.addDeclare('pin');
    var map = Blockly.Python.valueToCode(block, 'MAP', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var fromLow = Blockly.Python.valueToCode(block, 'FROM_LOW', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var fromHigh = Blockly.Python.valueToCode(block, 'FROM_HIGH', Blockly.Python.ORDER_FUNCTION_CALL) || '1023';
    var toLow = Blockly.Python.valueToCode(block, 'TO_LOW', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var toHigh = Blockly.Python.valueToCode(block, 'TO_HIGH', Blockly.Python.ORDER_FUNCTION_CALL) || '4';

    return ['map_value(' + map + ', ' + fromLow + ', ' + fromHigh + ', ' + toLow + ', ' + toHigh + ')\n', Blockly.Python.ORDER_NONE];
}

/**
 * Speaker
 */
Blockly.Blocks['speaker_tone'] = {
    init: function () {
        this.setColour(Blockly.Msg.SPEAKER_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Speaker.beep ');
        this.appendValueInput('FREQ')
            .appendField('freq:');
        this.appendValueInput('TIMEOUT')
            .appendField('duration:');
        this.appendDummyInput()
            .appendField(' ms');
    }
}
Blockly.Python['speaker_tone'] = function (block) {
    var freq = Blockly.Python.valueToCode(block, 'FREQ', Blockly.Python.ORDER_FUNCTION_CALL) || '1600';
    var timeout = Blockly.Python.valueToCode(block, 'TIMEOUT', Blockly.Python.ORDER_FUNCTION_CALL) || '200';
    return 'speaker.tone(' + freq + ', ' + timeout + ')\n';
}

Blockly.Blocks['speaker_vol'] = {
    init: function () {
        this.setColour(Blockly.Msg.SPEAKER_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendValueInput('VOLUME')
            .appendField('Speaker.volume ');
    }
}
Blockly.Python['speaker_vol'] = function (block) {
    var volume = Blockly.Python.valueToCode(block, 'VOLUME', Blockly.Python.ORDER_FUNCTION_CALL) || '1';
    return 'speaker.volume(' + volume + ')\n';
}

Blockly.Blocks['speaker_sing'] = {
    init: function () {
        this.setColour(Blockly.Msg.SPEAKER_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('play tone ')
            .appendField(new Blockly.FieldDropdown([
                ['Low A', '220'], ['Low B', '247'], ['Low C', '131'], ['Low D', '147'], ['Low E', '165'], ['Low F', '175'], ['Low G', '196'],
                ['Middle A', '448'], ['Middle B', '494'], ['Middle C', '262'], ['Middle D', '294'], ['Middle E', '330'], ['Middle F', '349'], ['Middle G', '392'],
                ['High A', '889'], ['High B', '988'], ['High C', '523'], ['High D', '587'], ['High E', '659'], ['High F', '698'], ['High G', '784'],
                ['Low A#', '233'], ['Low C#', '139'], ['Low D#', '156'], ['Low F#', '185'], ['Low G#', '208'],
                ['Middle A#', '466'], ['Middle C#', '277'], ['Middle D#', '311'], ['Middle F#', '370'], ['Middle G#', '415'],
                ['High A#', '932'], ['High C#', '554'], ['High D#', '622'], ['High F#', '740'], ['High  G#', '831']
            ]), 'TONE')
            .appendField(' for ')
            .appendField(new Blockly.FieldDropdown([
                ['1', '1'],
                ['1/2', '1/2'],
                ['1/4', '1/4'],
                ['1/8', '1/8'],
                ['1/16', '1/16'],
                ['2', '2'],
                ['4', '4']
            ]), 'BEAT')
            .appendField(' beat');
    }
}
Blockly.Python['speaker_sing'] = function (block) {
    var tone = block.getFieldValue('TONE') || '220';
    var beat = block.getFieldValue('BEAT') || '1';
    return 'speaker.sing(' + tone + ', ' + beat + ')\n';
}

/**
 * Component - Title
 */
Blockly.Blocks['title_set_text'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_TITLE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Title'))
            .appendField(new Blockly.FieldDropdown(this.getAllTitles), 'COMPONENT')
        this.appendValueInput('TEXT')
            .appendField('show ');
    },
    getAllTitles: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'title') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['title_set_text'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var text = Blockly.Python.valueToCode(block, 'TEXT', Blockly.Python.ORDER_NONE) || '';
    if (block.childBlocks_[0].type === 'text') {
        return component + '.setTitle(' + text + ')\n';
    }
    return component + '.setTitle(str(' + text + '))\n';
}

Blockly.Blocks['title_show'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_TITLE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Show'))
            .appendField(new Blockly.FieldDropdown(this.getAllTitles), 'COMPONENT');
    },
    getAllTitles: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'title') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['title_show'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    return component + '.show()\n';
}

Blockly.Blocks['title_hide'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_TITLE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Hide'))
            .appendField(new Blockly.FieldDropdown(this.getAllTitles), 'COMPONENT');
    },
    getAllTitles: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'title') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['title_hide'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    return component + '.hide()\n';
}

Blockly.Blocks['title_set_color'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_TITLE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllTitles), 'COMPONENT')
            .appendField(new Blockly.FieldLabel('color'))
            .appendField(new Blockly.FieldColour('#ff0000'), 'COLOR');
    },
    getAllTitles: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'title') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['title_set_color'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var color = block.getFieldValue('COLOR') || '#ff0000';
    return component + '.setFgColor(' + color.replace('#', '0x') + ')\n';
}

Blockly.Blocks['title_set_color_rgb'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_TITLE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllTitles), 'COMPONENT')
            .appendField(new Blockly.FieldLabel('color by RGB'))
        this.appendValueInput('R')
            .appendField('red');
        this.appendValueInput('G')
            .appendField('green');
        this.appendValueInput('B')
            .appendField('blue');
    },
    getAllTitles: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'title') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['title_set_color_rgb'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var r = Blockly.Python.valueToCode(block, 'R', Blockly.Python.ORDER_NONE) || '0';
    var g = Blockly.Python.valueToCode(block, 'G', Blockly.Python.ORDER_NONE) || '0';
    var b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_NONE) || '0';
    if(isNaN(parseInt(r)) || isNaN(parseInt(g)) || isNaN(parseInt(b))) {
        return component + ".setFgColor(int('0x%02x%02x%02x' % (round(min(100, max(0, " + r +")) * 2.55), round(min(100, max(0, " + g +")) * 2.55), round(min(100, max(0, " + b +")) * 2.55))))\n";
    }
    var hexR = Math.floor(Math.abs(parseInt(r)) % 256).toString(16);
    var hexG = Math.floor(Math.abs(parseInt(g)) % 256).toString(16);
    var hexB = Math.floor(Math.abs(parseInt(b)) % 256).toString(16);
    if(hexR.length < 2) hexR = '0' + hexR;
    if(hexG.length < 2) hexG = '0' + hexG;
    if(hexB.length < 2) hexB = '0' + hexB;
    return component + '.setFgColor(0x' + hexR + hexG + hexB + ')\n';
}

Blockly.Blocks['title_set_bgcolor'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_TITLE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllTitles), 'COMPONENT')
            .appendField(new Blockly.FieldLabel('backgroundColor'))
            .appendField(new Blockly.FieldColour('#ff0000'), 'COLOR');
    },
    getAllTitles: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'title') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['title_set_bgcolor'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var color = block.getFieldValue('COLOR') || '#ff0000';
    return component + '.setBgColor(' + color.replace('#', '0x') + ')\n';
}

Blockly.Blocks['title_set_bgcolor_rgb'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_TITLE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllTitles), 'COMPONENT')
            .appendField(new Blockly.FieldLabel('backgroundColor by RGB'))
        this.appendValueInput('R')
            .appendField('red');
        this.appendValueInput('G')
            .appendField('green');
        this.appendValueInput('B')
            .appendField('blue');
    },
    getAllTitles: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'title') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['title_set_bgcolor_rgb'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var r = Blockly.Python.valueToCode(block, 'R', Blockly.Python.ORDER_NONE) || '0';
    var g = Blockly.Python.valueToCode(block, 'G', Blockly.Python.ORDER_NONE) || '0';
    var b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_NONE) || '0';
    if(isNaN(parseInt(r)) || isNaN(parseInt(g)) || isNaN(parseInt(b))) {
        return component + ".setBgColor(int('0x%02x%02x%02x' % (round(min(100, max(0, " + r +")) * 2.55), round(min(100, max(0, " + g +")) * 2.55), round(min(100, max(0, " + b +")) * 2.55))))\n";
    }
    var hexR = Math.floor(Math.abs(parseInt(r)) % 256).toString(16);
    var hexG = Math.floor(Math.abs(parseInt(g)) % 256).toString(16);
    var hexB = Math.floor(Math.abs(parseInt(b)) % 256).toString(16);
    if(hexR.length < 2) hexR = '0' + hexR;
    if(hexG.length < 2) hexG = '0' + hexG;
    if(hexB.length < 2) hexB = '0' + hexB;
    return component + '.setBgColor(0x' + hexR + hexG + hexB + ')\n';
}

/**
 * Component - Label
 */
Blockly.Blocks['label_set_text'] = {
    init: function () {
        this.setColour(Blockly.Msg.COMPONENT_LABEL_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Label'))
            .appendField(new Blockly.FieldDropdown(this.getAllLabels), 'COMPONENT')
        this.appendValueInput('TEXT')
            .appendField('show ');
    },
    getAllLabels: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'label') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['label_set_text'] = function (block) {
    var component = block.getFieldValue('COMPONENT');
    var text = Blockly.Python.valueToCode(block, 'TEXT', Blockly.Python.ORDER_NONE) || '';
    if (block.childBlocks_[0].type === 'text') {
        return component + '.setText(' + text + ')\n';
    }
    return component + '.setText(str(' + text + '))\n';
}

Blockly.Blocks['label_set_position'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_LABEL_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllLabels), 'COMPONENT');
        this.appendValueInput('X')
            .appendField('x');
        this.appendValueInput('Y')
            .appendField('y');
    },
    getAllLabels: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'label') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['label_set_position'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return component + '.setPosition(' + x + ', ' + y +')\n';
}

Blockly.Blocks['label_set_position_x'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_LABEL_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllLabels), 'COMPONENT');
        this.appendValueInput('X')
            .appendField('x');
    },
    getAllLabels: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'label') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['label_set_position_x'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return component + '.setPosition(x=' + x + ')\n';
}

Blockly.Blocks['label_set_position_y'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_LABEL_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllLabels), 'COMPONENT');
        this.appendValueInput('Y')
            .appendField('y');
    },
    getAllLabels: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'label') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['label_set_position_y'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return component + '.setPosition(y=' + y +')\n';
}

Blockly.Blocks['label_set_color'] = {
    init: function () {
        this.setColour(Blockly.Msg.COMPONENT_LABEL_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllLabels), 'COMPONENT')
            .appendField(new Blockly.FieldLabel('color'))
            .appendField(new Blockly.FieldColour('#ff0000'), 'COLOR');
    },
    getAllLabels: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'label') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['label_set_color'] = function (block) {
    var component = block.getFieldValue('COMPONENT');
    var color = block.getFieldValue('COLOR') || '#ff0000';
    return component + '.setColor(' + color.replace('#', '0x') + ')\n';
}

Blockly.Blocks['label_set_color_rgb'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_LABEL_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllLabels), 'COMPONENT')
            .appendField(new Blockly.FieldLabel('color by RGB'))
        this.appendValueInput('R')
            .appendField('red');
        this.appendValueInput('G')
            .appendField('green');
        this.appendValueInput('B')
            .appendField('blue');
    },
    getAllLabels: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'label') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['label_set_color_rgb'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var r = Blockly.Python.valueToCode(block, 'R', Blockly.Python.ORDER_NONE) || '0';
    var g = Blockly.Python.valueToCode(block, 'G', Blockly.Python.ORDER_NONE) || '0';
    var b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_NONE) || '0';
    if(isNaN(parseInt(r)) || isNaN(parseInt(g)) || isNaN(parseInt(b))) {
        return component + ".setColor(int('0x%02x%02x%02x' % (round(min(100, max(0, " + r +")) * 2.55), round(min(100, max(0, " + g +")) * 2.55), round(min(100, max(0, " + b +")) * 2.55))))\n";
    }
    var hexR = Math.floor(Math.abs(parseInt(r)) % 256).toString(16);
    var hexG = Math.floor(Math.abs(parseInt(g)) % 256).toString(16);
    var hexB = Math.floor(Math.abs(parseInt(b)) % 256).toString(16);
    if(hexR.length < 2) hexR = '0' + hexR;
    if(hexG.length < 2) hexG = '0' + hexG;
    if(hexB.length < 2) hexB = '0' + hexB;
    return component + '.setColor(0x' + hexR + hexG + hexB + ')\n';
}

/**
 * Component - Rect
 */
Blockly.Blocks['rect_set_size'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_RECT_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllRects), 'COMPONENT')
        this.appendValueInput('WIDTH')
            .appendField('width');
        this.appendValueInput('HEIGHT')
            .appendField('height');
    },
    getAllRects: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'rect') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['rect_set_size'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var width = Blockly.Python.valueToCode(block, 'WIDTH', Blockly.Python.ORDER_FUNCTION_CALL) || '30';
    var height = Blockly.Python.valueToCode(block, 'HEIGHT', Blockly.Python.ORDER_FUNCTION_CALL) || '30'
    return component + '.setSize(' + width + ', ' + height +')\n';
}

Blockly.Blocks['rect_set_size_width'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_RECT_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllRects), 'COMPONENT')
        this.appendValueInput('WIDTH')
            .appendField('width');
    },
    getAllRects: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'rect') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['rect_set_size_width'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var width = Blockly.Python.valueToCode(block, 'WIDTH', Blockly.Python.ORDER_FUNCTION_CALL) || '30';
    return component + '.setSize(width=' + width + ')\n';
}

Blockly.Blocks['rect_set_size_height'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_RECT_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllRects), 'COMPONENT');
        this.appendValueInput('HEIGHT')
            .appendField('height');
    },
    getAllRects: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'rect') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['rect_set_size_height'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var height = Blockly.Python.valueToCode(block, 'HEIGHT', Blockly.Python.ORDER_FUNCTION_CALL) || '30'
    return component + '.setSize(height=' + height +')\n';
}

Blockly.Blocks['rect_set_position'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_RECT_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllRects), 'COMPONENT')
        this.appendValueInput('X')
            .appendField('x');
        this.appendValueInput('Y')
            .appendField('y');
    },
    getAllRects: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'rect') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['rect_set_position'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '30';
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '30'
    return component + '.setPosition(' + x + ', ' + y +')\n';
}

Blockly.Blocks['rect_set_position_x'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_RECT_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllRects), 'COMPONENT')
        this.appendValueInput('X')
            .appendField('x');
    },
    getAllRects: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'rect') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['rect_set_position_x'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '30';
    return component + '.setPosition(x=' + x + ')\n';
}

Blockly.Blocks['rect_set_position_y'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_RECT_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllRects), 'COMPONENT')
        this.appendValueInput('Y')
            .appendField('y');
    },
    getAllRects: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'rect') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['rect_set_position_y'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '30';
    return component + '.setPosition(y=' + y + ')\n';
}

Blockly.Blocks['rect_set_bgcolor'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_RECT_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllRects), 'COMPONENT')
            .appendField(new Blockly.FieldLabel('color'))
            .appendField(new Blockly.FieldColour('#FF0000'), 'COLOR');
    },
    getAllRects: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'rect') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['rect_set_bgcolor'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var color = block.getFieldValue('COLOR') || '#ff0000';
    return component + '.setBgColor(' + color.replace('#', '0x') +')\n';
}

Blockly.Blocks['rect_set_bgcolor_rgb'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_RECT_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllRects), 'COMPONENT')
            .appendField(new Blockly.FieldLabel('color by RGB'))
        this.appendValueInput('R')
            .appendField('red');
        this.appendValueInput('G')
            .appendField('green');
        this.appendValueInput('B')
            .appendField('blue');
    },
    getAllRects: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'rect') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['rect_set_bgcolor_rgb'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var r = Blockly.Python.valueToCode(block, 'R', Blockly.Python.ORDER_NONE) || '0';
    var g = Blockly.Python.valueToCode(block, 'G', Blockly.Python.ORDER_NONE) || '0';
    var b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_NONE) || '0';
    if(isNaN(parseInt(r)) || isNaN(parseInt(g)) || isNaN(parseInt(b))) {
        return component + ".setBgColor(int('0x%02x%02x%02x' % (round(min(100, max(0, " + r +")) * 2.55), round(min(100, max(0, " + g +")) * 2.55), round(min(100, max(0, " + b +")) * 2.55))))\n";
    }
    var hexR = Math.floor(Math.abs(parseInt(r)) % 256).toString(16);
    var hexG = Math.floor(Math.abs(parseInt(g)) % 256).toString(16);
    var hexB = Math.floor(Math.abs(parseInt(b)) % 256).toString(16);
    if(hexR.length < 2) hexR = '0' + hexR;
    if(hexG.length < 2) hexG = '0' + hexG;
    if(hexB.length < 2) hexB = '0' + hexB;
    return component + '.setBgColor(0x' + hexR + hexG + hexB + ')\n';
}

Blockly.Blocks['rect_set_bordercolor'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_RECT_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllRects), 'COMPONENT')
            .appendField(new Blockly.FieldLabel('borderColor'))
            .appendField(new Blockly.FieldColour('#FF0000'), 'COLOR');
    },
    getAllRects: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'rect') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['rect_set_bordercolor'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var color = block.getFieldValue('COLOR') || '#ff0000';
    return component + '.setBorderColor(' + color.replace('#', '0x') +')\n';
}

Blockly.Blocks['rect_set_bordercolor_rgb'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_RECT_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllRects), 'COMPONENT')
            .appendField(new Blockly.FieldLabel('borderColor by RGB'))
        this.appendValueInput('R')
            .appendField('red');
        this.appendValueInput('G')
            .appendField('green');
        this.appendValueInput('B')
            .appendField('blue');
    },
    getAllRects: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'rect') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['rect_set_bordercolor_rgb'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var r = Blockly.Python.valueToCode(block, 'R', Blockly.Python.ORDER_NONE) || '0';
    var g = Blockly.Python.valueToCode(block, 'G', Blockly.Python.ORDER_NONE) || '0';
    var b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_NONE) || '0';
    if(isNaN(parseInt(r)) || isNaN(parseInt(g)) || isNaN(parseInt(b))) {
        return component + ".setBorderColor(int('0x%02x%02x%02x' % (round(min(100, max(0, " + r +")) * 2.55), round(min(100, max(0, " + g +")) * 2.55), round(min(100, max(0, " + b +")) * 2.55))))\n";
    }
    var hexR = Math.floor(Math.abs(parseInt(r)) % 256).toString(16);
    var hexG = Math.floor(Math.abs(parseInt(g)) % 256).toString(16);
    var hexB = Math.floor(Math.abs(parseInt(b)) % 256).toString(16);
    if(hexR.length < 2) hexR = '0' + hexR;
    if(hexG.length < 2) hexG = '0' + hexG;
    if(hexB.length < 2) hexB = '0' + hexB;
    return component + '.setBorderColor(0x' + hexR + hexG + hexB + ')\n';
}

/**
 * Component - Circle
 */
Blockly.Blocks['circle_set_size'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_CIRCLE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllCircles), 'COMPONENT')
        this.appendValueInput('RADIUS')
            .appendField('radius');
    },
    getAllCircles: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'circle') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['circle_set_size'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var radius = Blockly.Python.valueToCode(block, 'RADIUS', Blockly.Python.ORDER_FUNCTION_CALL) || '20';
    return component + '.setSize(' + radius +')\n';
}

Blockly.Blocks['circle_set_position'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_CIRCLE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllCircles), 'COMPONENT')
        this.appendValueInput('X')
            .appendField('x');
        this.appendValueInput('Y')
            .appendField('y');
    },
    getAllCircles: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'circle') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['circle_set_position'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '30';
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '30'
    return component + '.setPosition(' + x + ', ' + y +')\n';
}

Blockly.Blocks['circle_set_position_x'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_CIRCLE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllCircles), 'COMPONENT');
        this.appendValueInput('X')
            .appendField('x');
    },
    getAllCircles: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'circle') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['circle_set_position_x'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '30';
    return component + '.setPosition(x=' + x + ')\n';
}

Blockly.Blocks['circle_set_position_y'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_CIRCLE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllCircles), 'COMPONENT');
        this.appendValueInput('Y')
            .appendField('y');
    },
    getAllCircles: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'circle') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['circle_set_position_y'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '30';
    return component + '.setPosition(y=' + y +')\n';
}

Blockly.Blocks['circle_set_bgcolor'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_CIRCLE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllCircles), 'COMPONENT')
            .appendField(new Blockly.FieldLabel('color'))
            .appendField(new Blockly.FieldColour('#FF0000'), 'COLOR');
    },
    getAllCircles: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'circle') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['circle_set_bgcolor'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var color = block.getFieldValue('COLOR') || '#ff0000';
    return component + '.setBgColor(' + color.replace('#', '0x') +')\n';
}

Blockly.Blocks['circle_set_bgcolor_rgb'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_CIRCLE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllCircles), 'COMPONENT')
            .appendField(new Blockly.FieldLabel('color by RGB'))
        this.appendValueInput('R')
            .appendField('red');
        this.appendValueInput('G')
            .appendField('green');
        this.appendValueInput('B')
            .appendField('blue');
    },
    getAllCircles: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'circle') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['circle_set_bgcolor_rgb'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var r = Blockly.Python.valueToCode(block, 'R', Blockly.Python.ORDER_NONE) || '0';
    var g = Blockly.Python.valueToCode(block, 'G', Blockly.Python.ORDER_NONE) || '0';
    var b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_NONE) || '0';
    if(isNaN(parseInt(r)) || isNaN(parseInt(g)) || isNaN(parseInt(b))) {
        return component + ".setBgColor(int('0x%02x%02x%02x' % (round(min(100, max(0, " + r +")) * 2.55), round(min(100, max(0, " + g +")) * 2.55), round(min(100, max(0, " + b +")) * 2.55))))\n";
    }
    var hexR = Math.floor(Math.abs(parseInt(r)) % 256).toString(16);
    var hexG = Math.floor(Math.abs(parseInt(g)) % 256).toString(16);
    var hexB = Math.floor(Math.abs(parseInt(b)) % 256).toString(16);
    if(hexR.length < 2) hexR = '0' + hexR;
    if(hexG.length < 2) hexG = '0' + hexG;
    if(hexB.length < 2) hexB = '0' + hexB;
    return component + '.setBgColor(0x' + hexR + hexG + hexB + ')\n';
}

Blockly.Blocks['circle_set_bordercolor'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_CIRCLE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllCircles), 'COMPONENT')
            .appendField(new Blockly.FieldLabel('borderColor'))
            .appendField(new Blockly.FieldColour('#FF0000'), 'COLOR');
    },
    getAllCircles: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'circle') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['circle_set_bordercolor'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var color = block.getFieldValue('COLOR') || '#ff0000';
    return component + '.setBorderColor(' + color.replace('#', '0x') +')\n';
}

Blockly.Blocks['circle_set_bordercolor_rgb'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_CIRCLE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllCircles), 'COMPONENT')
            .appendField(new Blockly.FieldLabel('borderColor by RGB'))
        this.appendValueInput('R')
            .appendField('red');
        this.appendValueInput('G')
            .appendField('green');
        this.appendValueInput('B')
            .appendField('blue');
    },
    getAllCircles: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'circle') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['circle_set_bordercolor_rgb'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var r = Blockly.Python.valueToCode(block, 'R', Blockly.Python.ORDER_NONE) || '0';
    var g = Blockly.Python.valueToCode(block, 'G', Blockly.Python.ORDER_NONE) || '0';
    var b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_NONE) || '0';
    if(isNaN(parseInt(r)) || isNaN(parseInt(g)) || isNaN(parseInt(b))) {
        return component + ".setBorderColor(int('0x%02x%02x%02x' % (round(min(100, max(0, " + r +")) * 2.55), round(min(100, max(0, " + g +")) * 2.55), round(min(100, max(0, " + b +")) * 2.55))))\n";
    }
    var hexR = Math.floor(Math.abs(parseInt(r)) % 256).toString(16);
    var hexG = Math.floor(Math.abs(parseInt(g)) % 256).toString(16);
    var hexB = Math.floor(Math.abs(parseInt(b)) % 256).toString(16);
    if(hexR.length < 2) hexR = '0' + hexR;
    if(hexG.length < 2) hexG = '0' + hexG;
    if(hexB.length < 2) hexB = '0' + hexB;
    return component + '.setBorderColor(0x' + hexR + hexG + hexB + ')\n';
}

/**
 * Component Image
 */
Blockly.Blocks['image_hide'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_IMAGE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Hide '))
            .appendField(new Blockly.FieldDropdown(this.getAllImages), 'COMPONENT');
    },
    getAllImages: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'image') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['image_hide'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    return component + '.hide()\n';
}

Blockly.Blocks['image_show'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_IMAGE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Show '))
            .appendField(new Blockly.FieldDropdown(this.getAllImages), 'COMPONENT');
    },
    getAllImages: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'image') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['image_show'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    return component + '.show()\n';
}

Blockly.Blocks['image_set_position_x'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_IMAGE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllImages), 'COMPONENT')
        this.appendValueInput('X')
            .appendField('x');
    },
    getAllImages: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'image') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['image_set_position_x'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return component + '.setPosition(x=' + x + ')\n';
}

Blockly.Blocks['image_set_position_y'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_IMAGE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllImages), 'COMPONENT')
        this.appendValueInput('Y')
            .appendField('y');
    },
    getAllImages: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'image') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['image_set_position_y'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return component + '.setPosition(y=' + y + ')\n';
}

Blockly.Blocks['image_set_position'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_IMAGE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllImages), 'COMPONENT')
        this.appendValueInput('X')
            .appendField('x');
        this.appendValueInput('Y')
            .appendField('y');
    },
    getAllImages: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'image') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['image_set_position'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return component + '.setPosition(' + x + ', ' + y + ')\n';
}

Blockly.Blocks['image_set_image'] = {
    init: function() {
        this.setColour(Blockly.Msg.COMPONENT_IMAGE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set'))
            .appendField(new Blockly.FieldDropdown(this.getAllImages), 'COMPONENT')
            .appendField(' image ');
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(this.getResImages), 'IMAGE')
    },
    getAllImages: function() {
        var options = [];
        for (var i = 0; i < Blockly.Component.length; i++) {
            if (Blockly.Component[i].type === 'image') {
                options.push([Blockly.Component[i].name, Blockly.Component[i].name]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    },
    getResImages: function() {
        var options = [];
        for (var i = 0; i < Blockly.ResImages.length; i++) {
            options.push([Blockly.ResImages[i], Blockly.ResImages[i]]);
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['image_set_image'] = function(block) {
    var component = block.getFieldValue('COMPONENT');
    var image = block.getFieldValue('IMAGE');
    return component + '.changeImg("res/' + image + '")\n';
}

/**
 * M5Stand
 */
Blockly.Blocks['m5bala_start'] = {
    init: function () {
        this.setColour(260);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('M5Bala Start');
    }
}
Blockly.Python['m5bala_start'] = function (block) {
    Blockly.addModule('m5bala');
    return 'm5bala.start(thread=True)\n';
}

Blockly.Blocks['m5bala_move'] = {
    init: function () {
        this.setColour(260);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Move ')
            .appendField(new Blockly.FieldDropdown([['forward', 'forward'], ['backward', 'backward']]), 'DIRECTION');
        this.appendValueInput('SPEED')
            .appendField(' ');
        this.appendValueInput('TIME')
            .appendField(' Time');
        this.appendDummyInput()
            .appendField('s');
    }
}
Blockly.Python['m5bala_move'] = function (block) {
    var direction = block.getFieldValue('DIRECTION');
    var speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_FUNCTION_CALL) || '50';
    var time = Blockly.Python.valueToCode(block, 'TIME', Blockly.Python.ORDER_FUNCTION_CALL) || '5';
    if (direction === 'backward') {
        speed = -speed;
    }
    Blockly.addModule('m5bala');
    return 'm5bala.move(' + speed + ', ' + time + ')\n';
}

Blockly.Blocks['m5bala_turn'] = {
    init: function () {
        this.setColour(260);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Turn'))
            .appendField(new Blockly.FieldDropdown([['right', 'right'], ['left', 'left']]), 'DIRECTION');
        this.appendValueInput('ANGLE')
            .appendField('');
        this.appendValueInput('TIME')
            .appendField(' Time');
        this.appendDummyInput()
            .appendField('s');
    }
}
Blockly.Python['m5bala_turn'] = function (block) {
    var direction = block.getFieldValue('DIRECTION');
    var angle = Blockly.Python.valueToCode(block, 'ANGLE', Blockly.Python.ORDER_FUNCTION_CALL) || '45';
    var time = Blockly.Python.valueToCode(block, 'TIME', Blockly.Python.ORDER_FUNCTION_CALL) || '5';
    if (direction === 'left') {
        angle = -angle;
    }
    Blockly.addModule('m5bala');
    return 'm5bala.turn(' + angle + ', ' + time + ')\n';
}

Blockly.Blocks['m5bala_rotate'] = {
    init: function () {
        this.setColour(260);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Rotate'))
            .appendField(new Blockly.FieldDropdown([['right', 'right'], ['left', 'left']]), 'DIRECTION');
        this.appendValueInput('ANGLE')
            .appendField('');
        this.appendValueInput('TIME')
            .appendField(' Time');
        this.appendDummyInput()
            .appendField('s');
    }
}
Blockly.Python['m5bala_rotate'] = function (block) {
    var direction = block.getFieldValue('DIRECTION');
    var angle = Blockly.Python.valueToCode(block, 'ANGLE', Blockly.Python.ORDER_FUNCTION_CALL) || '45';
    var time = Blockly.Python.valueToCode(block, 'TIME', Blockly.Python.ORDER_FUNCTION_CALL) || '5';
    if (direction === 'left') {
        angle = -angle;
    }
    Blockly.addModule('m5bala');
    return 'm5bala.rotate(' + angle + ', ' + time + ')\n';
}

/**
 * Timer
 */
Blockly.Blocks['timer_delay'] = {
    init: function () {
        this.setColour(Blockly.Msg.TIMER_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendValueInput('DELAY')
            .appendField('Wait ');
        this.appendDummyInput()
            .appendField(' s');
    }
}
Blockly.Python['timer_delay'] = function (block) {
    var delay = Blockly.Python.valueToCode(block, 'DELAY', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return 'wait(' + delay + ')\n';
    // return 'if _thread.wait(' + (delay * 1000) + ') == _thread.EXIT: raise OSError\n';
}

/**
 * Motor
 */
Blockly.Blocks['motor_instance'] = {
    init: function () {
        this.setColour(Blockly.Msg.MOTOR_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Motor ')
            .appendField(new Blockly.FieldTextInput('stepmotor'), 'X_VAR_MOTOR');
        this.appendDummyInput()
            .appendField('Address ')
            .appendField(new Blockly.FieldTextInput('0x70'), 'ADDRESS');
    }
}
Blockly.Python['motor_instance'] = function (block) {
    var motor = block.getFieldValue('X_VAR_MOTOR') || 'stepmotor';
    var address = block.getFieldValue('ADDRESS') || '0x70';
    return motor + ' = StepMotor(' + address + ')\n';
}

Blockly.Blocks['motor_move_xyz'] = {
    init: function () {
        this.setColour(Blockly.Msg.MOTOR_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Motor ')
            .appendField(new Blockly.FieldTextInput('stepmotor', 'MOTOR'));
        this.appendValueInput('X')
            .appendField('X ');
        this.appendDummyInput()
            .appendField(' ');
        this.appendValueInput('Y')
            .appendField('Y ');
        this.appendValueInput('Z')
            .appendField('Z ');
        this.appendDummyInput()
            .appendField(' ');
        this.appendValueInput('SPEED')
            .appendField('Speed ');
        this.appendDummyInput()
            .appendField(' ');
    }
}
Blockly.Python['motor_move_xyz'] = function (block) {
    var motor = block.getFieldValue('MOTOR') || 'stepmotor';
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var z = Blockly.Python.valueToCode(block, 'Z', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return motor + '.Stepmotor_xyz(' + x + ', ' + y + ', ' + z + ', ' + speed + ')\n';
}

/**
 * SD Card
 */
Blockly.Blocks['sdcard_mountsd'] = {
    init: function () {
        this.setColour(Blockly.Msg.SDCARD_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('SD mount');
    }
}
Blockly.Python['sdcard_mountsd'] = function (block) {
    return 'uos.mountsd()\n';
}

Blockly.Blocks['sdcard_listdir'] = {
    init: function () {
        this.setColour(Blockly.Msg.SDCARD_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Listdir: ');
        this.appendValueInput('PATH');
    }
}
Blockly.Python['sdcard_listdir'] = function (block) {
    var path = Blockly.Python.valueToCode(block, 'PATH', Blockly.Python.ORDER_FUNCTION_CALL) || '';
    return 'uos.listdir(' + path + ')';
}

/**
 * GPIO
 */
Blockly.Blocks['gpio_pinout'] = {
    init: function () {
        this.setColour(Blockly.Msg.GPIO_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('set pinout ')
            .appendField(new Blockly.FieldVariable('pinout'), 'VAR')
            .appendField(' of pin ')
        this.appendValueInput('PIN');
    }
}
Blockly.Python['gpio_pinout'] = function (block) {
    var varname = block.getField('VAR').variable_.name || '';
    var pin = Blockly.Python.valueToCode(block, 'PIN', Blockly.Python.ORDER_FUNCTION_CALL) || 'FFFFFF';
    return 'global ' + varname + '\n' + varname + ' = machine.Pin(' + pin + ', machine.Pin.OUT)\n';
}

Blockly.Blocks['gpio_pinin'] = {
    init: function () {
        this.setColour(Blockly.Msg.GPIO_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('set pinin ')
            .appendField(new Blockly.FieldVariable('pinin'), 'VAR')
            .appendField(' to pin ')
        this.appendValueInput('PIN');
    }
}
Blockly.Python['gpio_pinin'] = function (block) {
    var varname = block.getField('VAR').variable_.name || '';
    var pin = Blockly.Python.valueToCode(block, 'PIN', Blockly.Python.ORDER_FUNCTION_CALL) || 'FFFFFF';
    return 'global ' + varname + '\n' + varname + ' = machine.Pin(' + pin + ', machine.Pin.IN)\n';
}

Blockly.Blocks['gpio_pinout_value'] = {
    init: function () {
        this.setColour(Blockly.Msg.GPIO_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('set pinout ')
            .appendField(new Blockly.FieldVariable('pinout'), 'VAR')
        this.appendValueInput('VALUE');
    }
}
Blockly.Python['gpio_pinout_value'] = function (block) {
    var varname = block.getField('VAR').variable_.name || '';
    var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_FUNCTION_CALL) || 'FFFFFF';
    return varname + '.value(' + value + ')\n';
}

Blockly.Blocks['gpio_pinin_value'] = {
    init: function () {
        this.setColour(Blockly.Msg.GPIO_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('set ')
            .appendField(new Blockly.FieldVariable('val'), 'VAR')
            .appendField(' to pinin ')
            .appendField(new Blockly.FieldVariable('pinin'), 'VAR1')
            .appendField(' value ');
    }
}
Blockly.Python['gpio_pinin_value'] = function (block) {
    var varname = block.getField('VAR').variable_.name || '';
    var varname1 = block.getField('VAR1').variable_.name || '';
    return 'global ' + varname + '\n' + varname + ' = ' + varname1 + '.value()\n';
}

/**
 * PWM
 */
Blockly.Blocks['pwm'] = {
    init: function () {
        this.setColour(Blockly.Msg.PWM_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('set pwm ')
            .appendField(new Blockly.FieldVariable('pwm'), 'VAR')
            .appendField(' of pin ');
        this.appendValueInput('PIN');
    }
}
Blockly.Python['pwm'] = function (block) {
    var varname = block.getField('VAR').variable_.name || '';
    var pin = Blockly.Python.valueToCode(block, 'PIN', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return 'global ' + varname + '\n' + varname + ' = ' + 'machine.PWM(' + pin + ')\n';
}

Blockly.Blocks['pwm_freq'] = {
    init: function () {
        this.setColour(Blockly.Msg.PWM_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('set ')
            .appendField(new Blockly.FieldVariable('pwm'), 'VAR')
            .appendField(' freq to ')
        this.appendValueInput('VALUE');
    }
}
Blockly.Python['pwm_freq'] = function (block) {
    var varname = block.getField('VAR').variable_.name || '';
    var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return varname + '.freq(' + value + ')\n';
}

Blockly.Blocks['pwm_duty'] = {
    init: function () {
        this.setColour(Blockly.Msg.PWM_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('set ')
            .appendField(new Blockly.FieldVariable('pwm'), 'VAR')
            .appendField(' duty to ')
        this.appendValueInput('VALUE');
    }
}
Blockly.Python['pwm_duty'] = function (block) {
    var varname = block.getField('VAR').variable_.name || '';
    var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return varname + '.duty(' + value + ')\n';
}

/**
 * ADC
 */
Blockly.Blocks['adc'] = {
    init: function () {
        this.setColour(Blockly.Msg.ADC_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('set ')
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['A0', 'A0'],
                ['A1', 'A1'],
                ['A2', 'A2'],
                ['A3', 'A3'],
                ['A4', 'A4'],
                ['A5', 'A5'],
                ['A6', 'A6'],
                ['A7', 'A7']
            ]), 'VAR');
        this.appendDummyInput()
            .appendField(' = ')
        this.appendValueInput('PIN');

    }
}
Blockly.Python['adc'] = function (block) {
    var varname = block.getFieldValue('VAR') || '';
    var pin = Blockly.Python.valueToCode(block, 'PIN', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return varname + ' = machine.ADC(' + pin + ')\n' + varname + '.atten(' + varname + '.ATTN_11DB)\n';
}

Blockly.Blocks['adc_read'] = {
    init: function () {
        this.setColour(Blockly.Msg.ADC_HUE);

        this.setOutput(true);
        this.appendDummyInput()
            .appendField('Read ')
            .appendField(new Blockly.FieldDropdown([
                ['A0', 'A0'],
                ['A1', 'A1'],
                ['A2', 'A2'],
                ['A3', 'A3'],
                ['A4', 'A4'],
                ['A5', 'A5'],
                ['A6', 'A6'],
                ['A7', 'A7']
            ]), 'VAR');
    }
}
Blockly.Python['adc_read'] = function (block) {
    var varname = block.getFieldValue('VAR') || '';
    var code = varname + '.read()';
    return [code, Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['adc_read_var'] = {
    init: function () {
        this.setColour(Blockly.Msg.ADC_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('set ')
            .appendField(new Blockly.FieldVariable('item'), 'VAR')
            .appendField(' to ');
        this.appendValueInput('VALUE');
    }
}
Blockly.Python['adc_read_var'] = function (block) {
    var pin = Blockly.Python.statementToCode(block, 'VALUE', Blockly.Python.ORDER_FUNCTION_CALL) || '';
    var varname = block.getField('VAR').variable_.name || '';
    return varname + ' = ' + pin.trim() + '\n';
}

Blockly.Blocks['adc_width'] = {
    init: function () {
        this.setColour(Blockly.Msg.ADC_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('set ')
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['A0', 'A0'],
                ['A1', 'A1'],
                ['A2', 'A2'],
                ['A3', 'A3'],
                ['A4', 'A4'],
                ['A5', 'A5'],
                ['A6', 'A6'],
                ['A7', 'A7']
            ]), 'VAR');
        this.appendDummyInput()
            .appendField(' width ')
            .appendField(' = ')
            .appendField(new Blockly.FieldDropdown([
                ['9 bits', 'WIDTH_9BIT'],
                ['10 bits', 'WIDTH_10BIT'],
                ['11 bits', 'WIDTH_11BIT'],
                ['12 bits', 'WIDTH_12BIT']
            ]), 'WIDTH');
    }
}
Blockly.Python['adc_width'] = function (block) {
    var varname = block.getFieldValue('VAR') || '';
    var width = block.getFieldValue('WIDTH') || '';
    return varname + '.width(machine.ADC.' + width + ')\n';
}

/**
 * DAC
 */
Blockly.Blocks['dac'] = {
    init: function () {
        this.setColour(Blockly.Msg.DAC_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('set dac ')
            .appendField(new Blockly.FieldVariable('dac'), 'VAR')
            .appendField(' of pin ');
        this.appendValueInput('PIN');
    }
}
Blockly.Python['dac'] = function (block) {
    var varname = block.getField('VAR').variable_.name || '';
    var pin = Blockly.Python.valueToCode(block, 'PIN', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return 'global ' + varname + '\n' + varname + ' = machine.DAC(machine.Pin(' + pin + '))\n';
}

Blockly.Blocks['dac_write'] = {
    init: function () {
        this.setColour(Blockly.Msg.DAC_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendValueInput('VALUE')
            .appendField('Write ')
        this.appendDummyInput()
            .appendField('to dac ')
            .appendField(new Blockly.FieldVariable('dac'), 'VAR');
    }
}
Blockly.Python['dac_write'] = function (block) {
    var varname = block.getField('VAR').variable_.name || '';
    var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return varname + '.write(' + value + ')\n';
}


/**
 * UART
 */
Blockly.Blocks['uart'] = {
    init: function () {
        this.setColour(Blockly.Msg.UART_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('set Uart ')
            .appendField(new Blockly.FieldVariable('uart'), 'VAR');
        this.appendValueInput('TX')
            .appendField(' tx ');
        this.appendValueInput('RX')
            .appendField(' rx ');
        this.appendDummyInput()
            .appendField(' baud ')
            .appendField(new Blockly.FieldDropdown([['115200', '115200'], ['230400', '230400'], ['256000', '256000'], ['512000', '512000'], ['921600', '921600']]), 'BAUD');
    }
}
Blockly.Python['uart'] = function (block) {
    var varname = block.getField('VAR').variable_.name || '';
    var tx = Blockly.Python.valueToCode(block, 'TX', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var rx = Blockly.Python.valueToCode(block, 'RX', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var baud = block.getFieldValue('BAUD') || '';
    return 'global ' + varname + '\n' + varname + ' = machine.UART(1, tx=' + tx + ', rx=' + rx + ')\n' + varname + '.init(' + baud + ', bits=8, parity=None, stop=1)\n';
}

Blockly.Blocks['uart_read'] = {
    init: function () {
        this.setColour(Blockly.Msg.UART_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('read Uart ')
            .appendField(new Blockly.FieldVariable('uart'), 'VAR');
    }
}
Blockly.Python['uart_read'] = function (block) {
    var varname = block.getField('VAR').variable_.name || '';
    return varname + '.read()\n';
}

Blockly.Blocks['uart_read_characters'] = {
    init: function () {
        this.setColour(Blockly.Msg.UART_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('read Uart ')
            .appendField(new Blockly.FieldVariable('uart'), 'VAR');
        this.appendValueInput('NUM')
            .appendField(' characters');
    }
}
Blockly.Python['uart_read_characters'] = function (block) {
    var varname = block.getField('VAR').variable_.name || '';
    var num = Blockly.Python.valueToCode(block, 'NUM', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return varname + '.read(' + num + ')\n';
}

Blockly.Blocks['uart_readline'] = {
    init: function () {
        this.setColour(Blockly.Msg.UART_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('read a line of Uart ')
            .appendField(new Blockly.FieldVariable('uart'), 'VAR');
    }
}
Blockly.Python['uart_readline'] = function (block) {
    var varname = block.getField('VAR').variable_.name || '';
    return varname + '.readline()\n';
}

Blockly.Blocks['uart_readinto'] = {
    init: function () {
        this.setColour(Blockly.Msg.UART_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Uart ')
            .appendField(new Blockly.FieldVariable('uart'), 'VAR')
            .appendField(' read to ')
            .appendField(new Blockly.FieldVariable('buf'), 'VAR1');
    }
}
Blockly.Python['uart_readinto'] = function (block) {
    var varname = block.getField('VAR').variable_.name || '';
    var varname1 = block.getField('VAR1').variable_.name || '';
    return varname + '.readline(' + varname1 + ')';
}

Blockly.Blocks['uart_write'] = {
    init: function () {
        this.setColour(Blockly.Msg.UART_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendValueInput('VALUE')
            .appendField('write ');
        this.appendDummyInput()
            .appendField(' in ')
            .appendField(new Blockly.FieldVariable('uart'), 'VAR');
    }
}
Blockly.Python['uart_write'] = function (block) {
    var value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var varname = block.getField('VAR').variable_.name || '';
    return varname + '.write(' + value + ')\n';
}

// Servo
Blockly.Blocks['servo_init'] = {
    init: function () {
        this.setColour(Blockly.Msg.SERVO_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('set ')
            .appendField(new Blockly.FieldVariable('servo'), 'VAR');
        this.appendDummyInput()
            .appendField(' = pin ');
        this.appendValueInput('PIN');
    }
}
Blockly.Python['servo_init'] = function (block) {
    Blockly.addModule('servo');
    var varname = block.getField('VAR').variable_.name || '';
    var pin = Blockly.Python.valueToCode(block, 'PIN', Blockly.Python.ORDER_FUNCTION_CALL) || '1';
    return varname + ' = Servo(' + pin + ')\n';
}

Blockly.Blocks['servo_angle'] = {
    init: function () {
        this.setColour(Blockly.Msg.SERVO_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set ')
            .appendField(new Blockly.FieldDropdown([
                ['0', '0'],
                ['1', '1'],
                ['2', '2'],
                ['3', '3'],
                ['4', '4'],
                ['5', '5'],
                ['6', '6'],
                ['7', '7'],
                ['8', '8'],
                ['9', '9'],
                ['10', '10'],
                ['11', '11'],
            ]), 'INDEX')
            .appendField(' servo');

        this.appendDummyInput()
            .appendField('rotate ');
        this.appendValueInput('ANGLE');
    }
}
Blockly.Python['servo_angle'] = function (block) {
    Blockly.addModule('servo');
    var index = block.getFieldValue('INDEX') || '0';
    var angle = Blockly.Python.valueToCode(block, 'ANGLE', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return 'servo.write_angle(' + index + ', ' + angle + ')' + '\n';
}

Blockly.Blocks['servo_write'] = {
    init: function () {
        this.setColour(Blockly.Msg.SERVO_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set ')
            .appendField(new Blockly.FieldDropdown([
                ['0', '0'],
                ['1', '1'],
                ['2', '2'],
                ['3', '3'],
                ['4', '4'],
                ['5', '5'],
                ['6', '6'],
                ['7', '7'],
                ['8', '8'],
                ['9', '9'],
                ['10', '10'],
                ['11', '11'],
            ]), 'INDEX')
            .appendField(' servo');

        this.appendDummyInput()
            .appendField('write ');
        this.appendValueInput('TIME');
        this.appendDummyInput()
            .appendField(' μs');
    }
}
Blockly.Python['servo_write'] = function (block) {
    Blockly.addModule('servo');
    var index = block.getFieldValue('INDEX') || '0';
    var time = Blockly.Python.valueToCode(block, 'TIME', Blockly.Python.ORDER_FUNCTION_CALL) || '600';
    return 'servo.write_us(' + index + ', ' + time + ')' + '\n';
}

// NXT_MOTOR_HUE
Blockly.Blocks['nxt_init'] = {
    init: function () {
        this.setColour(Blockly.Msg.NXT_MOTOR_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['M1', 'M1'],
                ['M2', 'M2']
            ]), 'VAR');
        this.appendDummyInput()
            .appendField(' = port ');
        this.appendDummyInput('PORT')
            .appendField(new Blockly.FieldDropdown([
                ['1', '1'],
                ['2', '2']
            ]), 'PORT');
    }
}
Blockly.Python['nxt_init'] = function (block) {
    var varname = block.getFieldValue('VAR') || '';
    var port = block.getFieldValue('PORT') || '';

    Blockly.addModule('lego');
    Blockly.addDeclare(varname);

    return varname + ' = lego.NXT_Motor(port=' + port + ')\n';
}

Blockly.Blocks['nxt_set_pwm'] = {
    init: function () {
        this.setColour(Blockly.Msg.NXT_MOTOR_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set ')
            .appendField(new Blockly.FieldDropdown([
                ['M1', 'M1'],
                ['M2', 'M2']
            ]), 'VAR');
        this.appendDummyInput()
            .appendField(' rotate ')
            .appendField(new Blockly.FieldDropdown([
                ['CW', 'CW'],
                ['CCW', 'CCW']
            ]), 'ROTATE')
            .appendField(' speed ')
        this.appendValueInput('ANGLE');
    }
}
Blockly.Python['nxt_set_pwm'] = function (block) {
    Blockly.addModule('lego');
    var varname = block.getFieldValue('VAR') || '';
    var rotate = block.getFieldValue('ROTATE') || '';
    var angle = Blockly.Python.valueToCode(block, 'ANGLE', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    if (rotate == 'CCW' && angle != 0) angle = '-' + angle;
    return varname + '.set_pwm(' + angle + ')\n';
}

Blockly.Blocks['nxt_run'] = {
    init: function () {
        this.setColour(Blockly.Msg.NXT_MOTOR_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['M1', 'M1'],
                ['M2', 'M2']
            ]), 'VAR')
            .appendField(new Blockly.FieldDropdown([
                ['forward', 'forward'],
                ['backward', 'backward']
            ]), 'DIRECTION')
            .appendField(' run ');
        this.appendValueInput('DISTANCE');
        this.appendDummyInput()
            .appendField(' speed ');
        this.appendValueInput('SPEED');
    }
}
Blockly.Python['nxt_run'] = function (block) {
    Blockly.addModule('lego');
    var varname = block.getFieldValue('VAR') || '';
    var direction = block.getFieldValue('DIRECTION') || '';
    var distance = Blockly.Python.valueToCode(block, 'DISTANCE', Blockly.Python.ORDER_FUNCTION_CALL) || '500';
    var speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_FUNCTION_CALL) || '255';
    distance = direction == 'forward' ? distance : -distance;
    return varname + '.run_distance(' + distance + ', ' + speed + ')\n';
}

Blockly.Blocks['nxt_stop'] = {
    init: function () {
        this.setColour(Blockly.Msg.NXT_MOTOR_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Stop ')
            .appendField(new Blockly.FieldDropdown([
                ['M1', 'M1'],
                ['M2', 'M2']
            ]), 'VAR');
    }
}
Blockly.Python['nxt_stop'] = function (block) {
    Blockly.addModule('lego');
    var varname = block.getFieldValue('VAR') || '';
    return varname + '.stop()\n';
}

Blockly.Blocks['nxt_read_encoder'] = {
    init: function () {
        this.setColour(Blockly.Msg.NXT_MOTOR_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Read ')
            .appendField(new Blockly.FieldDropdown([
                ['M1', 'M1'],
                ['M2', 'M2']
            ]), 'VAR')
            .appendField(new Blockly.FieldLabel(' encode'));
    }
}
Blockly.Python['nxt_read_encoder'] = function (block) {
    Blockly.addModule('lego');
    var varname = block.getFieldValue('VAR') || '';
    var code = varname + '.read_encoder()';
    return [code, Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['rgb_init'] = {
    init: function () {
        this.setColour(Blockly.Msg.RGB_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Setup Rgb Bar');
    }
}
Blockly.Python['rgb_init'] = function (block) {
    Blockly.addModule('rgb');
    Blockly.addDeclare('rgb');
    return 'global rgb\nrgb = RGB_Bar()\n';
}

Blockly.Blocks['rgb_set_all'] = {
    init: function () {
        this.setColour(Blockly.Msg.RGB_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set Rgb Bar color ')
            .appendField(new Blockly.FieldColour('#ff0000'), 'COLOR');
    }
}
Blockly.Python['rgb_set_all'] = function (block) {
    Blockly.addModule('rgb');
    var color = block.getFieldValue('COLOR') || '#ff0000';
    return 'rgb.set_all(' + color.replace('#', '0x') + ')\n';
}

Blockly.Blocks['rgb_set_all_rgb'] = {
    init: function() {
        this.setColour(Blockly.Msg.RGB_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set Rgb Bar color by RGB'))
        this.appendValueInput('R')
            .appendField('red');
        this.appendValueInput('G')
            .appendField('green');
        this.appendValueInput('B')
            .appendField('blue');
    }
}
Blockly.Python['rgb_set_all_rgb'] = function(block) {
    Blockly.addModule('rgb');
    var r = Blockly.Python.valueToCode(block, 'R', Blockly.Python.ORDER_NONE) || '0';
    var g = Blockly.Python.valueToCode(block, 'G', Blockly.Python.ORDER_NONE) || '0';
    var b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_NONE) || '0';
    if(isNaN(parseInt(r)) || isNaN(parseInt(g)) || isNaN(parseInt(b))) {
        return "rgb.set_all(int('0x%02x%02x%02x' % (round(min(100, max(0, " + r +")) * 2.55), round(min(100, max(0, " + g +")) * 2.55), round(min(100, max(0, " + b +")) * 2.55))))\n";
    }
    var hexR = Math.floor(Math.abs(parseInt(r)) % 256).toString(16);
    var hexG = Math.floor(Math.abs(parseInt(g)) % 256).toString(16);
    var hexB = Math.floor(Math.abs(parseInt(b)) % 256).toString(16);
    if(hexR.length < 2) hexR = '0' + hexR;
    if(hexG.length < 2) hexG = '0' + hexG;
    if(hexB.length < 2) hexB = '0' + hexB;
    return 'rgb.set_all(0x' + hexR + hexG + hexB + ')\n';
}

Blockly.Blocks['rgb_set_dir'] = {
    init: function () {
        this.setColour(Blockly.Msg.RGB_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set ')
            .appendField(new Blockly.FieldDropdown([
                ['left', 'left'],
                ['right', 'right']
            ]), 'DIR')
            .appendField(' side Rgb Bar color ')
            .appendField(new Blockly.FieldColour('#ff0000'), 'COLOR');
    }
}
Blockly.Python['rgb_set_dir'] = function (block) {
    Blockly.addModule('rgb');
    var dir = block.getFieldValue('DIR') || 'left';
    var color = block.getFieldValue('COLOR') || '#ff0000';
    return 'rgb.set_dir("' + dir + '", ' + color.replace('#', '0x') + ')\n';
}

Blockly.Blocks['rgb_set_dir_rgb'] = {
    init: function() {
        this.setColour(Blockly.Msg.RGB_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabel('Set '))
            .appendField(new Blockly.FieldDropdown([
                ['left', 'left'],
                ['right', 'right']
            ]), 'DIR')
            .appendField(' side Rgb Bar color by RGB')
        this.appendValueInput('R')
            .appendField('red');
        this.appendValueInput('G')
            .appendField('green');
        this.appendValueInput('B')
            .appendField('blue');
    }
}
Blockly.Python['rgb_set_dir_rgb'] = function(block) {
    Blockly.addModule('rgb');
    var dir = block.getFieldValue('DIR') || 'left';
    var r = Blockly.Python.valueToCode(block, 'R', Blockly.Python.ORDER_NONE) || '0';
    var g = Blockly.Python.valueToCode(block, 'G', Blockly.Python.ORDER_NONE) || '0';
    var b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_NONE) || '0';
    if(isNaN(parseInt(r)) || isNaN(parseInt(g)) || isNaN(parseInt(b))) {
        return "rgb.set_dir('" + dir + "', int('0x%02x%02x%02x' % (round(min(100, max(0, " + r +")) * 2.55), round(min(100, max(0, " + g +")) * 2.55), round(min(100, max(0, " + b +")) * 2.55))))\n";
    }
    var hexR = Math.floor(Math.abs(parseInt(r)) % 256).toString(16);
    var hexG = Math.floor(Math.abs(parseInt(g)) % 256).toString(16);
    var hexB = Math.floor(Math.abs(parseInt(b)) % 256).toString(16);
    if(hexR.length < 2) hexR = '0' + hexR;
    if(hexG.length < 2) hexG = '0' + hexG;
    if(hexB.length < 2) hexB = '0' + hexB;
    return 'rgb.set_dir("' + dir + '", 0x' + hexR + hexG + hexB + ')\n';
}

Blockly.Blocks['rgb_set'] = {
    init: function () {
        this.setColour(Blockly.Msg.RGB_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set the ')
            .appendField(new Blockly.FieldDropdown([
                ['1st', '1'],
                ['2nd', '2'],
                ['3rd', '3'],
                ['4th', '4'],
                ['5th', '5'],
                ['6th', '6'],
                ['7th', '7'],
                ['8th', '8'],
                ['9th', '9'],
                ['10th', '10']
            ]), 'INDEX')
            .appendField(' Rgb color ')
            .appendField(new Blockly.FieldColour('#ff0000'), 'COLOR');
    }
}
Blockly.Python['rgb_set'] = function (block) {
    Blockly.addModule('rgb');
    var index = block.getFieldValue('INDEX') || '1';
    var color = block.getFieldValue('COLOR') || '#ff0000';
    return 'rgb.set(' + index + ', ' + color.replace('#', '0x') + ')\n';
}

Blockly.Blocks['rgb_set_rgb'] = {
    init: function () {
        this.setColour(Blockly.Msg.RGB_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set the ')
            .appendField(new Blockly.FieldDropdown([
                ['1st', '1'],
                ['2nd', '2'],
                ['3rd', '3'],
                ['4th', '4'],
                ['5th', '5'],
                ['6th', '6'],
                ['7th', '7'],
                ['8th', '8'],
                ['9th', '9'],
                ['10th', '10']
            ]), 'INDEX')
            .appendField(' Rgb color by RGB');
            this.appendValueInput('R')
                .appendField('red');
            this.appendValueInput('G')
                .appendField('green');
            this.appendValueInput('B')
                .appendField('blue');
            
    }
}
Blockly.Python['rgb_set_rgb'] = function (block) {
    Blockly.addModule('rgb');
    var index = block.getFieldValue('INDEX') || '1';
    var r = Blockly.Python.valueToCode(block, 'R', Blockly.Python.ORDER_NONE) || '0';
    var g = Blockly.Python.valueToCode(block, 'G', Blockly.Python.ORDER_NONE) || '0';
    var b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_NONE) || '0';
    if(isNaN(parseInt(r)) || isNaN(parseInt(g)) || isNaN(parseInt(b))) {
        return "rgb.set(" + index + ", int('0x%02x%02x%02x' % (round(min(100, max(0, " + r +")) * 2.55), round(min(100, max(0, " + g +")) * 2.55), round(min(100, max(0, " + b +")) * 2.55))))\n";
    }
    var hexR = Math.floor(Math.abs(parseInt(r)) % 256).toString(16);
    var hexG = Math.floor(Math.abs(parseInt(g)) % 256).toString(16);
    var hexB = Math.floor(Math.abs(parseInt(b)) % 256).toString(16);
    if(hexR.length < 2) hexR = '0' + hexR;
    if(hexG.length < 2) hexG = '0' + hexG;
    if(hexB.length < 2) hexB = '0' + hexB;
    return 'rgb.set(' + index + ', 0x' + hexR + hexG + hexB + ')\n';
}

Blockly.Blocks['rgb_set_brightness'] = {
    init: function() {
        this.setColour(Blockly.Msg.RGB_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set rgb');

        this.appendValueInput('BRIGHTNESS')
            .appendField('brightness');
    }
}
Blockly.Python['rgb_set_brightness'] = function(block) {
    Blockly.addModule('rgb');
    var brightness = Blockly.Python.valueToCode(block, 'BRIGHTNESS', Blockly.Python.ORDER_FUNCTION_CALL) || '10';
    return 'rgb.setBrightness(' + brightness + ')\n';
}

Blockly.Blocks['dht12_init'] = {
    init: function () {
        this.setColour(Blockly.Msg.DHT_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Setup DHT Module');
    }
}
Blockly.Python['dht12_init'] = function (block) {
    Blockly.addModule('env');
    Blockly.addDeclare('dht');
    return 'global dht\ndht = DHT12()\n';
}

Blockly.Blocks['dht12_pressure'] = {
    init: function () {
        this.setColour(Blockly.Msg.DHT_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get ')
            .appendField(new Blockly.FieldDropdown(this.getAllEnv), 'VARNAME')
            .appendField(' Pressure');
    },
    getAllEnv: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'ENV') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['dht12_pressure'] = function (block) {
    // Blockly.addModule('env');
    var varname = block.getFieldValue('VARNAME');
    return [varname + '.pressure()', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['dht12_get_temperature'] = {
    init: function () {
        this.setColour(Blockly.Msg.DHT_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get ')
            .appendField(new Blockly.FieldDropdown(this.getAllEnv), 'VARNAME')
            .appendField(' Temperature');
    },
    getAllEnv: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'ENV') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['dht12_get_temperature'] = function (block) {
    // Blockly.addModule('env');
    var varname = block.getFieldValue('VARNAME');
    return [varname + '.temperature()', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['dht12_get_humidity'] = {
    init: function () {
        this.setColour(Blockly.Msg.DHT_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get ')
            .appendField(new Blockly.FieldDropdown(this.getAllEnv), 'VARNAME')
            .appendField(' Humidity');
    },
    getAllEnv: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'ENV') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['dht12_get_humidity'] = function (block) {
    // Blockly.addModule('env');
    var varname = block.getFieldValue('VARNAME');
    return [varname + '.humidity()', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['angle_read'] = {
    init: function() {
        this.setColour(Blockly.Msg.PINS_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get ')
            .appendField(new Blockly.FieldDropdown(this.getAllAngle), 'VARNAME')
            .appendField(' angle');
    },
    getAllAngle: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Angle') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['angle_read'] = function (block) {
    var varname = block.getFieldValue('VARNAME');
    return [varname + '.read()', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['pir_read'] = {
    init: function() {
        this.setColour(Blockly.Msg.SERVO_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get ')
            .appendField(new Blockly.FieldDropdown(this.getAllPIR), 'VARNAME')
            .appendField(' status');
    },
    getAllPIR: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'PIR') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['pir_read'] = function (block) {
    var varname = block.getFieldValue('VARNAME');
    return [varname + '.read()', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['basic_on_setup'] = {
    init: function () {
        this.setColour(Blockly.Msg.BASIC_HUE);
        this.setNextStatement(true);

        this.setDeletable(false);

        this.appendDummyInput()
            .appendField('Setup');
    }
}
Blockly.Python['basic_on_setup'] = function (block) {
    return '# Define Event\n';
}

Blockly.Blocks['basic_on_loop'] = {
    init: function () {
        this.setColour(Blockly.Msg.BASIC_HUE);
        this.setPreviousStatement(true);

        this.appendDummyInput()
            .appendField('Loop');
        this.appendStatementInput('LOOP');
    }
}
Blockly.Python['basic_on_loop'] = function (block) {
    var func = Blockly.Python.statementToCode(block, 'LOOP') || '';
    return 'while True:\n' + func + '  wait(0.001)\n';
    // return 'while True:\n' + func + '  if _thread.wait(20) == _thread.EXIT: raise OSError\n';
}

/**
 * Button
 */
Blockly.Blocks['button_callback'] = {
    init: function () {
        this.setColour(Blockly.Msg.BASIC_HUE);

        this.appendDummyInput()
            .appendField('Button')
            .appendField(new Blockly.FieldDropdown([['A', 'A'], ['B', 'B'], ['C', 'C']]), 'BUTTON')
            .appendField(' ')
            .appendField(new Blockly.FieldDropdown([['pressed', 'wasPressed'], ['released', 'wasReleased']]), 'EVENT');
        this.appendStatementInput('FUNC');
    }
}
Blockly.Python['button_callback'] = function (block) {
    var events = {
        'wasPressed': 'pressed',
        'wasReleased': 'released'
    };
    var button = block.getFieldValue('BUTTON') || 'A';
    var event = block.getFieldValue('EVENT') || 'wasPressed';
    var func = Blockly.Python.statementToCode(block, 'FUNC', Blockly.Python.ORDER_FUNCTION_CALL) || '';
    var globalList = Blockly.defineGlobal();
    var code = 'def button' + button + '_' + events[event] + '():\n' + func + '  pass';
    if (globalList.length > 0) {
        // code = 'def button' + button + '_' + events[event] +'():\n  global ' + globalList.join(', ') + '\n' + func + '  pass';
        code = 'def button' + button + '_' + events[event] + '():\n  # global params\n' + func + '  pass';
    }
    code = 'def button' + button + '_' + events[event] + '():\n  # global params\n' + func + '  pass';
    Blockly.addButtonEvent({
        id: block.id,
        event: 'button' + button + '.' + event + '(callback=button' + button + '_' + events[event] + ')'
    });

    return [code, Blockly.Python.ORDER_MEMBER];
}

Blockly.Blocks['button_for_callback'] = {
    init: function () {
        this.setColour(Blockly.Msg.BASIC_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('button')
            .appendField(new Blockly.FieldDropdown([['A', 'A'], ['B', 'B'], ['C', 'C']]), 'BUTTON')
            .appendField(' ')
            .appendField(new Blockly.FieldDropdown([['released for', 'releasedFor']]), 'EVENT')
        this.appendValueInput('DURATION');
        this.appendDummyInput()
            .appendField('s');
        this.appendDummyInput()
            .appendField(' to ')
            .appendField(new Blockly.FieldTextInput(''), 'FUNC');
    }
}
Blockly.Python['button_for_callback'] = function (block) {
    var button = block.getFieldValue('BUTTON') || 'A';
    var event = block.getFieldValue('EVENT') || 'wasPressed';
    var func = block.getFieldValue('FUNC') || 'None';
    var duration = Blockly.Python.valueToCode(block, 'DURATION', Blockly.Python.ORDER_FUNCTION_CALL) || '';
    var code = 'button' + button + '.' + event + '(' + duration + ', callback=' + func + ')\n';
    return code;
}

Blockly.Blocks['button_state'] = {
    init: function () {
        this.setColour(Blockly.Msg.BASIC_HUE);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('button')
            .appendField(new Blockly.FieldDropdown([['A', 'A'], ['B', 'B'], ['C', 'C']]), 'BUTTON')
            .appendField(' ')
            .appendField(new Blockly.FieldDropdown([['pressed', 'wasPressed'], ['released', 'wasReleased']]), 'EVENT')
    }
}
Blockly.Python['button_state'] = function (block) {
    var button = block.getFieldValue('BUTTON') || 'A';
    var event = block.getFieldValue('EVENT') || 'wasPressed';
    var code = 'button' + button + '.' + event + '()';
    return [code, Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['button_state_for'] = {
    init: function () {
        this.setColour(Blockly.Msg.BASIC_HUE);
        this.setOutput(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('button')
            .appendField(new Blockly.FieldDropdown([['A', 'A'], ['B', 'B'], ['C', 'C']]), 'BUTTON')
            .appendField(' ')
            .appendField(new Blockly.FieldDropdown([['pressed for', 'pressedFor'], ['released for', 'releasedFor']]), 'EVENT')
        this.appendValueInput('DURATION');
        this.appendDummyInput()
            .appendField('s');
    }
}
Blockly.Python['button_state_for'] = function (block) {
    var button = block.getFieldValue('BUTTON') || 'A';
    var event = block.getFieldValue('EVENT') || 'wasPressed';
    var duration = Blockly.Python.valueToCode(block, 'DURATION', Blockly.Python.ORDER_FUNCTION_CALL) || '';
    var code = 'button' + button + '.' + event + '(' + duration + ')';
    return [code, Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['remote_set_qrcode'] = {
    init: function () {
        this.setColour(Blockly.Msg.REMOTE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Remote qrcode show in ')
        this.appendValueInput('X')
            .appendField('x ')
        this.appendValueInput('Y')
            .appendField('y ')
        this.appendValueInput('SIZE')
            .appendField(' size ')
    }
}
Blockly.Python['remote_set_qrcode'] = function (block) {
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '72';
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '32';
    var size = Blockly.Python.valueToCode(block, 'SIZE', Blockly.Python.ORDER_FUNCTION_CALL) || '176';
    // var remoteURL = 'http://flow-remote.m5stack.com/';
    var dataObj = [];
    for (var i = 0; i < Blockly.Remotes.length; i++) {
        dataObj.push({
            name: Blockly.Remotes[i].name,
            event: Blockly.Remotes[i].event,
            type: Blockly.Remotes[i].type
        });
    }
    var dataStr = JSON.stringify({
        id: localStorage.getItem('mui_apikey'),
        data: dataObj
    });
    return 'lcd.qrcode(\'' + window['remoteURL'] + '?remote=' + Blockly.REMOTE_KEY + '\', ' + x + ', ' + y + ', ' + size + ')\n';
}

Blockly.Blocks['remote_add_button'] = {
    init: function () {
        this.setColour(Blockly.Msg.REMOTE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.appendDummyInput()
            .appendField('Add Remote Button ')
            .appendField(new Blockly.FieldTextInput('ButtonName'), 'NAME')
            .appendField('to do ');
        this.appendStatementInput('FUNC');
    }
}
Blockly.Python['remote_add_button'] = function (block) {
    var name = block.getFieldValue('NAME') || 'ButtonName';
    var func = block.getFieldValue('NAME') || 'ButtonName';
    func = func.replace(/ /g, '_');
    func = '_remote_' + func;
    var data = Blockly.Python.statementToCode(block, 'FUNC', Blockly.Python.ORDER_FUNCTION_CALL) || '  pass';
    var globalList = Blockly.defineGlobal();
    var code = 'def ' + func + '():\n' + data;
    if (globalList.length > 0) {
        code = 'def ' + func + '():\n  # global params \n' + data;
    }
    code = 'def ' + func + '():\n  # global params \n' + data;
    Blockly.addRemote({
        id: block.id,
        event: func,
        code: code,
        name: name,
        type: 'button'
    });

    return '';
}

Blockly.Blocks['remote_add_label'] = {
    init: function () {
        this.setColour(Blockly.Msg.REMOTE_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Add Remote Label ')
            .appendField(new Blockly.FieldTextInput('LabelName'), 'NAME')
            .appendField('to show ');
        this.appendValueInput('DATA');
    }
}
Blockly.Python['remote_add_label'] = function (block) {
    var name = block.getFieldValue('NAME') || 'LabelName';
    var func = block.getFieldValue('NAME') || 'LabelName';
    func = func.replace(/ /g, '_');
    func = '_remote_' + func;
    var data = Blockly.Python.valueToCode(block, 'DATA', Blockly.Python.ORDER_NONE) || '';
    var globalList = Blockly.defineGlobal();
    var code = 'def ' + func + '():\n  return ' + data;
    if (globalList.length > 0) {
        // code = 'def ' + func + '():\n  global ' + globalList.join(', ') + '\n  return ' + data;
        code = 'def ' + func + '():\n  # global params\n  return ' + data;
    }
    code = 'def ' + func + '():\n  # global params\n  return ' + data;
    Blockly.addRemote({
        id: block.id,
        event: func,
        code: code,
        name: name,
        type: 'label'
    });

    return '';
}

Blockly.Blocks['remote_add_switch'] = {
    init: function(){
        this.appendDummyInput()
            .appendField('Add Remote Switch Button')
            .appendField(new Blockly.FieldTextInput('SwitchName'), "NAME")
            .appendField("", "PARAMS");
        this.setMutator(new Blockly.Mutator(["procedures_mutatorarg"]));
        (this.workspace.options.comments || this.workspace.options.parentWorkspace && this.workspace.options.parentWorkspace.options.comments ) && Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT && this.setCommentText(Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT);
        this.setColour(Blockly.Msg.REMOTE_HUE);
        this.setTooltip(Blockly.Msg.PROCEDURES_DEFNORETURN_TOOLTIP);
        this.setHelpUrl(Blockly.Msg.PROCEDURES_DEFNORETURN_HELPURL);
        this.arguments_=[];
        this.argumentVarModels_=[];
        this.setStatements_(!0);
        this.statementConnection_=null
    },
    setStatements_: Blockly.Blocks['procedures_defnoreturn'].setStatements_,
    updateParams_: Blockly.Blocks['procedures_defnoreturn'].updateParams_,
    mutationToDom: Blockly.Blocks['procedures_defnoreturn'].mutationToDom,
    domToMutation: Blockly.Blocks['procedures_defnoreturn'].domToMutation,
    decompose: Blockly.Blocks['procedures_defnoreturn'].decompose,
    compose: Blockly.Blocks['procedures_defnoreturn'].compose,
    getProcedureDef: function() {
        if(this.type == 'remote_add_switch') return [this.getFieldValue('NAME'), this.arguments_, false, false];
        return [this.getFieldValue('NAME'), this.arguments_, false];
    },
    getVars: Blockly.Blocks['procedures_defnoreturn'].getVars,
    getVarModels: Blockly.Blocks['procedures_defnoreturn'].getVarModels,
    renameVarById: Blockly.Blocks['procedures_defnoreturn'].renameVarById,
    updateVarName: Blockly.Blocks['procedures_defnoreturn'].updateVarName,
    displayRenamedVar_: Blockly.Blocks['procedures_defnoreturn'].displayRenamedVar_,
    customContextMenu: Blockly.Blocks['procedures_defnoreturn'].customContextMenu
}
Blockly.Python['remote_add_switch'] = function(block) {
    var name = block.getFieldValue('NAME') || 'SwitchName';
    var func = block.getFieldValue('NAME') || 'SwitchName';
    var params = block.getFieldValue('PARAMS').replace(/with: /g, '') || '';
    func = func.replace(/ /g, '_');
    func = '_remote_' + func;
    var data = Blockly.Python.statementToCode(block, 'STACK', Blockly.Python.ORDER_FUNCTION_CALL) || '  pass';
    var unitVarnames = Blockly.Units.map(u => u['varname']);
    var defFuncs = window["Blockly"].Procedures.allProcedures(window["BlocklyEditor"])[0].concat(window["Blockly"].Procedures.allProcedures(window["BlocklyEditor"])[1]).filter(f => f[3] != false).map(f => f[0]);
    var defGlobal = Blockly.defineGlobal().concat(unitVarnames).concat(defFuncs);
    var paramList = params.split(', ');
    for(var i = 0; i < defGlobal.length; i++) {
        if(paramList.indexOf(defGlobal[i]) > -1) {
            defGlobal.splice(i, 1);
            i--;
        }
    }
    var code = 'def ' + func + '(' + params + '):\n' + data;
    if (defGlobal.length > 0) {
        code = 'def ' + func + '(' + params + '):\n  global ' + defGlobal.join(', ') + ' \n' + data;
    } else {
        code = 'def ' + func + '(' + params + '):\n' + data;
    }
    Blockly.addRemote({
        id: block.id,
        event: func,
        code: code,
        name: name,
        type: 'switch'
    });

    return '';
}

Blockly.Blocks['remote_add_button'] = {
    init: function(){
        this.appendDummyInput()
            .appendField('Add Remote Button')
            .appendField(new Blockly.FieldTextInput('ButtonName'), "NAME")
            .appendField("", "PARAMS");
        this.setMutator(new Blockly.Mutator(["procedures_mutatorarg"]));
        (this.workspace.options.comments || this.workspace.options.parentWorkspace && this.workspace.options.parentWorkspace.options.comments ) && Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT && this.setCommentText(Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT);
        this.setColour(Blockly.Msg.REMOTE_HUE);
        this.setTooltip(Blockly.Msg.PROCEDURES_DEFNORETURN_TOOLTIP);
        this.setHelpUrl(Blockly.Msg.PROCEDURES_DEFNORETURN_HELPURL);
        this.arguments_=[];
        this.argumentVarModels_=[];
        this.setStatements_(!0);
        this.statementConnection_=null
    },
    setStatements_: Blockly.Blocks['procedures_defnoreturn'].setStatements_,
    updateParams_: Blockly.Blocks['procedures_defnoreturn'].updateParams_,
    mutationToDom: Blockly.Blocks['procedures_defnoreturn'].mutationToDom,
    domToMutation: Blockly.Blocks['procedures_defnoreturn'].domToMutation,
    decompose: Blockly.Blocks['procedures_defnoreturn'].decompose,
    compose: Blockly.Blocks['procedures_defnoreturn'].compose,
    getProcedureDef: function() {
        if(this.type == 'remote_add_button') return [this.getFieldValue('NAME'), this.arguments_, false, false];
        return [this.getFieldValue('NAME'), this.arguments_, false];
    },
    getVars: Blockly.Blocks['procedures_defnoreturn'].getVars,
    getVarModels: Blockly.Blocks['procedures_defnoreturn'].getVarModels,
    renameVarById: Blockly.Blocks['procedures_defnoreturn'].renameVarById,
    updateVarName: Blockly.Blocks['procedures_defnoreturn'].updateVarName,
    displayRenamedVar_: Blockly.Blocks['procedures_defnoreturn'].displayRenamedVar_,
    customContextMenu: Blockly.Blocks['procedures_defnoreturn'].customContextMenu
}
Blockly.Python['remote_add_button'] = function(block) {
    var name = block.getFieldValue('NAME') || 'ButtonName';
    var func = block.getFieldValue('NAME') || 'ButtonName';
    var params = block.getFieldValue('PARAMS').replace(/with: /g, '') || '';
    func = func.replace(/ /g, '_');
    func = '_remote_' + func;
    var data = Blockly.Python.statementToCode(block, 'STACK', Blockly.Python.ORDER_FUNCTION_CALL) || '  pass';
    var unitVarnames = Blockly.Units.map(u => u['varname']);
    var defFuncs = window["Blockly"].Procedures.allProcedures(window["BlocklyEditor"])[0].concat(window["Blockly"].Procedures.allProcedures(window["BlocklyEditor"])[1]).filter(f => f[3] != false).map(f => f[0]);
    var defGlobal = Blockly.defineGlobal().concat(unitVarnames).concat(defFuncs);
    var paramList = params.split(', ');
    for(var i = 0; i < defGlobal.length; i++) {
        if(paramList.indexOf(defGlobal[i]) > -1) {
            defGlobal.splice(i, 1);
            i--;
        }
    }
    var code = 'def ' + func + '(' + params + '):\n' + data;
    if (defGlobal.length > 0) {
        code = 'def ' + func + '(' + params + '):\n  global ' + defGlobal.join(', ') + ' \n' + data;
    } else {
        code = 'def ' + func + '(' + params + '):\n' + data;
    }
    Blockly.addRemote({
        id: block.id,
        event: func,
        code: code,
        name: name,
        type: 'button'
    });

    return '';
}

Blockly.Blocks['remote_add_slider'] = {
    init: function(){
        this.appendDummyInput()
            .appendField('Add Remote Slider')
            .appendField(new Blockly.FieldTextInput('SliderName'), "NAME")
            .appendField("", "PARAMS");
        this.setMutator(new Blockly.Mutator(["procedures_mutatorarg"]));
        (this.workspace.options.comments || this.workspace.options.parentWorkspace && this.workspace.options.parentWorkspace.options.comments ) && Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT && this.setCommentText(Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT);
        this.setColour(Blockly.Msg.REMOTE_HUE);
        this.setTooltip(Blockly.Msg.PROCEDURES_DEFNORETURN_TOOLTIP);
        this.setHelpUrl(Blockly.Msg.PROCEDURES_DEFNORETURN_HELPURL);
        this.arguments_=[];
        this.argumentVarModels_=[];
        this.setStatements_(!0);
        this.statementConnection_=null
    },
    setStatements_: Blockly.Blocks['procedures_defnoreturn'].setStatements_,
    updateParams_: Blockly.Blocks['procedures_defnoreturn'].updateParams_,
    mutationToDom: Blockly.Blocks['procedures_defnoreturn'].mutationToDom,
    domToMutation: Blockly.Blocks['procedures_defnoreturn'].domToMutation,
    decompose: Blockly.Blocks['procedures_defnoreturn'].decompose,
    compose: Blockly.Blocks['procedures_defnoreturn'].compose,
    getProcedureDef: function() {
        if(this.type == 'remote_add_slider') return [this.getFieldValue('NAME'), this.arguments_, false, false];
        return [this.getFieldValue('NAME'), this.arguments_, false];
    },
    getVars: Blockly.Blocks['procedures_defnoreturn'].getVars,
    getVarModels: Blockly.Blocks['procedures_defnoreturn'].getVarModels,
    renameVarById: Blockly.Blocks['procedures_defnoreturn'].renameVarById,
    updateVarName: Blockly.Blocks['procedures_defnoreturn'].updateVarName,
    displayRenamedVar_: Blockly.Blocks['procedures_defnoreturn'].displayRenamedVar_,
    customContextMenu: Blockly.Blocks['procedures_defnoreturn'].customContextMenu
}
Blockly.Python['remote_add_slider'] = function(block) {
    var name = block.getFieldValue('NAME') || 'SliderName';
    var func = block.getFieldValue('NAME') || 'SliderName';
    var params = block.getFieldValue('PARAMS').replace(/with: /g, '') || '';
    func = func.replace(/ /g, '_');
    func = '_remote_' + func;
    var data = Blockly.Python.statementToCode(block, 'STACK', Blockly.Python.ORDER_FUNCTION_CALL) || '  pass';
    var unitVarnames = Blockly.Units.map(u => u['varname']);
    var defFuncs = window["Blockly"].Procedures.allProcedures(window["BlocklyEditor"])[0].concat(window["Blockly"].Procedures.allProcedures(window["BlocklyEditor"])[1]).filter(f => f[3] != false).map(f => f[0]);
    var defGlobal = Blockly.defineGlobal().concat(unitVarnames).concat(defFuncs);
    var paramList = params.split(', ');
    for(var i = 0; i < defGlobal.length; i++) {
        if(paramList.indexOf(defGlobal[i]) > -1) {
            defGlobal.splice(i, 1);
            i--;
        }
    }
    var code = 'def ' + func + '(' + params + '):\n' + data;
    if (defGlobal.length > 0) {
        code = 'def ' + func + '(' + params + '):\n  global ' + defGlobal.join(', ') + ' \n' + data;
    } else {
        code = 'def ' + func + '(' + params + '):\n' + data;
    }
    Blockly.addRemote({
        id: block.id,
        event: func,
        code: code,
        name: name,
        type: 'slider'
    });

    return '';
}

Blockly.Blocks['remote_add_label'] = {
    init: function(){
        this.appendDummyInput()
            .appendField('Add Remote ')
            .appendField(new Blockly.FieldDropdown([
                ['Others', 'Others'],
                ['Temperature', 'Temperature'],
                ['Humidity', 'Humidity'],
                ['Pressure', 'Pressure'],
                ['PIR Status', 'PIR Status'],
                ['Angle', 'Angle'],
                ['Weight', 'Weight']
            ]), 'TYPE')
            .appendField(' Label ')
            .appendField(new Blockly.FieldTextInput('LabelName'), "NAME")
            .appendField("", "PARAMS");
        this.appendValueInput('RETURN')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(Blockly.Msg['PROCEDURES_DEFRETURN_RETURN']);
        this.setMutator(new Blockly.Mutator(["procedures_mutatorarg"]));
        (this.workspace.options.comments || this.workspace.options.parentWorkspace && this.workspace.options.parentWorkspace.options.comments ) && Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT && this.setCommentText(Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT);
        this.setColour(Blockly.Msg.REMOTE_HUE);
        this.setTooltip(Blockly.Msg.PROCEDURES_DEFNORETURN_TOOLTIP);
        this.setHelpUrl(Blockly.Msg.PROCEDURES_DEFNORETURN_HELPURL);
        this.arguments_=[];
        this.argumentVarModels_=[];
        this.setStatements_(!0);
        this.statementConnection_=null
    },
    setStatements_: Blockly.Blocks['procedures_defreturn'].setStatements_,
    updateParams_: Blockly.Blocks['procedures_defreturn'].updateParams_,
    mutationToDom: Blockly.Blocks['procedures_defreturn'].mutationToDom,
    domToMutation: Blockly.Blocks['procedures_defreturn'].domToMutation,
    decompose: Blockly.Blocks['procedures_defreturn'].decompose,
    compose: Blockly.Blocks['procedures_defreturn'].compose,
    getProcedureDef: function() {
        if(this.type == 'remote_add_label') return [this.getFieldValue('NAME'), this.arguments_, true, false];
        return [this.getFieldValue('NAME'), this.arguments_, true];
    },
    getVars: Blockly.Blocks['procedures_defreturn'].getVars,
    getVarModels: Blockly.Blocks['procedures_defreturn'].getVarModels,
    renameVarById: Blockly.Blocks['procedures_defreturn'].renameVarById,
    updateVarName: Blockly.Blocks['procedures_defreturn'].updateVarName,
    displayRenamedVar_: Blockly.Blocks['procedures_defreturn'].displayRenamedVar_,
    customContextMenu: Blockly.Blocks['procedures_defreturn'].customContextMenu
}
Blockly.Python['remote_add_label'] = function(block) {
    var name = block.getFieldValue('NAME') || 'LabelName';
    var func = block.getFieldValue('NAME') || 'LabelName';
    var params = block.getFieldValue('PARAMS').replace(/with: /g, '') || '';
    var icon = block.getFieldValue('TYPE') || 'Others';
    func = func.replace(/ /g, '_');
    func = '_remote_' + func;
    var data = Blockly.Python.statementToCode(block, 'STACK', Blockly.Python.ORDER_FUNCTION_CALL) || '';
    var returnValue = Blockly.Python.valueToCode(block, 'RETURN', Blockly.Python.ORDER_NONE) || '';
    var unitVarnames = Blockly.Units.map(u => u['varname']);
    var defFuncs = window["Blockly"].Procedures.allProcedures(window["BlocklyEditor"])[0].concat(window["Blockly"].Procedures.allProcedures(window["BlocklyEditor"])[1]).filter(f => f[3] != false).map(f => f[0]);
    var defGlobal = Blockly.defineGlobal().concat(unitVarnames).concat(defFuncs);
    var paramList = params.split(', ');
    for(var i = 0; i < defGlobal.length; i++) {
        if(paramList.indexOf(defGlobal[i]) > -1) {
            defGlobal.splice(i, 1);
            i--;
        }
    }
    var code = 'def ' + func + '(' + params + '):\n' + data;
    var returnCode = '';
    if(returnValue !== '') returnCode = '  return ' + returnValue;
    else returnCode = '  pass';
    if (defGlobal.length > 0) {
        code = 'def ' + func + '(' + params + '):\n  global ' + defGlobal.join(', ') + ' \n' + data + returnCode;
    } else {
        code = 'def ' + func + '(' + params + '):\n' + data + returnCode;
    }
    Blockly.addRemote({
        id: block.id,
        event: func,
        code: code,
        name: name,
        type: 'label',
        icon: icon
    });

    return '';
}

Blockly.Blocks['emoji_show'] = {
    init: function () {
        this.setColour(Blockly.Msg.EMOJI_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(false);

        this.appendDummyInput()
            .appendField('Set emoji map in ')
            .appendField(new Blockly.FieldColour('#FF0000'), 'COLOR');
        for (var i = 0; i < 7; i++) {
            var line = this.appendDummyInput();
            for (var j = 0; j < 7; j++) {
                line.appendField(new Blockly.FieldCheckbox('FALSE'), 'MAP_' + i + '_' + j);
            }
        }
    }
}
Blockly.Python['emoji_show'] = function (block) {
    Blockly.addModule('emoji');
    var color = block.getFieldValue('COLOR') || '#FF0000';
    var map = [];
    for (var i = 0; i < 7; i++) {
        var line = [];
        for (var j = 0; j < 7; j++) {
            line.push(block.getFieldValue('MAP_' + i + '_' + j));
        }
        map.push(line);
    }
    return 'emoji.show_map(' + JSON.stringify(map).replace(/TRUE/g, 1).replace(/FALSE/g, 0).replace(/"/g, '') + ', ' + color.replace('#', '0x') + ')\n';
}

Blockly.Blocks['emoji_set_single'] = {
    init: function () {
        this.setColour(Blockly.Msg.EMOJI_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set line ')
            .appendField(new Blockly.FieldDropdown([
                ['1', '0'],
                ['2', '1'],
                ['3', '2'],
                ['4', '3'],
                ['5', '4'],
                ['6', '5'],
                ['7', '6']
            ]), 'LINE')
            .appendField(' row ')
            .appendField(new Blockly.FieldDropdown([
                ['1', '0'],
                ['2', '1'],
                ['3', '2'],
                ['4', '3'],
                ['5', '4'],
                ['6', '5'],
                ['7', '6']
            ]), 'ROW')
            .appendField(' in ')
            .appendField(new Blockly.FieldColour('#FF0000'), 'COLOR');
    }
}
Blockly.Python['emoji_set_single'] = function (block) {
    Blockly.addModule('emoji');
    var color = block.getFieldValue('COLOR') || '#FF0000';
    var line = block.getFieldValue('LINE') || '1';
    var row = block.getFieldValue('ROW') || '1';
    return 'emoji.draw_square(' + row + ', ' + line + ', ' + color.replace('#', '0x') + ')\n';
}

Blockly.Blocks['lego_register_motor'] = {
    init: function () {
        this.setColour(Blockly.Msg.NXT_MOTOR_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['LegoM1', 'LegoM1'],
                ['LegoM2', 'LegoM2'],
                ['LegoM3', 'LegoM3'],
                ['LegoM4', 'LegoM4']
            ]), 'VAR');
        this.appendDummyInput()
            .appendField(' = port ');
        this.appendDummyInput('PORT')
            .appendField(new Blockly.FieldDropdown([
                ['1', '1'],
                ['2', '2'],
                ['3', '3'],
                ['4', '4']
            ]), 'PORT');
    }
}
Blockly.Python['lego_register_motor'] = function (block) {
    var varname = block.getFieldValue('VAR') || '';
    var port = block.getFieldValue('PORT') || '';
    Blockly.addModule('lego_motor');
    Blockly.addDeclare(varname);
    // return 'global ' + varname + '\n' + varname + ' = lego_board.NXT_Motor(port=' + port + ')\n';
    // return varname + ' = lego_board.NXT_Motor(port=' + port + ')\n';
    return varname + ' = motor.register(' + port + ')\n';
}

Blockly.Blocks['lego_set_pwm'] = {
    init: function () {
        this.setColour(Blockly.Msg.NXT_MOTOR_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set ')
            .appendField(new Blockly.FieldDropdown([
                ['LegoM1', 'LegoM1'],
                ['LegoM2', 'LegoM2'],
                ['LegoM3', 'LegoM3'],
                ['LegoM4', 'LegoM4']
            ]), 'VAR');
        this.appendDummyInput()
            .appendField(' rotate ')
            .appendField(new Blockly.FieldDropdown([
                ['CW', 'CW'],
                ['CCW', 'CCW']
            ]), 'ROTATE')
            .appendField(' pwm ')
        this.appendValueInput('PWM');
    }
}
Blockly.Python['lego_set_pwm'] = function (block) {
    Blockly.addModule('lego_motor');
    var varname = block.getFieldValue('VAR') || '';
    var rotate = block.getFieldValue('ROTATE') || '';
    var pwm = Blockly.Python.valueToCode(block, 'PWM', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    if (rotate == 'CCW' && pwm != 0) pwm = '-' + pwm;
    return varname + '.set_pwm(' + pwm + ')\n';
}

Blockly.Blocks['lego_set_speed'] = {
    init: function () {
        this.setColour(Blockly.Msg.NXT_MOTOR_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set ')
            .appendField(new Blockly.FieldDropdown([
                ['LegoM1', 'LegoM1'],
                ['LegoM2', 'LegoM2'],
                ['LegoM3', 'LegoM3'],
                ['LegoM4', 'LegoM4']
            ]), 'VAR');
        this.appendDummyInput()
            .appendField(' rotate ')
            .appendField(new Blockly.FieldDropdown([
                ['CW', 'CW'],
                ['CCW', 'CCW']
            ]), 'ROTATE')
            .appendField(' speed ')

        this.appendValueInput('SPEED');
    }
}
Blockly.Python['lego_set_speed'] = function (block) {
    Blockly.addModule('lego_motor');
    var varname = block.getFieldValue('VAR') || '';
    var rotate = block.getFieldValue('ROTATE') || '';
    var speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    if (rotate == 'CCW' && speed != 0) speed = '-' + speed;
    return varname + '.set_speed(' + speed + ')\n';
}

Blockly.Blocks['lego_set_angle'] = {
    init: function () {
        this.setColour(Blockly.Msg.NXT_MOTOR_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set ')
            .appendField(new Blockly.FieldDropdown([
                ['LegoM1', 'LegoM1'],
                ['LegoM2', 'LegoM2'],
                ['LegoM3', 'LegoM3'],
                ['LegoM4', 'LegoM4']
            ]), 'VAR');
        this.appendDummyInput()
            .appendField(' rotate ')
            .appendField(new Blockly.FieldDropdown([
                ['CW', 'CW'],
                ['CCW', 'CCW']
            ]), 'ROTATE')
            .appendField(' angle ')

        this.appendValueInput('ANGLE');
    }
}
Blockly.Python['lego_set_angle'] = function (block) {
    Blockly.addModule('lego_motor');
    var varname = block.getFieldValue('VAR') || '';
    var rotate = block.getFieldValue('ROTATE') || '';
    var angle = Blockly.Python.valueToCode(block, 'ANGLE', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    if (rotate == 'CCW' && angle != 0) angle = '-' + angle;
    return varname + '.set_angle(' + angle + ')\n';
}

Blockly.Blocks['lego_set_angle_zero'] = {
    init: function () {
        this.setColour(Blockly.Msg.NXT_MOTOR_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set ')
            .appendField(new Blockly.FieldDropdown([
                ['LegoM1', 'LegoM1'],
                ['LegoM2', 'LegoM2'],
                ['LegoM3', 'LegoM3'],
                ['LegoM4', 'LegoM4']
            ]), 'VAR');
        this.appendDummyInput()
            .appendField(' angle to 0 ')
    }
}
Blockly.Python['lego_set_angle_zero'] = function (block) {
    Blockly.addModule('lego_motor');
    var varname = block.getFieldValue('VAR') || '';
    return varname + '.set_angle_zero()\n';
}

Blockly.Blocks['lego_stop'] = {
    init: function () {
        this.setColour(Blockly.Msg.NXT_MOTOR_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Stop ')
            .appendField(new Blockly.FieldDropdown([
                ['LegoM1', 'LegoM1'],
                ['LegoM2', 'LegoM2'],
                ['LegoM3', 'LegoM3'],
                ['LegoM4', 'LegoM4']
            ]), 'VAR');
    }
}
Blockly.Python['lego_stop'] = function (block) {
    Blockly.addModule('lego_motor');
    var varname = block.getFieldValue('VAR') || '';
    return varname + '.stop()\n';
}

Blockly.Blocks['lego_brake'] = {
    init: function () {
        this.setColour(Blockly.Msg.NXT_MOTOR_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Brake ')
            .appendField(new Blockly.FieldDropdown([
                ['LegoM1', 'LegoM1'],
                ['LegoM2', 'LegoM2'],
                ['LegoM3', 'LegoM3'],
                ['LegoM4', 'LegoM4']
            ]), 'VAR');
    }
}
Blockly.Python['lego_brake'] = function (block) {
    Blockly.addModule('lego_motor');
    var varname = block.getFieldValue('VAR') || '';
    return varname + '.brake()\n';
}

Blockly.Blocks['IMU_GET_X'] = {
    init: function () {
        this.setColour(Blockly.Msg.RGB_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get X');
    }
}
Blockly.Python['IMU_GET_X'] = function () {
    Blockly.addModule('imu');
    return ['imu.ypr[1]', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['IMU_GET_Y'] = {
    init: function () {
        this.setColour(Blockly.Msg.RGB_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get Y');
    }
}
Blockly.Python['IMU_GET_Y'] = function () {
    Blockly.addModule('imu');
    return ['imu.ypr[2]', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['IMU_GET_Z'] = {
    init: function () {
        this.setColour(Blockly.Msg.RGB_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get Z');
    }
}
Blockly.Python['IMU_GET_Z'] = function () {
    Blockly.addModule('imu');
    return ['imu.ypr[0]', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['rgb_multi_set_color'] = {
    init: function() {
        this.setColour(Blockly.Msg.PINS_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set ')
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME');
        
        this.appendValueInput('INDEX')
            .appendField('index');

        this.appendDummyInput()
            .appendField('rgb color')
            .appendField(new Blockly.FieldColour('#FF0000'), 'COLOR');

    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Neopixel') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['rgb_multi_set_color'] = function(block) {
    var varname = block.getFieldValue('VARNAME');
    var index = Blockly.Python.valueToCode(block, 'INDEX', Blockly.Python.ORDER_FUNCTION_CALL) || '10';
    var color = block.getFieldValue('COLOR');
    return varname + '.setColor(' + index + ', ' + color.replace('#', '0x') + ')\n';
}

Blockly.Blocks['rgb_multi_set_color_from'] = {
    init: function() {
        this.setColour(Blockly.Msg.PINS_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set ')
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME');
        
        this.appendValueInput('FROM')
            .appendField('from');
        
        this.appendValueInput('TO')
            .appendField('to');

        this.appendDummyInput()
            .appendField('rgb color')
            .appendField(new Blockly.FieldColour('#FF0000'), 'COLOR');

    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Neopixel') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['rgb_multi_set_color_from'] = function(block) {
    var varname = block.getFieldValue('VARNAME');
    var from = Blockly.Python.valueToCode(block, 'FROM', Blockly.Python.ORDER_FUNCTION_CALL) || '1';
    var to = Blockly.Python.valueToCode(block, 'TO', Blockly.Python.ORDER_FUNCTION_CALL) || '5';
    var color = block.getFieldValue('COLOR');
    return varname + '.setColorFrom(' + from + ', ' + to + ', ' + color.replace('#', '0x') + ')\n';
}

Blockly.Blocks['rgb_multi_set_color_from_rgb'] = {
    init: function() {
        this.setColour(Blockly.Msg.PINS_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set ')
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME');
        
        this.appendValueInput('FROM')
            .appendField('from');
        
        this.appendValueInput('TO')
            .appendField('to');

        // this.appendDummyInput()
        //     .appendField('rgb color')
        //     .appendField(new Blockly.FieldColour('#FF0000'), 'COLOR');
        this.appendValueInput('R')
            .appendField('red');
        this.appendValueInput('G')
            .appendField('green');
        this.appendValueInput('B')
            .appendField('blue');

    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Neopixel') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['rgb_multi_set_color_from_rgb'] = function(block) {
    var varname = block.getFieldValue('VARNAME');
    var from = Blockly.Python.valueToCode(block, 'FROM', Blockly.Python.ORDER_FUNCTION_CALL) || '1';
    var to = Blockly.Python.valueToCode(block, 'TO', Blockly.Python.ORDER_FUNCTION_CALL) || '5';
    var r = Blockly.Python.valueToCode(block, 'R', Blockly.Python.ORDER_NONE) || '0';
    var g = Blockly.Python.valueToCode(block, 'G', Blockly.Python.ORDER_NONE) || '0';
    var b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_NONE) || '0';
    if(isNaN(parseInt(r)) || isNaN(parseInt(g)) || isNaN(parseInt(b))) {
        return varname + ".setColorFrom(" + from + ", " + to + ", " +"int('0x%02x%02x%02x' % (round(min(100, max(0, " + r +")) * 2.55), round(min(100, max(0, " + g +")) * 2.55), round(min(100, max(0, " + b +")) * 2.55))))\n";
    }
    var hexR = Math.floor(Math.abs(parseInt(r)) % 256).toString(16);
    var hexG = Math.floor(Math.abs(parseInt(g)) % 256).toString(16);
    var hexB = Math.floor(Math.abs(parseInt(b)) % 256).toString(16);
    if(hexR.length < 2) hexR = '0' + hexR;
    if(hexG.length < 2) hexG = '0' + hexG;
    if(hexB.length < 2) hexB = '0' + hexB;
    return varname + '.setColorFrom(' + from + ', ' + to + ', 0x' + hexR + hexG + hexB + ')\n';
}

Blockly.Blocks['rgb_multi_set_color_all'] = {
    init: function() {
        this.setColour(Blockly.Msg.PINS_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set ')
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME');

        this.appendDummyInput()
            .appendField('all rgb color')
            .appendField(new Blockly.FieldColour('#FF0000'), 'COLOR');

    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Neopixel') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['rgb_multi_set_color_all'] = function(block) {
    var varname = block.getFieldValue('VARNAME');
    var color = block.getFieldValue('COLOR');
    return varname + '.setColorAll(' + color.replace('#', '0x') + ')\n';
}

Blockly.Blocks['rgb_multi_set_brightness'] = {
    init: function() {
        this.setColour(Blockly.Msg.PINS_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Set ')
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME');

        this.appendValueInput('BRIGHTNESS')
            .appendField('brightness');

    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Neopixel') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['rgb_multi_set_brightness'] = function(block) {
    var varname = block.getFieldValue('VARNAME');
    var brightness = Blockly.Python.valueToCode(block, 'BRIGHTNESS', Blockly.Python.ORDER_FUNCTION_CALL) || '100';
    return varname + '.setBrightness(' + brightness + ')\n';
}

Blockly.Blocks['execute'] = {
    init: function() {
        this.setColour('#2b90d9');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Execute code:')
            .appendField(new Blockly.FieldTextInput(''), 'CODE');
    }
}
Blockly.Python['execute'] = function(block) {
    var code = block.getFieldValue('CODE');
    if(code === '') return '';
    return code + '\n';
}

Blockly.Blocks['joystick_x'] = {
    init: function () {
        this.setColour(Blockly.Msg.DHT_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get ')
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME')
            .appendField(' X');
    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Joystick') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['joystick_x'] = function(block) {
    var varname = block.getFieldValue('VARNAME');
    return [varname + '.X', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['joystick_y'] = {
    init: function () {
        this.setColour(Blockly.Msg.DHT_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get ')
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME')
            .appendField(' Y');
    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Joystick') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['joystick_y'] = function(block) {
    var varname = block.getFieldValue('VARNAME');
    return [varname + '.Y', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['joystick_press'] = {
    init: function () {
        this.setColour(Blockly.Msg.DHT_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get ')
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME')
            .appendField(' IsPressed');
    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Joystick') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['joystick_press'] = function(block) {
    var varname = block.getFieldValue('VARNAME');
    return [varname + '.Press', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['light_a_read'] = {
    init: function () {
        this.setColour(Blockly.Msg.SPEAKER_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get ')
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME')
            .appendField(' Analog Value');
    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Light') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['light_a_read'] = function(block) {
    var varname = block.getFieldValue('VARNAME');
    return [varname + '.a_read()', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['light_d_read'] = {
    init: function () {
        this.setColour(Blockly.Msg.SPEAKER_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get ')
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME')
            .appendField(' Digital Value');
    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Light') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['light_d_read'] = function(block) {
    var varname = block.getFieldValue('VARNAME');
    return [varname + '.d_read()', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['earth_a_read'] = {
    init: function () {
        this.setColour(Blockly.Msg.GPIO_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get ')
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME')
            .appendField(' Analog Value');
    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Earth') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['earth_a_read'] = function(block) {
    var varname = block.getFieldValue('VARNAME');
    return [varname + '.a_read()', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['earth_d_read'] = {
    init: function () {
        this.setColour(Blockly.Msg.GPIO_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get ')
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME')
            .appendField(' Digital Value');
    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Earth') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['earth_d_read'] = function(block) {
    var varname = block.getFieldValue('VARNAME');
    return [varname + '.d_read()', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['makey_value'] = {
    init: function() {
        this.setColour(Blockly.Msg.NXT_MOTOR_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get ')
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME')
            .appendField(' value');
    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Makey') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['makey_value'] = function(block) {
    var varname = block.getFieldValue('VARNAME');
    return [varname + '.value()', Blockly.Python.ORDER_CONDITIONAL];
}

Blockly.Blocks['makey_play_piano'] = {
    init: function() {
        this.setColour(Blockly.Msg.NXT_MOTOR_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME')
            .appendField('Start piano mode ')
            .appendField(new Blockly.FieldDropdown([
                ['1', '1'],
                ['1/2', '1/2'],
                ['1/4', '1/4'],
                ['1/8', '1/8'],
                ['1/16', '1/16'],
                ['2', '2'],
                ['4', '4']
            ]), 'BEAT')
            .appendField(' beat');
    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Makey') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['makey_play_piano'] = function(block) {
    var varname = block.getFieldValue('VARNAME');
    var beat = block.getFieldValue('BEAT');
    return varname + '.play_piano(' + beat + ')\n';
}

Blockly.Blocks['servo_unit_write_us'] = {
    init: function () {
        this.setColour(Blockly.Msg.SERVO_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME')

        this.appendDummyInput()
            .appendField('write ');
        this.appendValueInput('TIME');
        this.appendDummyInput()
            .appendField(' μs');
    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Servo') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['servo_unit_write_us'] = function (block) {
    var varname = block.getFieldValue('VARNAME');
    var time = Blockly.Python.valueToCode(block, 'TIME', Blockly.Python.ORDER_FUNCTION_CALL) || '600';
    return varname + '.write_us(' + time + ')' + '\n';
}

Blockly.Blocks['servo_unit_write_angle'] = {
    init: function () {
        this.setColour(Blockly.Msg.SERVO_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME')

        this.appendDummyInput()
            .appendField('rotate ');
        this.appendValueInput('ANGLE');
    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Servo') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['servo_unit_write_angle'] = function (block) {
    var varname = block.getFieldValue('VARNAME');
    var angle = Blockly.Python.valueToCode(block, 'ANGLE', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    return varname + '.write_angle(' + angle + ')' + '\n';
}

Blockly.Blocks['weigh_zero'] = {
    init: function() {
        this.setColour(Blockly.Msg.DAC_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME')
            .appendField('return to zero');
    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Weigh') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['weigh_zero'] = function(block) {
    var varname = block.getFieldValue('VARNAME');
    return varname + '.zero()\n';
}

Blockly.Blocks['weigh_get_weight'] = {
    init: function() {
        this.setColour(Blockly.Msg.DAC_HUE);
        this.setInputsInline(true);
        this.setOutput(true);

        this.appendDummyInput()
            .appendField('Get')
            .appendField(new Blockly.FieldDropdown(this.getAll), 'VARNAME')
            .appendField(' weight');
    },
    getAll: function() {
        var options = [];
        for (var i = 0; i < Blockly.Units.length; i++) {
            if (Blockly.Units[i].name === 'Weigh') {
                options.push([Blockly.Units[i].varname, Blockly.Units[i].varname]);
            }
        }
        if (options.length === 0) return [['', '']];
        return options;
    }
}
Blockly.Python['weigh_get_weight'] = function(block) {
    var varname = block.getFieldValue('VARNAME');
    return [varname + '.get_weight()', Blockly.Python.ORDER_CONDITIONAL];
}

/**
 * LCD
 */
Blockly.Blocks['lcd_clear'] = {
    init: function() {
        this.setColour(Blockly.Msg.LCD_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Lcd.clear');
    }
}
Blockly.Python['lcd_clear'] = function(block) {
    return 'lcd.clear()\n';
}

Blockly.Blocks['lcd_fill'] = {
    init: function() {
        this.setColour(Blockly.Msg.LCD_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Lcd.fill ')
            .appendField(new Blockly.FieldColour(), 'COLOR');
    }
}
Blockly.Python['lcd_fill'] = function(block) {
    var color = block.getFieldValue('COLOR') || '';
    return 'lcd.fill(' + color.replace('#', '0x') + ')\n';
}

/**
 * Lcd.print
 */
Blockly.Blocks['lcd_print'] = {
    init: function() {
        this.setColour(Blockly.Msg.LCD_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendValueInput('TEXT')
            .appendField('Lcd.print')
            .appendField('Text:');
        this.appendValueInput('X')
            .appendField('x:')
            .setCheck('Number');
        this.appendValueInput('Y')
            .appendField('y:')
            .setCheck('Number');
        this.appendDummyInput()
            .appendField(' Color:')
            .appendField(new Blockly.FieldColour(), 'COLOR')
    }
}
Blockly.Python['lcd_print'] = function(block) {
    var text = Blockly.Python.valueToCode(block, 'TEXT', Blockly.Python.ORDER_FUNCTION_CALL) || '\'\'';
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var color = block.getFieldValue('COLOR');
    var params = [text, x, y, color.replace('#', '0x')];
    return 'lcd.print(' + params.join(', ') + ')\n';
}

Blockly.Blocks['lcd_setFont'] = {
    init: function() {
        this.setColour(Blockly.Msg.LCD_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput('font')
        .appendField('Font:')
        .appendField(new Blockly.FieldDropdown([
                        ["FONT_Default","FONT_Default"],
                        ["FONT_DefaultSmall","FONT_DefaultSmall"],
                        ["FONT_DejaVu18","FONT_DejaVu18"],
                        ["FONT_DejaVu24","FONT_DejaVu24"],
                        ["FONT_Minya","FONT_Minya"],
                        ["FONT_Small","FONT_Small"],
                        ["FONT_Ubuntu","FONT_Ubuntu"],
                        ["FONT_Tooney","FONT_Tooney"],
                        ["FONT_7seg","FONT_7seg"],
                        ["FONT_Comic","FONT_Comic"]
                    ]), 'FONT_FAMILY');
    }
}
Blockly.Python['lcd_setFont'] = function(block) {
    var font = block.getFieldValue('FONT_FAMILY');
    return 'lcd.font(lcd.' + font + ')\n';
}

Blockly.Blocks['lcd_pixel'] = {
    init: function() {
        this.setColour(Blockly.Msg.LCD_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Lcd.pixel');
        this.appendValueInput('X')
            .appendField('x:');
        this.appendValueInput('Y')
            .appendField('y:');
        this.appendDummyInput()
            .appendField(' Color:')
            .appendField(new Blockly.FieldColour(), 'COLOR')
    }
}
Blockly.Python['lcd_pixel'] = function(block) {
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var color = block.getFieldValue('COLOR');
    return 'lcd.pixel(' + [x, y, color.replace('#', '0x')].join(', ') + ')\n';
}

Blockly.Blocks['lcd_line'] = {
    init: function() {
        this.setColour(Blockly.Msg.LCD_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Lcd.line');
        this.appendValueInput('X')
            .appendField('x:');
        this.appendValueInput('Y')
            .appendField('y:');
        this.appendValueInput('X1')
            .appendField('x1:');
        this.appendValueInput('Y1')
            .appendField('y1:');
        this.appendDummyInput()
            .appendField(' Color:')
            .appendField(new Blockly.FieldColour(), 'COLOR')
    }
}
Blockly.Python['lcd_line'] = function(block) {
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var x1 = Blockly.Python.valueToCode(block, 'X1', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var y1 = Blockly.Python.valueToCode(block, 'Y1', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var color = block.getFieldValue('COLOR');
    return 'lcd.line(' + [x, y, x1, y1, color.replace('#', '0x')].join(', ') + ')\n';
}

Blockly.Blocks['lcd_rect'] = {
    init: function() {
        this.setColour(Blockly.Msg.LCD_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Lcd.rect');
        this.appendValueInput('X')
            .appendField('x:');
        this.appendValueInput('Y')
            .appendField('y:');
        this.appendValueInput('WIDTH')
            .appendField('width:');
        this.appendValueInput('HEIGHT')
            .appendField('height:');
        this.appendDummyInput()
            .appendField(' ')
            .appendField(new Blockly.FieldDropdown([['color', 'color'], ['fillcolor', 'fillcolor']]), 'COLOR_TYPE')
            .appendField(new Blockly.FieldColour(), 'COLOR')
    }
}
Blockly.Python['lcd_rect'] = function(block) {
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var width = Blockly.Python.valueToCode(block, 'WIDTH', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var height = Blockly.Python.valueToCode(block, 'HEIGHT', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var color = block.getFieldValue('COLOR');
    var colorType = block.getFieldValue('COLOR_TYPE');
    return 'lcd.rect(' + [x, y, width, height, colorType + '=' + color.replace('#', '0x')].join(', ') +')\n';
}

Blockly.Blocks['lcd_triangle'] = {
    init: function() {
        this.setColour(Blockly.Msg.LCD_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Lcd.triangle');
        this.appendValueInput('X')
            .appendField('x:');
        this.appendValueInput('Y')
            .appendField('y:');
        this.appendValueInput('X1')
            .appendField('x1:');
        this.appendValueInput('Y1')
            .appendField('y1:');
        this.appendValueInput('X2')
            .appendField('x2:');
        this.appendValueInput('Y2')
            .appendField('y2:');
        this.appendDummyInput()
            .appendField(' ')
            .appendField(new Blockly.FieldDropdown([['color', 'color'], ['fillcolor', 'fillcolor']]), 'COLOR_TYPE')
            .appendField(new Blockly.FieldColour(), 'COLOR');
    }
}
Blockly.Python['lcd_triangle'] = function(block) {
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var x1 = Blockly.Python.valueToCode(block, 'X1', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var y1 = Blockly.Python.valueToCode(block, 'Y1', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var x2 = Blockly.Python.valueToCode(block, 'X2', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var y2 = Blockly.Python.valueToCode(block, 'Y2', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var colorType = block.getFieldValue('COLOR_TYPE');
    var color = block.getFieldValue('COLOR');
    return 'lcd.triangle(' + [x, y, x1, y1, x2, y2, colorType + '=' + color.replace('#', '0x')].join(', ') +')\n';
}

Blockly.Blocks['lcd_circle'] = {
    init: function() {
        this.setColour(Blockly.Msg.LCD_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Lcd.circle');
        this.appendValueInput('X')
            .appendField('x:');
        this.appendValueInput('Y')
            .appendField('y:');
        this.appendValueInput('RADIUS')
            .appendField('radius:');
        this.appendDummyInput()
            .appendField(' ')
            .appendField(new Blockly.FieldDropdown([['color', 'color'], ['fillcolor', 'fillcolor']]), 'COLOR_TYPE')
            .appendField(new Blockly.FieldColour(), 'COLOR');
    }
}
Blockly.Python['lcd_circle'] = function(block) {
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var radius = Blockly.Python.valueToCode(block, 'RADIUS', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var colorType = block.getFieldValue('COLOR_TYPE');
    var color = block.getFieldValue('COLOR');
    return 'lcd.circle(' + [x, y, radius, colorType + '=' + color.replace('#', '0x')].join(', ') +')\n';
}

Blockly.Blocks['lcd_ellipse'] = {
    init: function() {
        this.setColour(Blockly.Msg.LCD_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Lcd.ellipse');
        this.appendValueInput('X')
            .appendField('x:');
        this.appendValueInput('Y')
            .appendField('y:');
        this.appendValueInput('RX')
            .appendField('rx:');
        this.appendValueInput('RY')
            .appendField('ry:');
        this.appendDummyInput()
            .appendField(' ')
            .appendField(new Blockly.FieldDropdown([['color', 'color'], ['fillcolor', 'fillcolor']]), 'COLOR_TYPE')
            .appendField(new Blockly.FieldColour(), 'COLOR')
    }
}
Blockly.Python['lcd_ellipse'] = function(block) {
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var rx = Blockly.Python.valueToCode(block, 'RX', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var ry = Blockly.Python.valueToCode(block, 'RY', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var colorType = block.getFieldValue('COLOR_TYPE');
    var color = block.getFieldValue('COLOR');
    return 'lcd.ellipse(' + [x, y, rx, ry, colorType + '=' + color.replace('#', '0x')].join(', ') + ')\n';
}

Blockly.Blocks['lcd_arc'] = {
    init: function() {
        this.setColour(Blockly.Msg.LCD_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Lcd.arc');
        this.appendValueInput('X')
            .appendField('x:');
        this.appendValueInput('Y')
            .appendField('y:');
        this.appendValueInput('RADIUS')
            .appendField('radius:');
        this.appendValueInput('THICK')
            .appendField('thick:');
        this.appendValueInput('START')
            .appendField('start:');
        this.appendValueInput('END')
            .appendField('end:');
        this.appendDummyInput()
            .appendField(' ')
            .appendField(new Blockly.FieldDropdown([['color', 'color'], ['fillcolor', 'fillcolor']]), 'COLOR_TYPE')
            .appendField(new Blockly.FieldColour(), 'COLOR')
    }
}
Blockly.Python['lcd_arc'] = function(block) {
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var radius = Blockly.Python.valueToCode(block, 'R', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var thick = Blockly.Python.valueToCode(block, 'THICK', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var start = Blockly.Python.valueToCode(block, 'START', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var end = Blockly.Python.valueToCode(block, 'END', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var colorType = block.getFieldValue('COLOR_TYPE');
    var color = block.getFieldValue('COLOR');
    return 'lcd.arc(' + [x, y, radius, thick, start, end, colorType + '=' + color.replace('#', '0x')].join(', ') + ')\n';
}

Blockly.Blocks['lcd_polygon'] = {
    init: function() {
        this.setColour(Blockly.Msg.LCD_HUE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);

        this.appendDummyInput()
            .appendField('Lcd.polygon');
        this.appendValueInput('X')
            .appendField('x:');
        this.appendValueInput('Y')
            .appendField('y:');
        this.appendValueInput('RADIUS')
            .appendField('radius:');
        this.appendValueInput('SIDES')
            .appendField('sides:');
        this.appendValueInput('THICK')
            .appendField('thick:');
        this.appendDummyInput()
            .appendField(' ')
            .appendField(new Blockly.FieldDropdown([['color', 'color'], ['fillcolor', 'fillcolor']]), 'COLOR_TYPE')
            .appendField(new Blockly.FieldColour(), 'COLOR')
        this.appendDummyInput()
            .appendField('rotate: ')
            .appendField(new Blockly.FieldAngle(), 'ROTATE')
    }
}
Blockly.Python['lcd_polygon'] = function(block) {
    var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var radius = Blockly.Python.valueToCode(block, 'RADIUS', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var sides = Blockly.Python.valueToCode(block, 'SIDES', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var thick = Blockly.Python.valueToCode(block, 'THICK', Blockly.Python.ORDER_FUNCTION_CALL) || '0';
    var colorType = block.getFieldValue('COLOR_TYPE');
    var color = block.getFieldValue('COLOR');
    var rotate = block.getFieldValue('ROTATE');
    return 'lcd.polygon(' + [x, y, radius, sides, thick, colorType + '=' + color.replace('#', '0x'), 'rotate=' + rotate].join(', ') + ')\n';
}