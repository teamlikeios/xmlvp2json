
var xmldoc = require('xmldoc');

var parseData= function parseData(data){
    try{
        //transformation de xml->json
        var document = new xmldoc.XmlDocument(data);
        var children = document.children;
        var models;
        var allClasses = [];

        for(var i=0;i<children.length;i++){
            if(children[i].name == "Models"){
                models = children[i];
                break;
            }
        }
        var searchModelChildren = function(array){
            for(var j =0;j<array.length;j++){
                if(array[j].name=="ModelChildren"){
                    return array[j].children;
                }
            }
            return null;
        }
        var parseModels = function(children){
            for(var i=0;i<children.length;i++){
                if(children[i].name=="Class"){
                    oneClass = {
                        attributes:[]
                        ,operations:[]
                    };
                    var classCrt = children[i];
                    oneClass.name = classCrt.attr.Name;
                    oneClass.comment = classCrt.attr.Documentation_plain;

                    var searchAttributes = classCrt.children;
                    var attributes=searchModelChildren(searchAttributes);

                    if(attributes){
                        for(j=0;j<attributes.length;j++){
                            if(attributes[j].name == "Attribute"){
                                attribute = attributes[j].attr;
                                var type;
                                if(attribute.Type)
                                    type = attribute.Type;
                                else if(attributes[j].firstChild && attributes[j].firstChild.firstChild){
                                    type = attributes[j].firstChild.firstChild.attr.Name;
                                }
                                var attributeCrt = {
                                    comment : attribute.Documentation_plain,
                                    name : attribute.Name, 
                                    type : type,
                                    scope : attribute.Scope,
                                    read_only : attribute.ReadOnly,
                                    have_getter : attribute.HasGetter,
                                    have_setter : attribute.HasSetter,
                                    visibility : attribute.Visibility,
                                    multiplicity : (attribute.TypeModifier ? 0 : 1)
                                }
                                oneClass.attributes.push(attributeCrt);
                            }
                            else if(attributes[j].name == "Operation"){
                                var operation = attributes[j];
                                var operationCrt = {
                                    name : operation.attr.Name
                                    ,visibility : operation.attr.Visibility
                                    ,static : operation.attr.Static
                                    ,abstrac : operation.attr.Abstract
                                    ,scope : operation.attr.Scope
                                    ,parameters : []
                                    ,return_type : operation.attr.ReturnType
                                    ,comment : operation.attr.Documentation_plain
                                    ,return_comment : operation.attr.ReturnTypeDocumentation_plain
                                };

                                for(var z=0;z<operation.children.length;z++){
                                    if(operation.children[z].name == "ReturnType"){
                                        operationCrt.return_type = operation.children[z].firstChild.attr.Name;
                                    }
                                    else if(operation.children[z].name == "ModelChildren"){
                                        var parameters = operation.children[z].children;
                                        var x = 0;
                                        for(x=0;x<parameters.length;x++){
                                            var parameterCrt = {};
                                            if(parameters[x].name=="Parameter"){
                                                parameterCrt.name = parameters[x].attr.Name;
                                                parameterCrt.comment = parameters[x].attr.Documentation_plain;
                                                parameterCrt.multiplicity = (parameters[x].attr.TypeModifier ? 0 : 1)

                                                if(parameters[x].attr.Type)
                                                    parameterCrt.type = parameters[x].attr.Type;
                                                else if(parameters[x].firstChild && parameters[x].firstChild.firstChild){
                                                    parameterCrt.type = parameters[x].firstChild.firstChild.attr.Name;
                                                }

                                            }
                                            operationCrt.parameters.push(parameterCrt);
                                        }
                                    }
                                }
                                oneClass.operations.push(operationCrt);
                            }
                        }
                    }
                    allClasses.push(oneClass);
                }
                else if(children[i].name=="Package"){

                    var data = searchModelChildren(children[i].children)

                    if(data){
                        parseModels(data);
                    }
                }
            }
        }
        parseModels(models.children)
        return allClasses;
    }
    catch(e){
        return null;
    }

}


module.exports = parseData;
