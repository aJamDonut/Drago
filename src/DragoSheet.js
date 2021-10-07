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
        const start = this.drago.newContainer({ component: 'Drago_Convo_Start', type: 'event', title: 'Event', x: 700, y: 550 });
        const start2 = this.drago.newContainer({ component: 'Drago_Convo_Start', type: 'event', title: 'Event', x: 700, y: 650 });
        const start3 = this.drago.newContainer({ component: 'Drago_Convo_Start', type: 'event', title: 'Event', x: 700, y: 750 });
        const start4 = this.drago.newContainer({ component: 'Drago_Convo_Start', type: 'event', title: 'Event', x: 700, y: 850 });
        const start5 = this.drago.newContainer({ component: 'Drago_Convo_Start', type: 'event', title: 'Event', x: 700, y: 950 });
        const output = this.drago.newContainer({ component: 'Drago_Output_Javascript', type: 'event', title: 'Event', x: 1500, y: 550 });
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
                    ${this.name}
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