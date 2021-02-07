const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.addMessage = functions.https.onRequest(async (req, res) => {
    const original = req.query.text;
    const writeResult = await admin.firestore().collection("messages")
        .add({ original: original });
    res.json({ result: `Message with ID: ${writeResult.id} added.` })
});

exports.makeUppercase = functions.firestore.document('messages/{documentId}')
    .onCreate((snap, context) => {
        const original = snap.data().original;
        functions.logger.log('Uppercasing', context.params.documentId, original);
        const uppercase = original.toUpperCase();
        return snap.ref.set({ uppercase }, { merge: true });
    });

exports.assignAgent = functions.firestore.document('rooms/{documentId}')
    .onCreate((snap, context)=>{

        let agents = ["U1Y990JqJpY36cqUvuWHGAnZSoI2", "it9vsbKJVRRaVPESuHo9vb3AYjd2", "wglLUK7y2sNphd7ztZZUGzZOa4y2"];

        const roomId = context.params.documentId;
        //const room = snap.data();

        //search for agent -> routing
        let agent = agents[Math.floor(Math.random()*3)]; //random

        //assign an agent
        const document = db.collection("rooms").doc(roomId);
        document.update({
            csUserId : agent
        });
    });
