const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

function makeid() {
	var text = "";
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	for (var i=0;i<4;i++) {
		text += chars.charAt(Math.floor(Math.random()*chars.length));
	}
	return text
}

exports.createNewSession = functions.https.onRequest((req,res) => {
	const sessionCode = makeid();
	return admin.database().ref('/queues').push({sessionCode: sessionCode}).then((snapshot) => {
		return res.redirect(303, snapshot.ref.toString());
	})
})
