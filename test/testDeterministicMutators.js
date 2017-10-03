var grpc = require("grpc")
var expect = require("expect.js")

var Mutate = require("../mutateProtoMessage")

var protos = grpc.load(__dirname + "/data/fuzzables.proto")

function validateAll(messages, protoSpec)
{
	messages.forEach(m => new protoSpec(m))
}

describe('mutateProtoMessage', function () {
	it('should handle an empty message', function () {
		var mess = Mutate(protos.ProtoFuzz.Empty, {})
		expect(mess).to.eql([{}])
	})

	it('should handle numbers', function () {
		var numberMutations = Mutate(protos.ProtoFuzz.SomeNumbers, { a: -1, b: 1, c: 1.1 })
		validateAll(numberMutations, protos.ProtoFuzz.SomeNumbers)
	})

	it('should handle enums', function () {
		var messages = Mutate(protos.ProtoFuzz.MessageWithNestedEnum, {
			family: 2, name: "julia", tasty: true
		})
		validateAll(messages, protos.ProtoFuzz.MessageWithNestedEnum)
	})

	it('should handle nested messages', function () {
		var messages = Mutate(protos.ProtoFuzz.NestedMessage, {
			a: { a: -1, b: 1, c: 1.1 }, b: {}
		})
		validateAll(messages, protos.ProtoFuzz.NestedMessage)
	})

	it('should handle repeated fields', function () {
		var mess = Mutate(protos.ProtoFuzz.RepeatedThings, {
			a: ["mob", "fob", "yob"],
			b: [{ a: { a: -1, b: 1, c: 1.1 }, b: {} }]
		})
		validateAll(mess, protos.ProtoFuzz.RepeatedThings)
	})

})


