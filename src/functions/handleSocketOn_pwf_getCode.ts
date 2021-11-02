export function handleSocketOn_pwf_getCode(
    socket:any, 
    io: any, 
    pwfLobby: any
    ){
        // generate code untill you get unique code
        let code: string | null = getCode();
        if(!code) return

        //assign id of player to lobby so user can be found when other player searches for game
        pwfLobby[code] = socket.id

        //if room exists in 5 minuts delete it 
        //todo - notify user when room gets deleted 
        setTimeout(()=> {
            if(!code || !pwfLobby[code]) return
            delete pwfLobby[code]
        }, 1000 * 60 * 5)

        //send code back to user
        io.to(socket.id).emit('pwfCode', code);

        function getCode(){
            let code;
            let cycles: number = 0;
            //checks if index was assigned, if it is not used and if loop is not running for too long
            while(code === undefined || pwfLobby[code] || cycles < 100){
                code = Math.floor(Math.random()*10000) + ""
                cycles++
            }
            if(!code) return null
            return code
        }
    }


    