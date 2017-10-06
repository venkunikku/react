let list = [
    { title: "Rad Red"},
    { title: "Lawn"},
    { title: "Party Pink"}
]

export const displayList = ()=>console.log(...list)

export const createScream = logger => message => 
    logger(message.toUpperCase() + "!!!")
			
