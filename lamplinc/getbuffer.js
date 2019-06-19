module.exports = function(RED) {
    function getbufferNode(config) {
    RED.nodes.createNode(this,config);
	var port=config.hubport
	var ip=config.hubip
	var user=config.hubuser
	var pass=config.hubpass



var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var btoa = require('btoa'); 
var httpr = new XMLHttpRequest()


        var node = this;
        node.on('input', function(msg) {

		url="http:\/\/"+user+":"+pass+"@"+ip+":"+port+"/buffstatus.xml"

		node.status({fill:"yellow",shape:"ring",text:"Connecting"})
		var done=0
		msg.debug={"url":url}
		httpr.onreadystatechange = function(){
			if(this.status==200){
				if(done==0){
					done=1
					node.send({payload:httpr.responseText.replace("<response><BS>","").replace("</BS></response>","")})
					node.status({fill:"green",shape:"ring",text:"complete"})
				}
			}
			if(this.status==401){
				done=401
				node.send({payload:"Unauthorized"})
				node.status({fill:"red",shape:"ring",text:"Error Unauthorized "})
			}
		}



		httpr.open("GET",url)
		httpr.setRequestHeader("Authorization", "Basic " + btoa(user+":"+pass))
		httpr.send()

		setTimeout(function(){
			if(done==0){
    				node.status({fill:"red", shape:"ring", text:"Error connecting to hub"});
				done=-1
				node.send({payload:"timeout",debug:url})
				httpr.abort()
			}
		}, 3000);



        });
    }

    RED.nodes.registerType("Get-buffer",getbufferNode);
}
