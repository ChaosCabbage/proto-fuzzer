function ConstantToFunction(c)
{
    return (() => c)
}

function SingleFieldMutators(field)
{
    switch (field.type.name) {
        case "message": return MessageMutators(field)
        case "enum": return EnumMutators(field)
        case "bytes": return BytesMutators()
        case "bool" : return BoolMutators()
    }
    
    var type = typeof field.type.defaultValue;
	
	if (type == 'number') {
		return NumberMutators();
    }

    if (type == 'string') {
        return StringMutators();
    }

    console.warn("Unknown field type: " + field.type.name)
    return []
}

function RepeatedFieldMutators(field)
{
    console.warn("Repeated fields aren't handled very intelligently yet")

    const constants = [
        []
    ].map(ConstantToFunction)

    return constants 
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

function ToSubMutation(mutation, fieldName)
{
    return (message => {
        var m = DeepClone(message)
        m[fieldName] = mutation(m[fieldName])
        return m
    })
}

function MessageMutators(protoMessageType)
{
    const constants = [{}, null].map(ConstantToFunction)
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
    }

    return [].concat(constants, mutations) 
}

function NumberMutators()
{
    const constants = [0, -1, 1, 2, 10000000, -10000000].map(ConstantToFunction)
    const mutators = [
        x => x+1,
        x => x-1,
        x => x+35,
        x => x-35,
        x => -x
    ]
    // That's Numberwang!
    return [].concat(constants, mutators)
}

function StringMutators()
{
    // There are better databases for this sort of thing;
    // this is just to get started.
    const constants = [
        "", 
        "$HOME", 
        "\n\n\n\r\n", 
        "%s%d", 
        "null", 
        "' OR 1=1/*", 
        "bob".repeat(10000)
    ].map(ConstantToFunction)

    const mutators = [
        s => s.repeat(1000),
        s => s + "\n",
        s => s.toUpperCase(),
        s => "!" + s
    ]

    return [].concat(constants, mutators)
}

function BytesMutators() 
{
    console.warn("bytes: not implemented")
    return []
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

function BoolMutators()
{
    return [true, false].map(ConstantToFunction)
}

module.exports = function(protoMessageSpec) 
{
	return MessageMutators(protoMessageSpec.$type)
}