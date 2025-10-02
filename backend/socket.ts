import { Server as HttpServer } from "http";
import { Server as IOServer, Socket } from "socket.io";

let io: IOServer | null = null;

export const initSocket = (server: HttpServer): IOServer => {
    if (io) return io;
    io = new IOServer(server, {
        cors: { origin: "*", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket: Socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("joinFamily", (familyId: string) => {
        socket.join(`family:${familyId}`);
        });

        socket.on("leaveFamily", (familyId: string) => {
        socket.leave(`family:${familyId}`);
        });

        socket.on("disconnect", () => {
        // handle if needed
        });
    });

    return io;
};

export const getIO = (): IOServer => {
    if (!io) {
        throw new Error("Socket.io not initialized. Call initSocket(server) first.");
    }
    return io;
};