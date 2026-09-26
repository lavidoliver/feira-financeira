import { inicializeApp } from
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getDatabase } from 
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

const firebaseConfig = {
  apikey: "AlzaSyCik23azPVDkEC0klik8uyxjlClz6yqxk",
  authDomain: "feira-financeira.firebaseapp.com",
  databaseURL: "https://feira-financeira-default-rtdb.firebaseio.com",
  projectId: "feira-financeira",
  storageBucket: "feira-financeira.firebasestorage.app",
  messagingSenderId: "84836569612",
  appId: "1:84836569612:web:b2e04333c0e98f179ed429"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

console.log("Firebase conectado!", db);

let comandas = {};

const botaoSala1 =
document.querySelector("#sala1");
const telaInicio = 
document.querySelector("#inicio");
const telaComanda =
document.querySelector("#comanda");

botaoSala1.onclick = function() {
  telaInicio.style.display = "none";
  telaComanda.style.display = "block";
};

const botaoContinuar = 
document.querySelector("#continuar");
const campoNumero =
document.querySelector("#numero");
const areaProdutos =
document.querySelector("#produtos");
const numeroComanda =
document.querySelector("#numeroComanda");

botaoContinuar.onclick = function() {

  const numero = campoNumero.value;

  if (numero === "") {
    return;
  }

  if (!comandas[numero]) {
    comandas[numero] = {
      saldo: 3000,
      total: 0,
      gastos: 0,
      ganhos: 0,
      itens: []
    };
  }

  numeroComanda.textContent = numero;

  saldoAtual = comandas[numero].saldo;
  valorTotal = comandas[numero].total;

  saldo.textContent = saldoAtual.toFixed(2);
  total.textContent = valorTotal.toFixed(2);

  areaProdutos.style.display = "block"
};

const botaoAdicionar =
document.querySelector("#adicionar");
const campoAtividade =
document.querySelector("#atividade");
const campoValor =
document.querySelector("#valor");
const campoQuantidade =
document.querySelector("#quantidade");
const listaItens =
document.querySelector("#listaItens");
const total = document.querySelector("#total");
const saldo = document.querySelector("#saldo");

let valorTotal = 0;
let saldoAtual= 3000;

botaoAdicionar.onclick = function() {

  const atividade = campoAtividade.value.trim();
  const valor = Number(campoValor.value);
  const quantidade = Number(campoQuantidade.value);

  if (atividade==="") {
    alert("Digite o nome da atividade.");
    return;
  }

  if (valor<=0) {
    alert("Digite um valor válido.");
    return;
  }

  if  (quantidade <=0) {
    alert("Digite uma quantidade válida.");
    return;
  }

  const subtotal = valor * quantidade;

  valorTotal += subtotal;

  saldoAtual -= subtotal;

  comandas[campoNumero.value].saldo = saldoAtual;
  comandas[campoNumero.value].total = valorTotal;

  comandas[campoNumero.value].itens.push({
    atividade: atividade,
    quantidade: quantidade,
    subtotal: subtotal
  });

  saldo.textContent =saldoAtual.toFixed(2)

  listaItens.innerHTML += `
  <p>${atividade} - ${quantidade}x - R$ ${subtotal.toFixed(2)}</p>
  `;

  total.textContent = valorTotal.toFixed(2);

  campoAtividade.value = "";
  campoValor.value = "";
  campoQuantidade.value = 1;
};

const botaoSala2 =
document.querySelector("#sala2");
const telaSala2 =
document.querySelector("#sala2Tela");
const botaoBuscarSala2 =
document.querySelector("#buscarComandaSala2");
const campoNumeroSala2 =
document.querySelector("#numeroComandaSala2");
const numeroExibidoSala2 =
document.querySelector("#numeroExibidoSala2");
const itensSala2 =
document.querySelector("#itensSala2");
const mensagemSala2 = 
document.querySelector("#mensagemSala2");

botaoSala2.onclick = function() {
  telaInicio.style.display = "none";
  telaSala2.style.display = "block";
};

botaoBuscarSala2.onclick = function() {

  const numero = campoNumeroSala2.value;

  mensagemSala2.textContent = "";

  if (numero === "") {
    mensagemSala2.textContent = "Digite o número da comanda.";
    return;
  }

  if (!comandas[numero]) {
    mensagemSala2.textContent = "Essa comanda não existe.";
    return;
  }

  numeroExibidoSala2.textContent = numero;

  document.querySelector("#saldoSala2").textContent =
  comandas[numero].saldo.toFixed(2);

  document.querySelector("#totalSala2").textContent =
    (comandas[numero].ganhos||0).toFixed(2);

  const listaSala2 =
  document.querySelector("#listaItensSala2");

  listaSala2.innerHTML = "";

  if (comandas[numero].itens.length === 0) {
    listaSala2.innerHTML = "<p>Nenhum item adicionado.</p>";
  } else {
    comandas[numero].itens.forEach(function(item) {
      listaSala2.innerHTML += `
      <p>
      ${item.atividade} - ${item.quantidade}x - 
      R$ ${item.subtotal.toFixed(2)}
      </p>
      `;
    });
  }

  itensSala2.style.display = "block";
};

const botaoAdicionarSala2 =
document.querySelector("#adicionarSala2");
const campoAtividadeSala2 =
document.querySelector("#atividadeSala2");
const campoValorSala2 =
document.querySelector("#valorSala2");
const campoQuantidadeSala2 = 
document.querySelector("#quantidadeSala2");

botaoAdicionarSala2.onclick = function() {

  const numero =
  campoNumeroSala2.value;
  const atividade =
  campoAtividadeSala2.value.trim();
  const valor =
  Number(campoValorSala2.value);
  const quantidade =
  Number(campoQuantidadeSala2.value);

  if (atividade === "") {
    alert("Digite como você ganhou esse dinheiro.");
    return;
  }  

  if (valor <=0) {
    alert("Digite um valor válido.");
    return;
  }

  if (quantidade <=0) {
    alert("Digite uma quantidade válida.");
    return;
  }

  const subtotal = 
  valor * quantidade;

  if (!comandas[numero].ganhos) {
    comandas[numero].ganhos = 0;
  }

  comandas[numero].saldo += subtotal;

  comandas[numero].ganhos += subtotal;

  comandas[numero].itens.push({
    atividade: atividade,
    quantidade: quantidade,
    subtotal: subtotal,
    tipo: "ganho"
  });

  document.querySelector("#saldoSala2").textContent =
  comandas[numero].saldo.toFixed(2);

  document.querySelector("#totalSala2").textContent =
  comandas[numero].ganhos.toFixed(2);

  const listaSala2 =
  document.querySelector("#listaItensSala2");

  listaSala2.innerHTML = "";

  comandas[numero].itens.forEach(function (item) {

    listaSala2.innerHTML += `
    <p>
    ${item.atividade} - ${item.quantidade}x - 
    R$ ${item.subtotal.toFixed(2)}
    </p>
    `;

  });

  campoAtividadeSala2.value = "";
  campoValorSala2.value = "";
  campoQuantidadeSala2.value = 1;

};

const botaoSalvarComanda =
document.querySelector("#salvarComanda");

botaoSalvarComanda.onclick = function() {

  const numero = campoNumero.value;

  if (numero === "") {
    alert("Digite o número da comanda.");
    return;
  }

  comandas[numero] = {
    saldo: saldoAtual,
    total: valorTotal,
    itens: comandas[numero]?.itens||[]
  };

  alert("Comanda " + numero + " salva com sucesso!");

  telaComanda.style.display = "none";

  telaInicio.style.display = "block";

  campoNumero.value = "";
  campoAtividade.value = "";
  campoValor.value = "";
  campoQuantidade.value = 1;

  areaProdutos.style.display = "none";
  listaItens.innerHTML = "";
  total.textContent = "0.00"
  saldo.textContent = "3000.00"

  valorTotal = 0;
  saldoAtual = 3000;
};

const botaoSalvarSala2 =
document.querySelector("#salvarSala2");

botaoSalvarSala2.onclick = function() {
  
  const numero = 
  campoNumeroSala2.value;

  if(numero === "") {
    alert("Digite o número da comanda.");
    return;
  }

  alert("Comanda " + numero + " salva com sucesso!")

telaSala2.style.display = 
"none";

telaInicio.style.display =
"block";

campoNumeroSala2.value = ""; 

document.querySelector("#mensagemSala2").textContent = "";

document.querySelector("#itensSala2").style.display = "none";

document.querySelector("#listaItensSala2").innerHTML = "<p>Nenhum item adicionado.</p>"

document.querySelector("#saldoSala2").textContent = "0.00";

document.querySelector("#totalSala2").textContent = "0.00";

campoAtividadeSala2.value = "";
campoValorSala2.value = "";
campoQuantidadeSala2.value = 1;

}; 

console.log("Firebase conectado!");
