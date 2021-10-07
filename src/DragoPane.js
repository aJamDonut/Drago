class DragoPane {
    constructor(id, drago) {
        this.drago = drago;
        this.id = id;

        this.addHTML();
        this.elem = $("#" + this.id);
        this.rebind();
    }

    addHTML() {
        $("body").append(`
            <div id='${this.id}'>
                <div class='pane-section'>
                    <div class='title pane-title'>
                        Folders
                    </div>
                    <div id='default-folder' class='pane-content'>
                        
                    </div>
                </div>
            </div>
        `);
    }

    rebind() {
        let _self = this;
        $("body").on('mouseup', () => {
            $("#context-menu").remove();
        });

        $(".icon-dropdown").on('mouseup', function (e) {
            let id = $(this).attr('data-owner');
            let owner = $("#" + id);
            let contents = $("#" + id + "-contents");
            let dropup = $("#" + id + "-dropup");
            contents.hide();
            $(this).hide();
            dropup.show();
        });

        $(".icon-dropup").on('mouseup', function (e) {
            let id = $(this).attr('data-owner');
            let owner = $("#" + id);
            let contents = $("#" + id + "-contents");
            let dropdown = $("#" + id + "-dropdown");
            contents.show();
            $(this).hide();
            dropdown.show();
        });

        $('.folder').off('mouseup');
        $('.folder').on('mouseup', function (e) {
            e.preventDefault();

            if (e.which !== 3) {
                return false; //Only want right click
            }
            

            setTimeout(() => {
                $("#context-menu").remove();

                let owner = $(this).attr('data-owner');

                $("body").append(`
                <div id='context-menu'>
                    <ul>
                        <li><span data-owner='${owner}' id='newsheet'>New sheet</span></li>
                        <li><span data-owner='${owner}' id='newfolder'>New folder</span></li>
                    </ul>
                </div>
                `);

                $("#context-menu").css('left', _self.drago.position.x + "px");
                $("#context-menu").css('top', _self.drago.position.y + "px");

                $("#newfolder").off('mouseup');
                $("#newfolder").on('mouseup', function (e) {
                    let owner = $(this).attr('data-owner');
                    _self.drago.folders[owner].addFolder('New Folder');
                    _self.drago.folders[owner].save();
                });

                $("#newsheet").off('mouseup');
                $("#newsheet").on('mouseup', function (e) {
                    let owner = $(this).attr('data-owner');
                    _self.drago.folders[owner].addSheet('New Sheet');
                    _self.drago.folders[owner].save();
                });


            }, 100);
        });

        $('.sheet').off('mouseup');
        $('.sheet').on('mouseup', function (e) {
            e.preventDefault();
            if (e.which !== 1) {
                return false; //Only want left click
            }

            setTimeout(() => {
                $("#context-menu").remove();

                let owner = $(this).attr('data-owner');
                let name = $(this).attr('data-name');
                

                
                _self.drago.folders[owner].openSheet(name);
                  
                    
            }, 100);
        });

    }
}
