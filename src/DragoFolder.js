class DragoFolder {

    constructor(pane, drago, element, parentId, name) {

        this.parentId = parentId;
        this.elem = element;
        this.pane = pane;
        this.drago = drago;
        this.storage = drago.storage;
        this.sheets = {};
        this.folders = {};
        this.open = true;
        this.createdTime = Date.now();
        this.lastModified = Date.now();
        
        

        this.name = name;

        this.id = this.parentId + "sheet" + this._clean(this.name);
        
        this.file = `folder_${this.id}`;

        this.drago.folders[this.id] = this;

        this.preload();

    }

    
    addDefaultFolderSetup() {
        if (!this.drago.activeSheet) {
            let folder = this.drago.folders[Object.keys(this.drago.folders)[0]];
            let sheet = folder.addSheet('Default Sheet');
            folder.openSheet(sheet.name);
            return;
        }
    }

    openSheet(name) {
        
        let sheet = this.sheets[name];
        
        this.drago.setActiveSheet(sheet);
        if(!this.storage.exists(sheet.id)) {
            sheet.default();
            return;
        }

        this.drago.clear();
        let sheetData = this.storage.read(sheet.id);
        this.drago.import(sheetData);

        
    }

    getUniqueName(name, type) {
       
        
        let found = 1;
        let nameCheck = name;
        while(Number.isInteger(found)) {
            if(!this.drago.folders[this.id][type][nameCheck]) {
                return nameCheck;
            }
            nameCheck = name + found;
            found++;
        }
    }

    toJSON() {
        return {
            sheets: this.sheets,
            folders: this.folders,
            open: this.open,
            createdTime: this.createdTime,
            lastModified: this.lastModified,
            name: this.name,
            file: this.file
        }
    }

    _clean(name) {
        return name.replace(' ', '_').toLowerCase();
    }

    addHtml() {
        let html = `
        <ul>
            <li data-owner="${this.id}" id="${this.id}" class='panel-listing folder'>
                <i id="${this.id}-dropup" data-owner="${this.id}" class="icon icon-dropup fas fa-chevron-right" style='display:none'></i>
                <i id="${this.id}-dropdown" data-owner="${this.id}" class="icon icon-dropdown fas fa-chevron-down"></i>
                <span class='filetype-folder'>
                    <i class="icon far fa-folder"></i>
                    ${this.name}
                </span>
            </li>
            <ul id="${this.id}-contents" data-owner="${this.id}" class='pane-subfolder'>
                
            </ul>
        </ul>
        `;
        this.elem.prepend(html);
        this.childElements = $(`#${this.id}-contents`);
        this.rebind();
    }

    rebind() {

    }

    save() {
        this.storage.save(this.file, this);
    }

    addFolder(name) {
        name = this.getUniqueName(name, 'folders');
        return this.folders[name] = new DragoFolder(this.pane, this.drago, this.childElements, this.id, name);
    }

    addSheet(name) {
        name = this.getUniqueName(name, 'sheets');
        return this.sheets[name] = new DragoSheet(this.pane, this.drago, this.childElements, this, name);
    }

    preload() {
        
        this.addHtml();

        if (!this.storage.exists(this.file)) {
            this.save();
        }

        let data = this.storage.read(this.file);

        this.open = data.open;

        this._importSheets(data);
        this._importFolders(data);

        
    }

    _importSheets(data) {
        let keys = Object.keys(data.sheets);

        for(let i = 0; i < keys.length; i++) {

            let sheet = data.sheets[keys[i]];
            this.addSheet(sheet.name);

        }
    }

    _importFolders(data) {
        let keys = Object.keys(data.folders);

        for(let i = 0; i < keys.length; i++) {

            let folder = data.folders[keys[i]];
            this.addFolder(folder.name);

        }
    }

}