require("dotenv").config();
const {
  Client,
  Collection,
  Events,
  IntentsBitField,
  REST,
  Routes,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const { token, userId } = process.env;

const client = new Client({ intents: [
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.Guilds
] });

const eventFiles = fs
  .readdirSync(path.join(__dirname, "events"))
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(path.join(__dirname, "events", file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.commands = new Collection();
client.cms = new Collection();
const commands = [];

const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = path.join(__dirname, "commands", file);
  const command = require(filePath).slash;
  if (command && "data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  }
  const cm = require(filePath).context;
  if (cm && "data" in cm && "execute" in cm) {
    client.cms.set(cm.data.name, cm);
    commands.push(cm.data.toJSON());
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(Routes.applicationCommands(userId), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();

client.login(token);

const web = require("./panel.js")

module.exports = client;