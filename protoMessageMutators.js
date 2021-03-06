function ConstantToFunction(c)
{
    return () => c
}

function Import(path) 
{
    const mutatabase = require(path)
    return [].concat(
        mutatabase.constants.map(ConstantToFunction),
        mutatabase.mutators
    )
}

const stringMutators = Import("./mutators/string")
const intMutators = Import("./mutators/int")
const floatMutators = Import("./mutators/float")
const boolMutators = Import("./mutators/bool")
const bytesMutators = Import("./mutators/bytes")
const wholeArrayMutators = Import("./mutators/array")

function SingleFieldMutators(field)
{
    switch (field.type.name) {
        case "message": return MessageMutators(field.resolvedType)
        case "enum": return EnumMutators(field)
        case "bytes": return bytesMutators
        case "bool" : return boolMutators
        case "string" : return stringMutators
        case "double": return floatMutators
        case "float" : return floatMutators
    }

	if (typeof field.type.defaultValue == 'number') {
		return intMutators;
    }

    console.warn("Unknown field type: " + field.type.name)
    
    return []
}

function RepeatedFieldMutators(field)
{
    const singleMutators = SingleFieldMutators(field)
    const componentMutators = singleMutators.map(mutator => (
        arr => arr.map(mutator)
    ))

    return [].concat(componentMutators, wholeArrayMutators)
}

function FieldMutators(field) 
{
	if (field.repeated) {
		return RepeatedFieldMutators(field);
	} else {
		return SingleFieldMutators(field);
	}
}

function DeepClone(object)
{
    return JSON.parse(JSON.stringify(object))
}

function MutateField(message, mutation, fieldName)
{
    if (message === null || message === undefined ||
        message[fieldName] === null || message[fieldName] === undefined) {
            return null
    }
    var m = DeepClone(message)
    m[fieldName] = mutation(m[fieldName])
    return m
}

function ToSubMutation(mutation, fieldName)
{
    return (message => MutateField(message, mutation, fieldName))
}

function DeleteFieldMutation(fieldName)
{
    return (message => {
        if (message === null || message === undefined) return null
        var m = DeepClone(message)
        delete m[fieldName]
        return m
    })
} 

function MessageMutators(protoMessageType)
{
    const constants = [
        {}
    ].map(ConstantToFunction)
    
    let mutations = []

    for (var name in protoMessageType._fieldsByName) {
		var field = protoMessageType._fieldsByName[name];
		
		if (field.oneof) {
			console.warn("oneof fields aren't handled yet")
			continue;
        }
        
        const subMutations = FieldMutators(field)
        mutations = mutations.concat(
            subMutations.map(mut => ToSubMutation(mut, name))
        )
        mutations.push(
            DeleteFieldMutation(name)
        )
    }

    return [].concat(constants, mutations) 
}


function EnumMutators(field)
{
    const enums = field.resolvedType.object;
    const size = Object.keys(enums).length;
    
    // Let's just try all of them.
    // If size is 4, this produces an array like [0,1,2,3]
    const options = [...Array(size).keys()]
    return options.map(ConstantToFunction)
}

module.exports = function(protoMessageSpec) 
{
	return MessageMutators(protoMessageSpec.$type)
}