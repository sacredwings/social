import { io } from "socket.io-client"

export function IO () {
    //const socket = io()
    const socket = io.connect();

    //socket.on('connect', () => {
        //console.log('Successfully connected!')
    //});

    function Message() {
        socket.on('MessageAdd', (e)=>{
            console.log(e)
        })
    }

    function Friend() {

        return false
    }

    return {
        socket,
        Message: Message,
        Friend: Friend
    }
}

/*
export default function () {
    const socket = io()

    io.on('connection', (client) => {
        // тут можно генерировать события для клиента
    });

    return socket
}*/



/*
export class IO {
    constructor( ) {
        let socket = io()
    }

    async MessageAdd (func) {
        try {
            io.on('connection', func)
        } catch (e) {
            return false
        }
    }

    /*
    async Connection(func) {
        try {
            io.on('connection', func)
        } catch (e) {
            return false
        }
    }
}*/