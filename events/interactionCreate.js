const fs = require("fs");
const path = require("path");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
          console.error(
            `No command matching ${interaction.commandName} was found.`
          );
          return;
        }
        try {
          await command.execute(interaction, client);
        } catch (error) {
          console.error(error);
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
              content: "There was an error while executing this command!",
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: "There was an error while executing this command!",
              ephemeral: true,
            });
          }
        }
      } else if (interaction.isContextMenuCommand()) {
        const command = interaction.client.cms.get(interaction.commandName);
        if (!command) {
          console.error(
            `No command matching ${interaction.commandName} was found.`
          );
          return;
        }
        try {
          await command.execute(interaction, client);
        } catch (error) {
          console.error(error);
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
              content: "There was an error while executing this command!",
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: "There was an error while executing this command!",
              ephemeral: true,
            });
          }
        }
      }
  },
};
