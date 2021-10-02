class Drago_Convo_Start extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);

        this.title = 'Start Dialog';
        this.textId = this.id+'-text';
        this.scopeBlock = true;
        
    }

    init() {

        this.addRow({
            name: 'input1',
            type: 'variable',
            subcomponent: 'Drago__String',
            label: 'Title'
        });

        this.addRow({
            name: 'output1',
            type: 'output',
            label: 'Begin',
            multi: true,
            process: true,
        });
    }

    code() {

        let nodes = this.processInputsAndOutputs();
        nodes.output1 = nodes.output1 || '';
        if(nodes.input1.length > 2 || nodes.output1.length > 0) {
            return `_DIALOGS[${nodes.input1}] = {\n${nodes.output1}\n};\n\n`;
        } else {
            return ``;
        }
    }

}

DragoComponents.prototype.Drago_Convo_Start = Drago_Convo_Start;

class Drago_Convo_Text extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.title = "Convo Text";
        this.settings = {
            cssClass: 'bigger'
        }
    }

    init() {

        this.addRow({
            name: 'output1',
            subcomponent: 'Drago__Multiline',
            type: 'output',
            multi: true,
        });

    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `${nodes.output1}`;
    }


}

DragoComponents.prototype.Drago_Convo_Text = Drago_Convo_Text;

class Drago_Convo_Dialog extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.title = "Dialog";
        this.settings = {
            cssClass: 'wideboy'
        }
        
        
    }

    init() {

        this.addRow({
            name: 'start1',
            type: 'input',
            label: 'Execute',
            subcomponent: 'Drago__Start',
        });

        /*
        this.addRow({
            name: 'input1',
            subcomponent: 'Drago__Multiline',
            type: 'variable',
        });
        */
        this.addRow({
            name: 'input1',
            type: 'variable',
            
            subcomponent: 'Drago__Multiline',
            label: 'Dialog'
        });
        this.addRow({
            name: 'input2',
            type: 'variable',
            subcomponent: 'Drago__Multiline',
            label: 'Response 1'
        });
        this.addRow({
            name: 'input3',
            type: 'variable',
            
            subcomponent: 'Drago__Multiline',
            label: 'Response 2'
        });
        this.addRow({
            name: 'input4',
            type: 'variable',
            subcomponent: 'Drago__Multiline',
            label: 'Response 3'
        });

        this.addRow({
            name: 'output1',
            type: 'output',
            label: 'Response 1',
            process: true
        });
        this.addRow({
            name: 'output2',
            type: 'output',
            label: 'Response 2',
            process: true
        });
        this.addRow({
            name: 'output3',
            type: 'output',
            label: 'Response 3',
            process: true
        });

    }

    code() {
        let nodes = this.processInputsAndOutputs();
        let code = ``;
        
        if(nodes.input1.length > 2) {
            code = code + `"dialog":${nodes.input1},`;
        }
        if(nodes.input2.length > 2) {
            code = code + `\n"option1":${nodes.input2},`
        }
        if(nodes.input3.length > 2) {
            code = code + `\n"option2":${nodes.input3},`
        }
        if(nodes.input4.length > 2) {
            code = code + `\n"option3":${nodes.input4},`
        }

        if(nodes.output1) {
            code = code + `\n"option1_func":function(caller){\n\t${nodes.output1}},`;
        }
        if(nodes.output2) {
            code = code + `\n"option2_func":function(caller){\n\t${nodes.output2}},`
        }
        if(nodes.output3) {
            code = code + `\n"option3_func":function(caller){\n\t${nodes.output3}},`
        }

        return code;
    }


}

DragoComponents.prototype.Drago_Convo_Dialog = Drago_Convo_Dialog;

class Drago_Convo_NextConvo extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.title = 'Next Convo';
    }

    init() {

        this.addRow({
            type: 'input',
            label: 'Execute',
            subcomponent: 'Drago__Start',
        });
        this.addRow({
            name: 'input2',
            type: 'input',
            label: 'Name'
        });
    }

    code() {
        
        let nodes = this.processInputsAndOutputs();
        return `\n\ngame.startConvo(${nodes.input2});\n`;

    }

}

DragoComponents.prototype.Drago_Convo_NextConvo = Drago_Convo_NextConvo;