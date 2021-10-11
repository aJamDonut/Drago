class Drago {

    constructor(stageId) {

        this.storage = new DragoStorage(this, { compress: LZString.compress, decompress: LZString.decompress });
        this.folders = {};
        
        this.preloadSettings();

        
        this.stage = $(stageId);
        this.svg = document.getElementById("dragoDrawArea");
        this.container = $("#stage-container");
        this.svgElem = $(this.svg);
        this.lastPathId = 1;
        this.lastLinkId = 1;
        this.containers = {};
        this.lastContainerId = 0;
        this.lastClicked = false;
        this.position = { x: 0, y: 0 };
        this.isMouseDown = false;
        this.clickPos = { x: 0, y: 0 };
        this.links = {};
        this.code = "NOTGENERATED";
        this.events = {};
        this.maxProcesses = 0
        this.components = new DragoComponents();
        this.subcomponents = new DragoSubComponents();
        this.dataclasses = new DragoDataClasses();
        this.lowestContainerY = 1000;
        this.lowestContainerX = 1000;

        this.activeSheet = false;
        

        this.outputColor = '#97F49F';
        this.inputColor = '#616161';

        this.mouse = {};
        let container = document.getElementById('stage-container')

        //Start offset
        container.scrollTop = 500;
        container.scrollLeft = 400;

        this.scrollLeft = container.scrollLeft;
        this.scrollTop = container.scrollTop;

        

        
        //document.oncontextmenu = function(e){e.preventDefault()};

        $('a').on('click', function (event) {
            event.preventDefault();
            history.pushState({}, '', this.href);
        });

        setTimeout(() => {
            this.drawLinks();
        }, 1000)

        this.init();

        this.setStageBinds();
        
        this.libs = new DragoLibHandler(this, ()=>{
            this.toolbar = new DragoToolbar(this);
        });

    }


    preloadSettings() {
        this.settingsFile = 'settings';

        this.settings = {
            projectName: 'drago1'
        };

        if (!this.storage.exists(this.settingsFile)) {
            console.log("[Drago] Loading for the first time");
            this.storage.save(this.settingsFile, this.settings)
        }

        this.settings = this.storage.read(this.settingsFile);

    }

    clear() {
        this.stage.empty();
        this.containers = {};
        this.links = {};
        this.events = {};
    }

    lDown(event) {
        this.mouse.ldown = true;
        this.mouse.downX = this.position.x;
        this.mouse.downY = this.position.y;
        let container = document.getElementById('stage-container')

        this.startLeft = container.scrollLeft
        this.startTop = container.scrollTop
    }
    lUp(event) {
        this.mouse.ldown = false;
    }
    _dragScreenTick() {
        //Runs every tick
        if (!this.mouse.ldown) {
            return false;
        }

        let x = this.position.x;
        let y = this.position.y;

        let distX = (this.mouse.downX - x);
        let distY = (this.mouse.downY - y);

        let left = (this.startLeft - distX);
        let top = (this.startTop - distY);

        let container = document.getElementById('stage-container')

        container.scrollTop = this.startTop + distY;
        container.scrollLeft = this.startLeft + distX;

        this.scrollTop = container.scrollTop;
        this.scrollLeft = container.scrollLeft;

        let stageHeight = parseInt(this.container.css('height').replace('px', ''));
        let stageWidth = parseInt(this.container.css('width').replace('px', ''));

        //$("#dragoDrawArea").attr('width', stageWidth);
        //$("#dragoDrawArea").attr('height', stageHeight);

        //$("#dragoDrawArea").attr('viewBox', `-${left} -${top} ${stageWidth} ${stageHeight}`);

        return
        /*
        let stageHeight = this.lowestContainerX + 500;
        let stageWidth = this.lowestContainerY + 500;

        $("#dragoDrawArea").attr('width', stageWidth);
        $("#dragoDrawArea").attr('height', stageHeight);
        $("#dragoDrawArea").attr('viewBox', `0 0 ${stageWidth} ${stageHeight}`);

        $("#stage").attr('width', stageWidth);
        $("#stage").attr('height', stageHeight);
        $("#stage").attr('viewBox', `0 0 ${stageWidth} ${stageHeight}`);
        */
    }
    setStageBinds() {
        let _self = this;
        this.stage.on('mousedown', (e) => {
            if (e.which == 1) {
                _self.lDown(e);
                //LCLICK
            }
            if (e.which == 2) {
                //MCLICK
            }
            if (e.which == 3) {
                //RCLICK
            }

            //_self.mouseUp(e);
        });
        this.stage.on('mouseup', (e) => {
            if (e.which == 1) {
                _self.lUp(e);
                //LCLICK
            }
            if (e.which == 2) {
                //MCLICK
            }
            if (e.which == 3) {
                //RCLICK
            }

            //_self.mouseUp(e);
        });
    }

    restrictTo(restricted) {
        this.restrictedTo = restricted;
    }

    setActiveSheet(sheet) {
        this.activeSheet = sheet;
    }

    isRestricted(className) {

        if (!this.restrictedTo) {
            return false;
        }

        let ex = className.split("_");

        if (ex.length >= 3) {

            if (this.restrictedTo.includes(ex[0] + "_" + ex[1])) {

                return false; //Is included as part of a category e.g. Drago_Convo
            }
        }

        if (this.restrictedTo) {
            if (this.restrictedTo.includes(className)) {
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
        if(!this.activeSheet || this.folders.length === 0) {
            return false; //No folders can't possibly save
        }        
        
        if(this.saving) {
            clearTimeout(this.saving);
        }
        this.saving = setTimeout(() => {
            this.activeSheet.save(); //Delay dedupe
        }, 100);
        
        
    }

    recreateContainer(id) {

        if(!this.containers[id]) {
            return;
        }
        //This allows containers to be responsive when nodes/inputs change

        let links = JSON.stringify(this.containers[id].links);
        let clone = JSON.stringify(this.containers[id]);
        
        //Created a clone and chops off drago
        let old = Object.assign({}, this.containers[id], {drago: {}});
        this.containers[id].destroy();

        delete this.containers[id];

        this.importContainer(id, JSON.parse(clone), old);

        this.importLinks(JSON.parse(links));
        this.refreshDisplay();

    }

    import(save) {
        save = JSON.parse(save);

        this.lastContainerId = save.lastContainerId;

        this.importContainers(save.containers);

        this.importLinks(save.links);

        this.drawLinks();
        this.tick(); //Kick off tick        
        this.refreshDisplay();
        
    }

    refreshDisplay() {
        //Dirty hack for now.. Lines dont appear to draw immediately
        $(".title:first-child").trigger('mouseup');
    }
    

    importContainers(containers) {
        let containerKeys = Object.keys(containers);
        if (containerKeys.length == 0) {
            return false; //No containers
        }

        for (let i = 0; i < containerKeys.length; i++) {
            this.importContainer(containerKeys[i], containers[containerKeys[i]]);
        }



    }

    importContainer(id, container, old) {
        this.newContainer({value: container.value, rows: container.rows, id: id, component: container.component, type: container.options.type, x: container.x, y: container.y, hidden: container.options.hidden }, old);

    }

    importLinks(links) {
        let linkKeys = Object.keys(links);
        for (let i = 0; i < linkKeys.length; i++) {
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
        return this.createPath(ptA.x, ptA.y, ptB.x, ptB.y, ptA.x + 50, ptA.y, ptB.x - 50, ptB.y, color);
    }

    createPath(startX, startY, endX, endY, startCX, startCY, endCX, endCY, color) {
        if (!color) {
            color = 'black';
        }

        this.lastPathId++
        const newpath = document.createElementNS('http://www.w3.org/2000/svg', "path");
        newpath.setAttribute("id", "path" + this.lastPathId);
        newpath.setAttribute("d", this.makePath(startX, startY, endX, endY, startCX, startCY, endCX, endCY));
        newpath.setAttribute("stroke", color);
        newpath.setAttribute("stroke-width", 3);
        newpath.setAttribute("opacity", 0.5);
        newpath.setAttribute("fill", "none");
        this.svg.appendChild(newpath);
        return "path" + this.lastPathId;
    }

    makeSmoothPath(startX, startY, endX, endY) {
        let ptA = this.svgPoint(startX, startY);
        let ptB = this.svgPoint(endX, endY);
        return this.makePath(ptA.x, ptA.y, ptB.x, ptB.y, ptA.x + 25, ptA.y, ptB.x - 25, ptB.y);
    }

    makePath(startX, startY, endX, endY, startCX, startCY, endCX, endCY) {
        return `M${startX},${startY} C${startCX},${startCY} ${endCX},${endCY} ${endX},${endY}`;
    }



    mouseDown(e, clicked) {
        this.clickPos = { ...this.position };
        this.isMouseDown = true;
        this.lastClicked = $(clicked);
        this.lastClickedX = this.lastClicked.css('left').replace('px', '');
        this.lastClickedY = this.lastClicked.css('top').replace('px', '');
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
        if (startNode.options.type == 'input') {
            return this.linkNodes(endNode, startNode)
        }
        this.addLink(startNode.container.id, startNode.id, endNode.container.id, endNode.id);
    }

    addLink(inputContainerId, inputRowId, outputContainerId, outputRowId) {
        this.lastLinkId++;
        let id = 'link-' + inputRowId + "-" + outputRowId;
        if (this.links[id]) {
            return false; //Already exists (can occur on multi types)
        }
        if (!this.containers[inputContainerId]) {
            console.error("[DRAGO] Can't find input container", inputContainerId);
        }
        if (!this.containers[outputContainerId]) {
            console.error("[DRAGO] Can't find output container", outputContainerId);
        }

        let inputContainer = this.getContainer(inputContainerId);
        let outputContainer = this.getContainer(outputContainerId);

        let inputRow = inputContainer.getRow(inputRowId)
        let outputRow = outputContainer.getRow(outputRowId)

        if (!inputRow) {
            console.error("[DRAGO] Can't find input", inputRowId);
        }
        if (!outputRow) {
            console.error("[DRAGO] Can't find output", outputRowId);
        }
        

        inputRow.addLink(id);
        outputRow.addLink(id);

        try {
            this.links[id] = new DragoLink(this, id, inputContainer, outputContainer, inputRow, outputRow);
            inputContainer.addLink(this.links[id]);
            outputContainer.addLink(this.links[id]);
            inputRow.link.push(this.links[id]);
            outputRow.link.push(this.links[id]);
        } catch (e) {
            console.error(e);
            console.log(this.links[id]);
        }

    }


    removeLink(id) {
        if (!this.links[id]) {
            return; //Already no link here
        }
        this.links[id].destroy();
        delete this.links[id];
        this.drawLinks(); //Refresh links;
    }

    removeLinks(links) {
        for (let i = 0; i < links.length; i++) {
            this.removeLink(links[i]);
        }
    }

    drawLinks() {
        this.svgElem.empty();
        let keys = Object.keys(this.links);
        for (let i = 0; i < keys.length; i++) {
            this.links[keys[i]].draw();
        }
        this.recode();
    }

    init() {

        //const title = this.newContainer({component: 'Drago_Datatype_String', type: 'event', title: 'Event', x: 300, y: 50});

        //const dialog = this.newContainer({component: 'Drago_Convo_Dialog', type: 'event', title: 'Event', x: 500, y: 250});

        this.drawLinks();
        this.tick(); //Kick off tick       

    }

    newContainer(options, old) {
        let id;
        if (options.id) {
            id = options.id;
        } else {
            id = 'container' + this.lastContainerId++;
        }

        let container;

        if (options.component && this.components[options.component]) {
            //Uses a custom component
            options.containerName = options.component;
            container = new this.components[options.component](this, id, options, old);
        } else {
            
            if(options.type == 'auto') {
                //Imported from a library
                //Uses the default component (empty)
                options.containerName = 'DragoContainer';
                container = new DragoLibContainer(this, id, options, old);
            } else {
                //Uses the default component (empty)
                options.containerName = 'DragoContainer';
                container = new DragoContainer(this, id, options, old);
            }
        }
        this.containers[id] = container;
        console.log("CONTAINER", container)
        if (container.type == 'event' || options.type == 'event') { //Double options is on load
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
        $("body").on('mousemove', function (e) {
            _self.mouseMove(e);
        });
        this.stage.on('mouseup', function (e) {
            _self.mouseUp(e);
        });

        $(".input .row-left").on('mousedown', function () {

        });

        $(".output .row-right").on('mousedown', function () {

        });

        document.oncontextmenu = function (e) {
            e.preventDefault();
        }

    }

    update() {

        this._dragScreenTick();

        if (!this.isMouseDown || !this.lastClicked) {
            return false;
        }

        let stageHeight = this.lowestContainerX + 500;
        let stageWidth = this.lowestContainerY + 500;


        //TODO: removed auto-expanding when adding scrollable area
        //Maybe readd

        $("#stage").attr('width', stageWidth);
        $("#stage").attr('height', stageHeight);

        this.drawLinks();
        let container = this.lastClicked;

        let addX = Math.abs(this.lastClickedX - this.position.x);
        let addY = Math.abs(this.lastClickedY - this.position.y);


        if (this.lastClicked.type == 'row') {
            let row = this.lastClicked;
            let padding = 7.5;
            if (this.lastClicked.options.type == 'output') {
                this.drawLine(row.x + row.width, row.y + padding, this.position.x+this.scrollLeft, this.position.y+this.scrollTop, this.outputColor);
            } else if (this.lastClicked.options.type == 'input') {
                this.drawLine(row.x, row.y + padding, this.position.x+this.scrollLeft, this.position.y+this.scrollTop, this.inputColor);
            }

        } else {
            container.x = addX;
            container.y = addY;
        }

    }

    drawLine(startX, startY, endX, endY, color) {
        this.createSmoothPath(startX, startY, endX, endY, color);
    }

    sortContainers(containers) {
        //Sort containers by y
        return containers.sort(function ( a, b ) {
            if ( a.y < b.y ){
                return -1;
            }
            if ( a.y > b.y ){
                return 1;
            }
            return 0;
        })
    }

    recode() {
        this.maxProcesses = 0;
        let txtCode = $("#code_output");
        let containers = this.sortContainers(Object.values(this.events)); //We'll start with events as the start
        let containerIds = Object.keys(containers);
        txtCode.val(''); //Empty
        let output = '//Generated by DragoBluePrint \n';
        for (let i = 0; i < containerIds.length; i++) {
            output = output + this.processContainer(containers[containerIds[i]]);
        }
        txtCode.val(output);
        this.code = output;
        this.save();
    }


    processContainer(container, level) {
        if(!level) {
            level = 0;
        }
        this.maxProcesses++;
        if (this.maxProcesses > 10) {
            return false; //Safekeeper
        }
        
        return this.indentCode(container.code(level), level);
    }

    indentCode(code, level) {
        //First one nudges top row, second one indents everything, third once removes blank lines
        return code.replace(/^(?=.*\n)/g, '\n').replace(/\n(?=.*\n.*\n)/g, '\n\t').replace(/\n\t\n/g, '\n').replace(/\n\t/m, '\n');
        
    }

    tick() {
        try {
            this.update();
        } catch (e) {
            console.error(e);
            return;
        }
        setTimeout(() => { this.tick() }, 1);
    }

}