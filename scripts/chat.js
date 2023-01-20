/*
Functionalities
1. Add new chat documents 
2. Setting up real time listener to get new chats
3. update username
4. Update the room (display messages in room which is clicked)
*/ 

class Chatroom {
  	//Refering to a chat room
	constructor(room, username){
		this.room = room;
		this.username = username;
		this.chats = db.collection('chats');
		this.unsub;
	}

	//Add chat to database
	async addChat(message){
		// format a chat object
		const now = new Date();
		const chat = {
			message: message,
			username: this.username,
			room: this.room,
			created_at: firebase.firestore.Timestamp.fromDate(now)
		};
		//Add the chat object as a document in database
		const response = await this.chats.add(chat);
		return response;
	}

	//Adding a realtime listener
	getChats(callback){
		this.unsub = this.chats
		.where('room', '==', this.room)//List of documents which had a change with particular chat room
		.orderBy('created_at')//Order the data wrt timestamp
		.onSnapshot(snapshot => {
			snapshot.docChanges().forEach(change => {
			if(change.type === 'added'){
				//Update UI
				callback(change.doc.data());//-> Callback func used to uodate UI
			}
			});
		});
	}

	//Update username
	updateName(username){
		this.username = username;
		localStorage.username = username;
	}

	//Update room
	updateRoom(room){
		this.room = room;
		console.log('room updated');
		if(this.unsub){
		this.unsub();
		}
	}
}