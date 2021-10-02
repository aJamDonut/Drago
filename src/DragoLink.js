class DragoLink {
    constructor(drago, id, inputContainer, outputContainer, inputRow, outputRow) {
        this.id = id;
        this.padding = 7.5; //Just some offset from margins and stuff
        this.drago = drago;
        this.inputContainer = inputContainer;
        this.outputContainer = outputContainer;
        this.inputRow = inputRow;
        this.outputRow = outputRow;
        
        this.inputContainer.processInputsAndOutputs(); //Process inputs//outputs incase its complex
        this.outputContainer.processInputsAndOutputs();
       
    }
    draw() {
        if(this.inputRow.options.process) {
            this.drago.createSmoothPath(this.inputContainer.x+this.inputContainer.width, this.inputRow.y+this.padding, this.outputContainer.x, this.outputRow.y+this.padding, '#002e08')
        } else {
            this.drago.createSmoothPath(this.inputContainer.x+this.inputContainer.width, this.inputRow.y+this.padding, this.outputContainer.x, this.outputRow.y+this.padding, '#696969')
        }
        
    }
    destroy() {
        
        
        for(let i = 0; i < this.inputRow.link.length; i++) {
            if(this.inputRow.link[i].id == this.id) {
                this.inputRow.link.splice(i, 1);
                break;
            }
        }

        for(let i = 0; i < this.outputRow.link.length; i++) {
            if(this.outputRow.link[i].id == this.id) {
                this.outputRow.link.splice(i, 1);
                break;
            }
        }
    }

    toJSON() {
        return {
            id: this.id,
            inputContainerId: this.inputContainer.id,
            outputContainerId: this.outputContainer.id,
            inputRowId: this.inputRow.id,
            outputRowId: this.outputRow.id
        }
    }
}