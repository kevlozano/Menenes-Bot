function sendEmbed(data) {
  const f = [{
    name: 'Resumen',
    value: '\u200b',
  },
  {
    name: 'Kills',
    value: data.allKills,
  },
  {
    name: 'Deaths',
    value: data.allDeaths,
  },
  {
    name: 'Win?',
    value: data.win,
  }];

  const latest = data.matches.slice(0, 5);
  const win = latest.filter(el => el.teamPlacement === 1);
  const kills = latest.reduce((a, b) => {
    return (a) + Number(b.kills)
  }, 0);
  const deaths = latest.reduce((a, b) => {
    return (a) + Number(b.deaths)
  }, 0);

  const colors = ['FF5733', '33FF3C'];
  const exampleEmbed = {
    color: 0x0099ff,
    title: `Last matches for ${data.user.tag}`,
    author: {
      name: 'made by TIGRE_GORDO',
      icon_url: 'https://image.flaticon.com/icons/png/512/523/523505.png',
    },
    description: "```" + data.description + "```",
    thumbnail: {
      url: 'https://i2.wp.com/hipertextual.com/wp-content/uploads/2021/03/warzone-scaled.jpeg?fit=2560%2C1440&ssl=1',
    },
    fields: [
      {
        name: 'All Kills',
        value: kills,
      },
      {
        name: 'All Deaths',
        value: deaths,
      },
      {
        name: 'Win?',
        value: win.length > 0 ? 'Yes 👑' : 'No, perdedor',
      }
    ],
    footer: {
      text: 'Favor de molestar.',
    },
  };

  return exampleEmbed;
}

function sendTopEmbed(data) {
  console.log(data);
  data.sort((a,b) => a.wins > b.wins ? -1 : 1);
  let wins = '\n👑 Wins\n';
  let kd = '\n🔥 KD\n';
  let deaths = '\n💀 Deaths per game\n';
  let revives = '\n💉 Revives per game\n';
  data.map(el => {
      if (el) wins += `${el.user}: ${el.wins}\n`;
  });

  data.sort((a,b) => parseFloat(a.kD) > parseFloat(b.kD) ? -1 : 1);

  data.map(el => {
        if (el) kd += `${el.user}: ${el.kD}\n`;
  });

  data.sort((a,b) => a.deaths > b.deaths ? -1 : 1);

  data.map(el => {
        if (el) deaths += `${el.user}: ${el.deaths.toFixed(2)}\n`;
  });

  data.sort((a,b) => a.revives > b.revives ? -1 : 1);

  data.map(el => {
        if (el) revives += `${el.user}: ${el.revives.toFixed(2)}\n`;
  });
  const colors = ['FF5733', '33FF3C'];
  const exampleEmbed = {
    color: 0x0099ff,
    title: `Top Menenes`,
    author: {
      name: 'made by TIGRE_GORDO',
      icon_url: 'https://image.flaticon.com/icons/png/512/523/523505.png',
    },
    description: "```" + wins + kd + deaths + revives + "```",
    thumbnail: {
      url: 'https://i2.wp.com/hipertextual.com/wp-content/uploads/2021/03/warzone-scaled.jpeg?fit=2560%2C1440&ssl=1',
    },
    footer: {
      text: 'Favor de molestar.',
    },
  }

  return exampleEmbed;
}

module.exports = { sendEmbed, sendTopEmbed };