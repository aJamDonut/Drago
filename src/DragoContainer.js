class DragoContainer {

    components = {};

    constructor(drago, id, options) {
        this.type = 'container';
        this.drago = drago;
        this.scopeBlock = false;
        this.id = id;
        this.elem = false; //No elem
        this.options = options;
        this.lastRowId = 0;
        this.rows = {};
        this.title = options.title || ' ';
        this.input = {};
        this.output = {};
        this.property = {};
        this.info = {};
        this.variable = {};
        this.settings = this.constructor.settings || {};
        
    }

    toJSON() {
        return {
            rows: this.rows,
            type: this.type,
            options: this.options,
            value: this.value,
            component: this.component,
            x: this.x,
            y: this.y
        }
    }

    set x(val) {
        val = Math.floor(val/10)*10;
        if(this.drago.lowestContainerX<val) {
            this.drago.lowestContainerX = val
        }
        this.elem.css('left', val + "px");
    }

    set y(val) {
        val = Math.floor(val/12)*12;
        if(this.drago.lowestContainerY<val) {
            this.drago.lowestContainerY = val
        }
        this.elem.css('top', val + "px");
    }

    get x() {
        return parseInt(this.elem.css('left').replace('px', ''));
    }

    get y() {
        return parseInt(this.elem.css('top').replace('px', ''));
    }

    get width() {
        return parseInt(this.elem.css('width').replace('px', ''));
    }

    get() {
        this.elem = $("#" + this.id);
        this.setBinds();
        return this.elem;
    }

    init() {

    }

    setBinds() {

        //Set binds for container (nothing exists yet)

        this.elem.on("mousedown", () => {
            var maxZ = Math.max.apply(null, 
             $.map($('body *'), function(e,n) {
                if ($(e).css('position') != 'static')
                return parseInt($(e).css('z-index')) || 1;
            }));
            
            this.elem.css('z-index', maxZ++);
        });

        this.elem.children(".title").on('mousedown', () => {
            this.drago.clickPos = { ...this.drago.position };
            this.drago.isMouseDown = true;
            this.drago.lastClicked = this;
            this.drago.lastClickedX = this.drago.position.x - this.drago.lastClicked.x;
            this.drago.lastClickedY = this.drago.position.y - this.drago.lastClicked.y;

            

        });

        this.elem.children(".title").children(".xButton").on('mousedown', () => {
            this.destroy();
        });

        this.elem.children(".title").children(".minButton").on('mousedown', () => {
            if(this.elem.hasClass('hidden')) {
                this.show();
            } else {
                this.hide();
            }
        });

        console.log("Options", this.options.hidden)
        if(this.options.hidden) {
            this.hide();
        }

    }

    show() {
        this.options.hidden = false;
        this.elem.removeClass('hidden');
    }

    hide() {
        this.options.hidden = true;
        this.elem.addClass('hidden');
    }

    addChild(child) {
        this.elem.append(child.html());

        child.get();
    }


    
    destroy() {
        let rows = Object.keys(this.rows);
        for(var i = 0; i < rows.length; i++) {
            this.rows[rows[i]].destroyLink(); //Remove row links first
        }
        delete this.drago.containers[this.id]; //Destroy from drago;
        delete this.drago.events[this.id]; //Try destroy from root events if it exists there

        this.elem.remove();
    }

    addRow(options) {
        this.lastRowId++
        if (!options) {
            options = {
                label: 'Default',
                type: 'input',
                name: this.id
            }
        }
        if (!options.name) {
            options.name = this.id;
        }
        let id = this.id + '-row-' + this.lastRowId;
        let row;
        if (options.subcomponent && this.drago.subcomponents[options.subcomponent]) {
            row = new this.drago.subcomponents[options.subcomponent](this, id, options);
        } else {
            row = new DragoRow(this, id, options);
        }
        //Set value of the row from load
        if(this.options.rows && this.options.rows[id]) {
            row.value = this.options.rows[id].value;
        }
        this.addChild(row);
        row.subcomponent = options.subcomponent;
        row.init();
        this.rows[id] = row;
        this[options.type][row.name] = row; //Add to a list of its type input or output by name
        return row;
    }

    getRow(id) {
        return this.rows[id];
    }

    code() {
        return ``;
    }

    processInputsAndOutputs() {
        //Process variables first
        //Then inputs
        //Then outputs
        this.data = {};
        this.data.variables = this.processVariables();
        this.data.inputs = this.processInputs();
        this.data.outputs = this.processOutputs();
        
        return {...this.data.variables, ...this.data.inputs, ...this.data.outputs}
        
    }

    processInputs() {

        let data = {};
        let inputs = this.input;
        let keys = Object.keys(inputs);

        for (let i = 0; i < keys.length; i++) {
            let input = inputs[keys[i]];
            data[input.name] = ''; //Always pass false by default
            if (!input.link) {
                continue; //Nothing linked yet
            }
            if(Array.isArray(input.link)) {
                //Multi
                for(let i = 0; i < input.link.length; i++) {
                    data[input.name] = data[input.name] + input.link[i].inputRow.code();
                }
            }
            
        }

        return data;
    }

    processOutputs() {

        let data = {};
        let outputs = this.output;
        let keys = Object.keys(outputs);
        for (let i = 0; i < keys.length; i++) {
            let output = outputs[keys[i]];
            if(!output.options.process) {
                continue;
            }
            data[output.name] = ''; //Always pass false by default
            if (!output.link) {
                continue; //Nothing linked yet
            }
            if(Array.isArray(output.link)) {
                //Multi
                for(let i = 0; i < output.link.length; i++) {
                    data[output.name] = data[output.name] + this.drago.processContainer(output.link[i].outputContainer);
                }
            }
        }

        return data;
    }

    processVariables() {

        let data = {};
        let variables = this.variable;
        let keys = Object.keys(variables);
        for (let i = 0; i < keys.length; i++) {
            let variable = variables[keys[i]];
            data[variable.name] = ''; //Always pass false by default
            data[variable.name] = variable.code();
        }

        return data;
    }

    html() {
        if(!this.slim) {
            return `
        <div class="container ${this.settings.cssClass}" id="${this.id}">
            <div class="row title">
                <span>${this.title}</span>
                <span class='xButton'>x</span>
                <span class='minButton'>-</span>
            </div>
        </div>
`
        } else {
            return `
            <div class="container slim ${this.settings.cssClass}" id="${this.id}">
                <div class="row title">
                    <span class='xButton'>x</span>
                    <span>${this.title}</span>
                </div>
            </div>
`
        
        }
    }
}