const table = document.getElementById('table');

axios
  .get('/api/data')
  .then(response => {
    console.log(response);
    let data = response.data;
    for (let i = 0; i < data.length; i++) {
      let row = table.insertRow(-1);
      let name = row.insertCell(0);
      let rarity = row.insertCell(1);
      let className = row.insertCell(2);
      let type = row.insertCell(3);
      let subtype = row.insertCell(4);
      let cost = row.insertCell(5);
      let attack = row.insertCell(6);
      let hp = row.insertCell(7);
      let effect = row.insertCell(8);
      name.innerHTML = data[i].name;
      rarity.innerHTML = data[i].rarity;
      className.innerHTML = data[i].class;
      type.innerHTML = data[i].type;
      subtype.innerHTML = data[i].subtype;
      cost.innerHTML = data[i].cost;
      attack.innerHTML = data[i].attack;
      hp.innerHTML = data[i].hp;
      effect.innerHTML = data[i].effect;
    }
  })
  .catch(err => {
    console.log(err);
  });
