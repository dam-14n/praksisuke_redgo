fetch("http://localhost:80/api/items")
  .then(res => res.json())
  .then(data => {

    const items = [
      ...data.car,
      ...data.animal,
      ...data.goods
    ];

    items.forEach(item => {
      console.log(item.description);
    });

  });