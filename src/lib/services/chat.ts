import { prisma } from "../prisma";
import { normalize, normalizeName, getTime } from "../utils";

export type ChatMessage = {
  time: string;
  text: string;
  user: {
    id: number;
    name: string;
    avatar: string;
    socket: string;
  },
  channel: {
    id: number;
    name: string;
  },
  type: string;
};

export const getChannels = async () => {
  const rooms = await prisma.chatRooms.findMany();

  return rooms;
};

export const getUserChannel = async (id: number) => {
  const roomMsgs = await prisma.chatMessages.findMany({
    where: {
      roomId: id,
    },
    include: {
      ChatRooms: true,
      User: true,
    }
  });
  
  const data: ChatMessage[] = [];
  
  for(const msg of roomMsgs) {
    const obj: ChatMessage = {
      text: msg.message,
      time: getTime('since', msg.time) as string,
      user: {
        id: msg.User.id,
        name: msg.User.name,
        avatar: msg.User.avatar,
        socket: msg.User.socket,
      },
      channel: {
        id: msg.ChatRooms.id,
        name: msg.ChatRooms.name,
      },
      type: msg.type,
    };
    
    data.push(obj);
  }
  
  return data;
};

export const getMessagesByChannel = async (room: number) => {
  const r = await prisma.chatMessages.findMany({
    where: {
      roomId: room,
    }
  });
  
  if(r)
    return r;
  else
    return [];
};

export const storeMessage = async (data: any) => {
  const message = {
    roomId: data.roomId,
    authorId: data.authorId,
    message: data.message,
    recipientId: (data.recipientId) ? data.recipientId : 0,
    type: data.type,
  };

  try {
    const result = await prisma.chatMessages.create({
      data: message,
    });
    
    return result;
  } catch (err){
    console.log(err);
    return false;
  }
};