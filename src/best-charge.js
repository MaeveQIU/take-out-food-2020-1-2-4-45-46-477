let items = loadAllItems();
let promotions = loadPromotions();

function bestCharge (selectedItems) {
  const allItems = getItems(selectedItems);
  const calculatePromotions = comparePromotions(allItems);
  const printPromotions = printResult(allItems, calculatePromotions);
  return printPromotions;
}

const getItems = (selectedItems) => {
  let newItems = [];
  selectedItems.forEach(element => {
    let arr = element.split(" x ");
    let obj = {};
    obj.id = arr[0];
    obj.count = arr[1];
    items.forEach(item => {
      if (obj.id === item.id) {
        obj.name = item.name;
        obj.totalPrice = obj.count * item.price;
      }
    });
    newItems.push(obj)
  });
  return newItems;
}

const calculateSum = (newItems) => {
  let sum = 0;
  newItems.forEach(element => {
    sum += element.totalPrice
  });
  return sum;
}

const comparePromotions = (newItems) => {
  let promotionsSummary = [];

  const firstPromotion = () => {
    let sumAfterPromotion = calculateSum(newItems);
    if (sumAfterPromotion >= 30) {
      sumAfterPromotion -= 6;
    }
    let discount = calculateSum(newItems) - sumAfterPromotion;
    promotionsSummary.push([sumAfterPromotion, promotions[0].type, discount]);
    return sumAfterPromotion;
  };

  const secondPromotion = () => {
    let initialSum = calculateSum(newItems);
    let itemsArr = [];
    newItems.forEach(element => {
      if (promotions[1].items.includes(element.id)) {
        itemsArr.push(element.name);
        element.totalPrice /= 2;
      }
    })
    let sumAfterPromotion = calculateSum(newItems);
    let discount = initialSum - sumAfterPromotion;
    newItems.forEach(element => {
      if (promotions[1].items.includes(element.id)) {
        element.totalPrice *= 2;
      }
    })

    promotionsSummary.push([sumAfterPromotion, promotions[1].type, discount, itemsArr]);
    return sumAfterPromotion;
  }

  if (firstPromotion() <= secondPromotion()) {
    return promotionsSummary[0];
  }
  else {
    return promotionsSummary[1];
  }
}

const printResult = (newItems, promotionsSummary) => {
  let string = `
============= 订餐明细 =============
${newItems.map(element => `${element.name} x ${element.count} = ${element.totalPrice}元`).join('\n')}`

string += `${promotionsSummary[2] === 0 ? `` : `
-----------------------------------
使用优惠:
${promotionsSummary[1]}${promotionsSummary.length === 3 ? ``: `(${promotionsSummary[3].join('，')})`}，省${promotionsSummary[2]}元`}
-----------------------------------
总计：${promotionsSummary[0]}元
===================================`
  return string;
}