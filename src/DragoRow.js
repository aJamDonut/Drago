class DragoRow {
    constructor(container, id, options) {
        this.type = 'row';
        this.container = container;
        this.id = id;
        this.subcomponent = options.subcomponent || 'DragoRow';
        this.link = [];
        this.links = {};
        this.elem = false;
        this.options = options;
        this.linkId = false;
        this.name = options.name || this.id;
        this.value = options.value || '';
    }
    set x(val) {
        this.elem.css('left', val+"px");
    }

    set y(val) {
        this.elem.css('top',  val+"px");
    }

    get x() {
        return this.container.x + this.elem[0].offsetLeft;
    }

    get y() {
        return this.container.y + this.elem[0].offsetTop;
    }

    get width() {
        return parseInt(this.elem.css('width').replace('px', ''));
    }

    addLink(id) {
        this.links[id] = true;
    }

    destroyLink() {
        this.container.drago.removeLinks(Object.keys(this.links));
        this.links = {};
    }

    toJSON() {
        try {
            this.code(); //Execute once to generate values
        } catch(e) {
            console.error(e)
            console.error(this);
            throw 'Nope';
        }
        return {
            type: this.type,
            id: this.id,
            options: this.options,
            subcomponent: this.subcomponent,
            value: this.value
        }
    }
    code() {
        return '';
    }

    setBinds() {
        this.elem.children(".output .row-right").on('mousedown', (e) => {
            if(!this.options.multi || e.which == 3) {
                this.destroyLink();
            }
            this.clickPos = {...this.container.drago.position};
            this.container.drago.isMouseDown = true;
            this.container.drago.lastClicked = this
            this.container.drago.lastClickedX = this.container.drago.lastClicked.x;
            this.container.drago.lastClickedY = this.container.drago.lastClicked.y;
        });

        this.elem.children(".output .row-right").on('mouseup', (e) => {
            if(!this.options.multi || e.which == 3) {
                this.destroyLink();
            }
            if(this.container.drago.lastClicked && this.container.drago.lastClicked.id !== this.id) {
                //Dropped on an node and its not the same as me.
                if(this.container.id !== this.drago.lastClicked.container.id) {
                    this.container.drago.linkNodes(this.container.drago.lastClicked, this);
                }
            }
            this.container.drago.isMouseDown = false;
            this.container.drago.lastClicked = false;
        });

        this.elem.children(".property .row-right").on('mousedown', (e) => {
            if(!this.options.multi || e.which == 3) {
                this.destroyLink();
            }
            this.clickPos = {...this.container.drago.position};
            this.container.drago.isMouseDown = true;
            this.container.drago.lastClicked = this
            this.container.drago.lastClickedX = this.container.drago.lastClicked.x;
            this.container.drago.lastClickedY = this.container.drago.lastClicked.y;
        });

        this.elem.children(".property .row-right").on('mouseup', (e) => {
            if(!this.options.multi || e.which == 3) {
                this.destroyLink();
            }
            if(this.container.drago.lastClicked && this.container.drago.lastClicked.id !== this.id) {
                //Dropped on an node and its not the same as me.
                if(this.container.id !== this.drago.lastClicked.container.id) {
                    this.container.drago.linkNodes(this.container.drago.lastClicked, this);
                }
            }
            this.container.drago.isMouseDown = false;
            this.container.drago.lastClicked = false;
        });
        
        this.elem.children(".input .row-left").on('mousedown', (e) => {
            if(!this.options.multi || e.which == 3) {
                this.destroyLink();
            }
            this.clickPos = {...this.container.drago.position};
            this.container.drago.isMouseDown = true;
            this.container.drago.lastClicked = this
            this.container.drago.lastClickedX = this.container.drago.lastClicked.x;
            this.container.drago.lastClickedY = this.container.drago.lastClicked.y;
        });

        this.elem.children(".input .row-left").on('mouseup', (e) => {
            if(!this.options.multi || e.which == 3) {
                this.destroyLink();
            }
            if(this.container.drago.lastClicked && this.container.drago.lastClicked.id !== this.id) {
                //Dropped on an node and its not the same as me.
                this.container.drago.linkNodes(this.container.drago.lastClicked, this);
            }
            this.container.drago.isMouseDown = false;
            this.container.drago.lastClicked = false;
        });



        
    }

    get() {
        this.elem = $("#"+this.id);
        this.setBinds();
        return this.elem;
    }
    
    display() {
        return `${this.options.label}`;
    }

    init() {

    }
    
    val() {
        return "Hello world";
    }

    html() {
        let display = this.display();
        let process = (this.options.process) ? 'process' : '';
        let rowHTML = `
            <div id="${this.id}" class="row ${this.options.type} ${process} ${this.subcomponent}">
                <div class="row-left"></div>
                <div class="row-middle">${display}</div>
                <div class="row-right"></div>
            </div>
            `;
        return rowHTML;
    }

    
}