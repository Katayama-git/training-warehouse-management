//get orderボタンを押したときの挙動
async function fetchOrders() {
  const orders = await fetch("http://localhost:8080/orders");
  if (!orders.ok) {
    throw new Error("Could not fetch orders");
  }
  const ordersJson = await orders.json();
  console.log(ordersJson);
  renderOrders(ordersJson);
}
//表の表示
function renderOrders(ordersJson) {
  const orders = document.getElementById("order-list");
  if (!orders) {
    throw new Error("Could not find orders element");
  }
  orders.innerHTML = "";
  const orderDiv = document.createElement("table");
  orderDiv.innerHTML =
    "<th>Order ID</th><th>Item ID</th><th>Order Name</th><th>Order Amount</th><th>Order Status</th><th>Order Date</th>";
  ordersJson.orders.forEach((order) => {
    orderDiv.innerHTML += `
    <tr>
      <td>${order.id}</td>
      <td>${order.itemId}</td>
      <td>${order.name}</td>
      <td>${order.amount}</td>
      <td>${order.orderStatus}</td>
      <td>${order.orderDate}</td>
    </th>
    `;
    orders.appendChild(orderDiv);
  });
}
//フォームに入力して送信ボタンを押したときの挙動
async function handleRegisterOrder(event) {
  /*
   * preventDefault() will stop the browser reloading the page
     preventDefault()は、ブラウザがページを再読み込みするのを阻止します。
   */
  event.preventDefault();
  const form = event.target.form;
  const formData = new FormData(form);
  const order = {
    itemId: formData.get("itemId"),
    name: formData.get("name"),
    amount: formData.get("amount"),
    orderStatus: formData.get("orderStatus"),
    orderDate: formData.get("orderDate"),
  };

  /*
   * see that we use POST method when fetch here to match what server is expecting
   * and we declare what data we are sending in the headers
   * in this case we are sending JSON data
   * ここでは、サーバーが期待しているものと一致させるために、
   * フェッチ時にPOSTメソッドを使用し、
   * ヘッダーで送信するデータを宣言しています
   * (この場合、JSONデータを送信していることがわかります)。
   */
  const response = await fetch("http://localhost:8080/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  if (!response.ok) {
    const error = await response.json();
    console.error(error);
    return;
  }

  /*
   * if the response is ok, we fetch the orders again
   *レスポンスがOKであれば、再度注文を取得します。
   */
  fetchOrders();
}
