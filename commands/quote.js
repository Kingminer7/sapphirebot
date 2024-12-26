const { SlashCommandBuilder, EmbedBuilder, InteractionContextType, ApplicationIntegrationType } = require("discord.js");

/*
DB should be setup like this:
id (int) primary, increment
message (string)
messageId (int)
senderId (int)
quoterId (int)
replyingToId (int)
mediaUrl (string) can be null
createdAt (timestamp)
*/

module.exports = {
  slash: {
    data: new SlashCommandBuilder()
      .setName("quote")
      .setDescription("Quotes")
      .addSubcommand((subcommand) =>
        subcommand
          .setName("get")
          .setDescription("Get a quote")
          .addStringOption((option) =>
            option
              .setName("name")
              .setDescription("The quote to get.")
              .setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("random")
          .setDescription("Get a random quote")
          .addUserOption((option) =>
            option
              .setName("user")
              .setDescription("The user to get a quote from.")
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("remove")
          .setDescription("Remove a quote")
          .addStringOption((option) =>
            option
              .setName("name")
              .setDescription("The quote to remove.")
              .setRequired(true)
          )
      )
      .setContexts([InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel])
      .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
    async execute(interaction, client) {
      await interaction.deferReply();

      const subcommand = interaction.options.getSubcommand();

      if (subcommand === "get") {
        if (interaction.options.getString("name") === "309") {
          const embed = new EmbedBuilder()
            .setTitle("309")
            .setDescription("kindly remove the developer role from yourself")
            .addFields(
              {
                name: " ",
                value: "\\- <@851210524254928907> to <@126110044625305600> in ⁠https://discord.com/channels/911701438269386882/911702535373475870/1208902801942650900 by <@369929907700105226>",
              }
            )
            .setColor("#201c24")
            .setFooter({ text: "02/18/2024 5:29 PM"});

          await interaction.editReply({
            embeds: [embed],
          });
        } else {
          await interaction.editReply("Not implemented yet.");
        }
      } else {
        await interaction.editReply("Not implemented yet.");
      }
    },
  },
};
