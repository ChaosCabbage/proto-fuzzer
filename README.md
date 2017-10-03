#  A  fuzz tester for gRPC and Protocol Buffers

Currently, the functionality is in two separate functions:

- Purely random messages
  - Exported as a function from _randomProtoMessage.js_
- Deterministic mutations of an existing message
  - Exported as a function from _mutateProtoMessage.js_

Either should produce a valid object within your protobuf message definition.

## Examples

*myProtoFile.proto*
```
syntax = "proto3";

message SomeMessageType {
  message SubMessage {
	bool x = 1;
  }

  uint32          alice   = 1;
  repeated string bob     = 2;
  SubMessage      charlie = 3;  
}
```

*randomMessageExample.js*
```js
var randomProtoMessage = require("./randomProtoMessage"); 
var grpc = require("grpc");

var myProtos = grpc.load("myProtoFile.proto");

var randomMessage = randomProtoMessage(myProtos.SomeMessageType);
console.log(JSON.stringify(randomMessage));
```

*output*
```js
{
	alice: 2345612,
	bob: ["sunday", "%%£%^%%^&%$&", "\n\n\n\n\n\n\n\n\n"],
	charlie: {
		x: false
	}
}
```

*mutatedMessageExample.js*
```js
var mutateProtoMessage = require("./randomProtoMessage"); 
var grpc = require("grpc");

var myProtos = grpc.load("myProtoFile.proto");

var initialMessage = {
	alice: 3,
	bob: ["john", "paul"],
	charlie: {
		x: true	
	}
}

var mutations = mutateProtoMessage(myProtos.SomeMessageType, initialMessage);
console.log(JSON.stringify(mutations[0]));
console.log(JSON.stringify(mutations[2]));
console.log(JSON.stringify(mutations[10]));
```
   
*output*
```js
{}

{
	alice: -1,
	bob: ["john", "paul"],
	charlie: {
		x: true	
	}
}

{
	alice: 3,
	bob: ["john\n\n\n", "paul"],
	charlie: {
		x: true	
	}
}

```
