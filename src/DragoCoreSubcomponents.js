
class Drago__Blank extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
        this.textId = this.id+'-text';
    }

    code() {
        return '';
    }

    display() {
        return '';
    }
}
DragoSubComponents.prototype.Drago__Blank = Drago__Blank;


class Drago__Variable extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
        this.textId = this.id+'-text';
    }

    code() {
        return this.container.data.variables[this.options.variable] || this.container.data.inputs[this.options.variable];
    }

    display() {
        return this.options.label;
    }
}
DragoSubComponents.prototype.Drago__Variable = Drago__Variable;

class Drago__StrippedVariable extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
        this.textId = this.id+'-text';
    }

    code() {
        if(!this.container.data || ! this.container.data.variables) {
            return '';
        }
        let result = this.container.data.variables[this.options.variable] || this.container.data.inputs[this.options.variable];
        return result.replace(/`/g,'');
    }

    display() {
        return this.options.label;
    }
}
DragoSubComponents.prototype.Drago__StrippedVariable = Drago__StrippedVariable;


class Drago__Object extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
        this.textId = this.id+'-text';
        this.value = options.value;
    }

    code() {
        return this.value;
    }

    display() {
        return `
        
        <span id='${this.textId}-setprop' class='clone-setprop'>+</span>
        <span id='${this.textId}-setdata' class='clone-setdata'>+</span>
        
        <span id='${this.textId}'><u>${this.value}</u></span>
        <!--<span id='${this.textId}-properties' class='clone-properties'></span>-->
        <span id='${this.textId}-data' class='clone-data'></span>
        <span id='${this.textId}-members' class='clone-members'></span>
        <span id='${this.textId}-slim' class='clone-slim'></span>
        
        `;
    }
    init() {
        $("#"+this.textId).on('mouseup', ()=>{
            this.container.drago.newContainer({component: 'Drago_Protected_Object', x: 100, y: window.innerHeight-200, value: this.value});
        });

        $("#"+this.textId+"-slim").on('mouseup', ()=>{
            this.container.drago.newContainer({component: 'Drago_Protected_ObjectSlim', x: 100, y: window.innerHeight-200, value: this.value});
        });

        $("#"+this.textId+"-members").on('mouseup', ()=>{
            this.container.drago.newContainer({component: 'Drago_Protected_ObjectMembers', x: 100, y: window.innerHeight-200, value: this.value});
        });

        $("#"+this.textId+"-properties").on('mouseup', ()=>{
            this.container.drago.newContainer({component: 'Drago_Protected_Object', x: 100, y: window.innerHeight-200, value: this.value});
        });

        $("#"+this.textId+"-data").on('mouseup', ()=>{
            this.container.drago.newContainer({component: 'Drago_Protected_ObjectData', x: 100, y: window.innerHeight-200, value: this.value});
        });

        $("#"+this.textId+"-setprop").on('mouseup', ()=>{
            this.container.drago.newContainer({component: 'Drago_Protected_ObjectSetProperty', x: 100, y: window.innerHeight-200, value: this.value});
        });

        $("#"+this.textId+"-setdata").on('mouseup', ()=>{
            this.container.drago.newContainer({component: 'Drago_Protected_ObjectSetData', x: 100, y: window.innerHeight-200, value: this.value});
        });
    }
}
DragoSubComponents.prototype.Drago__Object = Drago__Object;

class Drago__String extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
        this.textId = this.id+'-text';
        this.value = '';
    }

    code() {
        let elem = $("#"+this.textId);
        let val = elem.val();
        this.value = elem.val();
        return "`"+val+"`"; //Return with quotes to make it a true string
    }

    display() {
        return `<input id='${this.textId}' type='text' value='${this.value}' class='Drago__String' />`;
    }
    
}

DragoSubComponents.prototype.Drago__String = Drago__String;

class Drago__Multiline extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
        this.textId = this.id+'-text';
        this.value = '';
    }

    code() {
        let elem = $("#"+this.textId);
        let val = elem.val();
        this.value = elem.val();
        return "`"+val+"`"; //Return with quotes to make it a true string
    }

    display() {
        return `<textarea id='${this.textId}' type='text' class='Drago__String' placeholder='${this.options.label}'>${this.value}</textarea><div style='clear:both;'></div>`;
    }
    
}

DragoSubComponents.prototype.Drago__Multiline = Drago__Multiline;

class Drago__Undefined extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
    }

    code() {
        return "undefined"; //Return with quotes to make it a true string
    }

    display() {
        return `undefined`;
    }
    
}

DragoSubComponents.prototype.Drago__Undefined = Drago__Undefined;


class Drago__Date extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
    }

    code() {
        return "Date.now()"; //Return with quotes to make it a true string
    }

    display() {
        return `Time (ms)`;
    }
    
}

DragoSubComponents.prototype.Drago__Date = Drago__Date;

class Drago__Label extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
        this.textId = this.id+'-text';
    }

    code() {
        return ''//Return with quotes to make it a true string
    }

    display() {
        return this.options.label;
    }
    
}

DragoSubComponents.prototype.Drago__Label = Drago__Label;

class Drago__Output extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
        this.textId = this.id+'-text';
    }

    code() {
        return this.container.code()//Return with quotes to make it a true string
    }

    display() {
        return this.options.label;
    }
    
}

DragoSubComponents.prototype.Drago__Output = Drago__Output;



class Drago__Raw extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
        this.textId = this.id+'-text';
    }

    code() {
        let elem = $("#"+this.textId);
        this.value = elem.val();
        return elem.val(); //Return with quotes to make it a true string
    }

    display() {
        return `<input id='${this.textId}' type='text' value='${this.value}' class='Drago__String' />`;
    }
}

DragoSubComponents.prototype.Drago__Raw = Drago__Raw;

class Drago__Start extends Drago__Blank {

}

DragoSubComponents.prototype.Drago__Start = Drago__Start;

class Drago__Int extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
        this.textId = this.id+'-text';
    }

    code() {
        let elem = $("#"+this.textId);
        this.value = parseInt(elem.val());
        return parseInt(elem.val()); //Return with quotes to make it a true string
    }

    display() {
        return `<input id='${this.textId}' type='text' value='${this.value}' class='Drago__String' />`;
    }
}

DragoSubComponents.prototype.Drago__Int = Drago__Int;

class Drago__Boolean extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
        this.textId = this.id+'-text';
        this.enabled = options.enabled;
    }

    code() {
        return !this.enabled;
    }

    display() {
        return !this.enabled;
    }

}

DragoSubComponents.prototype.Drago__Boolean = Drago__Boolean;

class Drago__List extends DragoRow {

    constructor(container, id, options) {
        super(container, id, options)
        this.textId = this.id+'-text';
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
        let list = '';
        if(Array.isArray(this.options.list)) {
            
            for(let i = 0; i < this.options.list.length; i++) {
                if(this.value == this.options.list[i]) {
                    list = list + `<option selected='selected'>${this.options.list[i]}</option>`;
                } else {
                    list = list + `<option>${this.options.list[i]}</option>`;
                }
            }
        }
        return `
            <select id='${this.textId}' class='Drago__List'>
                ${list}
            </select>
        `;
    }
}

DragoSubComponents.prototype.Drago__List = Drago__List;