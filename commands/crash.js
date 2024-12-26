const { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType, ContextMenuCommandInteraction, InteractionContextType, ApplicationIntegrationType } = require("discord.js");
const fs = require("fs");
const https = require("https");
const { execFile } = require("child_process");
const path = require("path");

module.exports = {
  slash: {
    data: new SlashCommandBuilder()
      .setName("crash")
      .setDescription("my mod is crashing")
      .setContexts([InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel])
      .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
    async execute(interaction) {
      await interaction.reply("https://media.discordapp.net/attachments/979352389985390603/1159030798406647939/this_mod_is_crashing_I_will_not_give_crashlog.jpg?ex=65c3328c&is=65b0bd8c&hm=bbad96287a6d6144e6353e4851f7e52285802d7c5628f63bd196e8c383837b45&=&format=webp");
    },
  },
};