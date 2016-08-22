#  A (dumb) fuzz tester for gRPC and Protocol Buffers

Currently, the only functionality is the generation of random proto messages,
exported as a function from _randomProtoMessage.js_

Should produce a valid object within your protobuf message definition.

Example:

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

*example.js*
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


   