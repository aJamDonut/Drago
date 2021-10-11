class DragoLibHandler {

    constructor(drago, onLoaded) {
        this.drago = drago;
        this.onLoaded = onLoaded;
        this.init();
        this.all = {};
    }

    init() {
        //Hardcoding pixi for now since it's the only one
        fetch('src/libtypes/pixi.types.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                //Pass namespace here as name
                this.loadLib("PIXI", data.data);
                this.onLoaded();
            });

    }

    loadLib(name, definitions) {
        this.all[name] = {
            name: name,
            classes: {},
            _definitions: definitions
        };
        for (let i = 0; i < definitions.length; i++) {
            if (definitions[i]['members'].length > 1) {
                /**
                 * During development I never saw this go past one...?
                 * But if it does, I guess just loop through each one?
                 */
                throw 'Found definition longer than one';
            }

            let definition = definitions[i]['members'][0];

            for (let j = 0; j < definition.members.length; j++) {
                this.loadLibMember(this.all[name], definition.members[j]);
            }
            
        }
    }

    loadLibMemberFromName(owner, name) {
        //Seems sometimes to leak data, we can clean by trimming all past <
        if(name.indexOf("<") > 0) {
            name = name.substr(0,name.indexOf("<"));
        }
        
        let definitions = owner._definitions;
        for (let i = 0; i < definitions.length; i++) {
            if (definitions[i]['members'].length > 1) {
                /**
                 * During development I never saw this go past one...?
                 * But if it does, I guess just loop through each one?
                 */
                throw 'Found definition longer than one';
            }

            let definition = definitions[i]['members'][0];
            for (let j = 0; j < definition.members.length; j++) {
                if(definition.members[j].name==name) {
                    return this.loadLibMember(owner, definition.members[j]);
                }
            }
            
        }
        console.error(`Tried to load member but couldn't find ${name}, possibly not exported type (hidden class)`);
        return {
            rows: {
            },
            methods: {
            },
            properties: {
            }
        };
        //throw `Tried to load member but couldn't find ${name}`;
    }

    loadExtenders(owner, member) {
        if(member.kind !== 'Class') {
            return {};
        }

        if(!member.extendsTokenRange || Number.isInteger(member.extendsTokenRange)) {
            //Class is not extended so send base clase
            return {
                rows: {
                },
                methods: {
                },
                properties: {
                }
            };
        }

        let tokens = member.excerptTokens;

        let range = member.extendsTokenRange;
        let extend = ''
        
        for (let j = range.startIndex; j < range.endIndex; j++) {
            //@TODO: handle kind: Reference
            let kind = tokens[j].text;
            let paramVal = tokens[j].text.trim();
            extend = `${extend}${paramVal}`;
        }

        return this.loadLibMemberFromName(owner, extend);

    }

    loadLibMember(owner, member) {

        if(owner.classes[member.name]) {
            //Already loaded, maybe it was a dependency
            return owner.classes[member.name];
        }

        switch (member.kind) {
            case "Class":
                return this.loadLibClass(owner, member);
            case "Variable":
                return this.loadLibVariable(owner, member);
            case "Interface":
                return this.loadLibInterface(owner, member);
            case "Namespace":
                return this.loadLibNamespace(owner, member);
            case "TypeAlias":
                return this.loadLibTypeAlias(owner, member);
            case "Function":
                return this.loadLibFunction(owner, member);
            case "Enum":
                return this.loadLibEnum(owner, member);
            default:
                throw `${member.kind} not handled in switch case`;
        }
    }

    loadLibClass(owner, member) {
        owner.classes[member.name] = this.loadExtenders(owner, member);

        
        
        if (member.members) {
            this.loadMembers(owner.classes[member.name], member.members);
        }
        return owner.classes[member.name];
    }

    loadMembers(owner, members) {
        for (let i = 0; i < members.length; i++) {
            let member = members[i];
            this.loadMember(owner, member);
        }
    }

    loadMember(owner, member) {
        
        switch (member.kind) {
            case "Constructor":
                break;
            case "Method":
                this.addMethod(owner, member);
                break;
            case "Property":
                this.addProperty(owner, member);
                break;
        }
    }

    addMethod(owner, member) {

        let newMethod = {
            name: member.name,
            params: this.getParams(member)
        };

        owner.methods[member.name] = newMethod;
    }

    addProperty(owner, member) {
        let newProperty = {
            name: member.name,
            type: this.getParams(member)
        }

        owner.properties[member.name] = newProperty;
        //console.log("Property", member);
    }

    getParams(member) {

        if (!member.parameters) {
            return false;
        }

        let tokens = member.excerptTokens;

        let params = {};
        for (let i = 0; i < member.parameters.length; i++) {
            let param = member.parameters[i];
            let name = param.parameterName;
            let range = param.parameterTypeTokenRange;
            let accepts = ''
            
            for (let j = range.startIndex; j < range.endIndex; j++) {
                //@TODO: handle kind: Reference
                let kind = tokens[j].text;
                let paramVal = tokens[j].text;
                accepts = `${accepts}${paramVal}`;
            }

            params[name] = {
                name: name,
                accepts: accepts
            }

        }

        return params;

    }

    addConstructor(owner, member) {

    }

    loadLibVariable(owner, member) {

    }

    loadLibInterface(owner, member) {

    }

    loadLibNamespace(owner, member) {

    }

    loadLibTypeAlias(owner, member) {

    }

    loadLibFunction(owner, member) {

    }

    loadLibEnum(owner, member) {

    }





}