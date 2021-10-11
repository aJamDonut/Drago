class Drago_Events_DocumentReady extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.type = 'event';
        this.title = 'DocumentReady';
        this.textId = this.id+'-text';
        this.scopeBlock = true;
        
    }

    init() {
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
        
        return `document.addEventListener('DOMContentLoaded', function () {\n${nodes.output1}});\n`;
    }

}

DragoComponents.prototype.Drago_Events_DocumentReady = Drago_Events_DocumentReady;