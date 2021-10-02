class Drago_Player_HasItem extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);

        this.title = 'HasItem';
        this.textId = this.id + '-text';
        this.scopeBlock = true;

    }

    init() {

        this.addRow({
            name: 'input1',
            type: 'input',
            label: 'ItemName'
        });

        this.addRow({
            name: 'output1',
            type: 'output',
            subcomponent: 'Drago__Output',
            label: 'Boolean',
            multi: true
        });
    }

    code() {

        let nodes = this.processInputsAndOutputs();

        return `player.hasItem(${nodes.input1})`;
    }

}

DragoComponents.prototype.Drago_Player_HasItem = Drago_Player_HasItem;


class Drago_Player_TakeItem extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);

        this.title = 'TakeItem';
        this.textId = this.id + '-text';
        this.scopeBlock = true;

    }

    init() {


        this.addRow({
            type: 'input',
            label: 'Execute',
            subcomponent: 'Drago__Start',
        });

        this.addRow({
            name: 'input1',
            type: 'input',
            label: 'ItemName'
        });

        this.addRow({
            name: 'input2',
            type: 'input',
            label: 'Quantity'
        });


    }

    code() {

        let nodes = this.processInputsAndOutputs();

        if (isNaN(nodes.input2) || nodes.input2 == '') {
            nodes.input2 = 1;
        }

        return `\nplayer.takeItem(${nodes.input1}, ${nodes.input2});`;
    }

}

DragoComponents.prototype.Drago_Player_TakeItem = Drago_Player_TakeItem;


class Drago_Player_Stat extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);

        this.title = 'Player Stat';
        this.textId = this.id + '-text';
        this.scopeBlock = true;

    }

    init() {


        this.addRow({
            type: 'input',
            label: 'Execute',
            subcomponent: 'Drago__Start',
        });

        this.addRow({
            name: 'input1',
            type: 'input',
            label: 'stat'
        });

    }

    code() {

        let nodes = this.processInputsAndOutputs();

        if (isNaN(nodes.input2) || nodes.input2 == '') {
            nodes.input2 = 1;
        }

        return `player.stats[(${nodes.input1}]`;
    }

}

DragoComponents.prototype.Drago_Player_Stat = Drago_Player_Stat;