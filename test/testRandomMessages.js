var grpc = require("grpc");
var expect = require("expect.js");

var randomMessager = require("../randomProtoMessage");

var protos = grpc.load(__dirname + "/data/fuzzables.proto");

describe('randomProtoMessage', function() {
  it('should handle an empty message', function() {
    var mess = randomMessager(protos.ProtoFuzz.Empty);
	expect(mess).to.be.empty();
  });
  
  it('should produce the correct basic types', function() {
	var numbers = randomMessager(protos.ProtoFuzz.SomeNumbers); 
	expect(numbers).to.only.have.keys("a","b","c");
	expect(numbers.a).to.be.a("number");
	expect(numbers.b).to.be.a("number");
	expect(numbers.c).to.be.a("number");	
	
	expect(numbers.a).to.eql(Math.round(numbers.a)); // Must be an integer
	expect(numbers.b).to.eql(Math.round(numbers.b)); // Must be an integer
	expect(numbers.b >= 0);                          // Unsigned, must be positive
  });
  
  it('should produce bytes for the bytes type', function() {
	var bytes = randomMessager(protos.ProtoFuzz.SomeBytes); 
	expect(bytes).to.only.have.keys("data");
	expect(Buffer.isBuffer(bytes.data));
  });
  
  it('should give enums a valid value', function() {
	var mess = randomMessager(protos.ProtoFuzz.MessageWithNestedEnum); 
	expect(mess).to.only.have.keys("family", "name", "tasty");
	expect(mess.family).to.be.within(0, 4);
	expect(mess.name).to.be.a("string");
  });
  
  it('should handle nested messages', function() {
	var mess = randomMessager(protos.ProtoFuzz.NestedMessage); 
	expect(mess).to.only.have.keys("a","b");
	expect(mess.a).to.only.have.keys("a","b","c");
	expect(mess.b).to.only.have.keys("data");
  });
  
  it('should handle repeated fields', function() {
	var mess = randomMessager(protos.ProtoFuzz.RepeatedThings); 
	expect(mess).to.only.have.keys("a","b");
	expect(mess.a).to.be.an("array");
	expect(mess.b).to.be.an("array");
	
	mess.a.forEach(function(item) {
		expect(item).to.be.a("string");
	});
	
	mess.b.forEach(function(item) {
		expect(item).to.only.have.keys("a","b");
	});	
  });
  
});


