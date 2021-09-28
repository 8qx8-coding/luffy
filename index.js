require("http").createServer((req, res) => res.end("UWU")).listen(process.env.PORT || 8080)
require("dotenv").config();
const { Client, Collection } = require("discord.js");
const UrlsConfig = require("./database/models/UrlsConfig");
const fetchProjects = require("./fetchProjects");
const { timeout, disable_fetching } = require("./config.json");
const { MessageMenuOption, MessageMenu } = require("discord-buttons")
const { GiveawaysManager } = require('discord-giveaways');
const readlineSync = require('readline-sync');
const { MessageEmbed } = require('discord.js')
const Discord = require('discord.js'); //Requiring Discord.js module.
const DiscordButtons = require('discord-buttons'); //Requiring Discord-BUttons module.


const button = require('discord-buttons');
const disbut = require("discord-buttons")
const { hangman } = require('reconlx')

const prefix = "l.";
const Nuggies = require('nuggies');
Nuggies.connect(process.env.MONGO_URI);
const client = new Client({
  disableEveryone: true,
});
disbut(client);

(async () => {
  await require("./database/connect")();

  let pros = await UrlsConfig.find();

  client.commands = new Collection();
  client.aliases = new Collection();
  client.projectsSize = 0;
  client.projects = pros.map((p) => p.projectURL);
  UrlsConfig.countDocuments({}, async (err, total) => {
    client.projectsSize = total;

    ["command", "events"].forEach((handler) => {
      require(`./handlers/${handler}`)(client);
    });

    await client.login(process.env.BOT_TOKEN);

    if (!disable_fetching) fetchProjects(client.projects, client);
  });
})();
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    embedColor: "#b9f2",
    reaction: "🎉"
  }
});

//create buttons

// pinging
setInterval(async () => {
  UrlsConfig.countDocuments({}, (err, total) => {
    client.projectsSize = total;
    client.user.setActivity(`version v3.0`, {
      type: "STREAMING",
    });
  });



  if (!disable_fetching) fetchProjects(client.projects, client);
}, timeout);

client.snipes = new Map();
client.on('messageDelete', function(message, channel){
client.snipes.set(message.channel.id,{
 content:message.content,
 author:message.author.tag,
 image:message.attachments.first() ? message.attachments.first().proxyURL : null
})
})



client.on('guildCreate', guild => {
    const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
 let embed = new MessageEmbed()
 .setColor('BLACK')
 .setTitle('Connected To New Server')
 .setURL('https://discord.gg/UbDNv4ZbKk')
 .setDescription('Thank You For Inviting Me. My prefix is `l.`. Run l.help for more info about me!')
 .setThumbnail('https://cdn.discordapp.com/attachments/890673169441112137/891858026330484797/fdfsfdsfsdfsd.png')
 .addFields(
 { name: 'Creator', value: '8qx8#9161' }
 )

 .setImage('https://cdn.discordapp.com/attachments/888637321329668113/889587603383394394/standard_8.gif')
 .setTimestamp()
 .setFooter('Luffy', 'https://discord.gg/UbDNv4ZbKk');
channel.send(embed);
}) 

client.on('guildCreate', async guild => {
  let owner = await client.users.fetch('756344279097409597')
  owner.send(new Discord.MessageEmbed()
  .setTitle("New Guild!")
  .setDescription(`I have been added to **${guild.name}** with **${guild.memberCount}** members`)
  .setColor("BLACK"))
} )                

