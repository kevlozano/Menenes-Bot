const API = require('call-of-duty-api')();

const login = async (email, password) => {
  try {
    await API.login(email, password);
  } catch (Error) {
    console.log(Error);
    return Error;
  };
}

const getBR = async (user) => {
  try {
    await login(process.env.loginEmail, process.env.loginPassword);
    const data = await API.MWBattleData(user.tag, user.net);
    console.log(data);
    return data;
  } catch (Error) {
    console.log(Error);
    return Error;
  }
}

const getWZMatches = async (user) => {
  try {
    await login(process.env.loginEmail, process.env.loginPassword);
    const res = await API.MWcombatwz(user.tag, user.net);
    const matches = res.matches;
    const data = [];
    for (let i = 0; i < 5; i++) {
      const { kills,
        deaths,
        headshots,
        assists,
        gulagDeaths,
        gulagKills,
        teamPlacement,
        damageDone,
        damageTaken,
      } = matches[i].playerStats;

      const el = {
        kills,
        deaths,
        headshots,
        assists,
        gulagDeaths,
        gulagKills,
        teamPlacement,
        damageDone,
        damageTaken,
      };

      data.push(el);
    }

    return data;
  } catch (Error) {
    console.log(Error);
  }
};

module.exports = { login, getBR, getWZMatches };