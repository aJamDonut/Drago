class Drago_Logic_End extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.title = 'End';
    }

    init() {

        this.addRow({
            type: 'input',
            label: '',
            subcomponent: 'Drago__Start',
        });
        this.addRow({
            name: 'input1',
            type: 'variable',
            label: '',
            list: ['true', 'false'],
            subcomponent: 'Drago__List',
        });
        this.addRow({
            name: 'info1',
            type: 'info',
            label: 'OR INPUT:',
        });
        this.addRow({
            name: 'input2',
            type: 'input',
            label: ''
        });
    }

    code() {
        
        let nodes = this.processInputsAndOutputs();
        if(nodes.input2.length > 0) {
            return `return ${nodes.input2};`;
        } else {
            return `return ${nodes.input1};`;
        }
        
    }

}

DragoComponents.prototype.Drago_Logic_End = Drago_Logic_End;

class Drago_Logic_Execute extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.title = 'Execute';
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
            label: 'Function'
        });
    }

    code() {
        
        let nodes = this.processInputsAndOutputs();
        if(nodes.input2.length > 0) {
            return `${nodes.input2};\n`;
        } else {
            return `${nodes.input1};\n`;
        }
        
    }

}

DragoComponents.prototype.Drago_Logic_Execute = Drago_Logic_Execute;

class Drago_Logic_If extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.title = 'If';
        this.textId = this.id+'-text';
        this.scopeBlock = true;
        
    }

    init() {

        this.addRow({
            name: 'event',
            type: 'input',
            label: '',
            subcomponent: 'Drago__Start',
        });

        this.addRow({
            name: 'input1',
            type: 'input',
            label: 'Var 1'
        });

        this.addRow({
            name: 'input2',
            subcomponent: 'Drago__List',
            list: [
                '===',
                '==',
                '!=',
                '<',
                '>',
                '<=',
                '>='
            ],

            datatype: 'string',
            type: 'variable',
            process:true,
        });

        this.addRow({
            name: 'input3',
            type: 'input',
            label: 'Var 2'
        });

        this.addRow({
            name: 'output1',
            subcomponent: 'Drago__Boolean',
            type: 'output',
            label: 'true',
            enabled: false,
            process: true,
            multi: true,
        });
        
        
        

        this.addRow({
            name:'output2',
            subcomponent: 'Drago__Boolean',
            type: 'output',
            label: 'false',
            enabled: true,
            process: true,
            multi: true,
        });
    }

    code() {

        
        let nodes = this.nodes = this.processInputsAndOutputs();
  
        if(nodes.output2.length > 1) {
            if(nodes.output1.length > 1) {
                return `
if(${nodes.input1} ${nodes.input2.replace(/`/g,'')} ${nodes.input3}) {
${nodes.output1}
} else {
${nodes.output2}
}
`;
            } else {
                return `
if(!(${nodes.input1} ${nodes.input2.replace(/`/g,'')} ${nodes.input3})) {
${nodes.output2}
}
`;
            }
        } else {
            return `
if(${nodes.input1} ${nodes.input2.replace(/`/g,'')} ${nodes.input3}) {
${nodes.output1}
}
`;
        }
        
    }

}

DragoComponents.prototype.Drago_Logic_If = Drago_Logic_If;


class Drago_Logic_Not extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);

        this.title = 'If';
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
            type: 'input',
            label: 'Var 1'
        });

        this.addRow({
            name: 'output1',
            subcomponent: 'Drago__Boolean',
            type: 'output',
            label: 'true',
            enabled: false,
            process: true,
            multi: true,
        });
        
        
        

        this.addRow({
            name:'output2',
            subcomponent: 'Drago__Boolean',
            type: 'output',
            label: 'false',
            enabled: true,
            process: true,
            multi: true,
        });
    }

    code() {

        let nodes = this.processInputsAndOutputs();
        if(nodes.output2.length > 0) {
            if(nodes.output1.length > 1) {
                return `if(!${nodes.input1}) {
${nodes.output1}
} else {
${nodes.output2}
}`;
            } else {
                return `if(!!${nodes.input1}) {
${nodes.output2}
}`;
            }
        } else {
            return `if(!${nodes.input1}) {
${nodes.output1}
}`;
        }
    
    }

}

DragoComponents.prototype.Drago_Logic_Not = Drago_Logic_Not;



class Drago_Events_Event extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);

        this.title = 'Event';
        this.textId = this.id+'-text';
        this.scopeBlock = true;
        
    }

    init() {
        this.addRow({
            name: 'output1',
            subcomponent: 'Drago__String',
            type: 'output',
            label: 'Start',
            multi: true,
        });
    }

    code() {

        let nodes = this.processInputsAndOutputs();
        
        return `${nodes.output1}`;
    }

}

DragoComponents.prototype.Drago_Events_Event = Drago_Events_Event;

class Drago_Datatype_True extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);

        this.title = 'Bool';
        this.slim = true;
        
    }

    init() {
        this.addRow({
            name: 'output1',
            subcomponent: 'Drago__Output',
            type: 'output',
            label: 'True',
            multi: true,
        });

    }

    code() {
        return `true`;
    }


}

DragoComponents.prototype.Drago_Datatype_True = Drago_Datatype_True;

class Drago_Datatype_False extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);

        this.title = 'Bool';
        this.slim = true;
        
    }

    init() {
        this.addRow({
            name: 'output1',
            subcomponent: 'Drago__Output',
            type: 'output',
            label: 'False',
            multi: true,
        });

    }

    code() {
        return `false`;
    }


}

DragoComponents.prototype.Drago_Datatype_False = Drago_Datatype_False;

class Drago_Datatype_String extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);

        this.title = 'String';
        this.slim = true;
        this.textId = this.id+'-text';
        this.scopeBlock = true;
        
    }

    init() {
        this.addRow({
            name: 'output1',
            subcomponent: 'Drago__String',
            type: 'output',
            label: 'Hello',
            multi: true,
        });

    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `${nodes.output1}`;
    }


}

DragoComponents.prototype.Drago_Datatype_String = Drago_Datatype_String;

class Drago_Protected_ObjectSlim extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.value = options.value || this.value;
        this.title = 'Object';
        this.textId = this.id+'-text';
        this.scopeBlock = true;
        this.slim = true;
    }

    init() {
        
        this.addRow({
            name: 'output1',
            subcomponent: 'Drago__Object',
            type: 'output',
            value: this.value,
            multi: true,
        });

        
    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `${nodes.output1}`;
    }


}

DragoComponents.prototype.Drago_Protected_ObjectSlim = Drago_Protected_ObjectSlim;

class Drago_Protected_ObjectMembers extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.value = options.value || this.value;
        this.title = 'Object';
        this.textId = this.id+'-text';
        this.scopeBlock = true;
    }

    init() {
        this.addRow({
            name: 'input1',
            subcomponent: 'Drago__Object',
            type: 'info',
            value: this.value,
            multi: true,
        });

        if(this.value == 'life') {
            this.addRow({
                name: 'input2',
                subcomponent: 'Drago__List',
                list: [
                    'stopMoving',
                    'startFindAndSeek'
                ],

                datatype: 'string',
                type: 'variable',
            });
        } else {
            this.addRow({
                name: 'input2',
                subcomponent: 'Drago__String',
                type: 'input',
                value: this.value,
                multi: true,
            });
        }

        this.addRow({
            name: 'output1',
            subcomponent: 'Drago__Output',
            type: 'output',
            multi: true,
        });
        
        
    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `${this.value}.${nodes.input2.replace(/`/g,'')}();\n`;
    }


}

DragoComponents.prototype.Drago_Protected_ObjectMembers = Drago_Protected_ObjectMembers;

class Drago_Protected_ObjectSetData extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.value = options.value || this.value;
        this.title = 'Set Data';
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
            subcomponent: 'Drago__Object',
            type: 'info',
            value: this.value,
            multi: true,
        });

        if(this.value == 'life') {
            this.addRow({
                name: 'input2',
                subcomponent: 'Drago__List',
                list: [
                    'gotoId',
                ],
                datatype: 'string',
                type: 'variable',
                process:true,
            });
            this.addRow({
                name: 'input3',
                type: 'input',
                label: 'Value'
            });
        } else {
            this.addRow({
                name: 'input2',
                subcomponent: 'Drago__String',
                type: 'input',
                value: this.value,
                multi: true,
                process:true,
            });
            this.addRow({
                name: 'input3',
                subcomponent: 'Drago__String',
                type: 'input',
                value: this.value,
                multi: true,
                process:true,
            });
        }
        
        
    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `${this.value}.data[${nodes.input2}] = ${nodes.input3};\n`;
    }


}

DragoComponents.prototype.Drago_Protected_ObjectSetData = Drago_Protected_ObjectSetData;

class Drago_Protected_ObjectSetProperty extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
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
            subcomponent: 'Drago__Object',
            type: 'info',
            value: this.value,
            multi: true,
        });

        if(this.value == 'life') {
            this.addRow({
                name: 'input2',
                subcomponent: 'Drago__List',
                list: [
                    'do',
                    'gotoId',
                    'targetId',
                    'dead',
                    'command'
                ],
                datatype: 'string',
                type: 'variable',
                process:true,
            });
            this.addRow({
                name: 'input3',
                type: 'input',
                label: 'Value'
            });
        } else {
            this.addRow({
                name: 'input2',
                subcomponent: 'Drago__String',
                type: 'input',
                value: this.value,
                multi: true,
                process:true,
            });
            this.addRow({
                name: 'input3',
                subcomponent: 'Drago__String',
                type: 'input',
                value: this.value,
                multi: true,
                process:true,
            });
        }
        
        
    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `${this.value}.[${nodes.input2}] = ${nodes.input3};\n`;
    }


}

DragoComponents.prototype.Drago_Protected_ObjectSetProperty = Drago_Protected_ObjectSetProperty;

class Drago_Protected_ObjectData extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.value = options.value || this.value;
        this.title = 'Object';
        this.textId = this.id+'-text';
        this.scopeBlock = true;
    }

    init() {
        
        this.addRow({
            name: 'output1',
            subcomponent: 'Drago__Object',
            type: 'output',
            value: this.value,
            multi: true,
        });

        if(this.value == 'life') {
            this.addRow({
                name: 'output2',
                subcomponent: 'Drago__List',
                list: [
                    'do',
                    'gotoId',
                    'targetId',
                    'dead',
                    'command'
                ],
                datatype: 'string',
                type: 'variable',
            });

        } else {
            this.addRow({
                name: 'output2',
                subcomponent: 'Drago__String',
                type: 'output',
                value: this.value,
                multi: true,
            });
        }

        this.addRow({
            name: 'output1',
            type: 'output',
            subcomponent: 'Drago__Output',
            label: 'Output',
            multi: true,
        });
    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `${this.value}.data[${nodes.output2}]`;
    }


}

DragoComponents.prototype.Drago_Protected_ObjectData = Drago_Protected_ObjectData;

class Drago_Protected_Object extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.value = options.value || this.value;
        this.title = 'Object';
        this.textId = this.id+'-text';
        this.scopeBlock = true;
    }

    init() {
        
        this.addRow({
            name: 'output1',
            subcomponent: 'Drago__Object',
            type: 'output',
            value: this.value,
            multi: true,
        });

        if(this.value == 'life') {
            this.addRow({
                name: 'output2',
                subcomponent: 'Drago__List',
                list: [
                    'seekObj',
                    'targetId'
                ],
                datatype: 'string',
                type: 'output',
            });

        } else {
            this.addRow({
                name: 'output2',
                subcomponent: 'Drago__String',
                type: 'output',
                value: this.value,
                multi: true,
            });
        }
    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `${nodes.output1}`;
    }


}

DragoComponents.prototype.Drago_Protected_Object = Drago_Protected_Object;

class Drago_Datatype_Int extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);

        this.title = 'Int';
        this.slim = true;
        this.textId = this.id+'-text';
        
    }

    init() {
        this.addRow({
            name: 'output1',
            subcomponent: 'Drago__Int',
            type: 'output',
            multi: true,
        });

    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `${nodes.output1}`;
    }


}

DragoComponents.prototype.Drago_Datatype_Int = Drago_Datatype_Int;

class Drago_Datatype_Undefined extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.title = 'Data';
        this.slim = true; 
    }

    init() {
        this.addRow({
            name: 'output1',
            subcomponent: 'Drago__Undefined',
            type: 'output',
            multi: true,
        });

    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `${nodes.output1}`;
    }


}

DragoComponents.prototype.Drago_Datatype_Undefined = Drago_Datatype_Undefined;

class Drago_Objects_Date extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);

        this.title = 'Date';
        this.slim = true;
        this.textId = this.id+'-text';
        this.scopeBlock = true;
        
    }

    init() {
        this.addRow({
            name: 'output1',
            subcomponent: 'Drago__Date',
            type: 'output',
            multi: true,
        });

    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `${nodes.output1}`;
    }

}

DragoComponents.prototype.Drago_Objects_Date = Drago_Objects_Date;

class Drago_Property_ObjectProperty extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.title = 'Property';
        this.textId = this.id+'-text';
    }

    init() {

        this.addRow({
            name: 'input1',
            type: 'input',
            label: 'Object'
        });
        
        this.addRow({
            name: 'input2',
            type: 'input',
            label: 'Property'
        });    
        
        this.addRow({
            name: 'output1',
            type: 'output',
            subcomponent: 'Drago__Output',
            label: 'Output',
            multi: true,
        });
    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `${nodes.input1}[${nodes.input2}]`;
    }

}

DragoComponents.prototype.Drago_Property_ObjectProperty = Drago_Property_ObjectProperty;

class Drago_Member_ObjectMember extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.title = 'Execute Member';
        this.textId = this.id+'-text';
    }

    init() {
        this.addRow({
            name: 'input1',
            subcomponent: 'Drago__Start',
            type: 'input',
            label: 'Start'
        });
        this.addRow({
            name: 'input1',
            type: 'input',
            label: 'Object'
        });

        this.addRow({
            name: 'input2',
            type: 'input',
            label: 'Member'
        });

        this.addRow({
            name: 'input3',
            type: 'input',
            label: 'Arguments'
        });

        
        
    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `${nodes.input1}.${nodes.input2.replace(/`/g,'')}(${nodes.input3});\n`;
    }

}

DragoComponents.prototype.Drago_Member_ObjectMember = Drago_Member_ObjectMember;

class Drago_Datatype_Variable extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.type='event'
        this.title = 'Create Variable';
        this.textId = this.id+'-text';
    }

    init() {
        this.addRow({
            name: 'input1',
            subcomponent: 'Drago__Start',
            type: 'input',
            label: 'Create'
        });
        this.addRow({
            name: 'input2',
            type: 'input',
            label: 'Name'
        });

        this.addRow({
            name: 'input3',
            type: 'input',
            label: 'Value'
        });
        
        this.addRow({
            name: 'output1',
            type: 'output',
            label: 'Value',
            multi: true,
            subcomponent: 'Drago__StrippedVariable',
            variable: 'input2',
        });
        
        
    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `var ${nodes.input2.replace(/`/g,'')} = ${nodes.input3}\n`;
    }

}

DragoComponents.prototype.Drago_Datatype_Variable = Drago_Datatype_Variable;

class Drago_Triggers_Trigger extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);

        this.title = 'Trigger';
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
            name: 'variable1',
            subcomponent: 'Drago__Raw',
            type: 'variable',
            label: 'Hello',
            process:true
        });
    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `${nodes.variable1}();\n`;
    }

}

DragoComponents.prototype.Drago_Triggers_Trigger = Drago_Triggers_Trigger;


class Drago_Property_SetProperty extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.title = 'Set Property';
        this.textId = this.id+'-text';
    }

    init() {
        this.addRow({
            type: 'input',
            label: '',
            subcomponent: 'Drago__Start',
        });

        this.addRow({
            name: 'input1',
            type: 'input',
            label: 'Object'
        });

        this.addRow({
            name: 'input2',
            type: 'input',
            label: 'Property'
        });

        this.addRow({
            name: 'input3',
            type: 'input',
            label: 'Value'
        });

    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `${nodes.input1}[${nodes.input2}] = ${nodes.input3};\n`;
    }

}

DragoComponents.prototype.Drago_Property_SetProperty = Drago_Property_SetProperty;

class Drago_Debug_Log extends DragoContainer {

    constructor(drago, id, options) {
        super(drago, id, options);
        this.title = 'Log';
    }

    init() {
        this.addRow({
            name: 'input1',
            type: 'input',
            label: 'Log'
        });
        this.addRow({
            name: 'output1',
            subcomponent: 'Drago__Output',
            type: 'output',
            label: 'Show Inventory',
            multi: true,
        });
    }

    code() {
        let nodes = this.processInputsAndOutputs();
        return `console.log(${nodes.input1})`;
    }

}

DragoComponents.prototype.Drago_Debug_Log = Drago_Debug_Log;

class Drago_Output_Javascript extends DragoContainer {
    constructor(drago, id, options) {
        super(drago, id, options);
        this.title = 'Javascript';
        this.settings = {
            cssClass: 'wideboy'
        }
    }
    init() {

        this.addRow({
            name: 'input1',
            type: 'variable',
            label: '',
            id: 'code_output',
            subcomponent: 'Drago__Multiline',
        });
        
    }
    code() {
        return ``;
    }
}

DragoComponents.prototype.Drago_Output_Javascript = Drago_Output_Javascript;