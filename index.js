const express = require('express');
const Discord = require('discord.js');
const DB = require("@replit/database");
const wz = require('./warzone.js');
const d = require('./discord_responses.js');
const fns = require('./functions');
fs = require('fs');
const db = new DB();
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`listening at http://localhost:${port}`));

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  if (msg.content.startsWith("!bot")) {
    if (msg.content.startsWith('!bot register')) {
      const res = await registerUser(msg.content, msg.author.username);
      msg.channel.send(res.msg);
    } else if (msg.content.startsWith('!bot recent')) {
      const a = msg.author.username === 'Samuel García' ? 'Samuel Garcia' : msg.author.username;
      try {
        const user = await db.get(a);
        let res = await wz.getWZMatches(user);
        let str = '';
        res.map(el => {
          str += `kills: ${el.kills}\ndeaths: ${el.deaths}\nheadshots: ${el.headshots}\nassists: ${el.assists}\ngulagDeaths: ${el.gulagDeaths}\ngulagWins: ${el.gulagKills}\nteamPlacement: ${el.teamPlacement}\ndamageDone: ${el.damageDone}\ndamageTaken: ${el.damageTaken}\n----------------------\n`;
        });
        const data = {
          'description': str,
          'user': user,
          'matches': res.slice(0, 5),
        };
        const embed = d.sendEmbed(data);
        msg.channel.send({ embed });
      } catch (error) {
        console.log('error: ', user);
        msg.channel.send(error);
        console.log(error);
      }
    } else if (msg.content.startsWith('!bot me')) {
      const user = await db.get(msg.author.username);
      if (user)
        msg.channel.send(`usuario: ${user.tag}\ntag: ${user.tag}\nmanco:${'yes'}`);
    } else if (msg.content.startsWith('!bot') && msg.content.includes('quien')) {
      const options = ['Keno', 'Rogi', 'Samuel', 'Omie', 'Dani P', 'Joel', 'Alex', 'Checo', 'Emma', 'Zak'];
      const n = Math.floor(Math.random() * (8 - 1)) + 1;
      msg.channel.send(`el ${options[n]}`);
    } else if (msg.content.startsWith('!bot top')) {
      console.log('in top');
      const allUsers = await db.list();
      console.log('got users');
      const asyncRes = await Promise.all(allUsers.map(async (user) => {
        if (user !== 'Samuel García') {
          try {
            const u = await db.get(user);
            const res = await wz.getBR(u);
            return {
              user,
              wins: res.br.wins,
              kD: res.br.kdRatio.toFixed(2),
              deaths: res.br.deaths / res.br.gamesPlayed,
              revives: res.br.revives / res.br.gamesPlayed,
            };
          } catch(error) {
            console.log(error);
          }
        };
      }));
      const embed = d.sendTopEmbed(asyncRes);
      msg.channel.send({ embed });
    } else if (msg.content.startsWith('!bot info')) {
      const a = msg.author.username === 'Samuel García' ? 'Samuel Garcia' : msg.author.username;
      const user = await db.get(a);
      console.log(user);
      if (user) {
        msg.channel.send('Obteniendo informacion.');
        try {
          const res = await wz.getBR(user);
          if (!res) {
            msg.channel.send('Algo esta mal en tu registro.');
          }
          const data = `
        wins: ${res.br.wins}\nKD: ${res.br.kdRatio.toFixed(2)}`
          msg.channel.send(data);
        } catch (error) {
          msg.channel.send('Algo salio mal, como en tu vida');
          console.log(error);
        }
      }
      else {
        msg.channel.send('No encontre tu usuario, pide ayuda a alguien inteligente.');
      }
    }
  } else if (msg.author.username === 'RogerGv') {
    const n = Math.floor(Math.random() * (100 - 5)) + 5;
    if (n > 95) {
      msg.channel.send('Otra vez Roger?');
    }
  }
});

async function registerUser(message, author) {
  console.log(author);
  const a = author === 'Samuel García' ? 'Samuel Garcia' : author;
  const elements = message.split(' ');
  const [, , tag, net] = elements;
  const res = {
    tag,
    net,
  };
  console.log(res);
  if (tag && net) {
    try {
      await db.set(a, res);
      const user = await db.get(author);
      return { status: true, msg: 'Registro exitoso' };
    } catch (err) {
      console.log(error);
      return { status: false, msg: 'Algo salio mal, como en tu vida' };
    }
  } else {
    return { status: false, msg: `Falta informacion. Ejemplo: register kev2106041 psn/xbl/battle` };
  }

};


client.login(process.env.DISCORD_TOKEN);