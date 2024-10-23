const fs = require("fs");
const path = require("path");

module.exports = {
  name: "message",
  async execute(message, client) {
    if (message.channel.id == "1288668728015458388") {
      if (!message.embeds || message.embeds.length !== 1) {
        return false;
      }
      const embed = message.embeds[0];
      for (const embed of message.embeds) {
        if (!embed.description && typeof embed.description === 'string') {
          console.log(embed.description.toLowerCase().includes("Owned By: [km7dev".toLowerCase()))
        }
      }
    }
  }
}
