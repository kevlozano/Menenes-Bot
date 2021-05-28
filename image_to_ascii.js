

    let str = '';
        res.map(el => {
          str += `kills: ${el.kills}\ndeaths: ${el.deaths}\nheadshots: ${el.headshots}\nassists: ${el.assists}\ngulagDeaths: ${el.gulagDeaths}\ngulagWins: ${el.gulagKills}\nteamPlacement: ${el.teamPlacement}\ndamageDone: ${el.damageDone}\ndamageTaken: ${el.damageTaken}\n----------------------------\n`;
        });