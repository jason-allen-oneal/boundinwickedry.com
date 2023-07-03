class SessionStore {
  findSession(sid: string) {}
  saveSession(id: number, session: string) {}
  findAllSessions() {}
}

export default class InMemorySessionStore  extends SessionStore {
  sessions: Map<any, any>;
  
  constructor() {
    super();
    this.sessions = new Map();
  }
  
  findSession(sid: string) {
    return this.sessions.get(sid);
  }
  
  saveSession(id: number, session: string) {
    this.sessions.set(id, session);
  }
  
  findAllSessions() {
    const sess: any[] = [];
    
    this.sessions.forEach((v, k, m) => {
      sess.push(v);
    });
    
    return sess;
  }
}