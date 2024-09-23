const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const https = require("https");
const { execFile } = require("child_process");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stackwalk")
    .setDescription("Walks the stack")
    .addAttachmentOption((option) =>
      option.setName("dump").setDescription("The dump file").setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName("sym1")
        .setDescription("The first symbol file")
        .setRequired(false)
    )
    .addAttachmentOption((option) =>
      option
        .setName("sym2")
        .setDescription("The second symbol file")
        .setRequired(false)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const dump = interaction.options.getAttachment("dump");
    const sym1 = interaction.options.getAttachment("sym1");
    const sym2 = interaction.options.getAttachment("sym2");

    const dir = `stackwalk-${dump.id}`;
    const logPath = `${dir}/${dump.name}.txt`;
    const dumpPath = `${dir}/${dump.name}`;
    const sym1Path = sym1 ? `${dir}/${sym1.name}` : "";
    const sym2Path = sym2 ? `${dir}/${sym2.name}` : "";

    const stackwalkPath = path.resolve(__dirname, "minidump-stackwalk");

    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      await interaction.followUp(`⬇️ Downloading dump ${dump.name}...`);

      await downloadFile(dump.url, dumpPath);
      if (sym1) await downloadFile(sym1.url, sym1Path);
      if (sym2) await downloadFile(sym2.url, sym2Path);

      await interaction.editReply(`🔥 Processing dump ${dump.name}...`);

      if (!fs.existsSync(stackwalkPath)) {
        throw new Error(`Executable not found: ${stackwalkPath}`);
      }

      const args = [
        `--output-file`,
        logPath,
        `--symbols-url`,
        `https://symbols.xyze.dev/`,
        dumpPath,
      ];

      if (sym1Path) args.push(sym1Path);
      if (sym2Path) args.push(sym2Path);

      const output = await execFilePromise(stackwalkPath, args);

      await interaction.editReply({
        content: "✅ Done! :3",
        files: [logPath],
      });
    } catch (error) {
      await interaction.editReply(`❌ Fail :<\n${error}`);
    } finally {
      // sleep for 2 seconds cuz im too lazy to write actual logic for waiting for the file to be available
      await new Promise((r) => setTimeout(r, 2000));
    }
  },
};

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

function execFilePromise(command, args) {
  return new Promise((resolve, reject) => {
    execFile(command, args, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}