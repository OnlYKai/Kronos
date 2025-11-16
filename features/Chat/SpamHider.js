import config from "../../config"

const spam = [
    { message: "You were tipped by ${*} in the last minute!", config: "hideTippingMessages" },
    { message: "You tipped ${*} in ${*}!", config: "hideTippingMessages" },
    { message: "That player is not online, try another user!", config: "hideTippingMessages" },
    { message: "You already tipped everyone that has boosters active, so there isn't anybody to be tipped right now!", config: "hideTippingMessages" },
    { message: "No one has a network booster active right now! Try again later.", config: "hideTippingMessages" },
    { message: "You've already tipped someone in the past hour in ${*}! Wait a bit and try again!", config: "hideTippingMessages" },
    { message: "You've already tipped that person today in ${*}! Try another user!", config: "hideTippingMessages" }
]

spam.forEach(s => register("chat", (event) => { if (config[s.config]) cancel(event) }).setChatCriteria(s.message))