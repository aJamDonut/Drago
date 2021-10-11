class DragoLibContainer extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        
        this.title = options.component;

        console.log("auto container", options);

    }

    init() {
    
        this.addRow({
            name: 'output1',
            subcomponent: 'Drago__DynamicOutput',
            options: this.options,
            type: 'output',
            label: this.title,
            multi: true
        });
 
        
        
    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `new ${this.options.component}()`;
    }

}



class Drago_Dynamic_ObjectSetProperty extends DragoContainer {

    constructor(drago, id, options, old) {
        super(drago, id, options);
        this.old = old;
        this.value = options.value || this.value;
        this.title = 'Set Property';
        this.textId = this.id+'-text';
        this.scopeBlock = true;
        
        
    }

    init() {
        
        this.addRow({
            type: 'input',
            label: '',
            subcomponent: 'Drago__Start',
        });

        this.addRow({
            name: 'input1',
            subcomponent: 'Drago__DynamicObject',
            type: 'input',
            value: this.value,
            multi: true
        });


        if(this.value) {
            this.addRow({
                name: 'input2',
                subcomponent: 'Drago__DynamicObject',
                type: 'input',
                value: this.value,
                multi: true
            });
        }

        console.log("INFO", this.value, this.old, this.options)
    }

    code() {
        let nodes = this.processInputsAndOutputs();
        this.value = nodes.input1;
        return `${nodes.input1};\n`;
    }


}

DragoComponents.prototype.Drago_Dynamic_ObjectSetProperty = Drago_Dynamic_ObjectSetProperty;


class Drago__DynamicObject extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
        this.textId = this.id+'-text';
        console.log("DYNA", options);
    }

    code() {
        let elem = $("#"+this.textId);
        this.value = elem.val();

        if(this.options.datatype == 'string') {
            return "`"+elem.val()+"`";
        } 
        
        if(this.options.datatype == 'int') {
            parseInt(elem.val());
        } 

        return elem.val(); //Return with quotes to make it a true string
        
        
    }

    display() {
        return this.options.value;
    }
}

DragoSubComponents.prototype.Drago__DynamicObject = Drago__DynamicObject;

class Drago__DynamicOutput extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
        this.textId = this.id+'-text';
    }

    code() {
        return this.options.label//Return with quotes to make it a true string
    }

    display() {
        console.log("My ops", this.options)
        return this.options.label;
    }
    
}

DragoSubComponents.prototype.Drago__DynamicOutput = Drago__DynamicOutput;