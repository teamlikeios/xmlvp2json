
var xmldoc = require('xmldoc');
var packageData=null;
var primitifTypes = ["int","float","double","number","date","string"];

var isPrimitf = function(str){
    return primitifTypes.indexOf(str.toLowerCase())>-1;
}
/**
* @param onlyLastPackage parfois il se peu que le diagramme récupère des package d'autre diagramme de classe, cela permet de limiter la recherche
*/
var parseData= function parseData(data,packageWithSameName){
    //  try{
    //transformation de xml->json
    var document = new xmldoc.XmlDocument(data);
    var children = document.children;
    var classeIds = {};
    var models;
    var allClasses = [];
    var allExtends = [];

    /** search le name "Diagrams" dans le child courant*/
    var searchDiagrams = function(array){
        if(array){
            for(var j =0;j<array.length;j++){
                if(array[j].name=="Diagrams"){
                    var children = array[j].children;
                    return children;
                }
            }
        }
        return null;
    }
    var searchClassDiagram = function(array){
        if(array){
            for(var j =0;j<array.length;j++){
                if(array[j].name=="ClassDiagram"){
                    var children = array[j].children;
                    return children;
                }
            }
        }
        return null;
    }
    var searchConnectors = function(array){
        if(array){
            for(var j =0;j<array.length;j++){
                if(array[j].name=="Connectors"){
                    var children = array[j].children;
                    return children;
                }
            }
        }
        return null;
    }

    var searchAllGeneralizationAttributes = function(array){
        var diagrams = searchDiagrams(array);

        var classDiagram = searchClassDiagram(diagrams);

        var connectors = searchConnectors(classDiagram);

        var generalizations = [];

        if(connectors){
            for(var j =0;j<connectors.length;j++){
                if(connectors[j].name=="Generalization"){
                    var attr = connectors[j].attr;
                    generalizations.push(attr);
                }
            }
        }
        return generalizations;
    }

    var searchClassDiagramName = function(array){
        for(var j =0;j<array.length;j++){
            if(array[j].name=="Diagrams"){
                var children = array[j].children;
                return children[0].attr.Name;
            }
        }
        return null;
    }
    var packageName = searchClassDiagramName(children);


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
    var searchMasterView = function(array){
        for(var j =0;j<array.length;j++){
            if(array[j].name=="MasterView"){
                return array[j].children;
            }
        }
        return null;
    }
    var searchClassId = function(array,className){
        for(var j =0;j<array.length;j++){
            if(array[j].name=="Class"){
                if(array[j].attr.Name == className){
                    return array[j].attr.Idref
                }
            }
        }
        return null;
    }
    var searchIdref = function(array,className){

        var masterView = searchMasterView(array);
        if(masterView){
            return searchClassId(masterView,className)
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
                var idRef = searchIdref(searchAttributes,oneClass.name);
                classeIds[idRef] = oneClass;
                oneClass.id_ref = idRef;
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
                                is_constant : (attribute.ReadOnly=="true"&&attribute.InitialValue!=null),
                                default : attribute.InitialValue,
                                multiplicity : (attribute.TypeModifier ? 0 : 1),
                                is_primitif : isPrimitf(type)
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



                if(!packageWithSameName||(children[i].attr.Name==packageName)){
                    packageData = searchModelChildren(children[i].children)
                    console.log("\n\n\nNo Package Data \n\n\n");
                    parseModels(packageData);
                }
            }
        }
    }
    parseModels(models.children)
    var addExtends = function(allExtends){
        allExtends.forEach(function(extend){
            classeIds[extend.To].extend =  classeIds[extend.From];

        });
    }
    allExtends  = searchAllGeneralizationAttributes(children);
    addExtends(allExtends);
    console.log(allClasses);
    return allClasses;
    //}
    /* catch(e){
        console.log("\n\n\n*************\n ERROR \n\n");
        console.log(JSON.stringify(e,null,'\t'));
        console.log("\n\n\n*************\n\n\n");
        return null;
    }*/

}


module.exports = parseData;
