const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.database();

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
	return db.ref('/queues').push({sessionCode: sessionCode}).then((snapshot) => {
		return res.send(200, snapshot.key.toString())
	})
})

exports.addSongToSession = functions.https.onRequest((req,res) => {
	const sessionCode = req.query.session;
	const spotifyID = req.query.spotifyid;
	return db.ref('/queues').child(sessionCode+'/songs').push({song: spotifyID,added: Date.now()}).then((snapshot) => {
		return res.send(200, snapshot.key.toString());
	})
})

exports.playSong = functions.https.onRequest((req,res) => {
	const sessionCode = req.query.session;
	return db.ref('/queues').child(sessionCode+'/songs').orderByKey().on("child_added", function(snapshot) {
		res.send(200, snapshot.val().song.toString())
		db.ref('/queues/'+sessionCode+'/songs/'+snapshot.key).set({song: null})
		return
	})
})
