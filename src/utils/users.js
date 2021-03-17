const users = [];
//ADD USER
const addUser = ({ id, username, room }) => {
	//Clean the data
	username = username.trim().toLowerCase();
	room = room.trim().toLowerCase();

	//validate
	if (!username || !room) {
		return {
			error: "Username and room are required!",
		};
	}

	//check uniqueness of user
	const userExists = users.find((user) => {
		return user.room == room && user.username == username;
	});

	//report error
	if (userExists) {
		return {
			error: "Username is already in use!",
		};
	}

	//store error
	const user = { id, username, room };
	users.push(user);
	return { user };
};

// REMOVE USER
const removeUser = (id) => {
	const indexOfUser = users.findIndex((user) => {
		return user.id === id;
	});

	if (indexOfUser !== -1) {
		//splice returns an array of all elements removed so we removed only one user so we use indexing to get the first obj
		return users.splice(indexOfUser, 1)[0]; //TODO
	}
};

//GET USER
const getUser = (id) => {
	return users.find((user) => {
		return user.id === id;
	});
};

//GET USERS IN ROOM
const getUsersInRoom = (room) => {
	//filter
	return users.filter((user) => {
		return user.room === room;
	});
};

module.exports = {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
};
