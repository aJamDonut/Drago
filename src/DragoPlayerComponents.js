class Drago_Player_HasItem extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);

        this.title = 'HasItem';
        this.textId = this.id+'-text';
        this.scopeBlock = true;
        
    }

    init() {

        this.addRow({
            name: 'input1',
            type: 'variable',
            label: 'ItemName'
        });

        this.addRow({
            name: 'output1',
            type: 'output',
            label: 'Begin',
            multi: true,
        });
    }

    code() {

        let nodes = this.processInputsAndOutputs();
        
        return nodes.input1;
    }

}

DragoComponents.prototype.Drago_Player_HasItem = Drago_Player_HasItem;
