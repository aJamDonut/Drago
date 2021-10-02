**Test urls:**
[Full Editor](https://ajamdonut.github.io/Drago/editor_blueprint.html)
[Dialog Editor](https://ajamdonut.github.io/Drago/editor_blueprint.html?mode=dialog)

**Adding new components**
Inside an imported javascript file create a new component which extends DragoContainer

`
class Drago_Convo_Start extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.title = 'Start Dialog';
        this.textId = this.id+'-text';
        this.scopeBlock = true;
    }

    //This is where the rows for the container will be added
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

    //This is the part which generates the actual code output
    //It uses the inputs and outputs from those created in init()
    code() {

        //This generates the inputs/outputs values
        let nodes = this.processInputsAndOutputs();

        nodes.output1 = nodes.output1 || '';

        if(nodes.input1.length > 2 || nodes.output1.length > 0) {
            return `_DIALOGS[${nodes.input1}] = {\n${nodes.output1}\n};\n\n`;
        } else {
            return ``;
        }
    }

}

//Finally attach it to the DragoComponents class to make it available to Drago
DragoComponents.prototype.Drago_Convo_Start = Drago_Convo_Start;

`

**Creating new row types**
Rows are each line within a component, e.g. if a component accepts a string, that is a row called Drago__String.

`
//Create a class which extends DragoRow
class Drago__Multiline extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
        this.textId = this.id+'-text';
        this.value = '';
    }

    //This is the code which will return to input nodes.
    code() {
        let elem = $("#"+this.textId);
        let val = elem.val();
        this.value = elem.val();
        return "`"+val+"`"; //Return with quotes to make it a true string
    }

    //This is how it will display this field within a container
    display() {
        return `<textarea id='${this.textId}' type='text' class='Drago__String' placeholder='${this.options.label}'>${this.value}</textarea><div style='clear:both;'></div>`;
    }
    
}
//Finally attach it to the DragoSubComponents class to make it available to Drago
DragoSubComponents.prototype.Drago__Multiline = Drago__Multiline;
`