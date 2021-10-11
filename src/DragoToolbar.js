class DragoToolbar {

    constructor(drago) {
        this.drago = drago;
        this.addToolbar();
    }

    addToolbar() {

        this.drago.leftPane = new DragoPane('Drago_Left', this.drago);

        this.drago.folder = new DragoFolder(this.drago.leftPane, this.drago, $("#Drago_Left #default-folder"), 'root', 'default');

        let components = Object.keys(DragoComponents.prototype);

        $("body").append(`
        
            <div id='Drago_Tools'>
                <div>
                    <ul id="menu" class="menu">
                        <li><input type='button' class='tab' data-tab='all' value='All'/></li>
                    </ul>
                    <div style='clear: both'></div>
                    <div id="tabs">
                        <div id="all" class="tab-content"></div>
                    </div>
                </div>
            </div>

            <div id="Drago_Garbage">
            </div>
        
        `);
        let knownTabs = [];
        for (let i = 0; i < components.length; i++) {

            if (this.drago.isRestricted(components[i])) {
                continue;
            }

            let componentClass = DragoComponents.prototype[components[i]]

            let settings = componentClass.settings;
            if (!settings) {
                settings = {};
            }
            let component = components[i].split('_');
            let tab = "#" + component[1];
            if (!knownTabs.includes(tab)) {
                knownTabs.push(tab);
                $("#tabs").append(`<div id="${component[1]}" class="tab-content"></div>`);
                $("#menu").append(`<li><input type='button' class='tab' data-tab='${component[1]}' value='${component[1]}'/></li>`);
            }
            $("#all").append(`<input type='button' class='${settings.cssClass} Drago_addComponent' data-component='${components[i]}' value='${component[component.length - 1]}'/>`);
            $(tab).append(`<input type='button' class='${settings.cssClass} Drago_addComponent' data-component='${components[i]}' value='${component[component.length - 1]}'/>`);
        }

        this.importLibs();

        this.addToolbarBinds();

        this.drago.folder.addDefaultFolderSetup();


    }

    importLibs() {
        //Only importing PIXI for now, add others later
        if (!this.drago.libs.all.PIXI) {
            throw `Can't import PIXI lib`;
        }


        $("#tabs").append(`<div id="PIXI" class="tab-content"></div>`);
        $("#menu").append(`<li><input type='button' class='tab' data-tab='PIXI' value='PIXI'/></li>`);

        this.importClasses("#PIXI", "PIXI", this.drago.libs.all.PIXI.classes)

    }

    importClasses(elemId, ownerName, classes) {
        let elem = $(elemId);
        //@TODO: make progmatci
        let allowed = ['Sprite', 'Container'];
        for (let i = 0; i < allowed.length; i++) {
            let name = allowed[i];
            let definition = classes[name];
            if (!definition) {
                throw `Can't find class: ${name}`
            }
            elem.append(`<input type='button' class='Drago_addComponent' data-type="auto" data-name="${name}" data-owner="${ownerName}"" data-component='${ownerName}.${name}' value='${ownerName}.${name}'/>`);
        }

    }

    addToolbarBinds() {
        let _self = this;

        $('.tab').on('mouseup', function () {
            $(".tab-content").hide();
            $("#" + $(this).attr('data-tab')).show();
        });

        $('.Drago_addComponent').on('mouseup', function () {
            _self.drago.newContainer({ 
                component: $(this).attr('data-component'),
                x: _self.drago.position.x + 300,
                y: _self.drago.position.y + 100,
                type: $(this).attr('data-type') || 'core',
                owner: $(this).attr('data-owner') || false,
                name: $(this).attr('data-name') || false,
            });
        });
    }

}