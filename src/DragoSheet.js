class DragoSheet {

    constructor(pane, drago, element, folder, name) {
        this.drago = drago;
        this.pane = pane;
        this.elem = element;
        this.folder = folder;
        this.name = name;
        this.id = this.folder.id + "_" + this._clean(this.name);
        this.preload();
        this.name = name;
        this.createdTime = Date.now();
        this.lastModified = Date.now();

    }

    _clean(name) {
        return name.replace(' ', '_').toLowerCase();
    }

    default() {

        this.drago.clear();
        const start = this.drago.newContainer({ component: 'Drago_Events_DocumentReady', type: 'event', title: 'Event', x: 700, y: 650 });
        
        const output = this.drago.newContainer({ component: 'Drago_Output_Javascript', type: 'event', title: 'Javascript', x: 1500, y: 650 });
        return;

    }

    save() {
        this.folder.storage.save(this.id, this.drago.getJson());
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            createdTime: this.createdTime,
            lastModified: this.lastModified
        };
    }

    addHtml() {
        let html = `

            <li class='panel-listing sheet' data-owner='${this.folder.id}' data-id='${this.id}'  data-name='${this.name}'>
                <span class='filetype-sheet'>
                    <i class="icon far fa-file"></i>
                    <input disabled='disabled' type="input" data-owner='${this.folder.id}' data-id='${this.id}'  data-name='${this.name}' class="input-text-inline" value="${this.name}"/>
                </span>
            </li>
            
        `;
        this.elem.append(html);
        this.pane.rebind();
    }

    preload() {
        this.addHtml();
    }

}