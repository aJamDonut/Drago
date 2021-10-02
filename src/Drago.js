class Drago {

    constructor(stageId) {
        
        this.stage = $(stageId);
        this.svg = document.getElementById("dragoDrawArea");
        this.svgElem = $(this.svg);
        this.lastPathId = 1;
        this.lastLinkId = 1;
        this.containers = {};
        this.lastContainerId = 0;
        this.lastClicked = false;
        this.position = {x: 0, y: 0};
        this.isMouseDown = false;
        this.clickPos = {x: 0, y:0};
        this.links = {};
        this.code = "NOTGENERATED";
        this.events = {};
        this.maxProcesses = 0
        this.components = new DragoComponents();
        this.subcomponents = new DragoSubComponents();
        this.dataclasses = new DragoDataClasses();
        this.lowestContainerY = 1000;
        this.lowestContainerX = 1000;
        
        setTimeout(()=>{this.addToolbar()}, 100);
        
        //document.oncontextmenu = function(e){e.preventDefault()};

        $('a').on('click', function(event) {
            event.preventDefault();
            history.pushState({}, '', this.href);
          });

          setTimeout(() => {
            this.drawLinks();
          }, 1000)
        
    }

    restrictTo(restricted) {
        this.restrictedTo = restricted;
    }

    isRestricted(className) {

        if(!this.restrictedTo) {
            return false;
        }

        let ex = className.split("_");

        if(ex.length >= 3) {
            
            if(this.restrictedTo.includes(ex[0]+"_"+ex[1])) {
                return false; //Is included as part of a category e.g. Drago_Convo
            }
        }

        if(this.restrictedTo) {
            if(this.restrictedTo.includes(className)) {
                return false; //Is included explicitly e.g. Drago_Convo_Start
            }
        }

        return true;
    }

    getCode() {
        return this.code;
    }

    getJson() {
        return JSON.stringify(this);
    }
    save() {
        localStorage.setItem('drago_save', this.getJson());
    }

    import(save) {
        save = JSON.parse(save);
        
        this.lastContainerId = save.lastContainerId;

        this.importContainers(save.containers);
        
        this.importLinks(save.links);

        this.drawLinks();
        this.tick(); //Kick off tick        
        
        //Dirty hack for now.. Lines dont appear to draw immediately
        $(".title:first-child").trigger('mousedown');
        setTimeout(()=>{

            $(".title:first-child").trigger('mouseup');
        }, 1)
    }

    importContainers(containers) {
        let containerKeys = Object.keys(containers);
        if(containerKeys.length == 0) {
            return false; //No containers
        }

        for(let i = 0; i < containerKeys.length; i++) {
            this.importContainer(containerKeys[i], containers[containerKeys[i]]);
        }

        

    }

    importContainer(id, container) {
        this.newContainer({value: container.value, rows: container.rows, id: id, component: container.component, type: container.options.type, x: container.x, y: container.y});
        
    }

    importLinks(links) {
        let linkKeys = Object.keys(links);
        for(let i = 0; i < linkKeys.length; i++) {
            this.importLink(links[linkKeys[i]]);
        }
    }

    importLink(link) {
        this.addLink(link.inputContainerId, link.inputRowId, link.outputContainerId, link.outputRowId);
    }

    toJSON() {
        return {
            links: this.links,
            lastContainerId: this.lastContainerId,
            containers: this.containers
        }
    }

    addToolbar() {
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
        
        `);
        let knownTabs = [];
        for(let i = 0; i < components.length; i++) {

            if(this.isRestricted(components[i])) {
                continue;
            }

            let componentClass = DragoComponents.prototype[components[i]]
            
            let settings = componentClass.settings;
            if(!settings) {
                settings = {};
            }
            let component = components[i].split('_');
            let tab = "#"+component[1];
            if(!knownTabs.includes(tab)) {
                knownTabs.push(tab);
                $("#tabs").append(`<div id="${component[1]}" class="tab-content"></div>`);
                $("#menu").append(`<li><input type='button' class='tab' data-tab='${component[1]}' value='${component[1]}'/></li>`);
            }
            $("#all").append(`<input type='button' class='${settings.cssClass} Drago_addComponent' data-component='${components[i]}' value='${component[component.length-1]}'/>`);
            $(tab).append(`<input type='button' class='${settings.cssClass} Drago_addComponent' data-component='${components[i]}' value='${component[component.length-1]}'/>`);
        }

        this.addToolbarBinds();

    }

    addToolbarBinds() {
        let _self = this;

        $('.tab').on('mouseup', function() {
            $(".tab-content").hide();
            $("#"+$(this).attr('data-tab')).show();
        });

        $('.Drago_addComponent').on('mouseup', function() {
            _self.newContainer({component: $(this).attr('data-component'), x: 100, y: window.innerHeight-200});
        });
    }

    svgPoint(x, y) {

        var pt = this.svg.createSVGPoint();
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(this.svg.getScreenCTM().inverse());

    }

    createSmoothPath(startX, startY, endX, endY, color) {
        startY = startY - $("#stage-container").scrollTop();
        endY = endY - $("#stage-container").scrollTop();


        startX = startX - $("#stage-container").scrollLeft();
        endX = endX - $("#stage-container").scrollLeft();

        let ptA = this.svgPoint(startX, startY);
        let ptB = this.svgPoint(endX, endY);
        return this.createPath(ptA.x, ptA.y, ptB.x, ptB.y, ptA.x+50, ptA.y, ptB.x-50, ptB.y, color);
    }

    createPath(startX, startY, endX, endY, startCX, startCY, endCX, endCY, color) {
        if(!color) {
            color = 'black';
        }

        this.lastPathId++
        const newpath = document.createElementNS('http://www.w3.org/2000/svg',"path");  
        newpath.setAttribute("id", "path"+this.lastPathId);  
        newpath.setAttribute("d", this.makePath(startX, startY, endX, endY, startCX, startCY, endCX, endCY));  
        newpath.setAttribute("stroke", color);  
        newpath.setAttribute("stroke-width", 3);  
        newpath.setAttribute("opacity", 0.5);  
        newpath.setAttribute("fill", "none");
        this.svg.appendChild(newpath);
        return "path"+this.lastPathId;
    }

    makeSmoothPath(startX, startY, endX, endY) {
        let ptA = this.svgPoint(startX, startY);
        let ptB = this.svgPoint(endX, endY);
        return this.makePath(ptA.x, ptA.y, ptB.x, ptB.y, ptA.x+25, ptA.y, ptB.x-25, ptB.y);
    }

    makePath(startX, startY, endX, endY, startCX, startCY, endCX, endCY) {
        return `M${startX},${startY} C${startCX},${startCY} ${endCX},${endCY} ${endX},${endY}`;
    }


    
    mouseDown(e, clicked) {
        this.clickPos = {...this.position};
        this.isMouseDown = true;
        this.lastClicked = $(clicked);
        this.lastClickedX = this.lastClicked.css('left').replace('px','');
        this.lastClickedY = this.lastClicked.css('top').replace('px','');
    }

    mouseMove(e) {
        this.position.x = e.clientX;
        this.position.y = e.clientY;
    }

    mouseUp(e) {
        
        this.isMouseDown = false;
        this.lastClicked = false;
        this.drawLinks();//refresh
    }

    addChild(child) {
        this.stage.append(child.html());
        child.get();
    }

    getContainer(id) {
        return this.containers[id];
    }

    linkNodes(startNode, endNode) {
        //Flip types if wrong direction
        if(startNode.options.type == 'input') {
            return this.linkNodes(endNode, startNode)
        }
        this.addLink(startNode.container.id, startNode.id, endNode.container.id, endNode.id);
    }

    addLink(inputContainerId, inputRowId, outputContainerId, outputRowId) {
        this.lastLinkId++;
        let id = 'link-'+inputRowId+"-"+outputRowId;
        if(this.links[id]) {
            return false; //Already exists (can occur on multi types)
        }
        if(!this.containers[inputContainerId]) {
            console.error("[DRAGO] Can't find input container", inputContainerId);
        }
        if(!this.containers[outputContainerId]) {
            console.error("[DRAGO] Can't find output container", outputContainerId);
        }

        let inputContainer = this.getContainer(inputContainerId);
        let outputContainer = this.getContainer(outputContainerId);

        let inputRow = inputContainer.getRow(inputRowId)
        let outputRow = outputContainer.getRow(outputRowId)

        if(!inputRow) {
            console.error("[DRAGO] Can't find input", inputRowId);
        }
        if(!outputRow) {
            console.error("[DRAGO] Can't find output", outputRowId);
        }

        inputRow.addLink(id);
        outputRow.addLink(id);

        try {
            this.links[id] = new DragoLink(this, id, inputContainer, outputContainer, inputRow, outputRow);
            inputRow.link.push(this.links[id]);
            outputRow.link.push(this.links[id]);
        } catch(e) {
            console.error(e);
            console.log(this.links[id]);

        }

    }


    removeLink(id) {
        if(!this.links[id]) {
            return; //Already no link here
        }
        this.links[id].destroy();
        delete this.links[id];
        this.drawLinks(); //Refresh links;
    }

    removeLinks(links) {
        for(let i = 0; i < links.length; i++) {
            this.removeLink(links[i]);
        }
    }

    drawLinks() {
        this.svgElem.empty();
        let keys = Object.keys(this.links);
        for(let i = 0; i < keys.length; i++) {
            this.links[keys[i]].draw();
        }
        this.recode();
    }

    init() {
        
        const start = this.newContainer({component: 'Drago_Convo_Start', type: 'event', title: 'Event', x: 200, y: 50});
        const start2 = this.newContainer({component: 'Drago_Convo_Start', type: 'event', title: 'Event', x: 200, y: 150});
        const start3 = this.newContainer({component: 'Drago_Convo_Start', type: 'event', title: 'Event', x: 200, y: 250});
        const start4 = this.newContainer({component: 'Drago_Convo_Start', type: 'event', title: 'Event', x: 200, y: 350});
        const start5 = this.newContainer({component: 'Drago_Convo_Start', type: 'event', title: 'Event', x: 200, y: 450});

        //const title = this.newContainer({component: 'Drago_Datatype_String', type: 'event', title: 'Event', x: 300, y: 50});

        //const dialog = this.newContainer({component: 'Drago_Convo_Dialog', type: 'event', title: 'Event', x: 500, y: 250});

        this.drawLinks();
        this.tick(); //Kick off tick       
        
    }

    newContainer(options) {
        let id;
        if(options.id) {
            id = options.id;
        } else {
            id = 'container'+this.lastContainerId++;
        }
        
        let container;

        if(options.component && this.components[options.component]) {
            //Uses a custom component
            container = new this.components[options.component](this, id, options);
        } else {
            //Uses the default component (empty)
            container = new DragoContainer(this, id, options);
        }
        this.containers[id] = container;
        if(container.type == 'event' || options.type == 'event') { //Double options is on load
            //Events are the start of code, so lets put them in their own special list.
            this.events[id] = container; //TODO: add remove when we add remove later
            container.type = 'event';
        }
        this.addChild(container);
        container.component = options.component;
        container.init(); //Any init code (that relies on dom etc)
        container.x = options.x;
        container.y = options.y;
        this.setBinds();
        return container;
    }

    setBinds() {

        var _self = this; //Rebind for use in callbacks
        /*
        $(".container").on('mousedown', function(e){
            _self.mouseDown(e, this);
        })
        $(".container").on('mouseup', function(e){
            _self.mouseUp(e);
        })
        */
        this.stage.on('mousemove', function(e){
            _self.mouseMove(e);
        });
        this.stage.on('mouseup', function(e){
            _self.mouseUp(e);
        });

        $(".input .row-left").on('mousedown', function(){

        });

        $(".output .row-right").on('mousedown', function(){

        });

    }

    update() {

        if(!this.isMouseDown || !this.lastClicked) {
            return false;
        }

        let stageHeight = this.lowestContainerX + 500;
        let stageWidth = this.lowestContainerY + 500;

        $("#dragoDrawArea").attr('width', stageWidth);
        $("#dragoDrawArea").attr('height', stageHeight);
        $("#dragoDrawArea").attr('viewBox', `0 0 ${stageWidth} ${stageHeight}`);

        $("#stage").attr('width', stageWidth);
        $("#stage").attr('height', stageHeight);
        $("#stage").attr('viewBox', `0 0 ${stageWidth} ${stageHeight}`);
        
        this.drawLinks();
        let container = this.lastClicked;

        let addX = Math.abs(this.lastClickedX - this.position.x);
        let addY = Math.abs(this.lastClickedY - this.position.y);
      
        
        if(this.lastClicked.type == 'row') {
            let row = this.lastClicked;
            let padding = 7.5;
            if(this.lastClicked.options.type == 'output') {
                this.drawLine(row.x+row.width, row.y+padding, this.position.x, this.position.y, '#29631d');
            } else if (this.lastClicked.options.type == 'input') {
                this.drawLine(row.x, row.y+padding, this.position.x, this.position.y, '#ff00ff');
            }

        } else {
            container.x = addX;
            container.y = addY;
        }
        
    }

    drawLine(startX, startY, endX, endY, color) {
        this.createSmoothPath(startX, startY, endX, endY, color);
    }

    recode() {
        this.maxProcesses = 0;
        let txtCode = $("#code_output");
        let containers = this.events; //We'll start with events as the start
        let containerIds = Object.keys(containers);
        txtCode.val(''); //Empty
        let output = '//Generated by DragoBluePrint \n';
        for(let i = 0; i < containerIds.length; i++) {
            output = output+this.processContainer(containers[containerIds[i]]);
        }
        txtCode.val(output);
        this.code = output;
        this.save();
    }


    processContainer(container) {
        this.maxProcesses++;
        if(this.maxProcesses > 10) {
            return false; //Safekeeper
        }
        return container.code();
    }

    tick() {
        try {
            this.update();
        } catch(e) {
            console.error(e);
            return;
        }
        setTimeout(()=>{this.tick()}, 1);
    }

}