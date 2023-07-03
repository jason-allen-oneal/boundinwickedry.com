type Room = {
  id: number;
  name: string;
  creator: number;
  date: Date;
};

type ChatUserKey = "id" | "name" | "avatar" | "socket" | "room";

interface IChatUser {
  [key: string]: number | string | Room;
}

type ChatUser = {
  id: number;
  name: string;
  avatar: string;
  socket: string;
  room: Room;
};

let users: ChatUser[] = [];

export function addUser(u: ChatUser) {
  const found = users.findIndex((e) => e.id == u.id);

  if (found !== -1) {
    return u;
  } else {
    users.push(u);
    return u;
  }
}

export function removeUser(sid: string) {
  let u = null;
  const index = users.findIndex((e) => e.socket == sid);
  if (index !== -1) {
    u = users[index];
    users = users.splice(index, 1);
  }
  return u;
}

export function getUserBySid(sid: string): ChatUser | undefined {
  return users.find((user) => user.socket === sid);
}

export function getUserById(id: number): ChatUser | undefined {
  return users.find((user) => user.id === id);
}

export function updateUser(sid: string, prop: string, value: number | string) {
  const index = users.findIndex((e) => e.socket == sid);
  if (index !== -1) {
    let u = users[index];
    (u as IChatUser)[prop as string] = value;
  }
}

export function getUsersInRoom(room: number): ChatUser[] {
  const u = users.filter((e) => e.room.id === room);
  return u;
}
