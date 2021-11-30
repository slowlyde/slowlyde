const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
  name: "music",
  description: "Complete music system",
  permission: "ADMINISTRATOR" ,
  options: [
    {
      name: "play",
      desciption: "Play a song.",
      type: "SUB_COMMAND",
      option: [{ name: "query", description: "provide a name or a url for the song", type: "STRING", required: true}]
    },
    {
      name: "volume",
      description: "Alter the volume",
      type: "SUB_COMMAND",
      options: [{ name: "percent", description: "10 = 10%", type: "NUMBER", required: true}]
    },
    {
      name: "settings",
      description: "select an option.",
      type: "SUB_COMMAND",
      options: [{ name: "options", description: "select an option.", type: "STRING", required: true,
       choices: [
        {name: "queue", value: "queue"},
        {name: "skip", value: "skip"},
        {name: "pause", value: "pasue"},
        {name: "resume", value: "resume"},
        {name: "stop", value: "stop"},
      ]}]
    }
  ],
  /**
   * 
   * @param {CommandInteraction}
   * @param {Client} client
   */
run: async (interaction, client) => {
    
    const { options, member, guild, channel } = interaction;
    const VoiceChannel = member.voice.channel

    if(!VoiceChannel)
    return interaction.followUp({content: "You must be in a voice channel to be able to use the music commands.", ephemeral: true});

    if(guild.me.voice.channelid && VoiceChannel.id !== guild.me.voice.channelid)
    return interaction.reply({content: `I'm already playing music in <#${guild.me.voice.channelid}>.`, ephemeral: true});

    try {
      switch(option.getSubcommand()) {
        case "play" :{
          client.distube.playVoiceChannel( VoiceChannel, options.getString("query"), { textChannel: channel, member: member });
          return interaction.followUp({content: "🎵 Request recieved."});

        }
        case "Volume" : {
          const Volume = options.getNumber("percent");
          if(Volume > 100 || Volume < 1)
          return interaction.followUp({content: "You have to specify a number betwwen 1 and 100"});
          client.distube.setVolume(VoiceChannel, Volume);
          return interaction.followUp({content: `🔊 volume has been set to \`${Volume}%\``});
        }
        case "settings" : {
          const queue = await Client.distube.getQueue(VoiceChannel);

          if(!queue)
          return interaction.followUp({content: "⛔ There is no queue."});

          switch(options.getString("options")) {
            case "skip" :
            await queue.skip(VoiceChannel);
            return interaction.followUp({content: "⏭️ Song has been skipped." })
            case "stop" :
            await queue.stop(VoiceChannel);
           return interaction.followUp({content: "⏹️ Music has been stooped." })
           case "pause" :
           await queue.pause(VoiceChannel);
           return interaction.followUp({content: "⏸️ song has been paused." })
           case "resume" :
           await queue.resume(VoiceChannel);
           return interaction.followUp({content: "⏯️ song has been resumed." })
           case "queue" :
           return interaction.followUp({embeds: [new MessageEmbed()
           .setColor("PURPLE")
           .setDescription(`${queue.songs.map(
             (song, id) => `\n**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``)}`
            )]});
           }
         return;
        }

      }
    } catch (e) {
      const erorEmbed = new MessageEmbed()
      .setColor("RED")
      .setDescription(`⛔ Alert: ${e}`)
      return interaction.followUp({embeds: [errorEmbed]});

      }

   }

}
